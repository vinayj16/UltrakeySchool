import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';

interface StudentStats {
  total: number;
  active: number;
  male: number;
  female: number;
  avgAttendance?: number;
}

interface Student {
  _id: string;
  admissionNumber: string;
  rollNumber?: string;
  firstName: string;
  lastName: string;
  email?: string;
  gender: string;
  classId?: {
    _id: string;
    name: string;
    grade?: string;
  };
  sectionId?: {
    _id: string;
    name: string;
  };
  admissionDate: string;
  status?: string;
  isActive: boolean;
}

const StudentOverviewPage: React.FC = () => {
  const [stats, setStats] = useState<StudentStats>({
    total: 0,
    active: 0,
    male: 0,
    female: 0,
    avgAttendance: 0
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get schoolId from user context or localStorage
  const schoolId = localStorage.getItem('schoolId') || '507f1f77bcf86cd799439011'; // Default for demo

  const fetchStudentStats = async () => {
    try {
      const response = await apiClient.get('/statistics/students');
      if (response.data.success) {
        const statsData = response.data.data;
        setStats({
          total: statsData.total || 0,
          active: statsData.active || 0,
          male: statsData.male || 0,
          female: statsData.female || 0,
          avgAttendance: statsData.avgAttendance || 0
        });
      }
    } catch (err: any) {
      console.error('Error fetching student stats:', err);
      // Calculate stats from student data if stats endpoint fails
      calculateStatsFromData();
    }
  };

  const calculateStatsFromData = () => {
    const total = students.length;
    const active = students.filter(s => s.isActive).length;
    const male = students.filter(s => s.gender === 'male').length;
    const female = students.filter(s => s.gender === 'female').length;
    
    setStats({
      total,
      active,
      male,
      female,
      avgAttendance: 0
    });
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/students', {
        params: { 
          schoolId,
          limit: 50,
          status: 'active'
        }
      });
      
      if (response.data.success) {
        setStudents(response.data.data || []);
      }
      
      // Fetch stats separately
      await fetchStudentStats();
    } catch (err: any) {
      console.error('Error fetching students:', err);
      setError(err.response?.data?.message || 'Failed to load students');
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleRefresh = () => {
    fetchStudents();
  };

  const handleExport = () => {
    toast.info('Export functionality coming soon');
  };

  const getGenderBadge = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'male':
        return <span className="badge bg-info">Male</span>;
      case 'female':
        return <span className="badge bg-primary">Female</span>;
      case 'other':
        return <span className="badge bg-secondary">Other</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
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

  return (
    <div className="container-fluid">
      <div className="d-md-flex d-block align-items-center justify-content-between mb-4">
        <div>
          <h4 className="mb-0">Student Overview</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active">Student Overview</li>
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
          <p className="mt-2 text-muted">Loading student data...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="alert alert-danger" role="alert">
          <i className="ti ti-alert-circle me-2"></i>
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchStudents}
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
                      <h6 className="mb-0">Total Students</h6>
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
                      <h6 className="mb-0">Active Students</h6>
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
              <div className="card border-left-info">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <h6 className="mb-0">Male Students</h6>
                      <h3 className="mb-0 text-info">{stats.male}</h3>
                    </div>
                    <div className="avatar-sm bg-info-light rounded-circle">
                      <i className="ti ti-gender-male text-info"></i>
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
                      <h6 className="mb-0">Female Students</h6>
                      <h3 className="mb-0 text-warning">{stats.female}</h3>
                    </div>
                    <div className="avatar-sm bg-warning-light rounded-circle">
                      <i className="ti ti-gender-female text-warning"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {students.length === 0 && (
            <div className="text-center py-5">
              <i className="ti ti-users" style={{ fontSize: '48px', color: '#ccc' }}></i>
              <p className="mt-2 text-muted">No students found</p>
            </div>
          )}

          {/* Students Table */}
          {students.length > 0 && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Students Details ({students.length})</h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Grade</th>
                            <th>Section</th>
                            <th>Roll Number</th>
                            <th>Gender</th>
                            <th>Admission Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student._id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-sm bg-primary rounded-circle me-2">
                                    <i className="ti ti-user text-white"></i>
                                  </div>
                                  <div>
                                    <div className="fw-medium">
                                      {student.firstName} {student.lastName}
                                    </div>
                                    <small className="text-muted">{student.admissionNumber}</small>
                                  </div>
                                </div>
                              </td>
                              <td>{student.email || '-'}</td>
                              <td>{student.classId?.name || '-'}</td>
                              <td>{student.sectionId?.name || '-'}</td>
                              <td>{student.rollNumber || '-'}</td>
                              <td>{getGenderBadge(student.gender)}</td>
                              <td>{formatDate(student.admissionDate)}</td>
                              <td>
                                <span className={`badge ${student.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                  {student.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
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
                                    title="Edit Student"
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

export default StudentOverviewPage;
