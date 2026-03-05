import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import * as sidebarController from '../controllers/sidebarController.js';
import * as validators from '../validators/sidebarValidators.js';

const router = express.Router();

router.use(authenticate);

router.get('/data', sidebarController.getSidebarData);

router.get('/preferences', sidebarController.getUserPreferences);

router.put('/preferences', 
  validators.updatePreferencesValidator,
  validate,
  sidebarController.updatePreferences
);

router.post('/preferences/toggle-collapsed',
  validators.toggleCollapsedValidator,
  validate,
  sidebarController.toggleCollapsed
);

router.post('/preferences/reset',
  sidebarController.resetPreferences
);

router.get('/preferences/export',
  sidebarController.exportPreferences
);

router.post('/preferences/import',
  validators.importPreferencesValidator,
  validate,
  sidebarController.importPreferences
);

router.post('/recent-items',
  validators.addRecentItemValidator,
  validate,
  sidebarController.addRecentItem
);

router.delete('/recent-items',
  sidebarController.clearRecentItems
);

router.post('/bookmarks',
  validators.addBookmarkValidator,
  validate,
  sidebarController.addBookmark
);

router.delete('/bookmarks/:bookmarkId',
  validators.bookmarkIdValidator,
  validate,
  sidebarController.removeBookmark
);

router.put('/bookmarks/order',
  validators.updateBookmarkOrderValidator,
  validate,
  sidebarController.updateBookmarkOrder
);

router.post('/quick-actions',
  validators.addQuickActionValidator,
  validate,
  sidebarController.addQuickAction
);

router.delete('/quick-actions/:actionId',
  validators.actionIdValidator,
  validate,
  sidebarController.removeQuickAction
);

router.patch('/quick-actions/:actionId/toggle',
  validators.toggleQuickActionValidator,
  validate,
  sidebarController.toggleQuickAction
);

router.put('/quick-actions/order',
  validators.updateQuickActionOrderValidator,
  validate,
  sidebarController.updateQuickActionOrder
);

router.put('/expanded-menus',
  validators.updateExpandedMenusValidator,
  validate,
  sidebarController.updateExpandedMenus
);

router.post('/menu-items/:menuItemId/hide',
  validators.menuItemIdValidator,
  validate,
  sidebarController.hideMenuItem
);

router.post('/menu-items/:menuItemId/show',
  validators.menuItemIdValidator,
  validate,
  sidebarController.showMenuItem
);

router.get('/menu-customization',
  authorize(['admin', 'superadmin']),
  sidebarController.getMenuCustomization
);

router.put('/menu-customization',
  authorize(['admin', 'superadmin']),
  validators.updateMenuCustomizationValidator,
  validate,
  sidebarController.updateMenuCustomization
);

router.post('/menu-customization/items',
  authorize(['admin', 'superadmin']),
  validators.addCustomMenuItemValidator,
  validate,
  sidebarController.addCustomMenuItem
);

router.delete('/menu-customization/items/:menuItemId',
  authorize(['admin', 'superadmin']),
  validators.menuItemIdValidator,
  validate,
  sidebarController.removeCustomMenuItem
);

router.patch('/menu-customization/items/:menuItemId/visibility',
  authorize(['admin', 'superadmin']),
  validators.updateMenuItemVisibilityValidator,
  validate,
  sidebarController.updateMenuItemVisibility
);

export default router;
