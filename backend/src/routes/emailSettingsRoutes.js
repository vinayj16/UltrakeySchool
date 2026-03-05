import express from 'express';
import * as emailSettingsController from '../controllers/emailSettingsController.js';

const router = express.Router();

router.get('/', emailSettingsController.getEmailSettings);
router.put('/phpmailer', emailSettingsController.updatePhpMailerSettings);
router.put('/smtp', emailSettingsController.updateSmtpSettings);
router.put('/google', emailSettingsController.updateGoogleSettings);
router.post('/toggle', emailSettingsController.toggleProvider);
router.get('/test/:provider', emailSettingsController.testEmailConnection);

export default router;
