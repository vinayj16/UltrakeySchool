import logger from '../utils/logger.js';

// Default roles available for bypass authentication
const DEFAULT_BYPASS_ROLES = [
  'superadmin',
  'admin',
  'school_admin',
  'principal',
  'teacher',
  'student',
  'parent',
  'accountant',
  'hrm_manager',
  'librarian',
  'transport_manager',
  'hostel_warden',
  'staff_member',
  'guest'
];

// Validation constants
const MAX_ROLE_LENGTH = 50;
const MIN_ROLE_LENGTH = 3;
const VALID_ROLE_PATTERN = /^[a-z][a-z0-9_]*$/;
const MAX_BYPASS_ROLES = 20;

// Environment-based configuration
const bypassModeEnabled = process.env.AUTH_BYPASS_MODE === 'true';
const bypassWarningShown = process.env.AUTH_BYPASS_WARNING !== 'false';
const bypassExpiryTime = parseInt(process.env.AUTH_BYPASS_EXPIRY_HOURS) || 24; // hours
const bypassAllowedEnvironments = (process.env.AUTH_BYPASS_ALLOWED_ENVS || 'development,test').split(',').map(e => e.trim());

// Validation helper functions
const validateRoleName = (role) => {
  const errors = [];
  
  if (!role || typeof role !== 'string') {
    errors.push('Role must be a non-empty string');
    return errors;
  }
  
  const trimmedRole = role.trim();
  
  if (trimmedRole.length < MIN_ROLE_LENGTH) {
    errors.push('Role name must be at least ' + MIN_ROLE_LENGTH + ' characters');
  }
  
  if (trimmedRole.length > MAX_ROLE_LENGTH) {
    errors.push('Role name must not exceed ' + MAX_ROLE_LENGTH + ' characters');
  }
  
  if (!VALID_ROLE_PATTERN.test(trimmedRole)) {
    errors.push('Role name must start with a letter and contain only lowercase letters, numbers, and underscores');
  }
  
  return errors;
};

const validateEnvironment = () => {
  const currentEnv = process.env.NODE_ENV || 'development';
  
  if (bypassModeEnabled && !bypassAllowedEnvironments.includes(currentEnv)) {
    logger.warn('Auth bypass mode is enabled in ' + currentEnv + ' environment. This is a security risk!');
    return false;
  }
  
  return true;
};

// Parse and validate bypass roles from environment
const bypassRoles = (() => {
  try {
    const rolesString = process.env.AUTH_BYPASS_ROLES || DEFAULT_BYPASS_ROLES.join(',');
    const roles = rolesString
      .split(',')
      .map((role) => role.trim().toLowerCase())
      .filter(Boolean);
    
    // Validate number of roles
    if (roles.length > MAX_BYPASS_ROLES) {
      logger.warn('Too many bypass roles configured (' + roles.length + '). Maximum is ' + MAX_BYPASS_ROLES + '. Using first ' + MAX_BYPASS_ROLES + ' roles.');
      return roles.slice(0, MAX_BYPASS_ROLES);
    }
    
    // Validate each role
    const validRoles = [];
    const invalidRoles = [];
    
    roles.forEach((role) => {
      const errors = validateRoleName(role);
      if (errors.length === 0) {
        validRoles.push(role);
      } else {
        invalidRoles.push({ role, errors });
      }
    });
    
    if (invalidRoles.length > 0) {
      logger.warn('Invalid bypass roles detected:', invalidRoles);
    }
    
    if (validRoles.length === 0) {
      logger.warn('No valid bypass roles found. Using default roles.');
      return DEFAULT_BYPASS_ROLES;
    }
    
    logger.info('Bypass roles configured:', { count: validRoles.length, roles: validRoles });
    return validRoles;
  } catch (error) {
    logger.error('Error parsing bypass roles:', error);
    return DEFAULT_BYPASS_ROLES;
  }
})();

// Normalize role name to standard format
const normalizeRole = (role) => {
  if (!role || typeof role !== 'string') {
    logger.warn('Invalid role provided for normalization:', { role });
    return '';
  }
  
  try {
    const normalized = role.toLowerCase().trim().replace(/\s+/g, '_');
    
    // Validate normalized role
    const errors = validateRoleName(normalized);
    if (errors.length > 0) {
      logger.warn('Role normalization resulted in invalid role:', { original: role, normalized, errors });
      return '';
    }
    
    return normalized;
  } catch (error) {
    logger.error('Error normalizing role:', error);
    return '';
  }
};

// Resolve bypass role with fallback
const resolveBypassRole = (preferredRole) => {
  try {
    if (!preferredRole) {
      logger.info('No preferred role provided. Using default bypass role:', { role: bypassRoles[0] });
      return bypassRoles[0];
    }
    
    const normalized = normalizeRole(preferredRole);
    
    if (!normalized) {
      logger.warn('Failed to normalize preferred role. Using default:', { preferredRole, default: bypassRoles[0] });
      return bypassRoles[0];
    }
    
    if (bypassRoles.includes(normalized)) {
      logger.info('Resolved bypass role:', { preferredRole, resolved: normalized });
      return normalized;
    }
    
    logger.warn('Preferred role not in bypass roles list. Using default:', { 
      preferredRole, 
      normalized, 
      default: bypassRoles[0],
      availableRoles: bypassRoles 
    });
    return bypassRoles[0];
  } catch (error) {
    logger.error('Error resolving bypass role:', error);
    return bypassRoles[0];
  }
};

// Create mock user for bypass authentication
const createMockUser = (role, options = {}) => {
  try {
    const normalizedRole = normalizeRole(role);
    
    if (!normalizedRole) {
      logger.error('Cannot create mock user with invalid role:', { role });
      throw new Error('Invalid role provided for mock user creation');
    }
    
    if (!bypassRoles.includes(normalizedRole)) {
      logger.warn('Creating mock user with role not in bypass list:', { role: normalizedRole });
    }
    
    // Generate role display name
    const displayName = normalizedRole
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
    
    // Create mock user object
    const mockUser = {
      id: options.id || 'mock-' + normalizedRole + '-' + Date.now(),
      email: options.email || normalizedRole + '@edumanage.mock',
      name: options.name || displayName + ' (Mock)',
      role: normalizedRole,
      plan: options.plan || 'premium',
      permissions: options.permissions || ['*'],
      modules: options.modules || ['dashboard', 'students', 'attendance', 'fees', 'reports', 'settings'],
      institutionId: options.institutionId || null,
      schoolId: options.schoolId || null,
      avatar: options.avatar || null,
      status: options.status || 'active',
      isMockUser: true,
      mockCreatedAt: new Date().toISOString(),
      mockExpiresAt: new Date(Date.now() + bypassExpiryTime * 60 * 60 * 1000).toISOString()
    };
    
    logger.info('Mock user created:', { 
      id: mockUser.id, 
      role: mockUser.role, 
      email: mockUser.email,
      expiresAt: mockUser.mockExpiresAt
    });
    
    return mockUser;
  } catch (error) {
    logger.error('Error creating mock user:', error);
    throw error;
  }
};

// Check if bypass mode is enabled and valid
const isBypassModeValid = () => {
  if (!bypassModeEnabled) {
    return false;
  }
  
  const envValid = validateEnvironment();
  
  if (!envValid) {
    logger.error('Bypass mode is enabled in an invalid environment');
    return false;
  }
  
  if (bypassWarningShown) {
    logger.warn('='.repeat(80));
    logger.warn('AUTH BYPASS MODE IS ENABLED - THIS IS A SECURITY RISK!');
    logger.warn('Only use this mode in development or testing environments.');
    logger.warn('Bypass roles: ' + bypassRoles.join(', '));
    logger.warn('Environment: ' + (process.env.NODE_ENV || 'development'));
    logger.warn('='.repeat(80));
  }
  
  return true;
};

// Get bypass configuration info
const getBypassConfig = () => {
  return {
    enabled: bypassModeEnabled,
    valid: isBypassModeValid(),
    roles: bypassRoles,
    defaultRole: bypassRoles[0],
    environment: process.env.NODE_ENV || 'development',
    allowedEnvironments: bypassAllowedEnvironments,
    expiryHours: bypassExpiryTime,
    warningEnabled: bypassWarningShown,
    totalRoles: bypassRoles.length
  };
};

// Validate mock user token (if using token-based bypass)
const validateMockUserToken = (token) => {
  try {
    if (!token || typeof token !== 'string') {
      return { valid: false, error: 'Invalid token format' };
    }
    
    // Check if token follows mock user pattern
    if (!token.startsWith('mock-')) {
      return { valid: false, error: 'Not a mock user token' };
    }
    
    // Extract role from token
    const parts = token.split('-');
    if (parts.length < 2) {
      return { valid: false, error: 'Invalid token structure' };
    }
    
    const role = parts[1];
    const normalized = normalizeRole(role);
    
    if (!normalized || !bypassRoles.includes(normalized)) {
      return { valid: false, error: 'Invalid or unauthorized role in token' };
    }
    
    return { valid: true, role: normalized };
  } catch (error) {
    logger.error('Error validating mock user token:', error);
    return { valid: false, error: error.message };
  }
};

// Get available bypass roles with metadata
const getAvailableRoles = () => {
  return bypassRoles.map((role) => {
    const displayName = role.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    return {
      value: role,
      label: displayName,
      email: role + '@edumanage.mock',
      isDefault: role === bypassRoles[0]
    };
  });
};

// Check if a specific role is allowed for bypass
const isRoleAllowed = (role) => {
  if (!role) return false;
  const normalized = normalizeRole(role);
  return normalized && bypassRoles.includes(normalized);
};

// Initialize bypass mode (call this on app startup)
const initializeBypassMode = () => {
  try {
    logger.info('Initializing bypass authentication mode...');
    
    const config = getBypassConfig();
    
    if (config.enabled) {
      if (config.valid) {
        logger.info('Bypass mode initialized successfully:', {
          roles: config.totalRoles,
          defaultRole: config.defaultRole,
          environment: config.environment
        });
      } else {
        logger.error('Bypass mode initialization failed: Invalid configuration');
        return false;
      }
    } else {
      logger.info('Bypass mode is disabled');
    }
    
    return config.valid;
  } catch (error) {
    logger.error('Error initializing bypass mode:', error);
    return false;
  }
};

export {
  // Core configuration
  bypassModeEnabled,
  bypassRoles,
  DEFAULT_BYPASS_ROLES,
  
  // User creation and role management
  createMockUser,
  resolveBypassRole,
  normalizeRole,
  
  // Validation functions
  isBypassModeValid,
  validateMockUserToken,
  isRoleAllowed,
  validateRoleName,
  
  // Configuration getters
  getBypassConfig,
  getAvailableRoles,
  
  // Initialization
  initializeBypassMode,
  
  // Constants
  MAX_ROLE_LENGTH,
  MIN_ROLE_LENGTH,
  VALID_ROLE_PATTERN
};
