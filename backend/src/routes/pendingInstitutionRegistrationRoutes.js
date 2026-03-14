import express from 'express';
import pendingInstitutionRegistrationController from '../controllers/pendingInstitutionRegistrationController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - anyone can submit a registration
router.post('/register', pendingInstitutionRegistrationController.createInstitutionRegistration);

// Protected routes - superadmin only
router.use(authenticate);
router.use(authorize(['super-admin']));

// Get all pending registrations
router.get('/pending',
  pendingInstitutionRegistrationController.getPendingRegistrations
);

// Get single registration
router.get('/:id',
  pendingInstitutionRegistrationController.getRegistrationById
);

// Approve registration
router.put('/:id/approve',
  pendingInstitutionRegistrationController.approveRegistration
);

// Reject registration
router.put('/:id/reject',
  pendingInstitutionRegistrationController.rejectRegistration
);

// Get registration statistics
router.get('/stats',
  pendingInstitutionRegistrationController.getRegistrationStats
);

export default router;
