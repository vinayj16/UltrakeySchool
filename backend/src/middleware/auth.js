import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';
import { bypassModeEnabled, isBypassModeValid, validateMockUserToken } from '../config/bypassAuth.js';

// Validation constants
const TOKEN_MIN_LENGTH = 20;
const TOKEN_MAX_LENGTH = 2048;
const BEARER_PREFIX = 'Bearer ';

// Valid roles
const VALID_ROLES = [
  'superadmin',
  'institution_admin',
  'school_admin',
  'principal',
  'teacher',
  'student',
  'parent',
  'accountant',
  'hr_manager',
  'librarian',
  'transport_manager',
  'hostel_warden',
  'staff_member',
  'guest'
];

// Token blacklist (in-memory, should use Redis in production)
const tokenBlacklist = new Set();

// Helper function to extract token from request
const extractToken = (req) => {
  try {
    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader) {
      if (authHeader.startsWith(BEARER_PREFIX)) {
        return authHeader.substring(BEARER_PREFIX.length).trim();
      }
      // Support token without Bearer prefix
      return authHeader.trim();
    }
    
    // Check query parameter
    if (req.query?.token) {
      return req.query.token.trim();
    }
    
    // Check cookies
    if (req.cookies?.token) {
      return req.cookies.token.trim();
    }
    
    return null;
  } catch (error) {
    logger.error('Error extracting token:', error);
    return null;
  }
};

// Helper function to validate token format
const validateTokenFormat = (token) => {
  const errors = [];
  
  if (!token || typeof token !== 'string') {
    errors.push('Token must be a non-empty string');
    return errors;
  }
  
  if (token.length < TOKEN_MIN_LENGTH) {
    errors.push('Token is too short');
  }
  
  if (token.length > TOKEN_MAX_LENGTH) {
    errors.push('Token is too long');
  }
  
  return errors;
};

// Helper function to check if token is blacklisted
const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

// Helper function to add token to blacklist
export const blacklistToken = (token) => {
  if (token) {
    tokenBlacklist.add(token);
    logger.info('Token blacklisted:', { tokenPrefix: token.substring(0, 10) + '...' });
    return true;
  }
  return false;
};

// Helper function to clear token blacklist (admin function)
export const clearTokenBlacklist = () => {
  const count = tokenBlacklist.size;
  tokenBlacklist.clear();
  logger.info('Token blacklist cleared:', { count });
  return count;
};

// Helper function to verify JWT token
const verifyToken = (token) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    const decoded = jwt.verify(token, jwtSecret, {
      algorithms: ['HS256', 'HS384', 'HS512'],
      maxAge: process.env.JWT_EXPIRY || '24h'
    });
    
    return { valid: true, decoded };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { valid: false, error: 'Token has expired', code: 'TOKEN_EXPIRED' };
    }
    if (error.name === 'JsonWebTokenError') {
      return { valid: false, error: 'Invalid token', code: 'TOKEN_INVALID' };
    }
    if (error.name === 'NotBeforeError') {
      return { valid: false, error: 'Token not yet valid', code: 'TOKEN_NOT_ACTIVE' };
    }
    return { valid: false, error: error.message, code: 'TOKEN_VERIFICATION_FAILED' };
  }
};

// Helper function to validate user object from token
const validateUserFromToken = (decoded) => {
  const errors = [];
  
  if (!decoded.id && !decoded.sub) {
    errors.push('Token missing user ID');
  }
  
  if (!decoded.email) {
    errors.push('Token missing email');
  }
  
  if (!decoded.role) {
    errors.push('Token missing role');
  } else if (!VALID_ROLES.includes(decoded.role)) {
    errors.push('Invalid role in token: ' + decoded.role);
  }
  
  return errors;
};

// Helper function to log authentication attempt
const logAuthAttempt = (req, success, reason = null, userId = null) => {
  const logData = {
    method: req.method,
    path: req.path,
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.headers['user-agent'],
    success,
    userId,
    reason,
    timestamp: new Date().toISOString()
  };
  
  if (success) {
    logger.info('Authentication successful:', logData);
  } else {
    logger.warn('Authentication failed:', logData);
  }
};

/**
 * Main authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    logger.info('Authentication attempt:', {
      method: req.method,
      path: req.path,
      ip: req.ip
    });
    
    // Handle bypass mode for development/testing
    if (bypassModeEnabled && isBypassModeValid()) {
      const token = extractToken(req);
      if (token) {
        const mockValidation = validateMockUserToken(token);
        if (mockValidation.valid) {
          req.user = {
            id: token,
            email: mockValidation.role + '@edumanage.mock',
            role: mockValidation.role,
            isMockUser: true
          };
          logger.info('Bypass mode: Mock user authenticated:', { role: mockValidation.role });
          return next();
        }
      }
    }
    
    const token = extractToken(req);
    
    if (!token) {
      logAuthAttempt(req, false, 'No token provided');
      return errorResponse(res, 'Authentication required. Please provide a valid token.', 401, 'AUTH_TOKEN_REQUIRED');
    }
    
    // Validate token format
    const formatErrors = validateTokenFormat(token);
    if (formatErrors.length > 0) {
      logAuthAttempt(req, false, 'Invalid token format');
      return errorResponse(res, 'Invalid token format', 401, 'TOKEN_INVALID_FORMAT');
    }
    
    // Check if token is blacklisted
    if (isTokenBlacklisted(token)) {
      logAuthAttempt(req, false, 'Token is blacklisted');
      return errorResponse(res, 'Token has been revoked', 401, 'TOKEN_REVOKED');
    }
    
    // Verify token
    const verification = verifyToken(token);
    if (!verification.valid) {
      logAuthAttempt(req, false, verification.error);
      return errorResponse(res, verification.error, 401, verification.code);
    }
    
    const decoded = verification.decoded;
    
    // Validate user data from token
    const userErrors = validateUserFromToken(decoded);
    if (userErrors.length > 0) {
      logAuthAttempt(req, false, 'Invalid token payload: ' + userErrors.join(', '));
      return errorResponse(res, 'Invalid token payload', 401, 'TOKEN_INVALID_PAYLOAD');
    }
    
    // Attach user to request
    req.user = {
      id: decoded.id || decoded.sub,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
      institutionId: decoded.institutionId || decoded.institution,
      schoolId: decoded.schoolId || decoded.school,
      permissions: decoded.permissions || [],
      tenant: decoded.tenant,
      isMockUser: false
    };
    
    // Attach token to request for potential blacklisting on logout
    req.token = token;
    
    logAuthAttempt(req, true, null, req.user.id);
    
    logger.info('User authenticated successfully:', {
      userId: req.user.id,
      email: req.user.email,
      role: req.user.role
    });
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    logAuthAttempt(req, false, 'Internal error: ' + error.message);
    return errorResponse(res, 'Authentication failed', 500, 'AUTH_ERROR');
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      logger.info('Optional auth: No token provided, continuing without authentication');
      return next();
    }
    
    // Handle bypass mode
    if (bypassModeEnabled && isBypassModeValid()) {
      const mockValidation = validateMockUserToken(token);
      if (mockValidation.valid) {
        req.user = {
          id: token,
          email: mockValidation.role + '@edumanage.mock',
          role: mockValidation.role,
          isMockUser: true
        };
        logger.info('Optional auth: Mock user authenticated:', { role: mockValidation.role });
        return next();
      }
    }
    
    // Validate token format
    const formatErrors = validateTokenFormat(token);
    if (formatErrors.length > 0) {
      logger.warn('Optional auth: Invalid token format, continuing without authentication');
      return next();
    }
    
    // Check if token is blacklisted
    if (isTokenBlacklisted(token)) {
      logger.warn('Optional auth: Token is blacklisted, continuing without authentication');
      return next();
    }
    
    // Verify token
    const verification = verifyToken(token);
    if (!verification.valid) {
      logger.warn('Optional auth: Token verification failed, continuing without authentication:', verification.error);
      return next();
    }
    
    const decoded = verification.decoded;
    
    // Validate user data from token
    const userErrors = validateUserFromToken(decoded);
    if (userErrors.length > 0) {
      logger.warn('Optional auth: Invalid token payload, continuing without authentication');
      return next();
    }
    
    // Attach user to request
    req.user = {
      id: decoded.id || decoded.sub,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
      institutionId: decoded.institutionId || decoded.institution,
      schoolId: decoded.schoolId || decoded.school,
      permissions: decoded.permissions || [],
      tenant: decoded.tenant,
      isMockUser: false
    };
    
    req.token = token;
    
    logger.info('Optional auth: User authenticated:', {
      userId: req.user.id,
      role: req.user.role
    });
    
    next();
  } catch (error) {
    logger.error('Optional auth error:', error);
    // Continue without authentication on error
    next();
  }
};

/**
 * Role-based authorization middleware
 * Checks if authenticated user has one of the required roles
 */
export const authorize = (roles = []) => {
  // Normalize roles to array
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return (req, res, next) => {
    try {
      logger.info('Authorization check:', {
        userId: req.user?.id,
        userRole: req.user?.role,
        requiredRoles: allowedRoles
      });
      
      if (!req.user) {
        logger.warn('Authorization failed: No user in request');
        return errorResponse(res, 'Authentication required', 401, 'AUTH_REQUIRED');
      }
      
      // Allow if no specific roles required
      if (allowedRoles.length === 0) {
        logger.info('Authorization successful: No specific roles required');
        return next();
      }
      
      // Check if user has one of the required roles
      if (!allowedRoles.includes(req.user.role)) {
        logger.warn('Authorization failed: Insufficient permissions:', {
          userId: req.user.id,
          userRole: req.user.role,
          requiredRoles: allowedRoles
        });
        return errorResponse(
          res,
          'Access denied. You do not have permission to access this resource.',
          403,
          'INSUFFICIENT_PERMISSIONS'
        );
      }
      
      logger.info('Authorization successful:', {
        userId: req.user.id,
        role: req.user.role
      });
      
      next();
    } catch (error) {
      logger.error('Authorization error:', error);
      return errorResponse(res, 'Authorization failed', 500, 'AUTHORIZATION_ERROR');
    }
  };
};

/**
 * Permission-based authorization middleware
 * Checks if authenticated user has specific permissions
 */
export const requirePermission = (requiredPermissions = []) => {
  const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
  
  return (req, res, next) => {
    try {
      logger.info('Permission check:', {
        userId: req.user?.id,
        requiredPermissions: permissions
      });
      
      if (!req.user) {
        logger.warn('Permission check failed: No user in request');
        return errorResponse(res, 'Authentication required', 401, 'AUTH_REQUIRED');
      }
      
      // Superadmin has all permissions
      if (req.user.role === 'superadmin') {
        logger.info('Permission check: Superadmin has all permissions');
        return next();
      }
      
      // Check if user has wildcard permission
      if (req.user.permissions && req.user.permissions.includes('*')) {
        logger.info('Permission check: User has wildcard permission');
        return next();
      }
      
      // Check if user has all required permissions
      const userPermissions = req.user.permissions || [];
      const hasAllPermissions = permissions.every(perm => userPermissions.includes(perm));
      
      if (!hasAllPermissions) {
        logger.warn('Permission check failed:', {
          userId: req.user.id,
          userPermissions,
          requiredPermissions: permissions
        });
        return errorResponse(
          res,
          'Access denied. You do not have the required permissions.',
          403,
          'INSUFFICIENT_PERMISSIONS'
        );
      }
      
      logger.info('Permission check successful:', {
        userId: req.user.id,
        permissions
      });
      
      next();
    } catch (error) {
      logger.error('Permission check error:', error);
      return errorResponse(res, 'Permission check failed', 500, 'PERMISSION_CHECK_ERROR');
    }
  };
};

/**
 * Institution-based authorization middleware
 * Ensures user belongs to the specified institution
 */
export const requireInstitution = (req, res, next) => {
  try {
    if (!req.user) {
      logger.warn('Institution check failed: No user in request');
      return errorResponse(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    }
    
    const institutionId = req.params.institutionId || req.query.institutionId || req.body.institutionId;
    
    if (!institutionId) {
      logger.warn('Institution check failed: No institution ID provided');
      return errorResponse(res, 'Institution ID is required', 400, 'INSTITUTION_ID_REQUIRED');
    }
    
    // Superadmin can access all institutions
    if (req.user.role === 'superadmin') {
      logger.info('Institution check: Superadmin can access all institutions');
      return next();
    }
    
    // Check if user belongs to the institution
    if (req.user.institutionId !== institutionId) {
      logger.warn('Institution check failed: User does not belong to institution:', {
        userId: req.user.id,
        userInstitutionId: req.user.institutionId,
        requestedInstitutionId: institutionId
      });
      return errorResponse(
        res,
        'Access denied. You do not have access to this institution.',
        403,
        'INSTITUTION_ACCESS_DENIED'
      );
    }
    
    logger.info('Institution check successful:', {
      userId: req.user.id,
      institutionId
    });
    
    next();
  } catch (error) {
    logger.error('Institution check error:', error);
    return errorResponse(res, 'Institution check failed', 500, 'INSTITUTION_CHECK_ERROR');
  }
};

/**
 * Check if user is authenticated (for status checks)
 */
export const isAuthenticated = (req) => {
  return !!(req.user && req.user.id);
};

/**
 * Get current user from request
 */
export const getCurrentUser = (req) => {
  return req.user || null;
};

/**
 * Alias for authenticate (backward compatibility)
 */
export const protect = authenticate;

/**
 * Export constants for testing/configuration
 */
export {
  VALID_ROLES,
  TOKEN_MIN_LENGTH,
  TOKEN_MAX_LENGTH
};

export default {
  authenticate,
  optionalAuth,
  authorize,
  requirePermission,
  requireInstitution,
  protect,
  isAuthenticated,
  getCurrentUser,
  blacklistToken,
  clearTokenBlacklist,
  VALID_ROLES
};
