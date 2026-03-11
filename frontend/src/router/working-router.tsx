import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import SuperAdminLayout from '../layouts/SuperAdminLayout'
import DashboardPage from '../pages/dashboard/InstituteAdmin/InstituteAdminDashboardPage'
import SuperAdminDashboard from '../pages/superadmin/SuperAdminDashboard'
import SchoolsManagementPage from '../pages/superadmin/InstitutionsManagementPage'
import TransactionsManagementPage from '../pages/superadmin/TransactionsManagementPage'
import InstitutionsDetailsPage from '../pages/superadmin/InstitutionsDetailsPage'
import InstitutionsEditPage from '../pages/superadmin/InstitutionsEditPage'
import InstitutionsUpgradePage from '../pages/superadmin/InstitutionsUpgradePage'
import PlatformSettingsPage from '../pages/superadmin/PlatformSettingsPage'
import ModulesControlPage from '../pages/superadmin/ModulesControlPage'
import MembershipPlans from '../pages/MembershipPlans/MembershipPlans'
import MembershipAddons from '../pages/MembershipPlans/MembershipAddons'
import MembershipTransactions from '../pages/MembershipPlans/MembershipTransactions'

// School Admin Pages
import PlaceholderPage from '../pages/PlaceholderPage'
import UsersPage from '../pages/users/UsersPage'
import RolesPage from '../pages/users/RolesPage'
import PermissionsPage from '../pages/users/PermissionsPage'
import RolesPermissionsPage from '../pages/users/RolesPermissionsPage'

// Settings pages
import CompanyInfo from '../pages/settings/CompanyInfo'
import EmailConfig from '../pages/settings/EmailConfig'
import SmsConfig from '../pages/settings/SmsConfig'
import PaymentGateway from '../pages/settings/PaymentGateway'
import TaxSettings from '../pages/settings/TaxSettings'
import SchoolSettings from '../pages/settings/SchoolSettings'
import StorageSettings from '../pages/settings/StorageSettings'

// Support
import SupportTickets from '../pages/support/SupportTickets'

// HRM
import StaffsPage from '../pages/hrm/StaffsPage'
import DepartmentsPage from '../pages/hrm/DepartmentsPage'
import DesignationsPage from '../pages/hrm/DesignationsPage'
import LeavesPage from '../pages/hrm/LeavesPage'
import ApprovalsPage from '../pages/hrm/ApprovalsPage'
import HolidaysPage from '../pages/hrm/HolidaysPage'
import PayrollPage from '../pages/hrm/PayrollPage'

// Authentication Pages
import Login from '../pages/Authentication/Login/Login'
import Register from '../pages/Authentication/Login/Register/Register'
import ForgotPassword from '../pages/Authentication/Login/ForgotPassword/ForgotPassword'
import EmailVerification from '../pages/Authentication/Login/EmailVerification/EmailVerification'
import LockScreen from '../pages/Authentication/Login/LockScreen/LockScreen'
import ResetPassword from '../pages/Authentication/Login/ResetPassword/ResetPassword'
import TwoStepVerification from '../pages/Authentication/Login/TwoStepVerification/TwoStepVerification'

// Management
import SportsPage from '../pages/management/SportsPage'

// People
import TeacherSalaryPage from '../pages/people/TeacherSalaryPage'

const router = createBrowserRouter([
  // Authentication Routes
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/email-verification',
    element: <EmailVerification />
  },
  {
    path: '/lock-screen',
    element: <LockScreen />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/two-step-verification',
    element: <TwoStepVerification />
  },

  // Default route - redirect to login
  {
    path: '/',
    element: <Login />
  },
  
  // Super Admin Routes with layout
  {
    path: '/super-admin',
    element: <SuperAdminLayout />,
    children: [
      { index: true, element: <SuperAdminDashboard /> },
      { path: 'dashboard', element: <SuperAdminDashboard /> },
      { path: 'schools', element: <SchoolsManagementPage /> },
      { path: 'schools/:id', element: <InstitutionsDetailsPage /> },
      { path: 'schools/:id/edit', element: <InstitutionsEditPage /> },
      { path: 'schools/:id/upgrade', element: <InstitutionsUpgradePage /> },
      { path: 'transactions', element: <TransactionsManagementPage /> },
      { path: 'membership-plans', element: <MembershipPlans /> },
      { path: 'membership-addons', element: <MembershipAddons /> },
      { path: 'membership-transactions', element: <MembershipTransactions /> },
      { path: 'institutions/add', element: <PlaceholderPage title="Add Institution" /> },
      { path: 'analytics', element: <PlaceholderPage title="Platform Analytics" /> },
      { path: 'institutions/inter-colleges', element: <PlaceholderPage title="Inter Colleges" /> },
      { path: 'institutions/degree-colleges', element: <PlaceholderPage title="Degree Colleges" /> },
      { path: 'branches', element: <PlaceholderPage title="Branches Monitoring" /> },
      { path: 'impersonate', element: <PlaceholderPage title="Impersonate Institution" /> },
      { path: 'memberships', element: <MembershipPlans /> },
      { path: 'revenue', element: <PlaceholderPage title="Revenue Analytics" /> },
      { path: 'alerts', element: <PlaceholderPage title="Expiry & Alerts" /> },
      { path: 'analytics-reports', element: <PlaceholderPage title="Analytics & Reports" /> },
      { path: 'modules', element: <ModulesControlPage /> },
      { path: 'users', element: <PlaceholderPage title="Platform Users" /> },
      { path: 'tickets', element: <SupportTickets /> },
      { path: 'audit-logs', element: <PlaceholderPage title="Audit Logs" /> },
      { path: 'settings', element: <PlatformSettingsPage /> },
      { path: 'maintenance', element: <PlaceholderPage title="Maintenance Mode" /> },
      { path: 'applications/calendar', element: <PlaceholderPage title="Calendar" /> },
      { path: 'applications/call', element: <PlaceholderPage title="Call" /> },
      { path: 'applications/chat', element: <PlaceholderPage title="Chat" /> },
      { path: 'applications/email', element: <PlaceholderPage title="Email" /> },
      { path: 'applications/file-manager', element: <PlaceholderPage title="File Manager" /> },
      { path: 'applications/notes', element: <PlaceholderPage title="Notes" /> },
      { path: 'applications/todo', element: <PlaceholderPage title="To Do" /> },
    ]
  },

  // School Admin Routes (MAIN LAYOUT)
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'students', element: <PlaceholderPage title="Students" dataSource="students" /> },
      { path: 'teachers', element: <PlaceholderPage title="Teachers" dataSource="teachers" /> },
      { path: 'parents', element: <PlaceholderPage title="Parents" /> },
      { path: 'exams', element: <PlaceholderPage title="Exams" dataSource="exams" /> },
      { path: 'fees', element: <PlaceholderPage title="Fees" dataSource="fees" /> },
      { path: 'library', element: <PlaceholderPage title="Library" /> },
      { path: 'reports', element: <PlaceholderPage title="Reports" /> },

      // Staff routes
      { path: 'staff', element: <PlaceholderPage title="Staff Dashboard" dataSource="staff" /> },
      { path: 'attendance/staff', element: <PlaceholderPage title="My Attendance" /> },
      { path: 'notice-board', element: <PlaceholderPage title="Notice Board" /> },
      { path: 'events', element: <PlaceholderPage title="Events" /> },
      { path: 'messages', element: <PlaceholderPage title="Messages" /> },
      { path: 'reports/attendance', element: <PlaceholderPage title="Attendance Report" /> },

      // Users / Permissions
      { path: 'users', element: <UsersPage /> },
      { path: 'users/roles', element: <RolesPage /> },
      { path: 'users/permissions', element: <PermissionsPage /> },
      { path: 'roles-permission', element: <RolesPermissionsPage /> },

      // Support
      { path: 'support/tickets', element: <SupportTickets /> },
      { path: 'tickets', element: <SupportTickets /> },

      // Settings subsections
      { path: 'settings/company', element: <CompanyInfo /> },
      { path: 'settings/email', element: <EmailConfig /> },
      { path: 'settings/sms', element: <SmsConfig /> },
      { path: 'settings/payment-gateways', element: <PaymentGateway /> },
      { path: 'settings/tax', element: <TaxSettings /> },
      { path: 'settings/school', element: <SchoolSettings /> },
      { path: 'settings/storage', element: <StorageSettings /> },

      // Sidebar alias routes (match existing links)
      { path: 'company-settings', element: <CompanyInfo /> },
      { path: 'localization', element: <PlaceholderPage title="Localization" /> },
      { path: 'prefixes', element: <PlaceholderPage title="Prefixes" /> },
      { path: 'preferences', element: <PlaceholderPage title="Preferences" /> },
      { path: 'social-authentication', element: <PlaceholderPage title="Social Authentication" /> },
      { path: 'language', element: <PlaceholderPage title="Language" /> },
      { path: 'email-settings', element: <EmailConfig /> },
      { path: 'sms-settings', element: <SmsConfig /> },
      { path: 'payment-gateways', element: <PaymentGateway /> },
      { path: 'tax-rates', element: <TaxSettings /> },
      { path: 'school-settings', element: <SchoolSettings /> },
      { path: 'storage', element: <StorageSettings /> },

      // HRM
      { path: 'staffs', element: <StaffsPage /> },
      { path: 'departments', element: <DepartmentsPage /> },
      { path: 'designations', element: <DesignationsPage /> },
      { path: 'leaves', element: <LeavesPage /> },
      { path: 'approvals', element: <ApprovalsPage /> },
      { path: 'holidays', element: <HolidaysPage /> },
      { path: 'payroll', element: <PayrollPage /> },

      // Management / People
      { path: 'management/sports', element: <SportsPage /> },
      { path: 'people/teacher-salaries', element: <TeacherSalaryPage /> },
    ]
  },

  // Catch-all route for 404 - MUST BE LAST
  {
    path: '*',
    element: <PlaceholderPage title="404 Not Found" description="The page you are looking for does not exist." />
  }
])

export default router
