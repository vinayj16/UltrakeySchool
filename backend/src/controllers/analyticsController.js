import analyticsService from '../services/analyticsService.js';
import { successResponse, errorResponse, validationErrorResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

// Valid period values
const VALID_PERIODS = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];

// Valid metric types
const VALID_METRICS = ['institutions', 'revenue', 'users', 'subscriptions', 'modules', 'support'];

/**
 * Validate period parameter
 */
const validatePeriod = (period) => {
  if (!period) return true;
  return VALID_PERIODS.includes(period);
};

/**
 * Validate date range
 */
const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end && !isNaN(start.getTime()) && !isNaN(end.getTime());
};

const getFullAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, includeMetrics } = req.query;

    // Validate date range if provided
    if (startDate && endDate && !validateDateRange(startDate, endDate)) {
      return validationErrorResponse(res, [{ field: 'dateRange', message: 'Valid start and end dates are required' }]);
    }

    logger.info('Fetching full analytics');
    const analytics = await analyticsService.getFullAnalytics({ startDate, endDate, includeMetrics });
    
    return successResponse(res, analytics, 'Full analytics fetched successfully', {
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching full analytics:', error);
    next(error);
  }
};

const getInstitutionGrowth = async (req, res, next) => {
  try {
    const { period = 'monthly', startDate, endDate, institutionType } = req.query;

    // Validate period
    if (!validatePeriod(period)) {
      return validationErrorResponse(res, [{ field: 'period', message: 'Period must be one of: ' + VALID_PERIODS.join(', ') }]);
    }

    // Validate date range if provided
    if (startDate && endDate && !validateDateRange(startDate, endDate)) {
      return validationErrorResponse(res, [{ field: 'dateRange', message: 'Valid start and end dates are required' }]);
    }

    logger.info(`Fetching institution growth for period: ${period}`);
    const data = await analyticsService.getInstitutionGrowth(period, { startDate, endDate, institutionType });
    
    return successResponse(res, data, 'Institution growth data fetched successfully', {
      period,
      filters: { institutionType }
    });
  } catch (error) {
    logger.error('Error fetching institution growth:', error);
    next(error);
  }
};

const getRevenueGrowth = async (req, res, next) => {
  try {
    const { period = 'monthly', startDate, endDate, planType, currency = 'USD' } = req.query;

    // Validate period
    if (!validatePeriod(period)) {
      return validationErrorResponse(res, [{ field: 'period', message: 'Period must be one of: ' + VALID_PERIODS.join(', ') }]);
    }

    // Validate date range if provided
    if (startDate && endDate && !validateDateRange(startDate, endDate)) {
      return validationErrorResponse(res, [{ field: 'dateRange', message: 'Valid start and end dates are required' }]);
    }

    logger.info(`Fetching revenue growth for period: ${period}`);
    const data = await analyticsService.getRevenueGrowth(period, { startDate, endDate, planType, currency });
    
    return successResponse(res, data, 'Revenue growth data fetched successfully', {
      period,
      currency,
      filters: { planType }
    });
  } catch (error) {
    logger.error('Error fetching revenue growth:', error);
    next(error);
  }
};

const getPlanDistribution = async (req, res, next) => {
  try {
    const { includeInactive = false, groupBy = 'plan' } = req.query;

    // Validate groupBy
    const validGroupBy = ['plan', 'type', 'tier'];
    if (!validGroupBy.includes(groupBy)) {
      return validationErrorResponse(res, [{ field: 'groupBy', message: 'groupBy must be one of: ' + validGroupBy.join(', ') }]);
    }

    logger.info('Fetching plan distribution');
    const data = await analyticsService.getPlanDistribution({ includeInactive: includeInactive === 'true', groupBy });
    
    return successResponse(res, data, 'Plan distribution data fetched successfully');
  } catch (error) {
    logger.error('Error fetching plan distribution:', error);
    next(error);
  }
};

const getInstitutionTypeDistribution = async (req, res, next) => {
  try {
    const { region, country, minSize, maxSize } = req.query;

    // Validate size range if provided
    if (minSize && maxSize) {
      const min = parseInt(minSize);
      const max = parseInt(maxSize);
      if (isNaN(min) || isNaN(max) || min > max || min < 0) {
        return validationErrorResponse(res, [{ field: 'sizeRange', message: 'Valid size range is required' }]);
      }
    }

    logger.info('Fetching institution type distribution');
    const data = await analyticsService.getInstitutionTypeDistribution({ region, country, minSize, maxSize });
    
    return successResponse(res, data, 'Institution type distribution fetched successfully', {
      filters: { region, country, minSize, maxSize }
    });
  } catch (error) {
    logger.error('Error fetching institution type distribution:', error);
    next(error);
  }
};

const getChurnRate = async (req, res, next) => {
  try {
    const { period = 'monthly', startDate, endDate, planType } = req.query;

    // Validate period
    if (!validatePeriod(period)) {
      return validationErrorResponse(res, [{ field: 'period', message: 'Period must be one of: ' + VALID_PERIODS.join(', ') }]);
    }

    // Validate date range if provided
    if (startDate && endDate && !validateDateRange(startDate, endDate)) {
      return validationErrorResponse(res, [{ field: 'dateRange', message: 'Valid start and end dates are required' }]);
    }

    logger.info(`Fetching churn rate for period: ${period}`);
    const data = await analyticsService.getChurnRate(period, { startDate, endDate, planType });
    
    return successResponse(res, data, 'Churn rate data fetched successfully', {
      period,
      filters: { planType }
    });
  } catch (error) {
    logger.error('Error fetching churn rate:', error);
    next(error);
  }
};

const getRenewalRate = async (req, res, next) => {
  try {
    const { period = 'monthly', startDate, endDate, planType } = req.query;

    // Validate period
    if (!validatePeriod(period)) {
      return validationErrorResponse(res, [{ field: 'period', message: 'Period must be one of: ' + VALID_PERIODS.join(', ') }]);
    }

    // Validate date range if provided
    if (startDate && endDate && !validateDateRange(startDate, endDate)) {
      return validationErrorResponse(res, [{ field: 'dateRange', message: 'Valid start and end dates are required' }]);
    }

    logger.info(`Fetching renewal rate for period: ${period}`);
    const data = await analyticsService.getRenewalRate(period, { startDate, endDate, planType });
    
    return successResponse(res, data, 'Renewal rate data fetched successfully', {
      period,
      filters: { planType }
    });
  } catch (error) {
    logger.error('Error fetching renewal rate:', error);
    next(error);
  }
};

const getBranchGrowth = async (req, res, next) => {
  try {
    const { period = 'monthly', startDate, endDate, institutionId, region } = req.query;

    // Validate period
    if (!validatePeriod(period)) {
      return validationErrorResponse(res, [{ field: 'period', message: 'Period must be one of: ' + VALID_PERIODS.join(', ') }]);
    }

    // Validate date range if provided
    if (startDate && endDate && !validateDateRange(startDate, endDate)) {
      return validationErrorResponse(res, [{ field: 'dateRange', message: 'Valid start and end dates are required' }]);
    }

    logger.info(`Fetching branch growth for period: ${period}`);
    const data = await analyticsService.getBranchGrowth(period, { startDate, endDate, institutionId, region });
    
    return successResponse(res, data, 'Branch growth data fetched successfully', {
      period,
      filters: { institutionId, region }
    });
  } catch (error) {
    logger.error('Error fetching branch growth:', error);
    next(error);
  }
};

const getModuleUsage = async (req, res, next) => {
  try {
    const { startDate, endDate, moduleType, institutionType, minUsage } = req.query;

    // Validate date range if provided
    if (startDate && endDate && !validateDateRange(startDate, endDate)) {
      return validationErrorResponse(res, [{ field: 'dateRange', message: 'Valid start and end dates are required' }]);
    }

    // Validate minUsage if provided
    if (minUsage && (isNaN(minUsage) || minUsage < 0 || minUsage > 100)) {
      return validationErrorResponse(res, [{ field: 'minUsage', message: 'Minimum usage must be between 0 and 100' }]);
    }

    logger.info('Fetching module usage data');
    const data = await analyticsService.getModuleUsage({ startDate, endDate, moduleType, institutionType, minUsage });
    
    return successResponse(res, data, 'Module usage data fetched successfully', {
      filters: { moduleType, institutionType, minUsage }
    });
  } catch (error) {
    logger.error('Error fetching module usage:', error);
    next(error);
  }
};

const getSupportLoad = async (req, res, next) => {
  try {
    const { period = 'monthly', startDate, endDate, priority, status, category } = req.query;

    // Validate period
    if (!validatePeriod(period)) {
      return validationErrorResponse(res, [{ field: 'period', message: 'Period must be one of: ' + VALID_PERIODS.join(', ') }]);
    }

    // Validate date range if provided
    if (startDate && endDate && !validateDateRange(startDate, endDate)) {
      return validationErrorResponse(res, [{ field: 'dateRange', message: 'Valid start and end dates are required' }]);
    }

    logger.info(`Fetching support load for period: ${period}`);
    const data = await analyticsService.getSupportLoad(period, { startDate, endDate, priority, status, category });
    
    return successResponse(res, data, 'Support load data fetched successfully', {
      period,
      filters: { priority, status, category }
    });
  } catch (error) {
    logger.error('Error fetching support load:', error);
    next(error);
  }
};


/**
 * Get analytics summary
 */
const getAnalyticsSummary = async (req, res, next) => {
  try {
    const { metrics = 'all' } = req.query;

    // Parse metrics
    const requestedMetrics = metrics === 'all' ? VALID_METRICS : metrics.split(',');
    
    // Validate metrics
    const invalidMetrics = requestedMetrics.filter(m => !VALID_METRICS.includes(m));
    if (invalidMetrics.length > 0) {
      return validationErrorResponse(res, [{ field: 'metrics', message: 'Invalid metrics: ' + invalidMetrics.join(', ') }]);
    }

    logger.info('Fetching analytics summary');
    const summary = await analyticsService.getAnalyticsSummary(requestedMetrics);
    
    return successResponse(res, summary, 'Analytics summary fetched successfully', {
      metrics: requestedMetrics,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching analytics summary:', error);
    next(error);
  }
};

/**
 * Compare analytics between periods
 */
const compareAnalytics = async (req, res, next) => {
  try {
    const { metric, period1, period2, startDate1, endDate1, startDate2, endDate2 } = req.query;

    // Validate metric
    if (!metric || !VALID_METRICS.includes(metric)) {
      return validationErrorResponse(res, [{ field: 'metric', message: 'Metric must be one of: ' + VALID_METRICS.join(', ') }]);
    }

    // Validate periods
    if (!validatePeriod(period1) || !validatePeriod(period2)) {
      return validationErrorResponse(res, [{ field: 'period', message: 'Periods must be one of: ' + VALID_PERIODS.join(', ') }]);
    }

    // Validate date ranges
    if (!validateDateRange(startDate1, endDate1) || !validateDateRange(startDate2, endDate2)) {
      return validationErrorResponse(res, [{ field: 'dateRange', message: 'Valid date ranges are required for both periods' }]);
    }

    logger.info(`Comparing ${metric} analytics: ${period1} vs ${period2}`);
    const comparison = await analyticsService.compareAnalytics(metric, {
      period1: { period: period1, startDate: startDate1, endDate: endDate1 },
      period2: { period: period2, startDate: startDate2, endDate: endDate2 }
    });
    
    return successResponse(res, comparison, 'Analytics comparison completed successfully');
  } catch (error) {
    logger.error('Error comparing analytics:', error);
    next(error);
  }
};

/**
 * Export analytics data
 */
const exportAnalytics = async (req, res, next) => {
  try {
    const { metric = 'all', period = 'monthly', format = 'json', startDate, endDate } = req.query;

    // Validate metric
    if (metric !== 'all' && !VALID_METRICS.includes(metric)) {
      return validationErrorResponse(res, [{ field: 'metric', message: 'Metric must be one of: ' + VALID_METRICS.join(', ') + ', or "all"' }]);
    }

    // Validate period
    if (!validatePeriod(period)) {
      return validationErrorResponse(res, [{ field: 'period', message: 'Period must be one of: ' + VALID_PERIODS.join(', ') }]);
    }

    // Validate format
    const validFormats = ['json', 'csv', 'xlsx', 'pdf'];
    if (!validFormats.includes(format)) {
      return validationErrorResponse(res, [{ field: 'format', message: 'Format must be one of: ' + validFormats.join(', ') }]);
    }

    // Validate date range if provided
    if (startDate && endDate && !validateDateRange(startDate, endDate)) {
      return validationErrorResponse(res, [{ field: 'dateRange', message: 'Valid start and end dates are required' }]);
    }

    logger.info(`Exporting ${metric} analytics in ${format} format`);
    const data = await analyticsService.exportAnalytics(metric, period, { format, startDate, endDate });
    
    // TODO: Implement CSV/XLSX/PDF conversion
    if (format === 'json') {
      return successResponse(res, data, 'Analytics exported successfully', {
        format,
        metric,
        period,
        exportedAt: new Date().toISOString()
      });
    }

    return errorResponse(res, `Export format ${format} not yet implemented`, 501);
  } catch (error) {
    logger.error('Error exporting analytics:', error);
    next(error);
  }
};

/**
 * Get real-time analytics
 */
const getRealtimeAnalytics = async (req, res, next) => {
  try {
    const { metrics = 'all', refreshInterval = 60 } = req.query;

    // Parse metrics
    const requestedMetrics = metrics === 'all' ? VALID_METRICS : metrics.split(',');
    
    // Validate metrics
    const invalidMetrics = requestedMetrics.filter(m => !VALID_METRICS.includes(m));
    if (invalidMetrics.length > 0) {
      return validationErrorResponse(res, [{ field: 'metrics', message: 'Invalid metrics: ' + invalidMetrics.join(', ') }]);
    }

    // Validate refresh interval
    const interval = parseInt(refreshInterval);
    if (isNaN(interval) || interval < 10 || interval > 300) {
      return validationErrorResponse(res, [{ field: 'refreshInterval', message: 'Refresh interval must be between 10 and 300 seconds' }]);
    }

    logger.info('Fetching real-time analytics');
    const realtimeData = await analyticsService.getRealtimeAnalytics(requestedMetrics);
    
    return successResponse(res, realtimeData, 'Real-time analytics fetched successfully', {
      metrics: requestedMetrics,
      refreshInterval: interval,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching real-time analytics:', error);
    next(error);
  }
};

/**
 * Get analytics trends
 */
const getAnalyticsTrends = async (req, res, next) => {
  try {
    const { metric, period = 'monthly', dataPoints = 12, trendType = 'linear' } = req.query;

    // Validate metric
    if (!metric || !VALID_METRICS.includes(metric)) {
      return validationErrorResponse(res, [{ field: 'metric', message: 'Metric must be one of: ' + VALID_METRICS.join(', ') }]);
    }

    // Validate period
    if (!validatePeriod(period)) {
      return validationErrorResponse(res, [{ field: 'period', message: 'Period must be one of: ' + VALID_PERIODS.join(', ') }]);
    }

    // Validate dataPoints
    const points = parseInt(dataPoints);
    if (isNaN(points) || points < 2 || points > 100) {
      return validationErrorResponse(res, [{ field: 'dataPoints', message: 'Data points must be between 2 and 100' }]);
    }

    // Validate trendType
    const validTrendTypes = ['linear', 'exponential', 'moving_average'];
    if (!validTrendTypes.includes(trendType)) {
      return validationErrorResponse(res, [{ field: 'trendType', message: 'Trend type must be one of: ' + validTrendTypes.join(', ') }]);
    }

    logger.info(`Fetching ${metric} trends with ${trendType} analysis`);
    const trends = await analyticsService.getAnalyticsTrends(metric, period, { dataPoints: points, trendType });
    
    return successResponse(res, trends, 'Analytics trends fetched successfully', {
      metric,
      period,
      trendType
    });
  } catch (error) {
    logger.error('Error fetching analytics trends:', error);
    next(error);
  }
};

/**
 * Get top performers
 */
const getTopPerformers = async (req, res, next) => {
  try {
    const { metric, limit = 10, period = 'monthly', startDate, endDate } = req.query;

    // Validate metric
    const validMetrics = ['revenue', 'growth', 'retention', 'usage', 'satisfaction'];
    if (!metric || !validMetrics.includes(metric)) {
      return validationErrorResponse(res, [{ field: 'metric', message: 'Metric must be one of: ' + validMetrics.join(', ') }]);
    }

    // Validate limit
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return validationErrorResponse(res, [{ field: 'limit', message: 'Limit must be between 1 and 100' }]);
    }

    // Validate period
    if (!validatePeriod(period)) {
      return validationErrorResponse(res, [{ field: 'period', message: 'Period must be one of: ' + VALID_PERIODS.join(', ') }]);
    }

    // Validate date range if provided
    if (startDate && endDate && !validateDateRange(startDate, endDate)) {
      return validationErrorResponse(res, [{ field: 'dateRange', message: 'Valid start and end dates are required' }]);
    }

    logger.info(`Fetching top ${limitNum} performers by ${metric}`);
    const performers = await analyticsService.getTopPerformers(metric, { limit: limitNum, period, startDate, endDate });
    
    return successResponse(res, performers, 'Top performers fetched successfully', {
      metric,
      limit: limitNum,
      period
    });
  } catch (error) {
    logger.error('Error fetching top performers:', error);
    next(error);
  }
};


export default {
  getFullAnalytics,
  getInstitutionGrowth,
  getRevenueGrowth,
  getPlanDistribution,
  getInstitutionTypeDistribution,
  getChurnRate,
  getRenewalRate,
  getBranchGrowth,
  getModuleUsage,
  getSupportLoad,
  getAnalyticsSummary,
  compareAnalytics,
  exportAnalytics,
  getRealtimeAnalytics,
  getAnalyticsTrends,
  getTopPerformers
};
