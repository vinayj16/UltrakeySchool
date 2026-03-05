import express from 'express';
import storageSettingsController from '../controllers/storageSettingsController.js';
const {
  getAllStorageProviders,
  getStorageProviderById,
  getDefaultProvider,
  upsertStorageProvider,
  toggleProviderStatus,
  testProviderConnection,
  deleteStorageProvider,
  initializeDefaultProviders
} = storageSettingsController;


const router = express.Router();

router.get('/', getAllStorageProviders);
router.get('/default', getDefaultProvider);
router.get('/:id', getStorageProviderById);
router.post('/', upsertStorageProvider);
router.post('/initialize', initializeDefaultProviders);
router.post('/:id/test', testProviderConnection);
router.put('/:id/toggle', toggleProviderStatus);
router.delete('/:id', deleteStorageProvider);

export default router;
