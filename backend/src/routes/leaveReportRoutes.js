import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import leaveReportController from '../controllers/leaveReportController.js';

const router = express.Router();
router.use(authenticate);

// Get leave report for all students in a school
router.get('/schools/:schoolId', leaveReportController.getLeaveReport);

// Get leave summary for a specific student
router.get('/students/:studentId', leaveReportController.getStudentLeaveSummary);

export default router;
