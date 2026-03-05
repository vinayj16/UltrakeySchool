import { body } from 'express-validator';

export const updateUserProfileValidation = [
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string')
    .trim(),
  
  body('profileImage')
    .optional()
    .isString()
    .withMessage('Profile image must be a string')
    .trim(),
  
  body('department')
    .optional()
    .isString()
    .withMessage('Department must be a string')
    .trim()
];
