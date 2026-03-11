import express from 'express';
import paymentGatewayController from '../controllers/paymentGatewayController.js';
import paymentGatewaySettingsController from '../controllers/paymentGatewaySettingsController.js';
import { authenticate } from '../middleware/authMiddleware.js';
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
router.post('/stripe/payment', paymentGatewayController.default.createStripePayment);
router.get('/stripe/payment/:paymentIntentId/verify', paymentGatewayController.default.verifyStripePayment);
router.post(
  '/stripe/customer',
  authorize(['super_admin', 'school_admin', 'accountant']),
  paymentGatewayController.default.createStripeCustomer
);

// Razorpay Routes
router.post('/razorpay/order', paymentGatewayController.default.createRazorpayOrder);
router.post('/razorpay/verify', paymentGatewayController.default.verifyRazorpayPayment);

// PayU Routes
router.post('/payu/payment', paymentGatewayController.default.createPayUPayment);
router.post('/payu/verify', paymentGatewayController.default.verifyPayUPayment);

// Refund Routes
router.post(
  '/refund/:gateway',
  authorize(['super_admin', 'school_admin', 'accountant']),
  paymentGatewayController.default.processRefund
);

// Payment Status
router.get('/status/:gateway/:paymentId', paymentGatewayController.default.getPaymentStatus);

export default router;
