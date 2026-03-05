import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';

interface LeaveReport {
  _id: string;
  admissionNumber: string;
  studentName: string;
  rollNumber: string;
  avatar?: string;
  classId?: string;
  section?: string;
  medicalLeave: {
    used: number;
    available: number;
  };
  casualLeave: {
    used: number;
    available: number;
  };
  emergencyLeave: {
    used: number;
    available: number;
  };
  specialLeave: {
    used: number;
    available: number;
  };
}

interface LeaveLimits {
  sick: number;
  casual: number;
  emergency: number;
  other: number;
}

const LeaveReportPage: React.FC = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leaveReports, setLeaveReports] = useState<LeaveReport[]>([]);
  const [leaveLimits, setLeaveLimits] = useState<LeaveLimits>({
    sick: 10,
    casual: 12,
    emergency: 10,
    other: 10
  });
  const [filters, setFilters] = useState({
    classId: '',
    section: '',
    academicYear: '2024-2025'
  });
  const [sortBy, setSortBy] = useState('ascending');

  // Get schoolId from localStorage
  const schoolId = localStorage.getItem('schoolId') || '507f1f77bcf86cd799439011';

  const fetchLeaveReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {};
      if (filters.classId) params.classId = filters.classId;
      if (filters.section) params.section = filters.section;
      if (filters.academicYear) params.academicYear = filters.academicYear;

      const response = await apiClient.get(`/leave-reports/schools/${schoolId}`, {
        params
      });

      if (response.data.success) {
        const reports = response.data.data || [];
        const limits = (response.data as any).limits || leaveLimits;
        
        setLeaveReports(reports);
        setLeaveLimits(limits);
        
        if (reports.length === 0) {
          toast.info('No leave reports found for the selected filters');
        }
      }
    } catch (err: any) {
      console.error('Error fetching leave reports:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load leave reports';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveReports();
  }, []);

  const handleRefresh = () => {
    fetchLeaveReports();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setShowFilter(false);
    fetchLeaveReports();
  };

  const resetFilters = () => {
    setFilters({
      classId: '',
      section: '',
      academicYear: '2024-2025'
    });
    fetchLeaveReports();
  };

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    // Sort the reports
    const sorted = [...leaveReports].sort((a, b) => {
      if (sortType === 'ascending') {
        return a.studentName.localeCompare(b.studentName);
      } else if (sortType === 'descending') {
        return b.studentName.localeCompare(a.studentName);
      }
      return 0;
    });
    setLeaveReports(sorted);
  };

  const handleExport = (type: 'pdf' | 'excel') => {
    toast.info(`Export to ${type} feature coming soon`);
  };

  return (
    <>

        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Leave Report</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Report</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">Leave Report</li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <div className="pe-1 mb-2">
              <button
                className="btn btn-outline-light bg-white btn-icon me-1"
                onClick={handleRefresh}
                disabled={loading}
                title="Refresh"
              >
                <i className="ti ti-refresh"></i>
              </button>
            </div>
            <div className="pe-1 mb-2">
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-icon me-1"
                onClick={() => window.print()}
                title="Print"
              >
                <i className="ti ti-printer"></i>
              </button>
            </div>
            <div className="dropdown me-2 mb-2">
              <button
                className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i className="ti ti-file-export me-2"></i>Export
              </button>
              <ul className="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={() => handleExport('pdf')}
                  >
                    <i className="ti ti-file-type-pdf me-1"></i>Export as PDF
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={() => handleExport('excel')}
                  >
                    <i className="ti ti-file-type-xls me-1"></i>Export as Excel
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}

        {/* Student List */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
            <h4 className="mb-3">Leave Report List</h4>
            <div className="d-flex align-items-center flex-wrap">
              <div className="input-icon-start mb-3 me-2 position-relative">
                <span className="icon-addon">
                  <i className="ti ti-calendar"></i>
                </span>
                <input type="text" className="form-control date-range bookingrange" placeholder="Select"
                  value="Academic Year : 2024 / 2025" readOnly />
              </div>
              <div className="dropdown mb-3 me-2">
                <button className="btn btn-outline-light bg-white dropdown-toggle"
                  onClick={() => setShowFilter(!showFilter)}>
                  <i className="ti ti-filter me-2"></i>Filter
                </button>
                {showFilter && (
                  <div className="dropdown-menu drop-width show" style={{ position: 'absolute', inset: '0px auto auto 0px', margin: '0px', transform: 'translate(0px, 40px)' }}>
                    <form onSubmit={handleApplyFilters}>
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label">Class</label>
                              <select className="form-select" name="classId" value={filters.classId} onChange={handleFilterChange}>
                                <option value="">Select</option>
                                <option value="I">I</option>
                                <option value="II">II</option>
                                <option value="III">III</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label">Section</label>
                              <select className="form-select" name="section" value={filters.section} onChange={handleFilterChange}>
                                <option value="">Select</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <button type="button" className="btn btn-light me-3" onClick={resetFilters}>Reset</button>
                        <button type="submit" className="btn btn-primary">Apply</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
              <div className="dropdown mb-3">
                <button className="btn btn-outline-light bg-white dropdown-toggle"
                  data-bs-toggle="dropdown">
                  <i className="ti ti-sort-ascending-2 me-2"></i>Sort by A-Z
                </button>
                <ul className="dropdown-menu p-3">
                  <li>
                    <button 
                      className={`dropdown-item rounded-1 ${sortBy === 'ascending' ? 'active' : ''}`}
                      onClick={() => handleSort('ascending')}>
                      Ascending
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`dropdown-item rounded-1 ${sortBy === 'descending' ? 'active' : ''}`}
                      onClick={() => handleSort('descending')}>
                      Descending
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`dropdown-item rounded-1 ${sortBy === 'recently-viewed' ? 'active' : ''}`}
                      onClick={() => handleSort('recently-viewed')}>
                      Recently Viewed
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`dropdown-item rounded-1 ${sortBy === 'recently-added' ? 'active' : ''}`}
                      onClick={() => handleSort('recently-added')}>
                      Recently Added
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-body p-0 py-3">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading leave reports...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="p-3">
                <div className="alert alert-danger" role="alert">
                  <i className="ti ti-alert-circle me-2"></i>
                  {error}
                  <button
                    className="btn btn-sm btn-outline-danger ms-3"
                    onClick={fetchLeaveReports}
                  >
                    <i className="ti ti-refresh me-1"></i>Retry
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && leaveReports.length === 0 && (
              <div className="text-center py-5">
                <i className="ti ti-calendar-off" style={{ fontSize: '48px', color: '#ccc' }}></i>
                <p className="mt-2 text-muted">No leave reports found</p>
                <p className="text-muted small">Leave reports will appear here once students are enrolled</p>
              </div>
            )}

            {/* Student List */}
            {!loading && !error && leaveReports.length > 0 && (
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr className="report-first-head">
                    <th></th>
                    <th></th>
                    <th colSpan={2}>Medical Leave({leaveLimits.sick})</th>
                    <th colSpan={2}>Casual Leave({leaveLimits.casual})</th>
                    <th colSpan={2}>Emergency Leave({leaveLimits.emergency})</th>
                    <th colSpan={2}>Special Leave({leaveLimits.other})</th>
                  </tr>
                  <tr>
                    <th>Admission No</th>
                    <th>Student Name</th>
                    <th>Used</th>
                    <th>Available</th>
                    <th>Used</th>
                    <th>Available</th>
                    <th>Used</th>
                    <th>Available</th>
                    <th>Used</th>
                    <th>Available</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveReports.map((report) => (
                    <tr key={report._id}>
                      <td><Link to="#" className="link-primary">{report.admissionNumber}</Link></td>
                      <td>
                        <div className="d-flex align-items-center">
                          {report.avatar ? (
                            <Link to="/student-details" className="avatar avatar-md">
                              <img src={report.avatar} className="img-fluid rounded-circle" alt={report.studentName} />
                            </Link>
                          ) : (
                            <div className="avatar avatar-md rounded-circle me-2 bg-light d-flex align-items-center justify-content-center">
                              <i className="ti ti-user fs-16 text-muted"></i>
                            </div>
                          )}
                          <div className="ms-2">
                            <p className="text-dark mb-0">
                              <Link to="/student-details">{report.studentName}</Link>
                            </p>
                            {report.rollNumber && (
                              <span className="fs-12">Roll No : {report.rollNumber}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{report.medicalLeave.used}</td>
                      <td>{report.medicalLeave.available}</td>
                      <td>{report.casualLeave.used}</td>
                      <td>{report.casualLeave.available}</td>
                      <td>{report.emergencyLeave.used}</td>
                      <td>{report.emergencyLeave.available}</td>
                      <td>{report.specialLeave.used}</td>
                      <td>{report.specialLeave.available}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
            {/* /Student List */}
          </div>
        </div>
        {/* /Student List */}
     
    </>
  );
};

export default LeaveReportPage;
