import apiClient from './api';

export interface InstitutionRegistrationData {
  instituteType: string;
  instituteCode: string;
  fullName: string;
  email: string;
  agreedToTerms: boolean;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    registrationId: string;
    status: string;
  };
}

class InstitutionRegistrationService {
  /**
   * Submit institution registration request
   */
  async submitRegistration(data: InstitutionRegistrationData): Promise<RegistrationResponse> {
    try {
      const response = await apiClient.post('/pending-institution-registrations/register', data);
      return response.data;
    } catch (error: any) {
      console.error('Institution registration error:', error);
      throw error;
    }
  }

  /**
   * Get registration statistics (for superadmin)
   */
  async getRegistrationStats() {
    try {
      const response = await apiClient.get('/pending-institution-registrations/stats');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching registration stats:', error);
      throw error;
    }
  }

  /**
   * Get pending registrations (for superadmin)
   */
  async getPendingRegistrations(params?: { page?: number; limit?: number; status?: string }) {
    try {
      const response = await apiClient.get('/pending-institution-registrations/pending', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pending registrations:', error);
      throw error;
    }
  }

  /**
   * Get single registration details (for superadmin)
   */
  async getRegistrationById(id: string) {
    try {
      const response = await apiClient.get(`/pending-institution-registrations/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching registration:', error);
      throw error;
    }
  }

  /**
   * Approve registration (for superadmin)
   */
  async approveRegistration(
    id: string,
    payload: {
      institutionId?: string;
      ownerEmail?: string;
      ownerPassword: string;
      notes?: string;
      sendCredentials?: boolean;
    }
  ) {
    try {
      const response = await apiClient.put(`/pending-institution-registrations/${id}/approve`, payload);
      return response.data;
    } catch (error: any) {
      console.error('Error approving registration:', error);
      throw error;
    }
  }

  /**
   * Reject registration (for superadmin)
   */
  async rejectRegistration(id: string, reason?: string) {
    try {
      const response = await apiClient.put(`/pending-institution-registrations/${id}/reject`, {
        reason
      });
      return response.data;
    } catch (error: any) {
      console.error('Error rejecting registration:', error);
      throw error;
    }
  }
}

export const institutionRegistrationService = new InstitutionRegistrationService();
export default institutionRegistrationService;
