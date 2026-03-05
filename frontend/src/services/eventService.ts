import axios from 'axios';

const API_URL = '/api/v1/events';

export interface Event {
  _id: string;
  schoolId: string;
  title: string;
  description?: string;
  eventType: 'academic' | 'cultural' | 'sports' | 'celebration' | 'meeting' | 'workshop' | 'other';
  startDate: string;
  endDate: string;
  location?: string;
  organizer?: string;
  targetAudience?: string[];
  classIds?: string[];
  isPublic: boolean;
  attachments?: {
    name: string;
    url: string;
  }[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const eventService = {
  // Get all events
  getAll: async (filters?: {
    schoolId?: string;
    eventType?: string;
    status?: string;
  }): Promise<Event[]> => {
    const params = new URLSearchParams();
    if (filters?.schoolId) params.append('schoolId', filters.schoolId);
    if (filters?.eventType) params.append('eventType', filters.eventType);
    if (filters?.status) params.append('status', filters.status);
    
    const response = await axios.get(`${API_URL}?${params.toString()}`);
    return response.data.data;
  },

  // Get event by ID
  getById: async (id: string): Promise<Event> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
  },

  // Create event
  create: async (data: Partial<Event>): Promise<Event> => {
    const response = await axios.post(API_URL, data);
    return response.data.data;
  },

  // Update event
  update: async (id: string, data: Partial<Event>): Promise<Event> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data.data;
  },

  // Delete event
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },

  // Get upcoming events
  getUpcoming: async (schoolId: string): Promise<Event[]> => {
    const response = await axios.get(`${API_URL}/schools/${schoolId}/upcoming`);
    return response.data.data;
  },

  // Get events by type
  getByType: async (schoolId: string, eventType: string): Promise<Event[]> => {
    const response = await axios.get(`${API_URL}/schools/${schoolId}/type/${eventType}`);
    return response.data.data;
  }
};

export default eventService;
