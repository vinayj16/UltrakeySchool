import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

class ChatService {
  async createConversation(schoolId, participants, isGroup = false, title = null) {
    return await Conversation.create({ schoolId, participants, isGroup, title });
  }

  async getConversations(schoolId, userId) {
    return await Conversation.find({
      schoolId,
      'participants.userId': userId,
      isActive: true
    }).sort({ updatedAt: -1 });
  }

  async getConversationById(conversationId, schoolId) {
    const conv = await Conversation.findOne({ _id: conversationId, schoolId })
      .populate('participants.userId', 'firstName lastName email');
    if (!conv) throw new Error('Conversation not found');
    return conv;
  }

  async sendMessage(conversationId, senderId, senderName, content, messageType = 'text', attachments = []) {
    const message = await Message.create({
      conversationId,
      senderId,
      senderName,
      content,
      messageType,
      attachments
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: { message: content, senderId, sentAt: new Date() },
      updatedAt: new Date()
    });

    return message;
  }

  async getMessages(conversationId, page = 1, limit = 50) {
    return await Message.find({ conversationId, isDeleted: false })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async markAsRead(conversationId, userId) {
    await Message.updateMany(
      { conversationId, 'readBy.userId': { $ne: userId } },
      { $push: { readBy: { userId, readAt: new Date() } } }
    );

    const conv = await Conversation.findById(conversationId);
    if (conv && conv.unreadCount) {
      conv.unreadCount.set(userId.toString(), 0);
      await conv.save();
    }
  }

  async deleteMessage(messageId, userId) {
    const msg = await Message.findOneAndUpdate(
      { _id: messageId, senderId: userId },
      { isDeleted: true, content: 'This message was deleted' },
      { new: true }
    );
    if (!msg) throw new Error('Message not found or unauthorized');
    return msg;
  }

  async addParticipant(conversationId, userId, name, role) {
    return await Conversation.findByIdAndUpdate(
      conversationId,
      { $push: { participants: { userId, name, role, joinedAt: new Date() } } },
      { new: true }
    );
  }

  async removeParticipant(conversationId, userId) {
    return await Conversation.findByIdAndUpdate(
      conversationId,
      { $pull: { participants: { userId } } },
      { new: true }
    );
  }
}

export default new ChatService();
