import express from 'express';
import scheduleController from '../controllers/scheduleController.js';
const {
  getSchedules,
  getScheduleById,
  getUserSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  setReminder,
  addParticipant,
  removeParticipant,
  getUpcomingSchedules
} = scheduleController;

import { authenticate, authorize } from '../middleware/authMiddleware.js';
import {
  getSchedulesValidation,
  getScheduleByIdValidation,
  getUserSchedulesValidation,
  createScheduleValidation,
  updateScheduleValidation,
  deleteScheduleValidation,
  setReminderValidation,
  addParticipantValidation,
  removeParticipantValidation,
  getUpcomingSchedulesValidation
} from '../validators/scheduleValidators.js';

const router = express.Router();

router.get(
  '/',
  authenticate,
  getSchedulesValidation,
  getSchedules
);

router.get(
  '/upcoming',
  authenticate,
  getUpcomingSchedulesValidation,
  getUpcomingSchedules
);

router.get(
  '/user/:userId',
  authenticate,
  getUserSchedulesValidation,
  getUserSchedules
);

router.get(
  '/:id',
  authenticate,
  getScheduleByIdValidation,
  getScheduleById
);

router.post(
  '/',
  authenticate,
  authorize(['admin', 'teacher', 'principal']),
  createScheduleValidation,
  createSchedule
);

router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'teacher', 'principal']),
  updateScheduleValidation,
  updateSchedule
);

router.delete(
  '/:id',
  authenticate,
  authorize(['admin', 'teacher', 'principal']),
  deleteScheduleValidation,
  deleteSchedule
);

router.post(
  '/:id/reminder',
  authenticate,
  setReminderValidation,
  setReminder
);

router.post(
  '/:id/participants',
  authenticate,
  authorize(['admin', 'teacher', 'principal']),
  addParticipantValidation,
  addParticipant
);

router.delete(
  '/:id/participants/:userId',
  authenticate,
  authorize(['admin', 'teacher', 'principal']),
  removeParticipantValidation,
  removeParticipant
);

export default router;
