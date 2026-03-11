import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  class?: string;
  section?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const UsersPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  // Filter and pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, statusFilter, sortBy]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page,
        limit: 20,
      };
      
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await apiClient.get('/user-management/users', { params });

      if (response.data.success) {
        const responseData: any = response.data;
        setUsers(responseData.data || []);
        setTotalUsers(responseData.pagination?.total || 0);
        setTotalPages(responseData.pagination?.pages || 1);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to load users');
      toast.error(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setDeleting(userId);
      const response = await apiClient.delete(`/user-management/users/${userId}`);

      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      }
    } catch (err: any) {
      console.error('Error deleting user:', err);
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(user => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleFilterApply = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setShowFilter(false);
    fetchUsers();
  };

  const handleFilterReset = () => {
    setRoleFilter('');
    setStatusFilter('');
    setPage(1);
    fetchUsers();
  };

  const exportToPDF = () => {
    toast.info('PDF export feature coming soon');
  };

  const exportToExcel = () => {
    toast.info('Excel export feature coming soon');
  };

  const activeUsers = users.filter(u => u.status === 'Active').length;
  const inactiveUsers = users.filter(u => u.status === 'Inactive').length;

  if (error && !loading) {
    return (
      <div className="text-center py-5">
        <div className="mb-3">
          <i className="ti ti-alert-circle" style={{ fontSize: '48px', color: '#dc3545' }}></i>
        </div>
        <h5>Error Loading Users</h5>
        <p className="text-muted">{error}</p>
        <button className="btn btn-primary" onClick={fetchUsers}>
          <i className="ti ti-refresh me-2"></i>Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Users</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/users">User Management</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Users</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div className="pe-1 mb-2">
            <button 
              className="btn btn-outline-light bg-white btn-icon me-1" 
              onClick={fetchUsers}
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
                <button className="dropdown-item rounded-1" onClick={exportToPDF}>
                  <i className="ti ti-file-type-pdf me-1"></i>Export as PDF
                </button>
              </li>
              <li>
                <button className="dropdown-item rounded-1" onClick={exportToExcel}>
                  <i className="ti ti-file-type-xls me-1"></i>Export as Excel
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="mb-0">Total Users</h6>
                  <h3 className="mb-0 text-primary">{totalUsers}</h3>
                </div>
                <div className="avatar avatar-lg bg-primary-transparent rounded">
                  <i className="ti ti-users text-primary fs-24"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="mb-0">Active Users</h6>
                  <h3 className="mb-0 text-success">{activeUsers}</h3>
                </div>
                <div className="avatar avatar-lg bg-success-transparent rounded">
                  <i className="ti ti-user-check text-success fs-24"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="mb-0">Inactive Users</h6>
                  <h3 className="mb-0 text-warning">{inactiveUsers}</h3>
                </div>
                <div className="avatar avatar-lg bg-warning-transparent rounded">
                  <i className="ti ti-user-off text-warning fs-24"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="mb-0">Current Page</h6>
                  <h3 className="mb-0 text-info">{page} / {totalPages}</h3>
                </div>
                <div className="avatar avatar-lg bg-info-transparent rounded">
                  <i className="ti ti-file-text text-info fs-24"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
          <h4 className="mb-3">Users List</h4>
          <div className="d-flex align-items-center flex-wrap">
            <div className="input-icon-start mb-3 me-2 position-relative">
              <form onSubmit={handleSearch}>
                <span className="icon-addon">
                  <i className="ti ti-search"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>
            </div>
            <div className="dropdown mb-3 me-2">
              <button 
                className="btn btn-outline-light bg-white dropdown-toggle"
                onClick={() => setShowFilter(!showFilter)}
              >
                <i className="ti ti-filter me-2"></i>Filter
              </button>
              {showFilter && (
                <div className="dropdown-menu drop-width show" style={{ position: 'absolute', inset: '0px auto auto 0px', margin: '0px', transform: 'translate(0px, 44px)' }}>
                  <form onSubmit={handleFilterApply}>
                    <div className="d-flex align-items-center border-bottom p-3">
                      <h4>Filter</h4>
                    </div>
                    <div className="p-3 border-bottom">
                      <div className="row">
                        <div className="col-md-12 mb-3">
                          <label className="form-label">Role</label>
                          <select 
                            className="form-select"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                          >
                            <option value="">All Roles</option>
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="parent">Parent</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">Status</label>
                          <select 
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                          >
                            <option value="">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 d-flex align-items-center justify-content-end">
                      <button type="button" className="btn btn-light me-3" onClick={handleFilterReset}>Reset</button>
                      <button type="submit" className="btn btn-primary">Apply</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            <div className="dropdown mb-3">
              <button 
                className="btn btn-outline-light bg-white dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <i className="ti ti-sort-ascending-2 me-2"></i>Sort by {sortBy === 'name-asc' ? 'A-Z' : sortBy === 'name-desc' ? 'Z-A' : 'Recent'}
              </button>
              <ul className="dropdown-menu p-3">
                <li>
                  <button 
                    className={`dropdown-item rounded-1 ${sortBy === 'name-asc' ? 'active' : ''}`}
                    onClick={() => setSortBy('name-asc')}
                  >
                    Ascending (A-Z)
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item rounded-1 ${sortBy === 'name-desc' ? 'active' : ''}`}
                    onClick={() => setSortBy('name-desc')}
                  >
                    Descending (Z-A)
                  </button>
                </li>
                <li>
                  <button 
                    className={`dropdown-item rounded-1 ${sortBy === 'recent' ? 'active' : ''}`}
                    onClick={() => setSortBy('recent')}
                  >
                    Recently Added
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="card-body p-0 py-3">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="ti ti-users" style={{ fontSize: '48px', color: '#6c757d' }}></i>
              </div>
              <h5>No Users Found</h5>
              <p className="text-muted">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th className="no-sort">
                      <div className="form-check form-check-md">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="select-all"
                          checked={selectedUsers.length === users.length && users.length > 0}
                          onChange={toggleSelectAll}
                        />
                      </div>
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Date Joined</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="form-check form-check-md">
                          <input 
                            className="form-check-input" 
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => toggleSelectUser(user._id)}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Link to={`/user/${user._id}`} className="avatar avatar-md">
                            <img 
                              src={user.avatar || '/assets/img/students/student-01.jpg'} 
                              className="img-fluid rounded-circle" 
                              alt={user.name} 
                            />
                          </Link>
                          <div className="ms-2">
                            <p className="text-dark mb-0">
                              <Link to={`/user/${user._id}`}>{user.name}</Link>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className="badge bg-info-transparent text-info">
                          {user.role}
                        </span>
                      </td>
                      <td>{user.class || '-'}</td>
                      <td>{user.section || '-'}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge badge-soft-${user.status === 'Active' ? 'success' : 'danger'} d-inline-flex align-items-center`}>
                          <i className="ti ti-circle-filled fs-5 me-1"></i>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Link 
                            to={`/user/${user._id}`}
                            className="btn btn-sm btn-icon btn-light me-2"
                            title="View Details"
                          >
                            <i className="ti ti-eye"></i>
                          </Link>
                          <button
                            className="btn btn-sm btn-icon btn-danger"
                            onClick={() => handleDelete(user._id)}
                            disabled={deleting === user._id}
                            title="Delete User"
                          >
                            {deleting === user._id ? (
                              <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                              <i className="ti ti-trash"></i>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <div className="row align-items-center mt-4">
          <div className="col-md-6">
            <div className="datatable-info">
              Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, totalUsers)} of {totalUsers} entries
            </div>
          </div>
          <div className="col-md-6">
            <div className="datatable-paginate d-flex justify-content-end">
              <button 
                className="btn btn-sm btn-outline-light me-2"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <i className="ti ti-chevron-left"></i> Previous
              </button>
              <span className="align-self-center mx-2">
                Page {page} of {totalPages}
              </span>
              <button 
                className="btn btn-sm btn-outline-light ms-2"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next <i className="ti ti-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersPage;
