import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import sidebarController from '../controllers/sidebarController.js';
import * as validators from '../validators/sidebarValidators.js';

const router = express.Router();

router.use(authenticate);

router.get('/data', sidebarController.getSidebarData);

router.get('/preferences', sidebarController.getUserPreferences);

router.put('/preferences', 
  validators.updatePreferencesValidator,
  sidebarController.updatePreferences
);

router.post('/preferences/toggle-collapsed',
  validators.toggleCollapsedValidator,
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
  sidebarController.importPreferences
);

router.post('/recent-items',
  validators.addRecentItemValidator,
  sidebarController.addRecentItem
);

router.delete('/recent-items',
  sidebarController.clearRecentItems
);

router.post('/bookmarks',
  validators.addBookmarkValidator,
  sidebarController.addBookmark
);

router.delete('/bookmarks/:bookmarkId',
  validators.bookmarkIdValidator,
  sidebarController.removeBookmark
);

router.put('/bookmarks/order',
  validators.updateBookmarkOrderValidator,
  sidebarController.updateBookmarkOrder
);

router.post('/quick-actions',
  validators.addQuickActionValidator,
  sidebarController.addQuickAction
);

router.delete('/quick-actions/:actionId',
  validators.actionIdValidator,
  sidebarController.removeQuickAction
);

router.patch('/quick-actions/:actionId/toggle',
  validators.toggleQuickActionValidator,
  sidebarController.toggleQuickAction
);

router.put('/quick-actions/order',
  validators.updateQuickActionOrderValidator,
  sidebarController.updateQuickActionOrder
);

router.put('/expanded-menus',
  validators.updateExpandedMenusValidator,
  sidebarController.updateExpandedMenus
);

router.post('/menu-items/:menuItemId/hide',
  validators.menuItemIdValidator,
  sidebarController.hideMenuItem
);

router.post('/menu-items/:menuItemId/show',
  validators.menuItemIdValidator,
  sidebarController.showMenuItem
);

router.get('/menu-customization',
  authorize(['admin', 'superadmin']),
  sidebarController.getMenuCustomization
);

router.put('/menu-customization',
  authorize(['admin', 'superadmin']),
  validators.updateMenuCustomizationValidator,
  sidebarController.updateMenuCustomization
);

router.post('/menu-customization/items',
  authorize(['admin', 'superadmin']),
  validators.addCustomMenuItemValidator,
  sidebarController.addCustomMenuItem
);

router.delete('/menu-customization/items/:menuItemId',
  authorize(['admin', 'superadmin']),
  validators.menuItemIdValidator,
  sidebarController.removeCustomMenuItem
);

router.patch('/menu-customization/items/:menuItemId/visibility',
  authorize(['admin', 'superadmin']),
  validators.updateMenuItemVisibilityValidator,
  sidebarController.updateMenuItemVisibility
);

export default router;
