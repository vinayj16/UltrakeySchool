import dashboardService from '../services/dashboardService.js';
import { successResponse, errorResponse, validationErrorResponse, forbiddenResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

// Valid user roles
const VALID_ROLES = ['student', 'teacher', 'parent', 'admin', 'principal', 'superadmin', 'staff'];

// Admin roles
const ADMIN_ROLES = ['admin', 'principal', 'superadmin'];

/**
 * Validate MongoDB ObjectId
 */
const validateObjectId = (id, fieldName = 'id') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { valid: false, error: { field: fieldName, message: 'Invalid ' + fieldName + ' format' } };
  }
  return { valid: true };
};

/**
 * Get dashboard data based on user role
 */
const getDashboard = async (req, res, next) => {
  try {
    const { userId, role, schoolId } = req.user;

    // Validate user data
    const errors = [];
    if (!userId) {
      errors.push({ field: 'userId', message: 'User ID is required' });
    } else {
      const validation = validateObjectId(userId, 'userId');
      if (!validation.valid) {
        errors.push(validation.error);
      }
    }
    if (!role) {
      errors.push({ field: 'role', message: 'User role is required' });
    } else if (!VALID_ROLES.includes(role)) {
      errors.push({ field: 'role', message: 'Invalid user role' });
    }
    if (schoolId) {
      const validation = validateObjectId(schoolId, 'schoolId');
      if (!validation.valid) {
        errors.push(validation.error);
      }
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info('Fetching dashboard for user: ' + userId + ' with role: ' + role);

    let dashboardData;

    switch (role) {
      case 'student':
        dashboardData = await dashboardService.getStudentDashboard(userId, schoolId);
        break;
      case 'teacher':
        dashboardData = await dashboardService.getTeacherDashboard(userId, schoolId);
        break;
      case 'parent':
        dashboardData = await dashboardService.getParentDashboard(userId, schoolId);
        break;
      case 'admin':
      case 'principal':
      case 'superadmin':
        dashboardData = await dashboardService.getAdminDashboard(schoolId);
        break;
      default:
        return forbiddenResponse(res, 'Invalid user role for dashboard access');
    }

    return successResponse(res, dashboardData, 'Dashboard data fetched successfully', {
      role
    });
  } catch (error) {
    logger.error('Error fetching dashboard:', error);
    return errorResponse(res, 'Failed to fetch dashboard data', 500);
  }
};

/**
 * Get student dashboard
 */
const getStudentDashboard = async (req, res, next) => {
  try {
    const { userId, schoolId } = req.user;

    // Validate user data
    const errors = [];
    if (!userId) {
      errors.push({ field: 'userId', message: 'User ID is required' });
    } else {
      const validation = validateObjectId(userId, 'userId');
      if (!validation.valid) {
        errors.push(validation.error);
      }
    }
    if (schoolId) {
      const validation = validateObjectId(schoolId, 'schoolId');
      if (!validation.valid) {
        errors.push(validation.error);
      }
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info('Fetching student dashboard for user: ' + userId);
    const dashboardData = await dashboardService.getStudentDashboard(userId, schoolId);

    return successResponse(res, dashboardData, 'Student dashboard fetched successfully');
  } catch (error) {
    logger.error('Error fetching student dashboard:', error);
    return errorResponse(res, 'Failed to fetch student dashboard', 500);
  }
};

/**
 * Get teacher dashboard
 */
const getTeacherDashboard = async (req, res, next) => {
  try {
    const { userId, schoolId } = req.user;

    // Validate user data
    const errors = [];
    if (!userId) {
      errors.push({ field: 'userId', message: 'User ID is required' });
    } else {
      const validation = validateObjectId(userId, 'userId');
      if (!validation.valid) {
        errors.push(validation.error);
      }
    }
    if (schoolId) {
      const validation = validateObjectId(schoolId, 'schoolId');
      if (!validation.valid) {
        errors.push(validation.error);
      }
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info('Fetching teacher dashboard for user: ' + userId);
    const dashboardData = await dashboardService.getTeacherDashboard(userId, schoolId);

    return successResponse(res, dashboardData, 'Teacher dashboard fetched successfully');
  } catch (error) {
    logger.error('Error fetching teacher dashboard:', error);
    return errorResponse(res, 'Failed to fetch teacher dashboard', 500);
  }
};

/**
 * Get parent dashboard
 */
const getParentDashboard = async (req, res, next) => {
  try {
    const { userId, schoolId } = req.user;

    // Validate user data
    const errors = [];
    if (!userId) {
      errors.push({ field: 'userId', message: 'User ID is required' });
    } else {
      const validation = validateObjectId(userId, 'userId');
      if (!validation.valid) {
        errors.push(validation.error);
      }
    }
    if (schoolId) {
      const validation = validateObjectId(schoolId, 'schoolId');
      if (!validation.valid) {
        errors.push(validation.error);
      }
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info('Fetching parent dashboard for user: ' + userId);
    const dashboardData = await dashboardService.getParentDashboard(userId, schoolId);

    return successResponse(res, dashboardData, 'Parent dashboard fetched successfully');
  } catch (error) {
    logger.error('Error fetching parent dashboard:', error);
    return errorResponse(res, 'Failed to fetch parent dashboard', 500);
  }
};

/**
 * Get admin dashboard
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    const { schoolId } = req.user;

    // Validate schoolId
    if (schoolId) {
      const validation = validateObjectId(schoolId, 'schoolId');
      if (!validation.valid) {
        return validationErrorResponse(res, [validation.error]);
      }
    }

    logger.info('Fetching admin dashboard for school: ' + schoolId);
    const dashboardData = await dashboardService.getAdminDashboard(schoolId);

    return successResponse(res, dashboardData, 'Admin dashboard fetched successfully');
  } catch (error) {
    logger.error('Error fetching admin dashboard:', error);
    return errorResponse(res, 'Failed to fetch admin dashboard', 500);
  }
};

/**
 * Get quick stats
 */
const getQuickStats = async (req, res, next) => {
  try {
    const { userId, role, schoolId } = req.user;

    // Validate user data
    const errors = [];
    if (!userId) {
      errors.push({ field: 'userId', message: 'User ID is required' });
    }
    if (!role) {
      errors.push({ field: 'role', message: 'User role is required' });
    } else if (!VALID_ROLES.includes(role)) {
      errors.push({ field: 'role', message: 'Invalid user role' });
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info('Fetching quick stats for user: ' + userId + ' with role: ' + role);

    let stats;
    switch (role) {
      case 'student':
        const studentData = await dashboardService.getStudentDashboard(userId, schoolId);
        stats = studentData.quickStats || {};
        break;
      case 'teacher':
        const teacherData = await dashboardService.getTeacherDashboard(userId, schoolId);
        stats = teacherData.quickStats || {};
        break;
      case 'admin':
      case 'principal':
      case 'superadmin':
        const adminData = await dashboardService.getAdminDashboard(schoolId);
        stats = adminData.overview || {};
        break;
      default:
        stats = {};
    }

    return successResponse(res, stats, 'Quick stats fetched successfully', {
      role
    });
  } catch (error) {
    logger.error('Error fetching quick stats:', error);
    return errorResponse(res, 'Failed to fetch quick stats', 500);
  }
};

/**
 * Get institute admin dashboard
 */
const getInstituteAdminDashboard = async (req, res, next) => {
  try {
    const { institutionId } = req.user;

    // Validate institutionId
    if (!institutionId) {
      return validationErrorResponse(res, [{ field: 'institutionId', message: 'Institution ID is required' }]);
    }

    const validation = validateObjectId(institutionId, 'institutionId');
    if (!validation.valid) {
      return validationErrorResponse(res, [validation.error]);
    }

    logger.info('Fetching institute admin dashboard for institution: ' + institutionId);
    const dashboardData = await dashboardService.getInstituteAdminDashboard(institutionId);

    return successResponse(res, dashboardData, 'Institute admin dashboard fetched successfully');
  } catch (error) {
    logger.error('Error fetching institute admin dashboard:', error);
    return errorResponse(res, 'Failed to fetch institute admin dashboard', 500);
  }
};

/**
 * Get dashboard widgets
 */
const getDashboardWidgets = async (req, res) => {
  try {
    const { userId, role, schoolId } = req.user;
    const { category } = req.query;

    // Validate user data
    const errors = [];
    if (!userId) {
      errors.push({ field: 'userId', message: 'User ID is required' });
    }
    if (!role || !VALID_ROLES.includes(role)) {
      errors.push({ field: 'role', message: 'Valid user role is required' });
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info('Fetching dashboard widgets for user: ' + userId);
    const widgets = await dashboardService.getDashboardWidgets(userId, role, schoolId, category);

    return successResponse(res, widgets, 'Dashboard widgets fetched successfully', {
      role,
      category: category || 'all'
    });
  } catch (error) {
    logger.error('Error fetching dashboard widgets:', error);
    return errorResponse(res, 'Failed to fetch dashboard widgets', 500);
  }
};

/**
 * Get recent activities
 */
const getRecentActivities = async (req, res) => {
  try {
    const { userId, role, schoolId } = req.user;
    const { limit = 10 } = req.query;

    // Validate limit
    const errors = [];
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      errors.push({ field: 'limit', message: 'Limit must be between 1 and 50' });
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info('Fetching recent activities for user: ' + userId);
    const activities = await dashboardService.getRecentActivities(userId, role, schoolId, limitNum);

    return successResponse(res, activities, 'Recent activities fetched successfully', {
      limit: limitNum
    });
  } catch (error) {
    logger.error('Error fetching recent activities:', error);
    return errorResponse(res, 'Failed to fetch recent activities', 500);
  }
};

/**
 * Get notifications
 */
const getNotifications = async (req, res) => {
  try {
    const { userId, schoolId } = req.user;
    const { unreadOnly = false, limit = 20 } = req.query;

    // Validate limit
    const errors = [];
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push({ field: 'limit', message: 'Limit must be between 1 and 100' });
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info('Fetching notifications for user: ' + userId);
    const notifications = await dashboardService.getNotifications(userId, schoolId, {
      unreadOnly: unreadOnly === 'true',
      limit: limitNum
    });

    return successResponse(res, notifications, 'Notifications fetched successfully', {
      unreadOnly,
      limit: limitNum
    });
  } catch (error) {
    logger.error('Error fetching notifications:', error);
    return errorResponse(res, 'Failed to fetch notifications', 500);
  }
};

/**
 * Get upcoming events
 */
const getUpcomingEvents = async (req, res) => {
  try {
    const { userId, role, schoolId } = req.user;
    const { days = 7 } = req.query;

    // Validate days
    const errors = [];
    const daysNum = parseInt(days);
    if (isNaN(daysNum) || daysNum < 1 || daysNum > 90) {
      errors.push({ field: 'days', message: 'Days must be between 1 and 90' });
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info('Fetching upcoming events for user: ' + userId);
    const events = await dashboardService.getUpcomingEvents(userId, role, schoolId, daysNum);

    return successResponse(res, events, 'Upcoming events fetched successfully', {
      days: daysNum
    });
  } catch (error) {
    logger.error('Error fetching upcoming events:', error);
    return errorResponse(res, 'Failed to fetch upcoming events', 500);
  }
};

/**
 * Get performance summary
 */
const getPerformanceSummary = async (req, res) => {
  try {
    const { userId, role, schoolId } = req.user;
    const { period = 'month' } = req.query;

    // Validate period
    const validPeriods = ['week', 'month', 'quarter', 'year'];
    if (!validPeriods.includes(period)) {
      return validationErrorResponse(res, [{ field: 'period', message: 'Period must be one of: ' + validPeriods.join(', ') }]);
    }

    logger.info('Fetching performance summary for user: ' + userId);
    const summary = await dashboardService.getPerformanceSummary(userId, role, schoolId, period);

    return successResponse(res, summary, 'Performance summary fetched successfully', {
      period
    });
  } catch (error) {
    logger.error('Error fetching performance summary:', error);
    return errorResponse(res, 'Failed to fetch performance summary', 500);
  }
};

/**
 * Get attendance summary
 */
const getAttendanceSummary = async (req, res) => {
  try {
    const { userId, role, schoolId } = req.user;
    const { startDate, endDate } = req.query;

    // Validate date range if provided
    const errors = [];
    if (startDate && isNaN(new Date(startDate).getTime())) {
      errors.push({ field: 'startDate', message: 'Invalid start date format' });
    }
    if (endDate && isNaN(new Date(endDate).getTime())) {
      errors.push({ field: 'endDate', message: 'Invalid end date format' });
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errors.push({ field: 'dateRange', message: 'Start date must be before end date' });
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info('Fetching attendance summary for user: ' + userId);
    const summary = await dashboardService.getAttendanceSummary(userId, role, schoolId, {
      startDate,
      endDate
    });

    return successResponse(res, summary, 'Attendance summary fetched successfully', {
      filters: { startDate, endDate }
    });
  } catch (error) {
    logger.error('Error fetching attendance summary:', error);
    return errorResponse(res, 'Failed to fetch attendance summary', 500);
  }
};

/**
 * Get fee summary
 */
const getFeeSummary = async (req, res) => {
  try {
    const { userId, role, schoolId } = req.user;

    // Validate user data
    if (!userId) {
      return validationErrorResponse(res, [{ field: 'userId', message: 'User ID is required' }]);
    }

    logger.info('Fetching fee summary for user: ' + userId);
    const summary = await dashboardService.getFeeSummary(userId, role, schoolId);

    return successResponse(res, summary, 'Fee summary fetched successfully');
  } catch (error) {
    logger.error('Error fetching fee summary:', error);
    return errorResponse(res, 'Failed to fetch fee summary', 500);
  }
};

/**
 * Get announcements
 */
const getAnnouncements = async (req, res) => {
  try {
    const { schoolId } = req.user;
    const { limit = 5, priority } = req.query;

    // Validate limit
    const errors = [];
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 20) {
      errors.push({ field: 'limit', message: 'Limit must be between 1 and 20' });
    }

    // Validate priority if provided
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (priority && !validPriorities.includes(priority)) {
      errors.push({ field: 'priority', message: 'Priority must be one of: ' + validPriorities.join(', ') });
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    logger.info('Fetching announcements for school: ' + schoolId);
    const announcements = await dashboardService.getAnnouncements(schoolId, {
      limit: limitNum,
      priority
    });

    return successResponse(res, announcements, 'Announcements fetched successfully', {
      limit: limitNum,
      priority: priority || 'all'
    });
  } catch (error) {
    logger.error('Error fetching announcements:', error);
    return errorResponse(res, 'Failed to fetch announcements', 500);
  }
};

/**
 * Refresh dashboard cache
 */
const refreshDashboard = async (req, res) => {
  try {
    const { userId, role, schoolId } = req.user;

    // Validate user data
    if (!userId || !role) {
      return validationErrorResponse(res, [{ field: 'user', message: 'Valid user data is required' }]);
    }

    logger.info('Refreshing dashboard cache for user: ' + userId);
    await dashboardService.refreshDashboardCache(userId, role, schoolId);

    return successResponse(res, null, 'Dashboard cache refreshed successfully');
  } catch (error) {
    logger.error('Error refreshing dashboard cache:', error);
    return errorResponse(res, 'Failed to refresh dashboard cache', 500);
  }
};


export default {
  getDashboard,
  getStudentDashboard,
  getTeacherDashboard,
  getParentDashboard,
  getAdminDashboard,
  getQuickStats,
  getInstituteAdminDashboard,
  getDashboardWidgets,
  getRecentActivities,
  getNotifications,
  getUpcomingEvents,
  getPerformanceSummary,
  getAttendanceSummary,
  getFeeSummary,
  getAnnouncements,
  refreshDashboard
};
