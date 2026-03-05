import { body, param, query } from 'express-validator';

export const createClassValidator = [
  body('name').trim().notEmpty().withMessage('Class name is required'),
  body('section').trim().notEmpty().withMessage('Section is required'),
  body('academicYear').trim().notEmpty().withMessage('Academic year is required'),
  body('institutionId').isMongoId().withMessage('Invalid institution ID'),
  body('students').optional().isInt({ min: 0 }).withMessage('Students must be a positive number'),
  body('subjects').optional().isInt({ min: 0 }).withMessage('Subjects must be a positive number'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1')
];

export const updateClassValidator = [
  body('name').optional().trim().notEmpty().withMessage('Class name cannot be empty'),
  body('section').optional().trim().notEmpty().withMessage('Section cannot be empty'),
  body('students').optional().isInt({ min: 0 }).withMessage('Students must be a positive number'),
  body('subjects').optional().isInt({ min: 0 }).withMessage('Subjects must be a positive number'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
];

export const classIdValidator = [
  param('id').isMongoId().withMessage('Invalid class ID')
];

export const searchValidator = [
  query('q').trim().notEmpty().withMessage('Search query is required').isLength({ min: 2 }).withMessage('Search query must be at least 2 characters')
];
