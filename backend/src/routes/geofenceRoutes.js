// Geofence Routes
import express from 'express';
const router = express.Router();
import geofenceController from '../controllers/geofenceController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateInput } from '../middleware/validation.js';

// Apply authentication to all routes
router.use(authenticate);

// Create Geofence
router.post('/',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  validateInput({
    name: { required: true, type: 'string' },
    description: { required: false, type: 'string' },
    boundary: { required: false, type: 'object' },
    center: { required: false, type: 'object' },
    radius: { required: false, type: 'number' },
    type: { required: false, type: 'string', enum: ['campus', 'transport', 'restricted', 'custom'] },
    locationType: { required: false, type: 'string', enum: ['gate', 'classroom', 'library', 'office', 'playground', 'transport'] },
    timeRestrictions: { required: false, type: 'object' },
    allowedUserTypes: { required: false, type: 'array' }
  }),
  geofenceController.createGeofence
);

// Validate Location within Geofence
router.post('/validate',
  validateInput({
    latitude: { required: true, type: 'number' },
    longitude: { required: true, type: 'number' },
    userType: { required: false, type: 'string', enum: ['student', 'teacher', 'staff', 'parent', 'admin'] }
  }),
  geofenceController.validateLocation
);

// Get Geofences
router.get('/',
  authorize(['super_admin', 'school_admin', 'transport_manager', 'teacher']),
  validateInput({
    page: { required: false, type: 'number' },
    limit: { required: false, type: 'number' },
    type: { required: false, type: 'string', enum: ['campus', 'transport', 'restricted', 'custom'] },
    locationType: { required: false, type: 'string', enum: ['gate', 'classroom', 'library', 'office', 'playground', 'transport'] },
    isActive: { required: false, type: 'boolean' }
  }),
  geofenceController.getGeofences
);

// Get Geofence by ID
router.get('/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager', 'teacher']),
  geofenceController.getGeofenceById
);

// Update Geofence
router.put('/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  validateInput({
    name: { required: false, type: 'string' },
    description: { required: false, type: 'string' },
    boundary: { required: false, type: 'object' },
    center: { required: false, type: 'object' },
    radius: { required: false, type: 'number' },
    type: { required: false, type: 'string', enum: ['campus', 'transport', 'restricted', 'custom'] },
    locationType: { required: false, type: 'string', enum: ['gate', 'classroom', 'library', 'office', 'playground', 'transport'] },
    timeRestrictions: { required: false, type: 'object' },
    allowedUserTypes: { required: false, type: 'array' },
    isActive: { required: false, type: 'boolean' }
  }),
  geofenceController.updateGeofence
);

// Delete Geofence (Soft Delete)
router.delete('/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  geofenceController.deleteGeofence
);

// Get Campus Geofences
router.get('/campus',
  authorize(['super_admin', 'school_admin', 'transport_manager', 'teacher']),
  geofenceController.getCampusGeofences
);

// Get Transport Geofences
router.get('/transport',
  authorize(['super_admin', 'school_admin', 'transport_manager', 'teacher']),
  geofenceController.getTransportGeofences
);

// Get Geofence Statistics
router.get('/statistics',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  geofenceController.getGeofenceStatistics
);

// Bulk Create Geofences
router.post('/bulk',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  validateInput({
    geofences: { required: true, type: 'array' }
  }),
  geofenceController.bulkCreateGeofences
);

export default router;