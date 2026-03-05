import api from './api';

export interface Participant {
  userId: string;
  role?: string;
  name?: string;
  joinedAt: string;
}

export interface Conversation {
  _id: string;
  schoolId: string;
  participants: Participant[];
  title?: string;
  isGroup: boolean;
  groupAdmin?: string;
  lastMessage?: {
    message: string;
    senderId: string;
    sentAt: string;
  };
  unreadCount?: Record<string, number>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'audio' | 'video';
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  readBy?: {
    userId: string;
    readAt: string;
  }[];
  isDeleted: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationData {
  schoolId: string;
  participants: {
    userId: string;
    role?: string;
    name?: string;
  }[];
  title?: string;
  isGroup: boolean;
}

export interface SendMessageData {
  senderId: string;
  senderName?: string;
  content: string;
  messageType?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

const chatService = {
  // Conversations
  createConversation: async (schoolId: string, data: Omit<CreateConversationData, 'schoolId'>) => {
    const response = await api.post(`/chat/schools/${schoolId}/conversations`, data);
    return response.data;
  },

  getConversations: async (schoolId: string, userId: string) => {
    const response = await api.get(`/chat/schools/${schoolId}/users/${userId}/conversations`);
    return response.data;
  },

  getConversationById: async (schoolId: string, conversationId: string) => {
    const response = await api.get(`/chat/schools/${schoolId}/conversations/${conversationId}`);
    return response.data;
  },

  // Messages
  sendMessage: async (conversationId: string, data: SendMessageData) => {
    const response = await api.post(`/chat/conversations/${conversationId}/messages`, data);
    return response.data;
  },

  getMessages: async (conversationId: string, params?: { limit?: number; before?: string }) => {
    const response = await api.get(`/chat/conversations/${conversationId}/messages`, { params });
    return response.data;
  },

  markAsRead: async (conversationId: string, userId: string) => {
    const response = await api.post(`/chat/conversations/${conversationId}/read`, { userId });
    return response.data;
  },

  deleteMessage: async (messageId: string) => {
    const response = await api.delete(`/chat/messages/${messageId}`);
    return response.data;
  }
};

export default chatService;
