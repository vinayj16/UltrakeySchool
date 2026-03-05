import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as classTimetableController from '../controllers/classTimetableController.js';

const router = express.Router();
router.use(authenticate);

router.post('/schools/:schoolId', classTimetableController.createTimetable);
router.get('/schools/:schoolId', classTimetableController.getTimetables);
router.get('/schools/:schoolId/class/:classId/weekly', classTimetableController.getWeeklyTimetable);
router.get('/schools/:schoolId/class/:classId/day/:day', classTimetableController.getTimetableByDay);
router.get('/schools/:schoolId/:timetableId', classTimetableController.getTimetableById);
router.put('/schools/:schoolId/:timetableId', classTimetableController.updateTimetable);
router.delete('/schools/:schoolId/:timetableId', classTimetableController.deleteTimetable);

export default router;
