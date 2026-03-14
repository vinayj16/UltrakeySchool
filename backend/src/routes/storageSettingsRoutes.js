import express from 'express';
import storageSettingsController from '../controllers/storageSettingsController.js';

const router = express.Router();

router.get('/', storageSettingsController.getAllStorageProviders);
router.get('/default', storageSettingsController.getDefaultProvider);
router.get('/:id', storageSettingsController.getStorageProviderById);
router.post('/', storageSettingsController.upsertStorageProvider);
router.post('/initialize', storageSettingsController.initializeDefaultProviders);
router.post('/:id/test', storageSettingsController.testProviderConnection);
router.put('/:id/toggle', storageSettingsController.toggleProviderStatus);
router.delete('/:id', storageSettingsController.deleteStorageProvider);

export default router;