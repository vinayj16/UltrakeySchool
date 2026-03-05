import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as platformSettingsController from '../controllers/platformSettingsController.js';

const router = express.Router();

// Get all platform settings
router.get('/', authenticate, platformSettingsController.getAllSettings);

// Get settings by category
router.get('/category/:category', authenticate, platformSettingsController.getSettingsByCategory);

// Get single setting
router.get('/:settingId', authenticate, platformSettingsController.getSettingById);

// Create new setting
router.post('/', authenticate, authorize(['admin']), platformSettingsController.createSetting);

// Update setting
router.put('/:settingId', authenticate, authorize(['admin']), platformSettingsController.updateSetting);

// Delete setting
router.delete('/:settingId', authenticate, authorize(['admin']), platformSettingsController.deleteSetting);

// Bulk update settings
router.put('/bulk', authenticate, authorize(['admin']), platformSettingsController.bulkUpdateSettings);

// Test service connections
router.post('/test/:service', authenticate, authorize(['admin']), platformSettingsController.testServiceConnection);

export default router;
