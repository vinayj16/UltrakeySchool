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
  scholarshipController.default.createScholarship
);

router.get('/', scholarshipController.default.getScholarships);

router.get('/:id', scholarshipController.default.getScholarshipById);

router.put(
  '/:id',
  authorize(['super_admin', 'school_admin']),
  scholarshipController.default.updateScholarship
);

router.delete(
  '/:id',
  authorize(['super_admin', 'school_admin']),
  scholarshipController.default.deleteScholarship
);

// Scholarship Applications
router.post('/apply', scholarshipController.default.applyForScholarship);

router.get('/applications/list', scholarshipController.default.getApplications);

router.put(
  '/applications/:id/review',
  authorize(['super_admin', 'school_admin']),
  scholarshipController.default.reviewApplication
);

router.post(
  '/applications/:id/disburse',
  authorize(['super_admin', 'school_admin', 'accountant']),
  scholarshipController.default.disburseScholarship
);

// Statistics
router.get(
  '/stats/summary',
  authorize(['super_admin', 'school_admin']),
  scholarshipController.default.getScholarshipStatistics
);

// Check Eligibility
router.post('/:scholarshipId/check-eligibility', scholarshipController.default.checkEligibility);

export default router;
