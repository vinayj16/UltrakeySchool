import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import platformSettingsController from '../controllers/platformSettingsController.js';

const router = express.Router();

// Get all platform settings
router.get('/', authenticate, platformSettingsController.default.getAllSettings);

// Get settings by category
router.get('/category/:category', authenticate, platformSettingsController.default.getSettingsByCategory);

// Get single setting
router.get('/:settingId', authenticate, platformSettingsController.default.getSettingById);

// Create new setting
router.post('/', authenticate, authorize(['admin']), platformSettingsController.default.createSetting);

// Update setting
router.put('/:settingId', authenticate, authorize(['admin']), platformSettingsController.default.updateSetting);

// Delete setting
router.delete('/:settingId', authenticate, authorize(['admin']), platformSettingsController.default.deleteSetting);

// Bulk update settings
router.put('/bulk', authenticate, authorize(['admin']), platformSettingsController.default.bulkUpdateSettings);

// Test service connections
router.post('/test/:service', authenticate, authorize(['admin']), platformSettingsController.default.testServiceConnection);

export default router;
