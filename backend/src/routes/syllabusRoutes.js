import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import syllabusController from '../controllers/syllabusController.js';

const router = express.Router();
router.use(authenticate);

router.post('/schools/:schoolId', syllabusController.createSyllabus);
router.get('/schools/:schoolId', syllabusController.getSyllabi);
router.get('/schools/:schoolId/class/:classId', syllabusController.getSyllabusByClass);
router.get('/schools/:schoolId/:syllabusId', syllabusController.getSyllabusById);
router.put('/schools/:schoolId/:syllabusId', syllabusController.updateSyllabus);
router.delete('/schools/:schoolId/:syllabusId', syllabusController.deleteSyllabus);
router.patch('/schools/:schoolId/:syllabusId/topic', syllabusController.markTopicComplete);

export default router;