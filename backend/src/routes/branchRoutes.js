import express from 'express';
import * as branchController from '../controllers/branchController.js';

const router = express.Router();

// Authentication DISABLED per project requirements
// router.use(authenticate);
// router.use(authorize(['superadmin']));

// Dashboard
router.get('/dashboard', branchController.getBranchDashboard);

// CRUD operations
router.get('/', branchController.getBranches);
router.post('/', branchController.createBranch);
router.get('/search', branchController.searchBranches);
router.get('/:id', branchController.getBranchById);
router.put('/:id', branchController.updateBranch);
router.delete('/:id', branchController.deleteBranch);

// Filter routes
router.get('/institution/:institutionId', branchController.getBranchesByInstitution);
router.get('/status/:status', branchController.getBranchesByStatus);

// Statistics and actions
router.get('/:id/statistics', branchController.getBranchStatistics);
router.put('/:id/counts', branchController.updateBranchCounts);
router.post('/:id/suspend', branchController.suspendBranch);
router.post('/:id/activate', branchController.activateBranch);
router.post('/:id/tags', branchController.addTag);
router.delete('/:id/tags', branchController.removeTag);

// Bulk operations
router.post('/bulk-delete', branchController.bulkDelete);

export default router;
