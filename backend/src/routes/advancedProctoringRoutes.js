import express from 'express';
import advancedProctoringController from '../controllers/advancedProctoringController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/sessions', advancedProctoringController.startSession);
router.get('/sessions', advancedProctoringController.getSessions);
router.get('/sessions/:sessionId', advancedProctoringController.getSessionById);
router.post('/sessions/:sessionId/violations', advancedProctoringController.recordViolation);
router.post('/sessions/:sessionId/screenshots', advancedProctoringController.analyzeScreenshot);
router.put('/sessions/:sessionId/end', advancedProctoringController.endSession);
router.put('/sessions/:sessionId/webcam', advancedProctoringController.updateWebcamStatus);
router.get('/statistics', advancedProctoringController.getStatistics);

export default router;
