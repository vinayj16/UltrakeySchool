import type { DemoModeUser } from '../utils/demoMode'

export interface DashboardKpi {
  label: string
  value: string
  note?: string
}

export type DemoUserSeed = Omit<DemoModeUser, 'id'> & { status?: DemoModeUser['status'] }

export interface DashboardAccessEntry {
  previewId: string
  role: string
  title: string
  description: string
  route: string
  badge?: string
  kpis: DashboardKpi[]
  permissions: string[]
  startingPoint: string
  demoUser: DemoUserSeed
}

export const DASHBOARD_ACCESS_DATA: DashboardAccessEntry[] = [
  {
    previewId: 'super-admin',
    role: 'SUPER_ADMIN',
    title: 'Enterprise Command Center',
    description: 'Monitor every institution, brand, and financial stream from one pane of glass.',
    route: '/super-admin/dashboard',
    badge: 'System View',
    kpis: [
      { label: 'Institutions', value: '278', note: '+12 this week' },
      { label: 'Active regions', value: '12', note: 'All monitored' },
      { label: 'Platform uptime', value: '98.6%', note: 'Rolling 30d' }
    ],
    permissions: ['institutions.*', 'transactions.*', 'analytics.*', 'settings.*'],
    startingPoint: 'Start with Institutions > Branch Monitoring, then drill into Analytics once the health metrics stabilize.',
    demoUser: {
      name: 'System Admin',
      email: 'superadmin@preview.ultrakey',
      role: 'superadmin',
      plan: 'premium',
      modules: ['*'],
      permissions: ['*'],
      status: 'active'
    }
  },
  {
    previewId: 'institution-admin',
    role: 'INSTITUTION_ADMIN',
    title: 'Institution Analytics',
    description: 'Track student growth, budget health, and compliance for your institution-wide operations.',
    route: '/dashboard/main',
    badge: 'Institution View',
    kpis: [
      { label: 'Students', value: '2,450', note: 'Active' },
      { label: 'Teachers', value: '180', note: 'Trained' },
      { label: 'Attendance', value: '92%', note: 'Daily average' }
    ],
    permissions: ['students.*', 'teachers.*', 'fees.*', 'attendance.*', 'reports.*'],
    startingPoint: 'Verify the Main Dashboard widgets, then navigate to Finance Cockpit to preview dues and receipts.',
    demoUser: {
      name: 'Institution Admin',
      email: 'admin@preview.ultrakey',
      role: 'institution_admin',
      plan: 'premium',
      modules: ['dashboard', 'finance', 'hr'],
      permissions: ['students.*', 'finance.*', 'reports.*'],
      status: 'active'
    }
  },
  {
    previewId: 'school-admin',
    role: 'SCHOOL_ADMIN',
    title: 'School Compliance Desk',
    description: 'Manage branch-level classes, attendance, and compliance dashboards in one place.',
    route: '/dashboard/main',
    badge: 'Branch View',
    kpis: [
      { label: 'Branches', value: '3', note: 'Within institution' },
      { label: 'Attendance', value: '94%', note: 'Weekly' },
      { label: 'Pending fees', value: '$12.4K', note: 'Follow up' }
    ],
    permissions: ['school.*', 'classes.*', 'attendance.*', 'communication.*'],
    startingPoint: 'Head to Classes/Sections to adjust schedules, then open Attendance Trends to validate compliance.',
    demoUser: {
      name: 'School Admin',
      email: 'schooladmin@preview.ultrakey',
      role: 'school_admin',
      plan: 'premium',
      modules: ['dashboard', 'academic', 'attendance'],
      permissions: ['school.*', 'attendance.*', 'communication.*'],
      status: 'active'
    }
  },
  {
    previewId: 'principal',
    role: 'PRINCIPAL',
    title: 'Leadership Board',
    description: 'High-level snapshot across academics, staff health, and communications for your campus.',
    route: '/principal',
    badge: 'Leadership',
    kpis: [
      { label: 'Academic score', value: '88%', note: 'Avg grade' },
      { label: 'Teacher performance', value: '4.2/5', note: 'Quality index' },
      { label: 'Announcements', value: '11', note: 'This week' }
    ],
    permissions: ['school.*', 'announcements.*', 'reports.*'],
    startingPoint: 'Review Student Overview + Teacher Intelligence to align messaging before crafting communications.',
    demoUser: {
      name: 'School Principal',
      email: 'principal@preview.ultrakey',
      role: 'principal',
      plan: 'medium',
      modules: ['dashboard', 'announcements', 'reports'],
      permissions: ['school.*', 'announcements.*', 'reports.*'],
      status: 'active'
    }
  },
  {
    previewId: 'teacher',
    role: 'TEACHER',
    title: 'Teacher Intelligence',
    description: 'Live class load, assignment queue, and performance check for your subjects.',
    route: '/dashboard/teacher',
    badge: 'Academics',
    kpis: [
      { label: 'Classes today', value: '4', note: 'Scheduled' },
      { label: 'Pending submissions', value: '22', note: 'Last 72h' },
      { label: 'Grade avg', value: 'B+', note: 'Classroom' }
    ],
    permissions: ['classes.*', 'assignments.*', 'grades.*'],
    startingPoint: 'Open the class-by-class dashboard, then click into Learner Snapshot for homework and exam cues.',
    demoUser: {
      name: 'Lead Teacher',
      email: 'teacher@preview.ultrakey',
      role: 'teacher',
      plan: 'medium',
      modules: ['dashboard', 'classes', 'homework', 'exams'],
      permissions: ['classes.*', 'grades.*', 'attendance.*'],
      status: 'active'
    }
  },
  {
    previewId: 'student',
    role: 'STUDENT',
    title: 'Learner Snapshot',
    description: 'GPA, attendance, upcoming exams, and homework summaries in one card.',
    route: '/dashboard/student',
    badge: 'Student View',
    kpis: [
      { label: 'GPA', value: '3.7', note: '4.0 scale' },
      { label: 'Attendance', value: '98%', note: 'Current term' },
      { label: 'Exams ahead', value: '3', note: 'Next week' }
    ],
    permissions: ['profile.*', 'subjects.view', 'homework.view'],
    startingPoint: 'Navigate to Homework + Timetable to plan the week, then check Fees for pending dues.',
    demoUser: {
      name: 'Model Student',
      email: 'student@preview.ultrakey',
      role: 'student',
      plan: 'basic',
      modules: ['dashboard', 'classes', 'homework', 'library'],
      permissions: ['attendance.view', 'grades.view'],
      status: 'active'
    }
  },
  {
    previewId: 'parent',
    role: 'PARENT',
    title: 'Guardian Overview',
    description: 'Track children grades, attendance, and fee status without logging into each account separately.',
    route: '/dashboard/parent',
    badge: 'Family',
    kpis: [
      { label: 'Children tracked', value: '2', note: 'Average' },
      { label: 'Avg grades', value: 'A-', note: 'Across wards' },
      { label: 'Fees due', value: '$250', note: 'This month' }
    ],
    permissions: ['children.*', 'grades.view', 'fees.view'],
    startingPoint: 'Start with Children Summary, then jump to Finance Cockpit for each child outstanding invoices.',
    demoUser: {
      name: 'Guardian',
      email: 'parent@preview.ultrakey',
      role: 'parent',
      plan: 'basic',
      modules: ['dashboard', 'children', 'fees'],
      permissions: ['children.*', 'grades.view', 'fees.view'],
      status: 'active'
    }
  },
  {
    previewId: 'accountant',
    role: 'ACCOUNTANT',
    title: 'Finance Cockpit',
    description: 'Revenue, dues, and payments status with live reconciliation pulls.',
    route: '/dashboard/finance',
    badge: 'Finance',
    kpis: [
      { label: 'Revenue', value: '$45K', note: 'This cycle' },
      { label: 'Overdue', value: '$8.5K', note: 'Across institutions' },
      { label: 'Invoices paid', value: '156', note: 'In last 30d' }
    ],
    permissions: ['finance.*', 'fees.*', 'reports.financial'],
    startingPoint: 'Launch Finance Dashboard, then switch to Transactions to verify reconciliations.',
    demoUser: {
      name: 'Finance Lead',
      email: 'accountant@preview.ultrakey',
      role: 'accountant',
      plan: 'medium',
      modules: ['dashboard', 'fees', 'accounts'],
      permissions: ['finance.*', 'reports.financial'],
      status: 'active'
    }
  },
  {
    previewId: 'hr-manager',
    role: 'HR_MANAGER',
    title: 'People Pulse',
    description: 'Hiring, leaves, and payroll readiness shown in one HR dashboard.',
    route: '/dashboard/hr',
    badge: 'People',
    kpis: [
      { label: 'Employees', value: '89', note: 'Active' },
      { label: 'Leave requests', value: '12', note: 'Awaiting approval' },
      { label: 'Training completion', value: '94%', note: 'Tracked' }
    ],
    permissions: ['hr.*', 'employees.*', 'leave.*'],
    startingPoint: 'Open Staff Listing, verify onboarding statuses, then review Leave Requests for approvals.',
    demoUser: {
      name: 'HR Manager',
      email: 'hr@preview.ultrakey',
      role: 'hr_manager',
      plan: 'medium',
      modules: ['dashboard', 'hr'],
      permissions: ['hr.*', 'leave.*'],
      status: 'active'
    }
  },
  {
    previewId: 'librarian',
    role: 'LIBRARIAN',
    title: 'Library Board',
    description: 'Books, borrowings, and member activity insights from the digital library console.',
    route: '/dashboard/library',
    badge: 'Library',
    kpis: [
      { label: 'Books', value: '12,450', note: 'Cataloged' },
      { label: 'Borrowed today', value: '234', note: 'Active loans' },
      { label: 'Overdue', value: '18', note: 'Reminder alerts' }
    ],
    permissions: ['library.*', 'books.*', 'borrowing.*'],
    startingPoint: 'Start with Inventory, then open Borrowings to track due books and member activity.',
    demoUser: {
      name: 'Librarian',
      email: 'library@preview.ultrakey',
      role: 'librarian',
      plan: 'medium',
      modules: ['dashboard', 'library'],
      permissions: ['library.*', 'books.*'],
      status: 'active'
    }
  },
  {
    previewId: 'transport-manager',
    role: 'TRANSPORT_MANAGER',
    title: 'Transport Map',
    description: 'Route coverage, vehicle health, and passenger counts in a single glance.',
    route: '/dashboard/transport',
    badge: 'Transport',
    kpis: [
      { label: 'Vehicles', value: '15', note: 'Active' },
      { label: 'Routes', value: '28', note: 'Daily' },
      { label: 'Riders/day', value: '456', note: 'Average' }
    ],
    permissions: ['transport.*', 'vehicles.*', 'routes.*'],
    startingPoint: 'Check Vehicles > Assignments, then open Routes to confirm route health and driver availability.',
    demoUser: {
      name: 'Transport Manager',
      email: 'transport@preview.ultrakey',
      role: 'transport_manager',
      plan: 'medium',
      modules: ['dashboard', 'transport'],
      permissions: ['transport.*', 'routes.*'],
      status: 'active'
    }
  },
  {
    previewId: 'hostel-warden',
    role: 'HOSTEL_WARDEN',
    title: 'Hostel Control',
    description: 'Occupancy, maintenance, and safety stats keep your dormitories secure.',
    route: '/dashboard/hostel',
    badge: 'Hostel',
    kpis: [
      { label: 'Rooms total', value: '120', note: 'Allocated' },
      { label: 'Occupied', value: '98', note: 'Today' },
      { label: 'Requests', value: '7', note: 'Pending' }
    ],
    permissions: ['hostel.*', 'rooms.*', 'maintenance.*'],
    startingPoint: 'Start with Room Allocation, then visit Maintenance to clear pending tickets.',
    demoUser: {
      name: 'Hostel Warden',
      email: 'hostel@preview.ultrakey',
      role: 'hostel_warden',
      plan: 'medium',
      modules: ['dashboard', 'hostel'],
      permissions: ['hostel.*', 'rooms.*'],
      status: 'active'
    }
  },
  {
    previewId: 'staff-member',
    role: 'STAFF_MEMBER',
    title: 'Staff Hub',
    description: 'Tasks, attendance, and announcements tailored for non-teaching staff.',
    route: '/staff',
    badge: 'Staff',
    kpis: [
      { label: 'Tasks done', value: '28', note: 'This month' },
      { label: 'Attendance', value: '96%', note: 'Rolling' },
      { label: 'Leave balance', value: '12 days', note: 'Remaining' }
    ],
    permissions: ['tasks.*', 'attendance.*', 'announcements.view'],
    startingPoint: 'Open Tasks and Attendance to check your schedule, then read the latest announcements.',
    demoUser: {
      name: 'Support Staff',
      email: 'staff@preview.ultrakey',
      role: 'staff_member',
      plan: 'basic',
      modules: ['dashboard', 'tasks'],
      permissions: ['tasks.*', 'attendance.*'],
      status: 'active'
    }
  }
]

export const getDashboardPreviewEntry = (previewId: string) =>
  DASHBOARD_ACCESS_DATA.find((entry) => entry.previewId === previewId)

export default DASHBOARD_ACCESS_DATA


