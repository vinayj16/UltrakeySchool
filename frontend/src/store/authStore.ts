import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../api/authService';

// Define all 13 user roles
export type UserRole =
  | 'superadmin'        // System-wide administrator
  | 'institution_admin' // Institution-level administrator
  | 'school_admin'      // School/branch administrator
  | 'principal'         // School principal
  | 'teacher'           // Teaching staff
  | 'student'           // Students
  | 'parent'            // Parents/guardians
  | 'accountant'        // Financial management
  | 'hr_manager'        // Human resources
  | 'librarian'         // Library management
  | 'transport_manager' // Transport operations
  | 'hostel_warden'     // Hostel management
  | 'staff_member';     // General staff

// Create the store (let TypeScript infer types)
export const useAuthStore = create(
  persist(
    (set: any) => ({
      // Initial state - no user until authenticated
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const authData = await authService.login({ email, password });

          set({
            user: authData.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          console.log('Login successful:', authData.user.name);
        } catch (error: any) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Login failed'
          });

          throw error;
        }
      },

      // Register action
      register: async (userData: any) => {
        set({ isLoading: true, error: null });

        try {
          const authData = await authService.register(userData);

          set({
            user: authData.user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          console.log('Registration successful:', authData.user.name);
        } catch (error: any) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Registration failed'
          });

          throw error;
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true });

        try {
          await authService.logout();

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });

          console.log('Logout successful');
        } catch (error: any) {
          // Even if logout API fails, clear local state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });

          console.warn('Logout API call failed, but local logout completed');
        }
      },

      // Refresh authentication
      refreshAuth: async () => {
        try {
          const authData = await authService.refreshToken();

          set({
            user: authData.user,
            isAuthenticated: true,
            error: null
          });

          console.log('Token refresh successful');
        } catch (error: any) {
          // Token refresh failed - user needs to login again
          set({
            user: null,
            isAuthenticated: false,
            error: 'Session expired. Please login again.'
          });

          // Clear tokens
          authService.clearTokens();

          throw error;
        }
      },

      // Update profile
      updateProfile: async (data: any) => {
        set({ isLoading: true, error: null });

        try {
          const result = await authService.updateProfile(data);

          set({
            user: result.user,
            isLoading: false,
            error: null
          });

          console.log('Profile updated successfully');
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Profile update failed'
          });

          throw error;
        }
      },

      // Change password
      changePassword: async (currentPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });

        try {
          await authService.changePassword({ currentPassword, newPassword });

          set({
            isLoading: false,
            error: null
          });

          console.log('Password changed successfully');
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Password change failed'
          });

          throw error;
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Initialize auth state (check for existing session)
      initialize: async () => {
        set({ isLoading: true });

        try {
          // Check if we have tokens
          if (authService.isAuthenticated()) {
            // Try to get fresh user data
            const user = await authService.getProfile();

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });

            console.log('Auth initialized with existing session:', user.name);
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null
            });
          }
        } catch (error: any) {
          // Session is invalid - clear everything
          authService.clearTokens();

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });

          console.log('Auth initialization failed - session cleared');
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state: any) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      storage: {
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name)
            return str ? JSON.parse(str) : null
          } catch (e) {
            console.warn('[AuthStore] localStorage blocked, using session storage')
            try {
              const str = sessionStorage.getItem(name)
              return str ? JSON.parse(str) : null
            } catch (e2) {
              console.warn('[AuthStore] All storage blocked')
              return null
            }
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value))
          } catch (e) {
            try {
              sessionStorage.setItem(name, JSON.stringify(value))
            } catch (e2) {
              console.warn('[AuthStore] Cannot persist state - storage blocked')
            }
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name)
            sessionStorage.removeItem(name)
          } catch (e) {
            // Ignore
          }
        }
      }
    }
  )
);

// Utility hooks
export const useAuth = () => {
  const store = useAuthStore() as any;

  return {
    ...store,
    // Computed values for all 13 roles
    isSuperAdmin: store.user?.role === 'superadmin',
    isInstitutionAdmin: store.user?.role === 'institution_admin',
    isSchoolAdmin: store.user?.role === 'school_admin',
    isPrincipal: store.user?.role === 'principal',
    isTeacher: store.user?.role === 'teacher',
    isStudent: store.user?.role === 'student',
    isParent: store.user?.role === 'parent',
    isAccountant: store.user?.role === 'accountant',
    isHRManager: store.user?.role === 'hr_manager',
    isLibrarian: store.user?.role === 'librarian',
    isTransportManager: store.user?.role === 'transport_manager',
    isHostelWarden: store.user?.role === 'hostel_warden',
    isStaffMember: store.user?.role === 'staff_member',

    // Administrative roles (can manage system/institution)
    isAdmin: ['superadmin', 'institution_admin', 'school_admin', 'principal'].includes(store.user?.role || ''),

    // Educational staff roles
    isEducationalStaff: ['principal', 'teacher', 'librarian'].includes(store.user?.role || ''),

    // Support staff roles
    isSupportStaff: ['accountant', 'hr_manager', 'transport_manager', 'hostel_warden', 'staff_member'].includes(store.user?.role || ''),

    // Student and parent roles
    isStudentOrParent: ['student', 'parent'].includes(store.user?.role || ''),

    // Permission helpers with comprehensive role-based access
    hasPermission: (permission: string) => {
      if (!store.user) return false;

      // Super admin has all permissions
      if (store.user.role === 'superadmin') return true;

      // Check specific permissions
      if (store.user.permissions?.includes(permission) ||
          store.user.permissions?.includes('*')) {
        return true;
      }

      // Check module-based permissions
      const module = permission.split('.')[0];
      if (store.user.permissions?.includes(`${module}.*`)) {
        return true;
      }

      // Role-based permission fallback
      const rolePermissions: Record<UserRole, string[]> = {
        superadmin: ['*'],
        institution_admin: [
          'institution.*', 'schools.*', 'users.*', 'students.*', 'teachers.*',
          'finance.*', 'hr.*', 'library.*', 'transport.*', 'hostel.*', 'reports.*'
        ],
        school_admin: [
          'school.*', 'users.*', 'students.*', 'teachers.*', 'classes.*',
          'subjects.*', 'exams.*', 'attendance.*', 'grades.*', 'timetable.*',
          'library.*', 'transport.*', 'hostel.*', 'reports.*'
        ],
        principal: [
          'school.*', 'students.*', 'teachers.*', 'classes.*', 'exams.*',
          'attendance.*', 'grades.*', 'reports.*', 'announcements.*', 'events.*'
        ],
        teacher: [
          'students.view', 'classes.*', 'subjects.*', 'exams.*', 'attendance.*',
          'grades.*', 'timetable.*', 'homework.*', 'reports.view'
        ],
        student: [
          'profile.*', 'classes.view', 'subjects.view', 'exams.view', 'grades.view',
          'attendance.view', 'timetable.view', 'homework.*', 'library.view',
          'transport.view', 'hostel.view', 'fee.*', 'announcements.view', 'events.view'
        ],
        parent: [
          'children.*', 'grades.view', 'attendance.view', 'fee.*', 'homework.view',
          'announcements.view', 'events.view', 'teachers.contact', 'transport.view',
          'hostel.view', 'reports.view'
        ],
        accountant: [
          'finance.*', 'fee.*', 'invoice.*', 'salary.*', 'budget.*',
          'reports.financial', 'transactions.*', 'payment.*'
        ],
        hr_manager: [
          'hr.*', 'employees.*', 'recruitment.*', 'payroll.*', 'leave.*',
          'performance.*', 'training.*', 'attendance.*', 'reports.hr'
        ],
        librarian: [
          'library.*', 'books.*', 'borrowing.*', 'returns.*', 'inventory.*',
          'catalog.*', 'fines.*', 'reports.library'
        ],
        transport_manager: [
          'transport.*', 'vehicles.*', 'routes.*', 'drivers.*', 'assignments.*',
          'maintenance.*', 'fuel.*', 'tracking.*', 'reports.transport'
        ],
        hostel_warden: [
          'hostel.*', 'rooms.*', 'occupancy.*', 'maintenance.*', 'security.*',
          'complaints.*', 'discipline.*', 'reports.hostel'
        ],
        staff_member: [
          'profile.*', 'tasks.*', 'announcements.view', 'events.view',
          'leave.*', 'attendance.*', 'reports.view'
        ]
      };

      const userRolePermissions = rolePermissions[store.user.role as UserRole] || [];
      return userRolePermissions.includes(permission) ||
             userRolePermissions.includes(`${module}.*`) ||
             userRolePermissions.includes('*');
    },

    hasRole: (role: UserRole) => store.user?.role === role,

    hasModuleAccess: (module: string) => {
      if (!store.user) return false;

      // Super admin has access to all modules
      if (store.user.role === 'superadmin') return true;

      // Check user's modules
      return store.user.modules?.includes(module) ||
             store.user.modules?.includes('*') ||
             getDefaultModulesForRole(store.user.role).includes(module);
    },

    // Get user role display name
    getRoleDisplayName: () => {
      const roleNames: Record<UserRole, string> = {
        superadmin: 'Super Administrator',
        institution_admin: 'Institution Administrator',
        school_admin: 'School Administrator',
        principal: 'Principal',
        teacher: 'Teacher',
        student: 'Student',
        parent: 'Parent',
        accountant: 'Accountant',
        hr_manager: 'HR Manager',
        librarian: 'Librarian',
        transport_manager: 'Transport Manager',
        hostel_warden: 'Hostel Warden',
        staff_member: 'Staff Member'
      };
      return store.user ? roleNames[store.user.role as UserRole] : 'Unknown';
    },

    // Get navigation items based on role
    getNavigationItems: () => getNavigationForRole(store.user?.role),

    // Get dashboard widgets based on role
    getDashboardWidgets: () => getDashboardWidgetsForRole(store.user?.role)
  };
};

// Helper functions
function getDefaultModulesForRole(role: UserRole | undefined): string[] {
  if (!role) return [];

  const roleModules: Record<UserRole, string[]> = {
    superadmin: ['*'],
    institution_admin: ['dashboard', 'schools', 'users', 'students', 'teachers', 'finance', 'hr', 'reports'],
    school_admin: ['dashboard', 'students', 'teachers', 'classes', 'attendance', 'exams', 'library', 'transport', 'hostel', 'reports'],
    principal: ['dashboard', 'students', 'teachers', 'classes', 'attendance', 'exams', 'reports', 'announcements'],
    teacher: ['dashboard', 'students', 'classes', 'attendance', 'exams', 'grades', 'homework', 'timetable'],
    student: ['dashboard', 'classes', 'exams', 'grades', 'attendance', 'homework', 'library', 'transport', 'hostel', 'fees'],
    parent: ['dashboard', 'children', 'grades', 'attendance', 'fees', 'homework', 'announcements', 'transport', 'hostel'],
    accountant: ['dashboard', 'fees', 'invoices', 'salary', 'budget', 'transactions', 'reports'],
    hr_manager: ['dashboard', 'employees', 'recruitment', 'payroll', 'leave', 'performance', 'training', 'reports'],
    librarian: ['dashboard', 'books', 'borrowing', 'returns', 'inventory', 'catalog', 'fines', 'reports'],
    transport_manager: ['dashboard', 'vehicles', 'routes', 'drivers', 'assignments', 'maintenance', 'fuel', 'tracking', 'reports'],
    hostel_warden: ['dashboard', 'rooms', 'occupancy', 'maintenance', 'security', 'complaints', 'discipline', 'reports'],
    staff_member: ['dashboard', 'profile', 'tasks', 'attendance', 'leave', 'announcements']
  };

  return roleModules[role] || [];
}

function getNavigationForRole(role: UserRole | undefined): NavigationItem[] {
  if (!role) return [];

  const baseNavigation: Record<UserRole, NavigationItem[]> = {
    superadmin: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { label: 'Institutions', path: '/institutions', icon: 'building' },
      { label: 'Users', path: '/users', icon: 'users' },
      { label: 'System Settings', path: '/settings', icon: 'settings' },
      { label: 'Reports', path: '/reports', icon: 'chart' },
      { label: 'Monitoring', path: '/monitoring', icon: 'monitor' }
    ],
    institution_admin: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { label: 'Schools', path: '/schools', icon: 'school' },
      { label: 'Users', path: '/users', icon: 'users' },
      { label: 'Students', path: '/students', icon: 'users' },
      { label: 'Teachers', path: '/teachers', icon: 'users' },
      { label: 'Finance', path: '/finance', icon: 'dollar' },
      { label: 'HR', path: '/hr', icon: 'user' },
      { label: 'Reports', path: '/reports', icon: 'chart' }
    ],
    school_admin: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { label: 'Students', path: '/students', icon: 'users' },
      { label: 'Teachers', path: '/teachers', icon: 'users' },
      { label: 'Classes', path: '/classes', icon: 'book' },
      { label: 'Attendance', path: '/attendance', icon: 'check' },
      { label: 'Exams', path: '/exams', icon: 'test' },
      { label: 'Library', path: '/library', icon: 'book' },
      { label: 'Transport', path: '/transport', icon: 'bus' },
      { label: 'Hostel', path: '/hostel', icon: 'home' },
      { label: 'Reports', path: '/reports', icon: 'chart' }
    ],
    principal: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { label: 'Students', path: '/students', icon: 'users' },
      { label: 'Teachers', path: '/teachers', icon: 'users' },
      { label: 'Classes', path: '/classes', icon: 'book' },
      { label: 'Attendance', path: '/attendance', icon: 'check' },
      { label: 'Exams', path: '/exams', icon: 'test' },
      { label: 'Reports', path: '/reports', icon: 'chart' },
      { label: 'Announcements', path: '/announcements', icon: 'bell' }
    ],
    teacher: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { label: 'My Classes', path: '/classes', icon: 'book' },
      { label: 'Students', path: '/students', icon: 'users' },
      { label: 'Attendance', path: '/attendance', icon: 'check' },
      { label: 'Exams', path: '/exams', icon: 'test' },
      { label: 'Grades', path: '/grades', icon: 'grade' },
      { label: 'Homework', path: '/homework', icon: 'homework' },
      { label: 'Timetable', path: '/timetable', icon: 'calendar' }
    ],
    student: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { label: 'My Classes', path: '/classes', icon: 'book' },
      { label: 'Exams', path: '/exams', icon: 'test' },
      { label: 'Grades', path: '/grades', icon: 'grade' },
      { label: 'Attendance', path: '/attendance', icon: 'check' },
      { label: 'Homework', path: '/homework', icon: 'homework' },
      { label: 'Library', path: '/library', icon: 'book' },
      { label: 'Transport', path: '/transport', icon: 'bus' },
      { label: 'Hostel', path: '/hostel', icon: 'home' },
      { label: 'Fees', path: '/fees', icon: 'dollar' }
    ],
    parent: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { label: 'My Children', path: '/children', icon: 'users' },
      { label: 'Grades', path: '/grades', icon: 'grade' },
      { label: 'Attendance', path: '/attendance', icon: 'check' },
      { label: 'Fees', path: '/fees', icon: 'dollar' },
      { label: 'Homework', path: '/homework', icon: 'homework' },
      { label: 'Announcements', path: '/announcements', icon: 'bell' },
      { label: 'Transport', path: '/transport', icon: 'bus' },
      { label: 'Hostel', path: '/hostel', icon: 'home' }
    ],
    accountant: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { label: 'Fees', path: '/fees', icon: 'dollar' },
      { label: 'Invoices', path: '/invoices', icon: 'invoice' },
      { label: 'Salary', path: '/salary', icon: 'money' },
      { label: 'Budget', path: '/budget', icon: 'budget' },
      { label: 'Transactions', path: '/transactions', icon: 'transaction' },
      { label: 'Reports', path: '/reports', icon: 'chart' }
    ],
    hr_manager: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { label: 'Employees', path: '/employees', icon: 'users' },
      { label: 'Recruitment', path: '/recruitment', icon: 'recruit' },
      { label: 'Payroll', path: '/payroll', icon: 'money' },
      { label: 'Leave Management', path: '/leave', icon: 'leave' },
      { label: 'Performance', path: '/performance', icon: 'performance' },
      { label: 'Training', path: '/training', icon: 'training' },
      { label: 'Reports', path: '/reports', icon: 'chart' }
    ],
    librarian: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { label: 'Books', path: '/books', icon: 'book' },
      { label: 'Borrowing', path: '/borrowing', icon: 'borrow' },
      { label: 'Returns', path: '/returns', icon: 'return' },
      { label: 'Inventory', path: '/inventory', icon: 'inventory' },
      { label: 'Catalog', path: '/catalog', icon: 'catalog' },
      { label: 'Fines', path: '/fines', icon: 'fine' },
      { label: 'Reports', path: '/reports', icon: 'chart' }
    ],
    transport_manager: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { label: 'Vehicles', path: '/vehicles', icon: 'bus' },
      { label: 'Routes', path: '/routes', icon: 'route' },
      { label: 'Drivers', path: '/drivers', icon: 'driver' },
      { label: 'Assignments', path: '/assignments', icon: 'assign' },
      { label: 'Maintenance', path: '/maintenance', icon: 'maintenance' },
      { label: 'Fuel', path: '/fuel', icon: 'fuel' },
      { label: 'Tracking', path: '/tracking', icon: 'tracking' },
      { label: 'Reports', path: '/reports', icon: 'chart' }
    ],
    hostel_warden: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { label: 'Rooms', path: '/rooms', icon: 'room' },
      { label: 'Occupancy', path: '/occupancy', icon: 'occupy' },
      { label: 'Maintenance', path: '/maintenance', icon: 'maintenance' },
      { label: 'Security', path: '/security', icon: 'security' },
      { label: 'Complaints', path: '/complaints', icon: 'complaint' },
      { label: 'Discipline', path: '/discipline', icon: 'discipline' },
      { label: 'Reports', path: '/reports', icon: 'chart' }
    ],
    staff_member: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { label: 'Profile', path: '/profile', icon: 'user' },
      { label: 'Tasks', path: '/tasks', icon: 'task' },
      { label: 'Attendance', path: '/attendance', icon: 'check' },
      { label: 'Leave', path: '/leave', icon: 'leave' },
      { label: 'Announcements', path: '/announcements', icon: 'bell' }
    ]
  };

  return baseNavigation[role] || [];
}

function getDashboardWidgetsForRole(role: UserRole | undefined): DashboardWidget[] {
  if (!role) return [];

  const baseWidgets: Record<UserRole, DashboardWidget[]> = {
    superadmin: [
      { type: 'metric', title: 'Total Institutions', value: '125', change: '+12%' },
      { type: 'metric', title: 'Total Users', value: '15,420', change: '+8%' },
      { type: 'metric', title: 'Active Sessions', value: '2,341', change: '+15%' },
      { type: 'chart', title: 'System Usage', data: [] },
      { type: 'list', title: 'Recent Activities', items: [] }
    ],
    institution_admin: [
      { type: 'metric', title: 'Total Schools', value: '8', change: '+2' },
      { type: 'metric', title: 'Total Students', value: '2,450', change: '+5%' },
      { type: 'metric', title: 'Total Teachers', value: '180', change: '+3%' },
      { type: 'metric', title: 'Monthly Revenue', value: '$125,000', change: '+12%' }
    ],
    school_admin: [
      { type: 'metric', title: 'Total Students', value: '850', change: '+2%' },
      { type: 'metric', title: 'Total Teachers', value: '45', change: '+1' },
      { type: 'metric', title: 'Attendance Rate', value: '94%', change: '+2%' },
      { type: 'metric', title: 'Pending Fees', value: '$12,500', change: '-5%' },
      { type: 'chart', title: 'Monthly Enrollment', data: [] },
      { type: 'list', title: 'Upcoming Events', items: [] }
    ],
    principal: [
      { type: 'metric', title: 'Student Attendance', value: '96%', change: '+1%' },
      { type: 'metric', title: 'Teacher Performance', value: '4.2/5', change: '+0.1' },
      { type: 'metric', title: 'Academic Excellence', value: '88%', change: '+3%' },
      { type: 'chart', title: 'Grade Distribution', data: [] },
      { type: 'list', title: 'School Announcements', items: [] }
    ],
    teacher: [
      { type: 'metric', title: 'My Students', value: '32', change: '0' },
      { type: 'metric', title: 'Classes Today', value: '4', change: '0' },
      { type: 'metric', title: 'Pending Assignments', value: '8', change: '-2' },
      { type: 'metric', title: 'Average Grade', value: 'B+', change: '+0.2' },
      { type: 'list', title: 'Today\'s Schedule', items: [] },
      { type: 'list', title: 'Recent Submissions', items: [] }
    ],
    student: [
      { type: 'metric', title: 'Current GPA', value: '3.7', change: '+0.1' },
      { type: 'metric', title: 'Attendance Rate', value: '98%', change: '+1%' },
      { type: 'metric', title: 'Completed Assignments', value: '24/28', change: '+2' },
      { type: 'metric', title: 'Upcoming Exams', value: '3', change: '0' },
      { type: 'list', title: 'Today\'s Classes', items: [] },
      { type: 'list', title: 'Pending Homework', items: [] }
    ],
    parent: [
      { type: 'metric', title: 'Children', value: '2', change: '0' },
      { type: 'metric', title: 'Average Grades', value: 'A-', change: '+0.1' },
      { type: 'metric', title: 'Attendance Rate', value: '97%', change: '+1%' },
      { type: 'metric', title: 'Outstanding Fees', value: '$250', change: '-$50' },
      { type: 'list', title: 'Children\'s Schedule', items: [] },
      { type: 'list', title: 'Recent Reports', items: [] }
    ],
    accountant: [
      { type: 'metric', title: 'Monthly Revenue', value: '$45,000', change: '+8%' },
      { type: 'metric', title: 'Outstanding Fees', value: '$8,500', change: '-12%' },
      { type: 'metric', title: 'Paid Invoices', value: '156', change: '+15%' },
      { type: 'metric', title: 'Budget Utilization', value: '78%', change: '+3%' },
      { type: 'chart', title: 'Revenue Trends', data: [] },
      { type: 'list', title: 'Pending Payments', items: [] }
    ],
    hr_manager: [
      { type: 'metric', title: 'Total Employees', value: '89', change: '+2' },
      { type: 'metric', title: 'Open Positions', value: '5', change: '-1' },
      { type: 'metric', title: 'Leave Requests', value: '12', change: '+3' },
      { type: 'metric', title: 'Training Completion', value: '94%', change: '+2%' },
      { type: 'chart', title: 'Employee Distribution', data: [] },
      { type: 'list', title: 'Upcoming Reviews', items: [] }
    ],
    librarian: [
      { type: 'metric', title: 'Total Books', value: '12,450', change: '+125' },
      { type: 'metric', title: 'Books Borrowed', value: '234', change: '+12' },
      { type: 'metric', title: 'Overdue Returns', value: '18', change: '-3' },
      { type: 'metric', title: 'Active Members', value: '892', change: '+5%' },
      { type: 'chart', title: 'Borrowing Trends', data: [] },
      { type: 'list', title: 'Popular Books', items: [] }
    ],
    transport_manager: [
      { type: 'metric', title: 'Active Vehicles', value: '15', change: '0' },
      { type: 'metric', title: 'Daily Routes', value: '28', change: '+2' },
      { type: 'metric', title: 'Passengers Today', value: '456', change: '+8%' },
      { type: 'metric', title: 'Fuel Efficiency', value: '12.5 km/l', change: '+0.3' },
      { type: 'chart', title: 'Route Utilization', data: [] },
      { type: 'list', title: 'Vehicle Status', items: [] }
    ],
    hostel_warden: [
      { type: 'metric', title: 'Total Rooms', value: '120', change: '0' },
      { type: 'metric', title: 'Occupied Rooms', value: '98', change: '+2' },
      { type: 'metric', title: 'Occupancy Rate', value: '82%', change: '+2%' },
      { type: 'metric', title: 'Maintenance Requests', value: '7', change: '+2' },
      { type: 'chart', title: 'Monthly Occupancy', data: [] },
      { type: 'list', title: 'Room Status', items: [] }
    ],
    staff_member: [
      { type: 'metric', title: 'Tasks Completed', value: '28', change: '+3' },
      { type: 'metric', title: 'Attendance Rate', value: '96%', change: '+1%' },
      { type: 'metric', title: 'Pending Tasks', value: '5', change: '-2' },
      { type: 'metric', title: 'Leave Balance', value: '12 days', change: '0' },
      { type: 'list', title: 'My Tasks', items: [] },
      { type: 'list', title: 'Upcoming Events', items: [] }
    ]
  };

  return baseWidgets[role] || [];
}

// Types for navigation and dashboard
export interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  children?: NavigationItem[];
}

export interface DashboardWidget {
  type: 'metric' | 'chart' | 'list' | 'card';
  title: string;
  value?: string;
  change?: string;
  data?: any[];
  items?: any[];
}
