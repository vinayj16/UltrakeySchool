import express from 'express';
import oauthController from '../controllers/oauthController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/google/url', oauthController.getGoogleAuthUrl);
router.get('/google/callback', oauthController.googleCallback);
router.get('/microsoft/url', oauthController.getMicrosoftAuthUrl);
router.get('/microsoft/callback', oauthController.microsoftCallback);

// Protected routes (authentication required)
router.use(protect);

router.post('/link', oauthController.linkAccount);
router.delete('/unlink/:provider', oauthController.unlinkAccount);
router.get('/linked', oauthController.getLinkedAccounts);

export default router;
