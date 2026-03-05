import { validationResult } from 'express-validator';
import logger from '../utils/logger.js';
import monitoringService from '../services/monitoringService.js';
import { errorResponse, serverErrorResponse, notFoundResponse, validationErrorResponse } from '../utils/apiResponse.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));
    return validationErrorResponse(res, formattedErrors);
  }
  next();
};

export const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return validationErrorResponse(res, errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return errorResponse(res, `${field} already exists`, null, 409, 'DUPLICATE_KEY');
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return errorResponse(res, 'Invalid ID format', null, 400, 'INVALID_ID');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', null, 401, 'INVALID_TOKEN');
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', null, 401, 'TOKEN_EXPIRED');
  }

  // Multer errors (file upload)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 'File too large', null, 400, 'FILE_TOO_LARGE');
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return errorResponse(res, 'Too many files', null, 400, 'TOO_MANY_FILES');
    }
    return errorResponse(res, err.message, null, 400, 'FILE_UPLOAD_ERROR');
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  if (statusCode === 500) {
    monitoringService.captureException(err, {
      path: req.originalUrl,
      method: req.method,
      userId: req.user?.id
    });
    return serverErrorResponse(res, message, err);
  }
  
  return errorResponse(res, message, null, statusCode, err.code);
};

export const notFound = (req, res, next) => {
  return notFoundResponse(res, `Route ${req.originalUrl} not found`);
};

// Async error wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
