import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';

class BiometricService {
  /**
   * Register biometric data for a user
   */
  async registerBiometric(userId, biometricData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Store biometric template (in production, use secure biometric SDK)
      const biometricHash = this.hashBiometricData(biometricData.template);

      if (!user.biometricData) {
        user.biometricData = {};
      }

      user.biometricData = {
        fingerprintHash: biometricHash,
        deviceId: biometricData.deviceId,
        registeredAt: new Date(),
        isActive: true,
      };

      await user.save();

      logger.info('Biometric data registered', { userId });
      return {
        success: true,
        message: 'Biometric data registered successfully',
      };
    } catch (error) {
      logger.error('Failed to register biometric', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Verify biometric and mark attendance
   */
  async verifyBiometricAttendance(biometricData, deviceId, schoolId) {
    try {
      const biometricHash = this.hashBiometricData(biometricData.template);

      // Find user by biometric hash
      const user = await User.findOne({
        'biometricData.fingerprintHash': biometricHash,
        'biometricData.isActive': true,
        schoolId,
      });

      if (!user) {
        throw new Error('Biometric not recognized');
      }

      // Verify device
      if (user.biometricData.deviceId !== deviceId) {
        logger.warn('Device mismatch for biometric', { userId: user._id, deviceId });
      }

      // Mark attendance
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let attendance = await Attendance.findOne({
        userId: user._id,
        schoolId,
        date: today,
      });

      const now = new Date();

      if (!attendance) {
        // Create new attendance record
        attendance = new Attendance({
          schoolId,
          userId: user._id,
          userType: user.role,
          date: today,
          status: 'present',
          checkInTime: now,
          method: 'biometric',
          biometricData: {
            deviceId,
            fingerprintId: biometricData.fingerprintId,
            timestamp: now,
            verified: true,
          },
        });
      } else {
        // Update check-out time
        attendance.checkOutTime = now;
        attendance.biometricData = {
          deviceId,
          fingerprintId: biometricData.fingerprintId,
          timestamp: now,
          verified: true,
        };
      }

      await attendance.save();

      logger.info('Biometric attendance marked', { userId: user._id, attendanceId: attendance._id });

      return {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
        },
        attendance: {
          id: attendance._id,
          status: attendance.status,
          checkInTime: attendance.checkInTime,
          checkOutTime: attendance.checkOutTime,
        },
      };
    } catch (error) {
      logger.error('Biometric verification failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Hash biometric data for secure storage
   */
  hashBiometricData(template) {
    return crypto
      .createHash('sha256')
      .update(template)
      .digest('hex');
  }

  /**
   * Get biometric devices
   */
  async getDevices(schoolId) {
    try {
      // In production, this would query actual biometric devices
      // For now, return registered devices from users
      const users = await User.find({
        schoolId,
        'biometricData.isActive': true,
      }).select('biometricData.deviceId');

      const devices = [...new Set(users.map(u => u.biometricData?.deviceId).filter(Boolean))];

      return devices.map(deviceId => ({
        deviceId,
        status: 'active',
        type: 'fingerprint',
      }));
    } catch (error) {
      logger.error('Failed to get devices', { error: error.message });
      throw error;
    }
  }

  /**
   * Deactivate biometric for user
   */
  async deactivateBiometric(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.biometricData) {
        user.biometricData.isActive = false;
      }

      await user.save();

      logger.info('Biometric deactivated', { userId });
      return {
        success: true,
        message: 'Biometric deactivated successfully',
      };
    } catch (error) {
      logger.error('Failed to deactivate biometric', { userId, error: error.message });
      throw error;
    }
  }
}

export default new BiometricService();
