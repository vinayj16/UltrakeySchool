import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import * as eventController from '../controllers/eventController.js';

const router = express.Router();
router.use(authenticate);

// Frontend-compatible simple routes
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// Existing routes
router.post('/schools/:schoolId', eventController.createEvent);
router.get('/schools/:schoolId', eventController.getEvents);
router.get('/schools/:schoolId/upcoming', eventController.getUpcomingEvents);
router.get('/schools/:schoolId/type/:eventType', eventController.getEventsByType);
router.get('/schools/:schoolId/:eventId', eventController.getEventById);
router.put('/schools/:schoolId/:eventId', eventController.updateEvent);
router.delete('/schools/:schoolId/:eventId', eventController.deleteEvent);

export default router;
