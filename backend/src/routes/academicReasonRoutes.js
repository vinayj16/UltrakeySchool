import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/errorHandler.js';
import * as academicReasonController from '../controllers/academicReasonController.js';
import * as validators from '../validators/academicReasonValidators.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);
router.use(authorize(['superadmin', 'schooladmin', 'teacher']));

// CRUD operations
router.get('/schools/:schoolId',
  validators.getReasonsValidator,
  validate,
  academicReasonController.getReasons
);

router.post('/schools/:schoolId',
  validators.createReasonValidator,
  validate,
  academicReasonController.createReason
);

router.get('/schools/:schoolId/search',
  validators.searchReasonsValidator,
  validate,
  academicReasonController.searchReasons
);

router.get('/schools/:schoolId/analytics',
  academicReasonController.getAnalytics
);

router.get('/schools/:schoolId/:reasonId',
  validators.reasonIdValidator,
  validate,
  academicReasonController.getReasonById
);

router.put('/schools/:schoolId/:reasonId',
  validators.updateReasonValidator,
  validate,
  academicReasonController.updateReason
);

router.delete('/schools/:schoolId/:reasonId',
  validators.reasonIdValidator,
  validate,
  academicReasonController.deleteReason
);

// Filter routes
router.get('/schools/:schoolId/role/:role',
  validators.roleValidator,
  validate,
  academicReasonController.getReasonsByRole
);

router.get('/schools/:schoolId/category/:category',
  validators.categoryValidator,
  validate,
  academicReasonController.getReasonsByCategory
);

// Usage tracking
router.post('/schools/:schoolId/:reasonId/increment-usage',
  validators.reasonIdValidator,
  validate,
  academicReasonController.incrementUsage
);

export default router;
