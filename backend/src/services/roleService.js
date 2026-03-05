import User from '../models/User.js';
import School from '../models/School.js';

const ROLES = {
  super_admin: {
    id: 'super_admin',
    name: 'Super Admin',
    displayName: 'Super Admin',
    icon: 'ti ti-crown',
    color: 'danger',
    description: 'Platform owner with complete control over all schools and billing',
    category: 'admin',
    allowedModules: ['membership'],
    permissions: {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
      canManageUsers: true,
      canManageSettings: true,
      canViewReports: true,
      canExport: true,
      canApprove: true,
      canManageFinance: true
    },
    allowedPlans: ['basic', 'medium', 'premium'],
    isSuperAdminOnly: true
  },
  school_admin: {
    id: 'school_admin',
    name: 'School Admin',
    displayName: 'School Admin',
    icon: 'ti ti-user-shield',
    color: 'primary',
    description: 'School administrator with access to all enabled modules',
    category: 'admin',
    allowedModules: ['dashboards', 'students', 'parents', 'teachers', 'academics', 'attendance', 'exams', 'fees', 'accounts', 'library', 'transport', 'hostel', 'hr', 'communication', 'reports', 'users', 'settings'],
    permissions: {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
      canManageUsers: true,
      canManageSettings: true,
      canViewReports: true,
      canExport: true,
      canApprove: true,
      canManageFinance: true
    },
    allowedPlans: ['basic', 'medium', 'premium']
  },
  teacher: {
    id: 'teacher',
    name: 'Teacher',
    displayName: 'Teacher',
    icon: 'ti ti-user-check',
    color: 'info',
    description: 'Educational staff with access to academic and attendance functions',
    category: 'academic',
    allowedModules: ['dashboards', 'students', 'teachers', 'academics', 'attendance', 'exams', 'communication', 'reports', 'library'],
    readOnlyModules: ['teachers'],
    permissions: {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: false,
      canManageUsers: false,
      canManageSettings: false,
      canViewReports: true,
      canExport: true,
      canApprove: false,
      canManageFinance: false
    },
    allowedPlans: ['basic', 'medium', 'premium']
  },
  student: {
    id: 'student',
    name: 'Student',
    displayName: 'Student',
    icon: 'ti ti-user',
    color: 'success',
    description: 'Learner with access to personal academic information',
    category: 'student',
    allowedModules: ['dashboards', 'students', 'academics', 'attendance', 'exams', 'communication', 'reports', 'library'],
    readOnlyModules: ['students', 'academics', 'attendance', 'exams', 'reports'],
    permissions: {
      canCreate: false,
      canRead: true,
      canUpdate: false,
      canDelete: false,
      canManageUsers: false,
      canManageSettings: false,
      canViewReports: true,
      canExport: false,
      canApprove: false,
      canManageFinance: false
    },
    allowedPlans: ['basic', 'medium', 'premium']
  },
  parent: {
    id: 'parent',
    name: 'Parent',
    displayName: 'Parent',
    icon: 'ti ti-user-heart',
    color: 'warning',
    description: 'Guardian with access to children\'s academic information',
    category: 'parent',
    allowedModules: ['dashboards', 'students', 'attendance', 'exams', 'communication', 'reports', 'fees'],
    readOnlyModules: ['students', 'attendance', 'exams', 'reports', 'fees'],
    permissions: {
      canCreate: false,
      canRead: true,
      canUpdate: false,
      canDelete: false,
      canManageUsers: false,
      canManageSettings: false,
      canViewReports: true,
      canExport: false,
      canApprove: false,
      canManageFinance: false
    },
    allowedPlans: ['medium', 'premium']
  },
  accountant: {
    id: 'accountant',
    name: 'Accountant',
    displayName: 'Accountant',
    icon: 'ti ti-calculator',
    color: 'secondary',
    description: 'Financial staff with access to fees and accounts',
    category: 'staff',
    allowedModules: ['dashboards', 'students', 'fees', 'accounts', 'reports'],
    permissions: {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: false,
      canManageUsers: false,
      canManageSettings: false,
      canViewReports: true,
      canExport: true,
      canApprove: true,
      canManageFinance: true
    },
    allowedPlans: ['medium', 'premium']
  },
  hr: {
    id: 'hr',
    name: 'HR',
    displayName: 'HR Manager',
    icon: 'ti ti-users-group',
    color: 'purple',
    description: 'Human resources staff with access to staff and payroll',
    category: 'staff',
    allowedModules: ['dashboards', 'staffs', 'departments', 'designations', 'leaves', 'approvals', 'holidays', 'payroll', 'reports'],
    permissions: {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: false,
      canManageUsers: true,
      canManageSettings: false,
      canViewReports: true,
      canExport: true,
      canApprove: true,
      canManageFinance: false
    },
    allowedPlans: ['premium']
  },
  librarian: {
    id: 'librarian',
    name: 'Librarian',
    displayName: 'Librarian',
    icon: 'ti ti-book-2',
    color: 'indigo',
    description: 'Library staff with access to library management',
    category: 'staff',
    allowedModules: ['library', 'students', 'reports'],
    permissions: {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: false,
      canManageUsers: false,
      canManageSettings: false,
      canViewReports: true,
      canExport: true,
      canApprove: true,
      canManageFinance: false
    },
    allowedPlans: ['medium', 'premium']
  },
  transport_manager: {
    id: 'transport_manager',
    name: 'Transport Manager',
    displayName: 'Transport Manager',
    icon: 'ti ti-car',
    color: 'orange',
    description: 'Transport staff with access to vehicle and route management',
    category: 'staff',
    allowedModules: ['transport', 'students', 'reports'],
    permissions: {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: false,
      canManageUsers: false,
      canManageSettings: false,
      canViewReports: true,
      canExport: true,
      canApprove: true,
      canManageFinance: false
    },
    allowedPlans: ['premium']
  },
  hostel_warden: {
    id: 'hostel_warden',
    name: 'Hostel Warden',
    displayName: 'Hostel Warden',
    icon: 'ti ti-building',
    color: 'teal',
    description: 'Hostel staff with access to facility and resident management',
    category: 'staff',
    allowedModules: ['hostel', 'students', 'reports'],
    permissions: {
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: false,
      canManageUsers: false,
      canManageSettings: false,
      canViewReports: true,
      canExport: true,
      canApprove: true,
      canManageFinance: false
    },
    allowedPlans: ['premium']
  }
};

export const getAllRoles = async () => {
  return Object.values(ROLES);
};

export const getRoleById = async (roleId) => {
  return ROLES[roleId] || null;
};

export const getRolesByCategory = async (category) => {
  return Object.values(ROLES).filter(role => role.category === category);
};

export const getRolesByPlan = async (plan) => {
  return Object.values(ROLES).filter(role => 
    role.allowedPlans.includes(plan) || role.isSuperAdminOnly
  );
};

export const canRoleAccessModule = async (roleId, moduleKey) => {
  const role = ROLES[roleId];
  if (!role) return false;
  return role.allowedModules.includes(moduleKey);
};

export const isModuleReadOnlyForRole = async (roleId, moduleKey) => {
  const role = ROLES[roleId];
  if (!role || !role.readOnlyModules) return false;
  return role.readOnlyModules.includes(moduleKey);
};

export const getRolePermissions = async (roleId) => {
  const role = ROLES[roleId];
  return role?.permissions || {
    canCreate: false,
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canManageUsers: false,
    canManageSettings: false,
    canViewReports: false,
    canExport: false,
    canApprove: false,
    canManageFinance: false
  };
};

export const canRolePerformAction = async (roleId, action) => {
  const permissions = await getRolePermissions(roleId);
  return permissions[action] || false;
};

export const getUsersByRole = async (roleId, schoolId = null) => {
  const query = { roleId, isActive: true };
  if (schoolId) {
    query.schoolId = schoolId;
  }
  
  const users = await User.find(query)
    .select('-password -twoFactorSecret')
    .populate('schoolId', 'name code')
    .sort({ name: 1 });
  
  return users;
};

export const getRoleStats = async (schoolId = null) => {
  const matchStage = { isActive: true };
  if (schoolId) {
    matchStage.schoolId = schoolId;
  }

  const stats = await User.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$roleId',
        count: { $sum: 1 }
      }
    }
  ]);

  const roleStats = {};
  stats.forEach(stat => {
    roleStats[stat._id] = stat.count;
  });

  return roleStats;
};

export const assignRole = async (userId, roleId) => {
  const role = ROLES[roleId];
  if (!role) {
    throw new Error('Invalid role ID');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (roleId !== 'super_admin' && !user.schoolId) {
    throw new Error('School ID is required for non-super admin roles');
  }

  if (roleId !== 'super_admin') {
    const school = await School.findById(user.schoolId);
    if (!school) {
      throw new Error('School not found');
    }

    if (!role.allowedPlans.includes(school.subscriptionPlan)) {
      throw new Error(`Role ${role.displayName} is not available in ${school.subscriptionPlan} plan`);
    }
  }

  user.roleId = roleId;
  user.allowedModules = role.allowedModules;
  user.readOnlyModules = role.readOnlyModules || [];
  
  await user.save();

  return user;
};

export const updateUserPermissions = async (userId, customPermissions) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.customPermissions = {
    ...user.customPermissions,
    ...customPermissions
  };

  await user.save();

  return user;
};

export const getUserEffectivePermissions = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const rolePermissions = await getRolePermissions(user.roleId);
  
  const effectivePermissions = { ...rolePermissions };
  
  if (user.customPermissions) {
    Object.keys(user.customPermissions).forEach(key => {
      if (user.customPermissions[key] !== undefined) {
        effectivePermissions[key] = user.customPermissions[key];
      }
    });
  }

  return effectivePermissions;
};

export const validateRoleAccess = async (userId, moduleKey, action = 'canRead') => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const role = ROLES[user.roleId];
  if (!role) {
    throw new Error('Invalid role');
  }

  const hasModuleAccess = role.allowedModules.includes(moduleKey);
  if (!hasModuleAccess) {
    return { allowed: false, reason: 'Module not accessible for this role' };
  }

  const isReadOnly = role.readOnlyModules && role.readOnlyModules.includes(moduleKey);
  if (isReadOnly && action !== 'canRead') {
    return { allowed: false, reason: 'Module is read-only for this role' };
  }

  const effectivePermissions = await getUserEffectivePermissions(userId);
  const hasPermission = effectivePermissions[action];

  if (!hasPermission) {
    return { allowed: false, reason: `Permission ${action} not granted` };
  }

  return { allowed: true };
};
