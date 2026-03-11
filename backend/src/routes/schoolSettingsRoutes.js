import express from 'express';
import schoolSettingsController from '../controllers/schoolSettingsController.js';

import {
  createSchoolSettingsValidator,
  updateBasicInfoValidator,
  updateAcademicSettingsValidator,
  updateExamSettingsValidator,
  updateAttendanceSettingsValidator,
  updateFeeSettingsValidator,
  updateNotificationSettingsValidator,
  updateLogoValidator,
  updateStatusValidator,
  institutionIdValidator,
  getAllSchoolSettingsValidator
} from '../validators/schoolSettingsValidators.js';

const router = express.Router();

router.post('/', createSchoolSettingsValidator, schoolSettingsController.default.createSchoolSettings);
router.get('/', getAllSchoolSettingsValidator, schoolSettingsController.default.getAllSchoolSettings);
router.get('/statistics', schoolSettingsController.default.getSchoolSettingsStatistics);
router.get('/:id', schoolSettingsController.default.getSchoolSettingsById);
router.get('/institution/:institutionId', institutionIdValidator, schoolSettingsController.default.getSchoolSettingsByInstitution);
router.put('/institution/:institutionId', institutionIdValidator, schoolSettingsController.default.updateSchoolSettings);
router.patch('/institution/:institutionId/basic-info', updateBasicInfoValidator, schoolSettingsController.default.updateBasicInfo);
router.patch('/institution/:institutionId/academic', updateAcademicSettingsValidator, schoolSettingsController.default.updateAcademicSettings);
router.patch('/institution/:institutionId/exam', updateExamSettingsValidator, schoolSettingsController.default.updateExamSettings);
router.patch('/institution/:institutionId/attendance', updateAttendanceSettingsValidator, schoolSettingsController.default.updateAttendanceSettings);
router.patch('/institution/:institutionId/fee', updateFeeSettingsValidator, schoolSettingsController.default.updateFeeSettings);
router.patch('/institution/:institutionId/notification', updateNotificationSettingsValidator, schoolSettingsController.default.updateNotificationSettings);
router.patch('/institution/:institutionId/logo', updateLogoValidator, schoolSettingsController.default.updateLogo);
router.patch('/institution/:institutionId/status', updateStatusValidator, schoolSettingsController.default.updateStatus);
router.delete('/institution/:institutionId', institutionIdValidator, schoolSettingsController.default.deleteSchoolSettings);

export default router;