import express from 'express';
import contactMessageController from '../controllers/contactMessageController.js';
const {
  getContactMessages,
  createContactMessage,
  updateMessageStatus,
  deleteContactMessage
} = contactMessageController;

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to submit a contact message
router.post('/', createContactMessage);

// Protected routes (Admin/Staff only)
router.use(protect);
router.use(authorize('admin', 'super-admin', 'staff'));

router.get('/', getContactMessages);
router.patch('/:id/status', updateMessageStatus);
router.delete('/:id', deleteContactMessage);

export default router;
