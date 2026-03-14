import express from 'express';
import admissionController from '../controllers/admissionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Application management
router.post('/applications', admissionController.submitApplication);
router.get('/applications', admissionController.getApplications);
router.get('/applications/:id', admissionController.getApplicationById);
router.put('/applications/:id', admissionController.updateApplication);
router.post('/applications/:id/review', admissionController.reviewApplication);
router.post('/applications/:id/approve', admissionController.approveApplication);
router.post('/applications/:id/reject', admissionController.rejectApplication);

// Entrance test
router.post('/applications/:id/schedule-test', admissionController.scheduleEntranceTest);
router.post('/applications/:id/test-result', admissionController.submitEntranceTestResult);

// Merit list
router.post('/merit-list/generate', admissionController.generateMeritList);
router.get('/merit-list', admissionController.getMeritList);

// Seats
router.get('/seats', admissionController.getAvailableSeats);
router.post('/seats/allocate', admissionController.allocateSeat);

// Criteria
router.get('/criteria', admissionController.getAdmissionCriteria);
router.post('/criteria', admissionController.setAdmissionCriteria);

// Statistics
router.get('/statistics', admissionController.getAdmissionStatistics);

export default router;
