import express from 'express';
import reportController from '../controllers/reportController.js';
const {
  getStudentReport,
  getAttendanceReport,
  getFeeReport,
  createReportTemplate,
  listReportTemplates,
  createScheduledReport,
  listScheduledReports,
  runScheduledReportNow
} = reportController;

import { authenticate } from '../middleware/authMiddleware.js';
import { validateTenantAccess } from '../middleware/multiTenant.js';

const router = express.Router();

router.use(authenticate);
router.use(validateTenantAccess);

// Student reports
router.get(
  '/student/:studentId',
  getStudentReport
);

// Attendance reports
router.get(
  '/attendance',
  getAttendanceReport
);

// Fee reports
router.get(
  '/fees',
  getFeeReport
);

// Scheduling helpers
router.use(authenticate);
router.use(validateTenantAccess);

router.post('/templates', createReportTemplate);
router.get('/templates', listReportTemplates);

router.post('/scheduled', createScheduledReport);
router.get('/scheduled', listScheduledReports);
router.post('/scheduled/:id/run', runScheduledReportNow);

export default router;
