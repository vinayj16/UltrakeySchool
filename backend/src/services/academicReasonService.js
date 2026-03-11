import AcademicReason from '../models/AcademicReason.js';

class AcademicReasonService {
  /**
   * Create a new academic reason
   */
  async createReason(schoolId, reasonData, userId) {
    const reason = await AcademicReason.create({
      ...reasonData,
      schoolId,
      createdBy: userId
    });
    return reason;
  }

  /**
   * Get all reasons with filters
   */
  async getReasons(schoolId, filters = {}, options = {}) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    
    const query = { schoolId, ...filters };
    const skip = (page - 1) * limit;
    
    const [reasons, total] = await Promise.all([
      AcademicReason.find(query)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit),
      AcademicReason.countDocuments(query)
    ]);

    return {
      reasons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get reason by ID
   */
  async getReasonById(reasonId, schoolId) {
    const reason = await AcademicReason.findOne({ _id: reasonId, schoolId });
    if (!reason) {
      throw new Error('Reason not found');
    }
    return reason;
  }

  /**
   * Update reason
   */
  async updateReason(reasonId, schoolId, updates, userId) {
    const reason = await AcademicReason.findOneAndUpdate(
      { _id: reasonId, schoolId },
      { ...updates, updatedBy: userId },
      { new: true, runValidators: true }
    );
    if (!reason) {
      throw new Error('Reason not found');
    }
    return reason;
  }

  /**
   * Delete reason (soft delete)
   */
  async deleteReason(reasonId, schoolId) {
    const reason = await AcademicReason.findOneAndUpdate(
      { _id: reasonId, schoolId },
      { status: 'inactive' },
      { new: true }
    );
    if (!reason) {
      throw new Error('Reason not found');
    }
    return reason;
  }

  /**
   * Get reasons by role
   */
  async getReasonsByRole(schoolId, role) {
    return await AcademicReason.find({ schoolId, role, status: 'active' });
  }

  /**
   * Get reasons by category
   */
  async getReasonsByCategory(schoolId, category) {
    return await AcademicReason.find({ schoolId, category, status: 'active' });
  }

  /**
   * Get reasons by severity
   */
  async getReasonsBySeverity(schoolId, severity) {
    return await AcademicReason.find({ schoolId, severity, status: 'active' });
  }

  /**
   * Search reasons
   */
  async searchReasons(schoolId, query, limit = 20) {
    const regex = new RegExp(query, 'i');
    return await AcademicReason.find({
      schoolId,
      status: 'active',
      $or: [
        { reason: regex },
        { description: regex }
      ]
    }).limit(limit);
  }

  /**
   * Get analytics
   */
  async getAnalytics(schoolId) {
    const reasons = await AcademicReason.find({ schoolId });
    const activeReasons = reasons.filter(r => r.status === 'active');

    const reasonsByCategory = {};
    const reasonsByRole = {};
    const reasonsBySeverity = {};

    activeReasons.forEach(reason => {
      reasonsByCategory[reason.category] = (reasonsByCategory[reason.category] || 0) + 1;
      reasonsByRole[reason.role] = (reasonsByRole[reason.role] || 0) + 1;
      reasonsBySeverity[reason.severity] = (reasonsBySeverity[reason.severity] || 0) + 1;
    });

    const topUsedReasons = activeReasons
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 5)
      .map(r => ({ reason: r.reason, count: r.usageCount }));

    return {
      totalReasons: reasons.length,
      activeReasons: activeReasons.length,
      reasonsByCategory,
      reasonsByRole,
      reasonsBySeverity,
      topUsedReasons
    };
  }

  /**
   * Increment usage count
   */
  async incrementUsage(reasonId, schoolId) {
    const reason = await AcademicReason.findOneAndUpdate(
      { _id: reasonId, schoolId },
      { 
        $inc: { usageCount: 1 },
        lastUsed: new Date()
      },
      { new: true }
    );
    return reason;
  }
}

export default new AcademicReasonService();
