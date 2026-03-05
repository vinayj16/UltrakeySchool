import authService from '../services/authService.js';
import tokenService from '../services/tokenService.js';
import { bypassModeEnabled, resolveBypassRole, createMockUser, isBypassModeValid } from '../config/bypassAuth.js';
import { successResponse, createdResponse, errorResponse, validationErrorResponse, notFoundResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

// Validation constants
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;
const TOKEN_LENGTH = 64;

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
  const errors = [];
  
  if (!email || typeof email !== 'string') {
    errors.push('Email is required and must be a string');
    return errors;
  }
  
  const trimmedEmail = email.trim();
  
  if (trimmedEmail.length === 0) {
    errors.push('Email cannot be empty');
  }
  
  if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
    errors.push('Email must not exceed ' + MAX_EMAIL_LENGTH + ' characters');
  }
  
  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.push('Invalid email format');
  }
  
  return errors;
};

// Helper function to validate password
const validatePassword = (password, fieldName = 'Password') => {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    errors.push(fieldName + ' is required and must be a string');
    return errors;
  }
  
  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(fieldName + ' must be at least ' + MIN_PASSWORD_LENGTH + ' characters long');
  }
  
  if (password.length > MAX_PASSWORD_LENGTH) {
    errors.push(fieldName + ' must not exceed ' + MAX_PASSWORD_LENGTH + ' characters');
  }
  
  if (!PASSWORD_PATTERN.test(password)) {
    errors.push(fieldName + ' must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
  }
  
  return errors;
};

// Helper function to validate name
const validateName = (name) => {
  const errors = [];
  
  if (!name || typeof name !== 'string') {
    errors.push('Name is required and must be a string');
    return errors;
  }
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < MIN_NAME_LENGTH) {
    errors.push('Name must be at least ' + MIN_NAME_LENGTH + ' characters long');
  }
  
  if (trimmedName.length > MAX_NAME_LENGTH) {
    errors.push('Name must not exceed ' + MAX_NAME_LENGTH + ' characters');
  }
  
  return errors;
};

// Helper function to check if auth is allowed
const isAuthAllowed = () => {
  const authEnabled = process.env.AUTH_ENABLED !== 'false';
  const bypassValid = bypassModeEnabled && isBypassModeValid();
  return authEnabled || bypassValid;
};

// Helper function to reject auth requests
const rejectAuth = (res) => {
  logger.warn('Authentication request rejected: Auth is disabled');
  return errorResponse(res, 'Authentication is temporarily disabled. Please contact your administrator.', 503, 'AUTH_TEMPORARILY_DISABLED');
};

/**
 * Register a new user
 */
const register = async (req, res) => {
  try {
    logger.info('User registration attempt');
    
    if (!isAuthAllowed()) {
      return rejectAuth(res);
    }
    
    const { email, password, name, role, institutionId } = req.body;
    
    // Validation
    const errors = [];
    
    const emailErrors = validateEmail(email);
    if (emailErrors.length > 0) {
      errors.push(...emailErrors);
    }
    
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      errors.push(...passwordErrors);
    }
    
    const nameErrors = validateName(name);
    if (nameErrors.length > 0) {
      errors.push(...nameErrors);
    }
    
    if (role && typeof role !== 'string') {
      errors.push('Role must be a string');
    }
    
    if (institutionId) {
      const institutionIdError = validateObjectId(institutionId, 'Institution ID');
      if (institutionIdError) errors.push(institutionIdError);
    }
    
    if (errors.length > 0) {
      logger.warn('Registration validation failed:', { errors, email });
      return validationErrorResponse(res, errors);
    }
    
    const result = await authService.register(req.body);
    
    logger.info('User registered successfully:', { userId: result.user?.id, email });
    return createdResponse(res, result, 'User registered successfully');
  } catch (error) {
    logger.error('Registration error:', error);
    
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      return errorResponse(res, error.message, 409, 'EMAIL_ALREADY_EXISTS');
    }
    
    return errorResponse(res, error.message || 'Registration failed', 400, 'REGISTRATION_FAILED');
  }
};

/**
 * User login
 */
const login = async (req, res) => {
  try {
    logger.info('Login attempt');
    
    if (!isAuthAllowed()) {
      return rejectAuth(res);
    }
    
    // Handle bypass mode
    if (bypassModeEnabled && isBypassModeValid()) {
      try {
        const role = resolveBypassRole(req.body.role || req.body.mockRole || req.headers['x-bypass-role']);
        const mockUser = createMockUser(role);
        const tokens = tokenService.generateTokens({
          id: mockUser.id,
          sub: mockUser.id,
          email: mockUser.email,
          role: mockUser.role
        });
        
        logger.info('Login bypassed for mock user:', { role, userId: mockUser.id });
        
        return successResponse(res, {
          user: mockUser,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: tokens.expiresIn
        }, 'Login bypassed for mock user');
      } catch (bypassError) {
        logger.error('Auth bypass error:', bypassError);
        return errorResponse(res, 'Failed to create bypass session: ' + bypassError.message, 500, 'BYPASS_ERROR');
      }
    }
    
    const { email, password } = req.body;
    
    // Validation
    const errors = [];
    
    const emailErrors = validateEmail(email);
    if (emailErrors.length > 0) {
      errors.push(...emailErrors);
    }
    
    if (!password || typeof password !== 'string') {
      errors.push('Password is required and must be a string');
    } else if (password.length === 0) {
      errors.push('Password cannot be empty');
    }
    
    if (errors.length > 0) {
      logger.warn('Login validation failed:', { errors, email });
      return validationErrorResponse(res, errors);
    }
    
    const result = await authService.login(email, password);
    
    logger.info('Login successful:', { userId: result.user?.id, email });
    return successResponse(res, result, 'Login successful');
  } catch (error) {
    logger.error('Login error:', error);
    
    if (error.message.includes('Invalid email or password') || error.message.includes('Invalid credentials')) {
      return errorResponse(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }
    
    if (error.message.includes('deactivated') || error.message.includes('inactive')) {
      return errorResponse(res, error.message, 403, 'ACCOUNT_DEACTIVATED');
    }
    
    if (error.message.includes('locked') || error.message.includes('too many attempts')) {
      return errorResponse(res, error.message, 429, 'ACCOUNT_LOCKED');
    }
    
    if (error.message.includes('not verified')) {
      return errorResponse(res, error.message, 403, 'EMAIL_NOT_VERIFIED');
    }
    
    return errorResponse(res, 'An error occurred during login', 500, 'INTERNAL_ERROR');
  }
};

/**
 * Refresh access token
 */
const refreshToken = async (req, res) => {
  try {
    logger.info('Token refresh attempt');
    
    const { refreshToken } = req.body;
    
    // Validation
    const errors = [];
    
    if (!refreshToken || typeof refreshToken !== 'string') {
      errors.push('Refresh token is required and must be a string');
    } else if (refreshToken.trim().length === 0) {
      errors.push('Refresh token cannot be empty');
    }
    
    if (errors.length > 0) {
      logger.warn('Token refresh validation failed:', { errors });
      return validationErrorResponse(res, errors);
    }
    
    const result = await authService.refreshToken(refreshToken);
    
    logger.info('Token refreshed successfully:', { userId: result.user?.id });
    return successResponse(res, result, 'Token refreshed successfully');
  } catch (error) {
    logger.error('Token refresh error:', error);
    
    if (error.message.includes('Invalid refresh token') || error.message.includes('expired')) {
      return errorResponse(res, 'Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }
    
    if (error.message.includes('deactivated')) {
      return errorResponse(res, 'Account is deactivated', 403, 'ACCOUNT_DEACTIVATED');
    }
    
    return errorResponse(res, 'Token refresh failed', 401, 'TOKEN_REFRESH_FAILED');
  }
};

/**
 * User logout
 */
const logout = async (req, res) => {
  try {
    logger.info('Logout attempt');
    
    if (!req.user || !req.user.id) {
      logger.warn('Logout attempt without authentication');
      return errorResponse(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    }
    
    await authService.logout(req.user.id);
    
    logger.info('Logout successful:', { userId: req.user.id });
    return successResponse(res, null, 'Logged out successfully');
  } catch (error) {
    logger.error('Logout error:', error);
    return errorResponse(res, 'Logout failed', 500, 'LOGOUT_FAILED');
  }
};

/**
 * Change user password
 */
const changePassword = async (req, res) => {
  try {
    logger.info('Password change attempt');
    
    if (!req.user || !req.user.id) {
      logger.warn('Password change attempt without authentication');
      return errorResponse(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    }
    
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // Validation
    const errors = [];
    
    if (!currentPassword || typeof currentPassword !== 'string') {
      errors.push('Current password is required and must be a string');
    } else if (currentPassword.trim().length === 0) {
      errors.push('Current password cannot be empty');
    }
    
    const newPasswordErrors = validatePassword(newPassword, 'New password');
    if (newPasswordErrors.length > 0) {
      errors.push(...newPasswordErrors);
    }
    
    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      errors.push('New password and confirm password do not match');
    }
    
    if (currentPassword === newPassword) {
      errors.push('New password must be different from current password');
    }
    
    if (errors.length > 0) {
      logger.warn('Password change validation failed:', { errors, userId: req.user.id });
      return validationErrorResponse(res, errors);
    }
    
    const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
    
    logger.info('Password changed successfully:', { userId: req.user.id });
    return successResponse(res, null, result.message || 'Password changed successfully');
  } catch (error) {
    logger.error('Password change error:', error);
    
    if (error.message.includes('Current password is incorrect') || error.message.includes('incorrect password')) {
      return errorResponse(res, error.message, 400, 'INVALID_CURRENT_PASSWORD');
    }
    
    if (error.message.includes('not found')) {
      return notFoundResponse(res, 'User not found');
    }
    
    return errorResponse(res, 'Password change failed', 400, 'PASSWORD_CHANGE_FAILED');
  }
};

/**
 * Request password reset
 */
const forgotPassword = async (req, res) => {
  try {
    logger.info('Password reset request');
    
    const { email } = req.body;
    
    // Validation
    const errors = validateEmail(email);
    
    if (errors.length > 0) {
      logger.warn('Forgot password validation failed:', { errors, email });
      return validationErrorResponse(res, errors);
    }
    
    const result = await authService.forgotPassword(email);
    
    logger.info('Password reset email sent:', { email });
    
    // Return success response without exposing sensitive data in production
    const responseData = {
      message: result.message
    };
    
    // Include reset details only in development
    if (process.env.NODE_ENV === 'development') {
      responseData.resetUrl = result.resetUrl;
      responseData.resetToken = result.resetToken;
    }
    
    return successResponse(res, responseData, result.message);
  } catch (error) {
    logger.error('Forgot password error:', error);
    
    // Always return success to prevent email enumeration
    return successResponse(res, { message: 'If the email exists, a password reset link has been sent' }, 'Password reset request processed');
  }
};

/**
 * Reset password with token
 */
const resetPassword = async (req, res) => {
  try {
    logger.info('Password reset attempt');
    
    const { token, newPassword, confirmPassword } = req.body;
    
    // Validation
    const errors = [];
    
    if (!token || typeof token !== 'string') {
      errors.push('Reset token is required and must be a string');
    } else if (token.trim().length === 0) {
      errors.push('Reset token cannot be empty');
    }
    
    const passwordErrors = validatePassword(newPassword, 'New password');
    if (passwordErrors.length > 0) {
      errors.push(...passwordErrors);
    }
    
    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      errors.push('New password and confirm password do not match');
    }
    
    if (errors.length > 0) {
      logger.warn('Password reset validation failed:', { errors });
      return validationErrorResponse(res, errors);
    }
    
    const result = await authService.resetPassword(token, newPassword);
    
    logger.info('Password reset successful');
    return successResponse(res, null, result.message || 'Password reset successfully');
  } catch (error) {
    logger.error('Password reset error:', error);
    
    if (error.message.includes('Invalid or expired') || error.message.includes('invalid token')) {
      return errorResponse(res, error.message, 400, 'INVALID_RESET_TOKEN');
    }
    
    return errorResponse(res, 'Password reset failed', 400, 'PASSWORD_RESET_FAILED');
  }
};

/**
 * Verify password reset token
 */
const verifyResetToken = async (req, res) => {
  try {
    logger.info('Reset token verification attempt');
    
    const { token } = req.body;
    
    // Validation
    const errors = [];
    
    if (!token || typeof token !== 'string') {
      errors.push('Token is required and must be a string');
    } else if (token.trim().length === 0) {
      errors.push('Token cannot be empty');
    }
    
    if (errors.length > 0) {
      logger.warn('Token verification validation failed:', { errors });
      return validationErrorResponse(res, errors);
    }
    
    const result = await authService.verifyResetToken(token);
    
    logger.info('Reset token verified successfully');
    return successResponse(res, result, result.message || 'Token is valid');
  } catch (error) {
    logger.error('Token verification error:', error);
    return errorResponse(res, error.message || 'Token verification failed', 400, 'TOKEN_VERIFICATION_FAILED');
  }
};

/**
 * Verify email with token
 */
const verifyEmail = async (req, res) => {
  try {
    logger.info('Email verification attempt');
    
    const { token } = req.body;
    
    // Validation
    const errors = [];
    
    if (!token || typeof token !== 'string') {
      errors.push('Verification token is required and must be a string');
    } else if (token.trim().length === 0) {
      errors.push('Verification token cannot be empty');
    }
    
    if (errors.length > 0) {
      logger.warn('Email verification validation failed:', { errors });
      return validationErrorResponse(res, errors);
    }
    
    const result = await authService.verifyEmail(token);
    
    logger.info('Email verified successfully');
    return successResponse(res, result, result.message || 'Email verified successfully');
  } catch (error) {
    logger.error('Email verification error:', error);
    return errorResponse(res, error.message || 'Email verification failed', 400, 'EMAIL_VERIFICATION_FAILED');
  }
};

/**
 * Resend email verification
 */
const resendVerificationEmail = async (req, res) => {
  try {
    logger.info('Resend verification email attempt');
    
    const { email } = req.body;
    
    // Validation
    const errors = validateEmail(email);
    
    if (errors.length > 0) {
      logger.warn('Resend verification validation failed:', { errors, email });
      return validationErrorResponse(res, errors);
    }
    
    const result = await authService.resendVerificationEmail(email);
    
    logger.info('Verification email resent:', { email });
    return successResponse(res, null, result.message || 'Verification email sent successfully');
  } catch (error) {
    logger.error('Resend verification email error:', error);
    
    // Always return success to prevent email enumeration
    return successResponse(res, null, 'If the email exists and is not verified, a verification email has been sent');
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
  try {
    logger.info('Get profile attempt');
    
    if (!req.user || !req.user.id) {
      logger.warn('Get profile attempt without authentication');
      return errorResponse(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    }
    
    const result = await authService.getProfile(req.user.id);
    
    logger.info('Profile fetched successfully:', { userId: req.user.id });
    return successResponse(res, result.data || result, 'Profile retrieved successfully');
  } catch (error) {
    logger.error('Get profile error:', error);
    
    if (error.message.includes('not found')) {
      return notFoundResponse(res, 'User not found');
    }
    
    return errorResponse(res, 'Failed to get profile', 500, 'PROFILE_FETCH_FAILED');
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    logger.info('Update profile attempt');
    
    if (!req.user || !req.user.id) {
      logger.warn('Update profile attempt without authentication');
      return errorResponse(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    }
    
    const { name, email, phone, avatar } = req.body;
    
    // Validation
    const errors = [];
    
    if (name !== undefined) {
      const nameErrors = validateName(name);
      if (nameErrors.length > 0) {
        errors.push(...nameErrors);
      }
    }
    
    if (email !== undefined) {
      const emailErrors = validateEmail(email);
      if (emailErrors.length > 0) {
        errors.push(...emailErrors);
      }
    }
    
    if (phone !== undefined && phone !== null) {
      if (typeof phone !== 'string') {
        errors.push('Phone must be a string');
      } else if (phone.length > 0 && phone.length < 10) {
        errors.push('Phone number must be at least 10 digits');
      } else if (phone.length > 20) {
        errors.push('Phone number must not exceed 20 digits');
      }
    }
    
    if (avatar !== undefined && avatar !== null) {
      if (typeof avatar !== 'string') {
        errors.push('Avatar must be a string (URL)');
      } else if (avatar.length > 500) {
        errors.push('Avatar URL must not exceed 500 characters');
      }
    }
    
    if (errors.length > 0) {
      logger.warn('Update profile validation failed:', { errors, userId: req.user.id });
      return validationErrorResponse(res, errors);
    }
    
    const result = await authService.updateProfile(req.user.id, req.body);
    
    logger.info('Profile updated successfully:', { userId: req.user.id });
    return successResponse(res, result, 'Profile updated successfully');
  } catch (error) {
    logger.error('Update profile error:', error);
    
    if (error.message.includes('not found')) {
      return notFoundResponse(res, 'User not found');
    }
    
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      return errorResponse(res, error.message, 409, 'EMAIL_ALREADY_EXISTS');
    }
    
    if (error.message.includes('Validation')) {
      return errorResponse(res, error.message, 400, 'VALIDATION_ERROR');
    }
    
    return errorResponse(res, 'Failed to update profile', 500, 'PROFILE_UPDATE_FAILED');
  }
};

/**
 * Verify 2FA code
 */
const verify2FA = async (req, res) => {
  try {
    logger.info('2FA verification attempt');
    
    const { userId, token, method } = req.body;
    
    // Validation
    const errors = [];
    
    const userIdError = validateObjectId(userId, 'User ID');
    if (userIdError) errors.push(userIdError);
    
    if (!token || typeof token !== 'string') {
      errors.push('Token is required and must be a string');
    } else if (token.trim().length === 0) {
      errors.push('Token cannot be empty');
    }
    
    const validMethods = ['totp', 'sms', 'email'];
    if (!method || !validMethods.includes(method)) {
      errors.push('Invalid 2FA method. Must be one of: ' + validMethods.join(', '));
    }
    
    if (errors.length > 0) {
      logger.warn('2FA verification validation failed:', { errors, userId });
      return validationErrorResponse(res, errors);
    }
    
    // Import twoFactorAuthService
    const twoFactorAuthService = (await import('../services/twoFactorAuthService.js')).default;
    
    let verified = false;
    
    if (method === 'totp') {
      verified = await twoFactorAuthService.verifyTOTP(userId, token, req.user?.tenant || req.body.tenantId);
    } else if (method === 'sms' || method === 'email') {
      verified = await twoFactorAuthService.verifyOTP(userId, token, method, req.user?.tenant || req.body.tenantId);
    }
    
    if (verified) {
      const User = (await import('../models/User.js')).default;
      
      const user = await User.findById(userId);
      if (!user) {
        logger.warn('User not found after 2FA verification:', { userId });
        return notFoundResponse(res, 'User not found');
      }
      
      const tokens = authService.generateTokens(user);
      
      logger.info('2FA verification successful:', { userId });
      
      return successResponse(res, {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          institutionId: user.institutionId,
          status: user.status
        },
        ...tokens
      }, '2FA verification successful');
    } else {
      logger.warn('2FA verification failed: Invalid code:', { userId, method });
      return errorResponse(res, 'Invalid or expired verification code', 401, '2FA_VERIFICATION_FAILED');
    }
  } catch (error) {
    logger.error('2FA verification error:', error);
    return errorResponse(res, error.message || 'Failed to verify 2FA code', 500, '2FA_VERIFICATION_ERROR');
  }
};

/**
 * Resend 2FA code
 */
const resend2FA = async (req, res) => {
  try {
    logger.info('Resend 2FA code attempt');
    
    const { userId, method } = req.body;
    
    // Validation
    const errors = [];
    
    const userIdError = validateObjectId(userId, 'User ID');
    if (userIdError) errors.push(userIdError);
    
    const validMethods = ['sms', 'email'];
    if (!method || !validMethods.includes(method)) {
      errors.push('Invalid method. Only SMS and email resend are supported');
    }
    
    if (errors.length > 0) {
      logger.warn('Resend 2FA validation failed:', { errors, userId });
      return validationErrorResponse(res, errors);
    }
    
    const twoFactorAuthService = (await import('../services/twoFactorAuthService.js')).default;
    const User = (await import('../models/User.js')).default;
    
    const user = await User.findById(userId);
    if (!user) {
      logger.warn('User not found for 2FA resend:', { userId });
      return notFoundResponse(res, 'User not found');
    }
    
    if (method === 'sms') {
      if (!user.phone) {
        return errorResponse(res, 'Phone number not found for this user', 400, 'PHONE_NOT_FOUND');
      }
      await twoFactorAuthService.sendSMSOTP(userId, user.phone, req.user?.tenant || req.body.tenantId);
    } else if (method === 'email') {
      await twoFactorAuthService.sendEmailOTP(userId, user.email, req.user?.tenant || req.body.tenantId);
    }
    
    logger.info('2FA code resent successfully:', { userId, method });
    return successResponse(res, null, 'Verification code resent successfully');
  } catch (error) {
    logger.error('Resend 2FA error:', error);
    return errorResponse(res, error.message || 'Failed to resend verification code', 500, 'RESEND_2FA_ERROR');
  }
};

/**
 * Check authentication status
 */
const checkAuthStatus = async (req, res) => {
  try {
    logger.info('Check auth status');
    
    if (!req.user || !req.user.id) {
      return successResponse(res, { authenticated: false }, 'Not authenticated');
    }
    
    return successResponse(res, {
      authenticated: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        name: req.user.name
      }
    }, 'Authenticated');
  } catch (error) {
    logger.error('Check auth status error:', error);
    return errorResponse(res, 'Failed to check authentication status', 500, 'AUTH_STATUS_CHECK_FAILED');
  }
};

/**
 * Get authentication configuration
 */
const getAuthConfig = async (req, res) => {
  try {
    logger.info('Get auth config');
    
    const config = {
      authEnabled: process.env.AUTH_ENABLED !== 'false',
      bypassModeEnabled: bypassModeEnabled && isBypassModeValid(),
      twoFactorEnabled: process.env.TWO_FACTOR_ENABLED === 'true',
      emailVerificationRequired: process.env.EMAIL_VERIFICATION_REQUIRED === 'true',
      passwordPolicy: {
        minLength: MIN_PASSWORD_LENGTH,
        maxLength: MAX_PASSWORD_LENGTH,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
      },
      loginAttempts: {
        maxAttempts: MAX_LOGIN_ATTEMPTS,
        lockoutDuration: LOCKOUT_DURATION_MINUTES
      }
    };
    
    return successResponse(res, config, 'Authentication configuration retrieved');
  } catch (error) {
    logger.error('Get auth config error:', error);
    return errorResponse(res, 'Failed to get authentication configuration', 500, 'AUTH_CONFIG_FETCH_FAILED');
  }
};


export default {
  register,
  login,
  refreshToken,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  verifyEmail,
  resendVerificationEmail,
  getProfile,
  updateProfile,
  verify2FA,
  resend2FA,
  checkAuthStatus,
  getAuthConfig
};
