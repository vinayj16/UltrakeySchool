import express from 'express';
import studentAttendanceController from '../controllers/studentAttendanceController.js';
import * as validators from '../validators/studentAttendanceValidators.js';

const router = express.Router();

router.post('/', validators.markAttendanceValidator, studentAttendanceController.markAttendance);
router.post('/bulk', validators.bulkMarkAttendanceValidator, studentAttendanceController.bulkMarkAttendance);
router.get('/', validators.queryValidator, studentAttendanceController.getAllAttendance);
router.get('/statistics', validators.queryValidator, studentAttendanceController.getAttendanceStatistics);
router.get('/defaulters', studentAttendanceController.getDefaultersList);
router.get('/monthly-report', studentAttendanceController.getMonthlyAttendanceReport);
router.get('/date/:date', validators.dateValidator, studentAttendanceController.getAttendanceByDate);
router.get('/student/:studentId', validators.studentIdValidator, studentAttendanceController.getStudentAttendance);
router.get('/student/:studentId/percentage', validators.studentIdValidator, studentAttendanceController.getStudentAttendancePercentage);
router.get('/class/:className/:section/:date', validators.classReportValidator, studentAttendanceController.getClassAttendanceReport);
router.get('/:id', validators.idValidator, studentAttendanceController.getAttendanceById);
router.put('/:id', validators.updateAttendanceValidator, studentAttendanceController.updateAttendance);
router.delete('/:id', validators.idValidator, studentAttendanceController.deleteAttendance);

export default router;