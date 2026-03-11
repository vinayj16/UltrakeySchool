import apiService from './api';
import type { ApiResponse } from './api';
import { API_ENDPOINTS } from '../config/api';

// Types
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  class: string;
  section?: string;
  rollNumber: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  admissionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  class: string;
  section?: string;
  rollNumber: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  admissionDate: string;
}

export interface UpdateStudentInput extends Partial<CreateStudentInput> {
  status?: 'active' | 'inactive' | 'graduated' | 'transferred';
}

export interface StudentFilters {
  page?: number;
  limit?: number;
  search?: string;
  class?: string;
  section?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Functions
export const studentService = {
  // Get all students with pagination and filters
  async getAll(filters: StudentFilters = {}): Promise<PaginatedResponse<Student>> {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 10,
        ...(filters.search && { search: filters.search }),
        ...(filters.class && { class: filters.class }),
        ...(filters.section && { section: filters.section }),
        ...(filters.status && { status: filters.status }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
      };

      const response = await apiService.get<PaginatedResponse<Student>>(
        API_ENDPOINTS.STUDENTS.LIST,
        params
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch students');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Student Service] Failed to fetch students:', error);
      throw error;
    }
  },

  // Get single student by ID
  async getById(id: string): Promise<Student> {
    try {
      const response = await apiService.get<Student>(
        API_ENDPOINTS.STUDENTS.DETAIL(id)
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch student');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Student Service] Failed to fetch student:', error);
      throw error;
    }
  },

  // Create new student
  async create(data: CreateStudentInput): Promise<Student> {
    try {
      const response = await apiService.post<Student>(
        API_ENDPOINTS.STUDENTS.CREATE,
        data
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create student');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Student Service] Failed to create student:', error);
      throw error;
    }
  },

  // Update existing student
  async update(id: string, data: UpdateStudentInput): Promise<Student> {
    try {
      const response = await apiService.put<Student>(
        API_ENDPOINTS.STUDENTS.UPDATE(id),
        data
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update student');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Student Service] Failed to update student:', error);
      throw error;
    }
  },

  // Delete student
  async delete(id: string): Promise<void> {
    try {
      const response = await apiService.delete<{ success: boolean; message: string }>(
        API_ENDPOINTS.STUDENTS.DELETE(id)
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete student');
      }
    } catch (error) {
      console.error('[Student Service] Failed to delete student:', error);
      throw error;
    }
  },

  // Bulk delete students
  async bulkDelete(ids: string[]): Promise<void> {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>(
        `${API_ENDPOINTS.STUDENTS.LIST}/bulk-delete`,
        { ids }
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to bulk delete students');
      }
    } catch (error) {
      console.error('[Student Service] Failed to bulk delete students:', error);
      throw error;
    }
  },

  // Search students
  async search(query: string): Promise<Student[]> {
    try {
      const response = await apiService.get<Student[]>(
        API_ENDPOINTS.STUDENTS.LIST,
        { search: query }
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to search students');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Student Service] Failed to search students:', error);
      throw error;
    }
  },

  // Get students by class
  async getByClass(classId: string): Promise<Student[]> {
    try {
      const response = await apiService.get<Student[]>(
        `${API_ENDPOINTS.STUDENTS.LIST}/class/${classId}`
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch students by class');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Student Service] Failed to fetch students by class:', error);
      throw error;
    }
  },

  // Get student attendance
  async getAttendance(id: string, startDate?: string, endDate?: string): Promise<Record<string, unknown>[]> {
    try {
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await apiService.get<Record<string, unknown>[]>(
        `${API_ENDPOINTS.STUDENTS.DETAIL(id)}/attendance`,
        params
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch student attendance');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Student Service] Failed to fetch student attendance:', error);
      throw error;
    }
  },

  // Get student fees
  async getFees(id: string): Promise<Record<string, unknown>[]> {
    try {
      const response = await apiService.get<Record<string, unknown>[]>(
        `${API_ENDPOINTS.STUDENTS.DETAIL(id)}/fees`
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch student fees');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Student Service] Failed to fetch student fees:', error);
      throw error;
    }
  },

  // Get student grades
  async getGrades(id: string): Promise<Record<string, unknown>[]> {
    try {
      const response = await apiService.get<Record<string, unknown>[]>(
        `${API_ENDPOINTS.STUDENTS.DETAIL(id)}/grades`
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch student grades');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Student Service] Failed to fetch student grades:', error);
      throw error;
    }
  },

  // Export students to CSV
  async exportCSV(filters: StudentFilters = {}): Promise<Blob> {
    try {
      const params = { ...filters, format: 'csv' };
      const response = await apiService.get<Blob>(
        `${API_ENDPOINTS.STUDENTS.LIST}/export`,
        params
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to export students as CSV');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Student Service] Failed to export students as CSV:', error);
      throw error;
    }
  },

  // Export students to PDF
  async exportPDF(filters: StudentFilters = {}): Promise<Blob> {
    try {
      const params = { ...filters, format: 'pdf' };
      const response = await apiService.get<Blob>(
        `${API_ENDPOINTS.STUDENTS.LIST}/export`,
        params
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to export students as PDF');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Student Service] Failed to export students as PDF:', error);
      throw error;
    }
  },

  // Import students from CSV
  async importCSV(file: File): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiService.post<{ success: number; failed: number; errors: string[] }>(
        `${API_ENDPOINTS.STUDENTS.LIST}/import`,
        formData
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to import students');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Student Service] Failed to import students:', error);
      throw error;
    }
  },

  // Get student statistics
  async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byClass: { class: string; count: number }[];
  }> {
    try {
      const response = await apiService.get<{
        total: number;
        active: number;
        inactive: number;
        byClass: { class: string; count: number }[];
      }>(`${API_ENDPOINTS.STUDENTS.LIST}/statistics`);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch student statistics');
      }
      
      return response.data;
    } catch (error) {
      console.error('[Student Service] Failed to fetch student statistics:', error);
      throw error;
    }
  },
};

export default studentService;
