import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import socketService from './socketService.js';

// Group Chat Room Schema
const groupChatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  type: {
    type: String,
    enum: ['class', 'department', 'project', 'general', 'announcement'],
    default: 'general',
  },
  avatar: String,
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    lastReadAt: Date,
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'file', 'image', 'video', 'audio', 'system'],
      default: 'text',
    },
    attachments: [{
      name: String,
      url: String,
      type: String,
      size: Number,
    }],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
    },
    reactions: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      emoji: String,
    }],
    isEdited: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    readBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      readAt: Date,
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  settings: {
    allowMemberInvite: {
      type: Boolean,
      default: true,
    },
    allowFileSharing: {
      type: Boolean,
      default: true,
    },
    allowReactions: {
      type: Boolean,
      default: true,
    },
    muteNotifications: {
      type: Boolean,
      default: false,
    },
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true,
  },
}, {
  timestamps: true,
});

const GroupChatRoom = mongoose.model('GroupChatRoom', groupChatRoomSchema);

class GroupChatService {
  /**
   * Create group chat room
   * @param {Object} roomData - Room data
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Chat room
   */
  async createRoom(roomData, tenantId) {
    try {
      const room = new GroupChatRoom({
        ...roomData,
        tenant: tenantId,
      });

      await room.save();
      await room.populate(['members.user']);

      logger.info(`Group chat room created: ${room._id}`);
      return room;
    } catch (error) {
      logger.error(`Error creating group chat room: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get rooms
   * @param {string} tenantId - Tenant ID
   * @param {Object} filters - Filters
   * @returns {Object} Rooms with pagination
   */
  async getRooms(tenantId, filters = {}) {
    try {
      const { page = 1, limit = 20, type, userId, search } = filters;
      const query = { tenant: tenantId, isArchived: false };

      if (type) query.type = type;
      if (userId) query['members.user'] = userId;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const rooms = await GroupChatRoom.find(query)
        .populate(['members.user'])
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ updatedAt: -1 });

      const total = await GroupChatRoom.countDocuments(query);

      return {
        rooms,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error(`Error fetching group chat rooms: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get room by ID
   * @param {string} roomId - Room ID
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Room
   */
  async getRoomById(roomId, tenantId) {
    try {
      const room = await GroupChatRoom.findOne({
        _id: roomId,
        tenant: tenantId,
      }).populate(['members.user', 'messages.sender']);

      if (!room) {
        throw new Error('Group chat room not found');
      }

      return room;
    } catch (error) {
      logger.error(`Error fetching group chat room: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send message
   * @param {string} roomId - Room ID
   * @param {Object} messageData - Message data
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Message
   */
  async sendMessage(roomId, messageData, tenantId) {
    try {
      const room = await GroupChatRoom.findOne({
        _id: roomId,
        tenant: tenantId,
      });

      if (!room) {
        throw new Error('Group chat room not found');
      }

      const message = {
        ...messageData,
        createdAt: new Date(),
      };

      room.messages.push(message);
      await room.save();

      const populatedRoom = await GroupChatRoom.findById(roomId)
        .populate(['members.user', 'messages.sender']);

      const newMessage = populatedRoom.messages[populatedRoom.messages.length - 1];

      // Emit real-time message to room members
      room.members.forEach(member => {
        if (member.user.toString() !== messageData.sender.toString()) {
          socketService.sendNotificationToUser(member.user, {
            type: 'group_message',
            title: `New message in ${room.name}`,
            message: messageData.content,
            roomId: room._id,
          });
        }
      });

      logger.info(`Message sent to room: ${roomId}`);
      return newMessage;
    } catch (error) {
      logger.error(`Error sending message: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get messages
   * @param {string} roomId - Room ID
   * @param {string} tenantId - Tenant ID
   * @param {Object} filters - Filters
   * @returns {Object} Messages with pagination
   */
  async getMessages(roomId, tenantId, filters = {}) {
    try {
      const { page = 1, limit = 50, before } = filters;

      const room = await GroupChatRoom.findOne({
        _id: roomId,
        tenant: tenantId,
      });

      if (!room) {
        throw new Error('Group chat room not found');
      }

      let messages = room.messages.filter(m => !m.isDeleted);

      if (before) {
        messages = messages.filter(m => m.createdAt < new Date(before));
      }

      const total = messages.length;
      const startIndex = Math.max(0, total - (page * limit));
      const endIndex = total - ((page - 1) * limit);

      messages = messages.slice(startIndex, endIndex);

      await GroupChatRoom.populate(messages, { path: 'sender' });

      return {
        messages,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error(`Error fetching messages: ${error.message}`);
      throw error;
    }
  }

  /**
   * Add member to room
   * @param {string} roomId - Room ID
   * @param {string} userId - User ID
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Updated room
   */
  async addMember(roomId, userId, tenantId) {
    try {
      const room = await GroupChatRoom.findOne({
        _id: roomId,
        tenant: tenantId,
      });

      if (!room) {
        throw new Error('Group chat room not found');
      }

      const existingMember = room.members.find(
        m => m.user.toString() === userId
      );

      if (existingMember) {
        throw new Error('User is already a member');
      }

      room.members.push({
        user: userId,
        role: 'member',
        joinedAt: new Date(),
      });

      await room.save();
      await room.populate(['members.user']);

      logger.info(`Member added to room: ${roomId}`);
      return room;
    } catch (error) {
      logger.error(`Error adding member: ${error.message}`);
      throw error;
    }
  }

  /**
   * Remove member from room
   * @param {string} roomId - Room ID
   * @param {string} userId - User ID
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Updated room
   */
  async removeMember(roomId, userId, tenantId) {
    try {
      const room = await GroupChatRoom.findOne({
        _id: roomId,
        tenant: tenantId,
      });

      if (!room) {
        throw new Error('Group chat room not found');
      }

      room.members = room.members.filter(
        m => m.user.toString() !== userId
      );

      await room.save();

      logger.info(`Member removed from room: ${roomId}`);
      return room;
    } catch (error) {
      logger.error(`Error removing member: ${error.message}`);
      throw error;
    }
  }

  /**
   * Mark messages as read
   * @param {string} roomId - Room ID
   * @param {string} userId - User ID
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Updated room
   */
  async markAsRead(roomId, userId, tenantId) {
    try {
      const room = await GroupChatRoom.findOne({
        _id: roomId,
        tenant: tenantId,
      });

      if (!room) {
        throw new Error('Group chat room not found');
      }

      const member = room.members.find(m => m.user.toString() === userId);
      if (member) {
        member.lastReadAt = new Date();
      }

      await room.save();

      return room;
    } catch (error) {
      logger.error(`Error marking messages as read: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete message
   * @param {string} roomId - Room ID
   * @param {string} messageId - Message ID
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Updated room
   */
  async deleteMessage(roomId, messageId, tenantId) {
    try {
      const room = await GroupChatRoom.findOne({
        _id: roomId,
        tenant: tenantId,
      });

      if (!room) {
        throw new Error('Group chat room not found');
      }

      const message = room.messages.id(messageId);
      if (message) {
        message.isDeleted = true;
        message.content = 'This message has been deleted';
      }

      await room.save();

      logger.info(`Message deleted: ${messageId}`);
      return room;
    } catch (error) {
      logger.error(`Error deleting message: ${error.message}`);
      throw error;
    }
  }

  /**
   * Add reaction to message
   * @param {string} roomId - Room ID
   * @param {string} messageId - Message ID
   * @param {string} userId - User ID
   * @param {string} emoji - Emoji
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Updated message
   */
  async addReaction(roomId, messageId, userId, emoji, tenantId) {
    try {
      const room = await GroupChatRoom.findOne({
        _id: roomId,
        tenant: tenantId,
      });

      if (!room) {
        throw new Error('Group chat room not found');
      }

      const message = room.messages.id(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      const existingReaction = message.reactions.find(
        r => r.user.toString() === userId && r.emoji === emoji
      );

      if (existingReaction) {
        message.reactions = message.reactions.filter(
          r => !(r.user.toString() === userId && r.emoji === emoji)
        );
      } else {
        message.reactions.push({ user: userId, emoji });
      }

      await room.save();

      return message;
    } catch (error) {
      logger.error(`Error adding reaction: ${error.message}`);
      throw error;
    }
  }

  /**
   * Archive room
   * @param {string} roomId - Room ID
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Updated room
   */
  async archiveRoom(roomId, tenantId) {
    try {
      const room = await GroupChatRoom.findOneAndUpdate(
        { _id: roomId, tenant: tenantId },
        { isArchived: true },
        { new: true }
      );

      if (!room) {
        throw new Error('Group chat room not found');
      }

      logger.info(`Room archived: ${roomId}`);
      return room;
    } catch (error) {
      logger.error(`Error archiving room: ${error.message}`);
      throw error;
    }
  }
}

export default new GroupChatService();
