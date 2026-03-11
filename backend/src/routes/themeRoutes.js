import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import themeController from '../controllers/themeController.js';
const {
  getUserTheme,
  updateUserTheme,
  getSystemTheme,
  updateSystemTheme,
  getAvailableThemes,
  getDesignTokens
} = themeController;

const router = express.Router();

// Public routes
router.get('/available', getAvailableThemes);
router.get('/tokens', getDesignTokens);

// Protected routes
router.use(authenticate);

// User theme preferences
router.get('/user', getUserTheme);
router.put('/user', updateUserTheme);

// System theme configuration (admin only)
router.get('/system', getSystemTheme);
router.put('/system', authorize(['admin', 'superadmin']), updateSystemTheme);

export default router;
