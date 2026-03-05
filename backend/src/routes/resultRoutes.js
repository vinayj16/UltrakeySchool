import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as resultController from '../controllers/resultController.js';

const router = express.Router();
router.use(authenticate);

// Get all results for a school (for grade reports)
router.get('/schools/:schoolId', resultController.getResults);

// Get result by ID
router.get('/:id', resultController.getResultById);

// Create new result
router.post('/schools/:schoolId', resultController.createResult);

// Update result
router.put('/:id', resultController.updateResult);

// Delete result
router.delete('/:id', resultController.deleteResult);

// Publish results
router.patch('/:id/publish', resultController.publishResult);

export default router;
