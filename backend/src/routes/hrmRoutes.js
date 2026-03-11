import express from 'express';
const router = express.Router();
import hrmController from '../controllers/hrmController.js';
import holidayController from '../controllers/holidayController.js';
import leaveTypeController from '../controllers/leaveTypeController.js';
import payrollController from '../controllers/payrollController.js';
import staffDocumentController, { upload } from '../controllers/staffDocumentController.js';
import hrmValidators from '../validators/hrmValidators.js';
import { validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Staff Routes
router.post('/staff', hrmValidators.createStaff, validate, hrmController.createStaff);
router.get('/staff', hrmController.getAllStaff);
router.get('/staff/search', hrmController.searchStaff);
router.get('/staff/:id', hrmController.getStaffById);
router.put('/staff/:id', hrmValidators.updateStaff, validate, hrmController.updateStaff);
router.delete('/staff/:id', hrmController.deleteStaff);
router.get('/staff/department/:departmentId', hrmController.getStaffByDepartment);
router.put('/staff/:id/salary', hrmController.updateSalary);
router.post('/staff/:id/attendance', hrmController.addAttendance);
router.get('/staff/:id/leave-balance', hrmController.getLeaveBalance);
router.get('/staff/:id/attendance-summary', hrmValidators.getAttendanceSummary, validate, hrmController.getAttendanceSummary);

// Department Routes
router.post('/departments', hrmValidators.createDepartment, validate, hrmController.createDepartment);
router.get('/departments', hrmController.getAllDepartments);
router.get('/departments/:id', hrmController.getDepartmentById);
router.put('/departments/:id', hrmController.updateDepartment);
router.delete('/departments/:id', hrmController.deleteDepartment);

// Designation Routes
router.post('/designations', hrmValidators.createDesignation, validate, hrmController.createDesignation);
router.get('/designations', hrmController.getAllDesignations);
router.get('/designations/:id', hrmController.getDesignationById);
router.put('/designations/:id', hrmController.updateDesignation);
router.delete('/designations/:id', hrmController.deleteDesignation);

// Leave Routes
router.post('/leaves', hrmValidators.createLeave, validate, hrmController.createLeave);
router.get('/leaves', hrmController.getAllLeaves);
router.get('/leaves/pending', hrmController.getPendingLeaves);
router.get('/leaves/:id', hrmController.getLeaveById);
router.put('/leaves/:id', hrmController.updateLeave);
router.delete('/leaves/:id', hrmController.deleteLeave);
router.post('/leaves/:id/approve', hrmValidators.approveLeave, validate, hrmController.approveLeave);
router.post('/leaves/:id/reject', hrmValidators.rejectLeave, validate, hrmController.rejectLeave);

// Approvals Routes (alias for pending leaves)
router.get('/approvals', hrmController.getPendingLeaves);
router.post('/approvals/:id/approve', hrmValidators.approveLeave, validate, hrmController.approveLeave);
router.post('/approvals/:id/reject', hrmValidators.rejectLeave, validate, hrmController.rejectLeave);

// Analytics & Reports
router.get('/analytics/stats', hrmController.getHRMStats);
router.get('/analytics/payroll', hrmValidators.getPayrollReport, validate, hrmController.getPayrollReport);

// Holiday Routes
router.post('/holidays', holidayController.create);
router.get('/holidays', holidayController.getAll);
router.get('/holidays/:id', holidayController.getById);
router.put('/holidays/:id', holidayController.update);
router.delete('/holidays/:id', holidayController.deleteHoliday);

// Leave Type Routes
router.post('/leave-types', leaveTypeController.createLeaveType);
router.get('/leave-types', leaveTypeController.getAllLeaveTypes);
router.get('/leave-types/:id', leaveTypeController.getLeaveTypeById);
router.put('/leave-types/:id', leaveTypeController.updateLeaveType);
router.delete('/leave-types/:id', leaveTypeController.deleteLeaveType);

// Payroll Routes
router.post('/payroll', payrollController.create);
router.get('/payroll', payrollController.getAll);
router.get('/payroll/:id', payrollController.getById);
router.put('/payroll/:id', payrollController.update);
router.delete('/payroll/:id', payrollController.delete);

// Staff Document Routes
router.post('/staff-documents', upload, staffDocumentController.createStaffDocument);
router.get('/staff-documents', staffDocumentController.getAllStaffDocuments);
router.get('/staff-documents/:id', staffDocumentController.getStaffDocumentById);
router.get('/staff-documents/:id/download', staffDocumentController.downloadStaffDocument);
router.put('/staff-documents/:id', staffDocumentController.updateStaffDocument);
router.delete('/staff-documents/:id', staffDocumentController.deleteStaffDocument);

export default router;
