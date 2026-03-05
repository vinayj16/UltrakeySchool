import express from 'express';
import performerController from '../controllers/performerController.js';
const {
  getBestPerformers,
  getPerformersByType,
  getPerformerById,
  upsertPerformer,
  calculateMetrics,
  setFeaturedPerformers,
  deletePerformer,
  bulkUpdatePerformers
} = performerController;

import { authenticate, authorize } from '../middleware/auth.js';
import {
  getBestPerformersValidation,
  getPerformersByTypeValidation,
  getPerformerByIdValidation,
  upsertPerformerValidation,
  calculateMetricsValidation,
  setFeaturedPerformersValidation,
  deletePerformerValidation,
  bulkUpdatePerformersValidation
} from '../validators/performerValidators.js';

const router = express.Router();

// Get best performers for dashboard (public for authenticated users)
router.get(
  '/best',
  authenticate,
  getBestPerformersValidation,
  getBestPerformers
);

// Get performers by type (teacher or student)
router.get(
  '/type/:type',
  authenticate,
  getPerformersByTypeValidation,
  getPerformersByType
);

// Get performer details by ID
router.get(
  '/:id',
  authenticate,
  getPerformerByIdValidation,
  getPerformerById
);

// Create or update performer (admin/principal only)
router.post(
  '/',
  authenticate,
  authorize(['admin', 'principal']),
  upsertPerformerValidation,
  upsertPerformer
);

// Calculate performer metrics (admin/principal only)
router.post(
  '/calculate-metrics',
  authenticate,
  authorize(['admin', 'principal']),
  calculateMetricsValidation,
  calculateMetrics
);

// Set featured performers (admin/principal only)
router.post(
  '/featured',
  authenticate,
  authorize(['admin', 'principal']),
  setFeaturedPerformersValidation,
  setFeaturedPerformers
);

// Bulk update performers (admin/principal only)
router.post(
  '/bulk-update',
  authenticate,
  authorize(['admin', 'principal']),
  bulkUpdatePerformersValidation,
  bulkUpdatePerformers
);

// Delete performer (admin/principal only)
router.delete(
  '/:id',
  authenticate,
  authorize(['admin', 'principal']),
  deletePerformerValidation,
  deletePerformer
);

export default router;
