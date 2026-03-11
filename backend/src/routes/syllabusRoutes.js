import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import syllabusController from '../controllers/syllabusController.js';

const router = express.Router();
router.use(authenticate);

router.post('/schools/:schoolId', syllabusController.default.createSyllabus);
router.get('/schools/:schoolId', syllabusController.default.getSyllabi);
router.get('/schools/:schoolId/class/:classId', syllabusController.default.getSyllabusByClass);
router.get('/schools/:schoolId/:syllabusId', syllabusController.default.getSyllabusById);
router.put('/schools/:schoolId/:syllabusId', syllabusController.default.updateSyllabus);
router.delete('/schools/:schoolId/:syllabusId', syllabusController.default.deleteSyllabus);
router.patch('/schools/:schoolId/:syllabusId/topic', syllabusController.default.markTopicComplete);

export default router;