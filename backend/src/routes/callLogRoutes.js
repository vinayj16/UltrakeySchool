import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import callLogController from '../controllers/callLogController.js';

const router = express.Router();
router.use(authenticate);

router.post('/schools/:schoolId', callLogController.createCallLog);
router.get('/schools/:schoolId', callLogController.getCallLogs);
router.get('/schools/:schoolId/user/:userId', callLogController.getCallLogsByUser);
router.get('/schools/:schoolId/:callId', callLogController.getCallLogById);
router.get('/schools/:schoolId/analytics', callLogController.getCallAnalytics);

export default router;
