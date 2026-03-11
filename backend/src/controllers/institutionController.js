import institutionService from '../services/institutionService.js';
import { successResponse, createdResponse, errorResponse, validationErrorResponse, notFoundResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

// Validation constants
const VALID_INSTITUTION_TYPES = ['school', 'college', 'university', 'training_center', 'coaching_center', 'other'];
const VALID_INSTITUTION_CATEGORIES = ['primary', 'secondary', 'higher_secondary', 'undergraduate', 'postgraduate', 'professional', 'vocational'];
const VALID_INSTITUTION_STATUSES = ['active', 'inactive', 'suspended', 'pending', 'closed'];
const VALID_SUBSCRIPTION_STATUSES = ['active', 'expired', 'trial', 'cancelled', 'suspended'];
const VALID_EXPORT_FORMATS = ['json', 'csv', 'xlsx', 'pdf'];
const VALID_SORT_ORDERS = ['asc', 'desc'];

// Helper function to validate MongoDB ObjectId
const validateObjectId = (id, fieldName = 'ID') => {
  if (!id) {
    return fieldName + ' is required';
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return 'Invalid ' + fieldName + ' format';
  }
  return null;
};

// Helper function to validate date
const validateDate = (date, fieldName = 'Date') => {
  if (!date) {
    return fieldName + ' is required';
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return 'Invalid ' + fieldName + ' format';
  }
  return null;
};

// Helper function to validate date range
const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start > end) {
    return 'Start date cannot be after end date';
  }
  return null;
};

// Helper function to validate email
const validateEmail = (email) => {
  if (!email) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

// Helper function to validate phone
const validatePhone = (phone) => {
  if (!phone) {
    return null; // Phone is optional
  }
  const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;
  if (!phoneRegex.test(phone)) {
    return 'Invalid phone format';
  }
  return null;
};

/**
 * Create a new institution
 */
const createInstitution = async (req, res) => {
  try {
    logger.info('Creating institution');
    
    const { name, type, category, email, phone, address, subscription } = req.body;
    
    // Validation
    const errors = [];
    
    if (!name || name.trim().length === 0) {
      errors.push('Institution name is required');
    } else if (name.length > 200) {
      errors.push('Institution name must not exceed 200 characters');
    }
    
    if (!type || type.trim().length === 0) {
      errors.push('Institution type is required');
    } else if (!VALID_INSTITUTION_TYPES.includes(type)) {
      errors.push('Invalid institution type. Must be one of: ' + VALID_INSTITUTION_TYPES.join(', '));
    }
    
    if (category && !VALID_INSTITUTION_CATEGORIES.includes(category)) {
      errors.push('Invalid category. Must be one of: ' + VALID_INSTITUTION_CATEGORIES.join(', '));
    }
    
    if (email) {
      const emailError = validateEmail(email);
      if (emailError) errors.push(emailError);
    }
    
    if (phone) {
      const phoneError = validatePhone(phone);
      if (phoneError) errors.push(phoneError);
    }
    
    if (address && typeof address !== 'object') {
      errors.push('Address must be an object');
    }
    
    if (subscription && typeof subscription !== 'object') {
      errors.push('Subscription must be an object');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institution = await institutionService.createInstitution(req.body);
    
    logger.info('Institution created successfully:', { institutionId: institution._id });
    return createdResponse(res, institution, 'Institution created successfully');
  } catch (error) {
    logger.error('Error creating institution:', error);
    return errorResponse(res, error.message);
  }
};


/**
 * Get all institutions with optional filters
 */
const getInstitutions = async (req, res) => {
  try {
    logger.info('Fetching institutions');
    
    const { type, category, status, subscriptionStatus, page, limit, sortBy, sortOrder } = req.query;
    
    // Validation
    const errors = [];
    
    if (type && !VALID_INSTITUTION_TYPES.includes(type)) {
      errors.push('Invalid institution type');
    }
    
    if (category && !VALID_INSTITUTION_CATEGORIES.includes(category)) {
      errors.push('Invalid category');
    }
    
    if (status && !VALID_INSTITUTION_STATUSES.includes(status)) {
      errors.push('Invalid status');
    }
    
    if (subscriptionStatus && !VALID_SUBSCRIPTION_STATUSES.includes(subscriptionStatus)) {
      errors.push('Invalid subscription status');
    }
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    
    if (pageNum < 1) {
      errors.push('Page must be greater than 0');
    }
    
    if (limitNum < 1 || limitNum > 100) {
      errors.push('Limit must be between 1 and 100');
    }
    
    if (sortOrder && !VALID_SORT_ORDERS.includes(sortOrder)) {
      errors.push('Invalid sort order. Must be asc or desc');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const filters = {};
    if (type) filters.type = type;
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (subscriptionStatus) filters['subscription.status'] = subscriptionStatus;

    const options = { 
      page: pageNum, 
      limit: limitNum, 
      sortBy: sortBy || 'createdAt', 
      sortOrder: sortOrder || 'desc' 
    };
    
    const result = await institutionService.getInstitutions(filters, options);
    
    logger.info('Institutions fetched successfully');
    return successResponse(res, result, 'Institutions retrieved successfully');
  } catch (error) {
    logger.error('Error fetching institutions:', error);
    return errorResponse(res, error.message);
  }
};


/**
 * Get institution by ID
 */
const getInstitutionById = async (req, res) => {
  try {
    logger.info('Fetching institution by ID');
    
    const { id } = req.params;
    
    // Validation
    const errors = [];
    
    const idError = validateObjectId(id, 'Institution ID');
    if (idError) errors.push(idError);
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institution = await institutionService.getInstitutionById(id);
    
    if (!institution) {
      return notFoundResponse(res, 'Institution not found');
    }
    
    logger.info('Institution fetched successfully:', { institutionId: id });
    return successResponse(res, institution, 'Institution retrieved successfully');
  } catch (error) {
    logger.error('Error fetching institution:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Update institution
 */
const updateInstitution = async (req, res) => {
  try {
    logger.info('Updating institution');
    
    const { id } = req.params;
    const { name, type, category, email, phone } = req.body;
    
    // Validation
    const errors = [];
    
    const idError = validateObjectId(id, 'Institution ID');
    if (idError) errors.push(idError);
    
    if (name !== undefined && (!name || name.trim().length === 0)) {
      errors.push('Institution name cannot be empty');
    } else if (name && name.length > 200) {
      errors.push('Institution name must not exceed 200 characters');
    }
    
    if (type && !VALID_INSTITUTION_TYPES.includes(type)) {
      errors.push('Invalid institution type');
    }
    
    if (category && !VALID_INSTITUTION_CATEGORIES.includes(category)) {
      errors.push('Invalid category');
    }
    
    if (email) {
      const emailError = validateEmail(email);
      if (emailError) errors.push(emailError);
    }
    
    if (phone) {
      const phoneError = validatePhone(phone);
      if (phoneError) errors.push(phoneError);
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institution = await institutionService.updateInstitution(id, req.body);
    
    if (!institution) {
      return notFoundResponse(res, 'Institution not found');
    }
    
    logger.info('Institution updated successfully:', { institutionId: id });
    return successResponse(res, institution, 'Institution updated successfully');
  } catch (error) {
    logger.error('Error updating institution:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Delete institution (soft delete)
 */
const deleteInstitution = async (req, res) => {
  try {
    logger.info('Deleting institution');
    
    const { id } = req.params;
    
    // Validation
    const errors = [];
    
    const idError = validateObjectId(id, 'Institution ID');
    if (idError) errors.push(idError);
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institution = await institutionService.deleteInstitution(id);
    
    if (!institution) {
      return notFoundResponse(res, 'Institution not found');
    }
    
    logger.info('Institution deleted successfully:', { institutionId: id });
    return successResponse(res, institution, 'Institution deleted successfully');
  } catch (error) {
    logger.error('Error deleting institution:', error);
    return errorResponse(res, error.message);
  }
};


/**
 * Get institutions by type
 */
const getInstitutionsByType = async (req, res) => {
  try {
    logger.info('Fetching institutions by type');
    
    const { type } = req.params;
    
    // Validation
    const errors = [];
    
    if (!type || type.trim().length === 0) {
      errors.push('Type is required');
    } else if (!VALID_INSTITUTION_TYPES.includes(type)) {
      errors.push('Invalid institution type');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institutions = await institutionService.getInstitutionsByType(type);
    
    logger.info('Institutions by type fetched successfully:', { type });
    return successResponse(res, institutions, 'Institutions retrieved successfully');
  } catch (error) {
    logger.error('Error fetching institutions by type:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Get institutions by category
 */
const getInstitutionsByCategory = async (req, res) => {
  try {
    logger.info('Fetching institutions by category');
    
    const { category } = req.params;
    
    // Validation
    const errors = [];
    
    if (!category || category.trim().length === 0) {
      errors.push('Category is required');
    } else if (!VALID_INSTITUTION_CATEGORIES.includes(category)) {
      errors.push('Invalid category');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institutions = await institutionService.getInstitutionsByCategory(category);
    
    logger.info('Institutions by category fetched successfully:', { category });
    return successResponse(res, institutions, 'Institutions retrieved successfully');
  } catch (error) {
    logger.error('Error fetching institutions by category:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Get institutions by subscription status
 */
const getInstitutionsBySubscriptionStatus = async (req, res) => {
  try {
    logger.info('Fetching institutions by subscription status');
    
    const { status } = req.params;
    
    // Validation
    const errors = [];
    
    if (!status || status.trim().length === 0) {
      errors.push('Status is required');
    } else if (!VALID_SUBSCRIPTION_STATUSES.includes(status)) {
      errors.push('Invalid subscription status');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institutions = await institutionService.getInstitutionsBySubscriptionStatus(status);
    
    logger.info('Institutions by subscription status fetched successfully:', { status });
    return successResponse(res, institutions, 'Institutions retrieved successfully');
  } catch (error) {
    logger.error('Error fetching institutions by subscription status:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Get institutions with expiring subscriptions
 */
const getExpiringSubscriptions = async (req, res) => {
  try {
    logger.info('Fetching expiring subscriptions');
    
    const { days } = req.query;
    
    // Validation
    const errors = [];
    
    const daysNum = parseInt(days) || 30;
    
    if (daysNum < 1) {
      errors.push('Days must be at least 1');
    } else if (daysNum > 365) {
      errors.push('Days must not exceed 365');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institutions = await institutionService.getInstitutionsWithExpiringSubscriptions(daysNum);
    
    logger.info('Expiring subscriptions fetched successfully:', { days: daysNum });
    return successResponse(res, institutions, 'Expiring subscriptions retrieved successfully');
  } catch (error) {
    logger.error('Error fetching expiring subscriptions:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Search institutions
 */
const searchInstitutions = async (req, res) => {
  try {
    logger.info('Searching institutions');
    
    const { q, limit } = req.query;
    
    // Validation
    const errors = [];
    
    if (!q || q.trim().length === 0) {
      errors.push('Search query is required');
    } else if (q.length > 200) {
      errors.push('Search query must not exceed 200 characters');
    }
    
    const limitNum = parseInt(limit) || 20;
    
    if (limitNum < 1 || limitNum > 100) {
      errors.push('Limit must be between 1 and 100');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institutions = await institutionService.searchInstitutions(q, limitNum);
    
    logger.info('Institution search completed:', { query: q });
    return successResponse(res, institutions, 'Search results retrieved successfully');
  } catch (error) {
    logger.error('Error searching institutions:', error);
    return errorResponse(res, error.message);
  }
};


/**
 * Get subscription analytics
 */
const getSubscriptionAnalytics = async (req, res) => {
  try {
    logger.info('Fetching subscription analytics');
    
    const analytics = await institutionService.getSubscriptionAnalytics();
    
    logger.info('Subscription analytics fetched successfully');
    return successResponse(res, analytics, 'Analytics retrieved successfully');
  } catch (error) {
    logger.error('Error fetching subscription analytics:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Get compliance status
 */
const getComplianceStatus = async (req, res) => {
  try {
    logger.info('Fetching compliance status');
    
    const compliance = await institutionService.getComplianceStatus();
    
    logger.info('Compliance status fetched successfully');
    return successResponse(res, compliance, 'Compliance status retrieved successfully');
  } catch (error) {
    logger.error('Error fetching compliance status:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Get institution metrics
 */
const getInstitutionMetrics = async (req, res) => {
  try {
    logger.info('Fetching institution metrics');
    
    const { id } = req.params;
    
    // Validation
    const errors = [];
    
    const idError = validateObjectId(id, 'Institution ID');
    if (idError) errors.push(idError);
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const metrics = await institutionService.calculateInstitutionMetrics(id);
    
    if (!metrics) {
      return notFoundResponse(res, 'Institution not found');
    }
    
    logger.info('Institution metrics fetched successfully:', { institutionId: id });
    return successResponse(res, metrics, 'Metrics retrieved successfully');
  } catch (error) {
    logger.error('Error fetching institution metrics:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Get dashboard statistics
 */
const getDashboardStats = async (req, res) => {
  try {
    logger.info('Fetching dashboard statistics');
    
    const stats = await institutionService.getDashboardStats();
    
    logger.info('Dashboard statistics fetched successfully');
    return successResponse(res, stats, 'Statistics retrieved successfully');
  } catch (error) {
    logger.error('Error fetching dashboard statistics:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Migrate from legacy school
 */
const migrateFromSchool = async (req, res) => {
  try {
    logger.info('Migrating from legacy school');
    
    const { schoolId } = req.params;
    
    // Validation
    const errors = [];
    
    const idError = validateObjectId(schoolId, 'School ID');
    if (idError) errors.push(idError);
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institution = await institutionService.migrateFromSchool(schoolId);
    
    if (!institution) {
      return notFoundResponse(res, 'School not found');
    }
    
    logger.info('Institution migrated successfully:', { schoolId, institutionId: institution._id });
    return createdResponse(res, institution, 'Institution migrated successfully from school');
  } catch (error) {
    logger.error('Error migrating from school:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Update expired subscriptions
 */
const updateExpiredSubscriptions = async (req, res) => {
  try {
    logger.info('Updating expired subscriptions');
    
    const count = await institutionService.updateExpiredSubscriptions();
    
    logger.info('Expired subscriptions updated:', { count });
    return successResponse(res, { updatedCount: count }, 'Updated ' + count + ' expired subscriptions');
  } catch (error) {
    logger.error('Error updating expired subscriptions:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Suspend institution
 */
const suspendInstitution = async (req, res) => {
  try {
    logger.info('Suspending institution');
    
    const { id } = req.params;
    const { reason } = req.body;
    
    // Validation
    const errors = [];
    
    const idError = validateObjectId(id, 'Institution ID');
    if (idError) errors.push(idError);
    
    if (!reason || reason.trim().length === 0) {
      errors.push('Suspension reason is required');
    } else if (reason.length > 500) {
      errors.push('Reason must not exceed 500 characters');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institution = await institutionService.suspendInstitution(id, reason);
    
    if (!institution) {
      return notFoundResponse(res, 'Institution not found');
    }
    
    logger.info('Institution suspended successfully:', { institutionId: id });
    return successResponse(res, institution, 'Institution suspended successfully');
  } catch (error) {
    logger.error('Error suspending institution:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Activate institution
 */
const activateInstitution = async (req, res) => {
  try {
    logger.info('Activating institution');
    
    const { id } = req.params;
    
    // Validation
    const errors = [];
    
    const idError = validateObjectId(id, 'Institution ID');
    if (idError) errors.push(idError);
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institution = await institutionService.activateInstitution(id);
    
    if (!institution) {
      return notFoundResponse(res, 'Institution not found');
    }
    
    logger.info('Institution activated successfully:', { institutionId: id });
    return successResponse(res, institution, 'Institution activated successfully');
  } catch (error) {
    logger.error('Error activating institution:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Update notes
 */
const updateNotes = async (req, res) => {
  try {
    logger.info('Updating institution notes');
    
    const { id } = req.params;
    const { notes } = req.body;
    
    // Validation
    const errors = [];
    
    const idError = validateObjectId(id, 'Institution ID');
    if (idError) errors.push(idError);
    
    if (notes && notes.length > 2000) {
      errors.push('Notes must not exceed 2000 characters');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institution = await institutionService.updateNotes(id, notes);
    
    if (!institution) {
      return notFoundResponse(res, 'Institution not found');
    }
    
    logger.info('Institution notes updated successfully:', { institutionId: id });
    return successResponse(res, institution, 'Notes updated successfully');
  } catch (error) {
    logger.error('Error updating notes:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Add tag
 */
const addTag = async (req, res) => {
  try {
    logger.info('Adding tag to institution');
    
    const { id } = req.params;
    const { tag } = req.body;
    
    // Validation
    const errors = [];
    
    const idError = validateObjectId(id, 'Institution ID');
    if (idError) errors.push(idError);
    
    if (!tag || tag.trim().length === 0) {
      errors.push('Tag is required');
    } else if (tag.length > 50) {
      errors.push('Tag must not exceed 50 characters');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institution = await institutionService.addTag(id, tag);
    
    if (!institution) {
      return notFoundResponse(res, 'Institution not found');
    }
    
    logger.info('Tag added successfully:', { institutionId: id, tag });
    return successResponse(res, institution, 'Tag added successfully');
  } catch (error) {
    logger.error('Error adding tag:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Remove tag
 */
const removeTag = async (req, res) => {
  try {
    logger.info('Removing tag from institution');
    
    const { id } = req.params;
    const { tag } = req.body;
    
    // Validation
    const errors = [];
    
    const idError = validateObjectId(id, 'Institution ID');
    if (idError) errors.push(idError);
    
    if (!tag || tag.trim().length === 0) {
      errors.push('Tag is required');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institution = await institutionService.removeTag(id, tag);
    
    if (!institution) {
      return notFoundResponse(res, 'Institution not found');
    }
    
    logger.info('Tag removed successfully:', { institutionId: id, tag });
    return successResponse(res, institution, 'Tag removed successfully');
  } catch (error) {
    logger.error('Error removing tag:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Update subscription
 */
const updateSubscription = async (req, res) => {
  try {
    logger.info('Updating institution subscription');
    
    const { id } = req.params;
    const subscriptionData = req.body;
    
    // Validation
    const errors = [];
    
    const idError = validateObjectId(id, 'Institution ID');
    if (idError) errors.push(idError);
    
    if (!subscriptionData || typeof subscriptionData !== 'object') {
      errors.push('Subscription data is required');
    }
    
    if (subscriptionData.status && !VALID_SUBSCRIPTION_STATUSES.includes(subscriptionData.status)) {
      errors.push('Invalid subscription status');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institution = await institutionService.updateSubscription(id, subscriptionData);
    
    if (!institution) {
      return notFoundResponse(res, 'Institution not found');
    }
    
    logger.info('Subscription updated successfully:', { institutionId: id });
    return successResponse(res, institution, 'Subscription updated successfully');
  } catch (error) {
    logger.error('Error updating subscription:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Update analytics
 */
const updateAnalytics = async (req, res) => {
  try {
    logger.info('Updating institution analytics');
    
    const { id } = req.params;
    const analyticsData = req.body;
    
    // Validation
    const errors = [];
    
    const idError = validateObjectId(id, 'Institution ID');
    if (idError) errors.push(idError);
    
    if (!analyticsData || typeof analyticsData !== 'object') {
      errors.push('Analytics data is required');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institution = await institutionService.updateAnalytics(id, analyticsData);
    
    if (!institution) {
      return notFoundResponse(res, 'Institution not found');
    }
    
    logger.info('Analytics updated successfully:', { institutionId: id });
    return successResponse(res, institution, 'Analytics updated successfully');
  } catch (error) {
    logger.error('Error updating analytics:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Update compliance
 */
const updateCompliance = async (req, res) => {
  try {
    logger.info('Updating institution compliance');
    
    const { id } = req.params;
    const complianceData = req.body;
    
    // Validation
    const errors = [];
    
    const idError = validateObjectId(id, 'Institution ID');
    if (idError) errors.push(idError);
    
    if (!complianceData || typeof complianceData !== 'object') {
      errors.push('Compliance data is required');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institution = await institutionService.updateCompliance(id, complianceData);
    
    if (!institution) {
      return notFoundResponse(res, 'Institution not found');
    }
    
    logger.info('Compliance updated successfully:', { institutionId: id });
    return successResponse(res, institution, 'Compliance updated successfully');
  } catch (error) {
    logger.error('Error updating compliance:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Update last login
 */
const updateLastLogin = async (req, res) => {
  try {
    logger.info('Updating last login');
    
    const { id } = req.params;
    
    // Validation
    const errors = [];
    
    const idError = validateObjectId(id, 'Institution ID');
    if (idError) errors.push(idError);
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    await institutionService.updateLastLogin(id);
    
    logger.info('Last login updated successfully:', { institutionId: id });
    return successResponse(res, null, 'Last login updated successfully');
  } catch (error) {
    logger.error('Error updating last login:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Get revenue report
 */
const getRevenueReport = async (req, res) => {
  try {
    logger.info('Fetching revenue report');
    
    const { startDate, endDate } = req.query;
    
    // Validation
    const errors = [];
    
    if (startDate) {
      const dateError = validateDate(startDate, 'Start date');
      if (dateError) errors.push(dateError);
    }
    
    if (endDate) {
      const dateError = validateDate(endDate, 'End date');
      if (dateError) errors.push(dateError);
    }
    
    if (startDate && endDate) {
      const rangeError = validateDateRange(startDate, endDate);
      if (rangeError) errors.push(rangeError);
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const report = await institutionService.getRevenueReport(startDate, endDate);
    
    logger.info('Revenue report fetched successfully');
    return successResponse(res, report, 'Revenue report retrieved successfully');
  } catch (error) {
    logger.error('Error fetching revenue report:', error);
    return errorResponse(res, error.message);
  }
};

// ============ NEW UTILITY ENDPOINTS ============

/**
 * Bulk update institutions
 */
const bulkUpdateInstitutions = async (req, res) => {
  try {
    logger.info('Bulk updating institutions');
    
    const { institutionIds, updates } = req.body;
    
    // Validation
    const errors = [];
    
    if (!institutionIds || !Array.isArray(institutionIds) || institutionIds.length === 0) {
      errors.push('Institution IDs array is required and must not be empty');
    } else if (institutionIds.length > 100) {
      errors.push('Cannot update more than 100 institutions at once');
    }
    
    if (!updates || typeof updates !== 'object') {
      errors.push('Updates object is required');
    }
    
    if (updates?.status && !VALID_INSTITUTION_STATUSES.includes(updates.status)) {
      errors.push('Invalid status in updates');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const result = await institutionService.bulkUpdateInstitutions(institutionIds, updates);
    
    logger.info('Bulk institution update completed:', { count: result.modifiedCount });
    return successResponse(res, { modifiedCount: result.modifiedCount }, 'Institutions updated successfully');
  } catch (error) {
    logger.error('Error in bulk institution update:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Export institutions
 */
const exportInstitutions = async (req, res) => {
  try {
    logger.info('Exporting institutions');
    
    const { format, type, status } = req.query;
    
    // Validation
    const errors = [];
    
    if (!format || format.trim().length === 0) {
      errors.push('Export format is required');
    } else if (!VALID_EXPORT_FORMATS.includes(format.toLowerCase())) {
      errors.push('Invalid export format. Must be one of: ' + VALID_EXPORT_FORMATS.join(', '));
    }
    
    if (type && !VALID_INSTITUTION_TYPES.includes(type)) {
      errors.push('Invalid institution type');
    }
    
    if (status && !VALID_INSTITUTION_STATUSES.includes(status)) {
      errors.push('Invalid status');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const exportData = await institutionService.exportInstitutions({
      format: format.toLowerCase(),
      type,
      status
    });
    
    logger.info('Institutions exported successfully:', { format });
    return successResponse(res, exportData, 'Institutions exported successfully');
  } catch (error) {
    logger.error('Error exporting institutions:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Get institution analytics
 */
const getInstitutionAnalytics = async (req, res) => {
  try {
    logger.info('Fetching institution analytics');
    
    const { groupBy, startDate, endDate } = req.query;
    
    // Validation
    const errors = [];
    
    const validGroupBy = ['type', 'category', 'status', 'month', 'year'];
    if (groupBy && !validGroupBy.includes(groupBy)) {
      errors.push('Invalid groupBy. Must be one of: ' + validGroupBy.join(', '));
    }
    
    if (startDate) {
      const dateError = validateDate(startDate, 'Start date');
      if (dateError) errors.push(dateError);
    }
    
    if (endDate) {
      const dateError = validateDate(endDate, 'End date');
      if (dateError) errors.push(dateError);
    }
    
    if (startDate && endDate) {
      const rangeError = validateDateRange(startDate, endDate);
      if (rangeError) errors.push(rangeError);
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const analytics = await institutionService.getInstitutionAnalytics({
      groupBy: groupBy || 'type',
      startDate,
      endDate
    });
    
    logger.info('Institution analytics fetched successfully');
    return successResponse(res, analytics, 'Analytics retrieved successfully');
  } catch (error) {
    logger.error('Error fetching institution analytics:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Get institutions by status
 */
const getInstitutionsByStatus = async (req, res) => {
  try {
    logger.info('Fetching institutions by status');
    
    const { status } = req.params;
    const { page, limit } = req.query;
    
    // Validation
    const errors = [];
    
    if (!status || status.trim().length === 0) {
      errors.push('Status is required');
    } else if (!VALID_INSTITUTION_STATUSES.includes(status)) {
      errors.push('Invalid status');
    }
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    
    if (pageNum < 1) {
      errors.push('Page must be greater than 0');
    }
    
    if (limitNum < 1 || limitNum > 100) {
      errors.push('Limit must be between 1 and 100');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const result = await institutionService.getInstitutionsByStatus(status, {
      page: pageNum,
      limit: limitNum
    });
    
    logger.info('Institutions by status fetched successfully:', { status });
    return successResponse(res, result, 'Institutions retrieved successfully');
  } catch (error) {
    logger.error('Error fetching institutions by status:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Verify institution
 */
const verifyInstitution = async (req, res) => {
  try {
    logger.info('Verifying institution');
    
    const { id } = req.params;
    const { verificationNotes } = req.body;
    
    // Validation
    const errors = [];
    
    const idError = validateObjectId(id, 'Institution ID');
    if (idError) errors.push(idError);
    
    if (verificationNotes && verificationNotes.length > 1000) {
      errors.push('Verification notes must not exceed 1000 characters');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const institution = await institutionService.verifyInstitution(id, verificationNotes);
    
    if (!institution) {
      return notFoundResponse(res, 'Institution not found');
    }
    
    logger.info('Institution verified successfully:', { institutionId: id });
    return successResponse(res, institution, 'Institution verified successfully');
  } catch (error) {
    logger.error('Error verifying institution:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Get institution growth report
 */
const getGrowthReport = async (req, res) => {
  try {
    logger.info('Fetching institution growth report');
    
    const { period } = req.query;
    
    // Validation
    const errors = [];
    
    const validPeriods = ['week', 'month', 'quarter', 'year'];
    if (period && !validPeriods.includes(period)) {
      errors.push('Invalid period. Must be one of: ' + validPeriods.join(', '));
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const report = await institutionService.getGrowthReport(period || 'month');
    
    logger.info('Growth report fetched successfully');
    return successResponse(res, report, 'Growth report retrieved successfully');
  } catch (error) {
    logger.error('Error fetching growth report:', error);
    return errorResponse(res, error.message);
  }
};

/**
 * Send subscription renewal reminders
 */
const sendRenewalReminders = async (req, res) => {
  try {
    logger.info('Sending subscription renewal reminders');
    
    const { daysBeforeExpiry } = req.body;
    
    // Validation
    const errors = [];
    
    if (daysBeforeExpiry !== undefined) {
      const daysNum = parseInt(daysBeforeExpiry);
      if (isNaN(daysNum) || daysNum < 1) {
        errors.push('Days before expiry must be at least 1');
      } else if (daysNum > 90) {
        errors.push('Days before expiry must not exceed 90');
      }
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const result = await institutionService.sendRenewalReminders(daysBeforeExpiry || 7);
    
    logger.info('Renewal reminders sent successfully:', { count: result.count });
    return successResponse(res, result, 'Renewal reminders sent successfully');
  } catch (error) {
    logger.error('Error sending renewal reminders:', error);
    return errorResponse(res, error.message);
  }
};

// Export all functions
export default {
  createInstitution,
  getInstitutions,
  getInstitutionById,
  updateInstitution,
  deleteInstitution,
  getInstitutionsByType,
  getInstitutionsByCategory,
  getInstitutionsBySubscriptionStatus,
  getExpiringSubscriptions,
  searchInstitutions,
  getSubscriptionAnalytics,
  getComplianceStatus,
  getInstitutionMetrics,
  getDashboardStats,
  migrateFromSchool,
  updateExpiredSubscriptions,
  suspendInstitution,
  activateInstitution,
  updateNotes,
  addTag,
  removeTag,
  updateSubscription,
  updateAnalytics,
  updateCompliance,
  updateLastLogin,
  getRevenueReport,
  bulkUpdateInstitutions,
  exportInstitutions,
  getInstitutionAnalytics,
  getInstitutionsByStatus,
  verifyInstitution,
  getGrowthReport,
  sendRenewalReminders
};
