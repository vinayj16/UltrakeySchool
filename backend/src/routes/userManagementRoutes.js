import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import DataErasureRequest from '../models/DataErasureRequest.js';
import Permission from '../models/Permission.js';

const router = express.Router();

// User routes - All data from database
router.get('/users', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const query = { tenantId: req.tenantId };
    
    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password -refreshToken')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
});

router.get('/users/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      tenantId: req.tenantId
    }).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
});

router.put('/users/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User updated', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
  }
});

router.delete('/users/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.tenantId
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
});

// Delete Account Request Routes - All data from database
router.get('/users/delete-requests', authenticate, async (req, res) => {
  try {
    const requests = await DataErasureRequest.find({ tenantId: req.tenantId })
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch delete requests', error: error.message });
  }
});

router.post('/users/delete-requests', authenticate, async (req, res) => {
  try {
    const newRequest = new DataErasureRequest({
      ...req.body,
      tenantId: req.tenantId,
      userId: req.user.id,
      status: 'pending',
      requisitionDate: new Date()
    });
    await newRequest.save();
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create delete request', error: error.message });
  }
});

router.patch('/users/delete-requests/:id/confirm', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const request = await DataErasureRequest.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId },
      { status: 'confirmed', confirmedAt: new Date(), confirmedBy: req.user.id },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to confirm request', error: error.message });
  }
});

router.patch('/users/delete-requests/:id/reject', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { reason } = req.body;
    const request = await DataErasureRequest.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId },
      { status: 'rejected', reason, rejectedAt: new Date(), rejectedBy: req.user.id },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reject request', error: error.message });
  }
});

router.delete('/users/delete-requests/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const request = await DataErasureRequest.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.tenantId
    });

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.json({ success: true, message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete request', error: error.message });
  }
});

router.post('/users/delete-requests/bulk-confirm', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { ids } = req.body;
    await DataErasureRequest.updateMany(
      { _id: { $in: ids }, tenantId: req.tenantId },
      { status: 'confirmed', confirmedAt: new Date(), confirmedBy: req.user.id }
    );
    res.json({ success: true, message: 'Requests confirmed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to confirm requests', error: error.message });
  }
});

router.post('/users/delete-requests/bulk-reject', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { ids, reason } = req.body;
    await DataErasureRequest.updateMany(
      { _id: { $in: ids }, tenantId: req.tenantId },
      { status: 'rejected', reason, rejectedAt: new Date(), rejectedBy: req.user.id }
    );
    res.json({ success: true, message: 'Requests rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reject requests', error: error.message });
  }
});

// Permissions routes - All data from database
router.get('/permissions', authenticate, async (req, res) => {
  try {
    const permissions = await Permission.find({ tenantId: req.tenantId });
    res.json({ success: true, data: permissions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch permissions', error: error.message });
  }
});

router.put('/permissions', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { permissions } = req.body;
    
    // Update permissions in bulk
    const updatePromises = permissions.map(perm =>
      Permission.findOneAndUpdate(
        { _id: perm.id, tenantId: req.tenantId },
        perm,
        { new: true, upsert: true }
      )
    );

    await Promise.all(updatePromises);
    res.json({ success: true, message: 'Permissions updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update permissions', error: error.message });
  }
});

export default router;
