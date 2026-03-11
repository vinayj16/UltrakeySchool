import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import schoolController from '../controllers/schoolController.js';
import * as schoolValidators from '../validators/schoolValidators.js';

const router = express.Router();

// Public routes
router.get('/search', schoolValidators.searchSchoolsValidator, schoolController.searchSchools);
router.get('/code/:code', schoolController.getSchoolByCode);

// Authenticated routes
router.use(authenticate);

router.get('/', schoolValidators.getSchoolsValidator, schoolController.getSchools);
router.get('/:id', schoolValidators.schoolIdValidator, schoolController.getSchoolById);
router.get('/type/:type', schoolController.getSchoolsByType);
router.get('/category/:category', schoolController.getSchoolsByCategory);

// Admin routes
router.use(authorize(['superadmin', 'admin']));

router.post('/', schoolValidators.createSchoolValidator, schoolController.createSchool);
router.put('/:id', schoolValidators.schoolIdValidator, schoolValidators.updateSchoolValidator, schoolController.updateSchool);
router.delete('/:id', schoolValidators.schoolIdValidator, schoolController.deleteSchool);

router.get('/stats/dashboard', schoolController.getDashboardStats);
router.get('/stats/subscription', schoolController.getSubscriptionAnalytics);
router.get('/metrics/:id', schoolValidators.schoolIdValidator, schoolController.getSchoolMetrics);
router.get('/subscriptions/status/:status', schoolController.getSchoolsBySubscriptionStatus);
router.get('/subscriptions/expiring', schoolValidators.expiringSubscriptionsValidator, schoolController.getExpiringSubscriptions);
router.put('/subscriptions/update-expired', schoolController.updateExpiredSubscriptions);

router.get('/location/city/:city', schoolController.getSchoolsByCity);
router.get('/location/state/:state', schoolController.getSchoolsByState);
router.get('/accreditation/:accreditation', schoolController.getSchoolsByAccreditation);

router.get('/:id/admins', schoolValidators.schoolIdValidator, schoolController.getSchoolAdmins);
router.post('/:id/admins', schoolValidators.createSchoolAdminValidator, schoolController.createSchoolAdmin);
router.put('/:id/admins/:adminId', schoolValidators.updateSchoolAdminValidator, schoolController.updateSchoolAdmin);
router.delete('/:id/admins/:adminId', schoolController.deleteSchoolAdmin);
router.patch('/:id/admins/:adminId/status', schoolController.toggleAdminStatus);

export default router;
