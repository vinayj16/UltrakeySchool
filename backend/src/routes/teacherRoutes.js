import express from 'express';
import teacherController from '../controllers/teacherController.js';
const {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherDetails,
  getTeacherRoutine,
  getTeacherLeaves,
  applyLeave,
  reviewLeave,
  getTeacherAttendance,
  getTeacherSalary,
  createSalary,
  updateSalaryStatus,
  getTeacherLibraryRecords,
  getTeacherDashboardData,
  getTeacherSidebarData
} = teacherController;

import {
  validateTeacherId,
  validateLeaveApplication,
  validateLeaveReview,
  validateRoutineQuery,
  validateAttendanceQuery,
  validateSalaryQuery,
  validateSalaryCreation,
  validateSalaryStatusUpdate,
  validateLibraryQuery,
  validateLeaveQuery
} from '../validators/teacherValidators.js';
import { authenticate } from '../middleware/auth.js';
import { validateTenantAccess } from '../middleware/multiTenant.js';

const router = express.Router();

router.use(authenticate);
router.use(validateTenantAccess);

// CRUD Routes - Basic teacher operations
router.get('/', getAllTeachers);
router.get('/:id', getTeacherById);
router.post('/', createTeacher);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);

// Teacher-specific operations (with teacherId parameter)
router.get(
  '/:teacherId/details',
  authenticate,
  validateTeacherId,
  getTeacherDetails
);

router.get(
  '/:teacherId/routine',
  authenticate,
  validateTeacherId,
  validateRoutineQuery,
  getTeacherRoutine
);

router.get(
  '/:teacherId/leaves',
  authenticate,
  validateTeacherId,
  validateLeaveQuery,
  getTeacherLeaves
);

router.post(
  '/:teacherId/leaves',
  authenticate,
  validateTeacherId,
  validateLeaveApplication,
  applyLeave
);

router.put(
  '/leaves/:leaveId/review',
  authenticate,
  validateLeaveReview,
  reviewLeave
);

router.get(
  '/:teacherId/attendance',
  authenticate,
  validateTeacherId,
  validateAttendanceQuery,
  getTeacherAttendance
);

router.get(
  '/:teacherId/salary',
  authenticate,
  validateTeacherId,
  validateSalaryQuery,
  getTeacherSalary
);

router.post(
  '/:teacherId/salary',
  authenticate,
  validateTeacherId,
  validateSalaryCreation,
  createSalary
);

router.put(
  '/salary/:salaryId/status',
  authenticate,
  validateSalaryStatusUpdate,
  updateSalaryStatus
);

router.get(
  '/:teacherId/library',
  authenticate,
  validateTeacherId,
  validateLibraryQuery,
  getTeacherLibraryRecords
);

router.get(
  '/:teacherId/dashboard',
  authenticate,
  validateTeacherId,
  getTeacherDashboardData
);

router.get(
  '/:teacherId/sidebar',
  authenticate,
  validateTeacherId,
  getTeacherSidebarData
);

export default router;
