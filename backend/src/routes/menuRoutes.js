import express from 'express';
import * as menuController from '../controllers/menuController.js';
import * as validators from '../validators/menuValidators.js';
import { authenticate } from '../middleware/auth.js';
import { validationResult } from 'express-validator';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/my-menu', authenticate, menuController.getMyMenu);

router.get('/role/:roleId', validators.roleIdValidator, validate, validators.schoolIdQueryValidator, validate, menuController.getMenuForRole);

router.get('/user/:userId', authenticate, validators.userIdValidator, validate, menuController.getMenuForUser);

router.post('/role/:roleId/default', authenticate, validators.createDefaultMenuValidator, validate, menuController.createDefaultMenuForRole);

router.put('/role/:roleId', authenticate, validators.updateMenuValidator, validate, menuController.updateMenuForRole);

router.post('/role/:roleId/custom-item', authenticate, validators.addCustomMenuItemValidator, validate, menuController.addCustomMenuItem);

router.delete('/role/:roleId/custom-item/:menuItemPath', authenticate, validators.removeCustomMenuItemValidator, validate, menuController.removeCustomMenuItem);

router.post('/role/:roleId/hide-item', authenticate, validators.hideShowMenuItemValidator, validate, menuController.hideMenuItem);

router.post('/role/:roleId/show-item', authenticate, validators.hideShowMenuItemValidator, validate, menuController.showMenuItem);

router.put('/role/:roleId/reorder', authenticate, validators.reorderMenuValidator, validate, menuController.reorderMenuSections);

router.post('/role/:roleId/quick-action', authenticate, validators.addQuickActionValidator, validate, menuController.addQuickAction);

router.delete('/role/:roleId/quick-action/:actionId', authenticate, validators.removeQuickActionValidator, validate, menuController.removeQuickAction);

router.post('/role/:roleId/reset', authenticate, validators.resetMenuValidator, validate, menuController.resetMenuToDefault);

export default router;
