/**
 * Attendance Service
 * 
 * Handles attendance-related API calls.
 * 
 * Backend API Endpoints:
 * - GET /api/v1/attendance
 * - GET /api/v1/attendance/:id
 * - POST /api/v1/attendance
 * - PUT /api/v1/attendance/:id
 * - POST /api/v1/attendance/mark
 * - GET /api/v1/student-attendance
 */

import apiService, { type ApiResponse } from './api';
import { API_ENDPOINTS } from '../config/api';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused' | 'holiday' | 'halfday';
  remarks?: string;
}

export interface MarkAttendancePayload {
  date: string;
  class_id: string;
  section_id: string;
  records: {
    student_id: string;
    status: 'present' | 'absent' | 'late' | 'excused' | 'holiday' | 'halfday';
    remarks?: string;
  }[];
}

export const attendanceService = {
  /**
   * Get all attendance records
   * @param params - Query parameters
   * @returns List of attendance records
   */
  async getAll(params?: Record<string, any>): Promise<AttendanceRecord[]> {
    const response: ApiResponse<AttendanceRecord[]> = await apiService.get(
      API_ENDPOINTS.ATTENDANCE.LIST,
      params
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch attendance records');
    }
    
    return response.data;
  },

  /**
   * Get attendance record by ID
   * @param id - Attendance record ID
   * @returns Attendance record
   */
  async getById(id: string): Promise<AttendanceRecord> {
    const response: ApiResponse<AttendanceRecord> = await apiService.get(
      API_ENDPOINTS.ATTENDANCE.DETAIL(id)
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch attendance record');
    }
    
    return response.data;
  },

  /**
   * Create new attendance record
   * @param data - Attendance record data
   * @returns Created attendance record
   */
  async create(data: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const response: ApiResponse<AttendanceRecord> = await apiService.post(
      API_ENDPOINTS.ATTENDANCE.CREATE,
      data
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create attendance record');
    }
    
    return response.data;
  },

  /**
   * Update attendance record
   * @param id - Attendance record ID
   * @param data - Updated attendance data
   * @returns Updated attendance record
   */
  async update(id: string, data: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const response: ApiResponse<AttendanceRecord> = await apiService.put(
      API_ENDPOINTS.ATTENDANCE.UPDATE(id),
      data
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update attendance record');
    }
    
    return response.data;
  },

  /**
   * Get student attendance records
   * @param params - Query parameters
   * @returns Student attendance records
   */
  async getStudentAttendance(params?: Record<string, any>): Promise<AttendanceRecord[]> {
    const response: ApiResponse<AttendanceRecord[]> = await apiService.get(
      API_ENDPOINTS.ATTENDANCE.STUDENT,
      params
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch student attendance');
    }
    
    return response.data;
  },

  /**
   * Mark attendance for multiple students
   * @param payload - Attendance marking payload
   * @returns Success response
   */
  async markAttendance(payload: MarkAttendancePayload): Promise<{ success: boolean; message: string }> {
    const response: ApiResponse<{ success: boolean; message: string }> = await apiService.post(
      API_ENDPOINTS.ATTENDANCE.MARK,
      payload
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to mark attendance');
    }
    
    return response.data;
  },
};

export default attendanceService;
