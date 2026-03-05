import express from 'express';
import feeController from '../controllers/feeController.js';
const {
  getFeesOverview,
  collectFee,
  createFee,
  bulkCreateFees,
  getStudentFees,
  getPendingFees,
  sendReminders,
  getFeesReport,
  updateFee,
  deleteFee,
  applyLateFees,
  createInvoice,
  getInvoices,
  initiatePayment,
  verifyPayment,
  getPaymentReceipt
} = feeController;

import { authenticate, authorize } from '../middleware/auth.js';
import {
  getFeesOverviewValidation,
  collectFeeValidation,
  createFeeValidation,
  bulkCreateFeesValidation,
  getStudentFeesValidation,
  getPendingFeesValidation,
  sendRemindersValidation,
  getFeesReportValidation,
  updateFeeValidation,
  deleteFeeValidation,
  createInvoiceValidation,
  getInvoicesValidation,
  initiatePaymentValidation,
  verifyPaymentValidation
} from '../validators/feeValidators.js';

const router = express.Router();

router.use(authenticate);

// Invoice routes
router.post(
  '/invoices',
  authenticate,
  authorize(['admin', 'accountant']),
  createInvoiceValidation,
  createInvoice
);

router.get(
  '/invoices',
  authenticate,
  getInvoicesValidation,
  getInvoices
);

router.post(
  '/invoices/:invoiceId/pay',
  authenticate,
  authorize(['admin', 'accountant', 'student', 'parent']),
  initiatePaymentValidation,
  initiatePayment
);

router.post(
  '/payments/verify',
  authenticate,
  verifyPaymentValidation,
  verifyPayment
);

router.get(
  '/payments/:paymentId/receipt',
  authenticate,
  getPaymentReceipt
);

// Frontend-compatible simple routes
router.get('/', async (req, res, next) => {
  try {
    const result = await getPendingFees(req, res);
    return result;
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.params.studentId) {
      return getStudentFees(req, res, next);
    }
    res.json({ success: true, data: { id } });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    return createFee(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    return updateFee(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    return deleteFee(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Existing routes
router.get(
  '/overview',
  authenticate,
  getFeesOverviewValidation,
  getFeesOverview
);

router.post(
  '/collect',
  authenticate,
  authorize(['admin', 'accountant']),
  collectFeeValidation,
  collectFee
);

router.post(
  '/bulk',
  authenticate,
  authorize(['admin', 'accountant']),
  bulkCreateFeesValidation,
  bulkCreateFees
);

router.get(
  '/student/:studentId',
  authenticate,
  getStudentFeesValidation,
  getStudentFees
);

router.get(
  '/pending',
  authenticate,
  authorize(['admin', 'accountant']),
  getPendingFeesValidation,
  getPendingFees
);

router.post(
  '/reminders',
  authenticate,
  authorize(['admin', 'accountant']),
  sendRemindersValidation,
  sendReminders
);

router.get(
  '/report',
  authenticate,
  authorize(['admin', 'accountant', 'principal']),
  getFeesReportValidation,
  getFeesReport
);

router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'accountant']),
  updateFeeValidation,
  updateFee
);

router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  deleteFeeValidation,
  deleteFee
);

router.post(
  '/apply-late-fees',
  authenticate,
  authorize(['admin', 'accountant']),
  applyLateFees
);

export default router;
