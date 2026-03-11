import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SidebarPreference from '../models/SidebarPreference.js';
import MenuCustomization from '../models/MenuCustomization.js';
import User from '../models/User.js';
import School from '../models/School.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduadmin';

const seedSidebarData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await SidebarPreference.deleteMany({});
    await MenuCustomization.deleteMany({});
    console.log('Cleared existing sidebar data');

    const schools = await School.find().limit(1);
    const users = await User.find().limit(3);

    if (schools.length === 0 || users.length === 0) {
      console.log('No schools or users found. Please seed users and schools first.');
      process.exit(1);
    }

    const school = schools[0];

    const sidebarPreferences = users.map((user, index) => ({
      userId: user._id,
      schoolId: school._id,
      isCollapsed: index === 0,
      pinnedItems: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          path: '/',
          icon: 'ti ti-layout-dashboard',
          order: 0
        }
      ],
      recentItems: [
        {
          id: 'recent-1',
          label: 'Student Dashboard',
          path: '/student-dashboard',
          icon: 'ti ti-layout-dashboard',
          lastAccessed: new Date(Date.now() - 3600000)
        },
        {
          id: 'recent-2',
          label: 'Collect Fees',
          path: '/collect-fees',
          icon: 'ti ti-report-money',
          lastAccessed: new Date(Date.now() - 7200000)
        },
        {
          id: 'recent-3',
          label: 'Student List',
          path: '/students',
          icon: 'ti ti-school',
          lastAccessed: new Date(Date.now() - 10800000)
        }
      ],
      bookmarks: [
        {
          id: 'bookmark-1',
          label: 'Dashboard',
          path: '/',
          icon: 'ti ti-layout-dashboard',
          addedAt: new Date(Date.now() - 86400000)
        },
        {
          id: 'bookmark-2',
          label: 'Calendar',
          path: '/calendar',
          icon: 'ti ti-calendar',
          addedAt: new Date(Date.now() - 172800000)
        },
        {
          id: 'bookmark-3',
          label: 'Students',
          path: '/students',
          icon: 'ti ti-school',
          addedAt: new Date(Date.now() - 259200000)
        }
      ],
      quickActions: [
        {
          id: 'add-student',
          label: 'Add Student',
          icon: 'ti ti-user-plus',
          shortcut: 'Ctrl+N',
          category: 'frequent',
          order: 0,
          enabled: true
        },
        {
          id: 'view-reports',
          label: 'View Reports',
          icon: 'ti ti-chart-bar',
          category: 'frequent',
          order: 1,
          enabled: true
        },
        {
          id: 'schedule-meeting',
          label: 'Schedule Meeting',
          icon: 'ti ti-calendar-plus',
          category: 'recent',
          order: 2,
          enabled: true
        },
        {
          id: 'send-notification',
          label: 'Send Notification',
          icon: 'ti ti-bell',
          category: 'custom',
          order: 3,
          enabled: index !== 1
        }
      ],
      hiddenMenuItems: index === 2 ? ['multi-level'] : [],
      expandedMenus: ['dashboards', 'application'],
      theme: ['light', 'dark', 'auto'][index % 3],
      sidebarWidth: 260,
      maxRecentItems: 5,
      showQuickActions: true,
      showRecentItems: true,
      showBookmarks: true
    }));

    await SidebarPreference.insertMany(sidebarPreferences);
    console.log(`Created ${sidebarPreferences.length} sidebar preferences`);

    const roles = ['superadmin', 'admin', 'teacher', 'student'];
    const menuCustomizations = roles.map(role => ({
      schoolId: school._id,
      role,
      menuItems: [],
      customMenuItems: role === 'admin' ? [
        {
          id: 'custom-reports',
          label: 'Custom Reports',
          icon: 'ti ti-file-analytics',
          to: '/custom-reports',
          order: 0,
          section: 'Reports',
          permissions: ['view_reports'],
          createdBy: users[0]._id,
          createdAt: new Date()
        }
      ] : [],
      hiddenSections: role === 'student' ? ['HRM', 'Finance & Accounts'] : [],
      isActive: true
    }));

    await MenuCustomization.insertMany(menuCustomizations);
    console.log(`Created ${menuCustomizations.length} menu customizations`);

    console.log('Sidebar data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding sidebar data:', error);
    process.exit(1);
  }
};

seedSidebarData();
