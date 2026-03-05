import axios from 'axios';

const API_URL = '/api/v1/commissions';

export interface Commission {
  _id: string;
  agentId: string;
  institutionId: string;
  institutionName: string;
  institutionType: string;
  revenue: number;
  commissionRate: number;
  commissionAmount: number;
  currency: string;
  status: 'pending' | 'approved' | 'paid';
  paymentDate?: string;
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionSummary {
  totalCommission: number;
  pendingCommission: number;
  approvedCommission: number;
  paidCommission: number;
  currentMonthCommission: number;
  commissionRate: number;
}

const commissionService = {
  // Get commissions by agent ID
  getByAgent: async (agentId: string, filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Commission[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    const response = await axios.get(`${API_URL}/agent/${agentId}?${params.toString()}`);
    return response.data.data;
  },

  // Get commission summary for agent
  getSummary: async (agentId: string): Promise<CommissionSummary> => {
    const response = await axios.get(`${API_URL}/agent/${agentId}/summary`);
    return response.data.data;
  },

  // Get commission by ID
  getById: async (id: string): Promise<Commission> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
  },

  // Get all commissions (with pagination)
  getAll: async (params?: {
    agentId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{ commissions: Commission[]; pagination: any }> => {
    const queryParams = new URLSearchParams();
    if (params?.agentId) queryParams.append('agentId', params.agentId);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const response = await axios.get(`${API_URL}?${queryParams.toString()}`);
    return response.data;
  },

  // Create commission
  create: async (data: Partial<Commission>): Promise<Commission> => {
    const response = await axios.post(API_URL, data);
    return response.data.data;
  },

  // Update commission status
  updateStatus: async (id: string, status: string, paymentData?: {
    paymentDate?: string;
    paymentMethod?: string;
    paymentReference?: string;
  }): Promise<Commission> => {
    const response = await axios.patch(`${API_URL}/${id}/status`, {
      status,
      paymentData
    });
    return response.data.data;
  },

  // Update commission
  update: async (id: string, data: Partial<Commission>): Promise<Commission> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data.data;
  },

  // Delete commission
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  }
};

export default commissionService;
