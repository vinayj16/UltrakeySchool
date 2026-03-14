import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import calendarController from '../controllers/calendarController.js';

const router = express.Router();
router.use(authenticate);

router.get('/schools/:schoolId/events', calendarController.getCalendarEvents);
router.get('/schools/:schoolId/analytics', calendarController.getCalendarAnalytics);

export default router;
