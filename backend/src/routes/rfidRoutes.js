// RFID Routes
import express from 'express';
import rfidController from '../controllers/rfidController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateInput } from '../middleware/validation.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Create RFID Card
router.post('/', 
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  validateInput({
    cardId: { required: true, type: 'string' },
    userId: { required: true, type: 'string' },
    userType: { required: true, type: 'string', enum: ['student', 'teacher', 'staff', 'parent'] },
    serialNumber: { required: true, type: 'string' },
    location: { required: false, type: 'string', enum: ['gate', 'library', 'transport', 'classroom', 'office'] }
  }),
  rfidController.createRfidCard
);

// Validate RFID Card
router.post('/validate',
  validateInput({
    cardId: { required: true, type: 'string' },
    location: { required: false, type: 'string' },
    metadata: { required: false, type: 'object' }
  }),
  rfidController.validateRfidCard
);

// Get RFID Cards
router.get('/',
  authorize(['super_admin', 'school_admin', 'transport_manager', 'teacher']),
  validateInput({
    page: { required: false, type: 'number' },
    limit: { required: false, type: 'number' },
    status: { required: false, type: 'string', enum: ['active', 'inactive', 'lost', 'blocked'] },
    userType: { required: false, type: 'string', enum: ['student', 'teacher', 'staff', 'parent'] },
    location: { required: false, type: 'string', enum: ['gate', 'library', 'transport', 'classroom', 'office'] }
  }),
  rfidController.getRfidCards
);

// Get RFID Card by ID
router.get('/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager', 'teacher']),
  rfidController.getRfidCardById
);

// Update RFID Card
router.put('/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  validateInput({
    status: { required: false, type: 'string', enum: ['active', 'inactive', 'lost', 'blocked'] },
    location: { required: false, type: 'string', enum: ['gate', 'library', 'transport', 'classroom', 'office'] },
    metadata: { required: false, type: 'object' }
  }),
  rfidController.updateRfidCard
);

// Delete RFID Card (Soft Delete)
router.delete('/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  rfidController.deleteRfidCard
);

// Block RFID Card
router.post('/:id/block',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  validateInput({
    reason: { required: false, type: 'string' }
  }),
  rfidController.blockRfidCard
);

// Activate RFID Card
router.post('/:id/activate',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  rfidController.activateRfidCard
);

// Get RFID Statistics
router.get('/statistics',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  rfidController.getRfidStatistics
);

export default router;