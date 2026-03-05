import express from 'express';
import * as transportController from '../controllers/transportController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authGuard.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Vehicle Management
router.post(
  '/vehicles',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.createVehicle
);

router.get('/vehicles', transportController.getVehicles);

router.get('/vehicles/:id', transportController.getVehicleById);

router.put(
  '/vehicles/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.updateVehicle
);

router.delete(
  '/vehicles/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.deleteVehicle
);

// Route Management
router.post(
  '/routes',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.createRoute
);

router.get('/routes', transportController.getRoutes);

router.get('/routes/:id', transportController.getRouteById);

router.put(
  '/routes/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.updateRoute
);

router.delete(
  '/routes/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.deleteRoute
);

// Student Transport Assignment
router.post(
  '/assignments',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.assignStudentToRoute
);

router.get('/assignments', transportController.getStudentTransports);

router.put(
  '/assignments/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.updateStudentTransport
);

router.delete(
  '/assignments/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.deleteStudentTransport
);

// Trip Management
router.post(
  '/trips',
  authorize(['super_admin', 'school_admin', 'transport_manager', 'driver']),
  transportController.createTrip
);

router.put(
  '/trips/:id/start',
  authorize(['super_admin', 'school_admin', 'transport_manager', 'driver']),
  transportController.startTrip
);

router.put(
  '/trips/:id/attendance',
  authorize(['super_admin', 'school_admin', 'transport_manager', 'driver']),
  transportController.markAttendance
);

router.put(
  '/trips/:id/complete',
  authorize(['super_admin', 'school_admin', 'transport_manager', 'driver']),
  transportController.completeTrip
);

router.get('/trips', transportController.getTrips);

// Vehicle Maintenance
router.post(
  '/maintenance',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.scheduleMaintenance
);

router.put(
  '/maintenance/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.updateMaintenance
);

router.get('/maintenance', transportController.getMaintenanceRecords);

router.delete(
  '/maintenance/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.deleteMaintenance
);

// Statistics and Reports
router.get(
  '/stats',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.getTransportStats
);

router.get(
  '/utilization',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.getVehicleUtilization
);

// Dashboard endpoints
router.get(
  '/dashboard/stats',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  async (req, res) => {
    try {
      const stats = await transportController.getTransportStats(req);
      return stats;
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve dashboard stats',
        error: error.message
      });
    }
  }
);

router.get(
  '/dashboard/routes',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  async (req, res) => {
    try {
      const { TransportRoute, TransportAssignment, Vehicle } = await import('../models/Transport.js');
      
      const routes = await TransportRoute.find({ tenant: req.user.tenant })
        .populate('vehicle', 'registrationNumber')
        .populate('stops', 'name');

      const routeData = routes.map(route => {
        const students = route.students || [];
        return {
          route: route.name,
          bus: route.vehicle?.registrationNumber || 'N/A',
          students: students.length,
          status: route.status === 'active' ? 'On Time' : 'Delayed',
          arrivalTime: route.startTime || 'N/A'
        };
      });

      return res.status(200).json({
        success: true,
        data: routeData
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve route data',
        error: error.message
      });
    }
  }
);

router.get(
  '/dashboard/complaints',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  async (req, res) => {
    try {
      const { Complaint } = await import('../models/complaint.js');
      
      const complaints = await Complaint.find({
        tenant: req.user.tenant,
        category: 'transport',
        status: { $in: ['pending', 'in_progress'] }
      })
      .limit(5);

      const complaintData = complaints.map(complaint => ({
        title: complaint.title,
        severity: complaint.priority === 'high' ? 'critical' : 'warning',
        route: complaint.description
      }));

      return res.status(200).json({
        success: true,
        data: complaintData
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve complaints',
        error: error.message
      });
    }
  }
);

router.get(
  '/dashboard/status',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  async (req, res) => {
    try {
      const { Vehicle } = await import('../models/Transport.js');
      
      const vehicles = await Vehicle.find({ tenant: req.user.tenant });
      
      const statusCounts = {
        'On Time': 0,
        'Delayed': 0,
        'Maintenance': 0
      };

      vehicles.forEach(vehicle => {
        if (vehicle.status === 'maintenance') {
          statusCounts['Maintenance']++;
        } else if (vehicle.status === 'active') {
          statusCounts['On Time']++;
        } else {
          statusCounts['Delayed']++;
        }
      });

      const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count
      }));

      return res.status(200).json({
        success: true,
        data: statusData
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve status data',
        error: error.message
      });
    }
  }
);

// GPS Tracking
router.put(
  '/vehicles/:id/location',
  authorize(['super_admin', 'school_admin', 'transport_manager', 'driver']),
  transportController.updateVehicleLocation
);

router.get('/vehicles/:id/location', transportController.getVehicleLocation);

router.get('/routes/:id/track', transportController.trackRoute);

router.get(
  '/tracking/parent/:studentId',
  authorize(['parent', 'guardian', 'super_admin', 'school_admin']),
  transportController.getParentTrackingInfo
);

// Route Optimization
router.get(
  '/routes/:id/optimize',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.optimizeRoute
);

router.put(
  '/routes/:id/apply-optimization',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.applyOptimizedRoute
);

// Fuel Management
router.post(
  '/fuel',
  authorize(['super_admin', 'school_admin', 'transport_manager', 'driver']),
  transportController.recordFuelEntry
);

router.get(
  '/fuel/vehicle/:vehicleId',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.getFuelHistory
);

router.get(
  '/fuel/vehicle/:vehicleId/analytics',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.getFuelAnalytics
);

router.get(
  '/fuel/summary',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  transportController.getFuelSummary
);

export default router;
