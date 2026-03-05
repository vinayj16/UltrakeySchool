import authService from '../api/authService';
import { useAuthStore } from '../store/authStore';

const AUTH_BYPASS_MODE = import.meta.env.VITE_AUTH_BYPASS_MODE === 'true';
const RAW_ROLE = (import.meta.env.VITE_AUTH_BYPASS_ROLE || 'superadmin').trim();

console.log('RAW_ROLE from .env:', RAW_ROLE);

const normalizeRole = (role: string): string => (role || '').toLowerCase().replace(/\s+/g, '_');

const ROLE_LIST = (import.meta.env.VITE_AUTH_BYPASS_ROLES || 'superadmin,institution_admin,school_admin,principal,teacher,student,parent,accountant,hr_manager,librarian,transport_manager,hostel_warden,staff_member')
  .split(',')
  .map((role: string) => normalizeRole(role))
  .filter(Boolean);

const MOCK_USER_SEEDS: Record<string, any> = {
  superadmin: { 
    name: 'System Admin', 
    email: 'superadmin@demo.com', 
    role: 'superadmin', 
    permissions: ['*'], 
    plan: 'premium',
    modules: [
      'dashboard', 'finance', 'hr', 'membership', 'analytics', 'reports', 
      'students', 'attendance', 'exams', 'library', 'transport', 'hostel',
      'classes', 'homework', 'grades', 'timetable', 'calendar', 'chat',
      'email', 'file_manager', 'notes', 'todo', 'accounts', 'payroll',
      'settings', 'users', 'departments', 'subjects', 'support', 'tickets',
      'MEMBERSHIP', 'HR_PAYROLL', 'LIBRARY', 'TRANSPORT', 'HOSTEL',
      'ACADEMICS', 'STUDENTS', 'TEACHERS', 'EXAMS', 'FEES', 'ATTENDANCE',
      'DASHBOARD', 'PARENT', 'CHILDREN'
    ]
  },
  institution_admin: { name: 'Institution Admin', email: 'admin@demo.com', role: 'institution_admin', modules: ['dashboard', 'finance', 'hr'], plan: 'premium' },
  school_admin: { name: 'School Admin', email: 'school@demo.com', role: 'school_admin', modules: ['dashboard', 'students', 'attendance'], plan: 'premium' },
  principal: { name: 'Principal', email: 'principal@demo.com', role: 'principal', modules: ['dashboard', 'exams', 'reports'], plan: 'premium' },
  teacher: { name: 'Lead Teacher', email: 'teacher@demo.com', role: 'teacher', modules: ['dashboard', 'classes', 'homework'], plan: 'medium' },
  student: { name: 'Learner', email: 'student@demo.com', role: 'student', modules: ['dashboard', 'classes'], plan: 'basic' },
  parent: { name: 'Guardian', email: 'parent@demo.com', role: 'parent', modules: ['dashboard', 'children'], plan: 'basic' },
  accountant: { name: 'Accountant', email: 'accountant@demo.com', role: 'accountant', modules: ['dashboard', 'accounts'], plan: 'medium' },
  hr_manager: { name: 'HR Manager', email: 'hr@demo.com', role: 'hr_manager', modules: ['dashboard', 'hr'], plan: 'medium' },
  librarian: { name: 'Librarian', email: 'library@demo.com', role: 'librarian', modules: ['dashboard', 'library'], plan: 'medium' },
  transport_manager: { name: 'Transport Manager', email: 'transport@demo.com', role: 'transport_manager', modules: ['dashboard', 'transport'], plan: 'medium' },
  hostel_warden: { name: 'Hostel Warden', email: 'hostel@demo.com', role: 'hostel_warden', modules: ['dashboard', 'hostel'], plan: 'medium' },
  staff_member: { name: 'Staff Member', email: 'staff@demo.com', role: 'staff_member', modules: ['dashboard', 'tasks'], plan: 'basic' }
};

const getRoleOverrideFromSearch = () => {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  return (params.get('role') || params.get('mockRole') || '').trim();
};

const resolveRole = () => {
  console.log('ROLE_LIST:', ROLE_LIST);
  console.log('RAW_ROLE:', RAW_ROLE);
  return 'superadmin'; // Always return superadmin for debugging
};

const createMockUser = (role: string) => {
  const seed = MOCK_USER_SEEDS[role] || MOCK_USER_SEEDS['superadmin'];
  return {
    id: `${role}-${Date.now()}`,
    name: seed.name,
    email: seed.email,
    role: seed.role,
    permissions: seed.permissions || [],
    modules: seed.modules || [],
    plan: seed.plan,
    lastLogin: new Date().toISOString()
  };
};

export { createMockUser };

const applyMockSession = (role: string): boolean => {
  const mockUser = createMockUser(role);
  authService.setTokens('dev-access-token', 'dev-refresh-token');
  useAuthStore.setState({
    user: mockUser as any,
    isAuthenticated: true,
    isLoading: false,
    error: null
  });
  console.info('[BypassAuth] Loaded local mock session for', role);
  return true;
};

export const shouldBypassAuth = () => {
  console.log('AUTH_BYPASS_MODE:', AUTH_BYPASS_MODE);
  return AUTH_BYPASS_MODE;
};

export const ensureBypassSession = async () => {
  if (!AUTH_BYPASS_MODE) return false;

  const role = resolveRole();

  // ALWAYS use local mock session - backend auth disabled
  return applyMockSession(role);
};
