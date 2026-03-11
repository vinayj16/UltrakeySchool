import apiService from './api';
import type { ApiResponse } from './api';
import { API_ENDPOINTS } from '../config/api';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  recipient: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPayload {
  title: string;
  message: string;
  recipients: { type: string; ids: string[] }[];
  channels: string[];
  priority?: 'low' | 'medium' | 'high';
}

export interface NotificationsListResponse {
  success: boolean;
  data: Notification[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface NotificationResponse {
  success: boolean;
  data: Notification;
}

export const notificationService = {
  async getAll(params?: Record<string, unknown>): Promise<NotificationsListResponse> {
    try {
      const response = await apiService.get<NotificationsListResponse>(
        API_ENDPOINTS.NOTIFICATIONS.LIST,
        params
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch notifications');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Notification Service] Failed to fetch notifications:', error);
      throw error;
    }
  },

  async markAsRead(id: string): Promise<NotificationResponse> {
    try {
      const response = await apiService.put<NotificationResponse>(
        API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id),
        {}
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to mark notification as read');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Notification Service] Failed to mark notification as read:', error);
      throw error;
    }
  },

  async markAllAsRead(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.put<{ success: boolean; message: string }>(
        API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ,
        {}
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to mark all notifications as read');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Notification Service] Failed to mark all notifications as read:', error);
      throw error;
    }
  },

  async send(payload: NotificationPayload): Promise<NotificationResponse> {
    try {
      const response = await apiService.post<NotificationResponse>(
        API_ENDPOINTS.NOTIFICATIONS.SEND,
        payload
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to send notification');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Notification Service] Failed to send notification:', error);
      throw error;
    }
  },
};

export default notificationService;
