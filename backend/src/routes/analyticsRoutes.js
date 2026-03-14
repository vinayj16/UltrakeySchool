import express from 'express';
import analyticsController from '../controllers/analyticsController.js';
import adminAnalyticsController from '../controllers/adminAnalyticsController.js';

const router = express.Router();

// Authentication DISABLED per project requirements
// router.use(authenticate);
// router.use(authorize(['superadmin']));

// Get full analytics report
router.get('/', analyticsController.getFullAnalytics);

// Individual analytics endpoints
router.get('/institution-growth', analyticsController.getInstitutionGrowth);
router.get('/revenue-growth', analyticsController.getRevenueGrowth);
router.get('/plan-distribution', analyticsController.getPlanDistribution);
router.get('/institution-type-distribution', analyticsController.getInstitutionTypeDistribution);
router.get('/churn-rate', analyticsController.getChurnRate);
router.get('/renewal-rate', analyticsController.getRenewalRate);
router.get('/branch-growth', analyticsController.getBranchGrowth);
router.get('/module-usage', analyticsController.getModuleUsage);
router.get('/support-load', analyticsController.getSupportLoad);

// Admin Analytics Dashboard endpoints
router.get('/admin/dashboard', adminAnalyticsController.getAdminAnalytics);
router.get('/admin/admissions', adminAnalyticsController.getAdmissionsAnalytics);
router.get('/admin/attendance', adminAnalyticsController.getAttendanceAnalytics);
router.get('/admin/fees', adminAnalyticsController.getFeesAnalytics);
router.get('/admin/staff', adminAnalyticsController.getStaffAnalytics);
router.get('/admin/complaints', adminAnalyticsController.getComplaintsAnalytics);
router.post('/admin/fees/send-reminders', adminAnalyticsController.sendFeeReminders);

// Institute Admin Analytics Dashboard endpoints
router.get('/institute-admin/dashboard', adminAnalyticsController.getInstituteAdminAnalytics);
router.get('/institute-admin/fees', adminAnalyticsController.getInstituteAdminFeesAnalytics);

export default router;
