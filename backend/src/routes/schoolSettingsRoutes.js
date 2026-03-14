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

router.post('/', createSchoolSettingsValidator, schoolSettingsController.createSchoolSettings);
router.get('/', getAllSchoolSettingsValidator, schoolSettingsController.getAllSchoolSettings);
router.get('/statistics', schoolSettingsController.getSchoolSettingsStatistics);
router.get('/:id', schoolSettingsController.getSchoolSettingsById);
router.get('/institution/:institutionId', institutionIdValidator, schoolSettingsController.getSchoolSettingsByInstitution);
router.put('/institution/:institutionId', institutionIdValidator, schoolSettingsController.updateSchoolSettings);
router.patch('/institution/:institutionId/basic-info', updateBasicInfoValidator, schoolSettingsController.updateBasicInfo);
router.patch('/institution/:institutionId/academic', updateAcademicSettingsValidator, schoolSettingsController.updateAcademicSettings);
router.patch('/institution/:institutionId/exam', updateExamSettingsValidator, schoolSettingsController.updateExamSettings);
router.patch('/institution/:institutionId/attendance', updateAttendanceSettingsValidator, schoolSettingsController.updateAttendanceSettings);
router.patch('/institution/:institutionId/fee', updateFeeSettingsValidator, schoolSettingsController.updateFeeSettings);
router.patch('/institution/:institutionId/notification', updateNotificationSettingsValidator, schoolSettingsController.updateNotificationSettings);
router.patch('/institution/:institutionId/logo', updateLogoValidator, schoolSettingsController.updateLogo);
router.patch('/institution/:institutionId/status', updateStatusValidator, schoolSettingsController.updateStatus);
router.delete('/institution/:institutionId', institutionIdValidator, schoolSettingsController.deleteSchoolSettings);

export default router;