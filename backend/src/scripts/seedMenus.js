import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import MenuCustomizationRole from '../models/MenuCustomizationRole.js';
import School from '../models/School.js';

dotenv.config();

const seedMenus = async () => {
  try {
    await connectDB();

    await MenuCustomizationRole.deleteMany({});
    console.log('Cleared existing menu customizations');

    const schools = await School.find().limit(3);

    const defaultMenus = [];

    const roles = [
      'super_admin',
      'school_admin',
      'teacher',
      'student',
      'parent',
      'accountant',
      'hr',
      'librarian',
      'transport_manager',
      'hostel_warden'
    ];

    for (const roleId of roles) {
      defaultMenus.push({
        roleId,
        schoolId: null,
        menuSections: getDefaultMenuForRole(roleId),
        hiddenMenuItems: [],
        customMenuItems: [],
        quickActions: getDefaultQuickActionsForRole(roleId),
        isDefault: true
      });
    }

    if (schools.length > 0) {
      for (const school of schools) {
        defaultMenus.push({
          roleId: 'school_admin',
          schoolId: school._id,
          menuSections: getDefaultMenuForRole('school_admin'),
          hiddenMenuItems: [],
          customMenuItems: [
            {
              label: `${school.name} Reports`,
              path: `/schools/${school._id}/reports`,
              icon: 'ti ti-file-analytics',
              moduleKey: 'REPORTS',
              isCustom: true,
              order: 100
            }
          ],
          quickActions: getDefaultQuickActionsForRole('school_admin'),
          isDefault: false
        });
      }
    }

    await MenuCustomizationRole.insertMany(defaultMenus);

    console.log(`✓ Created ${defaultMenus.length} menu customizations`);
    console.log('Menu seeding completed successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding menus:', error);
    process.exit(1);
  }
};

function getDefaultMenuForRole(roleId) {
  const menus = {
    super_admin: [
      {
        title: 'PLATFORM DASHBOARD',
        order: 1,
        items: [
          {
            label: 'Dashboard',
            path: '/super-admin/dashboard',
            icon: 'ti ti-layout-dashboard',
            moduleKey: 'PLATFORM_ADMIN'
          },
          {
            label: 'Analytics',
            path: '/super-admin/analytics',
            icon: 'ti ti-chart-line',
            moduleKey: 'PLATFORM_ADMIN'
          }
        ]
      },
      {
        title: 'SUBSCRIPTIONS & BILLING',
        order: 2,
        items: [
          {
            label: 'Plans & Pricing',
            path: '/super-admin/memberships',
            icon: 'ti ti-crown',
            moduleKey: 'MEMBERSHIP'
          },
          {
            label: 'Transactions',
            path: '/super-admin/transactions',
            icon: 'ti ti-report-money',
            moduleKey: 'MEMBERSHIP'
          }
        ]
      }
    ],
    school_admin: [
      {
        title: 'MAIN DASHBOARD',
        order: 1,
        items: [
          {
            label: 'Dashboard',
            path: '/dashboard/main',
            icon: 'ti ti-layout-dashboard',
            moduleKey: 'DASHBOARDS'
          }
        ]
      },
      {
        title: 'PEOPLE MANAGEMENT',
        order: 2,
        items: [
          {
            label: 'Students',
            path: '/students',
            icon: 'ti ti-users',
            moduleKey: 'STUDENTS'
          },
          {
            label: 'Teachers',
            path: '/teachers',
            icon: 'ti ti-chalkboard-user',
            moduleKey: 'TEACHERS'
          }
        ]
      }
    ],
    teacher: [
      {
        title: 'MAIN',
        order: 1,
        items: [
          {
            label: 'Dashboard',
            path: '/dashboard/teacher',
            icon: 'ti ti-dashboard',
            moduleKey: 'DASHBOARDS'
          }
        ]
      },
      {
        title: 'ACADEMIC',
        order: 2,
        items: [
          {
            label: 'Classes',
            path: '/class',
            icon: 'ti ti-building',
            moduleKey: 'ACADEMICS'
          },
          {
            label: 'Students',
            path: '/students',
            icon: 'ti ti-users',
            moduleKey: 'STUDENTS'
          }
        ]
      }
    ],
    student: [
      {
        title: 'MAIN',
        order: 1,
        items: [
          {
            label: 'Dashboard',
            path: '/dashboard/student',
            icon: 'ti ti-dashboard',
            moduleKey: 'DASHBOARDS'
          }
        ]
      },
      {
        title: 'ACADEMIC',
        order: 2,
        items: [
          {
            label: 'My Timetable',
            path: '/students/timetable',
            icon: 'ti ti-calendar-time',
            moduleKey: 'ACADEMICS'
          },
          {
            label: 'My Attendance',
            path: '/attendance/student',
            icon: 'ti ti-checklist',
            moduleKey: 'ATTENDANCE'
          }
        ]
      }
    ],
    parent: [
      {
        title: 'MAIN',
        order: 1,
        items: [
          {
            label: 'Dashboard',
            path: '/dashboard/parent',
            icon: 'ti ti-dashboard',
            moduleKey: 'DASHBOARDS'
          }
        ]
      },
      {
        title: 'CHILDREN',
        order: 2,
        items: [
          {
            label: 'My Children',
            path: '/parents/children',
            icon: 'ti ti-users',
            moduleKey: 'STUDENTS'
          }
        ]
      }
    ],
    accountant: [
      {
        title: 'MAIN',
        order: 1,
        items: [
          {
            label: 'Dashboard',
            path: '/dashboard/finance',
            icon: 'ti ti-dashboard',
            moduleKey: 'DASHBOARDS'
          }
        ]
      },
      {
        title: 'FINANCE',
        order: 2,
        items: [
          {
            label: 'Fees',
            path: '/fees/collect',
            icon: 'ti ti-cash',
            moduleKey: 'FEES'
          },
          {
            label: 'Accounts',
            path: '/accounts/expenses',
            icon: 'ti ti-chart-pie',
            moduleKey: 'ACCOUNTS'
          }
        ]
      }
    ],
    hr: [
      {
        title: 'MAIN',
        order: 1,
        items: [
          {
            label: 'Dashboard',
            path: '/dashboard/hr',
            icon: 'ti ti-dashboard',
            moduleKey: 'DASHBOARDS'
          }
        ]
      },
      {
        title: 'HR MANAGEMENT',
        order: 2,
        items: [
          {
            label: 'Staff',
            path: '/staffs',
            icon: 'ti ti-users-group',
            moduleKey: 'HR_PAYROLL'
          },
          {
            label: 'Payroll',
            path: '/payroll',
            icon: 'ti ti-cash',
            moduleKey: 'HR_PAYROLL'
          }
        ]
      }
    ],
    librarian: [
      {
        title: 'MAIN',
        order: 1,
        items: [
          {
            label: 'Dashboard',
            path: '/dashboard/library',
            icon: 'ti ti-dashboard',
            moduleKey: 'DASHBOARDS'
          }
        ]
      },
      {
        title: 'LIBRARY',
        order: 2,
        items: [
          {
            label: 'Books',
            path: '/library/books',
            icon: 'ti ti-book',
            moduleKey: 'LIBRARY'
          },
          {
            label: 'Members',
            path: '/library/members',
            icon: 'ti ti-users',
            moduleKey: 'LIBRARY'
          }
        ]
      }
    ],
    transport_manager: [
      {
        title: 'MAIN',
        order: 1,
        items: [
          {
            label: 'Dashboard',
            path: '/dashboard/transport',
            icon: 'ti ti-dashboard',
            moduleKey: 'DASHBOARDS'
          }
        ]
      },
      {
        title: 'TRANSPORT',
        order: 2,
        items: [
          {
            label: 'Routes',
            path: '/transport/routes',
            icon: 'ti ti-route',
            moduleKey: 'TRANSPORT'
          },
          {
            label: 'Vehicles',
            path: '/transport/vehicles',
            icon: 'ti ti-car',
            moduleKey: 'TRANSPORT'
          }
        ]
      }
    ],
    hostel_warden: [
      {
        title: 'MAIN',
        order: 1,
        items: [
          {
            label: 'Dashboard',
            path: '/dashboard/hostel',
            icon: 'ti ti-dashboard',
            moduleKey: 'DASHBOARDS'
          }
        ]
      },
      {
        title: 'HOSTEL',
        order: 2,
        items: [
          {
            label: 'Rooms',
            path: '/hostel/rooms',
            icon: 'ti ti-door',
            moduleKey: 'HOSTEL'
          },
          {
            label: 'Residents',
            path: '/hostel/residents',
            icon: 'ti ti-users',
            moduleKey: 'HOSTEL'
          }
        ]
      }
    ]
  };

  return menus[roleId] || [];
}

function getDefaultQuickActionsForRole(roleId) {
  const quickActions = {
    super_admin: [
      {
        id: 'add-institution',
        label: 'Add Institution',
        icon: 'ti ti-plus',
        path: '/super-admin/institutions/add',
        category: 'frequent',
        enabled: true,
        order: 1
      }
    ],
    school_admin: [
      {
        id: 'add-student',
        label: 'Add Student',
        icon: 'ti ti-user-plus',
        path: '/students/add',
        shortcut: 'Ctrl+N',
        category: 'frequent',
        enabled: true,
        order: 1
      },
      {
        id: 'add-teacher',
        label: 'Add Teacher',
        icon: 'ti ti-user-plus',
        path: '/teachers/add',
        category: 'frequent',
        enabled: true,
        order: 2
      }
    ],
    teacher: [
      {
        id: 'mark-attendance',
        label: 'Mark Attendance',
        icon: 'ti ti-checklist',
        path: '/attendance/student',
        shortcut: 'Ctrl+A',
        category: 'frequent',
        enabled: true,
        order: 1
      }
    ],
    accountant: [
      {
        id: 'collect-fees',
        label: 'Collect Fees',
        icon: 'ti ti-cash',
        path: '/fees/collect',
        shortcut: 'Ctrl+F',
        category: 'frequent',
        enabled: true,
        order: 1
      }
    ]
  };

  return quickActions[roleId] || [];
}

seedMenus();
