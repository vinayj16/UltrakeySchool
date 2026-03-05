import express from 'express';
import * as idCardController from '../controllers/idCardController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authGuard.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Generate my ID card (any authenticated user)
router.get('/me', idCardController.generateMyIDCard);

// Generate student ID card
router.get(
  '/student/:studentId',
  authorize(['super_admin', 'school_admin', 'principal', 'teacher']),
  idCardController.generateStudentIDCard
);

// Generate teacher ID card
router.get(
  '/teacher/:teacherId',
  authorize(['super_admin', 'school_admin', 'principal']),
  idCardController.generateTeacherIDCard
);

// Generate staff ID card
router.get(
  '/staff/:staffId',
  authorize(['super_admin', 'school_admin', 'hr_manager']),
  idCardController.generateStaffIDCard
);

// Verify ID card
router.post('/verify', idCardController.verifyIDCard);

// Generate bulk ID cards
router.post(
  '/bulk',
  authorize(['super_admin', 'school_admin']),
  idCardController.generateBulkIDCards
);

// Get ID card template
router.get(
  '/template',
  authorize(['super_admin', 'school_admin']),
  idCardController.getIDCardTemplate
);

export default router;
