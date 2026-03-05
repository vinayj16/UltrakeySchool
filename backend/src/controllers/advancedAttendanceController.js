import biometricService from '../services/biometricService.js';
import faceRecognitionService from '../services/faceRecognitionService.js';
import qrCodeAttendanceService from '../services/qrCodeAttendanceService.js';
import { successResponse, createdResponse, errorResponse, validationErrorResponse, notFoundResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

// Valid biometric types
const VALID_BIOMETRIC_TYPES = ['fingerprint', 'iris', 'palm', 'voice'];

// Valid QR session types
const VALID_SESSION_TYPES = ['class', 'event', 'meeting', 'exam'];

/**
 * Validate MongoDB ObjectId
 */
const validateObjectId = (id, fieldName = 'id') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { valid: false, error: { field: fieldName, message: `Invalid ${fieldName} format` } };
  }
  return { valid: true };
};

/**
 * Validate location data
 */
const validateLocation = (location) => {
  if (!location) return { valid: true };
  
  const { latitude, longitude } = location;
  if (latitude !== undefined && (isNaN(latitude) || latitude < -90 || latitude > 90)) {
    return { valid: false, error: { field: 'latitude', message: 'Latitude must be between -90 and 90' } };
  }
  if (longitude !== undefined && (isNaN(longitude) || longitude < -180 || longitude > 180)) {
    return { valid: false, error: { field: 'longitude', message: 'Longitude must be between -180 and 180' } };
  }
  return { valid: true };
};

// Biometric Attendance
const registerBiometric = async (req, res) => {
  try {
    const { biometricType, biometricData, deviceId } = req.body;

    // Validate required fields
    const errors = [];
    if (!biometricType || !VALID_BIOMETRIC_TYPES.includes(biometricType)) {
      errors.push({ field: 'biometricType', message: `Biometric type must be one of: ${VALID_BIOMETRIC_TYPES.join(', ')}` });
    }
    if (!biometricData || biometricData.length < 10) {
      errors.push({ field: 'biometricData', message: 'Valid biometric data is required' });
    }
    if (!deviceId || deviceId.trim().length < 3) {
      errors.push({ field: 'deviceId', message: 'Valid device ID is required' });
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info(`Registering biometric for user ${req.user._id}, type: ${biometricType}`);
    const result = await biometricService.registerBiometric(req.user._id, req.body);
    
    return createdResponse(res, result, 'Biometric registered successfully');
  } catch (error) {
    logger.error('Error registering biometric:', error);
    return errorResponse(res, error.message, 500);
  }
};

const verifyBiometric = async (req, res) => {
  try {
    const { biometricData, deviceId, location } = req.body;

    // Validate required fields
    const errors = [];
    if (!biometricData || biometricData.length < 10) {
      errors.push({ field: 'biometricData', message: 'Valid biometric data is required' });
    }
    if (!deviceId || deviceId.trim().length < 3) {
      errors.push({ field: 'deviceId', message: 'Valid device ID is required' });
    }

    // Validate location if provided
    if (location) {
      const locationValidation = validateLocation(location);
      if (!locationValidation.valid) {
        errors.push(locationValidation.error);
      }
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info(`Verifying biometric attendance for tenant ${req.user.tenant}, device: ${deviceId}`);
    const result = await biometricService.verifyBiometricAttendance(
      biometricData,
      deviceId,
      req.user.tenant,
      location
    );
    
    return successResponse(res, result, 'Attendance marked successfully');
  } catch (error) {
    logger.error('Error verifying biometric:', error);
    return errorResponse(res, error.message, 500);
  }
};

const getBiometricDevices = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;

    // Validate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    if (isNaN(pageNum) || pageNum < 1) {
      return validationErrorResponse(res, [{ field: 'page', message: 'Page must be a positive integer' }]);
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return validationErrorResponse(res, [{ field: 'limit', message: 'Limit must be between 1 and 100' }]);
    }

    logger.info(`Fetching biometric devices for tenant ${req.user.tenant}`);
    const devices = await biometricService.getDevices(req.user.tenant, { status, type, page: pageNum, limit: limitNum });
    
    return successResponse(res, devices, 'Devices fetched successfully');
  } catch (error) {
    logger.error('Error fetching biometric devices:', error);
    return errorResponse(res, error.message, 500);
  }
};

const deactivateBiometric = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    const validation = validateObjectId(userId, 'userId');
    if (!validation.valid) {
      return validationErrorResponse(res, [validation.error]);
    }

    logger.info(`Deactivating biometric for user ${userId}`);
    const result = await biometricService.deactivateBiometric(userId);
    
    if (!result) {
      return notFoundResponse(res, 'Biometric registration not found');
    }

    return successResponse(res, result, 'Biometric deactivated successfully');
  } catch (error) {
    logger.error('Error deactivating biometric:', error);
    return errorResponse(res, error.message, 500);
  }
};

// Face Recognition Attendance
const registerFace = async (req, res) => {
  try {
    const { imageData, imageFormat = 'base64' } = req.body;

    // Validate required fields
    const errors = [];
    if (!imageData || imageData.length < 100) {
      errors.push({ field: 'imageData', message: 'Valid image data is required' });
    }
    const validFormats = ['base64', 'url', 'binary'];
    if (!validFormats.includes(imageFormat)) {
      errors.push({ field: 'imageFormat', message: `Image format must be one of: ${validFormats.join(', ')}` });
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info(`Registering face for user ${req.user._id}`);
    const result = await faceRecognitionService.registerFace(req.user._id, req.body);
    
    return createdResponse(res, result, 'Face registered successfully');
  } catch (error) {
    logger.error('Error registering face:', error);
    return errorResponse(res, error.message, 500);
  }
};

const verifyFace = async (req, res) => {
  try {
    const { imageData, location, confidence } = req.body;

    // Validate required fields
    const errors = [];
    if (!imageData || imageData.length < 100) {
      errors.push({ field: 'imageData', message: 'Valid image data is required' });
    }

    // Validate location if provided
    if (location) {
      const locationValidation = validateLocation(location);
      if (!locationValidation.valid) {
        errors.push(locationValidation.error);
      }
    }

    // Validate confidence if provided
    if (confidence !== undefined && (isNaN(confidence) || confidence < 0 || confidence > 100)) {
      errors.push({ field: 'confidence', message: 'Confidence must be between 0 and 100' });
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info(`Verifying face attendance for tenant ${req.user.tenant}`);
    const result = await faceRecognitionService.verifyFaceAttendance(
      imageData,
      req.user.tenant,
      location,
      confidence
    );
    
    return successResponse(res, result, 'Attendance marked successfully');
  } catch (error) {
    logger.error('Error verifying face:', error);
    return errorResponse(res, error.message, 500);
  }
};

const deactivateFaceRecognition = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    const validation = validateObjectId(userId, 'userId');
    if (!validation.valid) {
      return validationErrorResponse(res, [validation.error]);
    }

    logger.info(`Deactivating face recognition for user ${userId}`);
    const result = await faceRecognitionService.deactivateFaceRecognition(userId);
    
    if (!result) {
      return notFoundResponse(res, 'Face recognition registration not found');
    }

    return successResponse(res, result, 'Face recognition deactivated successfully');
  } catch (error) {
    logger.error('Error deactivating face recognition:', error);
    return errorResponse(res, error.message, 500);
  }
};

const getFaceRecognitionStats = async (req, res) => {
  try {
    const { startDate, endDate, userId, page = 1, limit = 20 } = req.query;

    // Validate date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
        return validationErrorResponse(res, [{ field: 'dateRange', message: 'Valid start and end dates are required' }]);
      }
    }

    // Validate userId if provided
    if (userId) {
      const validation = validateObjectId(userId, 'userId');
      if (!validation.valid) {
        return validationErrorResponse(res, [validation.error]);
      }
    }

    // Validate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    if (isNaN(pageNum) || pageNum < 1) {
      return validationErrorResponse(res, [{ field: 'page', message: 'Page must be a positive integer' }]);
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return validationErrorResponse(res, [{ field: 'limit', message: 'Limit must be between 1 and 100' }]);
    }

    logger.info(`Fetching face recognition stats for tenant ${req.user.tenant}`);
    const stats = await faceRecognitionService.getStatistics(req.user.tenant, { 
      startDate, 
      endDate, 
      userId, 
      page: pageNum, 
      limit: limitNum 
    });
    
    return successResponse(res, stats, 'Statistics fetched successfully');
  } catch (error) {
    logger.error('Error fetching face recognition stats:', error);
    return errorResponse(res, error.message, 500);
  }
};

// QR Code Attendance
const generateAttendanceQR = async (req, res) => {
  try {
    const { sessionType, classId, duration, expiresAt } = req.body;

    // Validate required fields
    const errors = [];
    if (!sessionType || !VALID_SESSION_TYPES.includes(sessionType)) {
      errors.push({ field: 'sessionType', message: `Session type must be one of: ${VALID_SESSION_TYPES.join(', ')}` });
    }
    if (classId) {
      const validation = validateObjectId(classId, 'classId');
      if (!validation.valid) {
        errors.push(validation.error);
      }
    }
    if (duration && (isNaN(duration) || duration < 1 || duration > 1440)) {
      errors.push({ field: 'duration', message: 'Duration must be between 1 and 1440 minutes' });
    }
    if (expiresAt) {
      const expiry = new Date(expiresAt);
      if (isNaN(expiry.getTime()) || expiry < new Date()) {
        errors.push({ field: 'expiresAt', message: 'Expiry date must be a valid future date' });
      }
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    const sessionData = {
      ...req.body,
      schoolId: req.user.tenant,
      teacherId: req.user._id,
    };

    logger.info(`Generating attendance QR for session type: ${sessionType}`);
    const result = await qrCodeAttendanceService.generateAttendanceQR(sessionData);
    
    return createdResponse(res, result, 'QR code generated successfully');
  } catch (error) {
    logger.error('Error generating attendance QR:', error);
    return errorResponse(res, error.message, 500);
  }
};

const scanAttendanceQR = async (req, res) => {
  try {
    const { qrCodeData, location } = req.body;

    // Validate required fields
    const errors = [];
    if (!qrCodeData || qrCodeData.length < 10) {
      errors.push({ field: 'qrCodeData', message: 'Valid QR code data is required' });
    }

    // Validate location if provided
    if (location) {
      const locationValidation = validateLocation(location);
      if (!locationValidation.valid) {
        errors.push(locationValidation.error);
      }
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info(`Scanning attendance QR for user ${req.user._id}`);
    const result = await qrCodeAttendanceService.scanQRCodeAttendance(
      qrCodeData,
      req.user._id,
      location
    );
    
    return successResponse(res, result, 'Attendance marked successfully');
  } catch (error) {
    logger.error('Error scanning attendance QR:', error);
    return errorResponse(res, error.message, 500);
  }
};

const generatePersonalQR = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;

    // Validate userId
    const validation = validateObjectId(userId, 'userId');
    if (!validation.valid) {
      return validationErrorResponse(res, [validation.error]);
    }

    logger.info(`Generating personal QR for user ${userId}`);
    const result = await qrCodeAttendanceService.generatePersonalQR(userId);
    
    return successResponse(res, result, 'Personal QR code generated successfully');
  } catch (error) {
    logger.error('Error generating personal QR:', error);
    return errorResponse(res, error.message, 500);
  }
};

const scanPersonalQR = async (req, res) => {
  try {
    const { qrCodeData, location } = req.body;

    // Validate required fields
    const errors = [];
    if (!qrCodeData || qrCodeData.length < 10) {
      errors.push({ field: 'qrCodeData', message: 'Valid QR code data is required' });
    }

    // Validate location if provided
    if (location) {
      const locationValidation = validateLocation(location);
      if (!locationValidation.valid) {
        errors.push(locationValidation.error);
      }
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info(`Scanning personal QR for tenant ${req.user.tenant}`);
    const result = await qrCodeAttendanceService.scanPersonalQR(
      qrCodeData,
      req.user.tenant,
      req.user._id
    );
    
    return successResponse(res, result, 'Attendance marked successfully');
  } catch (error) {
    logger.error('Error scanning personal QR:', error);
    return errorResponse(res, error.message, 500);
  }
};

const getActiveSessions = async (req, res) => {
  try {
    const { sessionType, page = 1, limit = 20 } = req.query;

    // Validate sessionType if provided
    if (sessionType && !VALID_SESSION_TYPES.includes(sessionType)) {
      return validationErrorResponse(res, [{ field: 'sessionType', message: `Session type must be one of: ${VALID_SESSION_TYPES.join(', ')}` }]);
    }

    // Validate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    if (isNaN(pageNum) || pageNum < 1) {
      return validationErrorResponse(res, [{ field: 'page', message: 'Page must be a positive integer' }]);
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return validationErrorResponse(res, [{ field: 'limit', message: 'Limit must be between 1 and 100' }]);
    }

    logger.info(`Fetching active sessions for tenant ${req.user.tenant}`);
    const sessions = await qrCodeAttendanceService.getActiveSessions(req.user.tenant, { 
      sessionType, 
      page: pageNum, 
      limit: limitNum 
    });
    
    return successResponse(res, sessions, 'Active sessions fetched successfully');
  } catch (error) {
    logger.error('Error fetching active sessions:', error);
    return errorResponse(res, error.message, 500);
  }
};

const invalidateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Validate sessionId
    const validation = validateObjectId(sessionId, 'sessionId');
    if (!validation.valid) {
      return validationErrorResponse(res, [validation.error]);
    }

    logger.info(`Invalidating session ${sessionId}`);
    const result = await qrCodeAttendanceService.invalidateSession(sessionId);
    
    if (!result) {
      return notFoundResponse(res, 'Session not found');
    }

    return successResponse(res, result, 'Session invalidated successfully');
  } catch (error) {
    logger.error('Error invalidating session:', error);
    return errorResponse(res, error.message, 500);
  }
};

const getQRCodeStats = async (req, res) => {
  try {
    const { startDate, endDate, sessionType, page = 1, limit = 20 } = req.query;

    // Validate date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
        return validationErrorResponse(res, [{ field: 'dateRange', message: 'Valid start and end dates are required' }]);
      }
    }

    // Validate sessionType if provided
    if (sessionType && !VALID_SESSION_TYPES.includes(sessionType)) {
      return validationErrorResponse(res, [{ field: 'sessionType', message: `Session type must be one of: ${VALID_SESSION_TYPES.join(', ')}` }]);
    }

    // Validate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    if (isNaN(pageNum) || pageNum < 1) {
      return validationErrorResponse(res, [{ field: 'page', message: 'Page must be a positive integer' }]);
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return validationErrorResponse(res, [{ field: 'limit', message: 'Limit must be between 1 and 100' }]);
    }

    logger.info(`Fetching QR code stats for tenant ${req.user.tenant}`);
    const stats = await qrCodeAttendanceService.getStatistics(req.user.tenant, { 
      startDate, 
      endDate, 
      sessionType, 
      page: pageNum, 
      limit: limitNum 
    });
    
    return successResponse(res, stats, 'Statistics fetched successfully');
  } catch (error) {
    logger.error('Error fetching QR code stats:', error);
    return errorResponse(res, error.message, 500);
  }
};


/**
 * Get all attendance methods for a user
 */
const getUserAttendanceMethods = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    const validation = validateObjectId(userId, 'userId');
    if (!validation.valid) {
      return validationErrorResponse(res, [validation.error]);
    }

    logger.info(`Fetching attendance methods for user ${userId}`);
    
    const [biometric, faceRecognition, personalQR] = await Promise.all([
      biometricService.getUserBiometric(userId).catch(() => null),
      faceRecognitionService.getUserFaceData(userId).catch(() => null),
      qrCodeAttendanceService.getPersonalQR(userId).catch(() => null)
    ]);

    const methods = {
      biometric: biometric ? { enabled: true, type: biometric.type, registeredAt: biometric.createdAt } : { enabled: false },
      faceRecognition: faceRecognition ? { enabled: true, registeredAt: faceRecognition.createdAt } : { enabled: false },
      personalQR: personalQR ? { enabled: true, qrCode: personalQR.qrCode } : { enabled: false }
    };

    return successResponse(res, methods, 'Attendance methods fetched successfully');
  } catch (error) {
    logger.error('Error fetching user attendance methods:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get attendance history for advanced methods
 */
const getAdvancedAttendanceHistory = async (req, res) => {
  try {
    const { userId, method, startDate, endDate, page = 1, limit = 20 } = req.query;

    // Validate userId if provided
    if (userId) {
      const validation = validateObjectId(userId, 'userId');
      if (!validation.valid) {
        return validationErrorResponse(res, [validation.error]);
      }
    }

    // Validate method if provided
    const validMethods = ['biometric', 'face', 'qr', 'all'];
    if (method && !validMethods.includes(method)) {
      return validationErrorResponse(res, [{ field: 'method', message: `Method must be one of: ${validMethods.join(', ')}` }]);
    }

    // Validate date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
        return validationErrorResponse(res, [{ field: 'dateRange', message: 'Valid start and end dates are required' }]);
      }
    }

    // Validate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    if (isNaN(pageNum) || pageNum < 1) {
      return validationErrorResponse(res, [{ field: 'page', message: 'Page must be a positive integer' }]);
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return validationErrorResponse(res, [{ field: 'limit', message: 'Limit must be between 1 and 100' }]);
    }

    logger.info(`Fetching advanced attendance history for tenant ${req.user.tenant}`);
    
    // TODO: Implement service method to fetch combined history
    const history = {
      data: [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: 0,
        pages: 0
      }
    };

    return successResponse(res, history, 'Attendance history fetched successfully');
  } catch (error) {
    logger.error('Error fetching attendance history:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Bulk register biometric data
 */
const bulkRegisterBiometric = async (req, res) => {
  try {
    const { registrations } = req.body;

    // Validate registrations array
    if (!registrations || !Array.isArray(registrations) || registrations.length === 0) {
      return validationErrorResponse(res, [{ field: 'registrations', message: 'registrations must be a non-empty array' }]);
    }

    if (registrations.length > 50) {
      return validationErrorResponse(res, [{ field: 'registrations', message: 'Maximum 50 registrations allowed per request' }]);
    }

    // Validate each registration
    const errors = [];
    registrations.forEach((reg, index) => {
      if (!reg.userId || !mongoose.Types.ObjectId.isValid(reg.userId)) {
        errors.push({ field: `registrations[${index}].userId`, message: 'Invalid user ID' });
      }
      if (!reg.biometricType || !VALID_BIOMETRIC_TYPES.includes(reg.biometricType)) {
        errors.push({ field: `registrations[${index}].biometricType`, message: 'Invalid biometric type' });
      }
      if (!reg.biometricData || reg.biometricData.length < 10) {
        errors.push({ field: `registrations[${index}].biometricData`, message: 'Invalid biometric data' });
      }
    });

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info(`Bulk registering ${registrations.length} biometric entries`);
    const result = await biometricService.bulkRegister(registrations);

    return createdResponse(res, result, `${result.successful} biometric registrations completed`);
  } catch (error) {
    logger.error('Error bulk registering biometric:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Verify attendance with multiple methods
 */
const verifyMultiMethodAttendance = async (req, res) => {
  try {
    const { methods, location } = req.body;

    // Validate methods array
    if (!methods || !Array.isArray(methods) || methods.length === 0) {
      return validationErrorResponse(res, [{ field: 'methods', message: 'At least one verification method is required' }]);
    }

    // Validate location if provided
    if (location) {
      const locationValidation = validateLocation(location);
      if (!locationValidation.valid) {
        return validationErrorResponse(res, [locationValidation.error]);
      }
    }

    logger.info(`Verifying attendance with ${methods.length} methods for user ${req.user._id}`);
    
    const results = [];
    for (const method of methods) {
      try {
        let result;
        switch (method.type) {
          case 'biometric':
            result = await biometricService.verifyBiometricAttendance(
              method.data,
              method.deviceId,
              req.user.tenant,
              location
            );
            break;
          case 'face':
            result = await faceRecognitionService.verifyFaceAttendance(
              method.data,
              req.user.tenant,
              location
            );
            break;
          case 'qr':
            result = await qrCodeAttendanceService.scanQRCodeAttendance(
              method.data,
              req.user._id,
              location
            );
            break;
          default:
            result = { success: false, error: 'Invalid method type' };
        }
        results.push({ type: method.type, ...result });
      } catch (error) {
        results.push({ type: method.type, success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const message = `${successCount} of ${methods.length} verification methods succeeded`;

    return successResponse(res, { results, successCount, totalMethods: methods.length }, message);
  } catch (error) {
    logger.error('Error verifying multi-method attendance:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get attendance verification logs
 */
const getVerificationLogs = async (req, res) => {
  try {
    const { method, status, startDate, endDate, page = 1, limit = 20 } = req.query;

    // Validate method if provided
    const validMethods = ['biometric', 'face', 'qr'];
    if (method && !validMethods.includes(method)) {
      return validationErrorResponse(res, [{ field: 'method', message: `Method must be one of: ${validMethods.join(', ')}` }]);
    }

    // Validate status if provided
    const validStatuses = ['success', 'failed', 'pending'];
    if (status && !validStatuses.includes(status)) {
      return validationErrorResponse(res, [{ field: 'status', message: `Status must be one of: ${validStatuses.join(', ')}` }]);
    }

    // Validate date range if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
        return validationErrorResponse(res, [{ field: 'dateRange', message: 'Valid start and end dates are required' }]);
      }
    }

    // Validate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    if (isNaN(pageNum) || pageNum < 1) {
      return validationErrorResponse(res, [{ field: 'page', message: 'Page must be a positive integer' }]);
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return validationErrorResponse(res, [{ field: 'limit', message: 'Limit must be between 1 and 100' }]);
    }

    logger.info(`Fetching verification logs for tenant ${req.user.tenant}`);
    
    // TODO: Implement service method to fetch verification logs
    const logs = {
      data: [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: 0,
        pages: 0
      }
    };

    return successResponse(res, logs, 'Verification logs fetched successfully');
  } catch (error) {
    logger.error('Error fetching verification logs:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Update device configuration
 */
const updateDeviceConfig = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { name, location, settings, status } = req.body;

    // Validate deviceId
    if (!deviceId || deviceId.trim().length < 3) {
      return validationErrorResponse(res, [{ field: 'deviceId', message: 'Valid device ID is required' }]);
    }

    // Validate status if provided
    const validStatuses = ['active', 'inactive', 'maintenance'];
    if (status && !validStatuses.includes(status)) {
      return validationErrorResponse(res, [{ field: 'status', message: `Status must be one of: ${validStatuses.join(', ')}` }]);
    }

    logger.info(`Updating device configuration for ${deviceId}`);
    const result = await biometricService.updateDeviceConfig(deviceId, { name, location, settings, status });

    if (!result) {
      return notFoundResponse(res, 'Device not found');
    }

    return successResponse(res, result, 'Device configuration updated successfully');
  } catch (error) {
    logger.error('Error updating device config:', error);
    return errorResponse(res, error.message, 500);
  }
};


export default {
  registerBiometric,
  verifyBiometric,
  getBiometricDevices,
  deactivateBiometric,
  registerFace,
  verifyFace,
  deactivateFaceRecognition,
  getFaceRecognitionStats,
  generateAttendanceQR,
  scanAttendanceQR,
  generatePersonalQR,
  scanPersonalQR,
  getActiveSessions,
  invalidateSession,
  getQRCodeStats,
  getUserAttendanceMethods,
  getAdvancedAttendanceHistory,
  bulkRegisterBiometric,
  verifyMultiMethodAttendance,
  getVerificationLogs,
  updateDeviceConfig
};
