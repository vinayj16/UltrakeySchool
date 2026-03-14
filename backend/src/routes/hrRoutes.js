import express from 'express';
import hrController from '../controllers/hrController.js';

import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateTenantAccess } from '../middleware/multiTenant.js';

const router = express.Router();

// Apply tenant middleware to all routes
router.use(authenticate);
router.use(validateTenantAccess);

// Employee Routes - HR Manager and above
router.post('/employees',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  hrController.createEmployee
);

router.get('/employees',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin', 'accountant', 'librarian', 'transport_manager', 'hostel_warden'),
  hrController.getAllEmployees
);

router.get('/employees/:id',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin', 'accountant', 'librarian', 'transport_manager', 'hostel_warden'),
  hrController.getEmployeeById
);

router.put('/employees/:id',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  hrController.updateEmployee
);

router.put('/employees/:id/performance',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  hrController.updateEmployeePerformance
);

// Leave Routes - All authenticated users
router.post('/leave',
  hrController.applyLeave
);

router.get('/leave',
  hrController.getAllLeaves
);

router.put('/leave/:id/status',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  hrController.updateLeaveStatus
);

// Recruitment Routes - HR Manager and above
router.post('/recruitment',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  hrController.createRecruitment
);

router.get('/recruitment',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin', 'teacher', 'staff_member'),
  hrController.getAllRecruitments
);

router.post('/recruitment/:id/apply',
  hrController.applyForJob
);

// Performance Review Routes - HR Manager and above
router.post('/performance',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  hrController.createPerformanceReview
);

router.get('/performance',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  hrController.getAllPerformanceReviews
);

// Training Routes - HR Manager and above
router.post('/training',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  hrController.createTraining
);

router.get('/training',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin', 'teacher', 'staff_member'),
  hrController.getAllTrainings
);

router.post('/training/:id/enroll',
  hrController.enrollInTraining
);

// Dashboard Routes - HR Manager specific
router.get('/dashboard',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  async (req, res) => {
    try {
      // Aggregate HR dashboard data
      const dashboardData = {
        totalEmployees: 0,
        activeEmployees: 0,
        pendingLeaveRequests: 0,
        openPositions: 0,
        upcomingReviews: 0,
        trainingPrograms: 0,
        recentActivities: []
      };

      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return ApiResponse.success(res, 'HR dashboard data retrieved', {
        dashboard: dashboardData
      });
    } catch (error) {
      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return Apiresponse.message(res, 'Failed to retrieve dashboard data', 500);
    }
  }
);

export default router;
