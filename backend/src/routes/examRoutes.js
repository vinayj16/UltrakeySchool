import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import * as examController from '../controllers/examController.js';

const router = express.Router();
router.use(authenticate);

// Frontend-compatible simple routes
router.get('/', examController.getExams);
router.get('/:id', examController.getExamById);
router.post('/', examController.createExam);
router.put('/:id', examController.updateExam);
router.delete('/:id', examController.deleteExam);

// Existing routes
router.post('/schools/:schoolId', examController.createExam);
router.get('/schools/:schoolId', examController.getExams);
router.get('/schools/:schoolId/class/:classId', examController.getExamsByClass);
router.get('/schools/:schoolId/:examId', examController.getExamById);
router.put('/schools/:schoolId/:examId', examController.updateExam);
router.delete('/schools/:schoolId/:examId', examController.deleteExam);
router.post('/schools/:schoolId/:examId/attendance', examController.markAttendance);
router.get('/schools/:schoolId/:examId/attendance', examController.getAttendance);

export default router;
