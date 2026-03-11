import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';

interface HostelReport {
  id: string;
  reportType: string;
  title: string;
  description: string;
  generatedDate: string;
  period: string;
  totalRecords: number;
  status: 'completed' | 'processing' | 'scheduled';
}

interface HostelStatistics {
  totalHostels: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  totalStudents: number;
  occupancyRate: number;
}

const HostelReportPage: React.FC = () => {
  const [reports, setReports] = useState<HostelReport[]>([]);
  const [hostelStats, setHostelStats] = useState<HostelStatistics>({
    totalHostels: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    totalStudents: 0,
    occupancyRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<HostelReport | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'occupancy' | 'maintenance' | 'student' | 'revenue' | 'inventory'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReports();
    fetchStatistics();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/hostel/reports');
      
      if (response.data.success) {
        setReports(response.data.data?.reports || []);
      } else {
        setError(response.data.message || 'Failed to load reports');
      }
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await apiClient.get('/hostel/reports/statistics');
      
      if (response.data.success) {
        const stats = response.data.data?.statistics || {};
        setHostelStats({
          totalHostels: stats.totalHostels || 0,
          totalRooms: stats.totalRooms || 0,
          occupiedRooms: stats.occupiedRooms || 0,
          availableRooms: stats.availableRooms || 0,
          totalStudents: stats.totalStudents || 0,
          occupancyRate: stats.occupancyRate || 0
        });
      }
    } catch (err: any) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      const response = await apiClient.delete(`/hostel/reports/${reportId}`);
      
      if (response.data.success) {
        setReports(prev => prev.filter(r => r.id !== reportId));
        toast.success('Report deleted successfully');
      } else {
        toast.error(response.data.message || 'Failed to delete report');
      }
    } catch (err: any) {
      console.error('Error deleting report:', err);
      toast.error(err.response?.data?.message || 'Failed to delete report');
    }
  };

  const handleDownloadPDF = async (reportId: string) => {
    try {
      toast.info(`Downloading report ${reportId}...`);
      // Note: Actual implementation would need proper blob handling from backend
      toast.success('Report download initiated');
    } catch (err: any) {
      console.error('Error downloading report:', err);
      toast.error('Failed to download report');
    }
  };

  const handleExportExcel = async (reportId: string) => {
    try {
      toast.info(`Exporting report ${reportId}...`);
      // Note: Actual implementation would need proper blob handling from backend
      toast.success('Report export initiated');
    } catch (err: any) {
      console.error('Error exporting report:', err);
      toast.error('Failed to export report');
    }
  };

  const handleGenerateReport = () => {
    toast.info('Report generation feature - to be implemented');
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || report.reportType.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'processing':
        return 'bg-warning';
      case 'scheduled':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  const getReportTypeBadge = (type: string) => {
    switch (type) {
      case 'occupancy':
        return 'bg-primary';
      case 'maintenance':
        return 'bg-info';
      case 'student':
        return 'bg-success';
      case 'revenue':
        return 'bg-warning';
      case 'inventory':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <>
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Hostel Reports</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">Reports</li>
              <li className="breadcrumb-item active" aria-current="page">
                Hostel Report
              </li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <button 
            className="btn btn-primary d-flex align-items-center mb-2"
            onClick={handleGenerateReport}
          >
            <i className="ti ti-file-plus me-2" />
            Generate Report
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mb-3">
          <i className="ti ti-alert-circle me-2" />
          {error}
          <button 
            type="button" 
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchReports}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
      <div className="row">
        <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="mb-1">Total Hostels</p>
                  <h4 className="mb-0">{hostelStats.totalHostels}</h4>
                </div>
                <div className="avatar avatar-md bg-primary-transparent">
                  <i className="ti ti-building text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="mb-1">Total Rooms</p>
                  <h4 className="mb-0">{hostelStats.totalRooms}</h4>
                </div>
                <div className="avatar avatar-md bg-info-transparent">
                  <i className="ti ti-door text-info" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="mb-1">Occupied Rooms</p>
                  <h4 className="mb-0">{hostelStats.occupiedRooms}</h4>
                </div>
                <div className="avatar avatar-md bg-success-transparent">
                  <i className="ti ti-user-check text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="mb-1">Total Students</p>
                  <h4 className="mb-0">{hostelStats.totalStudents}</h4>
                </div>
                <div className="avatar avatar-md bg-warning-transparent">
                  <i className="ti ti-users text-warning" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="row">
        <div className="col-xl-6 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="mb-1">Available Rooms</p>
                  <h4 className="mb-0 text-info">{hostelStats.availableRooms}</h4>
                </div>
                <div className="avatar avatar-md bg-info-transparent">
                  <i className="ti ti-door-enter text-info" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="mb-1">Occupancy Rate</p>
                  <h4 className="mb-0 text-success">{hostelStats.occupancyRate}%</h4>
                </div>
                <div className="avatar avatar-md bg-success-transparent">
                  <i className="ti ti-chart-pie text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap">
          <h4 className="card-title">Generated Reports</h4>
          <div className="d-flex align-items-center flex-wrap">
            <div className="input-icon-start me-2">
              <span className="icon-addon">
                <i className="ti ti-search" />
              </span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="form-select" 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <option value="all">All Reports</option>
              <option value="occupancy">Occupancy Reports</option>
              <option value="maintenance">Maintenance Reports</option>
              <option value="student">Student Reports</option>
              <option value="revenue">Revenue Reports</option>
              <option value="inventory">Inventory Reports</option>
            </select>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" />
                    </div>
                  </th>
                  <th>Report Type</th>
                  <th>Title</th>
                  <th>Period</th>
                  <th>Generated Date</th>
                  <th>Records</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" />
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getReportTypeBadge(report.reportType)}`}>
                        {report.reportType}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p className="mb-0 fw-medium">{report.title}</p>
                        <small className="text-muted text-truncate" style={{ maxWidth: '200px' }}>
                          {report.description}
                        </small>
                      </div>
                    </td>
                    <td>{report.period}</td>
                    <td>{report.generatedDate}</td>
                    <td>{report.totalRecords.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button className="btn btn-white btn-icon btn-sm" data-bs-toggle="dropdown">
                          <i className="ti ti-dots-vertical" />
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button 
                              className="dropdown-item" 
                              onClick={() => {
                                setSelectedReport(report);
                                setShowViewModal(true);
                              }}
                            >
                              <i className="ti ti-eye me-2" />
                              View Details
                            </button>
                          </li>
                          <li>
                            <button 
                              className="dropdown-item"
                              onClick={() => handleDownloadPDF(report.id)}
                            >
                              <i className="ti ti-download me-2" />
                              Download PDF
                            </button>
                          </li>
                          <li>
                            <button 
                              className="dropdown-item"
                              onClick={() => handleExportExcel(report.id)}
                            >
                              <i className="ti ti-file-export me-2" />
                              Export Excel
                            </button>
                          </li>
                          <li>
                            <button 
                              className="dropdown-item"
                              onClick={() => window.print()}
                            >
                              <i className="ti ti-printer me-2" />
                              Print
                            </button>
                          </li>
                          <li>
                            <button 
                              className="dropdown-item text-danger" 
                              onClick={() => handleDeleteReport(report.id)}
                            >
                              <i className="ti ti-trash me-2" />
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
        </>
      )}

      {/* View Report Modal */}
      {showViewModal && selectedReport && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Hostel Report Details</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowViewModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Report Type</label>
                      <span className={`badge ${getReportTypeBadge(selectedReport.reportType)} fs-6`}>
                        {selectedReport.reportType}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <span className={`badge ${getStatusBadge(selectedReport.status)} fs-6`}>
                        {selectedReport.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <p className="form-control-plaintext">{selectedReport.title}</p>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Period</label>
                      <p className="form-control-plaintext">{selectedReport.period}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Generated Date</label>
                      <p className="form-control-plaintext">{selectedReport.generatedDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <p className="form-control-plaintext">{selectedReport.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Total Records</label>
                      <p className="form-control-plaintext">{selectedReport.totalRecords.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="ti ti-download me-2" />
                  Download Report
                </button>
                <button type="button" className="btn btn-info">
                  <i className="ti ti-printer me-2" />
                  Print Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HostelReportPage;
