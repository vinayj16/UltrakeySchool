import apiService from './api';

export interface Institution {
  _id: string;
  name: string;
  type: string;
  plan: string;
  status: 'Active' | 'Suspended' | 'Expired';
  subscriptionExpiry: string;
  autoRenew: boolean;
  lastPaymentDate: string;
  nextPaymentDate: string;
  overdueAmount: number;
  contactEmail: string;
  contactPhone: string;
}

export interface ExpiryAlert {
  _id: string;
  institutionId: string;
  institutionName: string;
  daysUntilExpiry: number;
  expiryDate: string;
  plan: string;
  amount: number;
  autoRenew: boolean;
  status: 'pending' | 'renewed' | 'expired';
  reminderSent: boolean;
  lastReminderDate?: string;
}

export interface OverduePayment {
  _id: string;
  institutionId: string;
  institutionName: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  plan: string;
  status: 'overdue' | 'paid' | 'cancelled';
  paymentMethod: string;
  reminderCount: number;
  lastReminderDate?: string;
}

export interface RenewalReminder {
  _id: string;
  institutionId: string;
  institutionName: string;
  expiryDate: string;
  daysUntilExpiry: number;
  plan: string;
  renewalAmount: number;
  status: 'scheduled' | 'sent' | 'acknowledged';
  nextReminderDate: string;
  reminderFrequency: 'daily' | 'weekly' | 'bi-weekly';
}

export interface AutoRenewSetting {
  _id: string;
  institutionId: string;
  institutionName: string;
  plan: string;
  autoRenew: boolean;
  paymentMethod: string;
  lastRenewalDate?: string;
  nextRenewalDate: string;
  renewalAmount: number;
  status: 'active' | 'paused' | 'failed';
}

export const superAdminService = {
  // Alerts
  getExpiryAlerts: async (): Promise<ExpiryAlert[]> => {
    try {
      const response = await apiService.get<ExpiryAlert[]>('/super-admin/expiry-alerts');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch expiry alerts');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch expiry alerts:', error);
      throw error;
    }
  },

  getOverduePayments: async (): Promise<OverduePayment[]> => {
    try {
      const response = await apiService.get<OverduePayment[]>('/super-admin/overdue-payments');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch overdue payments');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch overdue payments:', error);
      throw error;
    }
  },

  getRenewalReminders: async (): Promise<RenewalReminder[]> => {
    try {
      const response = await apiService.get<RenewalReminder[]>('/super-admin/renewal-reminders');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch renewal reminders');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch renewal reminders:', error);
      throw error;
    }
  },

  getAutoRenewSettings: async (): Promise<AutoRenewSetting[]> => {
    try {
      const response = await apiService.get<AutoRenewSetting[]>('/super-admin/auto-renew');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch auto-renew settings');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch auto-renew settings:', error);
      throw error;
    }
  },

  // Actions
  renewSubscription: async (institutionId: string, data: Record<string, unknown>): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>(
        `/super-admin/renew/${institutionId}`,
        data
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to renew subscription');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to renew subscription:', error);
      throw error;
    }
  },

  toggleAutoRenew: async (institutionId: string, enabled: boolean): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.put<{ success: boolean; message: string }>(
        `/super-admin/auto-renew/${institutionId}`,
        { enabled }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to toggle auto-renew');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to toggle auto-renew:', error);
      throw error;
    }
  },

  sendReminder: async (institutionId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>(
        `/super-admin/send-reminder/${institutionId}`,
        {}
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to send reminder');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to send reminder:', error);
      throw error;
    }
  },

  reactivateInstitution: async (institutionId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>(
        `/super-admin/reactivate/${institutionId}`,
        {}
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to reactivate institution');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to reactivate institution:', error);
      throw error;
    }
  },

  // Institutions
  getInstitutions: async (): Promise<Institution[]> => {
    try {
      const response = await apiService.get<Institution[]>('/super-admin/institutions');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch institutions');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch institutions:', error);
      throw error;
    }
  },

  getAlertsSummary: async (): Promise<Record<string, unknown>> => {
    try {
      const response = await apiService.get<Record<string, unknown>>('/super-admin/alerts-summary');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch alerts summary');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch alerts summary:', error);
      throw error;
    }
  },

  // Analytics
  getAnalyticsSummary: async (): Promise<Record<string, unknown>> => {
    try {
      const response = await apiService.get<Record<string, unknown>>('/super-admin/analytics/summary');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch analytics summary');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch analytics summary:', error);
      throw error;
    }
  },

  getInstitutionsAnalytics: async (): Promise<Record<string, unknown>> => {
    try {
      const response = await apiService.get<Record<string, unknown>>('/super-admin/analytics/institutions');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch institutions analytics');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch institutions analytics:', error);
      throw error;
    }
  },

  getRevenueAnalytics: async (): Promise<Record<string, unknown>> => {
    try {
      const response = await apiService.get<Record<string, unknown>>('/super-admin/analytics/revenue');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch revenue analytics');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch revenue analytics:', error);
      throw error;
    }
  },

  getUserAnalytics: async (): Promise<Record<string, unknown>> => {
    try {
      const response = await apiService.get<Record<string, unknown>>('/super-admin/analytics/users');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch user analytics');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch user analytics:', error);
      throw error;
    }
  },

  getBranchAnalytics: async (): Promise<Record<string, unknown>> => {
    try {
      const response = await apiService.get<Record<string, unknown>>('/super-admin/analytics/branches');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch branch analytics');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch branch analytics:', error);
      throw error;
    }
  },

  getSubscriptionAnalytics: async (): Promise<Record<string, unknown>> => {
    try {
      const response = await apiService.get<Record<string, unknown>>('/super-admin/analytics/subscriptions');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch subscription analytics');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch subscription analytics:', error);
      throw error;
    }
  },

  getSupportAnalytics: async (): Promise<Record<string, unknown>> => {
    try {
      const response = await apiService.get<Record<string, unknown>>('/super-admin/analytics/support');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch support analytics');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch support analytics:', error);
      throw error;
    }
  },

  // Audit Logs
  getAuditLogs: async (params?: Record<string, unknown>): Promise<Record<string, unknown>[]> => {
    try {
      const response = await apiService.get<Record<string, unknown>[]>('/super-admin/audit-logs', params);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch audit logs');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch audit logs:', error);
      throw error;
    }
  },

  getAuditLogSummary: async (): Promise<Record<string, unknown>> => {
    try {
      const response = await apiService.get<Record<string, unknown>>('/super-admin/audit-logs/summary');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch audit log summary');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch audit log summary:', error);
      throw error;
    }
  },

  // Branch Details
  getBranchDetails: async (branchId: string): Promise<Record<string, unknown>> => {
    try {
      const response = await apiService.get<Record<string, unknown>>(`/super-admin/branches/${branchId}`);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch branch details');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch branch details:', error);
      throw error;
    }
  },

  getBranchStudents: async (branchId: string): Promise<Record<string, unknown>[]> => {
    try {
      const response = await apiService.get<Record<string, unknown>[]>(`/super-admin/branches/${branchId}/students`);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch branch students');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch branch students:', error);
      throw error;
    }
  },

  // Pending Requests Management
  getPendingRequests: async (): Promise<Record<string, unknown>> => {
    try {
      const response = await apiService.get<Record<string, unknown>>('/super-admin/pending-requests');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch pending requests');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch pending requests:', error);
      throw error;
    }
  },

  approveRequest: async (userId: string, data: { notes?: string; credentials?: { email: string; password: string; role: string } }): Promise<Record<string, unknown>> => {
    try {
      const response = await apiService.post<Record<string, unknown>>(`/super-admin/approve-request/${userId}`, data);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to approve request');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to approve request:', error);
      throw error;
    }
  },

  rejectRequest: async (userId: string, data: { reason?: string; notes?: string }): Promise<Record<string, unknown>> => {
    try {
      const response = await apiService.post<Record<string, unknown>>(`/super-admin/reject-request/${userId}`, data);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to reject request');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to reject request:', error);
      throw error;
    }
  },

  // Credentials Management
  createCredentials: async (userId: string, data: { email: string; password: string; role: string; permissions: string[] }): Promise<Record<string, unknown>> => {
    try {
      const response = await apiService.post<Record<string, unknown>>(`/super-admin/create-credentials/${userId}`, data);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create credentials');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to create credentials:', error);
      throw error;
    }
  },

  // Dashboard data
  getDashboardData: async (): Promise<Record<string, unknown>> => {
    try {
      const response = await apiService.get<Record<string, unknown>>('/super-admin/dashboard');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch dashboard data');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Super Admin Service] Failed to fetch dashboard data:', error);
      throw error;
    }
  }
};

export default superAdminService;
