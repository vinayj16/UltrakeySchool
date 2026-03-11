import express from 'express';
import installmentController from '../controllers/installmentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authGuard.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create installment plan
router.post(
  '/',
  authorize(['super_admin', 'school_admin', 'accountant']),
  installmentController.createInstallmentPlan
);

// Get installment plans
router.get('/', installmentController.getInstallmentPlans);

// Get installment plan by ID
router.get('/:id', installmentController.getInstallmentPlanById);

// Pay installment
router.post('/:id/installments/:installmentNumber/pay', installmentController.payInstallment);

// Apply late fees
router.post(
  '/late-fees/apply',
  authorize(['super_admin', 'school_admin', 'accountant']),
  installmentController.applyLateFees
);

// Cancel installment plan
router.put(
  '/:id/cancel',
  authorize(['super_admin', 'school_admin', 'accountant']),
  installmentController.cancelInstallmentPlan
);

// Get upcoming installments
router.get('/upcoming/list', installmentController.getUpcomingInstallments);

// Get installment statistics
router.get(
  '/stats/summary',
  authorize(['super_admin', 'school_admin', 'accountant']),
  installmentController.getInstallmentStatistics
);

export default router;
