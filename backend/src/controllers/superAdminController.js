import superAdminService from '../services/superAdminService.js';
import { successResponse, createdResponse, errorResponse, validationErrorResponse, notFoundResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

// Validation constants
const VALID_ALERT_TYPES = ['security', 'performance', 'system', 'billing', 'user', 'error', 'warning', 'info'];
const VALID_SEVERITIES = ['critical', 'high', 'medium', 'low', 'info'];
const VALID_STATUSES = ['active', 'inactive', 'pending', 'resolved', 'archived'];
const VALID_RESOURCE_TYPES = ['school', 'user', 'subscription', 'payment', 'system', 'database', 'api'];
const VALID_INSTITUTION_TYPES = ['school', 'college', 'university', 'training_center', 'other'];
const VALID_SORT_ORDERS = ['asc', 'desc'];
const VALID_EXPORT_FORMATS = ['json', 'csv', 'xlsx', 'pdf'];
const MAX_TITLE_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_DESCRIPTION_LENGTH = 2000;

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

// Get super admin data
const getSuperAdminData = async (_req, res) => {
  try {
    logger.info('Fetching super admin data');
    
    const data = await superAdminService.getSuperAdminData();
    
    logger.info('Super admin data fetched successfully');
    return successResponse(res, data, 'Super admin data retrieved successfully');
  } catch (error) {
    logger.error('Error fetching super admin data:', error);
    return errorResponse(res, error.message);
  }
};

// Get platform health
const getPlatformHealth = async (_req, res) => {
  try {
    logger.info('Fetching platform health');
    
    const health = await superAdminService.getPlatformHealth();
    
    logger.info('Platform health fetched successfully');
    return successResponse(res, health, 'Platform health retrieved successfully');
  } catch (error) {
    logger.error('Error fetching platform health:', error);
    return errorResponse(res, error.message);
  }
};

// Update platform health
const updatePlatformHealth = async (req, res) => {
  try {
    logger.info('Updating platform health');
    
    const updates = req.body;
    
    // Validation
    const errors = [];
    
    if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
      errors.push('Updates are required');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const health = await superAdminService.updatePlatformHealth(updates);
    
    logger.info('Platform health updated successfully');
    return successResponse(res, health, 'Platform health updated successfully');
  } catch (error) {
    logger.error('Error updating platform health:', error);
    return errorResponse(res, error.message);
  }
};

// Get alerts
const getAlerts = async (req, res) => {
  try {
    logger.info('Fetching alerts');
    
    const { type, acknowledged, actionRequired, severity, page, limit } = req.query;
    
    // Validation
    const errors = [];
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;
    
    if (pageNum < 1) {
      errors.push('Page must be greater than 0');
    }
    
    if (limitNum < 1 || limitNum > 100) {
      errors.push('Limit must be between 1 and 100');
    }
    
    if (type && !VALID_ALERT_TYPES.includes(type)) {
      errors.push('Invalid alert type. Must be one of: ' + VALID_ALERT_TYPES.join(', '));
    }
    
    if (severity && !VALID_SEVERITIES.includes(severity)) {
      errors.push('Invalid severity. Must be one of: ' + VALID_SEVERITIES.join(', '));
    }
    
    if (acknowledged !== undefined && acknowledged !== 'true' && acknowledged !== 'false') {
      errors.push('Acknowledged must be true or false');
    }
    
    if (actionRequired !== undefined && actionRequired !== 'true' && actionRequired !== 'false') {
      errors.push('Action required must be true or false');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const filters = {};
    if (type) filters.type = type;
    if (severity) filters.severity = severity;
    if (acknowledged !== undefined) filters.acknowledged = acknowledged === 'true';
    if (actionRequired !== undefined) filters.actionRequired = actionRequired === 'true';
    
    const alerts = await superAdminService.getAlerts(filters, { page: pageNum, limit: limitNum });
    
    logger.info('Alerts fetched successfully:', { count: alerts.length });
    return successResponse(res, alerts, 'Alerts retrieved successfully');
  } catch (error) {
    logger.error('Error fetching alerts:', error);
    return errorResponse(res, error.message);
  }
};

// Create alert
const createAlert = async (req, res) => {
  try {
    logger.info('Creating alert');
    
    const { type, severity, title, message, actionRequired } = req.body;
    
    // Validation
    const errors = [];
    
    if (!type || type.trim().length === 0) {
      errors.push('Alert type is required');
    } else if (!VALID_ALERT_TYPES.includes(type)) {
      errors.push('Invalid alert type. Must be one of: ' + VALID_ALERT_TYPES.join(', '));
    }
    
    if (!severity || severity.trim().length === 0) {
      errors.push('Severity is required');
    } else if (!VALID_SEVERITIES.includes(severity)) {
      errors.push('Invalid severity. Must be one of: ' + VALID_SEVERITIES.join(', '));
    }
    
    if (!title || title.trim().length === 0) {
      errors.push('Title is required');
    } else if (title.length > MAX_TITLE_LENGTH) {
      errors.push('Title must not exceed ' + MAX_TITLE_LENGTH + ' characters');
    }
    
    if (!message || message.trim().length === 0) {
      errors.push('Message is required');
    } else if (message.length > MAX_MESSAGE_LENGTH) {
      errors.push('Message must not exceed ' + MAX_MESSAGE_LENGTH + ' characters');
    }
    
    if (actionRequired !== undefined && typeof actionRequired !== 'boolean') {
      errors.push('Action required must be a boolean value');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const alert = await superAdminService.createAlert(req.body);
    
    logger.info('Alert created successfully:', { alertId: alert._id, type, severity });
    return createdResponse(res, alert, 'Alert created successfully');
  } catch (error) {
    logger.error('Error creating alert:', error);
    return errorResponse(res, error.message);
  }
};

// Acknowledge alert
const acknowledgeAlert = async (req, res) => {
  try {
    logger.info('Acknowledging alert');
    
    const { alertId } = req.params;
    const userId = req.user?.userId;
    
    // Validation
    const errors = [];
    
    const alertIdError = validateObjectId(alertId, 'Alert ID');
    if (alertIdError) errors.push(alertIdError);
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const alert = await superAdminService.acknowledgeAlert(alertId, userId);
    
    if (!alert) {
      return notFoundResponse(res, 'Alert not found');
    }
    
    logger.info('Alert acknowledged successfully:', { alertId });
    return successResponse(res, alert, 'Alert acknowledged successfully');
  } catch (error) {
    logger.error('Error acknowledging alert:', error);
    return errorResponse(res, error.message);
  }
};

// Take alert action
const takeAlertAction = async (req, res) => {
  try {
    logger.info('Taking alert action');
    
    const { alertId } = req.params;
    const userId = req.user?.userId;
    
    // Validation
    const errors = [];
    
    const alertIdError = validateObjectId(alertId, 'Alert ID');
    if (alertIdError) errors.push(alertIdError);
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const alert = await superAdminService.takeAlertAction(alertId, userId);
    
    if (!alert) {
      return notFoundResponse(res, 'Alert not found');
    }
    
    logger.info('Alert action taken successfully:', { alertId });
    return successResponse(res, alert, 'Alert action taken successfully');
  } catch (error) {
    logger.error('Error taking alert action:', error);
    return errorResponse(res, error.message);
  }
};

// Delete alert
const deleteAlert = async (req, res) => {
  try {
    logger.info('Deleting alert');
    
    const { alertId } = req.params;
    
    // Validation
    const errors = [];
    
    const alertIdError = validateObjectId(alertId, 'Alert ID');
    if (alertIdError) errors.push(alertIdError);
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const alert = await superAdminService.deleteAlert(alertId);
    
    if (!alert) {
      return notFoundResponse(res, 'Alert not found');
    }
    
    logger.info('Alert deleted successfully:', { alertId });
    return successResponse(res, null, 'Alert deleted successfully');
  } catch (error) {
    logger.error('Error deleting alert:', error);
    return errorResponse(res, error.message);
  }
};

// Get activities
const getActivities = async (req, res) => {
  try {
    logger.info('Fetching activities');
    
    const { resourceType, severity, status, limit } = req.query;
    
    // Validation
    const errors = [];
    
    const limitNum = parseInt(limit) || 50;
    
    if (limitNum < 1 || limitNum > 500) {
      errors.push('Limit must be between 1 and 500');
    }
    
    if (resourceType && !VALID_RESOURCE_TYPES.includes(resourceType)) {
      errors.push('Invalid resource type. Must be one of: ' + VALID_RESOURCE_TYPES.join(', '));
    }
    
    if (severity && !VALID_SEVERITIES.includes(severity)) {
      errors.push('Invalid severity. Must be one of: ' + VALID_SEVERITIES.join(', '));
    }
    
    if (status && !VALID_STATUSES.includes(status)) {
      errors.push('Invalid status. Must be one of: ' + VALID_STATUSES.join(', '));
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const filters = {};
    if (resourceType) filters.resourceType = resourceType;
    if (severity) filters.severity = severity;
    if (status) filters.status = status;
    
    const activities = await superAdminService.getActivities(filters, limitNum);
    
    logger.info('Activities fetched successfully:', { count: activities.length });
    return successResponse(res, activities, 'Activities retrieved successfully');
  } catch (error) {
    logger.error('Error fetching activities:', error);
    return errorResponse(res, error.message);
  }
};

// Log activity
const logActivity = async (req, res) => {
  try {
    logger.info('Logging activity');
    
    const { action, resourceType, resourceId, description } = req.body;
    
    // Validation
    const errors = [];
    
    if (!action || action.trim().length === 0) {
      errors.push('Action is required');
    }
    
    if (!resourceType || resourceType.trim().length === 0) {
      errors.push('Resource type is required');
    } else if (!VALID_RESOURCE_TYPES.includes(resourceType)) {
      errors.push('Invalid resource type. Must be one of: ' + VALID_RESOURCE_TYPES.join(', '));
    }
    
    if (resourceId) {
      const resourceIdError = validateObjectId(resourceId, 'Resource ID');
      if (resourceIdError) errors.push(resourceIdError);
    }
    
    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push('Description must not exceed ' + MAX_DESCRIPTION_LENGTH + ' characters');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const activityData = {
      ...req.body,
      user: req.user?.userId,
      userName: req.user?.name || 'Super Admin',
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent']
    };
    
    const activity = await superAdminService.logActivity(activityData);
    
    logger.info('Activity logged successfully:', { activityId: activity._id, action });
    return createdResponse(res, activity, 'Activity logged successfully');
  } catch (error) {
    logger.error('Error logging activity:', error);
    return errorResponse(res, error.message);
  }
};

// Get menu items
const getMenuItems = async (req, res) => {
  try {
    logger.info('Fetching menu items');
    
    const { category } = req.query;
    
    const filters = {};
    if (category) filters.category = category;
    
    const menuItems = await superAdminService.getMenuItems(filters);
    
    logger.info('Menu items fetched successfully:', { count: menuItems.length });
    return successResponse(res, menuItems, 'Menu items retrieved successfully');
  } catch (error) {
    logger.error('Error fetching menu items:', error);
    return errorResponse(res, error.message);
  }
};

// Create menu item
const createMenuItem = async (req, res) => {
  try {
    logger.info('Creating menu item');
    
    const { title, path, icon, category } = req.body;
    const userId = req.user?.userId;
    
    // Validation
    const errors = [];
    
    if (!title || title.trim().length === 0) {
      errors.push('Title is required');
    } else if (title.length > MAX_TITLE_LENGTH) {
      errors.push('Title must not exceed ' + MAX_TITLE_LENGTH + ' characters');
    }
    
    if (!path || path.trim().length === 0) {
      errors.push('Path is required');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const menuItem = await superAdminService.createMenuItem(req.body, userId);
    
    logger.info('Menu item created successfully:', { menuItemId: menuItem._id, title });
    return createdResponse(res, menuItem, 'Menu item created successfully');
  } catch (error) {
    logger.error('Error creating menu item:', error);
    return errorResponse(res, error.message);
  }
};

// Update menu item
const updateMenuItem = async (req, res) => {
  try {
    logger.info('Updating menu item');
    
    const { menuItemId } = req.params;
    const { title } = req.body;
    
    // Validation
    const errors = [];
    
    const menuItemIdError = validateObjectId(menuItemId, 'Menu item ID');
    if (menuItemIdError) errors.push(menuItemIdError);
    
    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        errors.push('Title cannot be empty');
      } else if (title.length > MAX_TITLE_LENGTH) {
        errors.push('Title must not exceed ' + MAX_TITLE_LENGTH + ' characters');
      }
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const menuItem = await superAdminService.updateMenuItem(menuItemId, req.body);
    
    if (!menuItem) {
      return notFoundResponse(res, 'Menu item not found');
    }
    
    logger.info('Menu item updated successfully:', { menuItemId });
    return successResponse(res, menuItem, 'Menu item updated successfully');
  } catch (error) {
    logger.error('Error updating menu item:', error);
    return errorResponse(res, error.message);
  }
};

// Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    logger.info('Deleting menu item');
    
    const { menuItemId } = req.params;
    
    // Validation
    const errors = [];
    
    const menuItemIdError = validateObjectId(menuItemId, 'Menu item ID');
    if (menuItemIdError) errors.push(menuItemIdError);
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const menuItem = await superAdminService.deleteMenuItem(menuItemId);
    
    if (!menuItem) {
      return notFoundResponse(res, 'Menu item not found');
    }
    
    logger.info('Menu item deleted successfully:', { menuItemId });
    return successResponse(res, null, 'Menu item deleted successfully');
  } catch (error) {
    logger.error('Error deleting menu item:', error);
    return errorResponse(res, error.message);
  }
};

// Get institutions
const getInstitutions = async (req, res) => {
  try {
    logger.info('Fetching institutions');
    
    const { type, status, code, page, limit } = req.query;
    
    // Validation
    const errors = [];
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    
    if (pageNum < 1) {
      errors.push('Page must be greater than 0');
    }
    
    if (limitNum < 1 || limitNum > 100) {
      errors.push('Limit must be between 1 and 100');
    }
    
    if (type && !VALID_INSTITUTION_TYPES.includes(type)) {
      errors.push('Invalid institution type. Must be one of: ' + VALID_INSTITUTION_TYPES.join(', '));
    }
    
    if (status && !VALID_STATUSES.includes(status)) {
      errors.push('Invalid status. Must be one of: ' + VALID_STATUSES.join(', '));
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const filters = {};
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (code) filters.code = code.toUpperCase();
    
    const institutions = await superAdminService.getInstitutions(filters, { page: pageNum, limit: limitNum });
    
    logger.info('Institutions fetched successfully:', { count: institutions.length });
    return successResponse(res, institutions, 'Institutions retrieved successfully');
  } catch (error) {
    logger.error('Error fetching institutions:', error);
    return errorResponse(res, error.message);
  }
};

// Get dashboard stats
const getDashboardStats = async (_req, res) => {
  try {
    logger.info('Fetching dashboard statistics');
    
    const stats = await superAdminService.getDashboardStats();
    
    logger.info('Dashboard statistics fetched successfully');
    return successResponse(res, stats, 'Dashboard statistics retrieved successfully');
  } catch (error) {
    logger.error('Error fetching dashboard statistics:', error);
    return errorResponse(res, error.message);
  }
};

// Get system metrics
const getSystemMetrics = async (_req, res) => {
  try {
    logger.info('Fetching system metrics');
    
    const metrics = await superAdminService.getSystemMetrics();
    
    logger.info('System metrics fetched successfully');
    return successResponse(res, metrics, 'System metrics retrieved successfully');
  } catch (error) {
    logger.error('Error fetching system metrics:', error);
    return errorResponse(res, error.message);
  }
};

// Get alerts by severity
const getAlertsBySeverity = async (req, res) => {
  try {
    logger.info('Fetching alerts by severity');
    
    const { severity } = req.params;
    
    // Validation
    const errors = [];
    
    if (!severity) {
      errors.push('Severity is required');
    } else if (!VALID_SEVERITIES.includes(severity)) {
      errors.push('Invalid severity. Must be one of: ' + VALID_SEVERITIES.join(', '));
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const alerts = await superAdminService.getAlertsBySeverity(severity);
    
    logger.info('Alerts fetched by severity successfully:', { severity, count: alerts.length });
    return successResponse(res, alerts, 'Alerts retrieved successfully');
  } catch (error) {
    logger.error('Error fetching alerts by severity:', error);
    return errorResponse(res, error.message);
  }
};

// Bulk acknowledge alerts
const bulkAcknowledgeAlerts = async (req, res) => {
  try {
    logger.info('Bulk acknowledging alerts');
    
    const { alertIds } = req.body;
    const userId = req.user?.userId;
    
    // Validation
    const errors = [];
    
    if (!alertIds || !Array.isArray(alertIds)) {
      errors.push('Alert IDs must be an array');
    } else if (alertIds.length === 0) {
      errors.push('Alert IDs array cannot be empty');
    } else if (alertIds.length > 100) {
      errors.push('Cannot acknowledge more than 100 alerts at once');
    } else {
      for (const id of alertIds) {
        const idError = validateObjectId(id, 'Alert ID');
        if (idError) {
          errors.push(idError);
          break;
        }
      }
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const result = await superAdminService.bulkAcknowledgeAlerts(alertIds, userId);
    
    logger.info('Alerts bulk acknowledged successfully:', { count: result.modifiedCount });
    return successResponse(res, { modifiedCount: result.modifiedCount }, 'Alerts acknowledged successfully');
  } catch (error) {
    logger.error('Error bulk acknowledging alerts:', error);
    return errorResponse(res, error.message);
  }
};

// Bulk delete alerts
const bulkDeleteAlerts = async (req, res) => {
  try {
    logger.info('Bulk deleting alerts');
    
    const { alertIds } = req.body;
    
    // Validation
    const errors = [];
    
    if (!alertIds || !Array.isArray(alertIds)) {
      errors.push('Alert IDs must be an array');
    } else if (alertIds.length === 0) {
      errors.push('Alert IDs array cannot be empty');
    } else if (alertIds.length > 100) {
      errors.push('Cannot delete more than 100 alerts at once');
    } else {
      for (const id of alertIds) {
        const idError = validateObjectId(id, 'Alert ID');
        if (idError) {
          errors.push(idError);
          break;
        }
      }
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const result = await superAdminService.bulkDeleteAlerts(alertIds);
    
    logger.info('Alerts bulk deleted successfully:', { count: result.deletedCount });
    return successResponse(res, { deletedCount: result.deletedCount }, 'Alerts deleted successfully');
  } catch (error) {
    logger.error('Error bulk deleting alerts:', error);
    return errorResponse(res, error.message);
  }
};

// Export activities
const exportActivities = async (req, res) => {
  try {
    logger.info('Exporting activities');
    
    const { format, resourceType, severity, startDate, endDate } = req.query;
    
    // Validation
    const errors = [];
    
    if (!format || format.trim().length === 0) {
      errors.push('Export format is required');
    } else if (!VALID_EXPORT_FORMATS.includes(format.toLowerCase())) {
      errors.push('Invalid export format. Must be one of: ' + VALID_EXPORT_FORMATS.join(', '));
    }
    
    if (resourceType && !VALID_RESOURCE_TYPES.includes(resourceType)) {
      errors.push('Invalid resource type. Must be one of: ' + VALID_RESOURCE_TYPES.join(', '));
    }
    
    if (severity && !VALID_SEVERITIES.includes(severity)) {
      errors.push('Invalid severity. Must be one of: ' + VALID_SEVERITIES.join(', '));
    }
    
    if (startDate) {
      const date = new Date(startDate);
      if (isNaN(date.getTime())) {
        errors.push('Invalid start date format');
      }
    }
    
    if (endDate) {
      const date = new Date(endDate);
      if (isNaN(date.getTime())) {
        errors.push('Invalid end date format');
      }
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const exportData = await superAdminService.exportActivities({
      format: format.toLowerCase(),
      resourceType,
      severity,
      startDate,
      endDate
    });
    
    logger.info('Activities exported successfully:', { format });
    return successResponse(res, exportData, 'Activities exported successfully');
  } catch (error) {
    logger.error('Error exporting activities:', error);
    return errorResponse(res, error.message);
  }
};

// Get alert statistics
const getAlertStatistics = async (_req, res) => {
  try {
    logger.info('Fetching alert statistics');
    
    const statistics = await superAdminService.getAlertStatistics();
    
    logger.info('Alert statistics fetched successfully');
    return successResponse(res, statistics, 'Alert statistics retrieved successfully');
  } catch (error) {
    logger.error('Error fetching alert statistics:', error);
    return errorResponse(res, error.message);
  }
};

// Get activity statistics
const getActivityStatistics = async (req, res) => {
  try {
    logger.info('Fetching activity statistics');
    
    const { days } = req.query;
    
    // Validation
    const errors = [];
    
    const daysNum = parseInt(days) || 30;
    
    if (daysNum < 1 || daysNum > 365) {
      errors.push('Days must be between 1 and 365');
    }
    
    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }
    
    const statistics = await superAdminService.getActivityStatistics(daysNum);
    
    logger.info('Activity statistics fetched successfully:', { days: daysNum });
    return successResponse(res, statistics, 'Activity statistics retrieved successfully');
  } catch (error) {
    logger.error('Error fetching activity statistics:', error);
    return errorResponse(res, error.message);
  }
};

// Get institution statistics
const getInstitutionStatistics = async (_req, res) => {
  try {
    logger.info('Fetching institution statistics');
    
    const statistics = await superAdminService.getInstitutionStatistics();
    
    logger.info('Institution statistics fetched successfully');
    return successResponse(res, statistics, 'Institution statistics retrieved successfully');
  } catch (error) {
    logger.error('Error fetching institution statistics:', error);
    return errorResponse(res, error.message);
  }
};

// Export all functions
export default {
  getSuperAdminData,
  getPlatformHealth,
  updatePlatformHealth,
  getAlerts,
  createAlert,
  acknowledgeAlert,
  takeAlertAction,
  deleteAlert,
  getActivities,
  logActivity,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getInstitutions,
  getDashboardStats,
  getSystemMetrics,
  getAlertsBySeverity,
  bulkAcknowledgeAlerts,
  bulkDeleteAlerts,
  exportActivities,
  getAlertStatistics,
  getActivityStatistics,
  getInstitutionStatistics
};
