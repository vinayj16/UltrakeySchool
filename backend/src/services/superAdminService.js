import PlatformHealth from '../models/PlatformHealth.js';
import AdminAlert from '../models/AdminAlert.js';
import AdminActivity from '../models/AdminActivity.js';
import SuperAdminMenuItem from '../models/SuperAdminMenuItem.js';
import User from '../models/User.js';
import School from '../models/School.js';
import os from 'os';

class SuperAdminService {
  async getPlatformHealth() {
    let health = await PlatformHealth.findOne().sort({ createdAt: -1 });
    
    if (!health || (Date.now() - health.lastChecked.getTime()) > 60000) {
      const activeUsers = await User.countDocuments({ isActive: true });
      const totalSchools = await School.countDocuments();
      const pendingTickets = 0;
      
      const cpuUsage = os.loadavg()[0] * 10;
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;
      
      const healthData = {
        serverStatus: 'online',
        databaseStatus: 'healthy',
        apiStatus: 'operational',
        uptime: '99.99%',
        activeUsers,
        totalSchools,
        pendingTickets,
        cpuUsage: Math.round(cpuUsage),
        memoryUsage: Math.round(memoryUsage),
        diskUsage: 0,
        responseTime: 0,
        errorRate: 0,
        lastChecked: new Date()
      };
      
      health = await PlatformHealth.create(healthData);
    }
    
    return health;
  }

  async updatePlatformHealth(updates) {
    const health = await PlatformHealth.findOneAndUpdate(
      {},
      { $set: { ...updates, lastChecked: new Date() } },
      { new: true, upsert: true }
    );
    return health;
  }

  async getAlerts(filters = {}) {
    const query = { isActive: true, ...filters };
    
    const alerts = await AdminAlert.find(query)
      .populate('acknowledgedBy', 'name email')
      .populate('actionTakenBy', 'name email')
      .sort({ severity: -1, createdAt: -1 })
      .limit(50);
    
    return alerts;
  }

  async createAlert(alertData) {
    const alert = await AdminAlert.create(alertData);
    return alert;
  }

  async acknowledgeAlert(alertId, userId) {
    const alert = await AdminAlert.findById(alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }
    return await alert.acknowledge(userId);
  }

  async takeAlertAction(alertId, userId) {
    const alert = await AdminAlert.findById(alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }
    return await alert.takeAction(userId);
  }

  async deleteAlert(alertId) {
    const alert = await AdminAlert.findByIdAndUpdate(
      alertId,
      { isActive: false },
      { new: true }
    );
    return alert;
  }

  async getActivities(filters = {}, limit = 50) {
    const query = { ...filters };
    
    const activities = await AdminActivity.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return activities;
  }

  async logActivity(activityData) {
    const activity = await AdminActivity.create(activityData);
    return activity;
  }

  async getMenuItems(filters = {}) {
    const query = { isActive: true, ...filters };
    
    const menuItems = await SuperAdminMenuItem.find(query)
      .sort({ category: 1, order: 1 });
    
    return menuItems;
  }

  async createMenuItem(menuItemData, userId) {
    const menuItem = await SuperAdminMenuItem.create({
      ...menuItemData,
      isCustom: true,
      createdBy: userId
    });
    return menuItem;
  }

  async updateMenuItem(menuItemId, updates) {
    const menuItem = await SuperAdminMenuItem.findByIdAndUpdate(
      menuItemId,
      { $set: updates },
      { new: true, runValidators: true }
    );
    return menuItem;
  }

  async deleteMenuItem(menuItemId) {
    const menuItem = await SuperAdminMenuItem.findByIdAndUpdate(
      menuItemId,
      { isActive: false },
      { new: true }
    );
    return menuItem;
  }

  async getInstitutions(filters = {}) {
    const query = {};
    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;
    if (filters.code) query.code = filters.code;

    const schools = await School.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return schools.map((school) => ({
      _id: school._id,
      name: school.name,
      type: school.type,
      plan: school.plan,
      status: school.status,
      subscriptionExpiry: school.expiryDate,
      autoRenew: school.subscription?.autoRenewal ?? false,
      lastPaymentDate: school.subscription?.lastPaymentDate
        ? school.subscription.lastPaymentDate.toISOString().split('T')[0]
        : null,
      nextPaymentDate: school.subscription?.nextPaymentDate
        ? school.subscription.nextPaymentDate.toISOString().split('T')[0]
        : null,
      overdueAmount: school.outstandingPayments || 0,
      contactEmail: school.contact?.email,
      contactPhone: school.contact?.phone,
      totalStudents: school.totalStudents,
      monthlyRevenue: school.monthlyRevenue,
      totalRevenue: school.totalRevenue,
      code: school.code
    }));
  }

  async getSuperAdminData() {
    const [platformHealth, alerts, activities, menuItems] = await Promise.all([
      this.getPlatformHealth(),
      this.getAlerts({ type: { $in: ['critical', 'warning'] } }),
      this.getActivities({}, 10),
      this.getMenuItems()
    ]);

    const quickActions = [
      {
        id: 'restart-server',
        label: 'Restart Server',
        icon: 'ti ti-reload',
        category: 'maintenance',
        shortcut: 'Ctrl+R'
      },
      {
        id: 'clear-cache',
        label: 'Clear Cache',
        icon: 'ti ti-trash',
        category: 'maintenance'
      },
      {
        id: 'emergency-shutdown',
        label: 'Emergency Shutdown',
        icon: 'ti ti-power',
        category: 'emergency'
      }
    ];

    return {
      menuItems: menuItems.map(item => ({
        id: item.id,
        to: item.to,
        label: item.label,
        icon: item.icon,
        badge: item.badge,
        category: item.category,
        permissions: item.permissions
      })),
      platformHealth: {
        serverStatus: platformHealth.serverStatus,
        databaseStatus: platformHealth.databaseStatus,
        apiStatus: platformHealth.apiStatus,
        uptime: platformHealth.uptime,
        activeUsers: platformHealth.activeUsers,
        totalSchools: platformHealth.totalSchools,
        pendingTickets: platformHealth.pendingTickets,
        lastUpdated: platformHealth.lastChecked
      },
      alerts: alerts.map(alert => ({
        id: alert._id.toString(),
        type: alert.type,
        title: alert.title,
        message: alert.message,
        timestamp: alert.createdAt,
        acknowledged: alert.acknowledged,
        actionRequired: alert.actionRequired,
        actionUrl: alert.actionUrl
      })),
      recentActivities: activities.map(activity => ({
        id: activity._id.toString(),
        action: activity.action,
        resource: activity.resource,
        timestamp: activity.createdAt,
        user: activity.userName,
        ipAddress: activity.ipAddress,
        severity: activity.severity
      })),
      quickActions
    };
  }

  async getDashboardStats() {
    const [
      totalSchools,
      activeSchools,
      totalUsers,
      activeUsers,
      criticalAlerts,
      pendingTickets
    ] = await Promise.all([
      School.countDocuments(),
      School.countDocuments({ isActive: true }),
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      AdminAlert.countDocuments({ type: 'critical', acknowledged: false, isActive: true }),
      AdminAlert.countDocuments({ type: 'warning', actionRequired: true, actionTaken: false, isActive: true })
    ]);

    return {
      totalSchools,
      activeSchools,
      inactiveSchools: totalSchools - activeSchools,
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      criticalAlerts,
      pendingTickets
    };
  }

  async getSystemMetrics() {
    const health = await this.getPlatformHealth();
    
    return {
      cpu: {
        usage: health.cpuUsage,
        cores: os.cpus().length
      },
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem(),
        usagePercent: health.memoryUsage
      },
      uptime: {
        system: os.uptime(),
        process: process.uptime()
      },
      platform: {
        type: os.type(),
        release: os.release(),
        arch: os.arch()
      }
    };
  }
}

export default new SuperAdminService();
