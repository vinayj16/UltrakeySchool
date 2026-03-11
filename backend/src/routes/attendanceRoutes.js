import express from 'express';
import attendanceController from '../controllers/attendanceController.js';
const {
  getAttendanceStats,
  markAttendance,
  getAttendanceHistory,
  getBulkAttendance
} = attendanceController;

import { authenticate, authorize } from '../middleware/authMiddleware.js';
import {
  markAttendanceValidation,
  getStatsValidation,
  getHistoryValidation,
  getBulkAttendanceValidation
} from '../validators/attendanceValidators.js';

const router = express.Router();

router.use(authenticate);

// Frontend-compatible simple routes
router.get('/', async (req, res, next) => {
  try {
    const { schoolId, date, userType } = req.query;
    return getAttendanceHistory(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    return markAttendance(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    return markAttendance(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Existing routes
router.get(
  '/stats',
  authenticate,
  getStatsValidation,
  getAttendanceStats
);

// Mark attendance for a user
router.post(
  '/mark',
  authenticate,
  authorize(['admin', 'teacher', 'principal']),
  markAttendanceValidation,
  markAttendance
);

// Get attendance history for a user
router.get(
  '/history',
  authenticate,
  getHistoryValidation,
  getAttendanceHistory
);

// Get bulk attendance for a specific date and user type
router.get(
  '/bulk',
  authenticate,
  authorize(['admin', 'teacher', 'principal']),
  getBulkAttendanceValidation,
  getBulkAttendance
);

export default router;
