import axios from 'axios';

const API_URL = '/api/v1/school-settings';

export interface BasicInfo {
  schoolName: string;
  phoneNumber?: string;
  email?: string;
  fax?: string;
  address?: string;
  website?: string;
}

export interface SchoolSettings {
  _id: string;
  institutionId: string;
  basicInfo: BasicInfo;
  academicSettings?: any;
  examSettings?: any;
  attendanceSettings?: any;
  feeSettings?: any;
  notificationSettings?: any;
  logo?: {
    url?: string;
    publicId?: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

const schoolSettingsService = {
  // Get school settings by institution ID
  getByInstitution: async (institutionId: string): Promise<SchoolSettings> => {
    const response = await axios.get(`${API_URL}/institution/${institutionId}`);
    return response.data.data;
  },

  // Update basic info
  updateBasicInfo: async (institutionId: string, basicInfo: BasicInfo): Promise<SchoolSettings> => {
    const response = await axios.patch(`${API_URL}/institution/${institutionId}/basic-info`, basicInfo);
    return response.data.data;
  },

  // Create school settings
  create: async (data: Partial<SchoolSettings>): Promise<SchoolSettings> => {
    const response = await axios.post(API_URL, data);
    return response.data.data;
  },

  // Update entire school settings
  update: async (institutionId: string, data: Partial<SchoolSettings>): Promise<SchoolSettings> => {
    const response = await axios.put(`${API_URL}/institution/${institutionId}`, data);
    return response.data.data;
  }
};

export default schoolSettingsService;
