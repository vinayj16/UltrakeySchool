import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import institutionService, { type Institution } from '../../services/institutionService';
import commissionService, { type CommissionSummary } from '../../services/commissionService';

interface DashboardStats {
  totalInstitutions: number;
  activeInstitutions: number;
  pendingInstitutions: number;
  totalRevenue: number;
}

const AgentDashboard = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalInstitutions: 0,
    activeInstitutions: 0,
    pendingInstitutions: 0,
    totalRevenue: 0
  });
  const [commissionSummary, setCommissionSummary] = useState<CommissionSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const agentId = localStorage.getItem('userId') || '';
  const userName = localStorage.getItem('userName') || 'Agent User';
  const userEmail = localStorage.getItem('userEmail') || 'agent@system.com';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch institutions and commission summary in parallel
      const [institutionsData, commissionData] = await Promise.all([
        institutionService.getInstitutions({ limit: 100 }),
        commissionService.getSummary(agentId).catch(() => null) // Handle case where no commissions exist yet
      ]);

      setInstitutions(institutionsData.institutions);
      setCommissionSummary(commissionData);

      // Calculate stats
      const totalInstitutions = institutionsData.institutions.length;
      const activeInstitutions = institutionsData.institutions.filter(
        i => i.status === 'active'
      ).length;
      const pendingInstitutions = institutionsData.institutions.filter(
        i => i.status === 'pending'
      ).length;
      
      // Calculate total revenue from commission summary or institutions
      const totalRevenue = commissionData?.totalCommission || 0;

      setStats({
        totalInstitutions,
        activeInstitutions,
        pendingInstitutions,
        totalRevenue
      });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-success';
      case 'inactive': return 'bg-secondary';
      case 'pending': return 'bg-warning';
      case 'suspended': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold">Agent Dashboard</h4>
          <p className="text-muted mb-0">Manage your institutions and track performance</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/agent/institutions/add" className="btn btn-primary">
            <i className="ti ti-plus me-2" />Add Institution
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 bg-primary text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="card-title mb-0">My Institutions</h5>
                  <h3 className="mb-0">{stats.totalInstitutions}</h3>
                  <small className="text-white-50">Total institutions</small>
                </div>
                <div className="avatar avatar-md bg-white bg-opacity-20 rounded-circle">
                  <i className="ti ti-building fs-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-success text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="card-title mb-0">Active</h5>
                  <h3 className="mb-0">{stats.activeInstitutions}</h3>
                  <small className="text-white-50">Active institutions</small>
                </div>
                <div className="avatar avatar-md bg-white bg-opacity-20 rounded-circle">
                  <i className="ti ti-check fs-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-warning text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="card-title mb-0">Pending</h5>
                  <h3 className="mb-0">{stats.pendingInstitutions}</h3>
                  <small className="text-white-50">Pending approval</small>
                </div>
                <div className="avatar avatar-md bg-white bg-opacity-20 rounded-circle">
                  <i className="ti ti-clock fs-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-info text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="card-title mb-0">Total Commission</h5>
                  <h3 className="mb-0">${stats.totalRevenue.toLocaleString()}</h3>
                  <small className="text-white-50">All time earnings</small>
                </div>
                <div className="avatar avatar-md bg-white bg-opacity-20 rounded-circle">
                  <i className="ti ti-currency-dollar fs-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Institutions */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">
                <i className="ti ti-building me-2" />My Institutions
              </h5>
              <Link to="/agent/institutions" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Institution Name</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Plan</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {institutions.slice(0, 5).map((institution) => (
                      <tr key={institution._id}>
                        <td className="fw-semibold">{institution.name}</td>
                        <td>{institution.type}</td>
                        <td>{institution.contact?.address?.city || '-'}, {institution.contact?.address?.state || '-'}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(institution.status)} text-white`}>
                            {getStatusText(institution.status)}
                          </span>
                        </td>
                        <td>{institution.subscription?.planName || 'N/A'}</td>
                        <td>
                          <div className="dropdown">
                            <button 
                              className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                              type="button" 
                              data-bs-toggle="dropdown"
                            >
                              <i className="ti ti-dots-vertical" />
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <Link 
                                  to={`/agent/institutions/${institution._id}`}
                                  className="dropdown-item"
                                >
                                  <i className="ti ti-eye me-2" />View Details
                                </Link>
                              </li>
                              <li>
                                <Link 
                                  to={`/agent/institutions/${institution._id}/edit`}
                                  className="dropdown-item"
                                >
                                  <i className="ti ti-edit me-2" />Edit
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {institutions.length === 0 && (
                <div className="text-center py-5">
                  <i className="ti ti-building-off fs-48 text-muted mb-3 d-block" />
                  <h5 className="text-muted">No institutions yet</h5>
                  <p className="text-muted">Start adding institutions to see them here</p>
                  <Link to="/agent/institutions/add" className="btn btn-primary mt-2">
                    <i className="ti ti-plus me-2" />Add Your First Institution
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="ti ti-bolt me-2" />Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <Link 
                    to="/agent/institutions/add" 
                    className="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
                  >
                    <i className="ti ti-plus fs-24 mb-2" />
                    <span>Add Institution</span>
                  </Link>
                </div>
                <div className="col-md-4 mb-3">
                  <Link 
                    to="/agent/performance" 
                    className="btn btn-outline-success w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
                  >
                    <i className="ti ti-chart-line fs-24 mb-2" />
                    <span>View Performance</span>
                  </Link>
                </div>
                <div className="col-md-4 mb-3">
                  <Link 
                    to="/agent/commissions" 
                    className="btn btn-outline-info w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4"
                  >
                    <i className="ti ti-receipt fs-24 mb-2" />
                    <span>My Commissions</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="ti ti-user me-2" />Profile
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="avatar avatar-lg bg-primary text-white rounded-circle me-3">
                  <i className="ti ti-user fs-20" />
                </div>
                <div>
                  <h6 className="mb-0">{userName}</h6>
                  <p className="text-muted mb-0">{userEmail}</p>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <div>
                  <small className="text-muted">Institutions</small>
                  <p className="mb-0 fw-semibold">{stats.totalInstitutions}</p>
                </div>
                <div>
                  <small className="text-muted">Commission Rate</small>
                  <p className="mb-0 fw-semibold">{commissionSummary?.commissionRate || 10}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
