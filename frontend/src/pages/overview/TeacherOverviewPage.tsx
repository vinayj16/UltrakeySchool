import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';

interface TeacherStats {
  total: number;
  active: number;
  onLeave?: number;
  departments?: number;
}

interface Teacher {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId?: {
    _id: string;
    name: string;
  };
  designation?: string;
  subjects?: Array<{
    _id: string;
    name: string;
  }>;
  classes?: Array<{
    _id: string;
    name: string;
  }>;
  joiningDate: string;
  status?: string;
  isActive: boolean;
}

const TeacherOverviewPage: React.FC = () => {
  const [stats, setStats] = useState<TeacherStats>({
    total: 0,
    active: 0,
    onLeave: 0,
    departments: 0
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get schoolId from user context or localStorage
  const schoolId = localStorage.getItem('schoolId') || '507f1f77bcf86cd799439011'; // Default for demo

  const fetchTeacherStats = async () => {
    try {
      const response = await apiClient.get('/statistics/teachers');
      if (response.data.success) {
        const statsData = response.data.data;
        setStats({
          total: statsData.total || 0,
          active: statsData.active || 0,
          onLeave: statsData.onLeave || 0,
          departments: statsData.departments || 0
        });
      }
    } catch (err: any) {
      console.error('Error fetching teacher stats:', err);
      // Calculate stats from teacher data if stats endpoint fails
      calculateStatsFromData();
    }
  };

  const calculateStatsFromData = () => {
    const total = teachers.length;
    const active = teachers.filter(t => t.isActive).length;
    const uniqueDepartments = new Set(
      teachers
        .filter(t => t.departmentId)
        .map(t => t.departmentId!._id)
    );
    
    setStats({
      total,
      active,
      onLeave: total - active,
      departments: uniqueDepartments.size
    });
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/teachers', {
        params: { 
          schoolId,
          limit: 50
        }
      });
      
      if (response.data.success) {
        setTeachers(response.data.data || []);
      }
      
      // Fetch stats separately
      await fetchTeacherStats();
    } catch (err: any) {
      console.error('Error fetching teachers:', err);
      setError(err.response?.data?.message || 'Failed to load teachers');
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleRefresh = () => {
    fetchTeachers();
  };

  const handleExport = () => {
    toast.info('Export functionality coming soon');
  };

  const getStatusBadge = (teacher: Teacher) => {
    if (!teacher.isActive) {
      return <span className="badge bg-secondary">Inactive</span>;
    }
    if (teacher.status === 'on-leave') {
      return <span className="badge bg-warning">On Leave</span>;
    }
    return <span className="badge bg-success">Active</span>;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit' 
    });
  };

  const getSubjectsDisplay = (subjects?: Teacher['subjects']) => {
    if (!subjects || subjects.length === 0) return '-';
    return subjects.map(s => s.name).join(', ');
  };

  const getClassesDisplay = (classes?: Teacher['classes']) => {
    if (!classes || classes.length === 0) return '-';
    return classes.map(c => c.name).join(', ');
  };

  return (
    <div className="container-fluid">
      <div className="d-md-flex d-block align-items-center justify-content-between mb-4">
        <div>
          <h4 className="mb-0">Teaching Overview</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active">Teaching Overview</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={handleExport}
          >
            <i className="ti ti-download me-1"></i>
            Export Report
          </button>
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <i className="ti ti-refresh me-1"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading teacher data...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="alert alert-danger" role="alert">
          <i className="ti ti-alert-circle me-2"></i>
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchTeachers}
          >
            <i className="ti ti-refresh me-1"></i>Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6 mb-3">
              <div className="card border-left-primary">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h6 className="mb-0">Total Teachers</h6>
                      <h3 className="mb-0 text-primary">{stats.total}</h3>
                    </div>
                    <div className="avatar-sm bg-primary-light rounded-circle">
                      <i className="ti ti-users text-primary"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-3">
              <div className="card border-left-success">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h6 className="mb-0">Active Teachers</h6>
                      <h3 className="mb-0 text-success">{stats.active}</h3>
                    </div>
                    <div className="avatar-sm bg-success-light rounded-circle">
                      <i className="ti ti-user-check text-success"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-3">
              <div className="card border-left-warning">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h6 className="mb-0">On Leave</h6>
                      <h3 className="mb-0 text-warning">{stats.onLeave || 0}</h3>
                    </div>
                    <div className="avatar-sm bg-warning-light rounded-circle">
                      <i className="ti ti-calendar-off text-warning"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-3">
              <div className="card border-left-info">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h6 className="mb-0">Departments</h6>
                      <h3 className="mb-0 text-info">{stats.departments || 0}</h3>
                    </div>
                    <div className="avatar-sm bg-info-light rounded-circle">
                      <i className="ti ti-building text-info"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {teachers.length === 0 && (
            <div className="text-center py-5">
              <i className="ti ti-users" style={{ fontSize: '48px', color: '#ccc' }}></i>
              <p className="mt-2 text-muted">No teachers found</p>
            </div>
          )}

          {/* Teachers Table */}
          {teachers.length > 0 && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Teachers Details ({teachers.length})</h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Subjects</th>
                            <th>Classes</th>
                            <th>Status</th>
                            <th>Join Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teachers.map((teacher) => (
                            <tr key={teacher._id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-sm bg-primary rounded-circle me-2">
                                    <i className="ti ti-user text-white"></i>
                                  </div>
                                  <div>
                                    <div className="fw-medium">
                                      {teacher.firstName} {teacher.lastName}
                                    </div>
                                    <small className="text-muted">{teacher.employeeId}</small>
                                  </div>
                                </div>
                              </td>
                              <td>{teacher.email}</td>
                              <td>{teacher.departmentId?.name || '-'}</td>
                              <td>
                                <span className="text-truncate d-inline-block" style={{ maxWidth: '150px' }} title={getSubjectsDisplay(teacher.subjects)}>
                                  {getSubjectsDisplay(teacher.subjects)}
                                </span>
                              </td>
                              <td>
                                <span className="text-truncate d-inline-block" style={{ maxWidth: '150px' }} title={getClassesDisplay(teacher.classes)}>
                                  {getClassesDisplay(teacher.classes)}
                                </span>
                              </td>
                              <td>{getStatusBadge(teacher)}</td>
                              <td>{formatDate(teacher.joiningDate)}</td>
                              <td>
                                <div className="btn-group">
                                  <button 
                                    className="btn btn-sm btn-outline-primary"
                                    title="View Details"
                                  >
                                    <i className="ti ti-eye"></i>
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-info"
                                    title="Edit Teacher"
                                  >
                                    <i className="ti ti-edit"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherOverviewPage;
