import express from 'express';
import { announcementController, eventController, reportController, dashboardController } from '../controllers/principalController.js';

import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { validateTenantAccess } from '../middleware/multiTenant.js';

const router = express.Router();

// Apply tenant middleware to all routes
router.use(authenticate);
router.use(validateTenantAccess);

// Announcement Routes - Principal and above
router.post('/announcements',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin'),
  announcementController.create
);

router.get('/announcements',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin', 'teacher', 'student', 'parent', 'staff_member'),
  announcementController.getAll
);

router.get('/announcements/:id',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin', 'teacher', 'student', 'parent', 'staff_member'),
  announcementController.getById
);

router.put('/announcements/:id',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin'),
  announcementController.update
);

router.delete('/announcements/:id',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin'),
  announcementController.delete
);

router.put('/announcements/:id/publish',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin'),
  announcementController.publish
);

// Event Routes - Principal and above
router.post('/events',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin'),
  eventController.create
);

router.get('/events',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin', 'teacher', 'student', 'parent', 'staff_member'),
  eventController.getAll
);

router.get('/events/:id',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin', 'teacher', 'student', 'parent', 'staff_member'),
  eventController.getById
);

router.put('/events/:id',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin'),
  eventController.update
);

router.delete('/events/:id',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin'),
  eventController.delete
);

// Report Routes - Principal and above
router.post('/reports/academic',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin'),
  reportController.generateAcademicReport
);

router.get('/reports',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin'),
  reportController.getAll
);

router.get('/reports/:id',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin'),
  reportController.getById
);

// Principal Dashboard Routes
router.get('/dashboard',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin'),
  dashboardController.getDashboard
);

router.get('/dashboard/students',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin'),
  dashboardController.getStudentPerformance
);

router.get('/dashboard/teachers',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin'),
  dashboardController.getTeacherPerformance
);

// Public routes for students/parents to view announcements and events
router.get('/public/announcements',
  async (req, res) => {
    try {
      const Announcement = (await import('../models/principal.js')).Announcement;

      const announcements = await Announcement.find({
        institution: req.tenantId,
        status: 'published',
        $or: [
          { targetAudience: 'all' },
          { targetAudience: req.user?.role || 'student' }
        ]
      })
      .populate('createdBy', 'name')
      .sort({ publishedDate: -1 })
      .limit(10);

      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return ApiResponse.success(res, 'Public announcements retrieved', {
        announcements
      });
    } catch (error) {
      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return Apiresponse.message(res, 'Failed to retrieve announcements', 500);
    }
  }
);

router.get('/public/events',
  async (req, res) => {
    try {
      const Event = (await import('../models/principal.js')).Event;

      const events = await Event.find({
        institution: req.tenantId,
        status: { $in: ['confirmed', 'ongoing'] },
        date: { $gte: new Date() }
      })
      .populate('createdBy', 'name')
      .sort({ date: 1 })
      .limit(10);

      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return ApiResponse.success(res, 'Upcoming events retrieved', {
        events
      });
    } catch (error) {
      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return Apiresponse.message(res, 'Failed to retrieve events', 500);
    }
  }
);

// Meeting routes for parent-teacher meetings
router.post('/meetings',
  authorize('principal', 'school_admin', 'institution_admin', 'superadmin'),
  async (req, res) => {
    try {
      const Meeting = (await import('../models/principal.js')).Meeting;

      const meeting = new Meeting({
        ...req.body,
        institution: req.tenantId,
        createdBy: req.user.id
      });

      await meeting.save();

      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return ApiResponse.created(res, 'Meeting scheduled successfully', {
        meeting
      });
    } catch (error) {
      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return Apiresponse.message(res, 'Failed to schedule meeting', 500);
    }
  }
);

router.get('/meetings',
  async (req, res) => {
    try {
      const Meeting = (await import('../models/principal.js')).Meeting;

      const query = { institution: req.tenantId };

      // If not admin/principal, only show meetings where user is a participant
      if (!['principal', 'school_admin', 'institution_admin', 'superadmin'].includes(req.user.role)) {
        query['participants.user'] = req.user.id;
      }

      const meetings = await Meeting.find(query)
        .populate('participants.user', 'name email')
        .populate('createdBy', 'name')
        .sort({ scheduledDate: 1 });

      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return ApiResponse.success(res, 'Meetings retrieved successfully', {
        meetings
      });
    } catch (error) {
      const ApiResponse = (await import('../utils/apiResponse.js')).default;
      return Apiresponse.message(res, 'Failed to retrieve meetings', 500);
    }
  }
);

export default router;
