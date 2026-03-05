import express from 'express';
import videoConferencingController from '../controllers/videoConferencingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', videoConferencingController.createConference);
router.get('/', videoConferencingController.getConferences);
router.get('/statistics', videoConferencingController.getStatistics);
router.get('/:conferenceId', videoConferencingController.getConferenceById);
router.put('/:conferenceId/start', videoConferencingController.startConference);
router.put('/:conferenceId/end', videoConferencingController.endConference);
router.post('/:conferenceId/join', videoConferencingController.joinConference);
router.post('/:conferenceId/leave', videoConferencingController.leaveConference);
router.put('/:conferenceId/cancel', videoConferencingController.cancelConference);

export default router;
