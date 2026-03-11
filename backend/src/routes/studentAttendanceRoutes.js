import express from 'express';
import studentAttendanceController from '../controllers/studentAttendanceController.js';
import * as validators from '../validators/studentAttendanceValidators.js';

const router = express.Router();

router.post('/', validators.markAttendanceValidator, studentAttendanceController.default.markAttendance);
router.post('/bulk', validators.bulkMarkAttendanceValidator, studentAttendanceController.default.bulkMarkAttendance);
router.get('/', validators.queryValidator, studentAttendanceController.default.getAllAttendance);
router.get('/statistics', validators.queryValidator, studentAttendanceController.default.getAttendanceStatistics);
router.get('/defaulters', studentAttendanceController.default.getDefaultersList);
router.get('/monthly-report', studentAttendanceController.default.getMonthlyAttendanceReport);
router.get('/date/:date', validators.dateValidator, studentAttendanceController.default.getAttendanceByDate);
router.get('/student/:studentId', validators.studentIdValidator, studentAttendanceController.default.getStudentAttendance);
router.get('/student/:studentId/percentage', validators.studentIdValidator, studentAttendanceController.default.getStudentAttendancePercentage);
router.get('/class/:className/:section/:date', validators.classReportValidator, studentAttendanceController.default.getClassAttendanceReport);
router.get('/:id', validators.idValidator, studentAttendanceController.default.getAttendanceById);
router.put('/:id', validators.updateAttendanceValidator, studentAttendanceController.default.updateAttendance);
router.delete('/:id', validators.idValidator, studentAttendanceController.default.deleteAttendance);

export default router;