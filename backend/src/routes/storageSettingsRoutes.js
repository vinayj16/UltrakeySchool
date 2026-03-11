import express from 'express';
import storageSettingsController from '../controllers/storageSettingsController.js';

const router = express.Router();

router.get('/', storageSettingsController.default.getAllStorageProviders);
router.get('/default', storageSettingsController.default.getDefaultProvider);
router.get('/:id', storageSettingsController.default.getStorageProviderById);
router.post('/', storageSettingsController.default.upsertStorageProvider);
router.post('/initialize', storageSettingsController.default.initializeDefaultProviders);
router.post('/:id/test', storageSettingsController.default.testProviderConnection);
router.put('/:id/toggle', storageSettingsController.default.toggleProviderStatus);
router.delete('/:id', storageSettingsController.default.deleteStorageProvider);

export default router;