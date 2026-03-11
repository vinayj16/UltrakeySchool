import express from 'express';
import transportController from '../controllers/transportController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

const handlerOr501 = (fn, name) =>
  typeof fn === 'function'
    ? fn
    : (_req, res) =>
        res.status(501).json({
          success: false,
          message: `Not implemented: ${name}`
        });

// All routes require authentication
router.use(authenticate);

// Vehicle Management
router.post(
  '/vehicles',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.createVehicle, 'transportController.createVehicle')
);

router.get('/vehicles', handlerOr501(transportController.getVehicles, 'transportController.getVehicles'));

router.get('/vehicles/:id', handlerOr501(transportController.getVehicleById, 'transportController.getVehicleById'));

router.put(
  '/vehicles/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.updateVehicle, 'transportController.updateVehicle')
);

router.delete(
  '/vehicles/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.deleteVehicle, 'transportController.deleteVehicle')
);

// Route Management
router.post(
  '/routes',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.createRoute, 'transportController.createRoute')
);

router.get('/routes', handlerOr501(transportController.getRoutes, 'transportController.getRoutes'));

router.get('/routes/:id', handlerOr501(transportController.getRouteById, 'transportController.getRouteById'));

router.put(
  '/routes/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.updateRoute, 'transportController.updateRoute')
);

router.delete(
  '/routes/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.deleteRoute, 'transportController.deleteRoute')
);

// Student Transport Assignment
router.post(
  '/assignments',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.assignStudentToRoute, 'transportController.assignStudentToRoute')
);

router.get('/assignments', handlerOr501(transportController.getStudentTransports, 'transportController.getStudentTransports'));

router.put(
  '/assignments/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.updateStudentTransport, 'transportController.updateStudentTransport')
);

router.delete(
  '/assignments/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.deleteStudentTransport, 'transportController.deleteStudentTransport')
);

// Trip Management
router.post(
  '/trips',
  authorize(['super_admin', 'school_admin', 'transport_manager', 'driver']),
  handlerOr501(transportController.createTrip, 'transportController.createTrip')
);

router.put(
  '/trips/:id/start',
  authorize(['super_admin', 'school_admin', 'transport_manager', 'driver']),
  handlerOr501(transportController.startTrip, 'transportController.startTrip')
);

router.put(
  '/trips/:id/attendance',
  authorize(['super_admin', 'school_admin', 'transport_manager', 'driver']),
  handlerOr501(transportController.markAttendance, 'transportController.markAttendance')
);

router.put(
  '/trips/:id/complete',
  authorize(['super_admin', 'school_admin', 'transport_manager', 'driver']),
  handlerOr501(transportController.completeTrip, 'transportController.completeTrip')
);

router.get('/trips', handlerOr501(transportController.getTrips, 'transportController.getTrips'));

// Vehicle Maintenance
router.post(
  '/maintenance',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.scheduleMaintenance ?? transportController.createMaintenance, 'transportController.createMaintenance')
);

router.put(
  '/maintenance/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.updateMaintenance, 'transportController.updateMaintenance')
);

router.get('/maintenance', handlerOr501(transportController.getMaintenanceRecords, 'transportController.getMaintenanceRecords'));

router.delete(
  '/maintenance/:id',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.deleteMaintenance, 'transportController.deleteMaintenance')
);

// Statistics and Reports
router.get(
  '/stats',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.getTransportStats ?? transportController.getTransportStatistics, 'transportController.getTransportStatistics')
);

router.get(
  '/utilization',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.getVehicleUtilization, 'transportController.getVehicleUtilization')
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
  handlerOr501(transportController.updateVehicleLocation, 'transportController.updateVehicleLocation')
);

router.get('/vehicles/:id/location', handlerOr501(transportController.getVehicleLocation, 'transportController.getVehicleLocation'));

router.get('/routes/:id/track', handlerOr501(transportController.trackRoute, 'transportController.trackRoute'));

router.get(
  '/tracking/parent/:studentId',
  authorize(['parent', 'guardian', 'super_admin', 'school_admin']),
  handlerOr501(transportController.getParentTrackingInfo, 'transportController.getParentTrackingInfo')
);

// Route Optimization
router.get(
  '/routes/:id/optimize',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.optimizeRoute, 'transportController.optimizeRoute')
);

router.put(
  '/routes/:id/apply-optimization',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.applyOptimizedRoute, 'transportController.applyOptimizedRoute')
);

// Fuel Management
router.post(
  '/fuel',
  authorize(['super_admin', 'school_admin', 'transport_manager', 'driver']),
  handlerOr501(transportController.recordFuelEntry ?? transportController.addFuelRecord, 'transportController.addFuelRecord')
);

router.get(
  '/fuel/vehicle/:vehicleId',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.getFuelHistory ?? transportController.getFuelRecords, 'transportController.getFuelRecords')
);

router.get(
  '/fuel/vehicle/:vehicleId/analytics',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.getFuelAnalytics, 'transportController.getFuelAnalytics')
);

router.get(
  '/fuel/summary',
  authorize(['super_admin', 'school_admin', 'transport_manager']),
  handlerOr501(transportController.getFuelSummary, 'transportController.getFuelSummary')
);

export default router;
