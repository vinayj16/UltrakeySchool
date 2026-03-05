import express from 'express';
import schoolSettingsController from '../controllers/schoolSettingsController.js';
const {
  createSchoolSettings,
  getSchoolSettingsById,
  getSchoolSettingsByInstitution,
  updateSchoolSettings,
  updateBasicInfo,
  updateAcademicSettings,
  updateExamSettings,
  updateAttendanceSettings,
  updateFeeSettings,
  updateNotificationSettings,
  updateLogo,
  updateStatus,
  getAllSchoolSettings,
  deleteSchoolSettings,
  getSchoolSettingsStatistics
} = schoolSettingsController;

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

router.post('/', createSchoolSettingsValidator, createSchoolSettings);
router.get('/', getAllSchoolSettingsValidator, getAllSchoolSettings);
router.get('/statistics', getSchoolSettingsStatistics);
router.get('/:id', getSchoolSettingsById);
router.get('/institution/:institutionId', institutionIdValidator, getSchoolSettingsByInstitution);
router.put('/institution/:institutionId', institutionIdValidator, updateSchoolSettings);
router.patch('/institution/:institutionId/basic-info', updateBasicInfoValidator, updateBasicInfo);
router.patch('/institution/:institutionId/academic', updateAcademicSettingsValidator, updateAcademicSettings);
router.patch('/institution/:institutionId/exam', updateExamSettingsValidator, updateExamSettings);
router.patch('/institution/:institutionId/attendance', updateAttendanceSettingsValidator, updateAttendanceSettings);
router.patch('/institution/:institutionId/fee', updateFeeSettingsValidator, updateFeeSettings);
router.patch('/institution/:institutionId/notification', updateNotificationSettingsValidator, updateNotificationSettings);
router.patch('/institution/:institutionId/logo', updateLogoValidator, updateLogo);
router.patch('/institution/:institutionId/status', updateStatusValidator, updateStatus);
router.delete('/institution/:institutionId', institutionIdValidator, deleteSchoolSettings);

export default router;
