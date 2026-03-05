import express from 'express';
import biometricAuthController from '../controllers/biometricAuthController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/register', biometricAuthController.registerCredential);
router.post('/challenge', biometricAuthController.generateChallenge);
router.post('/verify', biometricAuthController.verifyAuthentication);
router.get('/credentials', biometricAuthController.getUserCredentials);
router.put('/credentials/:credentialId/revoke', biometricAuthController.revokeCredential);
router.delete('/credentials/:credentialId', biometricAuthController.deleteCredential);
router.get('/statistics', biometricAuthController.getStatistics);

export default router;
