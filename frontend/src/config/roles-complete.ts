// Complete Role Configuration - 10 Roles as specified
export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent' | 'accountant' | 'hr' | 'librarian' | 'transport_manager' | 'hostel_warden';

export interface Role {
  id: string
  name: string
  displayName: string
  label: string
  icon: string
  color: string
  description: string
  category: 'admin' | 'academic' | 'staff' | 'student' | 'parent'
  allowedModules: string[]
  readOnlyModules?: string[]
  permissions: {
    canCreate: boolean
    canRead: boolean
    canUpdate: boolean
    canDelete: boolean
    canManageUsers: boolean
    canManageSettings: boolean
    canViewReports: boolean
    canExport: boolean
    canApprove: boolean
    canManageFinance: boolean
  }
  allowedPlans: ('basic' | 'medium' | 'premium')[]
  isSuperAdminOnly?: boolean
}

export const ROLES: Role[] = [
  // Super Admin (You)
  {
    id: 'super_admin',
    name: 'Super Admin',
    displayName: 'Super Admin',
    label: 'Super Admin',
    icon: 'ti ti-crown',
    color: 'danger',
    description: 'Platform owner with complete control over all schools and billing',
    category: 'admin',
    allowedModules: ['membership'], // Super Admin sees membership & billing only
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

  // School Admin
  {
    id: 'school_admin',
    name: 'School Admin',
    displayName: 'School Admin',
    label: 'School Admin',
    icon: 'ti ti-user-shield',
    color: 'primary',
    description: 'School administrator with access to all enabled modules',
    category: 'admin',
    allowedModules: [
      'dashboards',
      'students',
      'parents',
      'teachers',
      'academics',
      'attendance',
      'exams',
      'fees',
      'accounts',
      'library',
      'transport',
      'hostel',
      'hr',
      'communication',
      'reports',
      'users',
      'settings'
    ],
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

  // Teacher
  {
    id: 'teacher',
    name: 'Teacher',
    displayName: 'Teacher',
    label: 'Teacher',
    icon: 'ti ti-user-check',
    color: 'info',
    description: 'Educational staff with access to academic and attendance functions',
    category: 'academic',
    allowedModules: [
      'dashboards',
      'students',
      'teachers',
      'academics',
      'attendance',
      'exams',
      'communication',
      'reports',
      'library'
    ],
    readOnlyModules: ['teachers'], // Can view own profile only
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

  // Student
  {
    id: 'student',
    name: 'Student',
    displayName: 'Student',
    label: 'Student',
    icon: 'ti ti-user',
    color: 'success',
    description: 'Learner with access to personal academic information',
    category: 'student',
    allowedModules: [
      'dashboards',
      'students',
      'academics',
      'attendance',
      'exams',
      'communication',
      'reports',
      'library'
    ],
    readOnlyModules: ['students', 'academics', 'attendance', 'exams', 'reports'], // Read-only access to own data
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

  // Parent
  {
    id: 'parent',
    name: 'Parent',
    displayName: 'Parent',
    label: 'Parent',
    icon: 'ti ti-user-heart',
    color: 'warning',
    description: 'Guardian with access to children\'s academic information',
    category: 'parent',
    allowedModules: [
      'dashboards',
      'students',
      'attendance',
      'exams',
      'communication',
      'reports',
      'fees'
    ],
    readOnlyModules: ['students', 'attendance', 'exams', 'reports', 'fees'], // Read-only access to children's data
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
    allowedPlans: ['medium', 'premium'] // Parents only in Medium+
  },

  // Accountant
  {
    id: 'accountant',
    name: 'Accountant',
    displayName: 'Accountant',
    label: 'Accountant',
    icon: 'ti ti-calculator',
    color: 'secondary',
    description: 'Financial staff with access to fees and accounts',
    category: 'staff',
    allowedModules: [
      'dashboards',
      'students',
      'fees',
      'accounts',
      'reports'
    ],
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

  // HR
  {
    id: 'hr',
    name: 'HR',
    displayName: 'HR Manager',
    label: 'HR Manager',
    icon: 'ti ti-users-group',
    color: 'purple',
    description: 'Human resources staff with access to staff and payroll',
    category: 'staff',
    allowedModules: [
      'dashboards',
      'staffs',
      'departments',
      'designations',
      'leaves',
      'approvals',
      'holidays',
      'payroll',
      'reports'
    ],
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

  // Librarian
  {
    id: 'librarian',
    name: 'Librarian',
    displayName: 'Librarian',
    label: 'Librarian',
    icon: 'ti ti-book-2',
    color: 'indigo',
    description: 'Library staff with access to library management',
    category: 'staff',
    allowedModules: [
      'library',
      'students',
      'reports'
    ],
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

  // Transport Manager
  {
    id: 'transport_manager',
    name: 'Transport Manager',
    displayName: 'Transport Manager',
    label: 'Transport Manager',
    icon: 'ti ti-car',
    color: 'orange',
    description: 'Transport staff with access to vehicle and route management',
    category: 'staff',
    allowedModules: [
      'transport',
      'students',
      'reports'
    ],
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

  // Hostel Warden
  {
    id: 'hostel_warden',
    name: 'Hostel Warden',
    displayName: 'Hostel Warden',
    label: 'Hostel Warden',
    icon: 'ti ti-building',
    color: 'teal',
    description: 'Hostel staff with access to facility and resident management',
    category: 'staff',
    allowedModules: [
      'hostel',
      'students',
      'reports'
    ],
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
]

// Helper functions
export const getRoleById = (id: string): Role | undefined => {
  return ROLES.find(role => role.id === id)
}

export const getRoleByName = (name: string): Role | undefined => {
  return ROLES.find(role => role.name === name)
}

export const getRolesByCategory = (category: Role['category']): Role[] => {
  return ROLES.filter(role => role.category === category)
}

export const getRolesByPlan = (plan: 'basic' | 'medium' | 'premium'): Role[] => {
  return ROLES.filter(role => 
    role.allowedPlans.includes(plan) || role.isSuperAdminOnly
  )
}

export const canRoleAccessModule = (roleId: string, moduleKey: string): boolean => {
  const role = getRoleById(roleId)
  if (!role) return false
  return role.allowedModules.includes(moduleKey)
}

export const isModuleReadOnlyForRole = (roleId: string, moduleKey: string): boolean => {
  const role = getRoleById(roleId)
  if (!role || !role.readOnlyModules) return false
  return role.readOnlyModules.includes(moduleKey)
}

export const getRolePermissions = (roleId: string): Role['permissions'] => {
  const role = getRoleById(roleId)
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
  }
}

export const canRolePerformAction = (roleId: string, action: keyof Role['permissions']): boolean => {
  const permissions = getRolePermissions(roleId)
  return permissions[action] || false
}