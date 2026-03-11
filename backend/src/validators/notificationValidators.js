import { body, query, param } from 'express-validator';

export const getNotificationsValidation = [
  query('isRead')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('isRead must be true or false'),
  
  query('type')
    .optional()
    .isIn(['info', 'warning', 'error', 'success'])
    .withMessage('Invalid notification type'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Skip must be a positive number')
];

export const createNotificationValidation = [
  body('recipientId')
    .notEmpty()
    .withMessage('Recipient ID is required')
    .isMongoId()
    .withMessage('Invalid recipient ID format'),
  
  body('type')
    .optional()
    .isIn(['info', 'warning', 'error', 'success'])
    .withMessage('Invalid notification type'),
  
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isString()
    .withMessage('Message must be a string')
    .trim(),
  
  body('actionUrl')
    .optional()
    .isString()
    .withMessage('Action URL must be a string')
    .trim(),
  
  body('actionText')
    .optional()
    .isString()
    .withMessage('Action text must be a string')
    .trim(),
  
  body('senderId')
    .optional()
    .isMongoId()
    .withMessage('Invalid sender ID format'),
  
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Expires at must be a valid date')
];

export const markAsReadValidation = [
  param('id')
    .notEmpty()
    .withMessage('Notification ID is required')
    .isMongoId()
    .withMessage('Invalid notification ID format')
];

export const deleteNotificationValidation = [
  param('id')
    .notEmpty()
    .withMessage('Notification ID is required')
    .isMongoId()
    .withMessage('Invalid notification ID format')
];

export const broadcastNotificationValidation = [
  body('notificationData')
    .notEmpty()
    .withMessage('Notification data is required')
    .isObject()
    .withMessage('Notification data must be an object'),
  
  body('notificationData.title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .trim(),
  
  body('notificationData.message')
    .notEmpty()
    .withMessage('Message is required')
    .isString()
    .withMessage('Message must be a string')
    .trim(),
  
  body('recipientIds')
    .notEmpty()
    .withMessage('Recipient IDs are required')
    .isArray()
    .withMessage('Recipient IDs must be an array'),
  
  body('recipientIds.*')
    .isMongoId()
    .withMessage('Each recipient ID must be a valid MongoDB ObjectId')
];
