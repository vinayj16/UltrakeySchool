import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import resultController from '../controllers/resultController.js';

const router = express.Router();
router.use(authenticate);

// Get all results for a school (for grade reports)
router.get('/schools/:schoolId', resultController.default.getResults);

// Get result by ID
router.get('/:id', resultController.default.getResultById);

// Create new result
router.post('/schools/:schoolId', resultController.default.createResult);

// Update result
router.put('/:id', resultController.default.updateResult);

// Delete result
router.delete('/:id', resultController.default.deleteResult);

// Publish results
router.patch('/:id/publish', resultController.default.publishResult);

export default router;
