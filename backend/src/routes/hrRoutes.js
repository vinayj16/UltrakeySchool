import express from 'express';
import hrController from '../controllers/hrController.js';
const {
  employeeController,
  leaveController,
  recruitmentController,
  performanceController,
  trainingController
} = hrController;

import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateTenantAccess } from '../middleware/multiTenant.js';

const router = express.Router();

// Apply tenant middleware to all routes
router.use(authenticate);
router.use(validateTenantAccess);

// Employee Routes - HR Manager and above
router.post('/employees',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  employeeController.create
);

router.get('/employees',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin', 'accountant', 'librarian', 'transport_manager', 'hostel_warden'),
  employeeController.getAll
);

router.get('/employees/:id',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin', 'accountant', 'librarian', 'transport_manager', 'hostel_warden'),
  employeeController.getById
);

router.put('/employees/:id',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  employeeController.update
);

router.put('/employees/:id/performance',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  employeeController.updatePerformance
);

// Leave Routes - All authenticated users
router.post('/leave',
  leaveController.apply
);

router.get('/leave',
  leaveController.getAll
);

router.put('/leave/:id/status',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  leaveController.updateStatus
);

// Recruitment Routes - HR Manager and above
router.post('/recruitment',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  recruitmentController.create
);

router.get('/recruitment',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin', 'teacher', 'staff_member'),
  recruitmentController.getAll
);

router.post('/recruitment/:id/apply',
  recruitmentController.apply
);

// Performance Review Routes - HR Manager and above
router.post('/performance',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  performanceController.create
);

router.get('/performance',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  performanceController.getAll
);

// Training Routes - HR Manager and above
router.post('/training',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin'),
  trainingController.create
);

router.get('/training',
  authorize('hr_manager', 'school_admin', 'institution_admin', 'superadmin', 'teacher', 'staff_member'),
  trainingController.getAll
);

router.post('/training/:id/enroll',
  trainingController.enroll
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
      return ApiResponse.error(res, 'Failed to retrieve dashboard data', 500);
    }
  }
);

export default router;
