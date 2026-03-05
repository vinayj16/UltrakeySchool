import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import tenantController from '../controllers/tenantController.js';
const {
  getTenants,
  createTenant,
  getTenantById,
  updateTenant,
  deleteTenant
} = tenantController;

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize(['superadmin', 'admin']));

router.get('/', getTenants);
router.post('/', createTenant);
router.get('/:id', getTenantById);
router.put('/:id', updateTenant);
router.delete('/:id', deleteTenant);

export default router;
