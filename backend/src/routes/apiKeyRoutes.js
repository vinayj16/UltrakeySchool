import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { requireApiKey } from '../middleware/apiKeyGuard.js';
import apiKeyController from '../controllers/apiKeyController.js';
const {
  createApiKey,
  listApiKeys,
  getApiKey,
  regenerateApiKey,
  deleteApiKey,
  validateKey
} = apiKeyController;

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorize('superadmin', 'institution_admin'),
  createApiKey
);
router.get(
  '/',
  authenticate,
  authorize('superadmin', 'institution_admin'),
  listApiKeys
);
router.get(
  '/:id',
  authenticate,
  authorize('superadmin', 'institution_admin'),
  getApiKey
);
router.post(
  '/:id/regenerate',
  authenticate,
  authorize('superadmin', 'institution_admin'),
  regenerateApiKey
);
router.delete(
  '/:id',
  authenticate,
  authorize('superadmin', 'institution_admin'),
  deleteApiKey
);

router.post('/validate', requireApiKey, validateKey);

export default router;
