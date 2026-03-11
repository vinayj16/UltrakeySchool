import express from 'express';
import adminController from '../controllers/adminController.js';
// import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Temporarily remove authentication requirement for testing
// router.use(authenticate);

// Account request management routes
router.get('/account-requests', adminController.getAccountRequests);
router.get('/account-requests/stats', adminController.getAccountRequestStats);
router.get('/account-requests/:id', adminController.getAccountRequestById);
router.patch('/account-requests/:id/approve', adminController.approveAccountRequest);
router.patch('/account-requests/:id/reject', adminController.rejectAccountRequest);

// User management routes
router.post('/create-credentials', adminController.createCredentials);
router.post('/login', adminController.loginWithCredentials);
router.get('/credentials', adminController.getAllCredentials);

// Support and communication routes
router.post('/support', adminController.sendSupportEmail);

export default router;
