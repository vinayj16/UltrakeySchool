import express from 'express';
import * as paymentGatewayController from '../controllers/paymentGatewayController.js';
import paymentGatewaySettingsController from '../controllers/paymentGatewaySettingsController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authGuard.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Payment Gateway Settings Routes
router.get('/settings', 
  authorize(['super_admin', 'school_admin', 'institution_admin', 'accountant']),
  paymentGatewaySettingsController.getGatewaySettings
);

router.put('/settings',
  authorize(['super_admin', 'school_admin', 'institution_admin']),
  paymentGatewaySettingsController.updateGatewaySettings
);

router.patch('/settings/:gatewayName/toggle',
  authorize(['super_admin', 'school_admin', 'institution_admin']),
  paymentGatewaySettingsController.toggleGateway
);

router.post('/settings/:gatewayName/connect',
  authorize(['super_admin', 'school_admin', 'institution_admin']),
  paymentGatewaySettingsController.connectGateway
);

router.post('/settings/:gatewayName/disconnect',
  authorize(['super_admin', 'school_admin', 'institution_admin']),
  paymentGatewaySettingsController.disconnectGateway
);

// Stripe Routes
router.post('/stripe/payment', paymentGatewayController.createStripePayment);
router.get('/stripe/payment/:paymentIntentId/verify', paymentGatewayController.verifyStripePayment);
router.post(
  '/stripe/customer',
  authorize(['super_admin', 'school_admin', 'accountant']),
  paymentGatewayController.createStripeCustomer
);

// Razorpay Routes
router.post('/razorpay/order', paymentGatewayController.createRazorpayOrder);
router.post('/razorpay/verify', paymentGatewayController.verifyRazorpayPayment);

// PayU Routes
router.post('/payu/payment', paymentGatewayController.createPayUPayment);
router.post('/payu/verify', paymentGatewayController.verifyPayUPayment);

// Refund Routes
router.post(
  '/refund/:gateway',
  authorize(['super_admin', 'school_admin', 'accountant']),
  paymentGatewayController.processRefund
);

// Payment Status
router.get('/status/:gateway/:paymentId', paymentGatewayController.getPaymentStatus);

export default router;
