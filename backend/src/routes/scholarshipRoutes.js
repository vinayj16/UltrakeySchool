import express from 'express';
import scholarshipController from '../controllers/scholarshipController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authGuard.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Scholarship Management
router.post(
  '/',
  authorize(['super_admin', 'school_admin']),
  scholarshipController.createScholarship
);

router.get('/', scholarshipController.getScholarships);

router.get('/:id', scholarshipController.getScholarshipById);

router.put(
  '/:id',
  authorize(['super_admin', 'school_admin']),
  scholarshipController.updateScholarship
);

router.delete(
  '/:id',
  authorize(['super_admin', 'school_admin']),
  scholarshipController.deleteScholarship
);

// Scholarship Applications
router.post('/apply', scholarshipController.applyForScholarship);

router.get('/applications/list', scholarshipController.getApplications);

router.put(
  '/applications/:id/review',
  authorize(['super_admin', 'school_admin']),
  scholarshipController.reviewApplication
);

router.post(
  '/applications/:id/disburse',
  authorize(['super_admin', 'school_admin', 'accountant']),
  scholarshipController.disburseScholarship
);

// Statistics
router.get(
  '/stats/summary',
  authorize(['super_admin', 'school_admin']),
  scholarshipController.getScholarshipStatistics
);

// Check Eligibility
router.post('/:scholarshipId/check-eligibility', scholarshipController.checkEligibility);

export default router;
