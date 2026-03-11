/**
 * Permissions Utility
 * Handles permission checking, role-based access control, and module access.
 * Integrates with auth store for real user data from backend API.
 * 
 * Backend API: GET /api/v1/permissions
 * Backend API: GET /api/v1/roles
 * Backend API: POST /api/v1/permissions/check
 */

import { MODULE_MAP, MODULES, getModuleByRoute, type Module } from '../config/modules';
import { isModuleEnabledForPlan } from '../config/plans';
import { ROLES as _ROLE_CONFIG, type UserRole as _UserRole, canRoleAccessModule, getRoleById } from '../config/roles-complete';
import { getSidebarMenu } from '../config/sidebar-menus';

/**
 * User interface matching backend API response and auth store
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  schoolId?: string;
  institutionId?: string;
  plan?: 'basic' | 'medium' | 'premium';
  enabledModules?: string[];
  permissions?: string[];
  modules?: string[];
}

/**
 * Get role-specific dashboard path
 */
export const getRoleBasedDashboard = (role?: string): string => {
  console.log('=== getRoleBasedDashboard DEBUG ===');
  console.log('getRoleBasedDashboard called with role:', role);
  console.log('Role type:', typeof role);
  console.log('Role length:', role?.length);
  
  if (!role) {
    console.log('No role provided, returning "/"');
    return '/';
  }

  // TEMPORARY FIX: Force SUPER_ADMIN to go to super-admin dashboard
  if (role === 'SUPER_ADMIN' || role === 'super_admin' || role === 'superadmin') {
    console.log('SUPER_ADMIN role detected, forcing super-admin dashboard');
    return '/super-admin/dashboard';
  }

  const normalizedRole = role.toLowerCase().replace(/[_\s]+/g, '_');
  console.log('Normalized role:', normalizedRole);
  
  const dashboardMap: Record<string, string> = {
    // Super Admin - handle all variations
    'superadmin': '/super-admin/dashboard',
    'super_admin': '/super-admin/dashboard',
    'super-admin': '/super-admin/dashboard',

    // School Admin
    'institution_admin': '/dashboard/main',
    'institution-admin': '/dashboard/main',
    'school_admin': '/dashboard/main',
    'school-admin': '/dashboard/main',

    // Academic Roles
    'teacher': '/dashboard/teacher',
    'student': '/dashboard/student',
    'parent': '/dashboard/parent',
    'principal': '/dashboard/principal',

    // Staff Roles
    'staff': '/dashboard/staff',
    'staff_member': '/dashboard/staff',
    'staff-member': '/dashboard/staff',
    'accountant': '/dashboard/finance',
    'hr': '/dashboard/hr',
    'hr_manager': '/dashboard/hr',
    'hr-manager': '/dashboard/hr',
    'librarian': '/dashboard/library',
    'transport_manager': '/dashboard/transport',
    'transport-manager': '/dashboard/transport',
    'hostel_warden': '/dashboard/hostel',
    'hostel-warden': '/dashboard/hostel'
  };

  console.log('Available dashboard keys:', Object.keys(dashboardMap));
  console.log('Looking for key:', normalizedRole);
  console.log('Key exists in map:', normalizedRole in dashboardMap);

  const dashboardPath = dashboardMap[normalizedRole] || '/dashboard/main';
  console.log('Final dashboard path:', dashboardPath);
  console.log('=== END getRoleBasedDashboard DEBUG ===');
  
  return dashboardPath;
};

const normalizeModuleKey = (moduleKey: string): string | null => {
  if (!moduleKey) return null;
  const keyUpper = moduleKey.toUpperCase();

  if (MODULE_MAP[keyUpper]) return keyUpper;

  const foundKey = Object.keys(MODULE_MAP).find(k => k.toLowerCase() === moduleKey.toLowerCase());
  if (foundKey) return foundKey;

  if (keyUpper.endsWith('S')) {
    const singular = keyUpper.slice(0, -1);
    if (MODULE_MAP[singular]) return singular;
  }

  const plural = `${keyUpper}S`;
  if (MODULE_MAP[plural]) return plural;

  return null;
};

export const canAccessModule = (user: User | null, moduleKey: string): boolean => {
  if (!user) return false;

  const normalizedRole = user.role.toLowerCase();
  if (normalizedRole === 'superadmin' || normalizedRole === 'super_admin') {
    return true;
  }

  const normalized = normalizeModuleKey(moduleKey);
  if (!normalized) return false;

  const module = MODULE_MAP[normalized];
  if (!module) return false;

  if (user.plan && !isModuleEnabledForPlan(module.id, user.plan)) {
    return false;
  }

  if (user.enabledModules && user.enabledModules.length > 0) {
    const moduleKeyUpper = module.id.toUpperCase();
    const hasModule = user.enabledModules.some(m => m.toUpperCase() === moduleKeyUpper);
    if (!hasModule) {
      return false;
    }
  }

  return canRoleAccessModule(user.role, module.id);
};

export const canAccessRoute = (user: User | null, routePath: string): boolean => {
  if (!user || !user.role) {
    console.log('[canAccessRoute] No user or role found, denying access')
    return false;
  }

  try {
    const normalizedRole = user.role.toLowerCase();
    if (normalizedRole === 'superadmin' || normalizedRole === 'super_admin') {
      return true;
    }

  const module = getModuleByRoute(routePath);
  if (!module) {
    return true;
  }

  if (user.plan && !isModuleEnabledForPlan(module.id, user.plan)) {
    return false;
  }

  if (user.enabledModules && !user.enabledModules.some(m => m.toUpperCase() === module.id.toUpperCase())) {
    return false;
  }

  return canRoleAccessModule(user.role, module.id);
  } catch (error) {
    console.error('[canAccessRoute] Error checking route access:', error);
    return false;
  }
};

export const canPerformAction = (user: User | null, action: string): boolean => {
  if (!user) return false;

  const normalizedRole = user.role.toLowerCase();
  if (normalizedRole === 'superadmin' || normalizedRole === 'super_admin') {
    return true;
  }

  if (user.permissions) {
    return user.permissions.includes(action) || user.permissions.includes('*');
  }

  return false;
};

export const getUpgradeMessage = (moduleKey: string, currentPlan: string): string => {
  const normalized = normalizeModuleKey(moduleKey);
  const module = normalized ? MODULE_MAP[normalized] : undefined;
  if (!module) return 'This feature is not available';

  const requiredPlans = ['basic', 'medium', 'premium', 'enterprise'];
  const currentPlanIndex = requiredPlans.indexOf(currentPlan as any);

  if (currentPlanIndex === -1) {
    return 'This feature requires a Premium plan';
  }

  if (currentPlanIndex === requiredPlans.length - 1) {
    return 'You already have access to this feature';
  }

  const nextPlan = requiredPlans[currentPlanIndex + 1];
  return `This feature requires a ${nextPlan.toUpperCase()} plan`;
};

export const shouldShowUpgradePrompt = (user: User | null, moduleKey: string): boolean => {
  if (!user) return false;

  const normalizedRole = user.role.toLowerCase();
  if (normalizedRole === 'superadmin' || normalizedRole === 'super_admin') {
    return false;
  }

  const normalized = normalizeModuleKey(moduleKey);
  if (!normalized) return true;
  const module = MODULE_MAP[normalized];
  if (!module) return true;

  return user.plan ? !isModuleEnabledForPlan(module.id, user.plan) : true;
};

export const getAccessibleRoutes = (user: User | null): string[] => {
  if (!user) return [];

  const normalizedRole = user.role.toLowerCase();
  if (normalizedRole === 'superadmin' || normalizedRole === 'super_admin') {
    return MODULES.map(module => module.route);
  }

  return MODULES
    .filter(module => canAccessModule(user, module.id))
    .map(module => module.route);
};

export const getVisibleModules = (user: User | null): Record<string, Module> => {
  if (!user) return {};

  const normalizedRole = user.role.toLowerCase();
  if (normalizedRole === 'superadmin' || normalizedRole === 'super_admin') {
    return MODULES.reduce((acc, module) => {
      acc[module.id] = module;
      return acc;
    }, {} as Record<string, Module>);
  }

  const visibleModules: Record<string, Module> = {};

  MODULES.forEach(module => {
    if (canAccessModule(user, module.id)) {
      visibleModules[module.id] = module;
    }
  });

  return visibleModules;
};

export const filterMenuItems = (user: User | null, menuItems: any[]): any[] => {
  if (!user) return [];

  return menuItems.filter(item => {
    if (!item.route) return true;

    return canAccessRoute(user, item.route);
  });
};

export const getMenuForRole = (roleId: string) => {
  return getSidebarMenu(roleId);
};

export const hasRole = (user: User | null, roleId: string): boolean => {
  if (!user) return false;
  return user.role.toLowerCase() === roleId.toLowerCase();
};

export const hasAnyRole = (user: User | null, roleIds: string[]): boolean => {
  if (!user) return false;
  const normalizedRole = user.role.toLowerCase();
  return roleIds.some(roleId => normalizedRole === roleId.toLowerCase());
};

export const canManageUsers = (user: User | null): boolean => {
  if (!user) return false;
  return hasAnyRole(user, ['institution_admin', 'school_admin', 'superadmin', 'super_admin']);
};

export const canAccessUserManagement = (user: User | null): boolean => {
  if (!user) return false;
  return hasAnyRole(user, ['institution_admin', 'school_admin', 'superadmin', 'super_admin']);
};

export const canAccessSettings = (user: User | null): boolean => {
  if (!user) return false;
  return hasAnyRole(user, ['institution_admin', 'school_admin', 'superadmin', 'super_admin']);
};

export const canViewAllReports = (user: User | null): boolean => {
  if (!user) return false;
  return hasAnyRole(user, ['institution_admin', 'school_admin', 'superadmin', 'super_admin']);
};

export const isSchoolAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return hasAnyRole(user, ['institution_admin', 'school_admin']);
};

export const isStaffRole = (user: User | null): boolean => {
  if (!user) return false;
  return hasAnyRole(user, ['accountant', 'hr', 'hr_manager', 'librarian', 'transport_manager', 'hostel_warden']);
};

export const isTopLevelUser = (user: User | null): boolean => {
  if (!user) return false;
  return hasAnyRole(user, ['superadmin', 'super_admin', 'institution_admin']);
};

export const getRoleDisplayName = (roleId: string): string => {
  const role = getRoleById(roleId);
  return role ? role.label : roleId;
};

export const getRoleDescription = (roleId: string): string => {
  const role = getRoleById(roleId);
  return role ? role.description : '';
};

export const filterRoutesByRole = (routes: string[], roleId: string): string[] => {
  const mockUser: User = {
    id: '',
    name: '',
    email: '',
    role: roleId,
    plan: 'premium',
    enabledModules: []
  };
  const accessibleRoutes = getAccessibleRoutes(mockUser);
  return routes.filter(route => accessibleRoutes.includes(route));
};
