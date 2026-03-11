import Institution from '../models/Institution.js';
import School from '../models/School.js';

const DEFAULT_DPO_RESPONSIBILITIES = [
  'Data protection compliance',
  'Breach notification',
  'DPIA coordination'
];

const DEFAULT_DPIA_HIGH_RISK = [
  'Student personal data processing',
  'Automated decision making for assessments',
  'Large-scale data processing'
];

const DEFAULT_DPIA_MITIGATIONS = [
  'Data minimization implemented',
  'Privacy by design principles followed',
  'Regular DPIA reviews conducted',
  'Data protection officer appointed'
];

class InstitutionService {
  async createInstitution(institutionData) {
    const institution = await Institution.create(institutionData);
    return institution;
  }

  async getInstitutions(filters = {}, options = {}) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const query = { ...filters };
    const skip = (page - 1) * limit;
    const [institutions, total] = await Promise.all([
      Institution.find(query).sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }).skip(skip).limit(limit),
      Institution.countDocuments(query)
    ]);
    return { institutions, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async getInstitutionById(id) {
    const institution = await Institution.findById(id);
    if (!institution) throw new Error('Institution not found');
    return institution;
  }

  async updateInstitution(id, updates) {
    const institution = await Institution.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    if (!institution) throw new Error('Institution not found');
    return institution;
  }

  async deleteInstitution(id) {
    const institution = await Institution.findByIdAndUpdate(id, { $set: { status: 'inactive' } }, { new: true });
    if (!institution) throw new Error('Institution not found');
    return institution;
  }

  async getInstitutionsByType(type) {
    return await Institution.find({ type, status: { $ne: 'inactive' } });
  }

  async getInstitutionsByCategory(category) {
    return await Institution.find({ category, status: { $ne: 'inactive' } });
  }

  async getInstitutionsBySubscriptionStatus(status) {
    return await Institution.find({ 'subscription.status': status });
  }

  async getInstitutionsWithExpiringSubscriptions(days = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return await Institution.find({ 'subscription.status': 'active', 'subscription.endDate': { $lte: futureDate, $gt: new Date() } });
  }

  async searchInstitutions(query, limit = 20) {
    const regex = new RegExp(query, 'i');
    return await Institution.find({ $or: [{ name: regex }, { principalEmail: regex }, { 'contact.email': regex }], status: { $ne: 'inactive' } }).limit(limit);
  }

  async getSubscriptionAnalytics() {
    const [institutions, totalRevenue, monthlyRevenue] = await Promise.all([
      Institution.find({ status: { $ne: 'inactive' } }),
      Institution.aggregate([
        { $match: { status: { $ne: 'inactive' } } },
        { $group: { _id: null, total: { $sum: '$totalRevenue' } } }
      ]),
      Institution.aggregate([
        { $match: { status: { $ne: 'inactive' } } },
        { $group: { _id: null, total: { $sum: '$monthlyRevenue' } } }
      ])
    ]);
    const planDistribution = {}, statusDistribution = {}, typeDistribution = {};
    institutions.forEach(inst => {
      planDistribution[inst.subscription.planName] = (planDistribution[inst.subscription.planName] || 0) + 1;
      statusDistribution[inst.subscription.status] = (statusDistribution[inst.subscription.status] || 0) + 1;
      typeDistribution[inst.type] = (typeDistribution[inst.type] || 0) + 1;
    });
    return { totalInstitutions: institutions.length, totalRevenue: totalRevenue[0]?.total || 0, monthlyRevenue: monthlyRevenue[0]?.total || 0, averageRevenuePerInstitution: institutions.length > 0 ? (totalRevenue[0]?.total || 0) / institutions.length : 0, planDistribution, statusDistribution, typeDistribution, activeSubscriptions: institutions.filter(i => i.subscription.status === 'active').length, expiringSubscriptions: (await this.getInstitutionsWithExpiringSubscriptions()).length };
  }

  async getComplianceStatus() {
    const institutions = await Institution.find({ status: { $ne: 'inactive' } });
    const gdprCompliant = institutions.filter(i => i.compliance?.gdprCompliant).length;
    const ferpaCompliant = institutions.filter(i => i.compliance?.ferpaCompliant).length;
    const securityAudited = institutions.filter(i => i.compliance?.securityAudits).length;
    const sampleCompliance = institutions.find(i => i.compliance) ?? null;
    const dpoContact = sampleCompliance?.compliance?.dpoContact || 'dpo@edumanage.pro';
    const dpoResponsibilities = sampleCompliance?.compliance?.dpoResponsibilities || DEFAULT_DPO_RESPONSIBILITIES;
    const dpia = sampleCompliance?.compliance?.dpia || {
      highRiskProcessing: DEFAULT_DPIA_HIGH_RISK,
      mitigationMeasures: DEFAULT_DPIA_MITIGATIONS
    };
    return {
      totalInstitutions: institutions.length,
      gdprCompliant,
      ferpaCompliant,
      securityAudited,
      gdprComplianceRate: institutions.length > 0 ? (gdprCompliant / institutions.length) * 100 : 0,
      ferpaComplianceRate: institutions.length > 0 ? (ferpaCompliant / institutions.length) * 100 : 0,
      securityAuditRate: institutions.length > 0 ? (securityAudited / institutions.length) * 100 : 0,
      dpoContact,
      dpoResponsibilities,
      dpiaSummary: {
        highRiskProcessing: dpia.highRiskProcessing || DEFAULT_DPIA_HIGH_RISK,
        mitigationMeasures: dpia.mitigationMeasures || DEFAULT_DPIA_MITIGATIONS,
        lastReview: dpia.lastReview || null
      }
    };
  }

  async calculateInstitutionMetrics(institutionId) {
    const institution = await this.getInstitutionById(institutionId);
    const { analytics, subscription, features } = institution;
    return { userUtilization: features.maxUsers > 0 ? (analytics.activeUsers / features.maxUsers) * 100 : 0, studentUtilization: features.maxStudents > 0 ? (analytics.totalStudents / features.maxStudents) * 100 : 0, revenuePerStudent: analytics.totalStudents > 0 ? subscription.monthlyCost / analytics.totalStudents : 0, growthRate: analytics.growthRate, retentionRate: analytics.retentionRate, satisfactionScore: analytics.satisfactionScore, loginFrequency: analytics.loginFrequency };
  }

  async updateExpiredSubscriptions() {
    const expiredInstitutions = await Institution.find({ 'subscription.status': 'active', 'subscription.endDate': { $lt: new Date() } });
    for (const institution of expiredInstitutions) {
      institution.subscription.status = 'expired';
      institution.status = 'expired';
      await institution.save();
    }
    return expiredInstitutions.length;
  }

  async getDashboardStats() {
    const [totalInstitutions, activeInstitutions, totalStudents, totalTeachers, expiringSubscriptions, activeSubscriptions] = await Promise.all([
      Institution.countDocuments(),
      Institution.countDocuments({ status: 'active' }),
      Institution.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: null, total: { $sum: '$analytics.totalStudents' } } }
      ]),
      Institution.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: null, total: { $sum: '$analytics.totalTeachers' } } }
      ]),
      this.getInstitutionsWithExpiringSubscriptions(),
      Institution.countDocuments({ 'subscription.status': 'active' })
    ]);
    return { totalInstitutions, activeInstitutions, inactiveInstitutions: totalInstitutions - activeInstitutions, totalStudents: totalStudents[0]?.total || 0, totalTeachers: totalTeachers[0]?.total || 0, expiringSubscriptions: expiringSubscriptions.length, activeSubscriptions, totalRevenue: (await this.getSubscriptionAnalytics()).totalRevenue };
  }

  async migrateFromSchool(schoolId) {
    const school = await School.findById(schoolId);
    if (!school) throw new Error('School not found');
    const typeMap = { 'School': 'School', 'Inter College': 'Inter College', 'Degree College': 'Degree College' };
    const categoryMap = { 'School': 'secondary', 'Inter College': 'higher-secondary', 'Degree College': 'undergraduate' };
    const institutionData = {
      name: school.name, shortName: school.code, type: typeMap[school.type] || 'School', category: categoryMap[school.type] || 'secondary',
      established: new Date().getFullYear(), contact: { email: school.contact?.email || '', phone: school.contact?.phone || '', address: { street: school.address?.street || '', city: school.address?.city || '', state: school.address?.state || '', country: school.address?.country || 'United States', postalCode: school.address?.zipCode || '' } },
      principalName: school.adminName || '', principalEmail: school.adminEmail || '', principalPhone: school.adminPhone || '',
      subscription: { planId: school.subscriptionPlan || 'basic', planName: school.subscriptionPlan ? school.subscriptionPlan.charAt(0).toUpperCase() + school.subscriptionPlan.slice(1) : 'Basic', status: school.isActive ? 'active' : 'inactive', startDate: school.createdAt || new Date(), endDate: school.subscriptionExpiry || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), billingCycle: 'monthly', monthlyCost: school.monthlyRevenue || 0, currency: 'USD' },
      features: { maxUsers: 100, maxStudents: 500, maxTeachers: 20, storageLimit: 10, customDomain: false, whiteLabel: false, advancedAnalytics: false, prioritySupport: false, trainingSessions: 0, integrations: [] },
      analytics: { totalStudents: school.students || 0, totalTeachers: 0, totalStaff: 0, activeUsers: school.students || 0, monthlyActiveUsers: Math.floor((school.students || 0) * 0.8), loginFrequency: 70, growthRate: 0, retentionRate: 95 },
      status: school.isActive ? 'active' : 'inactive', legacySchoolId: school._id
    };
    const institution = await this.createInstitution(institutionData);
    school.isActive = false;
    await school.save();
    return institution;
  }

  async suspendInstitution(id, reason) {
    const institution = await Institution.findByIdAndUpdate(id, { $set: { status: 'suspended', suspensionReason: reason } }, { new: true });
    if (!institution) throw new Error('Institution not found');
    return institution;
  }

  async activateInstitution(id) {
    const institution = await Institution.findByIdAndUpdate(id, { $set: { status: 'active', suspensionReason: null } }, { new: true });
    if (!institution) throw new Error('Institution not found');
    return institution;
  }

  async updateNotes(id, notes) {
    const institution = await Institution.findByIdAndUpdate(id, { $set: { notes } }, { new: true });
    if (!institution) throw new Error('Institution not found');
    return institution;
  }

  async addTag(id, tag) {
    const institution = await Institution.findByIdAndUpdate(id, { $addToSet: { tags: tag } }, { new: true });
    if (!institution) throw new Error('Institution not found');
    return institution;
  }

  async removeTag(id, tag) {
    const institution = await Institution.findByIdAndUpdate(id, { $pull: { tags: tag } }, { new: true });
    if (!institution) throw new Error('Institution not found');
    return institution;
  }

  async updateSubscription(id, subscriptionData) {
    const institution = await Institution.findByIdAndUpdate(id, { $set: { subscription: subscriptionData } }, { new: true });
    if (!institution) throw new Error('Institution not found');
    return institution;
  }

  async updateAnalytics(id, analyticsData) {
    const institution = await Institution.findByIdAndUpdate(id, { $set: { analytics: analyticsData } }, { new: true });
    if (!institution) throw new Error('Institution not found');
    return institution;
  }

  async updateCompliance(id, complianceData) {
    const institution = await Institution.findByIdAndUpdate(id, { $set: { compliance: complianceData } }, { new: true });
    if (!institution) throw new Error('Institution not found');
    return institution;
  }

  async updateLastLogin(id) {
    const institution = await Institution.findByIdAndUpdate(id, { $set: { lastLogin: new Date() } }, { new: true });
    if (!institution) throw new Error('Institution not found');
    return institution;
  }

  async getRevenueReport(startDate, endDate) {
    const query = { status: { $ne: 'inactive' } };
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const institutions = await Institution.find(query);
    const totalRevenue = institutions.reduce((sum, i) => sum + (i.monthlyRevenue || 0), 0);
    return { totalRevenue, institutionCount: institutions.length };
  }
}

export default new InstitutionService();
