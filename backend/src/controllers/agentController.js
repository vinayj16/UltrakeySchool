import Agent from '../models/Agent.js';
import { successResponse, createdResponse, errorResponse, validationErrorResponse, notFoundResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

// Valid agent statuses
const VALID_STATUSES = ['Active', 'Inactive', 'Suspended', 'Pending'];

/**
 * Validate MongoDB ObjectId
 */
const validateObjectId = (id, fieldName = 'id') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { valid: false, error: { field: fieldName, message: `Invalid ${fieldName} format` } };
  }
  return { valid: true };
};

/**
 * Validate email format
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone format
 */
const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
};

// @desc    Create a new agent
// @route   POST /api/v1/agents
// @access  Private (Super Admin)
const createAgent = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      country,
      postalCode,
      commissionRate,
      status,
      notes
    } = req.body;

    // Validate required fields
    const errors = [];
    if (!name || name.trim().length < 2) {
      errors.push({ field: 'name', message: 'Name is required and must be at least 2 characters' });
    }
    if (!email || !validateEmail(email)) {
      errors.push({ field: 'email', message: 'Valid email is required' });
    }
    if (!phone || !validatePhone(phone)) {
      errors.push({ field: 'phone', message: 'Valid phone number is required' });
    }
    if (commissionRate !== undefined && (isNaN(commissionRate) || commissionRate < 0 || commissionRate > 100)) {
      errors.push({ field: 'commissionRate', message: 'Commission rate must be between 0 and 100' });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      errors.push({ field: 'status', message: 'Status must be one of: ' + VALID_STATUSES.join(', ') });
    }

    if (errors.length > 0) {
      return validationErrorResponse(res, errors);
    }

    // Check if agent with this email already exists
    const existingAgent = await Agent.findOne({ 
      email: email.toLowerCase(),
      tenantId: req.user.tenantId 
    });

    if (existingAgent) {
      return errorResponse(res, 'An agent with this email already exists', 409);
    }

    // Create new agent
    const agent = await Agent.create({
      name,
      email: email.toLowerCase(),
      phone,
      address,
      city,
      state,
      country,
      postalCode,
      commissionRate,
      status: status || 'Active',
      notes,
      tenantId: req.user.tenantId,
      createdBy: req.user._id,
      updatedBy: req.user._id
    });

    logger.info(`New agent created: ${agent._id} by user: ${req.user._id}`);

    return createdResponse(res, agent, 'Agent created successfully');
  } catch (error) {
    logger.error('Error creating agent:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return errorResponse(res, 'An agent with this email already exists', 409);
    }

    return errorResponse(res, 'Error creating agent', 500);
  }
};

// @desc    Get all agents
// @route   GET /api/v1/agents
// @access  Private (Super Admin)
const getAgents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      city,
      state,
      country,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return validationErrorResponse(res, [{ field: 'status', message: 'Status must be one of: ' + VALID_STATUSES.join(', ') }]);
    }

    // Validate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    if (isNaN(pageNum) || pageNum < 1) {
      return validationErrorResponse(res, [{ field: 'page', message: 'Page must be a positive integer' }]);
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return validationErrorResponse(res, [{ field: 'limit', message: 'Limit must be between 1 and 100' }]);
    }

    // Build query
    const query = { tenantId: req.user.tenantId };

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    // Add filters
    if (status) query.status = status;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (state) query.state = { $regex: state, $options: 'i' };
    if (country) query.country = { $regex: country, $options: 'i' };

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    logger.info(`Fetching agents for tenant ${req.user.tenantId}`);

    // Execute query with pagination
    const agents = await Agent.find(query)
      .sort(sort)
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    // Get total count
    const total = await Agent.countDocuments(query);

    return successResponse(res, agents, 'Agents retrieved successfully', {
      pagination: {
        current: pageNum,
        pageSize: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      filters: { status, city, state, country, search }
    });
  } catch (error) {
    logger.error('Error getting agents:', error);
    return errorResponse(res, 'Error retrieving agents', 500);
  }
};

// @desc    Get single agent by ID
// @route   GET /api/v1/agents/:id
// @access  Private (Super Admin)
const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId
    })
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Agent retrieved successfully',
      data: agent
    });
  } catch (error) {
    logger.error('Error getting agent by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving agent',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update agent
// @route   PUT /api/v1/agents/:id
// @access  Private (Super Admin)
const updateAgent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      country,
      postalCode,
      commissionRate,
      status,
      notes
    } = req.body;

    // Find agent
    let agent = await Agent.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email.toLowerCase() !== agent.email) {
      const existingAgent = await Agent.findOne({
        email: email.toLowerCase(),
        tenantId: req.user.tenantId,
        _id: { $ne: req.params.id }
      });

      if (existingAgent) {
        return res.status(400).json({
          success: false,
          message: 'An agent with this email already exists'
        });
      }
    }

    // Update agent
    agent = await Agent.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email: email ? email.toLowerCase() : agent.email,
        phone,
        address,
        city,
        state,
        country,
        postalCode,
        commissionRate,
        status,
        notes,
        updatedBy: req.user._id
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');

    logger.info(`Agent updated: ${agent._id} by user: ${req.user._id}`);

    res.status(200).json({
      success: true,
      message: 'Agent updated successfully',
      data: agent
    });
  } catch (error) {
    logger.error('Error updating agent:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An agent with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating agent',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete agent
// @route   DELETE /api/v1/agents/:id
// @access  Private (Super Admin)
const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    await Agent.findByIdAndDelete(req.params.id);

    logger.info(`Agent deleted: ${agent._id} by user: ${req.user._id}`);

    res.status(200).json({
      success: true,
      message: 'Agent deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting agent:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting agent',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get agent statistics
// @route   GET /api/v1/agents/statistics
// @access  Private (Super Admin)
const getAgentStatistics = async (req, res) => {
  try {
    const statistics = await Agent.getStatistics(req.user.tenantId);

    res.status(200).json({
      success: true,
      message: 'Agent statistics retrieved successfully',
      data: statistics
    });
  } catch (error) {
    logger.error('Error getting agent statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving agent statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get active agents
// @route   GET /api/v1/agents/active
// @access  Private (Super Admin)
const getActiveAgents = async (req, res) => {
  try {
    const agents = await Agent.findActive(req.user.tenantId)
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Active agents retrieved successfully',
      data: agents
    });
  } catch (error) {
    logger.error('Error getting active agents:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving active agents',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};




export default {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  getAgentStatistics,
  getActiveAgents
};
