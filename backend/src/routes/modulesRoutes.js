import express from 'express';
import modulesController from '../controllers/modulesController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all modules with categories
router.get('/', authenticate, modulesController.getAllModules);

// Get modules by category
router.get('/category/:categoryId', authenticate, modulesController.getModulesByCategory);

// Get single module
router.get('/:moduleId', authenticate, modulesController.getModuleById);

// Create new module
router.post('/', authenticate, authorize(['admin']), modulesController.createModule);

// Update module
router.put('/:moduleId', authenticate, authorize(['admin']), modulesController.updateModule);

// Delete module
router.delete('/:moduleId', authenticate, authorize(['admin']), modulesController.deleteModule);

// Toggle module status
router.patch('/:moduleId/toggle', authenticate, authorize(['admin']), modulesController.toggleModuleStatus);

// Get module categories
router.get('/categories/all', authenticate, modulesController.getModuleCategories);

export default router;
