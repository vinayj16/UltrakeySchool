import express from 'express';
import twoFactorAuthController from '../controllers/twoFactorAuthController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// TOTP routes
router.post('/totp/setup', twoFactorAuthController.setupTOTP);
router.post('/totp/verify-enable', twoFactorAuthController.verifyAndEnableTOTP);
router.post('/totp/verify', twoFactorAuthController.verifyTOTP);

// OTP routes
router.post('/otp/sms', twoFactorAuthController.sendSMSOTP);
router.post('/otp/email', twoFactorAuthController.sendEmailOTP);
router.post('/otp/verify', twoFactorAuthController.verifyOTP);

// Management routes
router.get('/status', twoFactorAuthController.get2FAStatus);
router.post('/disable', twoFactorAuthController.disable2FA);
router.post('/backup-codes/regenerate', twoFactorAuthController.regenerateBackupCodes);

export default router;
