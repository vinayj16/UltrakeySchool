import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateTenantAccess } from '../middleware/multiTenant.js';
import dashboardController from '../controllers/dashboardController.js';
const {
  getDashboard,
  getStudentDashboard,
  getTeacherDashboard,
  getParentDashboard,
  getAdminDashboard,
  getInstituteAdminDashboard,
  getQuickStats
} = dashboardController;

const router = express.Router();

router.use(authenticate);
router.use(validateTenantAccess);

// Get dashboard based on user role
router.get('/', getDashboard);

// Get quick stats
router.get('/quick-stats', getQuickStats);

// Role-specific dashboards
router.get('/student', getStudentDashboard);
router.get('/teacher', getTeacherDashboard);
router.get('/parent', getParentDashboard);
router.get('/admin', getAdminDashboard);
router.get('/institute-admin', getInstituteAdminDashboard);

export default router;
