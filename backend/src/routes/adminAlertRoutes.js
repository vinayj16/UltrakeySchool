import express from 'express';
import adminAlertController from '../controllers/adminAlertController.js';

const router = express.Router();

// Authentication DISABLED per project requirements
// router.use(authenticate);
// router.use(authorize(['superadmin']));

// Get alerts by type
router.get('/expiry', adminAlertController.getExpiryAlerts);
router.get('/overdue', adminAlertController.getOverduePayments);
router.get('/reminders', adminAlertController.getRenewalReminders);
router.get('/autorenew', adminAlertController.getAlertStatistics);