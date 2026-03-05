import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';

interface Hostel {
  _id: string;
  hostelId: string;
  name: string;
  type: string;
  address: string;
  intake: number;
  description: string;
}

const HostelListPage: React.FC = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Boys',
    address: '',
    intake: '',
    description: ''
  });

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/hostel/hostels');
      if (response.data.success) {
        setHostels(response.data.data?.hostels || []);
      } else {
        setError(response.data.message || 'Failed to load hostels');
      }
    } catch (err: any) {
      console.error('Error fetching hostels:', err);
      setError(err.response?.data?.message ?? err.message ?? 'Failed to load hostels');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/hostel/hostels', {
        name: formData.name,
        type: formData.type,
        address: formData.address,
        intake: parseInt(formData.intake),
        description: formData.description
      });
      
      if (response.data.success) {
        await fetchHostels();
        setShowAddModal(false);
        setFormData({
          name: '',
          type: 'Boys',
          address: '',
          intake: '',
          description: ''
        });
        toast.success('Hostel added successfully');
      } else {
        toast.error(response.data.message || 'Failed to add hostel');
      }
    } catch (err: any) {
      console.error('Error adding hostel:', err);
      toast.error(err.response?.data?.message || 'Failed to add hostel');
    }
  };

  const handleEditHostel = (hostel: Hostel) => {
    setSelectedHostel(hostel);
    setFormData({
      name: hostel.name,
      type: hostel.type,
      address: hostel.address,
      intake: hostel.intake.toString(),
      description: hostel.description
    });
    setShowEditModal(true);
  };

  const handleUpdateHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHostel) return;
    
    try {
      const response = await apiClient.put(`/hostel/hostels/${selectedHostel._id}`, {
        name: formData.name,
        type: formData.type,
        address: formData.address,
        intake: parseInt(formData.intake),
        description: formData.description
      });
      
      if (response.data.success) {
        await fetchHostels();
        setShowEditModal(false);
        setSelectedHostel(null);
        setFormData({
          name: '',
          type: 'Boys',
          address: '',
          intake: '',
          description: ''
        });
        toast.success('Hostel updated successfully');
      } else {
        toast.error(response.data.message || 'Failed to update hostel');
      }
    } catch (err: any) {
      console.error('Error updating hostel:', err);
      toast.error(err.response?.data?.message || 'Failed to update hostel');
    }
  };

  const handleDeleteHostel = async () => {
    if (!selectedHostel) return;
    
    try {
      const response = await apiClient.delete(`/hostel/hostels/${selectedHostel._id}`);
      
      if (response.data.success) {
        await fetchHostels();
        setShowDeleteModal(false);
        setSelectedHostel(null);
        toast.success('Hostel deleted successfully');
      } else {
        toast.error(response.data.message || 'Failed to delete hostel');
      }
    } catch (err: any) {
      console.error('Error deleting hostel:', err);
      toast.error(err.response?.data?.message || 'Failed to delete hostel');
    }
  };

  return (
    <>
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Hostel</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <a href="#!">Management</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Hostel</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div className="pe-1 mb-2">
            <button 
              className="btn btn-outline-light bg-white btn-icon me-1"
              onClick={fetchHostels}
              title="Refresh"
            >
              <i className="ti ti-refresh"></i>
            </button>
          </div>
          <div className="pe-1 mb-2">
            <button 
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
                <a href="#!" className="dropdown-item rounded-1">
                  <i className="ti ti-file-type-pdf me-1"></i>Export as PDF
                </a>
              </li>
              <li>
                <a href="#!" className="dropdown-item rounded-1">
                  <i className="ti ti-file-type-xls me-1"></i>Export as Excel
                </a>
              </li>
            </ul>
          </div>
          <div className="mb-2">
            <button 
              className="btn btn-primary d-flex align-items-center"
              onClick={() => setShowAddModal(true)}
            >
              <i className="ti ti-square-rounded-plus me-2"></i>Add Hostel
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
          <h4 className="mb-3">Hostel</h4>
          <div className="d-flex align-items-center flex-wrap">
            <div className="input-icon-start mb-3 me-2 position-relative">
              <span className="icon-addon">
                <i className="ti ti-calendar"></i>
              </span>
              <input 
                type="text" 
                className="form-control date-range bookingrange" 
                placeholder="Select"
                value="Academic Year : 2024 / 2025"
                readOnly
              />
            </div>
            
            <div className="dropdown mb-3 me-2">
              <button 
                className="btn btn-outline-light bg-white dropdown-toggle"
                data-bs-toggle="dropdown" 
                data-bs-auto-close="outside"
              >
                <i className="ti ti-filter me-2"></i>Filter
              </button>
              <div className="dropdown-menu drop-width">
                <form>
                  <div className="d-flex align-items-center border-bottom p-3">
                    <h4>Filter</h4>
                  </div>
                  <div className="p-3 border-bottom">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Type</label>
                          <select className="form-select">
                            <option>Select</option>
                            <option>Boys</option>
                            <option>Girls</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 d-flex align-items-center justify-content-end">
                    <button type="button" className="btn btn-light me-3">Reset</button>
                    <button type="submit" className="btn btn-primary">Apply</button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="dropdown mb-3">
              <button 
                className="btn btn-outline-light bg-white dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                <i className="ti ti-sort-ascending-2 me-2"></i>Sort by A-Z
              </button>
              <ul className="dropdown-menu p-3">
                <li>
                  <a href="#!" className="dropdown-item rounded-1 active">
                    Ascending
                  </a>
                </li>
                <li>
                  <a href="#!" className="dropdown-item rounded-1">
                    Descending
                  </a>
                </li>
                <li>
                  <a href="#!" className="dropdown-item rounded-1">
                    Recently Viewed
                  </a>
                </li>
                <li>
                  <a href="#!" className="dropdown-item rounded-1">
                    Recently Added
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="alert alert-danger m-3">
            {error}
          </div>
        )}

        <div className="card-body p-0 py-3">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : hostels.length === 0 ? (
            <div className="p-5 text-center text-muted">No hostels found.</div>
          ) : (
            <div className="custom-datatable-filter table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th className="no-sort">
                      <div className="form-check form-check-md">
                        <input className="form-check-input" type="checkbox" id="select-all" />
                      </div>
                    </th>
                    <th>ID</th>
                    <th>Hostel Name</th>
                    <th>Hostel Type</th>
                    <th>Address</th>
                    <th>Intake</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {hostels.map((hostel) => (
                    <tr key={hostel._id}>
                      <td>
                        <div className="form-check form-check-md">
                          <input className="form-check-input" type="checkbox" />
                        </div>
                      </td>
                      <td><a href="#!" className="link-primary">{hostel.hostelId}</a></td>
                      <td>{hostel.name}</td>
                      <td>{hostel.type}</td>
                      <td>{hostel.address}</td>
                      <td>{hostel.intake}</td>
                      <td>{hostel.description}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="dropdown">
                            <button
                              className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle p-0"
                              data-bs-toggle="dropdown" 
                              aria-expanded="false"
                            >
                              <i className="ti ti-dots-vertical fs-14"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end p-3">
                              <li>
                                <button 
                                  className="dropdown-item rounded-1"
                                  onClick={() => handleEditHostel(hostel)}
                                >
                                  <i className="ti ti-edit-circle me-2"></i>Edit
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item rounded-1 text-danger"
                                  onClick={() => {
                                    setSelectedHostel(hostel);
                                    setShowDeleteModal(true);
                                  }}
                                >
                                  <i className="ti ti-trash-x me-2"></i>Delete
                                </button>
                              </li>
                            </ul>
                          </div>
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

      {/* Add Hostel Modal */}
      {showAddModal && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex={-1}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Hostel</h4>
                <button 
                  type="button" 
                  className="btn-close custom-btn-close" 
                  onClick={() => setShowAddModal(false)}
                  aria-label="Close"
                >
                  <i className="ti ti-x"></i>
                </button>
              </div>
              <form onSubmit={handleAddHostel}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Hostel Name</label>
                        <input 
                          type="text" 
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Hostel Type</label>
                        <select 
                          className="form-select"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="Boys">Boys</option>
                          <option value="Girls">Girls</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Intake</label>
                        <input 
                          type="number" 
                          className="form-control"
                          name="intake"
                          value={formData.intake}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input 
                          type="text" 
                          className="form-control"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-0">
                        <label className="form-label">Description</label>
                        <textarea 
                          className="form-control" 
                          rows={4}
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-light me-2" 
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">Add Hostel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Hostel Modal */}
      {showEditModal && selectedHostel && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex={-1}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit Hostel</h4>
                <button 
                  type="button" 
                  className="btn-close custom-btn-close" 
                  onClick={() => setShowEditModal(false)}
                  aria-label="Close"
                >
                  <i className="ti ti-x"></i>
                </button>
              </div>
              <form onSubmit={handleUpdateHostel}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Hostel Name</label>
                        <input 
                          type="text" 
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Hostel Type</label>
                        <select 
                          className="form-select"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="Boys">Boys</option>
                          <option value="Girls">Girls</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Intake</label>
                        <input 
                          type="number" 
                          className="form-control"
                          name="intake"
                          value={formData.intake}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input 
                          type="text" 
                          className="form-control"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-0">
                        <label className="form-label">Description</label>
                        <textarea 
                          className="form-control" 
                          rows={4}
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-light me-2" 
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex={-1}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <form>
                <div className="modal-body text-center">
                  <span className="delete-icon">
                    <i className="ti ti-trash-x"></i>
                  </span>
                  <h4>Confirm Deletion</h4>
                  <p>Are you sure you want to delete this hostel? This action cannot be undone.</p>
                  <div className="d-flex justify-content-center">
                    <button 
                      type="button" 
                      className="btn btn-light me-3" 
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-danger"
                      onClick={handleDeleteHostel}
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HostelListPage;
