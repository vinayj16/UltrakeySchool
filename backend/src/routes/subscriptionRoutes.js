import express from 'express';
import * as subscriptionController from '../controllers/subscriptionController.js';
import * as validators from '../validators/subscriptionValidators.js';
import { authenticate } from '../middleware/auth.js';
import { validationResult } from 'express-validator';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/plans', subscriptionController.getAllPlans);

router.get('/plans/:planId', validators.planIdValidator, validate, subscriptionController.getPlanById);

router.get('/schools/:schoolId', authenticate, validators.schoolIdValidator, validate, subscriptionController.getSchoolSubscription);

router.post('/', authenticate, validators.createSubscriptionValidator, validate, subscriptionController.createSubscription);

router.post('/schools/:schoolId/upgrade', authenticate, validators.upgradeSubscriptionValidator, validate, subscriptionController.upgradeSubscription);

router.post('/schools/:schoolId/cancel', authenticate, validators.cancelSubscriptionValidator, validate, subscriptionController.cancelSubscription);

router.post('/schools/:schoolId/renew', authenticate, validators.schoolIdValidator, validate, subscriptionController.renewSubscription);

router.get('/expiring', authenticate, validators.expiringSubscriptionsValidator, validate, subscriptionController.getExpiringSubscriptions);

router.get('/stats', authenticate, subscriptionController.getSubscriptionStats);

router.get('/schools/:schoolId/limits', authenticate, validators.schoolIdValidator, validate, subscriptionController.checkSubscriptionLimits);

// Public route for coming soon subscriptions (no authentication required)
router.post('/coming-soon', subscriptionController.subscribeComingSoon);

export default router;
