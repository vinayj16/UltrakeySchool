import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateTenantAccess } from '../middleware/multiTenant.js';
import { authorize } from '../middleware/authGuard.js';
import canteenController from '../controllers/canteenController.js';
const {
  createMenuItem,
  listMenuItems,
  createOrder,
  listOrders,
  updateOrderStatus,
  recordPayment
} = canteenController;

const router = express.Router();

router.use(authenticate);
router.use(validateTenantAccess);

router.post(
  '/menu',
  authorize('canteen_manager', 'hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  createMenuItem
);

router.get(
  '/menu',
  authorize('canteen_manager', 'hostel_warden', 'school_admin', 'institution_admin', 'superadmin', 'student', 'parent'),
  listMenuItems
);

router.post(
  '/orders',
  authorize('student', 'parent'),
  createOrder
);

router.get(
  '/orders',
  authorize('canteen_manager', 'hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  listOrders
);

router.put(
  '/orders/:id',
  authorize('canteen_manager', 'hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  updateOrderStatus
);

router.post(
  '/orders/:id/payment',
  authorize('canteen_manager', 'hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  recordPayment
);

export default router;
