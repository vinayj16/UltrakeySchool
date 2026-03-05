import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { homeworkService } from '../../services/homeworkService';
import type { Homework, CreateHomeworkInput } from '../../services/homeworkService';
import { useAuth } from '../../store/authStore';

const ClassHomeWorkPage: React.FC = () => {
  const { user } = useAuth();
  
  // State management
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [filters, setFilters] = useState({
    subject: '',
    classId: '',
    section: '',
    date: ''
  });

  // State for sorting
  const [sortBy, setSortBy] = useState<'asc' | 'desc' | 'recent' | 'recentlyAdded'>('asc');

  // State for new homework form
  const [newHomework, setNewHomework] = useState<CreateHomeworkInput>({
    title: '',
    description: '',
    subject: '',
    classId: '',
    dueDate: '',
    assignedDate: new Date().toISOString().split('T')[0],
    totalMarks: 0,
    attachments: []
  });

  // Fetch homework from backend
  useEffect(() => {
    fetchHomework();
  }, []);

  const fetchHomework = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await homeworkService.getAll({
        page: 1,
        limit: 100,
        sortBy: 'assignedDate',
        sortOrder: 'desc'
      });
      setHomeworks(response.homework || []);
    } catch (err: any) {
      console.error('Error fetching homework:', err);
      setError(err.message || 'Failed to fetch homework');
      setHomeworks([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setNewHomework(prev => ({
      ...prev,
      [name]: name === 'totalMarks' ? Number(value) : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await homeworkService.create(newHomework);
      toast.success('Homework added successfully');
      
      // Reset form
      setNewHomework({
        title: '',
        description: '',
        subject: '',
        classId: '',
        dueDate: '',
        assignedDate: new Date().toISOString().split('T')[0],
        totalMarks: 0,
        attachments: []
      });
      
      // Refresh the list
      await fetchHomework();
    } catch (err: any) {
      console.error('Error adding homework:', err);
      toast.error(err.message || 'Failed to add homework');
      setError(err.message || 'Failed to add homework');
    }
  };

  // Handle delete homework
  const handleDelete = async (id: string) => {
    try {
      await homeworkService.delete(id);
      toast.success('Homework deleted successfully');
      await fetchHomework();
    } catch (err: any) {
      console.error('Error deleting homework:', err);
      toast.error(err.message || 'Failed to delete homework');
    }
  };

  // Sample data for dropdowns
  const classes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const sections = ['A', 'B', 'C', 'D', 'E'];
  const subjects = ['English', 'Maths', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography'];

  return (
    <>
      
        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Class Work</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a href="/">Dashboard</a>
                </li>
                <li className="breadcrumb-item">
                  <span>Academic</span>
                </li>
                <li className="breadcrumb-item active" aria-current="page">Class Work</li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <div className="pe-1 mb-2">
              <button className="btn btn-outline-light bg-white btn-icon me-1" onClick={() => window.location.reload()}>
                <i className="ti ti-refresh"></i>
              </button>
            </div>
            <div className="pe-1 mb-2">
              <button className="btn btn-outline-light bg-white btn-icon me-1" onClick={() => window.print()}>
                <i className="ti ti-printer"></i>
              </button>
            </div>
            <div className="dropdown me-2 mb-2">
              <button className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center">
                <i className="ti ti-file-export me-2"></i>Export
              </button>
              <ul className="dropdown-menu dropdown-menu-end p-3">
                <li>
                  <button className="dropdown-item rounded-1">
                    <i className="ti ti-file-type-pdf me-1"></i>Export as PDF
                  </button>
                </li>
                <li>
                  <button className="dropdown-item rounded-1">
                    <i className="ti ti-file-type-xls me-1"></i>Export as Excel
                  </button>
                </li>
              </ul>
            </div>
            <div className="mb-2">
              <button 
                className="btn btn-primary" 
                data-bs-toggle="modal"
                data-bs-target="#add_home_work"
              >
                <i className="ti ti-square-rounded-plus-filled me-2"></i>Add Home Work
              </button>
            </div>
          </div>
        </div>
        {/* /Page Header */}

        {/* Homeworks List */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
            <h4 className="mb-3">Class Home Work</h4>
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
                >
                  <i className="ti ti-filter me-2"></i>Filter
                </button>
                <div className="dropdown-menu drop-width">
                  <form>
                    <div className="d-flex align-items-center border-bottom p-3">
                      <h4>Filter</h4>
                    </div>
                    <div className="p-3 border-bottom pb-0">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Subject</label>
                            <select 
                              className="form-select"
                              value={filters.subject}
                              onChange={(e) => setFilters({...filters, subject: e.target.value})}
                            >
                              <option value="">Select</option>
                              {subjects.map((subject) => (
                                <option key={subject} value={subject}>{subject}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Class</label>
                            <select 
                              className="form-select"
                              value={filters.classId}
                              onChange={(e) => setFilters({...filters, classId: e.target.value})}
                            >
                              <option value="">Select</option>
                              {classes.map((cls) => (
                                <option key={cls} value={cls}>{cls}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Section</label>
                            <select 
                              className="form-select"
                              value={filters.section}
                              onChange={(e) => setFilters({...filters, section: e.target.value})}
                            >
                              <option value="">Select</option>
                              {sections.map((section) => (
                                <option key={section} value={section}>{section}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 d-flex align-items-center justify-content-end">
                      <button 
                        type="button" 
                        className="btn btn-light me-3"
                        onClick={() => setFilters({
                          subject: '',
                          classId: '',
                          section: '',
                          date: ''
                        })}
                      >
                        Reset
                      </button>
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
                    <button 
                      className={`dropdown-item rounded-1 ${sortBy === 'asc' ? 'active' : ''}`}
                      onClick={() => setSortBy('asc')}
                    >
                      Ascending
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`dropdown-item rounded-1 ${sortBy === 'desc' ? 'active' : ''}`}
                      onClick={() => setSortBy('desc')}
                    >
                      Descending
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`dropdown-item rounded-1 ${sortBy === 'recent' ? 'active' : ''}`}
                      onClick={() => setSortBy('recent')}
                    >
                      Recently Viewed
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`dropdown-item rounded-1 ${sortBy === 'recentlyAdded' ? 'active' : ''}`}
                      onClick={() => setSortBy('recentlyAdded')}
                    >
                      Recently Added
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-body p-0 py-3">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading homework...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger m-3" role="alert">
                <i className="ti ti-alert-circle me-2"></i>
                {error}
              </div>
            ) : homeworks.length === 0 ? (
              <div className="text-center py-5">
                <i className="ti ti-clipboard-off" style={{ fontSize: '48px', color: '#ccc' }}></i>
                <p className="mt-2 text-muted">No homework found. Add your first homework to get started.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table datatable">
                  <thead className="thead-light">
                    <tr>
                      <th className="no-sort">
                        <div className="form-check form-check-md">
                          <input className="form-check-input" type="checkbox" id="select-all" />
                        </div>
                      </th>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Class</th>
                      <th>Subject</th>
                      <th>Assigned Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {homeworks.map((homework) => (
                      <tr key={homework.id}>
                        <td>
                          <div className="form-check form-check-md">
                            <input className="form-check-input" type="checkbox" />
                          </div>
                        </td>
                        <td><a href="#" className="link-primary">{homework.id.slice(0, 8)}</a></td>
                        <td>{homework.title}</td>
                        <td>{homework.className || homework.classId}</td>
                        <td>{homework.subjectName || homework.subject}</td>
                        <td>{new Date(homework.assignedDate).toLocaleDateString()}</td>
                        <td>{new Date(homework.dueDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${
                            homework.status === 'assigned' ? 'bg-info' :
                            homework.status === 'submitted' ? 'bg-warning' :
                            homework.status === 'graded' ? 'bg-success' :
                            'bg-danger'
                          }`}>
                            {homework.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex">
                            <button 
                              className="btn btn-sm btn-icon btn-light me-1"
                              data-bs-toggle="modal"
                              data-bs-target="#edit_home_work"
                            >
                              <i className="ti ti-edit"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-icon btn-light text-danger"
                              onClick={() => handleDelete(homework.id)}
                            >
                              <i className="ti ti-trash"></i>
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
        {/* /Homeworks List */}
     

      {/* Add Homework Modal */}
      <div className="modal fade" id="add_home_work" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Home Work</h4>
              <button 
                type="button" 
                className="btn-close" 
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input 
                        type="text" 
                        className="form-control"
                        name="title"
                        value={newHomework.title}
                        onChange={handleInputChange}
                        placeholder="Enter homework title"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Class ID</label>
                      <input 
                        type="text" 
                        className="form-control"
                        name="classId"
                        value={newHomework.classId}
                        onChange={handleInputChange}
                        placeholder="Enter class ID"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Subject</label>
                      <select 
                        className="form-select"
                        name="subject"
                        value={newHomework.subject}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Subject</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Assigned Date</label>
                          <input 
                            type="date" 
                            className="form-control" 
                            name="assignedDate"
                            value={newHomework.assignedDate}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Due Date</label>
                          <input 
                            type="date" 
                            className="form-control" 
                            name="dueDate"
                            value={newHomework.dueDate}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Total Marks (Optional)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="totalMarks"
                        value={newHomework.totalMarks || ''}
                        onChange={handleInputChange}
                        placeholder="Enter total marks"
                        min="0"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea 
                        className="form-control" 
                        rows={4}
                        name="description"
                        value={newHomework.description}
                        onChange={handleInputChange}
                        placeholder="Enter homework description"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-light me-2" 
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Add Homework</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Homework Modal */}

      {/* Edit Homework Modal */}
      <div className="modal fade" id="edit_home_work" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Home Work</h4>
              <button 
                type="button" 
                className="btn-close" 
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter homework title" 
                        value={newHomework.title || 'Sample Homework'}
                        readOnly
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Class ID</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter Class ID" 
                        value={newHomework.classId || 'class-123'}
                        readOnly
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Subject</label>
                      <select 
                        className="form-select"
                        value={newHomework.subject || 'English'}
                        disabled
                      >
                        <option value="English">English</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                      </select>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Assigned Date</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="10 May 2024" 
                            value={newHomework.assignedDate || '2024-05-10'}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Due Date</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="12 May 2024" 
                            value={newHomework.dueDate || '2024-05-12'}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Total Marks</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Enter total marks"
                        value={newHomework.totalMarks || 100}
                        readOnly
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea 
                        className="form-control" 
                        placeholder="Add Comment" 
                        rows={4}
                        value={newHomework.description || 'This is a sample homework description.'}
                        readOnly
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-light me-2" 
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Edit Homework Modal */}

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="delete_modal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <div className="delete-icon">
                <i className="ti ti-trash-x"></i>
              </div>
              <h4>Confirm Deletion</h4>
              <p>Are you sure you want to delete this homework? This action cannot be undone.</p>
              <div className="d-flex justify-content-center">
                <button 
                  type="button" 
                  className="btn btn-light me-3" 
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Confirmation Modal */}
    </>
  );
};

export default ClassHomeWorkPage;
