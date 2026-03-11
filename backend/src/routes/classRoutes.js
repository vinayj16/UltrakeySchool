import express from 'express';
import classController from '../controllers/classController.js';
import * as validators from '../validators/classValidators.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', validators.createClassValidator, classController.createClass);
router.get('/', classController.getAllClasses);
router.get('/statistics', classController.getClassStatistics);
router.get('/search', validators.searchValidator, classController.searchClasses);
router.get('/status/:status', classController.getClassesByStatus);
router.get('/institution/:institutionId', classController.getClassesByInstitution);
router.get('/teacher/:teacherId', classController.getClassesByTeacher);
router.get('/classId/:classId', classController.getClassByClassId);
router.get('/:id', validators.classIdValidator, classController.getClassById);
router.put('/:id', validators.classIdValidator, validators.updateClassValidator, classController.updateClass);
router.delete('/:id', validators.classIdValidator, classController.deleteClass);
router.patch('/:id/students', validators.classIdValidator, classController.updateStudentCount);
router.patch('/:id/subjects', validators.classIdValidator, classController.updateSubjectCount);
router.patch('/:id/teacher', validators.classIdValidator, classController.assignClassTeacher);
router.patch('/bulk/status', classController.bulkUpdateStatus);

export default router;
