/**
 * Sidebar Menu Configuration for Different Roles
 * Each role gets specific sidebar menu items based on their access level
 */

export interface MenuSection {
  title: string
  icon?: string
  items: MenuItem[]
}

export interface MenuItem {
  label: string
  path: string
  icon: string
  badge?: string
  children?: MenuItem[]
}

export const SIDEBAR_MENUS: Record<string, MenuSection[]> = {
  // SUPER_ADMIN (System Administrator) - Full Platform Control
  SUPER_ADMIN: [
  {
    title: 'QUICK ACTIONS',
    items: [
       { label: 'Add Institution', path: '/super-admin/institutions/add', icon: 'ti ti-plus' },
    ]
  },
    
  {
    title: 'MAIN',
    items: [
      { label: 'Dashboard', path: '/super-admin/dashboard', icon: 'ti ti-layout-dashboard' },
      { label: 'Platform Analytics', path: '/super-admin/analytics', icon: 'ti ti-chart-line' },
    ]
  },

  {
    title: 'INSTITUTION MANAGEMENT',
    items: [
      { label: 'Schools', path: '/super-admin/institutions/schools', icon: 'ti ti-school' },
      { label: 'Inter Colleges', path: '/super-admin/institutions/inter-colleges', icon: 'ti ti-building-community' },
      { label: 'Degree Colleges', path: '/super-admin/institutions/degree-colleges', icon: 'ti ti-building' },
      { label: 'Branches Monitoring', path: '/super-admin/branches', icon: 'ti ti-git-branch' },
      { label: 'Impersonate Institution', path: '/super-admin/impersonate', icon: 'ti ti-user-switch' }
    ]
  },

  {
    title: 'SUBSCRIPTIONS & BILLING',
    items: [
      { label: 'Subscription Plans', path: '/super-admin/memberships', icon: 'ti ti-crown' },
      { label: 'Transactions', path: '/super-admin/transactions', icon: 'ti ti-report-money' },
      { label: 'Revenue Analytics', path: '/super-admin/revenue', icon: 'ti ti-currency-rupee' },
      { label: 'Expiry & Alerts', path: '/super-admin/alerts', icon: 'ti ti-alert-triangle' }
    ]
  },

  {
    title: 'ANALYTICS & REPORTS',
    items: [
      { label: 'Analytics & Reports', path: '/super-admin/analytics-reports', icon: 'ti ti-chart-bar' }
    ]
  },

  {
    title: 'MODULE & ACCESS CONTROL',
    items: [
      { label: 'Modules Control', path: '/super-admin/modules', icon: 'ti ti-puzzle' },
    ]
  },

  {
    title: 'USER & SUPPORT',
    items: [
      { label: 'Platform Users', path: '/super-admin/users', icon: 'ti ti-users' },
      { label: 'Support / Tickets', path: '/super-admin/tickets', icon: 'ti ti-ticket' }
    ]
  },

  {
    title: 'SYSTEM',
    items: [
      { label: 'Audit Logs', path: '/super-admin/audit-logs', icon: 'ti ti-shield-check' },
      { label: 'Platform Settings', path: '/super-admin/settings', icon: 'ti ti-settings' },
      { label: 'Maintenance Mode', path: '/super-admin/maintenance', icon: 'ti ti-tool' },
      {
        label: 'Applications',
        path: '/applications/calendar',
        icon: 'ti ti-apps',
        children: [
          { label: 'Calendar', path: '/applications/calendar', icon: 'ti ti-calendar' },
          { label: 'Call', path: '/applications/call', icon: 'ti ti-phone' },
          { label: 'Chat', path: '/applications/chat', icon: 'ti ti-message' },
          { label: 'Email', path: '/applications/email', icon: 'ti ti-mail' },
          { label: 'File Manager', path: '/applications/file-manager', icon: 'ti ti-folder' },
          { label: 'Notes', path: '/applications/notes', icon: 'ti ti-note' },
          { label: 'To Do', path: '/applications/todo', icon: 'ti ti-checklist' }
        ]
      }
    ]
  }
  ],

  // Add lowercase role mapping to match bypass auth
  superadmin: [
  {
    title: 'QUICK ACTIONS',
    items: [
       { label: 'Add Institution', path: '/super-admin/institutions/add', icon: 'ti ti-plus' },
    ]
  },
    
  {
    title: 'MAIN',
    items: [
      { label: 'Dashboard', path: '/super-admin/dashboard', icon: 'ti ti-layout-dashboard' },
      { label: 'Platform Analytics', path: '/super-admin/analytics', icon: 'ti ti-chart-line' },
    ]
  },

  {
    title: 'INSTITUTION MANAGEMENT',
    items: [
      { label: 'Schools', path: '/super-admin/institutions/schools', icon: 'ti ti-school' },
      { label: 'Inter Colleges', path: '/super-admin/institutions/inter-colleges', icon: 'ti ti-building-community' },
      { label: 'Degree Colleges', path: '/super-admin/institutions/degree-colleges', icon: 'ti ti-building' },
      { label: 'Branches Monitoring', path: '/super-admin/branches', icon: 'ti ti-git-branch' },
      { label: 'Impersonate Institution', path: '/super-admin/impersonate', icon: 'ti ti-user-switch' }
    ]
  },

  {
    title: 'SUBSCRIPTIONS & BILLING',
    items: [
      { label: 'Subscription Plans', path: '/super-admin/memberships', icon: 'ti ti-crown' },
      { label: 'Transactions', path: '/super-admin/transactions', icon: 'ti ti-report-money' },
      { label: 'Revenue Analytics', path: '/super-admin/revenue', icon: 'ti ti-currency-rupee' },
      { label: 'Expiry & Alerts', path: '/super-admin/alerts', icon: 'ti ti-alert-triangle' }
    ]
  },

  {
    title: 'ANALYTICS & REPORTS',
    items: [
      { label: 'Analytics & Reports', path: '/super-admin/analytics-reports', icon: 'ti ti-chart-bar' }
    ]
  },

  {
    title: 'MODULE & ACCESS CONTROL',
    items: [
      { label: 'Modules Control', path: '/super-admin/modules', icon: 'ti ti-puzzle' },
    ]
  },

  {
    title: 'USER & SUPPORT',
    items: [
      { label: 'Platform Users', path: '/super-admin/users', icon: 'ti ti-users' },
      { label: 'Support / Tickets', path: '/super-admin/tickets', icon: 'ti ti-ticket' }
    ]
  },

  {
    title: 'SYSTEM',
    items: [
      { label: 'Audit Logs', path: '/super-admin/audit-logs', icon: 'ti ti-shield-check' },
      { label: 'Platform Settings', path: '/super-admin/settings', icon: 'ti ti-settings' },
      { label: 'Maintenance Mode', path: '/super-admin/maintenance', icon: 'ti ti-tool' },
      {
        label: 'Applications',
        path: '/applications/calendar',
        icon: 'ti ti-apps',
        children: [
          { label: 'Calendar', path: '/applications/calendar', icon: 'ti ti-calendar' },
          { label: 'Call', path: '/applications/call', icon: 'ti ti-phone' },
          { label: 'Chat', path: '/applications/chat', icon: 'ti ti-message' },
          { label: 'Email', path: '/applications/email', icon: 'ti ti-mail' },
          { label: 'File Manager', path: '/applications/file-manager', icon: 'ti ti-folder' },
          { label: 'Notes', path: '/applications/notes', icon: 'ti ti-note' },
          { label: 'To Do', path: '/applications/todo', icon: 'ti ti-checklist' }
        ]
      }
    ]
  }
  ],

  // INSTITUTION_ADMIN (School Owner) - Full School Access
  INSTITUTION_ADMIN: [
    {
      title: 'MAIN',
      items: [
        { label: 'Main Dashboard', path: '/dashboard/main', icon: 'ti ti-dashboard' },
        { label: 'Analytics', path: '/dashboard/analytics', icon: 'ti ti-chart-line' },
        { label: 'Finance', path: '/dashboard/finance', icon: 'ti ti-wallet' },
        { label: 'Teaching Overview', path: '/overview/teachers', icon: 'ti ti-chalkboard' },
        { label: 'Student Overview', path: '/overview/students', icon: 'ti ti-user' },
        { label: 'Parent Overview', path: '/overview/parents', icon: 'ti ti-users-group' },
        {
          label: 'Applications',
          path: '/applications/calendar',
          icon: 'ti ti-apps',
          children: [
            { label: 'Calendar', path: '/applications/calendar', icon: 'ti ti-calendar' },
            { label: 'Call', path: '/applications/call', icon: 'ti ti-phone' },
            { label: 'Chat', path: '/applications/chat', icon: 'ti ti-message' },
            { label: 'Email', path: '/applications/email', icon: 'ti ti-mail' },
            { label: 'File Manager', path: '/applications/file-manager', icon: 'ti ti-folder' },
            { label: 'Notes', path: '/applications/notes', icon: 'ti ti-note' },
            { label: 'Todo', path: '/applications/todo', icon: 'ti ti-checklist' }
          ]
        }
      ]
    },
    {
      title: 'PEOPLES',
      items: [
        {
          label: 'Students',
          path: '/students',
          icon: 'ti ti-users',
          children: [
            { label: 'Student List', path: '/students', icon: 'ti ti-list' },
            { label: 'Add Student', path: '/students/add', icon: 'ti ti-user-plus' },
            { label: 'Promotion', path: '/students/promotion', icon: 'ti ti-arrow-up' },
            { label: 'Timetable', path: '/students/timetable', icon: 'ti ti-calendar' },
            { label: 'Leaves', path: '/students/leaves', icon: 'ti ti-calendar-off' },
            { label: 'Fees', path: '/students/fees', icon: 'ti ti-cash' },
            { label: 'Results', path: '/students/results', icon: 'ti ti-receipt' },
            { label: 'Library', path: '/students/library', icon: 'ti ti-book' }
          ]
        },
        {
          label: 'Teachers',
          path: '/teachers',
          icon: 'ti ti-chalkboard-user',
          children: [
            { label: 'Teacher List', path: '/teachers', icon: 'ti ti-list' },
            { label: 'Teacher Routine', path: '/teachers/routine', icon: 'ti ti-calendar' },
            { label: 'Leaves', path: '/teachers/leaves', icon: 'ti ti-calendar-off' },
            { label: 'Salary', path: '/teachers/salary', icon: 'ti ti-cash' },
            { label: 'Library', path: '/teachers/library', icon: 'ti ti-book' }
          ]
        },
        {
          label: 'Parents',
          path: '/parents',
          icon: 'ti ti-users-group',
          children: [
            { label: 'Parent List', path: '/parents', icon: 'ti ti-list' },
            { label: 'Parent Details', path: '/parents/:id', icon: 'ti ti-user' }
          ]
        },
        { label: 'Guardians', path: '/guardians', icon: 'ti ti-user-shield' }
      ]
    },
    {
      title: 'ACADEMIC',
      items: [
        { label: 'Classes', path: '/class', icon: 'ti ti-building' },
        { label: 'Sections', path: '/class-section', icon: 'ti ti-layout-kanban' },
        { label: 'Subjects', path: '/class-subject', icon: 'ti ti-book-2' },
        { label: 'Syllabus', path: '/syllabus', icon: 'ti ti-file-text' },
        { label: 'Classroom', path: '/classroom', icon: 'ti ti-door' },
        { label: 'Class Routine', path: '/class-routine', icon: 'ti ti-calendar' },
        { label: 'Timetable', path: '/class-timetable', icon: 'ti ti-clock' },
        { label: 'Homework', path: '/homework', icon: 'ti ti-pencil' }
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        {
          label: 'Fees Collection',
          path: '/fees/group',
          icon: 'ti ti-cash',
          children: [
            { label: 'Fee Groups', path: '/fees/group', icon: 'ti ti-list' },
            { label: 'Fee Types', path: '/fees/type', icon: 'ti ti-list' },
            { label: 'Fee Masters', path: '/fees/master', icon: 'ti ti-list' },
            { label: 'Fee Assignment', path: '/fees/assign', icon: 'ti ti-list' },
            { label: 'Collect Fees', path: '/fees/collect', icon: 'ti ti-cash' }
          ]
        },
        {
          label: 'Library',
          path: '/library/members',
          icon: 'ti ti-book-2',
          children: [
            { label: 'Members', path: '/library/members', icon: 'ti ti-users' },
            { label: 'Books', path: '/library/books', icon: 'ti ti-book' },
            { label: 'Issue Book', path: '/library/issue', icon: 'ti ti-arrow-up-right' },
            { label: 'Return Book', path: '/library/return', icon: 'ti ti-arrow-down-left' }
          ]
        },
        { label: 'Sports', path: '/sports', icon: 'ti ti-ball-basketball' },
        {
          label: 'Hostel',
          path: '/hostel/list',
          icon: 'ti ti-building',
          children: [
            { label: 'Hostel List', path: '/hostel/list', icon: 'ti ti-list' },
            { label: 'Rooms', path: '/hostel/rooms', icon: 'ti ti-door' },
            { label: 'Room Types', path: '/hostel/room-types', icon: 'ti ti-layout-kanban' }
          ]
        },
        {
          label: 'Transport',
          path: '/transport/routes',
          icon: 'ti ti-car',
          children: [
            { label: 'Routes', path: '/transport/routes', icon: 'ti ti-list' },
            { label: 'Pickup Points', path: '/transport/pickup-points', icon: 'ti ti-map-pin' },
            { label: 'Vehicles', path: '/transport/vehicles', icon: 'ti ti-car' },
            { label: 'Drivers', path: '/transport/drivers', icon: 'ti ti-users' },
            { label: 'Assign Vehicle', path: '/transport/assign-vehicle', icon: 'ti ti-link' }
          ]
        },
        {
          label: 'Applications',
          path: '/applications/calendar',
          icon: 'ti ti-apps',
          children: [
            { label: 'Calendar', path: '/applications/calendar', icon: 'ti ti-calendar' },
            { label: 'Call', path: '/applications/call', icon: 'ti ti-phone' },
            { label: 'Chat', path: '/applications/chat', icon: 'ti ti-message' },
            { label: 'Email', path: '/applications/email', icon: 'ti ti-mail' },
            { label: 'File Manager', path: '/applications/file-manager', icon: 'ti ti-folder' },
            { label: 'Notes', path: '/applications/notes', icon: 'ti ti-note' },
            { label: 'Todo', path: '/applications/todo', icon: 'ti ti-checklist' }
          ]
        }
      ]
    },
    {
      title: 'ATTENDANCE',
      items: [
        { label: 'Student Attendance', path: '/attendance/student', icon: 'ti ti-checklist' },
        { label: 'Staff Attendance', path: '/attendance/staff', icon: 'ti ti-checklist' }
      ]
    },
    {
      title: 'EXAMINATIONS',
      items: [
        { label: 'Exam', path: '/exam', icon: 'ti ti-pencil' },
        { label: 'Schedule', path: '/exam-schedule', icon: 'ti ti-calendar' },
        { label: 'Grades', path: '/grades', icon: 'ti ti-star' },
        { label: 'Exam Attendance', path: '/exam-attendance', icon: 'ti ti-checklist' },
        { label: 'Results', path: '/exam-results', icon: 'ti ti-receipt' }
      ]
    },
    {
      title: 'HRM',
      items: [
        { label: 'Staffs', path: '/staffs', icon: 'ti ti-users' },
        { label: 'Departments', path: '/departments', icon: 'ti ti-building' },
        { label: 'Designations', path: '/designations', icon: 'ti ti-badge' },
        { label: 'Leaves', path: '/staff-leaves', icon: 'ti ti-calendar-off' },
        { label: 'Approvals', path: '/approvals', icon: 'ti ti-check' },
        { label: 'Holidays', path: '/holidays', icon: 'ti ti-calendar-holiday' },
        { label: 'Payroll', path: '/payroll', icon: 'ti ti-cash' }
      ]
    },
    {
      title: 'FINANCE & ACCOUNTS',
      items: [
        { label: 'Expenses', path: '/accounts/expenses', icon: 'ti ti-receipt' },
        { label: 'Expense Categories', path: '/accounts/expense-categories', icon: 'ti ti-list' },
        { label: 'Income', path: '/accounts/income', icon: 'ti ti-cash' },
        { label: 'Invoices', path: '/accounts/invoices', icon: 'ti ti-receipt-2' },
        { label: 'Transactions', path: '/accounts/transactions', icon: 'ti ti-transfer-in' }
      ]
    },
    {
      title: 'ANNOUNCEMENTS',
      items: [
        { label: 'Notice Board', path: '/notice-board', icon: 'ti ti-bell' },
        { label: 'Events', path: '/events', icon: 'ti ti-calendar-event' }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Attendance Report', path: '/reports/attendance', icon: 'ti ti-file' },
        { label: 'Class Report', path: '/reports/class', icon: 'ti ti-file' },
        { label: 'Student Report', path: '/reports/student', icon: 'ti ti-file' },
        { label: 'Grade Report', path: '/reports/grade', icon: 'ti ti-file' },
        { label: 'Leave Report', path: '/reports/leave', icon: 'ti ti-file' },
        { label: 'Fees Report', path: '/reports/fees', icon: 'ti ti-file' }
      ]
    },
    {
      title: 'USER MANAGEMENT',
      items: [
        { label: 'Branches', path: '/branches', icon: 'ti ti-building-factory-2' },
        { label: 'Users', path: '/users', icon: 'ti ti-users' },
        { label: 'Roles & Permissions', path: '/roles-permission', icon: 'ti ti-lock' },
        { label: 'Delete Account Requests', path: '/delete-requests', icon: 'ti ti-trash' }
      ]
    },
    {
      title: 'SUPPORT',
      items: [
        { label: 'Support Tickets', path: '/support/tickets', icon: 'ti ti-ticket' }
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Module Activation', path: '/settings/modules', icon: 'ti ti-puzzle' },
        { label: 'Profile', path: '/settings/profile', icon: 'ti ti-user' },
        { label: 'Security', path: '/settings/security', icon: 'ti ti-lock' },
        { label: 'Notifications', path: '/settings/notifications', icon: 'ti ti-bell' },
        { label: 'Company Info', path: '/settings/company', icon: 'ti ti-building' },
        { label: 'Localization', path: '/settings/localization', icon: 'ti ti-globe' },
        { label: 'Email Config', path: '/settings/email', icon: 'ti ti-mail' },
        { label: 'SMS Config', path: '/settings/sms', icon: 'ti ti-messages' },
        { label: 'Payment Gateway', path: '/settings/payment', icon: 'ti ti-credit-card' },
        { label: 'Tax Settings', path: '/settings/tax', icon: 'ti ti-receipt' },
        { label: 'School Settings', path: '/settings/school', icon: 'ti ti-building' },
        { label: 'Storage Settings', path: '/settings/storage', icon: 'ti ti-cloud' }
      ]
    }
  ],

  // SCHOOL_ADMIN - Similar to Institution Admin but with restrictions
  SCHOOL_ADMIN: [
    {
      title: 'MAIN',
      items: [
        { label: 'Dashboard', path: '/dashboard/main', icon: 'ti ti-dashboard' },
        { label: 'Analytics', path: '/dashboard/analytics', icon: 'ti ti-chart-line' },
         {
          label: 'Applications',
          path: '/applications/calendar',
          icon: 'ti ti-apps',
          children: [
            { label: 'Calendar', path: '/applications/calendar', icon: 'ti ti-calendar' },
            { label: 'Call', path: '/applications/call', icon: 'ti ti-phone' },
            { label: 'Chat', path: '/applications/chat', icon: 'ti ti-message' },
            { label: 'Email', path: '/applications/email', icon: 'ti ti-mail' },
            { label: 'File Manager', path: '/applications/file-manager', icon: 'ti ti-folder' },
            { label: 'Notes', path: '/applications/notes', icon: 'ti ti-note' },
            { label: 'Todo', path: '/applications/todo', icon: 'ti ti-checklist' }
          ]
        }
      ]
    },
    {
      title: 'PEOPLES',
      items: [
        {
          label: 'Students',
          path: '/students',
          icon: 'ti ti-users',
          children: [
            { label: 'Student List', path: '/students', icon: 'ti ti-list' },
            { label: 'Add Student', path: '/students/add', icon: 'ti ti-user-plus' },
            { label: 'Promotion', path: '/students/promotion', icon: 'ti ti-arrow-up' },
            { label: 'Fees', path: '/students/fees', icon: 'ti ti-cash' },
            { label: 'Results', path: '/students/results', icon: 'ti ti-receipt' }
          ]
        },
        {
          label: 'Teachers',
          path: '/teachers',
          icon: 'ti ti-chalkboard-user',
          children: [
            { label: 'Teacher List', path: '/teachers', icon: 'ti ti-list' },
            { label: 'Routine', path: '/teachers/routine', icon: 'ti ti-calendar' },
            { label: 'Leaves', path: '/teachers/leaves', icon: 'ti ti-calendar-off' }
          ]
        },
        { label: 'Parents', path: '/parents', icon: 'ti ti-users-group' },
        { label: 'Guardians', path: '/guardians', icon: 'ti ti-user-shield' }
      ]
    },
    {
      title: 'ACADEMIC',
      items: [
        { label: 'Classes', path: '/class', icon: 'ti ti-building' },
        { label: 'Sections', path: '/class-section', icon: 'ti ti-layout-kanban' },
        { label: 'Subjects', path: '/class-subject', icon: 'ti ti-book-2' },
        { label: 'Syllabus', path: '/syllabus', icon: 'ti ti-file-text' },
        { label: 'Classroom', path: '/classroom', icon: 'ti ti-door' },
        { label: 'Class Routine', path: '/class-routine', icon: 'ti ti-calendar' },
        { label: 'Timetable', path: '/class-timetable', icon: 'ti ti-clock' },
        { label: 'Homework', path: '/homework', icon: 'ti ti-pencil' }
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        {
          label: 'Fees Collection',
          path: '/fees/group',
          icon: 'ti ti-cash',
          children: [
            { label: 'Fee Groups', path: '/fees/group', icon: 'ti ti-list' },
            { label: 'Collect Fees', path: '/fees/collect', icon: 'ti ti-cash' }
          ]
        },
        {
          label: 'Library',
          path: '/library/members',
          icon: 'ti ti-book-2',
          children: [
            { label: 'Members', path: '/library/members', icon: 'ti ti-users' },
            { label: 'Books', path: '/library/books', icon: 'ti ti-book' }
          ]
        },
        { label: 'Sports', path: '/sports', icon: 'ti ti-ball-basketball' },
       
      ]
    },
    {
      title: 'ATTENDANCE',
      items: [
        { label: 'Student Attendance', path: '/attendance/student', icon: 'ti ti-checklist' },
        { label: 'Teacher Attendance', path: '/attendance/teacher', icon: 'ti ti-checklist' }
      ]
    },
    {
      title: 'EXAMINATIONS',
      items: [
        { label: 'Exam', path: '/exam', icon: 'ti ti-pencil' },
        { label: 'Schedule', path: '/exam-schedule', icon: 'ti ti-calendar' },
        { label: 'Grades', path: '/grades', icon: 'ti ti-star' },
        { label: 'Results', path: '/exam-results', icon: 'ti ti-receipt' }
      ]
    },
    {
      title: 'ANNOUNCEMENTS',
      items: [
        { label: 'Notice Board', path: '/notice-board', icon: 'ti ti-bell' },
        { label: 'Events', path: '/events', icon: 'ti ti-calendar-event' }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Attendance Report', path: '/reports/attendance', icon: 'ti ti-file' },
        { label: 'Student Report', path: '/reports/student', icon: 'ti ti-file' },
        { label: 'Grade Report', path: '/reports/grade', icon: 'ti ti-file' },
        { label: 'Fees Report', path: '/reports/fees', icon: 'ti ti-file' }
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Profile', path: '/settings/profile', icon: 'ti ti-user' },
        { label: 'Notifications', path: '/settings/notifications', icon: 'ti ti-bell' },
        { label: 'School Settings', path: '/settings/school', icon: 'ti ti-building' }
      ]
    }
  ],

  // TEACHER - Limited to academic and class-specific pages
  TEACHER: [
    {
      title: 'MAIN',
      items: [
        { label: 'Teacher Dashboard', path: '/dashboard/teacher', icon: 'ti ti-dashboard' },
         {
          label: 'Applications',
          path: '/applications/calendar',
          icon: 'ti ti-apps',
          children: [
            { label: 'Calendar', path: '/applications/calendar', icon: 'ti ti-calendar' },
            { label: 'Call', path: '/applications/call', icon: 'ti ti-phone' },
            { label: 'Chat', path: '/applications/chat', icon: 'ti ti-message' },
            { label: 'Email', path: '/applications/email', icon: 'ti ti-mail' },
            { label: 'File Manager', path: '/applications/file-manager', icon: 'ti ti-folder' },
            { label: 'Notes', path: '/applications/notes', icon: 'ti ti-note' },
            { label: 'Todo', path: '/applications/todo', icon: 'ti ti-checklist' }
          ]
        }
      ]
    },
    {
      title: 'ACADEMIC',
      items: [
        { label: 'Classes', path: '/class', icon: 'ti ti-building' },
        { label: 'Subjects', path: '/class-subject', icon: 'ti ti-book-2' },
        { label: 'Syllabus', path: '/syllabus', icon: 'ti ti-file-text' },
        { label: 'Classroom', path: '/classroom', icon: 'ti ti-door' },
        { label: 'Class Routine', path: '/class-routine', icon: 'ti ti-calendar' },
        { label: 'Class Timetable', path: '/class-timetable', icon: 'ti ti-clock' },
        { label: 'Homework', path: '/homework', icon: 'ti ti-pencil' }
      ]
    },
    {
      title: 'PEOPLES',
      items: [
        { label: 'Students', path: '/students', icon: 'ti ti-users' },
        { label: 'Teacher Routine', path: '/teachers/routine', icon: 'ti ti-calendar' }
      ]
    },
    {
      title: 'PERSONAL',
      items: [
        { label: 'My Salary', path: '/teachers/salary', icon: 'ti ti-cash' },
        { label: 'Library', path: '/teachers/library', icon: 'ti ti-book' }
      ]
    },
    {
      title: 'ATTENDANCE',
      items: [
        { label: 'Student Attendance', path: '/attendance/student', icon: 'ti ti-checklist' }
      ]
    },
    {
      title: 'EXAMINATIONS',
      items: [
        { label: 'Exam', path: '/exam', icon: 'ti ti-pencil' },
        { label: 'Schedule', path: '/exam-schedule', icon: 'ti ti-calendar' },
        { label: 'Grades', path: '/grades', icon: 'ti ti-star' }
      ]
    },
    {
      title: 'ANNOUNCEMENTS',
      items: [
        { label: 'Notice Board', path: '/notice-board', icon: 'ti ti-bell' },
        { label: 'Events', path: '/events', icon: 'ti ti-calendar-event' }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Attendance Report', path: '/reports/attendance', icon: 'ti ti-file' },
        { label: 'Grade Report', path: '/reports/grade', icon: 'ti ti-file' },
       
      ]
    }
  ],

  // STUDENT - Minimal access, read-only
  STUDENT: [
    {
      title: 'MAIN',
      items: [
        { label: 'Student Dashboard', path: '/dashboard/student', icon: 'ti ti-dashboard' },
         {
          label: 'Applications',
          path: '/applications/calendar',
          icon: 'ti ti-apps',
          children: [
            { label: 'Calendar', path: '/applications/calendar', icon: 'ti ti-calendar' },
            { label: 'Call', path: '/applications/call', icon: 'ti ti-phone' },
            { label: 'Chat', path: '/applications/chat', icon: 'ti ti-message' },
            { label: 'Email', path: '/applications/email', icon: 'ti ti-mail' },
            { label: 'File Manager', path: '/applications/file-manager', icon: 'ti ti-folder' },
            { label: 'Notes', path: '/applications/notes', icon: 'ti ti-note' },
            { label: 'Todo', path: '/applications/todo', icon: 'ti ti-checklist' }
          ]
        }
      ]
    },
    {
      title: 'ACADEMIC',
      items: [
        { label: 'Subjects', path: '/class-subject', icon: 'ti ti-book-2' },
        { label: 'Timetable', path: '/class-timetable', icon: 'ti ti-clock' },
        { label: 'My Timetable', path: '/students/timetable', icon: 'ti ti-calendar-time' },
        { label: 'Homework', path: '/homework', icon: 'ti ti-pencil' },
        { label: 'Syllabus', path: '/syllabus', icon: 'ti ti-file-text' }
      ]
    },
    {
      title: 'PERSONAL',
      items: [
        { label: 'My Leaves', path: '/students/leaves', icon: 'ti ti-calendar-off' },
        { label: 'Library', path: '/students/library', icon: 'ti ti-book' }
      ]
    },
    {
      title: 'ATTENDANCE',
      items: [
        { label: 'My Attendance', path: '/attendance/student', icon: 'ti ti-checklist' }
      ]
    },
    {
      title: 'EXAMINATIONS',
      items: [
        { label: 'Exam Schedule', path: '/exam-schedule', icon: 'ti ti-calendar' },
        { label: 'My Results', path: '/exam-results', icon: 'ti ti-receipt' }
      ]
    },
    {
      title: 'FEES',
      items: [
        { label: 'Fee Status', path: '/students/fees', icon: 'ti ti-cash' }
      ]
    },
    {
      title: 'ANNOUNCEMENTS',
      items: [
        { label: 'Notice Board', path: '/notice-board', icon: 'ti ti-bell' },
        { label: 'Events', path: '/events', icon: 'ti ti-calendar-event' },
       
      ]
    }
  ],

  // PARENT - Child/children data only
  PARENT: [
    {
      title: 'MAIN',
      items: [
        { label: 'Parent Dashboard', path: '/dashboard/parent', icon: 'ti ti-dashboard' },
         {
          label: 'Applications',
          path: '/applications/calendar',
          icon: 'ti ti-apps',
          children: [
            { label: 'Calendar', path: '/applications/calendar', icon: 'ti ti-calendar' },
            { label: 'Call', path: '/applications/call', icon: 'ti ti-phone' },
            { label: 'Chat', path: '/applications/chat', icon: 'ti ti-message' },
            { label: 'Email', path: '/applications/email', icon: 'ti ti-mail' },
            { label: 'File Manager', path: '/applications/file-manager', icon: 'ti ti-folder' },
            { label: 'Notes', path: '/applications/notes', icon: 'ti ti-note' },
            { label: 'Todo', path: '/applications/todo', icon: 'ti ti-checklist' }
          ]
        }
      ]
    },
    {
      title: 'CHILD ATTENDANCE',
      items: [
        { label: 'Attendance', path: '/attendance/student', icon: 'ti ti-checklist' }
      ]
    },
    {
      title: 'ACADEMIC',
      items: [
        { label: 'Homework', path: '/homework', icon: 'ti ti-pencil' },
        { label: 'Exam Results', path: '/exam-results', icon: 'ti ti-receipt' }
      ]
    },
    {
      title: 'FEES',
      items: [
        { label: 'Fee Status', path: '/students/fees', icon: 'ti ti-cash' }
      ]
    },
    {
      title: 'COMMUNICATION',
      items: [
        { label: 'Notice Board', path: '/notice-board', icon: 'ti ti-bell' },
        { label: 'Events', path: '/events', icon: 'ti ti-calendar-event' },
        { label: 'Teacher Communication', path: '/messages', icon: 'ti ti-message' },
        
      ]
    }
  ],

  // ACCOUNTANT - Finance focused
  ACCOUNTANT: [
    {
      title: 'MAIN',
      items: [
        { label: 'Finance Dashboard', path: '/dashboard/finance', icon: 'ti ti-dashboard' },
         {
          label: 'Applications',
          path: '/applications/calendar',
          icon: 'ti ti-apps',
          children: [
            { label: 'Calendar', path: '/applications/calendar', icon: 'ti ti-calendar' },
            { label: 'Call', path: '/applications/call', icon: 'ti ti-phone' },
            { label: 'Chat', path: '/applications/chat', icon: 'ti ti-message' },
            { label: 'Email', path: '/applications/email', icon: 'ti ti-mail' },
            { label: 'File Manager', path: '/applications/file-manager', icon: 'ti ti-folder' },
            { label: 'Notes', path: '/applications/notes', icon: 'ti ti-note' },
            { label: 'Todo', path: '/applications/todo', icon: 'ti ti-checklist' }
          ]
        }
      ]
    },
    {
      title: 'FEES COLLECTION',
      items: [
        { label: 'Fee Groups', path: '/fees/group', icon: 'ti ti-list' },
        { label: 'Fee Types', path: '/fees/type', icon: 'ti ti-list' },
        { label: 'Fee Masters', path: '/fees/master', icon: 'ti ti-list' },
        { label: 'Fee Assignment', path: '/fees/assign', icon: 'ti ti-list' },
        { label: 'Collect Fees', path: '/fees/collect', icon: 'ti ti-cash' }
      ]
    },
    {
      title: 'FINANCE & ACCOUNTS',
      items: [
        { label: 'Expenses', path: '/accounts/expenses', icon: 'ti ti-receipt' },
        { label: 'Expense Categories', path: '/accounts/expense-categories', icon: 'ti ti-list' },
        { label: 'Income', path: '/accounts/income', icon: 'ti ti-cash' },
        { label: 'Invoices', path: '/accounts/invoices', icon: 'ti ti-receipt-2' },
        { label: 'Transactions', path: '/accounts/transactions', icon: 'ti ti-transfer-in' }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Fees Report', path: '/reports/fees', icon: 'ti ti-file' }
      ]
    }
  ],

  // HR - Staff and payroll focused
  HR: [
    {
      title: 'MAIN',
      items: [
        { label: 'HR Dashboard', path: '/dashboard/hr', icon: 'ti ti-dashboard' },
         {
          label: 'Applications',
          path: '/applications/calendar',
          icon: 'ti ti-apps',
          children: [
            { label: 'Calendar', path: '/applications/calendar', icon: 'ti ti-calendar' },
            { label: 'Call', path: '/applications/call', icon: 'ti ti-phone' },
            { label: 'Chat', path: '/applications/chat', icon: 'ti ti-message' },
            { label: 'Email', path: '/applications/email', icon: 'ti ti-mail' },
            { label: 'File Manager', path: '/applications/file-manager', icon: 'ti ti-folder' },
            { label: 'Notes', path: '/applications/notes', icon: 'ti ti-note' },
            { label: 'Todo', path: '/applications/todo', icon: 'ti ti-checklist' }
          ]
        }
      ]
    },
    {
      title: 'HRM',
      items: [
        { label: 'Staffs', path: '/staffs', icon: 'ti ti-users' },
        { label: 'Departments', path: '/departments', icon: 'ti ti-building' },
        { label: 'Designations', path: '/designations', icon: 'ti ti-badge' },
        { label: 'Leaves', path: '/staff-leaves', icon: 'ti ti-calendar-off' },
        { label: 'Leave Approvals', path: '/approvals', icon: 'ti ti-check' },
        { label: 'Holidays', path: '/holidays', icon: 'ti ti-calendar-holiday' },
        { label: 'Staff Documents', path: '/staffs/documents', icon: 'ti ti-file' },
        { label: 'Payroll', path: '/payroll', icon: 'ti ti-cash' }
      ]
    },
    {
      title: 'ATTENDANCE',
      items: [
        { label: 'Staff Attendance', path: '/attendance/staff', icon: 'ti ti-checklist' }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Attendance Report', path: '/reports/attendance', icon: 'ti ti-file' }
      ]
    }
  ],

  // LIBRARIAN - Library focused
  LIBRARIAN: [
    {
      title: 'MAIN',
      items: [
        { label: 'Library Dashboard', path: '/dashboard/library', icon: 'ti ti-dashboard' },
         {
          label: 'Applications',
          path: '/applications/calendar',
          icon: 'ti ti-apps',
          children: [
            { label: 'Calendar', path: '/applications/calendar', icon: 'ti ti-calendar' },
            { label: 'Call', path: '/applications/call', icon: 'ti ti-phone' },
            { label: 'Chat', path: '/applications/chat', icon: 'ti ti-message' },
            { label: 'Email', path: '/applications/email', icon: 'ti ti-mail' },
            { label: 'File Manager', path: '/applications/file-manager', icon: 'ti ti-folder' },
            { label: 'Notes', path: '/applications/notes', icon: 'ti ti-note' },
            { label: 'Todo', path: '/applications/todo', icon: 'ti ti-checklist' }
          ]
        }
      ]
    },
    {
      title: 'LIBRARY',
      items: [
        { label: 'Library Members', path: '/library/members', icon: 'ti ti-users' },
        { label: 'Books', path: '/library/books', icon: 'ti ti-book' },
        { label: 'Issue Book', path: '/library/issue', icon: 'ti ti-arrow-up-right' },
        { label: 'Return Book', path: '/library/return', icon: 'ti ti-arrow-down-left' }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Library Report', path: '/reports/library', icon: 'ti ti-file' }
      ]
    }
  ],

  // TRANSPORT_MANAGER - Transport focused
  TRANSPORT_MANAGER: [
    {
      title: 'MAIN',
      items: [
        { label: 'Transport Dashboard', path: '/dashboard/transport', icon: 'ti ti-dashboard' },
         {
          label: 'Applications',
          path: '/applications/calendar',
          icon: 'ti ti-apps',
          children: [
            { label: 'Calendar', path: '/applications/calendar', icon: 'ti ti-calendar' },
            { label: 'Call', path: '/applications/call', icon: 'ti ti-phone' },
            { label: 'Chat', path: '/applications/chat', icon: 'ti ti-message' },
            { label: 'Email', path: '/applications/email', icon: 'ti ti-mail' },
            { label: 'File Manager', path: '/applications/file-manager', icon: 'ti ti-folder' },
            { label: 'Notes', path: '/applications/notes', icon: 'ti ti-note' },
            { label: 'Todo', path: '/applications/todo', icon: 'ti ti-checklist' }
          ]
        }
      ]
    },
    {
      title: 'TRANSPORT',
      items: [
        { label: 'Routes', path: '/transport/routes', icon: 'ti ti-list' },
        { label: 'Pickup Points', path: '/transport/pickup-points', icon: 'ti ti-map-pin' },
        { label: 'Vehicles', path: '/transport/vehicles', icon: 'ti ti-car' },
        { label: 'Drivers', path: '/transport/drivers', icon: 'ti ti-users' },
        { label: 'Assign Vehicle', path: '/transport/assign-vehicle', icon: 'ti ti-link' }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Transport Report', path: '/transport/reports', icon: 'ti ti-file' }
      ]
    }
  ],

  // HOSTEL_WARDEN - Hostel focused
  HOSTEL_WARDEN: [
    {
      title: 'MAIN',
      items: [
        { label: 'Hostel Dashboard', path: '/dashboard/hostel', icon: 'ti ti-dashboard' },
         {
          label: 'Applications',
          path: '/applications/calendar',
          icon: 'ti ti-apps',
          children: [
            { label: 'Calendar', path: '/applications/calendar', icon: 'ti ti-calendar' },
            { label: 'Call', path: '/applications/call', icon: 'ti ti-phone' },
            { label: 'Chat', path: '/applications/chat', icon: 'ti ti-message' },
            { label: 'Email', path: '/applications/email', icon: 'ti ti-mail' },
            { label: 'File Manager', path: '/applications/file-manager', icon: 'ti ti-folder' },
            { label: 'Notes', path: '/applications/notes', icon: 'ti ti-note' },
            { label: 'Todo', path: '/applications/todo', icon: 'ti ti-checklist' }
          ]
        }
      ]
    },
    {
      title: 'HOSTEL',
      items: [
        { label: 'Hostel List', path: '/hostel/list', icon: 'ti ti-list' },
        { label: 'Hostel Rooms', path: '/hostel/rooms', icon: 'ti ti-door' },
        { label: 'Room Types', path: '/hostel/room-types', icon: 'ti ti-layout-kanban' }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Hostel Report', path: '/hostel/reports', icon: 'ti ti-file' }
      ]
    }
  ],

  // STAFF - General staff member with limited access
  STAFF: [
    {
      title: 'MAIN',
      items: [
        { label: 'Staff Dashboard', path: '/staff', icon: 'ti ti-dashboard' },
         {
          label: 'Applications',
          path: '/applications/calendar',
          icon: 'ti ti-apps',
          children: [
            { label: 'Calendar', path: '/applications/calendar', icon: 'ti ti-calendar' },
            { label: 'Call', path: '/applications/call', icon: 'ti ti-phone' },
            { label: 'Chat', path: '/applications/chat', icon: 'ti ti-message' },
            { label: 'Email', path: '/applications/email', icon: 'ti ti-mail' },
            { label: 'File Manager', path: '/applications/file-manager', icon: 'ti ti-folder' },
            { label: 'Notes', path: '/applications/notes', icon: 'ti ti-note' },
            { label: 'Todo', path: '/applications/todo', icon: 'ti ti-checklist' }
          ]
        }
      ]
    },
    {
      title: 'ATTENDANCE',
      items: [
        { label: 'My Attendance', path: '/attendance/staff', icon: 'ti ti-checklist' }
      ]
    },
    {
      title: 'COMMUNICATION',
      items: [
        { label: 'Notice Board', path: '/notice-board', icon: 'ti ti-bell' },
        { label: 'Events', path: '/events', icon: 'ti ti-calendar-event' },
        { label: 'Messages', path: '/messages', icon: 'ti ti-message' }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Attendance Report', path: '/reports/attendance', icon: 'ti ti-file' }
      ]
    }
  ],

  // Add lowercase role mapping to match bypass auth
  staff_member: [
    {
      title: 'MAIN',
      items: [
        { label: 'Staff Dashboard', path: '/staff', icon: 'ti ti-dashboard' },
         {
          label: 'Applications',
          path: '/applications/calendar',
          icon: 'ti ti-apps',
          children: [
            { label: 'Calendar', path: '/applications/calendar', icon: 'ti ti-calendar' },
            { label: 'Call', path: '/applications/call', icon: 'ti ti-phone' },
            { label: 'Chat', path: '/applications/chat', icon: 'ti ti-message' },
            { label: 'Email', path: '/applications/email', icon: 'ti ti-mail' },
            { label: 'File Manager', path: '/applications/file-manager', icon: 'ti ti-folder' },
            { label: 'Notes', path: '/applications/notes', icon: 'ti ti-note' },
            { label: 'Todo', path: '/applications/todo', icon: 'ti ti-checklist' }
          ]
        }
      ]
    },
    {
      title: 'ATTENDANCE',
      items: [
        { label: 'My Attendance', path: '/attendance/staff', icon: 'ti ti-checklist' }
      ]
    },
    {
      title: 'COMMUNICATION',
      items: [
        { label: 'Notice Board', path: '/notice-board', icon: 'ti ti-bell' },
        { label: 'Events', path: '/events', icon: 'ti ti-calendar-event' },
        { label: 'Messages', path: '/messages', icon: 'ti ti-message' }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Attendance Report', path: '/reports/attendance', icon: 'ti ti-file' }
      ]
    }
  ]
}

// Helper function to get sidebar menu for a role
export const getSidebarMenu = (roleId: string): MenuSection[] => {
  return SIDEBAR_MENUS[roleId] || SIDEBAR_MENUS.SCHOOL_ADMIN
}

// Helper function to flatten menu items for permission checking
export const getFlatMenuItems = (roleId: string): string[] => {
  const menu = getSidebarMenu(roleId)
  const items: string[] = []

  const flatten = (menuItems: MenuItem[]) => {
    menuItems.forEach(item => {
      items.push(item.path)
      if (item.children) {
        flatten(item.children)
      }
    })
  }

  menu.forEach(section => flatten(section.items))
  return items
}
