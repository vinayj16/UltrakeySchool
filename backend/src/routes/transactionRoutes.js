import express from 'express';
import transactionController from '../controllers/transactionController.js';
import * as validators from '../validators/transactionValidators.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validationResult } from 'express-validator';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/', authenticate, validators.transactionFiltersValidator, validate, transactionController.getAllTransactions);

router.get('/analytics/revenue', authenticate, validators.revenueAnalyticsValidator, validate, transactionController.getRevenueAnalytics);

router.get('/stats', authenticate, transactionController.getTransactionStats);

router.get('/:transactionId', authenticate, validators.transactionIdValidator, validate, transactionController.getTransactionById);

router.get('/schools/:schoolId', authenticate, validators.schoolIdValidator, validate, validators.transactionFiltersValidator, validate, transactionController.getSchoolTransactions);

router.post('/:transactionId/refund', authenticate, validators.createRefundValidator, validate, transactionController.createRefund);

export default router;
