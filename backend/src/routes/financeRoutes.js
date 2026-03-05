import express from 'express';
import financeController from '../controllers/financeController.js';
const {
  feeStructureController,
  invoiceController,
  transactionController,
  budgetController,
  salaryController,
  paymentController,
  dashboardController,
  expenseCategoryController,
  taxRateController
} = financeController;

import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateTenantAccess } from '../middleware/multiTenant.js';

const router = express.Router();

// Apply tenant middleware to all routes
router.use(authenticate);
router.use(validateTenantAccess);

// Fee Structure Routes - Accountant and above
router.post('/fees',
  authorize('accountant', 'school_admin', 'institution_admin', 'superadmin'),
  feeStructureController.create
);

router.get('/fees',
  authorize('accountant', 'school_admin', 'institution_admin', 'superadmin', 'teacher', 'student', 'parent'),
  feeStructureController.getAll
);

router.get('/fees/:id',
  authorize('accountant', 'school_admin', 'institution_admin', 'superadmin', 'teacher', 'student', 'parent'),
  feeStructureController.getById
);

router.put('/fees/:id',
  authorize('accountant', 'school_admin', 'institution_admin', 'superadmin'),
  feeStructureController.update
);

router.delete('/fees/:id',
  authorize('accountant', 'school_admin', 'institution_admin', 'superadmin'),
  feeStructureController.delete
);

// Invoice Routes - Accountant and above
router.post('/invoices',
  authorize('accountant', 'school_admin', 'institution_admin', 'superadmin'),
  invoiceController.create
);

router.get('/invoices',
  authorize('accountant', 'school_admin', 'institution_admin', 'superadmin', 'teacher', 'student', 'parent'),
  invoiceController.getAll
);

router.get('/invoices/:id',
  authorize('accountant', 'school_admin', 'institution_admin', 'superadmin', 'teacher', 'student', 'parent'),
  invoiceController.getById
);

router.put('/invoices/:id',
  authorize('accountant', 'school_admin', 'institution_admin', 'superadmin'),
  invoiceController.update
);

router.put('/invoices/:id/pay',
  authorize('accountant', 'school_admin', 'institution_admin', 'superadmin'),
  invoiceController.markAsPaid
);

// Transaction Routes - Accountant and above
router.get('/transactions',
  authorize('accountant', 'school_admin', 'institution_admin', 'superadmin'),
  transactionController.getAll
);

// Budget Routes - Accountant and above
router.post('/budgets',
  authorize('accountant', 'school_admin', 'institution_admin', 'superadmin'),
  budgetController.create
);

router.get('/budgets',
  authorize('accountant', 'school_admin', 'institution_admin', 'superadmin'),
  budgetController.getAll
);

// Expense Category Routes
router.get('/expenses/categories',
  authorize('accountant', 'school_admin', 'institution_admin', 'superadmin'),
  expenseCategoryController.getExpenseCategories
);

// Tax Rates (Financial Settings)
router.get('/tax-rates',
  authorize('accountant', 'school_admin', 'institution_admin', 'superadmin'),
  taxRateController.getTaxRates
);

// Salary Routes - Accountant and HR Manager
router.post('/salaries',
  authorize('accountant', 'hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  salaryController.processSalary
);

router.get('/salaries',
  authorize('accountant', 'hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  salaryController.getAll
);

// Dashboard Routes - Accountant specific
router.get('/dashboard',
  authorize('accountant', 'school_admin', 'institution_admin', 'superadmin'),
  dashboardController.getDashboardData
);

// Payment Routes - All authenticated users
// Create payment intent for invoice
router.post('/payments/intent/:invoiceId',
  paymentController.createPaymentIntent
);

// Create checkout session for invoice
router.post('/payments/checkout/:invoiceId',
  paymentController.createCheckoutSession
);

// Handle Stripe webhooks (no auth needed for webhooks)
router.post('/payments/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

// Process refund (Accountant and above)
router.post('/payments/refund',
  authorize('accountant', 'school_admin', 'institution_admin', 'superadmin'),
  paymentController.processRefund
);

// Get payment history
router.get('/payments/history',
  paymentController.getPaymentHistory
);

// Get payment methods
router.get('/payments/methods',
  paymentController.getPaymentMethods
);

export default router;
