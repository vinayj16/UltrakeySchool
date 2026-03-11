import apiService from './api';

const API_URL = 'commissions';

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

type CommissionFilters = {
  status?: string;
  startDate?: string;
  endDate?: string;
};

const commissionService = {
  // Get commissions by agent ID
  getByAgent: async (agentId: string, filters?: CommissionFilters): Promise<Commission[]> => {
    const params: Record<string, string> = {};
    if (filters?.status) params.status = filters.status;
    if (filters?.startDate) params.startDate = filters.startDate;
    if (filters?.endDate) params.endDate = filters.endDate;

    const response = await apiService.get<Commission[]>(`${API_URL}/agent/${agentId}`, Object.keys(params).length ? params : undefined);
    return response.data ?? [];
  },

  // Get commission summary for agent
  getSummary: async (agentId: string): Promise<CommissionSummary> => {
    const response = await apiService.get<CommissionSummary>(`${API_URL}/agent/${agentId}/summary`);
    return response.data!;
  },

  // Get commission by ID
  getById: async (id: string): Promise<Commission> => {
    const response = await apiService.get<Commission>(`${API_URL}/${id}`);
    return response.data!;
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
    const queryParams: Record<string, string | number> = {};
    if (params?.agentId) queryParams.agentId = params.agentId;
    if (params?.status) queryParams.status = params.status;
    if (params?.startDate) queryParams.startDate = params.startDate;
    if (params?.endDate) queryParams.endDate = params.endDate;
    if (params?.page !== undefined) queryParams.page = params.page;
    if (params?.limit !== undefined) queryParams.limit = params.limit;
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;

    const response = await apiService.get<{ commissions: Commission[]; pagination: any }>(API_URL, Object.keys(queryParams).length ? queryParams : undefined);
    return response.data ?? { commissions: [], pagination: {} };
  },

  // Create commission
  create: async (data: Partial<Commission>): Promise<Commission> => {
    const response = await apiService.post<Commission>(API_URL, data);
    return response.data!;
  },

  // Update commission status
  updateStatus: async (
    id: string,
    status: string,
    paymentData?: {
      paymentDate?: string;
      paymentMethod?: string;
      paymentReference?: string;
    }
  ): Promise<Commission> => {
    const response = await apiService.patch<Commission>(`${API_URL}/${id}/status`, {
      status,
      paymentData
    });
    return response.data!;
  },

  // Update commission
  update: async (id: string, data: Partial<Commission>): Promise<Commission> => {
    const response = await apiService.put<Commission>(`${API_URL}/${id}`, data);
    return response.data!;
  },

  // Delete commission
  delete: async (id: string): Promise<void> => {
    await apiService.delete<void>(`${API_URL}/${id}`);
  }
};

export default commissionService;
