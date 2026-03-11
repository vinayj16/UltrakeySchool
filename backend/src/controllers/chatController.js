import chatService from '../services/chatService.js';

const createConversation = async (req, res, next) => {
  try {
    const { schoolId } = req.params;
    const { participants, isGroup, title } = req.body;
    const conv = await chatService.createConversation(schoolId, participants, isGroup, title);
    res.status(201).json({ success: true, data: conv });
  } catch (error) {
    next(error);
  }
};

const getConversations = async (req, res, next) => {
  try {
    const { schoolId, userId } = req.params;
    const convs = await chatService.getConversations(schoolId, userId);
    res.json({ success: true, data: convs });
  } catch (error) {
    next(error);
  }
};

const getConversationById = async (req, res, next) => {
  try {
    const { schoolId, conversationId } = req.params;
    const conv = await chatService.getConversationById(conversationId, schoolId);
    res.json({ success: true, data: conv });
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { senderId, senderName, content, messageType, attachments } = req.body;
    const msg = await chatService.sendMessage(conversationId, senderId, senderName, content, messageType, attachments);
    res.status(201).json({ success: true, data: msg });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page, limit } = req.query;
    const messages = await chatService.getMessages(conversationId, parseInt(page) || 1, parseInt(limit) || 50);
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;
    await chatService.markAsRead(conversationId, userId);
    res.json({ success: true, message: 'Marked as read' });
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;
    const msg = await chatService.deleteMessage(messageId, userId);
    res.json({ success: true, data: msg });
  } catch (error) {
    next(error);
  }
};


export default {
  createConversation,
  getConversations,
  getConversationById,
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage
};
