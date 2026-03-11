/**
 * Role configuration for EduManage Pro
 * Defines user roles and their permissions
 */

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: {
    [moduleId: string]: {
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
  };
  defaultModules: string[];
  canAccessAllModules: boolean;
  hierarchy: number; // Lower numbers have higher hierarchy
  enabled: boolean;
}

// Define all roles
export const ROLES: Role[] = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'System administrator with full access',
    permissions: {
      // Super admin has full access to all modules
      dashboard: {
        create: true, read: true, update: true, delete: true,
        manageUsers: true, manageSettings: true, viewReports: true,
        export: true, approve: true, manageFinance: true
      },
      academic: {
        create: true, read: true, update: true, delete: true,
        manageUsers: true, manageSettings: true, viewReports: true,
        export: true, approve: true, manageFinance: true
      },
      attendance: {
        create: true, read: true, update: true, delete: true,
        manageUsers: true, manageSettings: true, viewReports: true,
        export: true, approve: true, manageFinance: true
      },
      fees: {
        create: true, read: true, update: true, delete: true,
        manageUsers: true, manageSettings: true, viewReports: true,
        export: true, approve: true, manageFinance: true
      },
      hrm: {
        create: true, read: true, update: true, delete: true,
        manageUsers: true, manageSettings: true, viewReports: true,
        export: true, approve: true, manageFinance: true
      },
      library: {
        create: true, read: true, update: true, delete: true,
        manageUsers: true, manageSettings: true, viewReports: true,
        export: true, approve: true, manageFinance: true
      },
      transport: {
        create: true, read: true, update: true, delete: true,
        manageUsers: true, manageSettings: true, viewReports: true,
        export: true, approve: true, manageFinance: true
      },
      hostel: {
        create: true, read: true, update: true, delete: true,
        manageUsers: true, manageSettings: true, viewReports: true,
        export: true, approve: true, manageFinance: true
      },
      examination: {
        create: true, read: true, update: true, delete: true,
        manageUsers: true, manageSettings: true, viewReports: true,
        export: true, approve: true, manageFinance: true
      },
      communication: {
        create: true, read: true, update: true, delete: true,
        manageUsers: true, manageSettings: true, viewReports: true,
        export: true, approve: true, manageFinance: true
      },
      inventory: {
        create: true, read: true, update: true, delete: true,
        manageUsers: true, manageSettings: true, viewReports: true,
        export: true, approve: true, manageFinance: true
      },
      canteen: {
        create: true, read: true, update: true, delete: true,
        manageUsers: true, manageSettings: true, viewReports: true,
        export: true, approve: true, manageFinance: true
      },
      reports: {
        create: true, read: true, update: true, delete: true,
        manageUsers: true, manageSettings: true, viewReports: true,
        export: true, approve: true, manageFinance: true
      },
      settings: {
        create: true, read: true, update: true, delete: true,
        manageUsers: true, manageSettings: true, viewReports: true,
        export: true, approve: true, manageFinance: true
      }
    },
    defaultModules: ['dashboard', 'academic', 'attendance', 'fees', 'hrm'],
    canAccessAllModules: true,
    hierarchy: 1,
    enabled: true
  },
  {
    id: 'school_admin',
    name: 'School Admin',
    description: 'School administrator with comprehensive access',
    permissions: {
      dashboard: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: false, manageFinance: false
      },
      academic: {
        create: true, read: true, update: true, delete: true,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: true, manageFinance: false
      },
      attendance: {
        create: true, read: true, update: true, delete: true,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: true, manageFinance: false
      },
      fees: {
        create: true, read: true, update: true, delete: true,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: true, manageFinance: true
      },
      hrm: {
        create: true, read: true, update: true, delete: true,
        manageUsers: true, manageSettings: false, viewReports: true,
        export: true, approve: true, manageFinance: false
      },
      library: {
        create: true, read: true, update: true, delete: true,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: true, manageFinance: false
      },
      transport: {
        create: true, read: true, update: true, delete: true,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: true, manageFinance: false
      },
      hostel: {
        create: true, read: true, update: true, delete: true,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: true, manageFinance: false
      },
      examination: {
        create: true, read: true, update: true, delete: true,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: true, manageFinance: false
      },
      communication: {
        create: true, read: true, update: true, delete: true,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: true, manageFinance: false
      },
      inventory: {
        create: true, read: true, update: true, delete: true,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: true, manageFinance: false
      },
      canteen: {
        create: true, read: true, update: true, delete: true,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: true, manageFinance: true
      },
      reports: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: false, manageFinance: false
      },
      settings: {
        create: false, read: true, update: true, delete: false,
        manageUsers: false, manageSettings: true, viewReports: false,
        export: false, approve: false, manageFinance: false
      }
    },
    defaultModules: ['dashboard', 'academic', 'attendance', 'fees', 'hrm'],
    canAccessAllModules: true,
    hierarchy: 2,
    enabled: true
  },
  {
    id: 'teacher',
    name: 'Teacher',
    description: 'Educator with teaching and grading access',
    permissions: {
      dashboard: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: false, manageFinance: false
      },
      academic: {
        create: false, read: true, update: true, delete: false,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: false, manageFinance: false
      },
      attendance: {
        create: true, read: true, update: true, delete: false,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: false, manageFinance: false
      },
      fees: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: false, manageFinance: false
      },
      hrm: {
        create: false, read: false, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      library: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: false, manageFinance: false
      },
      transport: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: false, manageFinance: false
      },
      hostel: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: false, manageFinance: false
      },
      examination: {
        create: false, read: true, update: true, delete: false,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: false, manageFinance: false
      },
      communication: {
        create: true, read: true, update: true, delete: true,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: false, manageFinance: false
      },
      inventory: {
        create: false, read: false, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      canteen: {
        create: false, read: false, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      reports: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: true,
        export: true, approve: false, manageFinance: false
      },
      settings: {
        create: false, read: false, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      }
    },
    defaultModules: ['dashboard', 'academic', 'attendance', 'examination', 'communication'],
    canAccessAllModules: false,
    hierarchy: 3,
    enabled: true
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Student with limited access to academic features',
    permissions: {
      dashboard: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      academic: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      attendance: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      fees: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      hrm: {
        create: false, read: false, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      library: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      transport: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      hostel: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      examination: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      communication: {
        create: true, read: true, update: true, delete: true,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      inventory: {
        create: false, read: false, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      canteen: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      reports: {
        create: false, read: false, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      settings: {
        create: false, read: false, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      }
    },
    defaultModules: ['dashboard', 'academic', 'attendance', 'examination', 'communication'],
    canAccessAllModules: false,
    hierarchy: 4,
    enabled: true
  },
  {
    id: 'parent',
    name: 'Parent',
    description: 'Parent with access to child information',
    permissions: {
      dashboard: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      academic: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      attendance: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      fees: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      hrm: {
        create: false, read: false, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      library: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      transport: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      hostel: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      examination: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      communication: {
        create: true, read: true, update: true, delete: true,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      inventory: {
        create: false, read: false, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      canteen: {
        create: false, read: true, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      reports: {
        create: false, read: false, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      },
      settings: {
        create: false, read: false, update: false, delete: false,
        manageUsers: false, manageSettings: false, viewReports: false,
        export: false, approve: false, manageFinance: false
      }
    },
    defaultModules: ['dashboard', 'academic', 'attendance', 'examination', 'communication'],
    canAccessAllModules: false,
    hierarchy: 5,
    enabled: true
  }
];
