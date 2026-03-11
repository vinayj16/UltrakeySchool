import apiService, { type ApiResponse } from './api';

export interface Branch {
  _id: string;
  id: string;
  name: string;
  code: string;
  institutionId: string;
  institutionName: string;
  institutionType: string;
  address: {
    street?: string;
    city: string;
    state: string;
    country?: string;
    postalCode?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    alternatePhone?: string;
  };
  branchHead?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  students: number;
  teachers?: number;
  staff?: number;
  capacity?: {
    maxStudents?: number;
    maxTeachers?: number;
    maxStaff?: number;
  };
  facilities?: string[];
  status: 'Active' | 'Suspended' | 'Inactive';
  establishedDate?: string;
  lastActivity: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BranchStatistics {
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  capacity: {
    maxStudents?: number;
    maxTeachers?: number;
    maxStaff?: number;
  };
  utilizationRate: number;
  status: string;
  lastActivity: string;
}

export interface BranchesResponse {
  branches: Branch[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const branchService = {
  async createBranch(branchData: Partial<Branch>): Promise<Branch> {
    const response: ApiResponse<Branch> = await apiService.post('/branches', branchData);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create branch');
    }
    return response.data;
  },

  async getBranches(params?: {
    institutionId?: string;
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<BranchesResponse> {
    const response: ApiResponse<BranchesResponse> = await apiService.get('/branches', params);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch branches');
    }
    return response.data;
  },

  async getBranchById(id: string): Promise<Branch> {
    const response: ApiResponse<Branch> = await apiService.get(`/branches/${id}`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch branch');
    }
    return response.data;
  },

  async updateBranch(id: string, updates: Partial<Branch>): Promise<Branch> {
    const response: ApiResponse<Branch> = await apiService.put(`/branches/${id}`, updates);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update branch');
    }
    return response.data;
  },

  async deleteBranch(id: string): Promise<Branch> {
    const response: ApiResponse<Branch> = await apiService.delete(`/branches/${id}`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to delete branch');
    }
    return response.data;
  },

  async getBranchesByInstitution(institutionId: string): Promise<Branch[]> {
    const response: ApiResponse<Branch[]> = await apiService.get(`/branches/institution/${institutionId}`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch branches');
    }
    return response.data;
  },

  async getBranchesByStatus(status: string): Promise<Branch[]> {
    const response: ApiResponse<Branch[]> = await apiService.get(`/branches/status/${status}`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch branches');
    }
    return response.data;
  },

  async searchBranches(query: string, limit?: number): Promise<Branch[]> {
    const params: Record<string, string> = { q: query };
    if (limit) params.limit = String(limit);
    
    const response: ApiResponse<Branch[]> = await apiService.get('/branches/search', params);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to search branches');
    }
    return response.data;
  },

  async getBranchStatistics(id: string): Promise<BranchStatistics> {
    const response: ApiResponse<BranchStatistics> = await apiService.get(`/branches/${id}/statistics`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch statistics');
    }
    return response.data;
  },

  async updateBranchCounts(id: string, counts: { students?: number; teachers?: number; staff?: number }): Promise<Branch> {
    const response: ApiResponse<Branch> = await apiService.put(`/branches/${id}/counts`, counts);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update counts');
    }
    return response.data;
  },

  async suspendBranch(id: string, reason: string): Promise<Branch> {
    const response: ApiResponse<Branch> = await apiService.post(`/branches/${id}/suspend`, { reason });
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to suspend branch');
    }
    return response.data;
  },

  async activateBranch(id: string): Promise<Branch> {
    const response: ApiResponse<Branch> = await apiService.post(`/branches/${id}/activate`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to activate branch');
    }
    return response.data;
  },

  async addTag(id: string, tag: string): Promise<Branch> {
    const response: ApiResponse<Branch> = await apiService.post(`/branches/${id}/tags`, { tag });
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to add tag');
    }
    return response.data;
  },

  async removeTag(id: string, tag: string): Promise<Branch> {
    const response: ApiResponse<Branch> = await apiService.delete(`/branches/${id}/tags`, { tag });
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to remove tag');
    }
    return response.data;
  },

  async getBranchDashboard(): Promise<Record<string, unknown>> {
    const response: ApiResponse<Record<string, unknown>> = await apiService.get('/branches/dashboard');
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch dashboard');
    }
    return response.data;
  },

  async bulkDelete(ids: string[]): Promise<{ deleted: number; failed: number }> {
    const response: ApiResponse<{ deleted: number; failed: number }> = await apiService.post('/branches/bulk-delete', { ids });
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to bulk delete');
    }
    return response.data;
  }
};

export default branchService;
