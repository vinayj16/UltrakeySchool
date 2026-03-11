import express from 'express';
import roleController from '../controllers/roleController.js';
import * as validators from '../validators/roleValidators.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validationResult } from 'express-validator';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/', roleController.getAllRoles);

router.get('/stats', authenticate, validators.schoolIdQueryValidator, validate, roleController.getRoleStats);

router.get('/:roleId', validators.roleIdValidator, validate, roleController.getRoleById);

router.get('/category/:category', validators.categoryValidator, validate, roleController.getRolesByCategory);

router.get('/plan/:plan', validators.planValidator, validate, roleController.getRolesByPlan);

router.get('/:roleId/permissions', validators.roleIdValidator, validate, roleController.getRolePermissions);

router.get('/:roleId/module/:moduleKey/access', validators.roleIdValidator, validate, validators.moduleKeyValidator, validate, roleController.canRoleAccessModule);

router.get('/:roleId/module/:moduleKey/readonly', validators.roleIdValidator, validate, validators.moduleKeyValidator, validate, roleController.isModuleReadOnlyForRole);

router.get('/:roleId/action/:action', validators.roleIdValidator, validate, validators.actionValidator, validate, roleController.canRolePerformAction);

router.get('/:roleId/users', authenticate, validators.roleIdValidator, validate, validators.schoolIdQueryValidator, validate, roleController.getUsersByRole);

router.post('/users/:userId/assign', authenticate, validators.assignRoleValidator, validate, roleController.assignRole);

router.put('/users/:userId/permissions', authenticate, validators.updatePermissionsValidator, validate, roleController.updateUserPermissions);

router.get('/users/:userId/permissions', authenticate, validators.userIdValidator, validate, roleController.getUserEffectivePermissions);

router.post('/users/:userId/validate-access', authenticate, validators.validateAccessValidator, validate, roleController.validateRoleAccess);

export default router;
