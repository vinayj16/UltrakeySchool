import express from 'express';
import * as realtimeDashboardController from '../controllers/realtimeDashboardController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authGuard.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Refresh user dashboard
router.post('/refresh', realtimeDashboardController.refreshDashboard);

// Refresh institution dashboard
router.post(
  '/refresh/institution',
  authorize(['super_admin', 'school_admin']),
  realtimeDashboardController.refreshInstitutionDashboard
);

// Update attendance statistics
router.post(
  '/stats/attendance',
  authorize(['super_admin', 'school_admin', 'teacher']),
  realtimeDashboardController.updateAttendanceStats
);

// Update fee statistics
router.post(
  '/stats/fees',
  authorize(['super_admin', 'school_admin', 'accountant']),
  realtimeDashboardController.updateFeeStats
);

// Update exam statistics
router.post(
  '/stats/exams',
  authorize(['super_admin', 'school_admin', 'teacher']),
  realtimeDashboardController.updateExamStats
);

// Send custom statistics update
router.post(
  '/stats/custom',
  authorize(['super_admin', 'school_admin']),
  realtimeDashboardController.sendStatsUpdate
);

export default router;
