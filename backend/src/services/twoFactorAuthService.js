import mongoose from 'mongoose';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import logger from '../utils/logger.js';
import emailService from './emailService.js';
import twilioService from './twilioService.js';

// Two-Factor Auth Schema
const twoFactorAuthSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  method: {
    type: String,
    enum: ['totp', 'sms', 'email'],
    default: 'totp',
  },
  secret: {
    type: String,
    required: true,
  },
  backupCodes: [{
    code: String,
    used: {
      type: Boolean,
      default: false,
    },
    usedAt: Date,
  }],
  isEnabled: {
    type: Boolean,
    default: false,
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

const TwoFactorAuth = mongoose.model('TwoFactorAuth', twoFactorAuthSchema);

// OTP Storage Schema (for SMS/Email OTP)
const otpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['sms', 'email', 'login', 'verification'],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  verified: {
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

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model('OTP', otpSchema);

class TwoFactorAuthService {
  /**
   * Setup TOTP (Time-based One-Time Password)
   * @param {string} userId - User ID
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Secret and QR code
   */
  async setupTOTP(userId, tenantId) {
    try {
      const User = mongoose.model('User');
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Generate secret
      const secret = speakeasy.generateSecret({
        name: `EduManage Pro (${user.email})`,
        issuer: 'EduManage Pro',
      });

      // Check if 2FA already exists
      let twoFactorAuth = await TwoFactorAuth.findOne({ user: userId });

      if (twoFactorAuth) {
        twoFactorAuth.secret = secret.base32;
        twoFactorAuth.method = 'totp';
        twoFactorAuth.isEnabled = false;
      } else {
        twoFactorAuth = new TwoFactorAuth({
          user: userId,
          method: 'totp',
          secret: secret.base32,
          tenant: tenantId,
        });
      }

      // Generate backup codes
      twoFactorAuth.backupCodes = this.generateBackupCodes();

      await twoFactorAuth.save();

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

      logger.info(`TOTP setup initiated for user: ${userId}`);

      return {
        secret: secret.base32,
        qrCode: qrCodeUrl,
        backupCodes: twoFactorAuth.backupCodes.map(bc => bc.code),
      };
    } catch (error) {
      logger.error(`Error setting up TOTP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify and enable TOTP
   * @param {string} userId - User ID
   * @param {string} token - TOTP token
   * @param {string} tenantId - Tenant ID
   * @returns {boolean} Verification result
   */
  async verifyAndEnableTOTP(userId, token, tenantId) {
    try {
      const twoFactorAuth = await TwoFactorAuth.findOne({
        user: userId,
        tenant: tenantId,
      });

      if (!twoFactorAuth) {
        throw new Error('2FA not set up');
      }

      const verified = speakeasy.totp.verify({
        secret: twoFactorAuth.secret,
        encoding: 'base32',
        token,
        window: 2,
      });

      if (verified) {
        twoFactorAuth.isEnabled = true;
        twoFactorAuth.lastUsed = new Date();
        await twoFactorAuth.save();

        logger.info(`TOTP enabled for user: ${userId}`);
        return true;
      }

      return false;
    } catch (error) {
      logger.error(`Error verifying TOTP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify TOTP token
   * @param {string} userId - User ID
   * @param {string} token - TOTP token
   * @param {string} tenantId - Tenant ID
   * @returns {boolean} Verification result
   */
  async verifyTOTP(userId, token, tenantId) {
    try {
      const twoFactorAuth = await TwoFactorAuth.findOne({
        user: userId,
        tenant: tenantId,
        isEnabled: true,
      });

      if (!twoFactorAuth) {
        throw new Error('2FA not enabled');
      }

      // Check if it's a backup code
      const backupCode = twoFactorAuth.backupCodes.find(
        bc => bc.code === token && !bc.used
      );

      if (backupCode) {
        backupCode.used = true;
        backupCode.usedAt = new Date();
        twoFactorAuth.lastUsed = new Date();
        await twoFactorAuth.save();

        logger.info(`Backup code used for user: ${userId}`);
        return true;
      }

      // Verify TOTP token
      const verified = speakeasy.totp.verify({
        secret: twoFactorAuth.secret,
        encoding: 'base32',
        token,
        window: 2,
      });

      if (verified) {
        twoFactorAuth.lastUsed = new Date();
        await twoFactorAuth.save();
      }

      return verified;
    } catch (error) {
      logger.error(`Error verifying TOTP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate and send SMS OTP
   * @param {string} userId - User ID
   * @param {string} phoneNumber - Phone number
   * @param {string} tenantId - Tenant ID
   * @returns {boolean} Success status
   */
  async sendSMSOTP(userId, phoneNumber, tenantId) {
    try {
      if (!phoneNumber) {
        throw new Error('Phone number is required for SMS OTP');
      }

      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await OTP.create({
        user: userId,
        otp,
        type: 'sms',
        expiresAt,
        tenant: tenantId,
      });

      const smsMessage = `Your EduManage Pro verification code is: ${otp}. It expires in 10 minutes.`;
      const smsResponse = await twilioService.sendSMS(phoneNumber, smsMessage);

      if (!smsResponse.success) {
        logger.warn(`SMS OTP could not be delivered for user ${userId}: ${smsResponse.error || 'SMS service unavailable'}`);
      } else {
        logger.info(`SMS OTP sent for user ${userId}: ${smsResponse.messageId}`);
      }

      return true;
    } catch (error) {
      logger.error(`Error sending SMS OTP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate and send Email OTP
   * @param {string} userId - User ID
   * @param {string} email - Email address
   * @param {string} tenantId - Tenant ID
   * @returns {boolean} Success status
   */
  async sendEmailOTP(userId, email, tenantId) {
    try {
      if (!email) {
        throw new Error('Email address is required for sending OTP');
      }

      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await OTP.create({
        user: userId,
        otp,
        type: 'email',
        expiresAt,
        tenant: tenantId,
      });

      // Send email
      await emailService.sendEmail({
        to: email,
        subject: 'Your Verification Code',
        template: 'otp',
        data: {
          otp,
          expiresIn: '10 minutes',
        },
      });

      logger.info(`Email OTP sent to user: ${userId}`);
      return true;
    } catch (error) {
      logger.error(`Error sending Email OTP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify OTP (SMS/Email)
   * @param {string} userId - User ID
   * @param {string} otp - OTP code
   * @param {string} type - OTP type
   * @param {string} tenantId - Tenant ID
   * @returns {boolean} Verification result
   */
  async verifyOTP(userId, otp, type, tenantId) {
    try {
      const otpRecord = await OTP.findOne({
        user: userId,
        otp,
        type,
        tenant: tenantId,
        verified: false,
        expiresAt: { $gt: new Date() },
      });

      if (!otpRecord) {
        throw new Error('Invalid or expired OTP');
      }

      if (otpRecord.attempts >= 5) {
        throw new Error('Maximum verification attempts exceeded');
      }

      otpRecord.attempts += 1;

      if (otpRecord.otp === otp) {
        otpRecord.verified = true;
        await otpRecord.save();

        logger.info(`OTP verified for user: ${userId}`);
        return true;
      }

      await otpRecord.save();
      return false;
    } catch (error) {
      logger.error(`Error verifying OTP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Disable 2FA
   * @param {string} userId - User ID
   * @param {string} tenantId - Tenant ID
   * @returns {boolean} Success status
   */
  async disable2FA(userId, tenantId) {
    try {
      const result = await TwoFactorAuth.findOneAndUpdate(
        { user: userId, tenant: tenantId },
        { isEnabled: false },
        { new: true }
      );

      if (!result) {
        throw new Error('2FA not found');
      }

      logger.info(`2FA disabled for user: ${userId}`);
      return true;
    } catch (error) {
      logger.error(`Error disabling 2FA: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get 2FA status
   * @param {string} userId - User ID
   * @param {string} tenantId - Tenant ID
   * @returns {Object} 2FA status
   */
  async get2FAStatus(userId, tenantId) {
    try {
      const twoFactorAuth = await TwoFactorAuth.findOne({
        user: userId,
        tenant: tenantId,
      });

      if (!twoFactorAuth) {
        return {
          enabled: false,
          method: null,
        };
      }

      return {
        enabled: twoFactorAuth.isEnabled,
        method: twoFactorAuth.method,
        lastUsed: twoFactorAuth.lastUsed,
        backupCodesRemaining: twoFactorAuth.backupCodes.filter(bc => !bc.used).length,
      };
    } catch (error) {
      logger.error(`Error getting 2FA status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Regenerate backup codes
   * @param {string} userId - User ID
   * @param {string} tenantId - Tenant ID
   * @returns {Array} New backup codes
   */
  async regenerateBackupCodes(userId, tenantId) {
    try {
      const twoFactorAuth = await TwoFactorAuth.findOne({
        user: userId,
        tenant: tenantId,
      });

      if (!twoFactorAuth) {
        throw new Error('2FA not set up');
      }

      twoFactorAuth.backupCodes = this.generateBackupCodes();
      await twoFactorAuth.save();

      logger.info(`Backup codes regenerated for user: ${userId}`);
      return twoFactorAuth.backupCodes.map(bc => bc.code);
    } catch (error) {
      logger.error(`Error regenerating backup codes: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate OTP
   * @returns {string} OTP
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generate backup codes
   * @returns {Array} Backup codes
   */
  generateBackupCodes() {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push({
        code: crypto.randomBytes(4).toString('hex').toUpperCase(),
        used: false,
      });
    }
    return codes;
  }
}

export default new TwoFactorAuthService();
