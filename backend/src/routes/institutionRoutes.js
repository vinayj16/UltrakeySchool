import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import * as institutionController from '../controllers/institutionController.js';
import * as validators from '../validators/institutionValidators.js';

const router = express.Router();

// Authentication DISABLED per project requirements
// router.use(authenticate);
// router.use(authorize(['superadmin']));

// Dashboard and analytics routes
router.get('/dashboard/stats', institutionController.getDashboardStats);
router.get('/analytics/subscriptions', institutionController.getSubscriptionAnalytics);
router.get('/analytics/compliance', institutionController.getComplianceStatus);
router.get('/analytics/revenue', institutionController.getRevenueReport);

// Institution CRUD operations
router.get('/', validators.getInstitutionsValidator, validate, institutionController.getInstitutions);
router.post('/', validators.createInstitutionValidator, validate, institutionController.createInstitution);
router.get('/search', validators.searchInstitutionsValidator, validate, institutionController.searchInstitutions);
router.get('/:id', validators.institutionIdValidator, validate, institutionController.getInstitutionById);
router.put('/:id', validators.updateInstitutionValidator, validate, institutionController.updateInstitution);
router.delete('/:id', validators.institutionIdValidator, validate, institutionController.deleteInstitution);

// Filter routes
router.get('/type/:type', institutionController.getInstitutionsByType);
router.get('/category/:category', institutionController.getInstitutionsByCategory);
router.get('/subscription-status/:status', institutionController.getInstitutionsBySubscriptionStatus);
router.get('/expiring-subscriptions', validators.expiringSubscriptionsValidator, validate, institutionController.getExpiringSubscriptions);

// Additional endpoints for frontend API
router.get('/:id/metrics', validators.institutionIdValidator, validate, institutionController.getInstitutionMetrics);
router.post('/:id/suspend', institutionController.suspendInstitution);
router.post('/:id/activate', institutionController.activateInstitution);
router.put('/:id/notes', institutionController.updateNotes);
router.post('/:id/tags', institutionController.addTag);
router.delete('/:id/tags', institutionController.removeTag);
router.put('/:id/subscription', institutionController.updateSubscription);
router.put('/:id/analytics', institutionController.updateAnalytics);
router.put('/:id/compliance', institutionController.updateCompliance);
router.post('/:id/login', institutionController.updateLastLogin);

// Migration from legacy school
router.post('/migrate/:schoolId', validators.migrateFromSchoolValidator, validate, institutionController.migrateFromSchool);

// Utility to update expired subscriptions
router.post('/update-expired', institutionController.updateExpiredSubscriptions);

export default router;
