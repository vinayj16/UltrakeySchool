import twoFactorAuthService from '../services/twoFactorAuthService.js';
import { successResponse, createdResponse, errorResponse, validationErrorResponse, notFoundResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

// Validation constants
const VALID_OTP_TYPES = ['sms', 'email', 'totp', 'backup'];
const VALID_2FA_METHODS = ['totp', 'sms', 'email'];
const OTP_LENGTH = 6;
const BACKUP_CODE_LENGTH = 8;
const MAX_PHONE_LENGTH = 20;

// Helper function to validate MongoDB ObjectId
const validateObjectId = (id, fieldName = 'ID') => {
  if (!id) {
    return fieldName + ' is required';
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return 'Invalid ' + fieldName + ' format';
  }
  return null;
};

// Helper function to validate email
const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

// Helper function to validate phone number
const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  const phonePattern = /^\+?[1-9]\d{1,14}$/;
  if (!phonePattern.test(phone) || phone.length > MAX_PHONE_LENGTH) {
    return 'Invalid phone number format';
  }
  return null;
};

class TwoFactorAuthController {
  async setupTOTP(req, res) {
    try {
      logger.info('Setting up TOTP for user');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const result = await twoFactorAuthService.setupTOTP(userId, institution);
      
      logger.info('TOTP setup initiated successfully:', { userId });
      return successResponse(res, result, 'TOTP setup initiated. Scan QR code with authenticator app');
    } catch (error) {
      logger.error('Error setting up TOTP:', error);
      return errorResponse(res, error.message);
    }
  }

  async verifyAndEnableTOTP(req, res) {
    try {
      logger.info('Verifying and enabling TOTP');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      const { token } = req.body;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (!token || token.trim().length === 0) {
        errors.push('Verification token is required');
      } else if (token.length !== OTP_LENGTH) {
        errors.push('Token must be ' + OTP_LENGTH + ' digits');
      } else if (!/^\d+$/.test(token)) {
        errors.push('Token must contain only digits');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const verified = await twoFactorAuthService.verifyAndEnableTOTP(userId, token, institution);
      
      if (verified) {
        logger.info('TOTP enabled successfully:', { userId });
        return successResponse(res, null, '2FA enabled successfully');
      } else {
        logger.warn('Invalid TOTP verification code:', { userId });
        return errorResponse(res, 'Invalid verification code', 400);
      }
    } catch (error) {
      logger.error('Error verifying TOTP:', error);
      return errorResponse(res, error.message);
    }
  }

  async verifyTOTP(req, res) {
    try {
      logger.info('Verifying TOTP');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      const { token } = req.body;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (!token || token.trim().length === 0) {
        errors.push('Verification token is required');
      } else if (token.length !== OTP_LENGTH) {
        errors.push('Token must be ' + OTP_LENGTH + ' digits');
      } else if (!/^\d+$/.test(token)) {
        errors.push('Token must contain only digits');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const verified = await twoFactorAuthService.verifyTOTP(userId, token, institution);
      
      if (verified) {
        logger.info('TOTP verified successfully:', { userId });
        return successResponse(res, null, 'Verification successful');
      } else {
        logger.warn('Invalid TOTP code:', { userId });
        return errorResponse(res, 'Invalid verification code', 400);
      }
    } catch (error) {
      logger.error('Error verifying TOTP:', error);
      return errorResponse(res, error.message);
    }
  }

  async sendSMSOTP(req, res) {
    try {
      logger.info('Sending SMS OTP');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      const { phoneNumber } = req.body;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      const phoneError = validatePhone(phoneNumber);
      if (phoneError) errors.push(phoneError);
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      await twoFactorAuthService.sendSMSOTP(userId, phoneNumber, institution);
      
      logger.info('SMS OTP sent successfully:', { userId });
      return successResponse(res, null, 'OTP sent to your phone');
    } catch (error) {
      logger.error('Error sending SMS OTP:', error);
      return errorResponse(res, error.message);
    }
  }

  async sendEmailOTP(req, res) {
    try {
      logger.info('Sending Email OTP');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      const { email } = req.body;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      const emailError = validateEmail(email);
      if (emailError) errors.push(emailError);
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      await twoFactorAuthService.sendEmailOTP(userId, email, institution);
      
      logger.info('Email OTP sent successfully:', { userId });
      return successResponse(res, null, 'OTP sent to your email');
    } catch (error) {
      logger.error('Error sending Email OTP:', error);
      return errorResponse(res, error.message);
    }
  }

  async verifyOTP(req, res) {
    try {
      logger.info('Verifying OTP');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      const { otp, type } = req.body;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (!otp || otp.trim().length === 0) {
        errors.push('OTP is required');
      } else if (otp.length !== OTP_LENGTH) {
        errors.push('OTP must be ' + OTP_LENGTH + ' digits');
      } else if (!/^\d+$/.test(otp)) {
        errors.push('OTP must contain only digits');
      }
      
      if (!type) {
        errors.push('OTP type is required');
      } else if (!VALID_OTP_TYPES.includes(type)) {
        errors.push('Invalid OTP type. Must be one of: ' + VALID_OTP_TYPES.join(', '));
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const verified = await twoFactorAuthService.verifyOTP(userId, otp, type, institution);
      
      if (verified) {
        logger.info('OTP verified successfully:', { userId, type });
        return successResponse(res, null, 'OTP verified successfully');
      } else {
        logger.warn('Invalid OTP:', { userId, type });
        return errorResponse(res, 'Invalid OTP', 400);
      }
    } catch (error) {
      logger.error('Error verifying OTP:', error);
      return errorResponse(res, error.message);
    }
  }

  async disable2FA(req, res) {
    try {
      logger.info('Disabling 2FA');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      const { password } = req.body;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (!password || password.trim().length === 0) {
        errors.push('Password is required to disable 2FA');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      await twoFactorAuthService.disable2FA(userId, institution, password);
      
      logger.info('2FA disabled successfully:', { userId });
      return successResponse(res, null, '2FA disabled successfully');
    } catch (error) {
      logger.error('Error disabling 2FA:', error);
      return errorResponse(res, error.message);
    }
  }

  async get2FAStatus(req, res) {
    try {
      logger.info('Fetching 2FA status');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const status = await twoFactorAuthService.get2FAStatus(userId, institution);
      
      logger.info('2FA status fetched successfully:', { userId });
      return successResponse(res, status, '2FA status retrieved successfully');
    } catch (error) {
      logger.error('Error getting 2FA status:', error);
      return errorResponse(res, error.message);
    }
  }

  async regenerateBackupCodes(req, res) {
    try {
      logger.info('Regenerating backup codes');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const codes = await twoFactorAuthService.regenerateBackupCodes(userId, institution);
      
      logger.info('Backup codes regenerated successfully:', { userId });
      return successResponse(res, { backupCodes: codes }, 'Backup codes regenerated successfully');
    } catch (error) {
      logger.error('Error regenerating backup codes:', error);
      return errorResponse(res, error.message);
    }
  }

  async verifyBackupCode(req, res) {
    try {
      logger.info('Verifying backup code');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      const { backupCode } = req.body;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (!backupCode || backupCode.trim().length === 0) {
        errors.push('Backup code is required');
      } else if (backupCode.length !== BACKUP_CODE_LENGTH) {
        errors.push('Backup code must be ' + BACKUP_CODE_LENGTH + ' characters');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const verified = await twoFactorAuthService.verifyBackupCode(userId, backupCode, institution);
      
      if (verified) {
        logger.info('Backup code verified successfully:', { userId });
        return successResponse(res, null, 'Backup code verified successfully');
      } else {
        logger.warn('Invalid backup code:', { userId });
        return errorResponse(res, 'Invalid backup code', 400);
      }
    } catch (error) {
      logger.error('Error verifying backup code:', error);
      return errorResponse(res, error.message);
    }
  }

  async change2FAMethod(req, res) {
    try {
      logger.info('Changing 2FA method');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      const { method, phoneNumber, email } = req.body;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (!method) {
        errors.push('2FA method is required');
      } else if (!VALID_2FA_METHODS.includes(method)) {
        errors.push('Invalid 2FA method. Must be one of: ' + VALID_2FA_METHODS.join(', '));
      }
      
      if (method === 'sms' && phoneNumber) {
        const phoneError = validatePhone(phoneNumber);
        if (phoneError) errors.push(phoneError);
      }
      
      if (method === 'email' && email) {
        const emailError = validateEmail(email);
        if (emailError) errors.push(emailError);
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const result = await twoFactorAuthService.change2FAMethod(userId, method, institution, { phoneNumber, email });
      
      logger.info('2FA method changed successfully:', { userId, method });
      return successResponse(res, result, '2FA method changed successfully');
    } catch (error) {
      logger.error('Error changing 2FA method:', error);
      return errorResponse(res, error.message);
    }
  }

  async get2FAHistory(req, res) {
    try {
      logger.info('Fetching 2FA history');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      const { page, limit } = req.query;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 20;
      
      if (pageNum < 1) {
        errors.push('Page must be greater than 0');
      }
      
      if (limitNum < 1 || limitNum > 100) {
        errors.push('Limit must be between 1 and 100');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const result = await twoFactorAuthService.get2FAHistory(userId, institution, {
        page: pageNum,
        limit: limitNum
      });
      
      logger.info('2FA history fetched successfully:', { userId });
      return successResponse(res, result, '2FA history retrieved successfully');
    } catch (error) {
      logger.error('Error fetching 2FA history:', error);
      return errorResponse(res, error.message);
    }
  }

  async getTrustedDevices(req, res) {
    try {
      logger.info('Fetching trusted devices');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const devices = await twoFactorAuthService.getTrustedDevices(userId, institution);
      
      logger.info('Trusted devices fetched successfully:', { userId });
      return successResponse(res, devices, 'Trusted devices retrieved successfully');
    } catch (error) {
      logger.error('Error fetching trusted devices:', error);
      return errorResponse(res, error.message);
    }
  }

  async removeTrustedDevice(req, res) {
    try {
      logger.info('Removing trusted device');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      const { deviceId } = req.params;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      const deviceIdError = validateObjectId(deviceId, 'Device ID');
      if (deviceIdError) errors.push(deviceIdError);
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      await twoFactorAuthService.removeTrustedDevice(userId, deviceId, institution);
      
      logger.info('Trusted device removed successfully:', { userId, deviceId });
      return successResponse(res, null, 'Trusted device removed successfully');
    } catch (error) {
      logger.error('Error removing trusted device:', error);
      return errorResponse(res, error.message);
    }
  }

  async removeAllTrustedDevices(req, res) {
    try {
      logger.info('Removing all trusted devices');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      await twoFactorAuthService.removeAllTrustedDevices(userId, institution);
      
      logger.info('All trusted devices removed successfully:', { userId });
      return successResponse(res, null, 'All trusted devices removed successfully');
    } catch (error) {
      logger.error('Error removing all trusted devices:', error);
      return errorResponse(res, error.message);
    }
  }

  async resendOTP(req, res) {
    try {
      logger.info('Resending OTP');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      const { type } = req.body;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (!type) {
        errors.push('OTP type is required');
      } else if (!['sms', 'email'].includes(type)) {
        errors.push('Invalid OTP type. Must be one of: sms, email');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      await twoFactorAuthService.resendOTP(userId, type, institution);
      
      logger.info('OTP resent successfully:', { userId, type });
      return successResponse(res, null, 'OTP resent successfully');
    } catch (error) {
      logger.error('Error resending OTP:', error);
      return errorResponse(res, error.message);
    }
  }

  async get2FASettings(req, res) {
    try {
      logger.info('Fetching 2FA settings');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const settings = await twoFactorAuthService.get2FASettings(userId, institution);
      
      logger.info('2FA settings fetched successfully:', { userId });
      return successResponse(res, settings, '2FA settings retrieved successfully');
    } catch (error) {
      logger.error('Error fetching 2FA settings:', error);
      return errorResponse(res, error.message);
    }
  }

  async update2FASettings(req, res) {
    try {
      logger.info('Updating 2FA settings');
      
      const userId = req.user?.id;
      const institution = req.user?.institution;
      const { rememberDevice, requireForLogin, requireForSensitiveActions } = req.body;
      
      // Validation
      const errors = [];
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (rememberDevice !== undefined && typeof rememberDevice !== 'boolean') {
        errors.push('rememberDevice must be a boolean');
      }
      
      if (requireForLogin !== undefined && typeof requireForLogin !== 'boolean') {
        errors.push('requireForLogin must be a boolean');
      }
      
      if (requireForSensitiveActions !== undefined && typeof requireForSensitiveActions !== 'boolean') {
        errors.push('requireForSensitiveActions must be a boolean');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const settings = await twoFactorAuthService.update2FASettings(userId, institution, req.body);
      
      logger.info('2FA settings updated successfully:', { userId });
      return successResponse(res, settings, '2FA settings updated successfully');
    } catch (error) {
      logger.error('Error updating 2FA settings:', error);
      return errorResponse(res, error.message);
    }
  }
}

export default new TwoFactorAuthController();
