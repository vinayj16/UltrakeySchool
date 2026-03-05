import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  validateRegister,
  validateLogin,
  validatePasswordChange,
  validatePasswordReset,
  validateEmail,
  validateRefreshToken,
  validateToken
} from '../middleware/authValidation.js';
import {
  loginLimiter,
  registerLimiter,
  passwordResetLimiter,
  refreshTokenLimiter,
  generalAuthLimiter
} from '../middleware/authRateLimiter.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', registerLimiter, validateRegister, authController.register);
router.post('/login', loginLimiter, validateLogin, authController.login);
router.post('/refresh-token', refreshTokenLimiter, validateRefreshToken, authController.refreshToken);
router.post('/refresh', refreshTokenLimiter, validateRefreshToken, authController.refreshToken); // Alias
router.post('/forgot-password', passwordResetLimiter, validateEmail, authController.forgotPassword);
router.post('/reset-password', generalAuthLimiter, validatePasswordReset, authController.resetPassword);
router.post('/verify-reset-token', generalAuthLimiter, validateToken, authController.verifyResetToken);
router.post('/verify-email', generalAuthLimiter, validateToken, authController.verifyEmail);
router.post('/verify-2fa', generalAuthLimiter, authController.verify2FA);
router.post('/resend-2fa', generalAuthLimiter, authController.resend2FA);

// Protected routes (authentication required)
router.post('/logout', authenticate, authController.logout);
router.post('/change-password', authenticate, validatePasswordChange, authController.changePassword);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.get('/me', authenticate, authController.getProfile); // Alias

export default router;
