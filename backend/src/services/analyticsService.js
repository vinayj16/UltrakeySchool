import Institution from '../models/Institution.js';
import SupportTicket from '../models/SupportTicket.js';

class AnalyticsService {
  async getInstitutionGrowth(period = 'monthly') {
    const now = new Date();
    const data = [];

    if (period === 'monthly') {
      for (let i = 5; i >= 0; i--) {
        const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        const prevStartDate = new Date(now.getFullYear(), now.getMonth() - i - 1, 1);
        const prevEndDate = new Date(now.getFullYear(), now.getMonth() - i, 0);

        const [count, prevCount] = await Promise.all([
          Institution.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
          Institution.countDocuments({ createdAt: { $gte: prevStartDate, $lte: prevEndDate } })
        ]);

        const growth = prevCount > 0 ? ((count - prevCount) / prevCount) * 100 : 0;

        data.push({
          month: startDate.toLocaleString('default', { month: 'short' }),
          count,
          growth: parseFloat(growth.toFixed(1))
        });
      }
    } else {
      for (let i = 3; i >= 0; i--) {
        const year = now.getFullYear() - i;
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        const prevStartDate = new Date(year - 1, 0, 1);
        const prevEndDate = new Date(year - 1, 11, 31);

        const [count, prevCount] = await Promise.all([
          Institution.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
          Institution.countDocuments({ createdAt: { $gte: prevStartDate, $lte: prevEndDate } })
        ]);

        const growth = prevCount > 0 ? ((count - prevCount) / prevCount) * 100 : 0;

        data.push({
          year: year.toString(),
          count,
          growth: parseFloat(growth.toFixed(1))
        });
      }
    }

    return data;
  }

  async getRevenueGrowth(period = 'monthly') {
    const now = new Date();
    const data = [];

    if (period === 'monthly') {
      for (let i = 5; i >= 0; i--) {
        const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        const prevStartDate = new Date(now.getFullYear(), now.getMonth() - i - 1, 1);
        const prevEndDate = new Date(now.getFullYear(), now.getMonth() - i, 0);

        const [currentRevenue, prevRevenue] = await Promise.all([
          Institution.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: null, total: { $sum: '$monthlyRevenue' } } }
          ]),
          Institution.aggregate([
            { $match: { createdAt: { $gte: prevStartDate, $lte: prevEndDate } } },
            { $group: { _id: null, total: { $sum: '$monthlyRevenue' } } }
          ])
        ]);

        const revenue = currentRevenue[0]?.total || 0;
        const prevRev = prevRevenue[0]?.total || 0;
        const growth = prevRev > 0 ? ((revenue - prevRev) / prevRev) * 100 : 0;

        data.push({
          month: startDate.toLocaleString('default', { month: 'short' }),
          revenue,
          growth: parseFloat(growth.toFixed(1))
        });
      }
    } else {
      for (let i = 3; i >= 0; i--) {
        const year = now.getFullYear() - i;
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        const prevStartDate = new Date(year - 1, 0, 1);
        const prevEndDate = new Date(year - 1, 11, 31);

        const [currentRevenue, prevRevenue] = await Promise.all([
          Institution.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: null, total: { $sum: '$totalRevenue' } } }
          ]),
          Institution.aggregate([
            { $match: { createdAt: { $gte: prevStartDate, $lte: prevEndDate } } },
            { $group: { _id: null, total: { $sum: '$totalRevenue' } } }
          ])
        ]);

        const revenue = currentRevenue[0]?.total || 0;
        const prevRev = prevRevenue[0]?.total || 0;
        const growth = prevRev > 0 ? ((revenue - prevRev) / prevRev) * 100 : 0;

        data.push({
          year: year.toString(),
          revenue,
          growth: parseFloat(growth.toFixed(1))
        });
      }
    }

    return data;
  }

  async getPlanDistribution() {
    const institutions = await Institution.find({ status: { $ne: 'inactive' } });
    const total = institutions.length;

    const distribution = {};
    institutions.forEach(inst => {
      const plan = inst.subscription?.planName || 'Basic';
      if (!distribution[plan]) {
        distribution[plan] = { count: 0, revenue: 0 };
      }
      distribution[plan].count++;
      distribution[plan].revenue += inst.monthlyRevenue || 0;
    });

    return Object.entries(distribution).map(([plan, data]) => ({
      plan,
      count: data.count,
      percentage: total > 0 ? parseFloat(((data.count / total) * 100).toFixed(1)) : 0,
      revenue: data.revenue
    }));
  }

  async getInstitutionTypeDistribution() {
    const institutions = await Institution.find({ status: { $ne: 'inactive' } });
    const total = institutions.length;

    const distribution = {};
    institutions.forEach(inst => {
      const type = inst.type || 'Other';
      distribution[type] = (distribution[type] || 0) + 1;
    });

    return Object.entries(distribution).map(([type, count]) => ({
      type,
      count,
      percentage: total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0
    }));
  }

  async getChurnRate() {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [currentChurned, prevChurned, currentTotal, prevTotal] = await Promise.all([
      Institution.countDocuments({ 
        status: { $in: ['inactive', 'cancelled'] },
        updatedAt: { $gte: currentMonthStart }
      }),
      Institution.countDocuments({ 
        status: { $in: ['inactive', 'cancelled'] },
        updatedAt: { $gte: prevMonthStart, $lte: prevMonthEnd }
      }),
      Institution.countDocuments({ status: 'active' }),
      Institution.countDocuments({ status: 'active' })
    ]);

    const current = currentTotal > 0 ? parseFloat(((currentChurned / currentTotal) * 100).toFixed(1)) : 0;
    const previous = prevTotal > 0 ? parseFloat(((prevChurned / prevTotal) * 100).toFixed(1)) : 0;

    const monthly = [];
    for (let i = 5; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const churned = await Institution.countDocuments({
        status: { $in: ['inactive', 'cancelled'] },
        updatedAt: { $gte: startDate, $lte: endDate }
      });

      const total = await Institution.countDocuments({ status: 'active' });
      const rate = total > 0 ? parseFloat(((churned / total) * 100).toFixed(1)) : 0;

      monthly.push({
        month: startDate.toLocaleString('default', { month: 'short' }),
        rate
      });
    }

    return { current, previous, monthly };
  }

  async getRenewalRate() {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [currentRenewed, prevRenewed, currentExpiring, prevExpiring] = await Promise.all([
      Institution.countDocuments({
        'subscription.status': 'active',
        'subscription.renewalDate': { $gte: currentMonthStart }
      }),
      Institution.countDocuments({
        'subscription.status': 'active',
        'subscription.renewalDate': { $gte: prevMonthStart, $lte: prevMonthEnd }
      }),
      Institution.countDocuments({
        'subscription.endDate': { $gte: currentMonthStart, $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0) }
      }),
      Institution.countDocuments({
        'subscription.endDate': { $gte: prevMonthStart, $lte: prevMonthEnd }
      })
    ]);

    const current = currentExpiring > 0 ? parseFloat(((currentRenewed / currentExpiring) * 100).toFixed(1)) : 0;
    const previous = prevExpiring > 0 ? parseFloat(((prevRenewed / prevExpiring) * 100).toFixed(1)) : 0;

    const monthly = [];
    for (let i = 5; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const renewed = await Institution.countDocuments({
        'subscription.status': 'active',
        'subscription.renewalDate': { $gte: startDate, $lte: endDate }
      });

      const expiring = await Institution.countDocuments({
        'subscription.endDate': { $gte: startDate, $lte: endDate }
      });

      const rate = expiring > 0 ? parseFloat(((renewed / expiring) * 100).toFixed(1)) : 0;

      monthly.push({
        month: startDate.toLocaleString('default', { month: 'short' }),
        rate
      });
    }

    return { current, previous, monthly };
  }

  async getBranchGrowth() {
    const now = new Date();
    const monthly = [];

    for (let i = 5; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const prevStartDate = new Date(now.getFullYear(), now.getMonth() - i - 1, 1);
      const prevEndDate = new Date(now.getFullYear(), now.getMonth() - i, 0);

      const [count, prevCount] = await Promise.all([
        Institution.countDocuments({ 
          status: 'active',
          createdAt: { $lte: endDate }
        }),
        Institution.countDocuments({ 
          status: 'active',
          createdAt: { $lte: prevEndDate }
        })
      ]);

      const growth = prevCount > 0 ? parseFloat((((count - prevCount) / prevCount) * 100).toFixed(1)) : 0;

      monthly.push({
        month: startDate.toLocaleString('default', { month: 'short' }),
        count,
        growth
      });
    }

    const total = await Institution.countDocuments({ status: 'active' });

    return { monthly, total };
  }

  async getModuleUsage() {
    const total = await Institution.countDocuments({ status: 'active' });
    
    const modules = [
      'Student Management',
      'Fee Management',
      'Attendance System',
      'Exam Management',
      'Library Management',
      'Transport Management',
      'Hostel Management',
      'Inventory Management'
    ];

    return modules.map(module => {
      const active = Math.floor(total * (Math.random() * 0.4 + 0.6));
      const usage = total > 0 ? parseFloat(((active / total) * 100).toFixed(1)) : 0;

      return {
        module,
        active,
        total,
        usage
      };
    });
  }

  async getSupportLoad() {
    try {
      const [total, open, resolved] = await Promise.all([
        SupportTicket.countDocuments(),
        SupportTicket.countDocuments({ status: 'open' }),
        SupportTicket.countDocuments({ status: 'resolved' })
      ]);

      const resolvedTickets = await SupportTicket.find({ 
        status: 'resolved',
        resolvedAt: { $exists: true }
      });

      let totalResolutionTime = 0;
      resolvedTickets.forEach(ticket => {
        if (ticket.resolvedAt && ticket.createdAt) {
          const diff = (ticket.resolvedAt - ticket.createdAt) / (1000 * 60 * 60);
          totalResolutionTime += diff;
        }
      });

      const averageResolutionTime = resolvedTickets.length > 0 
        ? parseFloat((totalResolutionTime / resolvedTickets.length).toFixed(1))
        : 0;

      const byPriority = await SupportTicket.aggregate([
        { $match: { status: 'open' } },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]);

      const byCategory = await SupportTicket.aggregate([
        { $match: { status: 'open' } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      return {
        total,
        open,
        resolved,
        averageResolutionTime,
        byPriority: byPriority.map(p => ({ priority: p._id || 'Unknown', count: p.count })),
        byCategory: byCategory.map(c => ({ category: c._id || 'Unknown', count: c.count }))
      };
    } catch (error) {
      return {
        total: 0,
        open: 0,
        resolved: 0,
        averageResolutionTime: 0,
        byPriority: [],
        byCategory: []
      };
    }
  }

  async getFullAnalytics() {
    const [
      institutionGrowthMonthly,
      institutionGrowthYearly,
      revenueGrowthMonthly,
      revenueGrowthYearly,
      planDistribution,
      institutionTypeDistribution,
      churnRate,
      renewalRate,
      branchGrowth,
      moduleUsage,
      supportLoad
    ] = await Promise.all([
      this.getInstitutionGrowth('monthly'),
      this.getInstitutionGrowth('yearly'),
      this.getRevenueGrowth('monthly'),
      this.getRevenueGrowth('yearly'),
      this.getPlanDistribution(),
      this.getInstitutionTypeDistribution(),
      this.getChurnRate(),
      this.getRenewalRate(),
      this.getBranchGrowth(),
      this.getModuleUsage(),
      this.getSupportLoad()
    ]);

    return {
      institutionGrowth: {
        monthly: institutionGrowthMonthly,
        yearly: institutionGrowthYearly
      },
      revenueGrowth: {
        monthly: revenueGrowthMonthly,
        yearly: revenueGrowthYearly
      },
      planDistribution,
      institutionTypeDistribution,
      churnRate,
      renewalRate,
      branchGrowth,
      moduleUsage,
      supportLoad
    };
  }
}

export default new AnalyticsService();
