/**
 * Authentication & Authorization Middleware
 * Handles JWT verification and role-based access control with comprehensive validation
 */

import { verifyAccessToken, extractToken } from '../services/tokenService.js';
import { errorResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';
import { bypassModeEnabled, isBypassModeValid, validateMockUserToken } from '../config/bypassAuth.js';

// All available roles in the system (matches FRONTEND documentation exactly)
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  INSTITUTION_ADMIN: 'institution_admin',
  SCHOOL_ADMIN: 'school_admin',
  PRINCIPAL: 'principal',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
  ACCOUNTANT: 'accountant',
  HR_MANAGER: 'hr',
  LIBRARIAN: 'librarian',
  TRANSPORT_MANAGER: 'transport_manager',
  HOSTEL_WARDEN: 'hostel_warden',
  STAFF: 'staff'
};

// Role hierarchy (higher number = more access)
export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 13,
  [ROLES.INSTITUTION_ADMIN]: 12,
  [ROLES.SCHOOL_ADMIN]: 11,
  [ROLES.PRINCIPAL]: 10,
  [ROLES.ACCOUNTANT]: 8,
  [ROLES.HR_MANAGER]: 8,
  [ROLES.LIBRARIAN]: 7,
  [ROLES.TRANSPORT_MANAGER]: 7,
  [ROLES.HOSTEL_WARDEN]: 7,
  [ROLES.TEACHER]: 5,
  [ROLES.STAFF]: 3,
  [ROLES.PARENT]: 2,
  [ROLES.STUDENT]: 1
};

// Role permissions mapping
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['*'],
  
  [ROLES.INSTITUTION_ADMIN]: [
    'institutions.*', 'branches.*', 'users.*', 'students.*', 'teachers.*',
    'staff.*', 'classes.*', 'attendance.*', 'fees.*', 'library.*',
    'transport.*', 'hostel.*', 'hrm.*', 'reports.*', 'settings.*',
    'analytics.*', 'notifications.*'
  ],
  
  [ROLES.SCHOOL_ADMIN]: [
    'users.*', 'students.*', 'teachers.*', 'staff.*', 'classes.*',
    'attendance.*', 'fees.*', 'library.*', 'transport.*', 'hostel.*',
    'hrm.*', 'reports.*', 'settings.*', 'analytics.*', 'notifications.*'
  ],
  
  [ROLES.PRINCIPAL]: [
    'dashboard.*', 'students.*', 'teachers.*', 'staff.*', 'classes.*',
    'attendance.*', 'fees.view', 'library.view', 'transport.view', 'hostel.view',
    'hrm.view', 'reports.*', 'announcements.*', 'analytics.*', 'notifications.*'
  ],
  
  [ROLES.TEACHER]: [
    'dashboard.own', 'students.class', 'attendance.mark', 'attendance.view',
    'classes.teach', 'homework.*', 'grades.*', 'timetable.*', 'messages.*',
    'notifications.read'
  ],
  
  [ROLES.STUDENT]: [
    'profile.own', 'attendance.own', 'timetable.own', 'homework.own',
    'fees.own', 'grades.own', 'library.own', 'transport.own', 'notices.own'
  ],
  
  [ROLES.PARENT]: [
    'children.*', 'children.attendance', 'children.grades', 'children.homework',
    'children.fees', 'fees.pay', 'messages.*', 'transport.track', 'notices.*'
  ],
  
  [ROLES.ACCOUNTANT]: [
    'fees.*', 'transactions.*', 'invoices.*', 'expenses.*', 'salary.view',
    'reports.finance', 'students.fees'
  ],
  
  [ROLES.HR_MANAGER]: [
    'hrm.*', 'staff.*', 'departments.*', 'designations.*', 'leaves.*',
    'payroll.*', 'attendance.view', 'reports.hr', 'documents.*'
  ],
  
  [ROLES.LIBRARIAN]: [
    'library.*', 'books.*', 'members.*', 'categories.*', 'reports.library',
    'fines.*'
  ],
  
  [ROLES.TRANSPORT_MANAGER]: [
    'transport.*', 'vehicles.*', 'routes.*', 'drivers.*', 'pickup.*',
    'assignments.*', 'tracking.*', 'reports.transport'
  ],
  
  [ROLES.HOSTEL_WARDEN]: [
    'hostel.*', 'rooms.*', 'allocation.*', 'attendance.hostel',
    'fees.hostel', 'complaints.*', 'reports.hostel'
  ],
  
  [ROLES.STAFF]: [
    'profile.own', 'attendance.own', 'leaves.apply', 'salary.own',
    'notices.*', 'messages.*'
  ]
};

// Module permissions
export const MODULE_PERMISSIONS = {
  students: {
    view: ['super_admin', 'institution_admin', 'school_admin', 'principal', 'teacher', 'parent'],
    create: ['super_admin', 'institution_admin', 'school_admin'],
    edit: ['super_admin', 'institution_admin', 'school_admin'],
    delete: ['super_admin', 'institution_admin', 'school_admin']
  },
  teachers: {
    view: ['super_admin', 'institution_admin', 'school_admin', 'principal', 'hr'],
    create: ['super_admin', 'institution_admin', 'school_admin', 'hr'],
    edit: ['super_admin', 'institution_admin', 'school_admin', 'hr'],
    delete: ['super_admin', 'institution_admin', 'school_admin']
  },
  fees: {
    view: ['super_admin', 'institution_admin', 'school_admin', 'principal', 'accountant', 'student', 'parent'],
    create: ['super_admin', 'institution_admin', 'school_admin', 'accountant'],
    collect: ['accountant', 'hostel_warden']
  },
  attendance: {
    mark: ['super_admin', 'institution_admin', 'school_admin', 'principal', 'teacher', 'hr', 'hostel_warden', 'staff'],
    view: ['super_admin', 'institution_admin', 'school_admin', 'principal', 'teacher', 'student', 'parent', 'hr', 'hostel_warden', 'staff']
  },
  library: {
    manage: ['super_admin', 'institution_admin', 'school_admin', 'librarian'],
    issue: ['librarian'],
    view: ['super_admin', 'institution_admin', 'school_admin', 'principal', 'teacher', 'student', 'parent', 'librarian', 'staff']
  },
  transport: {
    manage: ['super_admin', 'institution_admin', 'school_admin', 'transport_manager'],
    view: ['super_admin', 'institution_admin', 'school_admin', 'principal', 'student', 'parent', 'transport_manager']
  },
  hostel: {
    manage: ['super_admin', 'institution_admin', 'school_admin', 'hostel_warden'],
    view: ['super_admin', 'institution_admin', 'school_admin', 'principal', 'hostel_warden', 'student']
  },
  hrm: {
    manage: ['super_admin', 'institution_admin', 'school_admin', 'hr'],
    view: ['super_admin', 'institution_admin', 'school_admin', 'principal', 'hr']
  },
  reports: {
    finance: ['super_admin', 'institution_admin', 'school_admin', 'accountant'],
    academic: ['super_admin', 'institution_admin', 'school_admin', 'principal'],
    hr: ['super_admin', 'institution_admin', 'school_admin', 'hr'],
    all: ['super_admin', 'institution_admin', 'school_admin']
  }
};

/**
 * Check if role has specific permission
 */
const hasPermission = (role, permission) => {
  try {
    if (!role || !permission) {
      return false;
    }
    
    const permissions = ROLE_PERMISSIONS[role] || [];
    
    // Check for wildcard permission
    if (permissions.includes('*')) {
      return true;
    }
    
    // Check for exact permission match
    if (permissions.includes(permission)) {
      return true;
    }
    
    // Check for module-level wildcard (e.g., 'students.*' matches 'students.view')
    const permissionModule = permission.split('.')[0];
    if (permissions.some(p => p === permissionModule + '.*')) {
      return true;
    }
    
    return false;
  } catch (error) {
    logger.error('Error checking permission:', error);
    return false;
  }
};

/**
 * Log authentication attempt
 */
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
    logger.info('AuthGuard: Authentication successful:', logData);
  } else {
    logger.warn('AuthGuard: Authentication failed:', logData);
  }
};

/**
 * Authentication middleware - verifies JWT token
 */
export const authenticate = (req, res, next) => {
  try {
    logger.info('AuthGuard: Authentication attempt:', {
      method: req.method,
      path: req.path,
      ip: req.ip
    });
    
    // Handle bypass mode for development/testing
    if (bypassModeEnabled && isBypassModeValid()) {
      const authHeader = req.headers.authorization;
      const token = extractToken(authHeader);
      
      if (token) {
        const mockValidation = validateMockUserToken(token);
        if (mockValidation.valid) {
          req.user = {
            id: token,
            email: mockValidation.role + '@edumanage.mock',
            role: mockValidation.role,
            permissions: ROLE_PERMISSIONS[mockValidation.role] || [],
            isMockUser: true
          };
          req.token = token;
          logger.info('AuthGuard: Bypass mode - Mock user authenticated:', { role: mockValidation.role });
          return next();
        }
      }
    }
    
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      logAuthAttempt(req, false, 'No token provided');
      return errorResponse(res, 'Access token is required', 401, 'AUTH_TOKEN_REQUIRED');
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      logAuthAttempt(req, false, 'Token verification failed');
      return errorResponse(res, 'Invalid or expired token', 401, 'TOKEN_INVALID');
    }
    
    // Validate role
    const userRole = decoded.role || 'staff';
    if (!Object.values(ROLES).includes(userRole)) {
      logAuthAttempt(req, false, 'Invalid role in token: ' + userRole, decoded.id);
      return errorResponse(res, 'Invalid role in token', 401, 'INVALID_ROLE');
    }
    
    // Attach user to request with role info
    req.user = {
      ...decoded,
      role: userRole,
      permissions: ROLE_PERMISSIONS[userRole] || [],
      isMockUser: false
    };
    req.token = token;
    
    logAuthAttempt(req, true, null, decoded.id);
    
    logger.info('AuthGuard: User authenticated successfully:', {
      userId: decoded.id,
      role: userRole,
      email: decoded.email
    });
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logAuthAttempt(req, false, 'Token expired');
      return errorResponse(res, 'Token has expired', 401, 'TOKEN_EXPIRED');
    }
    if (error.name === 'JsonWebTokenError') {
      logAuthAttempt(req, false, 'Invalid token');
      return errorResponse(res, 'Invalid token', 401, 'TOKEN_INVALID');
    }
    logger.error('AuthGuard: Authentication error:', error);
    logAuthAttempt(req, false, 'Authentication error: ' + error.message);
    return errorResponse(res, 'Authentication failed', 500, 'AUTH_ERROR');
  }
};

/**
 * Optional authentication - continues even if no token
 * Attaches user if token is valid
 */
export const optionalAuth = (req, res, next) => {
  try {
    logger.info('AuthGuard: Optional authentication:', {
      method: req.method,
      path: req.path
    });
    
    // Handle bypass mode
    if (bypassModeEnabled && isBypassModeValid()) {
      const authHeader = req.headers.authorization;
      const token = extractToken(authHeader);
      
      if (token) {
        const mockValidation = validateMockUserToken(token);
        if (mockValidation.valid) {
          req.user = {
            id: token,
            email: mockValidation.role + '@edumanage.mock',
            role: mockValidation.role,
            permissions: ROLE_PERMISSIONS[mockValidation.role] || [],
            isMockUser: true
          };
          req.token = token;
          logger.info('AuthGuard: Optional auth - Mock user authenticated:', { role: mockValidation.role });
          return next();
        }
      }
    }
    
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded) {
        const userRole = decoded.role || 'staff';
        req.user = {
          ...decoded,
          role: userRole,
          permissions: ROLE_PERMISSIONS[userRole] || [],
          isMockUser: false
        };
        req.token = token;
        logger.info('AuthGuard: Optional auth - User authenticated:', {
          userId: decoded.id,
          role: userRole
        });
      }
    } else {
      logger.info('AuthGuard: Optional auth - No token provided, continuing without authentication');
    }
    
    next();
  } catch (error) {
    logger.warn('AuthGuard: Optional auth error, continuing without authentication:', error);
    // Continue without authentication
    next();
  }
};

/**
 * Role-based authorization middleware
 * @param {Array} allowedRoles - Array of allowed roles
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      logger.info('AuthGuard: Authorization check:', {
        userId: req.user?.id,
        userRole: req.user?.role,
        requiredRoles: allowedRoles,
        path: req.path
      });
      
      if (!req.user) {
        logger.warn('AuthGuard: Authorization failed - No user in request');
        return errorResponse(res, 'Authentication required', 401, 'AUTH_REQUIRED');
      }

      const userRole = req.user.role;
      
      // Validate allowed roles
      if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
        logger.warn('AuthGuard: No roles specified for authorization');
        return next();
      }
      
      if (!allowedRoles.includes(userRole)) {
        logger.warn('AuthGuard: Access denied:', { 
          userId: req.user.id, 
          role: userRole, 
          requiredRoles: allowedRoles,
          path: req.path 
        });
        return errorResponse(
          res,
          'You do not have permission to access this resource',
          403,
          'INSUFFICIENT_PERMISSIONS'
        );
      }

      logger.info('AuthGuard: Access granted:', {
        userId: req.user.id,
        role: userRole
      });
      
      next();
    } catch (error) {
      logger.error('AuthGuard: Authorization error:', error);
      return errorResponse(res, 'Authorization failed', 500, 'AUTHORIZATION_ERROR');
    }
  };
};

/**
 * Check if user has specific permission
 * @param {string} permission - Permission string (e.g., 'students.read', 'fees.collect')
 */
export const checkPermission = (permission) => {
  return (req, res, next) => {
    try {
      logger.info('AuthGuard: Permission check:', {
        userId: req.user?.id,
        userRole: req.user?.role,
        requiredPermission: permission,
        path: req.path
      });
      
      if (!req.user) {
        logger.warn('AuthGuard: Permission check failed - No user in request');
        return errorResponse(res, 'Authentication required', 401, 'AUTH_REQUIRED');
      }
      
      if (!permission || typeof permission !== 'string') {
        logger.warn('AuthGuard: Invalid permission format:', { permission });
        return errorResponse(res, 'Invalid permission format', 400, 'INVALID_PERMISSION');
      }

      const hasAccess = hasPermission(req.user.role, permission);

      if (!hasAccess) {
        logger.warn('AuthGuard: Permission denied:', { 
          userId: req.user.id, 
          role: req.user.role,
          permission,
          path: req.path 
        });
        return errorResponse(
          res,
          'You do not have permission to perform this action',
          403,
          'INSUFFICIENT_PERMISSIONS'
        );
      }

      logger.info('AuthGuard: Permission granted:', {
        userId: req.user.id,
        permission
      });
      
      next();
    } catch (error) {
      logger.error('AuthGuard: Permission check error:', error);
      return errorResponse(res, 'Permission check failed', 500, 'PERMISSION_CHECK_ERROR');
    }
  };
};

/**
 * Check if user has access to module
 * @param {string} module - Module name
 * @param {string} action - Action (view, create, edit, delete)
 */
export const checkModuleAccess = (module, action = 'view') => {
  return (req, res, next) => {
    try {
      logger.info('AuthGuard: Module access check:', {
        userId: req.user?.id,
        userRole: req.user?.role,
        module,
        action,
        path: req.path
      });
      
      if (!req.user) {
        logger.warn('AuthGuard: Module access check failed - No user in request');
        return errorResponse(res, 'Authentication required', 401, 'AUTH_REQUIRED');
      }
      
      if (!module || typeof module !== 'string') {
        logger.warn('AuthGuard: Invalid module format:', { module });
        return errorResponse(res, 'Invalid module format', 400, 'INVALID_MODULE');
      }

      const modulePerms = MODULE_PERMISSIONS[module];
      if (!modulePerms) {
        logger.warn('AuthGuard: Module not found in permissions, allowing access:', { module });
        // If module not found, allow access (backwards compatibility)
        return next();
      }

      const allowedRoles = modulePerms[action] || [];
      if (!allowedRoles.includes(req.user.role)) {
        logger.warn('AuthGuard: Module access denied:', {
          userId: req.user.id,
          role: req.user.role,
          module,
          action,
          allowedRoles,
          path: req.path
        });
        return errorResponse(
          res,
          'You do not have permission to ' + action + ' ' + module,
          403,
          'MODULE_ACCESS_DENIED'
        );
      }

      logger.info('AuthGuard: Module access granted:', {
        userId: req.user.id,
        module,
        action
      });
      
      next();
    } catch (error) {
      logger.error('AuthGuard: Module access check error:', error);
      return errorResponse(res, 'Module access check failed', 500, 'MODULE_ACCESS_CHECK_ERROR');
    }
  };
};

/**
 * Institution access middleware
 * Ensures user can only access their institution's data
 */
export const institutionAccess = (req, res, next) => {
  try {
    logger.info('AuthGuard: Institution access check:', {
      userId: req.user?.id,
      userRole: req.user?.role,
      path: req.path
    });
    
    if (!req.user) {
      logger.warn('AuthGuard: Institution access check failed - No user in request');
      return errorResponse(res, 'Authentication required', 401, 'AUTH_REQUIRED');
    }

    // Super admin can access all institutions
    if (req.user.role === 'super_admin') {
      logger.info('AuthGuard: Super admin can access all institutions');
      return next();
    }

    // Check if institution ID in params matches user's institution
    const paramInstitutionId = req.params.institutionId || req.body.institution || req.query.institutionId;
    
    if (paramInstitutionId && req.user.institution) {
      if (paramInstitutionId !== req.user.institution.toString()) {
        logger.warn('AuthGuard: Institution access denied:', {
          userId: req.user.id,
          userInstitution: req.user.institution,
          requestedInstitution: paramInstitutionId
        });
        return errorResponse(
          res,
          'You do not have access to this institution',
          403,
          'INSTITUTION_ACCESS_DENIED'
        );
      }
    }

    logger.info('AuthGuard: Institution access granted:', {
      userId: req.user.id,
      institutionId: paramInstitutionId
    });
    
    next();
  } catch (error) {
    logger.error('AuthGuard: Institution access error:', error);
    return errorResponse(res, 'Institution access check failed', 500, 'INSTITUTION_ACCESS_ERROR');
  }
};

/**
 * Admin only middleware
 */
export const isAdmin = (req, res, next) => {
  return authorize('admin', 'super_admin')(req, res, next);
};

/**
 * Teacher only middleware
 */
export const isTeacher = (req, res, next) => {
  return authorize('teacher', 'admin', 'super_admin')(req, res, next);
};

/**
 * Student only middleware
 */
export const isStudent = (req, res, next) => {
  return authorize('student')(req, res, next);
};

/**
 * Parent only middleware
 */
export const isParent = (req, res, next) => {
  return authorize('parent')(req, res, next);
};

/**
 * Super admin only middleware
 */
export const isSuperAdmin = (req, res, next) => {
  return authorize('super_admin')(req, res, next);
};

/**
 * Institution admin only middleware
 */
export const isInstitutionAdmin = (req, res, next) => {
  return authorize('institution_admin')(req, res, next);
};

/**
 * School admin only middleware
 */
export const isSchoolAdmin = (req, res, next) => {
  return authorize('school_admin')(req, res, next);
};

/**
 * Principal only middleware
 */
export const isPrincipal = (req, res, next) => {
  return authorize('principal')(req, res, next);
};

/**
 * Accountant only middleware
 */
export const isAccountant = (req, res, next) => {
  return authorize('accountant')(req, res, next);
};

/**
 * HR Manager only middleware
 */
export const isHRManager = (req, res, next) => {
  return authorize('hr')(req, res, next);
};

/**
 * Librarian only middleware
 */
export const isLibrarian = (req, res, next) => {
  return authorize('librarian')(req, res, next);
};

/**
 * Transport Manager only middleware
 */
export const isTransportManager = (req, res, next) => {
  return authorize('transport_manager')(req, res, next);
};

/**
 * Hostel Warden only middleware
 */
export const isHostelWarden = (req, res, next) => {
  return authorize('hostel_warden')(req, res, next);
};

/**
 * Staff only middleware
 */
export const isStaffMember = (req, res, next) => {
  return authorize('staff')(req, res, next);
};

/**
 * Check if user can manage a specific module
 */
export const canManageModule = (module) => {
  return checkModuleAccess(module, 'manage');
};

/**
 * Check if user can view a specific module
 */
export const canViewModule = (module) => {
  return checkModuleAccess(module, 'view');
};

/**
 * Check if user can create records
 */
export const canCreate = (module) => {
  return checkModuleAccess(module, 'create');
};

/**
 * Check if user can delete records
 */
export const canDelete = (module) => {
  return checkModuleAccess(module, 'delete');
};

/**
 * Get user's role hierarchy level
 */
export const getRoleLevel = (role) => {
  return ROLE_HIERARCHY[role] || 0;
};

/**
 * Check if user has higher or equal role level
 */
export const hasRoleLevel = (userRole, requiredRole) => {
  return getRoleLevel(userRole) >= getRoleLevel(requiredRole);
};

export default {
  ROLES,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  MODULE_PERMISSIONS,
  authenticate,
  optionalAuth,
  authorize,
  checkPermission,
  checkModuleAccess,
  institutionAccess,
  isAdmin,
  isTeacher,
  isStudent,
  isParent,
  isSuperAdmin,
  isInstitutionAdmin,
  isSchoolAdmin,
  isPrincipal,
  isAccountant,
  isHRManager,
  isLibrarian,
  isTransportManager,
  isHostelWarden,
  isStaffMember,
  canManageModule,
  canViewModule,
  canCreate,
  canDelete,
  getRoleLevel,
  hasRoleLevel
};
