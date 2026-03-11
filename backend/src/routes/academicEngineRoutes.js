import express from 'express';
import academicEngineController from '../controllers/academicEngineController.js';

const router = express.Router();

router.get('/structure/:type', academicEngineController.default.getAcademicStructure);
router.get('/modules/:type', academicEngineController.default.getAvailableModules);
router.get('/grouping/:type', academicEngineController.default.getStudentGroupingLogic);
router.get('/attendance/:type', academicEngineController.default.getAttendanceRules);
router.get('/exam/:type', academicEngineController.default.getExamSystem);
router.get('/roles/:type', academicEngineController.default.getRequiredRoles);
router.get('/configs/:type', academicEngineController.default.getAllConfigs);

export default router;
