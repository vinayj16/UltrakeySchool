import mongoose from 'mongoose';
import crypto from 'crypto';
import logger from '../utils/logger.js';

// Biometric Credential Schema
const biometricCredentialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['fingerprint', 'face_id', 'touch_id', 'webauthn'],
    required: true,
  },
  credentialId: {
    type: String,
    required: true,
    unique: true,
  },
  publicKey: {
    type: String,
    required: true,
  },
  counter: {
    type: Number,
    default: 0,
  },
  deviceInfo: {
    deviceId: String,
    deviceName: String,
    platform: String,
    osVersion: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastUsed: Date,
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true,
  },
}, {
  timestamps: true,
});

const BiometricCredential = mongoose.model('BiometricCredential', biometricCredentialSchema);

// Biometric Challenge Schema (for authentication flow)
const biometricChallengeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  challenge: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true,
  },
}, {
  timestamps: true,
});

biometricChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const BiometricChallenge = mongoose.model('BiometricChallenge', biometricChallengeSchema);

class BiometricAuthService {
  /**
   * Register biometric credential
   * @param {string} userId - User ID
   * @param {Object} credentialData - Credential data
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Registered credential
   */
  async registerCredential(userId, credentialData, tenantId) {
    try {
      const {
        type,
        credentialId,
        publicKey,
        deviceInfo,
      } = credentialData;

      // Check if credential already exists
      const existing = await BiometricCredential.findOne({
        credentialId,
      });

      if (existing) {
        throw new Error('Credential already registered');
      }

      const credential = new BiometricCredential({
        user: userId,
        type,
        credentialId,
        publicKey,
        deviceInfo,
        tenant: tenantId,
      });

      await credential.save();

      logger.info(`Biometric credential registered: ${type} for user ${userId}`);
      return credential;
    } catch (error) {
      logger.error(`Error registering biometric credential: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate authentication challenge
   * @param {string} userId - User ID
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Challenge data
   */
  async generateChallenge(userId, tenantId) {
    try {
      // Generate random challenge
      const challenge = crypto.randomBytes(32).toString('base64');
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      await BiometricChallenge.create({
        user: userId,
        challenge,
        expiresAt,
        tenant: tenantId,
      });

      // Get user's registered credentials
      const credentials = await BiometricCredential.find({
        user: userId,
        tenant: tenantId,
        isActive: true,
      }).select('credentialId type deviceInfo');

      logger.info(`Challenge generated for user: ${userId}`);

      return {
        challenge,
        credentials: credentials.map(c => ({
          id: c.credentialId,
          type: c.type,
          deviceInfo: c.deviceInfo,
        })),
      };
    } catch (error) {
      logger.error(`Error generating challenge: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify biometric authentication
   * @param {string} userId - User ID
   * @param {Object} authData - Authentication data
   * @param {string} tenantId - Tenant ID
   * @returns {boolean} Verification result
   */
  async verifyAuthentication(userId, authData, tenantId) {
    try {
      const {
        credentialId,
        challenge,
        signature,
        authenticatorData,
      } = authData;

      // Verify challenge
      const challengeRecord = await BiometricChallenge.findOne({
        user: userId,
        challenge,
        tenant: tenantId,
        used: false,
        expiresAt: { $gt: new Date() },
      });

      if (!challengeRecord) {
        throw new Error('Invalid or expired challenge');
      }

      // Get credential
      const credential = await BiometricCredential.findOne({
        user: userId,
        credentialId,
        tenant: tenantId,
        isActive: true,
      });

      if (!credential) {
        throw new Error('Credential not found');
      }

      // Verify signature (simplified - in production use proper WebAuthn verification)
      const verified = this.verifySignature(
        credential.publicKey,
        challenge,
        signature,
        authenticatorData
      );

      if (verified) {
        // Mark challenge as used
        challengeRecord.used = true;
        await challengeRecord.save();

        // Update credential
        credential.counter += 1;
        credential.lastUsed = new Date();
        await credential.save();

        logger.info(`Biometric authentication successful for user: ${userId}`);
        return true;
      }

      return false;
    } catch (error) {
      logger.error(`Error verifying biometric authentication: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify signature (simplified implementation)
   * @param {string} publicKey - Public key
   * @param {string} challenge - Challenge
   * @param {string} signature - Signature
   * @param {string} authenticatorData - Authenticator data
   * @returns {boolean} Verification result
   */
  verifySignature(publicKey, challenge, signature, authenticatorData) {
    try {
      // In production, implement proper WebAuthn signature verification
      // This is a simplified version for demonstration
      
      const verifier = crypto.createVerify('SHA256');
      verifier.update(Buffer.from(authenticatorData, 'base64'));
      verifier.update(Buffer.from(challenge, 'base64'));
      
      const publicKeyBuffer = Buffer.from(publicKey, 'base64');
      const signatureBuffer = Buffer.from(signature, 'base64');
      
      return verifier.verify(
        {
          key: publicKeyBuffer,
          format: 'der',
          type: 'spki',
        },
        signatureBuffer
      );
    } catch (error) {
      logger.error(`Error verifying signature: ${error.message}`);
      return false;
    }
  }

  /**
   * Get user credentials
   * @param {string} userId - User ID
   * @param {string} tenantId - Tenant ID
   * @returns {Array} User credentials
   */
  async getUserCredentials(userId, tenantId) {
    try {
      const credentials = await BiometricCredential.find({
        user: userId,
        tenant: tenantId,
      }).select('-publicKey');

      return credentials;
    } catch (error) {
      logger.error(`Error getting user credentials: ${error.message}`);
      throw error;
    }
  }

  /**
   * Revoke credential
   * @param {string} userId - User ID
   * @param {string} credentialId - Credential ID
   * @param {string} tenantId - Tenant ID
   * @returns {boolean} Success status
   */
  async revokeCredential(userId, credentialId, tenantId) {
    try {
      const credential = await BiometricCredential.findOneAndUpdate(
        {
          user: userId,
          credentialId,
          tenant: tenantId,
        },
        { isActive: false },
        { new: true }
      );

      if (!credential) {
        throw new Error('Credential not found');
      }

      logger.info(`Credential revoked: ${credentialId} for user ${userId}`);
      return true;
    } catch (error) {
      logger.error(`Error revoking credential: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete credential
   * @param {string} userId - User ID
   * @param {string} credentialId - Credential ID
   * @param {string} tenantId - Tenant ID
   * @returns {boolean} Success status
   */
  async deleteCredential(userId, credentialId, tenantId) {
    try {
      const result = await BiometricCredential.findOneAndDelete({
        user: userId,
        credentialId,
        tenant: tenantId,
      });

      if (!result) {
        throw new Error('Credential not found');
      }

      logger.info(`Credential deleted: ${credentialId} for user ${userId}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting credential: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get biometric statistics
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Statistics
   */
  async getStatistics(tenantId) {
    try {
      const credentials = await BiometricCredential.find({ tenant: tenantId });

      const stats = {
        total: credentials.length,
        active: credentials.filter(c => c.isActive).length,
        inactive: credentials.filter(c => !c.isActive).length,
        byType: {},
        byPlatform: {},
      };

      credentials.forEach(c => {
        stats.byType[c.type] = (stats.byType[c.type] || 0) + 1;
        if (c.deviceInfo?.platform) {
          stats.byPlatform[c.deviceInfo.platform] = 
            (stats.byPlatform[c.deviceInfo.platform] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      logger.error(`Error getting biometric statistics: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate device for biometric registration
   * @param {Object} deviceInfo - Device information
   * @returns {boolean} Validation result
   */
  validateDevice(deviceInfo) {
    const supportedPlatforms = ['iOS', 'Android', 'Windows', 'macOS'];
    
    if (!deviceInfo.platform || !supportedPlatforms.includes(deviceInfo.platform)) {
      return false;
    }

    // Add more validation logic as needed
    return true;
  }
}

export default new BiometricAuthService();
