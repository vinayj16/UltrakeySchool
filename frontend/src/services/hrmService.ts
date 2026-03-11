import type { AxiosRequestConfig } from 'axios';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../config/api';

export interface HrmDesignation {
  designationId: string;
  name: string;
  code?: string;
  level?: number;
  department?: string;
  description?: string;
  status: 'active' | 'inactive';
}

class HrmService {
  async listDesignations(params?: { status?: string; department?: string }): Promise<HrmDesignation[]> {
    const config: AxiosRequestConfig = {
      params: {
        ...(params?.status && { status: params.status }),
        ...(params?.department && { department: params.department })
      }
    };

    const response = await apiClient.get<HrmDesignation[]>(API_ENDPOINTS.HRM.DESIGNATIONS, config);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Unable to load designations');
    }

    if (!response.data.data) {
      throw new Error('Designations payload missing from API');
    }

    return response.data.data;
  }

  async deleteDesignation(designationId: string): Promise<void> {
    const response = await apiClient.delete<{ success: boolean; message?: string }>(
      `${API_ENDPOINTS.HRM.DESIGNATIONS}/${designationId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete designation');
    }
  }

  async createDesignation(data: Omit<HrmDesignation, 'designationId'>): Promise<HrmDesignation> {
    const response = await apiClient.post<HrmDesignation>(API_ENDPOINTS.HRM.DESIGNATIONS, data);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create designation');
    }

    if (!response.data.data) {
      throw new Error('Designation data missing from API response');
    }

    return response.data.data;
  }

  async updateDesignation(designationId: string, data: Partial<HrmDesignation>): Promise<HrmDesignation> {
    const response = await apiClient.put<HrmDesignation>(
      `${API_ENDPOINTS.HRM.DESIGNATIONS}/${designationId}`,
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update designation');
    }

    if (!response.data.data) {
      throw new Error('Designation data missing from API response');
    }

    return response.data.data;
  }
}

export const hrmService = new HrmService();
export default hrmService;
