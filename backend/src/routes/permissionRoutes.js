import express from 'express';
import permissionController from '../controllers/permissionController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', permissionController.default.getAllPermissions);
router.get('/:id', permissionController.default.getPermissionById);
router.post('/', authorize('superadmin', 'admin'), permissionController.default.createPermission);
router.put('/:id', authorize('superadmin', 'admin'), permissionController.default.updatePermission);
router.delete('/:id', authorize('superadmin', 'admin'), permissionController.default.deletePermission);

router.get('/check/:userId/permission/:permissionKey', permissionController.default.checkUserPermission);
router.get('/check/:userId/module/:moduleName', permissionController.default.checkUserModule);
router.get('/check/:userId/role/:requiredRole', permissionController.default.checkUserRole);

router.get('/user/:userId/permissions', permissionController.default.getUserPermissions);
router.get('/user/:userId/modules', permissionController.default.getUserModules);

router.post('/user/:userId/permissions', authorize('superadmin', 'admin'), permissionController.default.assignPermissionsToUser);
router.post('/user/:userId/modules', authorize('superadmin', 'admin'), permissionController.default.assignModulesToUser);
router.put('/user/:userId/role', authorize('superadmin', 'admin'), permissionController.default.updateUserRole);
router.put('/user/:userId/plan', authorize('superadmin', 'admin'), permissionController.default.updateUserPlan);

export default router;
