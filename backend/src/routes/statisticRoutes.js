import express from 'express';
import statisticController from '../controllers/statisticController.js';
const {
  getStatistic,
  getAllStatistics,
  refreshStatistic,
  refreshAllStatistics,
  acknowledgeAlert,
  getStatisticHistory
} = statisticController;

import { authenticate, authorize } from '../middleware/auth.js';
import {
  getStatisticValidation,
  refreshStatisticValidation,
  acknowledgeAlertValidation,
  getStatisticHistoryValidation
} from '../validators/statisticValidators.js';
import statisticService from '../services/statisticService.js';

const router = express.Router();

router.use(authenticate);

// Frontend-compatible routes
router.get('/dashboard', async (req, res, next) => {
  try {
    const data = await statisticService.getDashboardData(req.user.schoolId, req.query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/students', async (req, res, next) => {
  try {
    const data = await statisticService.getStudentStats(req.user.schoolId, req.query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/teachers', async (req, res, next) => {
  try {
    const data = await statisticService.getTeacherStats(req.user.schoolId, req.query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get('/attendance', async (req, res, next) => {
  try {
    const data = await statisticService.getAttendanceStats(req.user.schoolId, req.query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Existing routes
router.get(
  '/',
  getAllStatistics
);

router.get(
  '/:statId',
  authenticate,
  getStatisticValidation,
  getStatistic
);

router.get(
  '/:statId/history',
  authenticate,
  getStatisticHistoryValidation,
  getStatisticHistory
);

router.post(
  '/:statId/refresh',
  authenticate,
  authorize(['admin', 'principal']),
  refreshStatisticValidation,
  refreshStatistic
);

router.post(
  '/refresh-all',
  authenticate,
  authorize(['admin', 'principal']),
  refreshAllStatistics
);

router.post(
  '/:statId/alerts/:alertId/acknowledge',
  authenticate,
  acknowledgeAlertValidation,
  acknowledgeAlert
);

export default router;
