import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';

interface ParentStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
}

interface Guardian {
  _id: string;
  guardianId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  children: Array<{
    studentId: {
      _id: string;
      firstName: string;
      lastName: string;
      studentId: string;
    };
    relationship: {
      type: string;
      isPrimary: boolean;
    };
    isActive: boolean;
  }>;
  status: string;
  createdAt: string;
  userId?: {
    email: string;
    isActive: boolean;
  };
}

const ParentOverviewPage: React.FC = () => {
  const [stats, setStats] = useState<ParentStats>({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0
  });
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get schoolId from user context or localStorage
  const schoolId = localStorage.getItem('schoolId') || '507f1f77bcf86cd799439011'; // Default for demo

  const fetchGuardianStats = async () => {
    try {
      const response = await apiClient.get(`/guardians/schools/${schoolId}/stats`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err: any) {
      console.error('Error fetching guardian stats:', err);
    }
  };

  const fetchGuardians = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get(`/guardians/schools/${schoolId}`, {
        params: { limit: 50 }
      });
      
      if (response.data.success) {
        setGuardians(response.data.data.guardians || []);
      }
      
      // Fetch stats separately
      await fetchGuardianStats();
    } catch (err: any) {
      console.error('Error fetching guardians:', err);
      setError(err.response?.data?.message || 'Failed to load guardians');
      toast.error('Failed to load guardians');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuardians();
  }, []);

  const handleRefresh = () => {
    fetchGuardians();
  };

  const handleExport = () => {
    toast.info('Export functionality coming soon');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="badge bg-success">Active</span>;
      case 'inactive':
        return <span className="badge bg-secondary">Inactive</span>;
      case 'suspended':
        return <span className="badge bg-danger">Suspended</span>;
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

  const getActiveChildrenCount = (children: Guardian['children']) => {
    return children.filter(child => child.isActive).length;
  };

  const getTotalStudents = () => {
    const uniqueStudents = new Set();
    guardians.forEach(guardian => {
      guardian.children.forEach(child => {
        if (child.isActive && child.studentId) {
          uniqueStudents.add(child.studentId._id);
        }
      });
    });
    return uniqueStudents.size;
  };

  const getAvgEngagement = () => {
    // Calculate based on active guardians with user accounts
    const activeWithAccounts = guardians.filter(g => 
      g.status === 'active' && g.userId?.isActive
    ).length;
    
    if (stats.total === 0) return 0;
    return ((activeWithAccounts / stats.total) * 100).toFixed(1);
  };

  return (
    <div className="container-fluid">
      <div className="d-md-flex d-block align-items-center justify-content-between mb-4">
        <div>
          <h4 className="mb-0">Parent Overview</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active">Parent Overview</li>
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
          <p className="mt-2 text-muted">Loading parent data...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="alert alert-danger" role="alert">
          <i className="ti ti-alert-circle me-2"></i>
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchGuardians}
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
                      <h6 className="mb-0">Total Parents</h6>
                      <h3 className="mb-0 text-primary">{stats.total}</h3>
                    </div>
                    <div className="avatar-sm bg-primary-light rounded-circle">
                      <i className="ti ti-users-group text-primary"></i>
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
                      <h6 className="mb-0">Active Parents</h6>
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
                      <h6 className="mb-0">Total Students</h6>
                      <h3 className="mb-0 text-info">{getTotalStudents()}</h3>
                    </div>
                    <div className="avatar-sm bg-info-light rounded-circle">
                      <i className="ti ti-graduation-cap text-info"></i>
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
                      <h6 className="mb-0">Avg Engagement</h6>
                      <h3 className="mb-0 text-warning">{getAvgEngagement()}%</h3>
                    </div>
                    <div className="avatar-sm bg-warning-light rounded-circle">
                      <i className="ti ti-chart-line text-warning"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {guardians.length === 0 && (
            <div className="text-center py-5">
              <i className="ti ti-users-group" style={{ fontSize: '48px', color: '#ccc' }}></i>
              <p className="mt-2 text-muted">No parents/guardians found</p>
            </div>
          )}

          {/* Parents Table */}
          {guardians.length > 0 && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Parents Details ({guardians.length})</h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Students</th>
                            <th>Status</th>
                            <th>Join Date</th>
                            <th>Account Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {guardians.map((guardian) => (
                            <tr key={guardian._id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-sm bg-primary rounded-circle me-2">
                                    <i className="ti ti-user text-white"></i>
                                  </div>
                                  <div>
                                    <div className="fw-medium">
                                      {guardian.firstName} {guardian.lastName}
                                    </div>
                                    <small className="text-muted">ID: {guardian.guardianId}</small>
                                  </div>
                                </div>
                              </td>
                              <td>{guardian.email}</td>
                              <td>{guardian.phone}</td>
                              <td>
                                <span className="badge bg-info">
                                  {getActiveChildrenCount(guardian.children)}
                                </span>
                              </td>
                              <td>{getStatusBadge(guardian.status)}</td>
                              <td>{formatDate(guardian.createdAt)}</td>
                              <td>
                                {guardian.userId ? (
                                  <span className={`badge ${guardian.userId.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                    {guardian.userId.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                ) : (
                                  <span className="badge bg-warning">No Account</span>
                                )}
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
                                    title="Send Message"
                                  >
                                    <i className="ti ti-message"></i>
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

export default ParentOverviewPage;
