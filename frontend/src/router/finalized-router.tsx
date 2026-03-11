// Finalized Router - Complete SaaS Architecture with Role-Based Routing
import { createBrowserRouter, Navigate } from 'react-router-dom'

// Layout Components
import MainLayout from '../layouts/MainLayout'
import SuperAdminLayout from '../layouts/SuperAdminLayout'
import EnhancedInstitutionLayout from '../layouts/EnhancedInstitutionLayout'

// Demo Mode Utilities
import { isDemoMode, getCurrentDemoUser } from '../utils/demoMode'

// Super Admin Pages
import AddInstitutionPage from '../pages/superadmin/AddInstitutionPage'
import InstitutionsManagementPage from '../pages/superadmin/InstitutionsManagementPage'
import TransactionsManagementPage from '../pages/superadmin/TransactionsManagementPage'
import InstitutionsDetailsPage from '../pages/superadmin/InstitutionsDetailsPage'
import InstitutionsEditPage from '../pages/superadmin/InstitutionsEditPage'
import InstitutionsUpgradePage from '../pages/superadmin/InstitutionsUpgradePage'
import InstitutionsAdminManagementPage from '../pages/superadmin/InstitutionsAdminManagementPage'
import BranchesMonitoringPage from '../pages/superadmin/BranchesMonitoringPage'
import BranchDetailsPage from '../pages/superadmin/BranchDetailsPage'
import BranchEditPage from '../pages/superadmin/BranchEditPage'
import BranchStudentsPage from '../pages/superadmin/BranchStudentsPage'
import TransactionDetailsPage from '../pages/superadmin/TransactionDetailsPage'
import InvoiceDetailsPage from '../pages/superadmin/InvoiceDetailsPage'
import RevenueAnalyticsPage from '../pages/superadmin/RevenueAnalyticsPage'
import MembershipPlans from '../pages/MembershipPlans/MembershipPlans'
import MembershipAddons from '../pages/MembershipPlans/MembershipAddons'
import MembershipTransactions from '../pages/MembershipPlans/MembershipTransactions'
import MembershipsManagementPage from '../pages/superadmin/MembershipsManagementPage'
import SupportTicketsPage from '../pages/superadmin/SupportTicketsPage'
import AnalyticsPage from '../pages/superadmin/AnalyticsPage'
import ModulesControlPage from '../pages/superadmin/ModulesControlPage'
import PendingRequestsPage from '../pages/superadmin/PendingRequestsPage'
import CreateCredentialsPage from '../pages/superadmin/CreateCredentialsPage'
import SuperAdminDashboard from '../pages/superadmin/SuperAdminDashboard'
import PlatformSettingsPage from '../pages/superadmin/PlatformSettingsPage'
import AlertsPage from '../pages/superadmin/AlertsPage'
import MaintenancePage from '../pages/superadmin/MaintenancePage'

// Institution User Management Pages
import InstitutionPendingRequestsPage from '../pages/user-management/PendingRequestsPage'
import InstitutionCreateCredentialsPage from '../pages/user-management/InstitutionCreateCredentialsPage'
import UserDirectoryPage from '../pages/user-management/UserDirectoryPage'
import PlatformUsersPage from '../pages/superadmin/PlatformUsersPage'
import AnalyticsReportsPage from '../pages/superadmin/AnalyticsReportsPage'

// School Admin Pages
import DashboardPage from '../pages/dashboard/InstituteAdmin/InstituteAdminDashboardPage'
import AnalyticsDashboardPage from '../pages/dashboard/InstituteAdmin/InstituteAnalyticsDashboardPage'
import FinanceDashboardPage from '../pages/dashboard/InstituteAdmin/InstituteFinanceDashboardPage'
// TODO: Fix AdminDashboard.tsx - has syntax errors with mock data after return statement
// import AdminDashboard from '../pages/dashboard/Admin/AdminDashboard'

import StudentDashboard from '../pages/dashboard/Student/StudentDashboard'
import ParentDashboardPage from '../pages/dashboard/Parent/ParentDashboardPage'
import StaffDashboard from '../pages/dashboard/Staff/StaffDashboard'
import PrincipalDashboard from '../pages/dashboard/Principal/PrincipalDashboard'
import HRDashboardPage from '../pages/dashboard/Hr/HRDashboardPage'
import LibraryDashboardPage from '../pages/dashboard/LibraryDashboardPage'
import TransportDashboardPage from '../pages/dashboard/TransportDashboardPage'
import HostelDashboardPage from '../pages/dashboard/HostelDashboardPage'

// Student Management
import StudentListPage from '../pages/students/StudentListPage'
import StudentGridPage from '../pages/students/StudentGridPage'
import StudentAdd from '../pages/students/StudentAdd'
import StudentDetailsPage from '../pages/students/StudentDetailsPage'
import StudentPromotionPage from '../pages/students/StudentPromotionPage'
import StudentTimeTablePage from '../pages/students/StudentTimeTablePage'
import StudentLeavesPage from '../pages/students/StudentLeavesPage'
import StudentFeesPage from '../pages/students/StudentFeesPage'
import StudentResultPage from '../pages/students/StudentResultPage'
import StudentLibraryPage from '../pages/students/StudentLibraryPage'

// Parent Management
import ParentListPage from '../pages/parents/ParentListPage'
import ParentDetailsPage from '../pages/parents/ParentDetailsPage'
import GuardianListPage from '../pages/guardians/GuardianListPage'

// Teacher Management
import TeacherListPage from '../pages/teachers/TeacherListPage'
import TeacherDetailsPage from '../pages/teachers/TeacherDetailsPage'
import TeacherRoutinePage from '../pages/teachers/TeacherRoutinePage'
import TeacherLeavesPage from '../pages/teachers/TeacherLeavesPage'
import TeacherSalaryPage from '../pages/teachers/TeacherSalaryPage'
import TeacherLibraryPage from '../pages/teachers/TeacherLibraryPage'

// Academic Management
import ClassesPage from '../pages/academic/ClassesPage'
import ClassSectionPage from '../pages/academic/ClassSectionPage'
import ClassSubjectPage from '../pages/academic/ClassSubjectPage'
import ClassSyllabusPage from '../pages/academic/ClassSyllabusPage'
import ClassRoomPage from '../pages/academic/ClassRoomPage'
import ClassRoutinePage from '../pages/academic/ClassRoutinePage'
import ClassTimeTablePage from '../pages/academic/ClassTimeTablePage'
import ClassHomeWorkPage from '../pages/academic/ClassHomeWorkPage'

// Attendance
import StudentAttendancePage from '../pages/attendance/StudentAttendancePage'
import TeacherAttendancePage from '../pages/attendance/TeacherAttendancePage'
import StaffAttendancePage from '../pages/attendance/StaffAttendancePage'

// Exams & Results
import ExamPage from '../pages/academic/ExamPage'
import ExamSchedulePage from '../pages/academic/ExamSchedulePage'
import GradePage from '../pages/academic/GradePage'
import ExamAttendancePage from '../pages/academic/ExamAttendancePage'
import ExamResultsPage from '../pages/academic/ExamResultsPage'

// Fees & Finance
import FeesGroupPage from '../pages/fees/FeesGroupPage'
import FeesTypePage from '../pages/fees/FeesTypePage'
import FeesMasterPage from '../pages/fees/FeesMasterPage'
import FeesAssignPage from '../pages/fees/FeesAssignPage'
import CollectFeesPage from '../pages/fees/CollectFeesPage'

// Communication
import NoticeBoardPage from '../pages/announcements/NoticeBoardPage'
import EventsPage from '../pages/announcements/EventsPage'

// Accounts
import ExpensesPage from '../pages/finance/ExpensesPage'
import ExpensesCategoryPage from '../pages/finance/ExpensesCategoryPage'
import IncomePage from '../pages/finance/IncomePage'
import InvoicesPage from '../pages/finance/InvoicesPage'
import FinanceTransactionsPage from '../pages/finance/TransactionsPage'

// Library
import LibraryMembersPage from '../pages/library/LibraryMembersPage'
import LibraryBooksPage from '../pages/library/LibraryBooksPage'
import LibraryIssueBookPage from '../pages/library/LibraryIssueBookPage'
import LibraryReturnPage from '../pages/library/LibraryReturnPage'
import LibraryReportPage from '../pages/library/LibraryReportPage'

// Transport
import TransportRoutesPage from '../pages/transport/TransportRoutesPage'
import TransportPickupPointsPage from '../pages/transport/TransportPickupPointsPage'
import TransportVehiclePage from '../pages/transport/TransportVehiclePage'
import TransportVehicleDriversPage from '../pages/transport/TransportVehicleDriversPage'
import TransportAssignVehiclePage from '../pages/transport/TransportAssignVehiclePage'
import TransportReportPage from '../pages/transport/TransportReportPage'

// Hostel
import HostelListPage from '../pages/hostel/HostelListPage'
import HostelRoomsPage from '../pages/hostel/HostelRoomsPage'
import HostelRoomTypesPage from '../pages/hostel/HostelRoomTypesPage'
import HostelReportPage from '../pages/hostel/HostelReportPage'

// HR & Payroll
import StaffsPage from '../pages/hrm/StaffsPage'
import DepartmentsPage from '../pages/hrm/DepartmentsPage'
import DesignationPage from '../pages/hrm/DesignationsPage'
import ListLeavesPage from '../pages/hrm/LeaveTypesPage'
import StaffDocumentsPage from '../pages/hrm/StaffDocumentsPage'
import ApproveRequestPage from '../pages/hrm/ApproveRequestPage'
import HolidaysPage from '../pages/hrm/HolidaysPage'
import PayrollPage from '../pages/hrm/PayrollPage'

// Enterprise Features
import AuditLogsPage from '../pages/superadmin/AuditLogsPage'
import ImpersonatePage from '../pages/superadmin/ImpersonatePage'

// Overview Pages
import TeacherOverviewPage from '../pages/overview/TeacherOverviewPage'
import StudentOverviewPage from '../pages/overview/StudentOverviewPage'
import ParentOverviewPage from '../pages/overview/ParentOverviewPage'

// Support Pages
import SupportTickets from '../pages/support/SupportTickets'

// Communication Features
import MessagesPage from '../pages/communication/MessagesPage'

// Staff Documents (TODO: Create this page)
// import StaffDocumentsPage from '../pages/hrm/StaffDocumentsPage'

// Reports
import AttendanceReportPage from '../pages/reports/AttendanceReportPage'
import ClassReportPage from '../pages/reports/ClassReportPage'
import StudentReportPage from '../pages/reports/StudentReportPage'
import GradeReportPage from '../pages/reports/GradeReportPage'
import LeaveReportPage from '../pages/reports/LeaveReportPage'
import FeesReportPage from '../pages/reports/FeesReportPage'

// Management
import SportsPage from '../pages/management/SportsPage'

// User & Role Management
import UsersPage from '../pages/users/UsersPage'
import RolesPermissionsPage from '../pages/users/RolesPermissionsPage'
import DeleteAccountPage from '../pages/users/DeleteAccountPage'
import DataRightsPage from '../pages/DataRightsPage'

// Settings
import ProfileSettings from '../pages/Generasettings/ProfileSettings'
import SecuritySettings from '../pages/Generasettings/SecuritySettings'
import NotificationsSettings from '../pages/Generasettings/NotificationsSettings'
import TaxSettings from '../pages/settings/TaxSettings'
import SchoolSettings from '../pages/settings/SchoolSettings'
import StorageSettings from '../pages/settings/StorageSettings'
import PaymentGateway from '../pages/settings/PaymentGateway'
import SmsConfig from '../pages/settings/SmsConfig'
import EmailConfig from '../pages/settings/EmailConfig'
import CompanyInfo from '../pages/settings/CompanyInfo'
import Localization from '../pages/Website Settings/Localization'
import SocialAuthentication from '../pages/Website Settings/SocialAuthentication'

// Authentication Pages (outside layouts)
import Login from '../pages/Authentication/Login/Login'
import Register from '../pages/Authentication/Login/Register/Register'
import ForgotPassword from '../pages/Authentication/Login/ForgotPassword/ForgotPassword'
import ResetPassword from '../pages/Authentication/Login/ResetPassword/ResetPassword'
import EmailVerification from '../pages/Authentication/Login/EmailVerification/EmailVerification'
import TwoStepVerification from '../pages/Authentication/Login/TwoStepVerification/TwoStepVerification'
import LockScreen from '../pages/Authentication/Login/LockScreen/LockScreen'
import DashboardPreviewPage from '../pages/Authentication/Login/DashboardPreview'
import Error404 from '../pages/Error Pages/Eroor404'
import Error500 from '../pages/Error Pages/Error500'
import Commingsoon from '../pages/CommingSoon/Commingsoon'
import UnderMaintenance from '../pages/Under Maintenance/UnderMaintenance'
import BlankPage from '../pages/Blank Page/BlankPage'

// Role-based route protection component
import ProtectedRoute from '../components/ProtectedRoute'
import FacultyDashboard from '../pages/dashboard/Faculty/FacultyDashboard'

// Applications
import Calendar from '../pages/Applications/Calendar'
import Call from '../pages/Applications/Call'
import Chat from '../pages/Applications/Chat'
import Email from '../pages/Applications/Email'
import FileManager from '../pages/Applications/FileManager'
import Notes from '../pages/Applications/Notes'
import Todo from '../pages/Applications/Todo'

// Create the finalized router
const router = createBrowserRouter([
  // Catch / and redirect to role-appropriate dashboards BEFORE MainLayout
  {
    path: '/',
    element: (() => {
      // Check if in demo mode first
      if (isDemoMode()) {
        const demoUser = getCurrentDemoUser()
        if (demoUser) {
          const roleToPath: Record<string, string> = {
            'SUPER_ADMIN': '/super-admin/dashboard',
            'superadmin': '/super-admin/dashboard',
            'INSTITUTION_ADMIN': '/dashboard/main',
            'institution_admin': '/dashboard/main',
            'SCHOOL_ADMIN': '/dashboard/main',
            'school_admin': '/dashboard/main',
            'TEACHER': '/dashboard/teacher',
            'teacher': '/dashboard/teacher',
            'STUDENT': '/dashboard/student',
            'student': '/dashboard/student',
            'PARENT': '/dashboard/parent',
            'parent': '/dashboard/parent',
            'PRINCIPAL': '/principal',
            'principal': '/principal',
            'STAFF': '/staff',
            'STAFF_MEMBER': '/staff',
            'staff_member': '/staff',
            'ACCOUNTANT': '/dashboard/finance',
            'accountant': '/dashboard/finance',
            'HR': '/dashboard/hr',
            'HR_MANAGER': '/dashboard/hr',
            'hr_manager': '/dashboard/hr',
            'LIBRARIAN': '/dashboard/library',
            'librarian': '/dashboard/library',
            'TRANSPORT_MANAGER': '/dashboard/transport',
            'transport_manager': '/dashboard/transport',
            'HOSTEL_WARDEN': '/dashboard/hostel',
            'hostel_warden': '/dashboard/hostel'
          }

          const redirectPath = roleToPath[demoUser.role] || '/dashboard/main'
          return <Navigate to={redirectPath} replace />
        }
      }

      // Normal authentication flow
      const role = typeof window !== 'undefined'
        ? localStorage.getItem('selectedUserRole') || 'INSTITUTION_ADMIN'
        : 'INSTITUTION_ADMIN'

      const roleToPath: Record<string, string> = {
        'SUPER_ADMIN': '/super-admin/dashboard',
        'superadmin': '/super-admin/dashboard',
        'INSTITUTION_ADMIN': '/dashboard/main',
        'institution_admin': '/dashboard/main',
        'SCHOOL_ADMIN': '/dashboard/main',
        'school_admin': '/dashboard/main',
        'TEACHER': '/dashboard/teacher',
        'teacher': '/dashboard/teacher',
        'STUDENT': '/dashboard/student',
        'student': '/dashboard/student',
        'PARENT': '/dashboard/parent',
        'parent': '/dashboard/parent',
        'PRINCIPAL': '/principal',
        'principal': '/principal',
        'STAFF': '/staff',
        'STAFF_MEMBER': '/staff',
        'staff_member': '/staff',
        'ACCOUNTANT': '/dashboard/finance',
        'accountant': '/dashboard/finance',
        'HR': '/dashboard/hr',
        'HR_MANAGER': '/dashboard/hr',
        'hr_manager': '/dashboard/hr',
        'LIBRARIAN': '/dashboard/library',
        'librarian': '/dashboard/library',
        'TRANSPORT_MANAGER': '/dashboard/transport',
        'transport_manager': '/dashboard/transport',
        'HOSTEL_WARDEN': '/dashboard/hostel',
        'hostel_warden': '/dashboard/hostel'
      }

      const redirectPath = roleToPath[role] || '/dashboard/main'
      return <Navigate to={redirectPath} replace />
    })()
  },

  {
    path: '/preview/:previewId',
    element: <DashboardPreviewPage />
  },

  // Super Admin Routes (SEPARATE LAYOUT)
  {
    path: '/super-admin',
    element: <SuperAdminLayout />,
    children: [
      {
        index: true, element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<SuperAdminDashboard />} />
        )
      },
      {
        path: 'dashboard', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<SuperAdminDashboard />} />
        )
      },
      {
        path: 'pending-requests', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<PendingRequestsPage />} />
        )
      },
      {
        path: 'institutions/requests', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<PendingRequestsPage />} />
        )
      },
      {
        path: 'create-credentials', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<CreateCredentialsPage />} />
        )
      },
      {
        path: 'user-setup', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<CreateCredentialsPage />} />
        )
      },
      {
        path: 'institutions/add', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<AddInstitutionPage />} />
        )
      },
      {
        path: 'institutions/schools', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsManagementPage />} />
        )
      },
      {
        path: 'institutions/schools/:id', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsDetailsPage />} />
        )
      },
      {
        path: 'institutions/schools/:id/edit', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsEditPage />} />
        )
      },
      {
        path: 'institutions/schools/:id/admin', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsAdminManagementPage />} />
        )
      },
      {
        path: 'institutions/schools/:id/upgrade', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsUpgradePage />} />
        )
      },
      {
        path: 'institutions/inter-colleges', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsManagementPage />} />
        )
      },
      {
        path: 'institutions/inter-colleges/:id', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsDetailsPage />} />
        )
      },
      {
        path: 'institutions/inter-colleges/:id/edit', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsEditPage />} />
        )
      },
      {
        path: 'institutions/inter-colleges/:id/admin', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsAdminManagementPage />} />
        )
      },
      {
        path: 'institutions/inter-colleges/:id/upgrade', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsUpgradePage />} />
        )
      },
      {
        path: 'institutions/degree-colleges', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsManagementPage />} />
        )
      },
      {
        path: 'institutions/degree-colleges/:id', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsDetailsPage />} />
        )
      },
      {
        path: 'institutions/degree-colleges/:id/edit', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsEditPage />} />
        )
      },
      {
        path: 'institutions/degree-colleges/:id/admin', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsAdminManagementPage />} />
        )
      },
      {
        path: 'institutions/degree-colleges/:id/upgrade', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsUpgradePage />} />
        )
      },
      {
        path: 'institutions/engineering', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsManagementPage />} />
        )
      },
      {
        path: 'institutions/engineering/:id', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsDetailsPage />} />
        )
      },
      {
        path: 'institutions/engineering/:id/edit', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsEditPage />} />
        )
      },
      {
        path: 'institutions/engineering/:id/admin', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsAdminManagementPage />} />
        )
      },
      {
        path: 'institutions/engineering/:id/upgrade', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InstitutionsUpgradePage />} />
        )
      },
      {
        path: 'branches', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<BranchesMonitoringPage />} />
        )
      },
      {
        path: 'branches/:id', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<BranchDetailsPage />} />
        )
      },
      {
        path: 'branches/:id/edit', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<BranchEditPage />} />
        )
      },
      {
        path: 'branches/:id/students', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<BranchStudentsPage />} />
        )
      },
      {
        path: 'transactions', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<TransactionsManagementPage />} />
        )
      },
      {
        path: 'transactions/:id', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<TransactionDetailsPage />} />
        )
      },
      {
        path: 'transactions/invoices/:id', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<InvoiceDetailsPage />} />
        )
      },
      {
        path: 'membership-plans', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} requiredModules={["MEMBERSHIP"]} element={<MembershipPlans />} />
        )
      },
      {
        path: 'membership-addons', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} requiredModules={["MEMBERSHIP"]} element={<MembershipAddons />} />
        )
      },
      {
        path: 'membership-transactions', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} requiredModules={["MEMBERSHIP"]} element={<MembershipTransactions />} />
        )
      },
      {
        path: 'memberships', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<MembershipsManagementPage />} />
        )
      },
      {
        path: 'tickets', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<SupportTicketsPage />} />
        )
      },
      {
        path: 'analytics', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<AnalyticsPage />} />
        )
      },
      {
        path: 'modules', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<ModulesControlPage />} />
        )
      },
      {
        path: 'platform-users', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<PlatformUsersPage />} />
        )
      },
      {
        path: 'user-setup', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<CreateCredentialsPage />} />
        )
      },
      {
        path: 'revenue', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<RevenueAnalyticsPage />} />
        )
      },
      {
        path: 'audit-logs', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<AuditLogsPage />} />
        )
      },
      {
        path: 'impersonate', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<ImpersonatePage />} />
        )
      },
      {
        path: 'settings', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<PlatformSettingsPage />} />
        )
      },
      {
        path: 'analytics-reports', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<AnalyticsReportsPage />} />
        )
      },
      {
        path: 'alerts', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<AlertsPage />} />
        )
      },
      {
        path: 'maintenance', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<MaintenancePage />} />
        )
      },
      {
        path: 'apps/calendar', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<Calendar />} />
        )
      },
      {
        path: 'apps/call', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<Call />} />
        )
      },
      {
        path: 'apps/chat', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<Chat />} />
        )
      },
      {
        path: 'apps/file-manager', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<FileManager />} />
        )
      },
      {
        path: 'apps/notes', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<Notes />} />
        )
      },
      {
        path: 'apps/todo', element: (
          <ProtectedRoute requiredRoles={["SUPER_ADMIN"]} element={<Todo />} />
        )
      },
    ]
  },

  // School Admin Routes (MAIN LAYOUT)
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Dashboard Routes
      {
        path: 'dashboard/main', element: (
          <ProtectedRoute
            element={<EnhancedInstitutionLayout />}
            requiredRoles={['INSTITUTION_ADMIN', 'SCHOOL_ADMIN']}
          >
            <DashboardPage />
          </ProtectedRoute>
        )
      },
      // User Management Routes
      {
        path: 'user-management/pending-requests', element: (
          <ProtectedRoute
            element={<InstitutionPendingRequestsPage />}
            requiredRoles={['INSTITUTION_ADMIN', 'SCHOOL_ADMIN']}
          />
        )
      },
      {
        path: 'user-management/create-credentials', element: (
          <ProtectedRoute
            element={<InstitutionCreateCredentialsPage />}
            requiredRoles={['INSTITUTION_ADMIN', 'SCHOOL_ADMIN']}
          />
        )
      },
      {
        path: 'user-management/directory', element: (
          <ProtectedRoute
            element={<UserDirectoryPage />}
            requiredRoles={['INSTITUTION_ADMIN', 'SCHOOL_ADMIN']}
          />
        )
      },
      {
        path: 'dashboard/analytics', element: (
          <ProtectedRoute
            element={<AnalyticsDashboardPage />}
            requiredRoles={['INSTITUTION_ADMIN', 'SCHOOL_ADMIN']}
          />
        )
      },
      // TODO: Re-enable after fixing AdminDashboard.tsx
      // { path: 'dashboard/admin', element: (
      //     <ProtectedRoute element={<AdminDashboard />} requiredRoles={['SCHOOL_ADMIN','INSTITUTION_ADMIN']} />
      //   ) },
      // Special redirects for staff roles if they try to access main dashboard
      {
        path: 'dashboard/finance', element: (
          <ProtectedRoute
            element={<FinanceDashboardPage />}
            requiredRoles={['INSTITUTION_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT']}
          />
        )
      },
      {
        path: 'dashboard/hr', element: (
          <ProtectedRoute
            element={<HRDashboardPage />}
            requiredRoles={['HR']}
            requiredModules={['HR_PAYROLL']}
          />
        )
      },
      {
        path: 'dashboard/library', element: (
          <ProtectedRoute
            element={<LibraryDashboardPage />}
            requiredRoles={['LIBRARIAN']}
            requiredModules={['LIBRARY']}
          />
        )
      },
      {
        path: 'dashboard/transport', element: (
          <ProtectedRoute
            element={<TransportDashboardPage />}
            requiredRoles={['TRANSPORT_MANAGER']}
            requiredModules={['TRANSPORT']}
          />
        )
      },
      {
        path: 'dashboard/hostel', element: (
          <ProtectedRoute
            element={<HostelDashboardPage />}
            requiredRoles={['HOSTEL_WARDEN']}
            requiredModules={['HOSTEL']}
          />
        )
      },

      {
        path: 'overview/teachers',
        element: (
          <ProtectedRoute
            element={<TeacherOverviewPage />}
            requiredRoles={['INSTITUTION_ADMIN']}
          />
        )
      },
      {
        path: 'overview/students',
        element: (
          <ProtectedRoute
            element={<StudentOverviewPage />}
            requiredRoles={['INSTITUTION_ADMIN']}
          />
        )
      },
      {
        path: 'overview/parents',
        element: (
          <ProtectedRoute
            element={<ParentOverviewPage />}
            requiredRoles={['INSTITUTION_ADMIN']}
          />
        )
      },
      {
        path: 'sports',
        element: (
          <ProtectedRoute
            element={<SportsPage />}
            requiredModules={['ACADEMICS']}
          />
        )
      },

      {
        path: 'dashboard/teacher',
        element: <FacultyDashboard />
      },
      {
        path: 'dashboard/student',
        element: (
          <ProtectedRoute
            element={<StudentDashboard />}
            requiredModules={['DASHBOARD']}
          />
        )
      },
      {
        path: 'dashboard/parent',
        element: (
          <ProtectedRoute
            element={<ParentDashboardPage />}
            requiredModules={['DASHBOARD']}
          />
        )
      },
      {
        path: 'staff',
        element: (
          <ProtectedRoute
            element={<StaffDashboard />}
            requiredRoles={['STAFF']}
            requiredModules={['DASHBOARD']}
          />
        )
      },
      {
        path: 'principal',
        element: (
          <ProtectedRoute
            element={<PrincipalDashboard />}
            requiredRoles={['PRINCIPAL']}
            requiredModules={['DASHBOARD']}
          />
        )
      },

      // Student Management
      {
        path: 'students',
        element: (
          <ProtectedRoute
            element={<StudentListPage />}
            requiredModules={['STUDENTS']}
          />
        )
      },
      {
        path: 'students/list',
        element: (
          <ProtectedRoute
            element={<StudentGridPage />}
            requiredModules={['STUDENTS']}
          />
        )
      },
      {
        path: 'students/add',
        element: (
          <ProtectedRoute
            element={<StudentAdd />}
            requiredModules={['STUDENTS']}
            requiredPermissions={['canCreate']}
          />
        )
      },
      {
        path: 'students/:id',
        element: (
          <ProtectedRoute
            element={<StudentDetailsPage />}
            requiredModules={['STUDENTS']}
          />
        )
      },
      {
        path: 'students/promotion',
        element: (
          <ProtectedRoute
            element={<StudentPromotionPage />}
            requiredModules={['STUDENTS']}
            requiredPermissions={['canUpdate']}
          />
        )
      },
      {
        path: 'students/timetable',
        element: (
          <ProtectedRoute
            element={<StudentTimeTablePage />}
            requiredModules={['STUDENTS']}
          />
        )
      },
      {
        path: 'students/leaves',
        element: (
          <ProtectedRoute
            element={<StudentLeavesPage />}
            requiredModules={['STUDENTS']}
          />
        )
      },
      {
        path: 'students/fees',
        element: (
          <ProtectedRoute
            element={<StudentFeesPage />}
            requiredModules={['STUDENTS', 'FEES']}
          />
        )
      },
      {
        path: 'students/results',
        element: (
          <ProtectedRoute
            element={<StudentResultPage />}
            requiredModules={['STUDENTS', 'EXAMS']}
          />
        )
      },
      {
        path: 'students/library',
        element: (
          <ProtectedRoute
            element={<StudentLibraryPage />}
            requiredModules={['STUDENTS', 'LIBRARY']}
          />
        )
      },

      // Attendance
      {
        path: 'attendance/student',
        element: (
          <ProtectedRoute
            element={<StudentAttendancePage />}
            requiredModules={['attendance']}
          />
        )
      },
      {
        path: 'attendance/teacher',
        element: (
          <ProtectedRoute
            element={<TeacherAttendancePage />}
            requiredModules={['attendance']}
          />
        )
      },
      {
        path: 'attendance/staff',
        element: (
          <ProtectedRoute
            element={<StaffAttendancePage />}
            requiredModules={['attendance']}
            requiredPlan='premium'
          />
        )
      },

      // Exams & Results
      {
        path: 'exam',
        element: (
          <ProtectedRoute
            element={<ExamPage />}
            requiredModules={['EXAMS']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'exam-schedule',
        element: (
          <ProtectedRoute
            element={<ExamSchedulePage />}
            requiredModules={['EXAMS']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'grades',
        element: (
          <ProtectedRoute
            element={<GradePage />}
            requiredModules={['EXAMS']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'exam-attendance',
        element: (
          <ProtectedRoute
            element={<ExamAttendancePage />}
            requiredModules={['EXAMS']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'exam-results',
        element: (
          <ProtectedRoute
            element={<ExamResultsPage />}
            requiredModules={['EXAMS']}
            requiredPlan='premium'
          />
        )
      },

      // Teacher Management
      {
        path: 'teachers',
        element: (
          <ProtectedRoute
            element={<TeacherListPage />}
            requiredModules={['TEACHERS']}
          />
        )
      },
      {
        path: 'teachers/list',
        element: (
          <ProtectedRoute
            element={<TeacherListPage />}
            requiredModules={['TEACHERS']}
          />
        )
      },
      {
        path: 'teachers/:id',
        element: (
          <ProtectedRoute
            element={<TeacherDetailsPage />}
            requiredModules={['TEACHERS']}
          />
        )
      },
      {
        path: 'teachers/routine',
        element: (
          <ProtectedRoute
            element={<TeacherRoutinePage />}
            requiredModules={['TEACHERS']}
          />
        )
      },
      {
        path: 'teachers/leaves',
        element: (
          <ProtectedRoute
            element={<TeacherLeavesPage />}
            requiredModules={['TEACHERS']}
          />
        )
      },
      {
        path: 'teachers/salary',
        element: (
          <ProtectedRoute
            element={<TeacherSalaryPage />}
            requiredModules={['TEACHERS', 'HR_PAYROLL']}
          />
        )
      },
      {
        path: 'teachers/library',
        element: (
          <ProtectedRoute
            element={<TeacherLibraryPage />}
            requiredModules={['TEACHERS', 'LIBRARY']}
          />
        )
      },

      // Parent & Guardian Management
      {
        path: 'parents',
        element: (
          <ProtectedRoute
            element={<ParentListPage />}
            requiredModules={['PARENTS']}
          />
        )
      },
      {
        path: 'parents/list',
        element: (
          <ProtectedRoute
            element={<ParentListPage />}
            requiredModules={['PARENTS']}
          />
        )
      },
      {
        path: 'parents/:id',
        element: (
          <ProtectedRoute
            element={<ParentDetailsPage />}
            requiredModules={['PARENTS']}
          />
        )
      },
      {
        path: 'guardians',
        element: (
          <ProtectedRoute
            element={<GuardianListPage />}
            requiredModules={['PARENTS']}
          />
        )
      },
      {
        path: 'guardians/list',
        element: (
          <ProtectedRoute
            element={<GuardianListPage />}
            requiredModules={['PARENTS']}
          />
        )
      },

      // Fees & Finance
      {
        path: 'fees/group',
        element: (
          <ProtectedRoute
            element={<FeesGroupPage />}
            requiredModules={['FEES']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'fees/type',
        element: (
          <ProtectedRoute
            element={<FeesTypePage />}
            requiredModules={['FEES']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'fees/master',
        element: (
          <ProtectedRoute
            element={<FeesMasterPage />}
            requiredModules={['FEES']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'fees/assign',
        element: (
          <ProtectedRoute
            element={<FeesAssignPage />}
            requiredModules={['FEES']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'fees/collect',
        element: (
          <ProtectedRoute
            element={<CollectFeesPage />}
            requiredModules={['FEES']}
            requiredPlan='premium'
          />
        )
      },

      // Accounts
      {
        path: 'accounts/expenses',
        element: (
          <ProtectedRoute
            element={<ExpensesPage />}
            requiredModules={['ACCOUNTS']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'accounts/expense-categories',
        element: (
          <ProtectedRoute
            element={<ExpensesCategoryPage />}
            requiredModules={['ACCOUNTS']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'accounts/income',
        element: (
          <ProtectedRoute
            element={<IncomePage />}
            requiredModules={['ACCOUNTS']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'accounts/invoices',
        element: (
          <ProtectedRoute
            element={<InvoicesPage />}
            requiredModules={['ACCOUNTS']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'accounts/transactions',
        element: (
          <ProtectedRoute
            element={<FinanceTransactionsPage />}
            requiredModules={['ACCOUNTS']}
            requiredPlan='premium'
          />
        )
      },

      // Library
      {
        path: 'library/members',
        element: (
          <ProtectedRoute
            element={<LibraryMembersPage />}
            requiredModules={['LIBRARY']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'library/books',
        element: (
          <ProtectedRoute
            element={<LibraryBooksPage />}
            requiredModules={['LIBRARY']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'library/issue',
        element: (
          <ProtectedRoute
            element={<LibraryIssueBookPage />}
            requiredModules={['LIBRARY']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'library/return',
        element: (
          <ProtectedRoute
            element={<LibraryReturnPage />}
            requiredModules={['LIBRARY']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'reports',
        element: (
          <ProtectedRoute
            element={<LibraryReportPage />}
            requiredModules={['LIBRARY']}
            requiredPlan='premium'
          />
        )
      },

      // Transport
      {
        path: 'transport/routes',
        element: (
          <ProtectedRoute
            element={<TransportRoutesPage />}
            requiredModules={['TRANSPORT']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'transport/pickup-points',
        element: (
          <ProtectedRoute
            element={<TransportPickupPointsPage />}
            requiredModules={['TRANSPORT']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'transport/vehicles',
        element: (
          <ProtectedRoute
            element={<TransportVehiclePage />}
            requiredModules={['TRANSPORT']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'transport/drivers',
        element: (
          <ProtectedRoute
            element={<TransportVehicleDriversPage />}
            requiredModules={['TRANSPORT']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'transport/assign-vehicle',
        element: (
          <ProtectedRoute
            element={<TransportAssignVehiclePage />}
            requiredModules={['TRANSPORT']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'transport/reports',
        element: (
          <ProtectedRoute
            element={<TransportReportPage />}
            requiredModules={['TRANSPORT']}
            requiredPlan='premium'
          />
        )
      },

      // Academic Management
      {
        path: 'class',
        element: (
          <ProtectedRoute
            element={<ClassesPage />}
            requiredModules={['ACADEMICS']}
          />
        )
      },
      {
        path: 'class-section',
        element: (
          <ProtectedRoute
            element={<ClassSectionPage />}
            requiredModules={['ACADEMICS']}
          />
        )
      },
      {
        path: 'class-subject',
        element: (
          <ProtectedRoute
            element={<ClassSubjectPage />}
            requiredModules={['ACADEMICS']}
          />
        )
      },
      {
        path: 'syllabus',
        element: (
          <ProtectedRoute
            element={<ClassSyllabusPage />}
            requiredModules={['ACADEMICS']}
          />
        )
      },
      {
        path: 'classroom',
        element: (
          <ProtectedRoute
            element={<ClassRoomPage />}
            requiredModules={['ACADEMICS']}
          />
        )
      },
      {
        path: 'class-routine',
        element: (
          <ProtectedRoute
            element={<ClassRoutinePage />}
            requiredModules={['ACADEMICS']}
          />
        )
      },
      {
        path: 'class-timetable',
        element: (
          <ProtectedRoute
            element={<ClassTimeTablePage />}
            requiredModules={['ACADEMICS']}
          />
        )
      },
      {
        path: 'homework',
        element: (
          <ProtectedRoute
            element={<ClassHomeWorkPage />}
            requiredModules={['ACADEMICS']}
          />
        )
      },
      {
        path: 'exam',
        element: (
          <ProtectedRoute
            element={<ExamPage />}
            requiredModules={['EXAMS']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'exam-schedule',
        element: (
          <ProtectedRoute
            element={<ExamSchedulePage />}
            requiredModules={['EXAMS']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'grades',
        element: (
          <ProtectedRoute
            element={<GradePage />}
            requiredModules={['EXAMS']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'exam-attendance',
        element: (
          <ProtectedRoute
            element={<ExamAttendancePage />}
            requiredModules={['EXAMS']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'exam-results',
        element: (
          <ProtectedRoute
            element={<ExamResultsPage />}
            requiredModules={['EXAMS']}
            requiredPlan='premium'
          />
        )
      },

      // Hostel
      {
        path: 'hostel/list',
        element: (
          <ProtectedRoute
            element={<HostelListPage />}
            requiredModules={['HOSTEL']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'hostel/rooms',
        element: (
          <ProtectedRoute
            element={<HostelRoomsPage />}
            requiredModules={['HOSTEL']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'hostel/room-types',
        element: (
          <ProtectedRoute
            element={<HostelRoomTypesPage />}
            requiredModules={['HOSTEL']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'hostel/reports',
        element: (
          <ProtectedRoute
            element={<HostelReportPage />}
            requiredModules={['HOSTEL']}
            requiredPlan='premium'
          />
        )
      },

      // HR & Payroll
      {
        path: 'staffs',
        element: (
          <ProtectedRoute
            element={<StaffsPage />}
            requiredModules={['HR_PAYROLL']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'staffs/documents',
        element: (
          <ProtectedRoute
            element={<StaffDocumentsPage />}
            requiredModules={['HR_PAYROLL']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'departments',
        element: (
          <ProtectedRoute
            element={<DepartmentsPage />}
            requiredModules={['HR_PAYROLL']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'designations',
        element: (
          <ProtectedRoute
            element={<DesignationPage />}
            requiredModules={['HR_PAYROLL']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'staff-leaves',
        element: (
          <ProtectedRoute
            element={<ListLeavesPage />}
            requiredModules={['HR_PAYROLL']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'approvals',
        element: (
          <ProtectedRoute
            element={<ApproveRequestPage />}
            requiredModules={['HR_PAYROLL']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'holidays',
        element: (
          <ProtectedRoute
            element={<HolidaysPage />}
            requiredModules={['HR_PAYROLL']}
            requiredPlan='premium'
          />
        )
      },
      {
        path: 'payroll',
        element: (
          <ProtectedRoute
            element={<PayrollPage />}
            requiredModules={['HR_PAYROLL']}
            requiredPlan='premium'
          />
        )
      },

      // Communication
      {
        path: 'notice-board',
        element: (
          <ProtectedRoute
            element={<NoticeBoardPage />}
            requiredModules={['communication']}
          />
        )
      },
      {
        path: 'events',
        element: (
          <ProtectedRoute
            element={<EventsPage />}
            requiredModules={['communication']}
          />
        )
      },
      {
        path: 'messages',
        element: (
          <ProtectedRoute
            element={<MessagesPage />}
            requiredModules={['communication']}
          />
        )
      },

      // Reports
      {
        path: 'reports/attendance',
        element: (
          <ProtectedRoute
            element={<AttendanceReportPage />}
            requiredModules={['reports']}
          />
        )
      },
      {
        path: 'reports/class',
        element: (
          <ProtectedRoute
            element={<ClassReportPage />}
            requiredModules={['reports']}
          />
        )
      },
      {
        path: 'reports/student',
        element: (
          <ProtectedRoute
            element={<StudentReportPage />}
            requiredModules={['reports']}
          />
        )
      },
      {
        path: 'reports/grade',
        element: (
          <ProtectedRoute
            element={<GradeReportPage />}
            requiredModules={['reports']}
          />
        )
      },
      {
        path: 'reports/leave',
        element: (
          <ProtectedRoute
            element={<LeaveReportPage />}
            requiredModules={['reports']}
          />
        )
      },
      {
        path: 'reports/fees',
        element: (
          <ProtectedRoute
            element={<FeesReportPage />}
            requiredModules={['reports']}
          />
        )
      },

      // User & Role Management
      {
        path: 'users',
        element: (
          <ProtectedRoute
            element={<UsersPage />}
            requiredModules={['STUDENTS']}
          />
        )
      },
      {
        path: 'roles-permission',
        element: (
          <ProtectedRoute
            element={<RolesPermissionsPage />}
            requiredModules={['USER_MANAGEMENT']}
          />
        )
      },
      {
        path: 'delete-account',
        element: (
          <ProtectedRoute
            element={<DeleteAccountPage />}
            requiredModules={['USER_MANAGEMENT']}
          />
        )
      },

      // Settings
      {
        path: 'settings/profile',
        element: (
          <ProtectedRoute
            element={<ProfileSettings />}
            requiredModules={['settings']}
          />
        )
      },
      {
        path: 'settings/security',
        element: (
          <ProtectedRoute
            element={<SecuritySettings />}
            requiredModules={['settings']}
          />
        )
      },
      {
        path: 'settings/notifications',
        element: (
          <ProtectedRoute
            element={<NotificationsSettings />}
            requiredModules={['settings']}
          />
        )
      },
      {
        path: 'settings/company',
        element: (
          <ProtectedRoute
            element={<CompanyInfo />}
            requiredModules={['settings']}
          />
        )
      },
      {
        path: 'settings/localization',
        element: (
          <ProtectedRoute
            element={<Localization />}
            requiredModules={['settings']}
          />
        )
      },
      {
        path: 'settings/social-authentication',
        element: (
          <ProtectedRoute
            element={<SocialAuthentication />}
            requiredModules={['settings']}
          />
        )
      },
      {
        path: 'settings/email',
        element: (
          <ProtectedRoute
            element={<EmailConfig />}
            requiredModules={['settings']}
          />
        )
      },
      {
        path: 'settings/sms',
        element: (
          <ProtectedRoute
            element={<SmsConfig />}
            requiredModules={['settings']}
          />
        )
      },
      {
        path: 'settings/payment',
        element: (
          <ProtectedRoute
            element={<PaymentGateway />}
            requiredModules={['settings']}
          />
        )
      },
      {
        path: 'settings/tax',
        element: (
          <ProtectedRoute
            element={<TaxSettings />}
            requiredModules={['settings']}
          />
        )
      },
      {
        path: 'settings/school',
        element: (
          <ProtectedRoute
            element={<SchoolSettings />}
            requiredModules={['settings']}
          />
        )
      },
      {
        path: 'settings/storage',
        element: (
          <ProtectedRoute
            element={<StorageSettings />}
            requiredModules={['settings']}
          />
        )
      },

      // Support
      {
        path: 'support/tickets',
        element: (
          <ProtectedRoute
            element={<SupportTickets />}
            requiredRoles={['INSTITUTION_ADMIN', 'SCHOOL_ADMIN']}
          />
        )
      },

      // Applications
      {
        path: 'applications/calendar',
        element: (
          <ProtectedRoute
            element={<Calendar />}
          />
        )
      },
      {
        path: 'applications/call',
        element: (
          <ProtectedRoute
            element={<Call />}
          />
        )
      },
      {
        path: 'applications/chat',
        element: (
          <ProtectedRoute
            element={<Chat />}
          />
        )
      },
      {
        path: 'applications/email',
        element: (
          <ProtectedRoute
            element={<Email />}
          />
        )
      },
      {
        path: 'applications/file-manager',
        element: (
          <ProtectedRoute
            element={<FileManager />}
          />
        )
      },
      {
        path: 'applications/notes',
        element: (
          <ProtectedRoute
            element={<Notes />}
          />
        )
      },
      {
        path: 'applications/todo',
        element: (
          <ProtectedRoute
            element={<Todo />}
          />
        )
      },

      // Data Subject Rights (GDPR Compliance)
      {
        path: 'data-rights',
        element: (
          <ProtectedRoute
            element={<DataRightsPage />}
            requiredModules={['GDPR']}
          />
        )
      },
    ]
  },

  // Authentication Routes (outside layouts)
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/email-verification', element: <EmailVerification /> },
  { path: '/two-step-verification', element: <TwoStepVerification /> },
  { path: '/lock-screen', element: <LockScreen /> },
  { path: '/400-error', element: <Error404 /> },
  { path: '/500-error', element: <Error500 /> },
  { path: '/coming-soon', element: <Commingsoon /> },
  { path: '/under-maintenance', element: <UnderMaintenance /> },
  { path: '/blank-page', element: <BlankPage /> },

  // Catch-all route for 404
  { path: '*', element: <Error404 /> },
])

export default router
