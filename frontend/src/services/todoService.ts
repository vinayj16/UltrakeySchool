import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/todos';

export interface Todo {
  _id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'pending' | 'inprogress' | 'done' | 'trash';
  completed: boolean;
  important: boolean;
  dueDate?: Date;
  userId: string;
  userName: string;
  userAvatar?: string;
  institutionId?: string;
  tags: string[];
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
    uploadedAt: Date;
  }>;
  completedAt?: Date;
  deletedAt?: Date;
  createdAt: string;
  updatedAt: string;
}

const todoService = {
  getAllTodos: async (params?: { userId?: string; institutionId?: string; status?: string; important?: boolean; completed?: boolean; page?: number; limit?: number }) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  getTodoById: async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createTodo: async (data: Partial<Todo>) => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  updateTodo: async (id: string, data: Partial<Todo>) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  deleteTodo: async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

  toggleComplete: async (id: string) => {
    const response = await axios.patch(`${API_URL}/${id}/toggle-complete`);
    return response.data;
  },

  toggleImportant: async (id: string) => {
    const response = await axios.patch(`${API_URL}/${id}/toggle-important`);
    return response.data;
  },

  moveToTrash: async (id: string) => {
    const response = await axios.patch(`${API_URL}/${id}/trash`);
    return response.data;
  },

  restoreTodo: async (id: string) => {
    const response = await axios.patch(`${API_URL}/${id}/restore`);
    return response.data;
  },

  permanentDelete: async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}/permanent`);
    return response.data;
  },

  bulkDelete: async (ids: string[]) => {
    const response = await axios.post(`${API_URL}/bulk/delete`, { ids });
    return response.data;
  },

  bulkMarkDone: async (ids: string[]) => {
    const response = await axios.post(`${API_URL}/bulk/mark-done`, { ids });
    return response.data;
  },

  bulkMarkUndone: async (ids: string[]) => {
    const response = await axios.post(`${API_URL}/bulk/mark-undone`, { ids });
    return response.data;
  },

  getStatistics: async (userId?: string, institutionId?: string) => {
    const response = await axios.get(`${API_URL}/statistics`, { params: { userId, institutionId } });
    return response.data;
  },

  getTodosByDate: async (userId?: string, institutionId?: string) => {
    const response = await axios.get(`${API_URL}/by-date`, { params: { userId, institutionId } });
    return response.data;
  }
};

export default todoService;
