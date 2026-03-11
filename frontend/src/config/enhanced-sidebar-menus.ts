/**
 * Enhanced Sidebar Menu Configuration for Different Roles
 * Removed duplicates and cleaned up structure
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

export const ENHANCED_SIDEBAR_MENUS: Record<string, MenuSection[]> = {
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
        { label: 'Platform Users', path: '/super-admin/platform-users', icon: 'ti ti-users' },
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
          path: '/applications',
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
      ]
    },

    {
      title: 'USER MANAGEMENT',
      items: [
        { label: 'Pending Requests', path: '/user-management/pending-requests', icon: 'ti ti-user-plus' },
        { label: 'Create User Credentials', path: '/user-management/create-credentials', icon: 'ti ti-user-check' },
        { label: 'User Directory', path: '/user-management/directory', icon: 'ti ti-users' }
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
        { label: 'Homework', path: '/homework', icon: 'ti ti-pencil' }
      ]
    },

    {
      title: 'MANAGEMENT',
      items: [
        {
          label: 'Fees Collection',
          path: '/fees',
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
          path: '/library',
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
          path: '/hostel',
          icon: 'ti ti-building',
          children: [
            { label: 'Hostel List', path: '/hostel/list', icon: 'ti ti-list' },
            { label: 'Rooms', path: '/hostel/rooms', icon: 'ti ti-door' },
            { label: 'Room Types', path: '/hostel/room-types', icon: 'ti ti-layout-kanban' }
          ]
        },
        {
          label: 'Transport',
          path: '/transport',
          icon: 'ti ti-car',
          children: [
            { label: 'Routes', path: '/transport/routes', icon: 'ti ti-list' },
            { label: 'Pickup Points', path: '/transport/pickup-points', icon: 'ti ti-map-pin' },
            { label: 'Vehicles', path: '/transport/vehicles', icon: 'ti ti-car' },
            { label: 'Drivers', path: '/transport/drivers', icon: 'ti ti-users' },
            { label: 'Assign Vehicle', path: '/transport/assign-vehicle', icon: 'ti ti-link' }
          ]
        }
      ]
    },

    {
      title: 'APPLICATIONS',
      items: [
        {
          label: 'Applications',
          path: '/applications',
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
      title: 'SETTINGS',
      items: [
        { label: 'General Settings', path: '/settings/general', icon: 'ti ti-settings' },
        { label: 'Academic Settings', path: '/settings/academic', icon: 'ti ti-school' },
        { label: 'System Settings', path: '/settings/system', icon: 'ti ti-server' },
        { label: 'Security Settings', path: '/settings/security', icon: 'ti ti-shield' },
        { label: 'Backup & Restore', path: '/settings/backup', icon: 'ti ti-database' }
      ]
    }
  ]
}

export const getEnhancedSidebarMenu = (roleId: string): MenuSection[] => {
  // Map role variations to correct sidebar key
  const roleMapping: Record<string, string> = {
    'institution_admin': 'INSTITUTION_ADMIN',
    'school_admin': 'SCHOOL_ADMIN',
    'superadmin': 'SUPER_ADMIN',
    'principal': 'PRINCIPAL',
    'teacher': 'TEACHER',
    'student': 'STUDENT',
    'parent': 'PARENT',
    'staff': 'STAFF',
    'hrm': 'HRM',
    'finance': 'FINANCE',
    'librarian': 'LIBRARIAN'
  }

  const normalizedRole = roleMapping[roleId.toLowerCase()] || roleId.toUpperCase()
  
  return ENHANCED_SIDEBAR_MENUS[normalizedRole] || []
}
