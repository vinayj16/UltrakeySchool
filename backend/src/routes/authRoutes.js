import express from 'express';
import authController from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  validateRegister,
  validateLogin,
  validatePasswordChange,
  validateRefreshToken
} from '../middleware/authValidation.js';
import {
  loginLimiter,
  registerLimiter,
  refreshTokenLimiter
} from '../middleware/authRateLimiter.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', registerLimiter, validateRegister, authController.register);
router.post('/login', loginLimiter, validateLogin, authController.login);
router.post('/refresh-token', refreshTokenLimiter, validateRefreshToken, authController.refreshToken);
router.post('/refresh', refreshTokenLimiter, validateRefreshToken, authController.refreshToken); // Alias
router.post('/create-account-request', authController.createAccountRequest);

// Protected routes (authentication required)
router.post('/logout', authenticate, authController.logout);
router.post('/change-password', authenticate, validatePasswordChange, authController.changePassword);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.get('/me', authenticate, authController.getProfile); // Alias

export default router;
