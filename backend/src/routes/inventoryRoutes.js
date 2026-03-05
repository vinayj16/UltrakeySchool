import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateTenantAccess } from '../middleware/multiTenant.js';
import { authorize } from '../middleware/authGuard.js';
import inventoryController from '../controllers/inventoryController.js';
const {
  createInventoryItem,
  listInventory,
  updateInventoryItem,
  adjustInventory
} = inventoryController;

const router = express.Router();

router.use(authenticate);
router.use(validateTenantAccess);

router.post(
  '/',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin', 'accountant'),
  createInventoryItem
);

router.get(
  '/',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin', 'accountant'),
  listInventory
);

router.put(
  '/:id',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  updateInventoryItem
);

router.post(
  '/:id/adjust',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  adjustInventory
);

export default router;
