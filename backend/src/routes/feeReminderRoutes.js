import express from 'express';
import * as feeReminderController from '../controllers/feeReminderController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authGuard.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Send fee reminders
router.post(
  '/send',
  authorize(['super_admin', 'school_admin', 'accountant']),
  feeReminderController.sendFeeReminders
);

// Send bulk reminders
router.post(
  '/send/bulk',
  authorize(['super_admin', 'school_admin', 'accountant']),
  feeReminderController.sendBulkReminders
);

// Schedule automatic reminders
router.post(
  '/schedule',
  authorize(['super_admin', 'school_admin']),
  feeReminderController.scheduleAutomaticReminders
);

// Get reminder statistics
router.get(
  '/stats',
  authorize(['super_admin', 'school_admin', 'accountant']),
  feeReminderController.getReminderStatistics
);

export default router;
