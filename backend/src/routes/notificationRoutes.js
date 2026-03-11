import express from 'express';
import notificationController from '../controllers/notificationController.js';
const {
  getNotifications,
  getUnreadCount,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  broadcastNotification
} = notificationController;

import { authenticate, authorize } from '../middleware/authMiddleware.js';
import {
  getNotificationsValidation,
  createNotificationValidation,
  markAsReadValidation,
  deleteNotificationValidation,
  broadcastNotificationValidation
} from '../validators/notificationValidators.js';

const router = express.Router();

router.get(
  '/',
  authenticate,
  getNotificationsValidation,
  getNotifications
);

router.get(
  '/unread-count',
  authenticate,
  getUnreadCount
);

router.post(
  '/',
  authenticate,
  authorize(['admin', 'teacher', 'principal']),
  createNotificationValidation,
  createNotification
);

router.post(
  '/broadcast',
  authenticate,
  authorize(['admin', 'principal']),
  broadcastNotificationValidation,
  broadcastNotification
);

router.put(
  '/:id/read',
  authenticate,
  markAsReadValidation,
  markAsRead
);

router.put(
  '/mark-all-read',
  authenticate,
  markAllAsRead
);

router.delete(
  '/:id',
  authenticate,
  deleteNotificationValidation,
  deleteNotification
);

export default router;
