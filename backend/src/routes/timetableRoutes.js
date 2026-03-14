import express from 'express';
import timetableController from '../controllers/timetableController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authGuard.js';
import { validate } from '../middleware/errorHandler.js';
import * as validators from '../validators/timetableValidators.js';

const router = express.Router();

router.use(authenticate);

router.post('/', 
  authorize(['admin', 'principal']),
  validators.createTimetableValidator,
  validate, 
  timetableController.createTimetable
);

router.get('/', 
  authorize(['admin', 'principal', 'teacher', 'student']),
  validators.getTimetablesValidator,
  validate, 
  timetableController.getTimetables
);

router.get('/:timetableId', 
  authorize(['admin', 'principal', 'teacher', 'student']),
  validators.timetableIdValidator,
  validate, 
  timetableController.getTimetableById
);

router.put('/:timetableId', 
  authorize(['admin', 'principal']),
  validators.updateTimetableValidator,
  validate, 
  timetableController.updateTimetable
);

router.delete('/:timetableId', 
  authorize(['admin', 'principal']),
  validators.timetableIdValidator,
  validate, 
  timetableController.deleteTimetable
);

router.get('/class/:classId', 
  authorize(['admin', 'principal', 'teacher', 'student']),
  validators.classIdValidator,
  validate, 
  timetableController.getTimetableByClass
);

router.get('/teacher/:teacherId', 
  authorize(['admin', 'principal', 'teacher']),
  validators.teacherIdValidator,
  validate, 
  timetableController.getTimetableByTeacher
);

router.get('/school/:schoolId', 
  authorize(['admin', 'principal']),
  validators.schoolIdValidator,
  validate, 
  timetableController.getTimetablesBySchool
);

export default router;
