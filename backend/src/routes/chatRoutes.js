import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as chatController from '../controllers/chatController.js';

const router = express.Router();
router.use(authenticate);

router.post('/schools/:schoolId/conversations', chatController.createConversation);
router.get('/schools/:schoolId/users/:userId/conversations', chatController.getConversations);
router.get('/schools/:schoolId/conversations/:conversationId', chatController.getConversationById);
router.post('/conversations/:conversationId/messages', chatController.sendMessage);
router.get('/conversations/:conversationId/messages', chatController.getMessages);
router.post('/conversations/:conversationId/read', chatController.markAsRead);
router.delete('/messages/:messageId', chatController.deleteMessage);

export default router;
