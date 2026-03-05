import express from 'express';
import * as permissionController from '../controllers/permissionController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', permissionController.getAllPermissions);
router.get('/:id', permissionController.getPermissionById);
router.post('/', authorize('superadmin', 'admin'), permissionController.createPermission);
router.put('/:id', authorize('superadmin', 'admin'), permissionController.updatePermission);
router.delete('/:id', authorize('superadmin', 'admin'), permissionController.deletePermission);

router.get('/check/:userId/permission/:permissionKey', permissionController.checkUserPermission);
router.get('/check/:userId/module/:moduleName', permissionController.checkUserModule);
router.get('/check/:userId/role/:requiredRole', permissionController.checkUserRole);

router.get('/user/:userId/permissions', permissionController.getUserPermissions);
router.get('/user/:userId/modules', permissionController.getUserModules);

router.post('/user/:userId/permissions', authorize('superadmin', 'admin'), permissionController.assignPermissionsToUser);
router.post('/user/:userId/modules', authorize('superadmin', 'admin'), permissionController.assignModulesToUser);
router.put('/user/:userId/role', authorize('superadmin', 'admin'), permissionController.updateUserRole);
router.put('/user/:userId/plan', authorize('superadmin', 'admin'), permissionController.updateUserPlan);

export default router;
