import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import tenantController from '../controllers/tenantController.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize(['superadmin', 'admin']));

router.get('/', tenantController.getTenants);
router.post('/', tenantController.createTenant);
router.get('/search', tenantController.searchTenants);
router.get('/statistics', tenantController.getTenantStatistics);
router.get('/expiring', tenantController.getExpiringTenants);
router.get('/status/:status', tenantController.getTenantsByStatus);
router.get('/subscription/:subscriptionType', tenantController.getTenantsBySubscription);
router.get('/:id', tenantController.getTenantById);
router.put('/:id', tenantController.updateTenant);
router.delete('/:id', tenantController.deleteTenant);
router.get('/domain/:domain', tenantController.getTenantByDomain);
router.patch('/:id/status', tenantController.updateTenantStatus);
router.patch('/:id/subscription', tenantController.updateTenantSubscription);
router.patch('/:id/renew', tenantController.renewTenantSubscription);
router.post('/bulk/status', tenantController.bulkUpdateStatus);
router.post('/bulk/delete', tenantController.bulkDeleteTenants);
router.get('/export', tenantController.exportTenants);
router.get('/:id/usage', tenantController.getTenantUsageAnalytics);
router.patch('/:id/suspend', tenantController.suspendTenant);
router.patch('/:id/activate', tenantController.activateTenant);

export default router;
