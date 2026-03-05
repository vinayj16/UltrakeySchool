import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as subjectController from '../controllers/subjectController.js';

const router = express.Router();
router.use(authenticate);

// Routes with schoolId parameter (existing routes)
router.post('/schools/:schoolId', subjectController.createSubject);
router.get('/schools/:schoolId', subjectController.getSubjects);
router.get('/schools/:schoolId/search', subjectController.searchSubjects);
router.get('/schools/:schoolId/department/:department', subjectController.getSubjectsByDepartment);
router.get('/schools/:schoolId/:subjectId', subjectController.getSubjectById);
router.put('/schools/:schoolId/:subjectId', subjectController.updateSubject);
router.delete('/schools/:schoolId/:subjectId', subjectController.deleteSubject);

// Simple CRUD routes for frontend compatibility
router.get('/', subjectController.getSubjects);
router.get('/search', subjectController.searchSubjects);
router.get('/:subjectId', subjectController.getSubjectById);
router.post('/', subjectController.createSubject);
router.put('/:subjectId', subjectController.updateSubject);
router.delete('/:subjectId', subjectController.deleteSubject);

export default router;
