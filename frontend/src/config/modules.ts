/**
 * Module configuration for EduManage Pro
 * Defines all available modules and their properties
 */

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  permissions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    manageUsers: boolean;
    manageSettings: boolean;
    viewReports: boolean;
    export: boolean;
    approve: boolean;
    manageFinance: boolean;
  };
  features: string[];
  dependencies: string[];
  enabled: boolean;
}

// Define all modules
export const MODULE_LIST: Module[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Overview and analytics dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    permissions: {
      create: false,
      read: true,
      update: false,
      delete: false,
      manageUsers: false,
      manageSettings: false,
      viewReports: true,
      export: true,
      approve: false,
      manageFinance: false
    },
    features: ['analytics', 'charts', 'overview'],
    dependencies: [],
    enabled: true
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Academic management and curriculum',
    icon: 'book',
    route: '/academic',
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      manageUsers: false,
      manageSettings: false,
      viewReports: true,
      export: true,
      approve: true,
      manageFinance: false
    },
    features: ['classes', 'subjects', 'schedules', 'grades'],
    dependencies: [],
    enabled: true
  },
  {
    id: 'attendance',
    name: 'Attendance',
    description: 'Student and staff attendance tracking',
    icon: 'calendar',
    route: '/attendance',
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      manageUsers: false,
      manageSettings: false,
      viewReports: true,
      export: true,
      approve: true,
      manageFinance: false
    },
    features: ['student-attendance', 'staff-attendance', 'reports'],
    dependencies: [],
    enabled: true
  },
  {
    id: 'fees',
    name: 'Fees Management',
    description: 'Fee collection and management',
    icon: 'dollar-sign',
    route: '/fees',
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      manageUsers: false,
      manageSettings: false,
      viewReports: true,
      export: true,
      approve: true,
      manageFinance: true
    },
    features: ['fee-structure', 'payments', 'receipts', 'reports'],
    dependencies: [],
    enabled: true
  },
  {
    id: 'hrm',
    name: 'HR Management',
    description: 'Human resources and staff management',
    icon: 'users',
    route: '/hrm',
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      manageUsers: true,
      manageSettings: false,
      viewReports: true,
      export: true,
      approve: true,
      manageFinance: false
    },
    features: ['staff-management', 'payroll', 'leave-management'],
    dependencies: [],
    enabled: true
  },
  {
    id: 'library',
    name: 'Library',
    description: 'Library management system',
    icon: 'book-open',
    route: '/library',
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      manageUsers: false,
      manageSettings: false,
      viewReports: true,
      export: true,
      approve: true,
      manageFinance: false
    },
    features: ['books', 'borrowing', 'catalog'],
    dependencies: [],
    enabled: true
  },
  {
    id: 'transport',
    name: 'Transport',
    description: 'Transport and vehicle management',
    icon: 'bus',
    route: '/transport',
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      manageUsers: false,
      manageSettings: false,
      viewReports: true,
      export: true,
      approve: true,
      manageFinance: false
    },
    features: ['routes', 'vehicles', 'drivers'],
    dependencies: [],
    enabled: true
  },
  {
    id: 'hostel',
    name: 'Hostel',
    description: 'Hostel management system',
    icon: 'home',
    route: '/hostel',
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      manageUsers: false,
      manageSettings: false,
      viewReports: true,
      export: true,
      approve: true,
      manageFinance: false
    },
    features: ['rooms', 'students', 'maintenance'],
    dependencies: [],
    enabled: true
  },
  {
    id: 'examination',
    name: 'Examination',
    description: 'Exam and result management',
    icon: 'clipboard',
    route: '/examination',
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      manageUsers: false,
      manageSettings: false,
      viewReports: true,
      export: true,
      approve: true,
      manageFinance: false
    },
    features: ['exams', 'results', 'schedules'],
    dependencies: [],
    enabled: true
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Messaging and notifications',
    icon: 'message-square',
    route: '/communication',
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      manageUsers: false,
      manageSettings: false,
      viewReports: true,
      export: true,
      approve: true,
      manageFinance: false
    },
    features: ['messages', 'notifications', 'announcements'],
    dependencies: [],
    enabled: true
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Inventory and asset management',
    icon: 'package',
    route: '/inventory',
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      manageUsers: false,
      manageSettings: false,
      viewReports: true,
      export: true,
      approve: true,
      manageFinance: false
    },
    features: ['assets', 'stock', 'suppliers'],
    dependencies: [],
    enabled: true
  },
  {
    id: 'canteen',
    name: 'Canteen',
    description: 'Canteen and food management',
    icon: 'utensils',
    route: '/canteen',
    permissions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      manageUsers: false,
      manageSettings: false,
      viewReports: true,
      export: true,
      approve: true,
      manageFinance: true
    },
    features: ['menu', 'orders', 'inventory'],
    dependencies: [],
    enabled: true
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Comprehensive reporting system',
    icon: 'bar-chart',
    route: '/reports',
    permissions: {
      create: false,
      read: true,
      update: false,
      delete: false,
      manageUsers: false,
      manageSettings: false,
      viewReports: true,
      export: true,
      approve: false,
      manageFinance: false
    },
    features: ['analytics', 'charts', 'exports'],
    dependencies: [],
    enabled: true
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'System configuration and settings',
    icon: 'settings',
    route: '/settings',
    permissions: {
      create: false,
      read: true,
      update: true,
      delete: false,
      manageUsers: false,
      manageSettings: true,
      viewReports: false,
      export: false,
      approve: false,
      manageFinance: false
    },
    features: ['system-settings', 'user-management'],
    dependencies: [],
    enabled: true
  }
];

// Create module map for quick lookup
export const MODULE_MAP: { [key: string]: Module } = {};
MODULE_LIST.forEach(module => {
  MODULE_MAP[module.id.toUpperCase()] = module;
});

// Export modules array
export const MODULES = MODULE_LIST;

/**
 * Get module by route path
 */
export function getModuleByRoute(route: string): Module | null {
  return MODULE_LIST.find(module => module.route === route) || null;
}

/**
 * Get module by ID
 */
export function getModuleById(id: string): Module | null {
  return MODULE_MAP[id.toUpperCase()] || null;
}

/**
 * Get all enabled modules
 */
export function getEnabledModules(): Module[] {
  return MODULE_LIST.filter(module => module.enabled);
}

/**
 * Check if a module exists
 */
export function moduleExists(id: string): boolean {
  return MODULE_MAP[id.toUpperCase()] !== undefined;
}

/**
 * Get module dependencies
 */
export function getModuleDependencies(id: string): string[] {
  const module = getModuleById(id);
  return module ? module.dependencies : [];
}