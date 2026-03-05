import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import * as schoolController from '../controllers/schoolController.js';
import * as validators from '../validators/schoolValidators.js';

const router = express.Router();

// All routes require authentication and superadmin/school admin authorization
router.use(authenticate);
router.use(authorize(['superadmin', 'schooladmin']));

// Dashboard and analytics routes
router.get('/dashboard/stats', schoolController.getDashboardStats);

router.get('/analytics/subscriptions', schoolController.getSubscriptionAnalytics);

// School CRUD operations
router.get('/',
  validators.getSchoolsValidator,
  validate,
  schoolController.getSchools
);

router.post('/',
  validators.createSchoolValidator,
  validate,
  schoolController.createSchool
);

router.get('/search',
  validators.searchSchoolsValidator,
  validate,
  schoolController.searchSchools
);

router.get('/:id',
  validators.schoolIdValidator,
  validate,
  schoolController.getSchoolById
);

router.get('/code/:code', schoolController.getSchoolByCode);

router.put('/:id',
  validators.updateSchoolValidator,
  validate,
  schoolController.updateSchool
);

router.delete('/:id',
  validators.schoolIdValidator,
  validate,
  schoolController.deleteSchool
);

// Filter routes
router.get('/type/:type', schoolController.getSchoolsByType);

router.get('/category/:category', schoolController.getSchoolsByCategory);

router.get('/subscription-status/:status', schoolController.getSchoolsBySubscriptionStatus);

router.get('/expiring-subscriptions',
  validators.expiringSubscriptionsValidator,
  validate,
  schoolController.getExpiringSubscriptions
);

// Location-based routes
router.get('/city/:city', schoolController.getSchoolsByCity);

router.get('/state/:state', schoolController.getSchoolsByState);

router.get('/accreditation/:accreditation', schoolController.getSchoolsByAccreditation);

// Metrics and utilities
router.get('/:id/metrics',
  validators.schoolIdValidator,
  validate,
  schoolController.getSchoolMetrics
);

// Utility to update expired subscriptions
router.post('/update-expired', schoolController.updateExpiredSubscriptions);

router.get('/:id/admins',
  validators.schoolIdValidator,
  validate,
  schoolController.getSchoolAdmins
);

router.post('/:id/admins',
  validators.createSchoolAdminValidator,
  validate,
  schoolController.createSchoolAdmin
);

router.put('/:id/admins/:adminId',
  validators.updateSchoolAdminValidator,
  validate,
  schoolController.updateSchoolAdmin
);

router.delete('/:id/admins/:adminId',
  validators.schoolIdValidator,
  validate,
  schoolController.deleteSchoolAdmin
);

router.patch('/:id/admins/:adminId/toggle-status',
  validators.schoolIdValidator,
  validate,
  schoolController.toggleAdminStatus
);

export default router;
