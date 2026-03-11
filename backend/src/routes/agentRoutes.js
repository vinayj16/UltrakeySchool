import express from 'express';
const router = express.Router();
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateAgentCreate, validateAgentUpdate } from '../validators/agentValidator.js';
import agentController from '../controllers/agentController.js';
const { createAgent, getAgents, getAgentById, updateAgent, deleteAgent, getAgentStatistics, getActiveAgents } = agentController;

// Apply authentication middleware to all routes
router.use(protect);

// All agent routes require super admin role
router.use(authorize('super-admin'));

// @route   POST /api/v1/agents
// @desc    Create a new agent
// @access  Private (Super Admin)
router.post('/', validateAgentCreate, createAgent);

// @route   GET /api/v1/agents
// @desc    Get all agents with pagination and filtering
// @access  Private (Super Admin)
router.get('/', getAgents);

// @route   GET /api/v1/agents/:id
// @desc    Get agent by ID
// @access  Private (Super Admin)
router.get('/:id', getAgentById);

// @route   PUT /api/v1/agents/:id
// @desc    Update agent
// @access  Private (Super Admin)
router.put('/:id', validateAgentUpdate, updateAgent);

// @route   DELETE /api/v1/agents/:id
// @desc    Delete agent
// @access  Private (Super Admin)
router.delete('/:id', deleteAgent);

// @route   GET /api/v1/agents/statistics
// @desc    Get agent statistics
// @access  Private (Super Admin)
router.get('/statistics', getAgentStatistics);

// @route   GET /api/v1/agents/active
// @desc    Get active agents
// @access  Private (Super Admin)
router.get('/active', getActiveAgents);

export default router;
