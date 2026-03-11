import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PlatformHealth from '../models/PlatformHealth.js';
import AdminAlert from '../models/AdminAlert.js';
import AdminActivity from '../models/AdminActivity.js';
import SuperAdminMenuItem from '../models/SuperAdminMenuItem.js';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduadmin';

const seedSuperAdminData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await PlatformHealth.deleteMany({});
    await AdminAlert.deleteMany({});
    await AdminActivity.deleteMany({});
    await SuperAdminMenuItem.deleteMany({});
    console.log('Cleared existing super admin data');

    const users = await User.find().limit(1);
    if (users.length === 0) {
      console.log('No users found. Please seed users first.');
      process.exit(1);
    }
    const superAdmin = users[0];

    const platformHealth = await PlatformHealth.create({
      serverStatus: 'online',
      databaseStatus: 'healthy',
      apiStatus: 'operational',
      uptime: '99.99%',
      activeUsers: 1247,
      totalSchools: 89,
      pendingTickets: 15,
      cpuUsage: 45,
      memoryUsage: 62,
      diskUsage: 38,
      responseTime: 120,
      errorRate: 0.02,
      lastChecked: new Date()
    });
    console.log('Created platform health record');

    const alerts = [
      {
        type: 'critical',
        title: 'Subscription Expiring',
        message: '3 schools have subscriptions expiring within 24 hours',
        acknowledged: false,
        actionRequired: true,
        actionUrl: '/super-admin/alerts',
        severity: 9,
        relatedResource: {
          resourceType: 'subscription'
        },
        isActive: true
      },
      {
        type: 'warning',
        title: 'Scheduled Maintenance',
        message: 'Server maintenance scheduled for tonight 2:00 AM',
        acknowledged: false,
        actionRequired: false,
        severity: 5,
        relatedResource: {
          resourceType: 'system'
        },
        isActive: true
      },
      {
        type: 'info',
        title: 'New School Registration',
        message: '5 new schools registered today',
        acknowledged: true,
        acknowledgedBy: superAdmin._id,
        acknowledgedAt: new Date(Date.now() - 3600000),
        actionRequired: false,
        severity: 3,
        relatedResource: {
          resourceType: 'school'
        },
        isActive: true
      },
      {
        type: 'warning',
        title: 'High Server Load',
        message: 'Server CPU usage above 80% for the last 30 minutes',
        acknowledged: false,
        actionRequired: true,
        actionUrl: '/super-admin/system/metrics',
        severity: 7,
        relatedResource: {
          resourceType: 'system'
        },
        isActive: true
      }
    ];

    await AdminAlert.insertMany(alerts);
    console.log(`Created ${alerts.length} admin alerts`);

    const activities = [
      {
        action: 'Created School',
        resource: 'Green Valley High School',
        resourceType: 'school',
        user: superAdmin._id,
        userName: 'Super Admin',
        ipAddress: '192.168.1.100',
        severity: 'medium',
        status: 'success',
        details: {
          schoolName: 'Green Valley High School',
          location: 'New York'
        }
      },
      {
        action: 'Updated Subscription',
        resource: 'Premium Plan',
        resourceType: 'subscription',
        user: superAdmin._id,
        userName: 'Super Admin',
        ipAddress: '192.168.1.100',
        severity: 'low',
        status: 'success',
        details: {
          plan: 'Premium',
          duration: '1 year'
        }
      },
      {
        action: 'Resolved Ticket',
        resource: 'Ticket #1234',
        resourceType: 'ticket',
        user: superAdmin._id,
        userName: 'Super Admin',
        ipAddress: '192.168.1.100',
        severity: 'low',
        status: 'success',
        details: {
          ticketId: '1234',
          issue: 'Login problem'
        }
      },
      {
        action: 'Enabled Module',
        resource: 'Attendance Module',
        resourceType: 'module',
        user: superAdmin._id,
        userName: 'Super Admin',
        ipAddress: '192.168.1.100',
        severity: 'medium',
        status: 'success',
        details: {
          moduleName: 'Attendance',
          schoolId: 'school123'
        }
      },
      {
        action: 'Updated Platform Settings',
        resource: 'Email Configuration',
        resourceType: 'setting',
        user: superAdmin._id,
        userName: 'Super Admin',
        ipAddress: '192.168.1.100',
        severity: 'high',
        status: 'success',
        details: {
          setting: 'email_smtp',
          changes: 'Updated SMTP server'
        }
      }
    ];

    await AdminActivity.insertMany(activities);
    console.log(`Created ${activities.length} admin activities`);

    const menuItems = [
      { id: 'dashboard', to: '/super-admin/dashboard', label: 'Dashboard', icon: 'ti ti-layout-dashboard', category: 'platform', badge: '12', order: 1, isActive: true },
      { id: 'schools', to: '/super-admin/institutions/schools', label: 'Schools', icon: 'ti ti-building-bank', category: 'platform', order: 2, isActive: true },
      { id: 'memberships', to: '/super-admin/memberships', label: 'Subscriptions / Plans', icon: 'ti ti-crown', category: 'platform', badge: '3', order: 3, isActive: true },
      { id: 'transactions', to: '/super-admin/transactions', label: 'Transactions', icon: 'ti ti-report-money', category: 'platform', order: 4, isActive: true },
      { id: 'tickets', to: '/super-admin/tickets', label: 'Support / Tickets', icon: 'ti ti-ticket', category: 'platform', badge: '5', order: 5, isActive: true },
      { id: 'analytics', to: '/super-admin/analytics', label: 'Analytics', icon: 'ti ti-chart-line', category: 'analytics', order: 6, isActive: true },
      { id: 'modules', to: '/super-admin/modules', label: 'Modules Control', icon: 'ti ti-puzzle', category: 'platform', order: 7, isActive: true },
      { id: 'audit-logs', to: '/super-admin/audit-logs', label: 'Audit Logs', icon: 'ti ti-shield-check', category: 'security', order: 8, isActive: true },
      { id: 'impersonate', to: '/super-admin/impersonate', label: 'Impersonate School', icon: 'ti ti-user-switch', category: 'platform', order: 9, isActive: true },
      { id: 'alerts', to: '/super-admin/alerts', label: 'Expiry & Alerts', icon: 'ti ti-alert-triangle', category: 'platform', badge: '2', order: 10, isActive: true },
      { id: 'settings', to: '/super-admin/settings', label: 'Platform Settings', icon: 'ti ti-settings', category: 'platform', order: 11, isActive: true }
    ];

    await SuperAdminMenuItem.insertMany(menuItems);
    console.log(`Created ${menuItems.length} menu items`);

    console.log('Super admin data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding super admin data:', error);
    process.exit(1);
  }
};

seedSuperAdminData();
