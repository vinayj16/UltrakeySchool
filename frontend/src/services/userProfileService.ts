import axios from 'axios';

const API_URL = '/api/v1/profile';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  status: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  dateOfBirth?: string;
  gender?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  permissions?: string[];
  preferences?: any; // Allow any preferences structure
}

const userProfileService = {
  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await axios.get(`${API_URL}/me`);
    return response.data.data;
  },

  // Update current user profile
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await axios.put(`${API_URL}/me`, data);
    return response.data.data;
  },

  // Get user permissions
  getPermissions: async (): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/me/permissions`);
    return response.data.data.permissions;
  }
};

export default userProfileService;
