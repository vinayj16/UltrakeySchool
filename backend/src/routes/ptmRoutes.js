import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import ptmController from '../controllers/ptmController.js';
const {
  getPTMSlots,
  createPTMSlots,
  getPTMSlotById,
  updatePTMSlot,
  deletePTMSlot,
  bookPTMSlot,
  cancelPTMBooking,
  scheduleVideoMeeting,
  sendPTMReminder,
  sendAutomatedReminders,
  getPTMStatistics,
  completePTMSlot
} = ptmController;

const router = express.Router();

router.use(authenticate);

// Get PTM slots
router.get('/slots', getPTMSlots);

// Create PTM slots (teachers and admins only)
router.post('/slots', authorize(['admin', 'teacher', 'principal']), createPTMSlots);

// Get slot details
router.get('/slots/:id', getPTMSlotById);

// Update slot (teachers and admins only)
router.put('/slots/:id', authorize(['admin', 'teacher', 'principal']), updatePTMSlot);

// Delete slot (admins only)
router.delete('/slots/:id', authorize(['admin', 'principal']), deletePTMSlot);

// Book PTM slot (parents and students)
router.post('/slots/:id/book', bookPTMSlot);

// Cancel booking
router.put('/slots/:id/cancel', cancelPTMBooking);

// Schedule video meeting (teachers and admins only)
router.post('/slots/:id/video-meeting', authorize(['admin', 'teacher', 'principal']), scheduleVideoMeeting);

// Send PTM reminder (teachers and admins only)
router.post('/slots/:id/reminder', authorize(['admin', 'teacher', 'principal']), sendPTMReminder);

// Send automated reminders (admins only)
router.post('/reminders/automated', authorize(['admin', 'principal']), sendAutomatedReminders);

// Get PTM statistics (admins and teachers)
router.get('/statistics', authorize(['admin', 'teacher', 'principal']), getPTMStatistics);

// Complete PTM slot (teachers and admins only)
router.put('/slots/:id/complete', authorize(['admin', 'teacher', 'principal']), completePTMSlot);

export default router;
