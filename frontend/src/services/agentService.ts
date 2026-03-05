import apiService from './api';
import type { ApiResponse } from './api';

export interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  commissionRate: number;
  status: 'Active' | 'Suspended' | 'Inactive';
  performance: 'Excellent' | 'Good' | 'Average' | 'Poor';
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    name: string;
    email: string;
  };
  updatedBy?: {
    name: string;
    email: string;
  };
}

export interface CreateAgentInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  commissionRate: number;
  status: 'Active' | 'Suspended' | 'Inactive';
  notes: string;
}

export interface UpdateAgentInput extends Partial<CreateAgentInput> {
  _id: string;
}

export const agentService = {
  // Get all agents
  getAll: async (): Promise<Agent[]> => {
    try {
      const response = await apiService.get<Agent[]>('/super-admin/agents');

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch agents');
      }

      return response.data;
    } catch (error) {
      console.error('[Agent Service] Failed to fetch agents:', error);
      throw error;
    }
  },

  // Get agent by ID
  getById: async (id: string): Promise<Agent> => {
    try {
      const response = await apiService.get<Agent>(`/super-admin/agents/${id}`);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch agent');
      }

      return response.data;
    } catch (error) {
      console.error('[Agent Service] Failed to fetch agent:', error);
      throw error;
    }
  },

  // Create new agent
  create: async (data: CreateAgentInput): Promise<Agent> => {
    try {
      const response = await apiService.post<Agent>('/super-admin/agents', data);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create agent');
      }

      return response.data;
    } catch (error) {
      console.error('[Agent Service] Failed to create agent:', error);
      throw error;
    }
  },

  // Update agent
  update: async (id: string, data: Partial<CreateAgentInput>): Promise<Agent> => {
    try {
      const response = await apiService.put<Agent>(`/super-admin/agents/${id}`, data);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to update agent');
      }

      return response.data;
    } catch (error) {
      console.error('[Agent Service] Failed to update agent:', error);
      throw error;
    }
  },

  // Delete agent
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.delete<{ success: boolean; message: string }>(`/super-admin/agents/${id}`);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to delete agent');
      }

      return response.data;
    } catch (error) {
      console.error('[Agent Service] Failed to delete agent:', error);
      throw error;
    }
  },

  // Bulk update status
  bulkUpdateStatus: async (ids: string[], status: 'Active' | 'Suspended' | 'Inactive'): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.put<{ success: boolean; message: string }>(
        '/super-admin/agents/bulk-status',
        { ids, status }
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to update agent statuses');
      }

      return response.data;
    } catch (error) {
      console.error('[Agent Service] Failed to bulk update agent statuses:', error);
      throw error;
    }
  }
};

export default agentService;
