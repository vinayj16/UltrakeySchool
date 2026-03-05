import express from 'express';
import dsrController from '../controllers/dsrController.js';
const {
  createDataExportRequest,
  getDataExportRequests,
  verifyDataExportRequest,
  completeDataExportRequest,
  createDataErasureRequest,
  getDataErasureRequests,
  verifyDataErasureRequest,
  reviewDataErasureRequest,
  completeDataErasureRequest,
  getAuditLogs,
  checkDataRetentionCompliance
} = dsrController;

import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateTenantAccess } from '../middleware/multiTenant.js';

const router = express.Router();

// Apply tenant middleware to all routes
router.use(authenticate);
router.use(validateTenantAccess);

// Data Export Routes
router.post('/data-export', createDataExportRequest);
router.get('/data-export', getDataExportRequests);
// router.get('/data-export/:requestId/status', getDataExportStatus); // TODO: Implement getDataExportStatus in controller
router.post('/data-export/:requestId/verify', verifyDataExportRequest);
router.post('/data-export/:requestId/complete', completeDataExportRequest);

// Data Erasure Routes
router.post('/data-erasure', createDataErasureRequest);
router.get('/data-erasure', getDataErasureRequests);
router.post('/data-erasure/:requestId/verify', verifyDataErasureRequest);
router.post('/data-erasure/:requestId/review', reviewDataErasureRequest);
router.post('/data-erasure/:requestId/complete', completeDataErasureRequest);

// Audit Log Routes
router.get('/audit-logs', 
  authorize('admin', 'superadmin', 'institution_admin', 'school_admin'),
  getAuditLogs
);

// Data Retention Routes
router.get('/data-retention/compliance', checkDataRetentionCompliance);

export default router;
