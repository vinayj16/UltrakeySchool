import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import * as homeWorkController from '../controllers/homeWorkController.js';
import * as validators from '../validators/homeWorkValidators.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);
router.use(authorize(['superadmin', 'schooladmin', 'teacher']));

// Frontend-compatible simple routes
router.get('/', homeWorkController.getHomeWorks);
router.get('/:id', homeWorkController.getHomeWorkById);
router.post('/', homeWorkController.createHomeWork);
router.put('/:id', homeWorkController.updateHomeWork);
router.delete('/:id', homeWorkController.deleteHomeWork);

// CRUD operations with schoolId
router.get('/schools/:schoolId',
  validators.getHomeWorksValidator,
  validate,
  homeWorkController.getHomeWorks
);

router.post('/schools/:schoolId',
  validators.createHomeWorkValidator,
  validate,
  homeWorkController.createHomeWork
);

router.get('/schools/:schoolId/search',
  validators.searchHomeWorkValidator,
  validate,
  homeWorkController.getHomeWorks
);

router.get('/schools/:schoolId/analytics',
  homeWorkController.getAnalytics
);

router.get('/schools/:schoolId/pending',
  homeWorkController.getPendingHomeWorks
);

router.get('/schools/:schoolId/:homeWorkId',
  validators.homeWorkIdValidator,
  validate,
  homeWorkController.getHomeWorkById
);

router.put('/schools/:schoolId/:homeWorkId',
  validators.updateHomeWorkValidator,
  validate,
  homeWorkController.updateHomeWork
);

router.delete('/schools/:schoolId/:homeWorkId',
  validators.homeWorkIdValidator,
  validate,
  homeWorkController.deleteHomeWork
);

// Filter routes
router.get('/schools/:schoolId/class/:classId',
  validators.classIdValidator,
  validate,
  homeWorkController.getHomeWorksByClass
);

router.get('/schools/:schoolId/teacher/:teacherId',
  validators.teacherIdValidator,
  validate,
  homeWorkController.getHomeWorksByTeacher
);

router.get('/schools/:schoolId/subject/:subjectId',
  validators.subjectIdValidator,
  validate,
  homeWorkController.getHomeWorksBySubject
);

// Submission routes
router.post('/schools/:schoolId/:homeWorkId/submit',
  validators.submitHomeWorkValidator,
  validate,
  homeWorkController.submitHomeWork
);

router.post('/schools/:schoolId/:homeWorkId/grade',
  validators.gradeSubmissionValidator,
  validate,
  homeWorkController.gradeSubmission
);

export default router;
