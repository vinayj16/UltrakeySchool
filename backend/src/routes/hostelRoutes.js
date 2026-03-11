import express from 'express';
import hostelController from '../controllers/hostelController.js';
const {
  roomController,
  allocationController,
  complaintController,
  visitorLogController,
  roomTypeController
} = hostelController;

import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateTenantAccess } from '../middleware/multiTenant.js';

const router = express.Router();

// Apply tenant middleware to all routes
router.use(authenticate);
router.use(validateTenantAccess);

// Hostel Building Routes - Hostel Warden and above
router.post('/hostels',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  hostelController.create
);

router.get('/hostels',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin', 'student', 'parent'),
  hostelController.getAll
);

router.get('/hostels/:id',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin', 'student', 'parent'),
  hostelController.getById
);

router.put('/hostels/:id',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  hostelController.update
);

router.delete('/hostels/:id',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  hostelController.delete
);

// Room Type Routes - Hostel Warden and above
router.post('/room-types',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  roomTypeController.create
);

router.get('/room-types',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin', 'student', 'parent'),
  roomTypeController.getAll
);

router.get('/room-types/:id',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin', 'student', 'parent'),
  roomTypeController.getById
);

router.put('/room-types/:id',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  roomTypeController.update
);

router.delete('/room-types/:id',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  roomTypeController.delete
);

// Room Routes - Hostel Warden and above
router.post('/rooms',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  roomController.create
);

router.get('/rooms',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin', 'student', 'parent'),
  roomController.getAll
);

router.get('/rooms/:id',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin', 'student', 'parent'),
  roomController.getById
);

router.put('/rooms/:id',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  roomController.update
);

router.delete('/rooms/:id',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  roomController.delete
);

router.get('/rooms/availability',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin', 'student', 'parent'),
  roomController.getAvailability
);

// Allocation Routes - Hostel Warden and above
router.post('/allocations',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  allocationController.create
);

router.get('/allocations',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  allocationController.getAll
);

router.put('/allocations/:id/checkout',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  allocationController.checkout
);

// Student/Parent specific routes
router.get('/my-allocation',
  authorize('student'),
  async (req, res) => {
    try {
      const Allocation = (await import('../models/hostel.js')).Allocation;

      const allocation = await Allocation.findOne({
        student: req.user.id,
        status: 'active'
      })
      .populate('room', 'roomNumber hostel floor type facilities rent securityDeposit')
      .populate('allocatedBy', 'name');

      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return ApiResponse.success(res, 'Your room allocation retrieved', {
        allocation
      });
    } catch (error) {
      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return Apiresponse.message(res, 'Failed to retrieve allocation', 500);
    }
  }
);

// Complaint Routes - All authenticated users can file, hostel warden can manage
router.post('/complaints',
  complaintController.create
);

router.get('/complaints',
  complaintController.getAll
);

router.put('/complaints/:id/status',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  complaintController.updateStatus
);

// Visitor Log Routes - Hostel Warden and above for management, students for their rooms
router.post('/visitor-logs/check-in',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin', 'student'),
  visitorLogController.checkIn
);

router.put('/visitor-logs/:id/check-out',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin', 'student'),
  visitorLogController.checkOut
);

router.get('/visitor-logs',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  visitorLogController.getAll
);

// Hostel Dashboard - Hostel Warden specific
router.get('/dashboard/stats',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  async (req, res) => {
    try {
      const { Room, Allocation, Complaint } = await import('../models/hostel.js');

      // Aggregate dashboard data
      const [
        totalRooms,
        availableRooms,
        occupiedRooms,
        activeAllocations,
        pendingComplaints
      ] = await Promise.all([
        Room.countDocuments({ institution: req.tenantId }),
        Room.countDocuments({ institution: req.tenantId, status: 'available' }),
        Room.countDocuments({ institution: req.tenantId, status: 'occupied' }),
        Allocation.countDocuments({ institution: req.tenantId, status: 'active' }),
        Complaint.countDocuments({
          institution: req.tenantId,
          status: { $in: ['pending', 'in-progress'] }
        })
      ]);

      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return ApiResponse.success(res, 'Hostel dashboard stats retrieved', {
        totalResidents: activeAllocations,
        totalRooms: totalRooms,
        maintenanceIssues: 0, // Would need maintenance model
        pendingComplaints: pendingComplaints,
        vacantRooms: availableRooms
      });
    } catch (error) {
      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return Apiresponse.message(res, 'Failed to retrieve dashboard stats', 500);
    }
  }
);

router.get('/dashboard/rooms',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  async (req, res) => {
    try {
      const { Room, Allocation } = await import('../models/hostel.js');

      const rooms = await Room.find({ institution: req.tenantId })
        .populate('createdBy', 'name')
        .sort({ roomNumber: 1 });

      const roomData = await Promise.all(rooms.map(async (room) => {
        const currentResidents = await Allocation.countDocuments({
          room: room._id,
          status: 'active'
        });

        return {
          id: room._id.toString(),
          roomNumber: room.roomNumber,
          block: room.hostel,
          currentResidents,
          capacity: room.capacity
        };
      }));

      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return ApiResponse.success(res, 'Room occupancy data retrieved', {
        roomData
      });
    } catch (error) {
      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return Apiresponse.message(res, 'Failed to retrieve room data', 500);
    }
  }
);

router.get('/dashboard/occupancy',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  async (req, res) => {
    try {
      const { Room, Allocation } = await import('../models/hostel.js');

      const blocks = await Room.distinct('hostel', { institution: req.tenantId });

      const occupancyData = await Promise.all(blocks.map(async (block) => {
        const rooms = await Room.find({ institution: req.tenantId, hostel: block });
        const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
        const totalOccupied = await Allocation.countDocuments({
          room: { $in: rooms.map(r => r._id) },
          status: 'active'
        });

        return {
          block,
          occupied: totalOccupied,
          vacant: totalCapacity - totalOccupied
        };
      }));

      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return ApiResponse.success(res, 'Occupancy distribution retrieved', {
        occupancyData
      });
    } catch (error) {
      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return Apiresponse.message(res, 'Failed to retrieve occupancy data', 500);
    }
  }
);

// Maintenance routes (would need maintenance controller - placeholder for now)
router.get('/maintenance',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  async (req, res) => {
    try {
      const HostelMaintenance = (await import('../models/hostel.js')).HostelMaintenance;

      const maintenance = await HostelMaintenance.find({
        institution: req.tenantId
      }).sort({ scheduledDate: 1 });

      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return ApiResponse.success(res, 'Hostel maintenance records retrieved', {
        maintenance
      });
    } catch (error) {
      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return Apiresponse.message(res, 'Failed to retrieve maintenance records', 500);
    }
  }
);

// Room inventory routes
router.get('/inventory',
  authorize('hostel_warden', 'school_admin', 'institution_admin', 'superadmin'),
  async (req, res) => {
    try {
      const RoomInventory = (await import('../models/hostel.js')).RoomInventory;

      const inventory = await RoomInventory.find({
        institution: req.tenantId
      })
      .populate('room', 'roomNumber hostel floor')
      .sort({ lastChecked: -1 });

      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return ApiResponse.success(res, 'Room inventory retrieved', {
        inventory
      });
    } catch (error) {
      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return Apiresponse.message(res, 'Failed to retrieve inventory', 500);
    }
  }
);

export default router;
