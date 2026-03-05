import express from 'express';
import * as academicEngineController from '../controllers/academicEngineController.js';

const router = express.Router();

router.get('/structure/:type', academicEngineController.getAcademicStructure);
router.get('/modules/:type', academicEngineController.getAvailableModules);
router.get('/grouping/:type', academicEngineController.getStudentGroupingLogic);
router.get('/attendance/:type', academicEngineController.getAttendanceRules);
router.get('/exam/:type', academicEngineController.getExamSystem);
router.get('/roles/:type', academicEngineController.getRequiredRoles);
router.get('/configs/:type', academicEngineController.getAllConfigs);

export default router;
