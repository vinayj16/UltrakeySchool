import express from 'express';
import * as gdprSettingsController from '../controllers/gdprSettingsController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', gdprSettingsController.getGdprSettings);
router.put('/', gdprSettingsController.updateGdprSettings);
router.post('/toggle', gdprSettingsController.toggleGdpr);
router.delete('/', gdprSettingsController.deleteGdprSettings);

export default router;
