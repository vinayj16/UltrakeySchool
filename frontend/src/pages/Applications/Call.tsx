import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import callLogService, { type CallLog, type CallLogFormData } from '../../services/callLogService';

const Call: React.FC = () => {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const [formData, setFormData] = useState<Omit<CallLogFormData, 'schoolId'>>({
    callerId: '',
    callerName: '',
    callerRole: '',
    receiverId: '',
    receiverName: '',
    receiverRole: '',
    receiverPhone: '',
    callType: 'outgoing',
    direction: 'outbound',
    duration: 0,
    status: 'completed',
    notes: '',
    callDate: new Date().toISOString().slice(0, 16)
  });

  useEffect(() => {
    fetchCallLogs();
  }, []);

  const fetchCallLogs = async () => {
    try {
      setLoading(true);
      const schoolId = localStorage.getItem('schoolId') || localStorage.getItem('institutionId');
      if (!schoolId) {
        toast.error('School ID not found');
        return;
      }

      const response = await callLogService.getAll(schoolId);
      setCallLogs((response as any).data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch call logs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.callerName || !formData.receiverName) {
      toast.error('Caller and receiver names are required');
      return;
    }

    try {
      setSaving(true);
      const schoolId = localStorage.getItem('schoolId') || localStorage.getItem('institutionId');
      if (!schoolId) {
        toast.error('School ID not found');
        return;
      }

      const userId = localStorage.getItem('userId');
      const submitData = {
        ...formData,
        callerId: formData.callerId || userId || ''
      };

      await callLogService.create(schoolId, submitData);
      toast.success('Call log created successfully');
      setShowAddModal(false);
      resetForm();
      fetchCallLogs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create call log');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      callerId: '',
      callerName: '',
      callerRole: '',
      receiverId: '',
      receiverName: '',
      receiverRole: '',
      receiverPhone: '',
      callType: 'outgoing',
      direction: 'outbound',
      duration: 0,
      status: 'completed',
      notes: '',
      callDate: new Date().toISOString().slice(0, 16)
    });
  };

  const openViewModal = (call: CallLog) => {
    setSelectedCall(call);
    setShowViewModal(true);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCallTypeIcon = (type: string) => {
    switch (type) {
      case 'incoming':
        return 'ti ti-phone-incoming';
      case 'outgoing':
        return 'ti ti-phone-outgoing';
      case 'missed':
        return 'ti ti-phone-x';
      case 'voicemail':
        return 'ti ti-voicemail';
      default:
        return 'ti ti-phone';
    }
  };

  const getCallTypeColor = (type: string) => {
    switch (type) {
      case 'incoming':
        return 'text-success';
      case 'outgoing':
        return 'text-primary';
      case 'missed':
        return 'text-danger';
      case 'voicemail':
        return 'text-warning';
      default:
        return 'text-secondary';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-soft-success';
      case 'failed':
        return 'badge-soft-danger';
      case 'busy':
        return 'badge-soft-warning';
      case 'no_answer':
        return 'badge-soft-secondary';
      case 'cancelled':
        return 'badge-soft-dark';
      default:
        return 'badge-soft-secondary';
    }
  };

  const filteredCallLogs = filterType === 'all' 
    ? callLogs 
    : callLogs.filter(call => call.callType === filterType);

  return (
    <div className="content">
      {/* Page Header */}
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Call Logs</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/applications">Application</Link>
              </li>
              <li className="breadcrumb-item active">Call Logs</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex align-items-center flex-wrap">
          <button
            className="btn btn-outline-light bg-white btn-icon me-2"
            onClick={fetchCallLogs}
            disabled={loading}
          >
            <i className="ti ti-refresh"></i>
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <i className="ti ti-plus me-2"></i>Add Call Log
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card mb-3">
        <div className="card-body">
          <ul className="nav nav-tabs nav-tabs-bottom">
            <li className="nav-item">
              <button
                className={`nav-link ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                <i className="ti ti-phone me-2"></i>All Calls
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${filterType === 'incoming' ? 'active' : ''}`}
                onClick={() => setFilterType('incoming')}
              >
                <i className="ti ti-phone-incoming me-2"></i>Incoming
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${filterType === 'outgoing' ? 'active' : ''}`}
                onClick={() => setFilterType('outgoing')}
              >
                <i className="ti ti-phone-outgoing me-2"></i>Outgoing
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${filterType === 'missed' ? 'active' : ''}`}
                onClick={() => setFilterType('missed')}
              >
                <i className="ti ti-phone-x me-2"></i>Missed
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${filterType === 'voicemail' ? 'active' : ''}`}
                onClick={() => setFilterType('voicemail')}
              >
                <i className="ti ti-voicemail me-2"></i>Voicemail
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Call Logs List */}
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredCallLogs.length === 0 ? (
            <div className="text-center py-5">
              <i className="ti ti-phone-off fs-1 text-muted mb-3"></i>
              <p className="text-muted">No call logs found</p>
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                <i className="ti ti-plus me-2"></i>Add First Call Log
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Caller</th>
                    <th>Receiver</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCallLogs.map(call => (
                    <tr key={call._id}>
                      <td>
                        <i className={`${getCallTypeIcon(call.callType)} ${getCallTypeColor(call.callType)} fs-5`}></i>
                      </td>
                      <td>
                        <div>
                          <h6 className="mb-0">{call.callerName || 'Unknown'}</h6>
                          {call.callerRole && <small className="text-muted">{call.callerRole}</small>}
                        </div>
                      </td>
                      <td>
                        <div>
                          <h6 className="mb-0">{call.receiverName || 'Unknown'}</h6>
                          {call.receiverPhone && <small className="text-muted">{call.receiverPhone}</small>}
                        </div>
                      </td>
                      <td>{formatDuration(call.duration)}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(call.status)}`}>
                          {call.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>{formatDate(call.callDate)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openViewModal(call)}
                        >
                          <i className="ti ti-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Call Log Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Call Log</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Caller Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="callerName"
                        value={formData.callerName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Caller Role</label>
                      <input
                        type="text"
                        className="form-control"
                        name="callerRole"
                        value={formData.callerRole}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Receiver Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="receiverName"
                        value={formData.receiverName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Receiver Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="receiverPhone"
                        value={formData.receiverPhone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Call Type</label>
                      <select
                        className="form-select"
                        name="callType"
                        value={formData.callType}
                        onChange={handleInputChange}
                      >
                        <option value="outgoing">Outgoing</option>
                        <option value="incoming">Incoming</option>
                        <option value="missed">Missed</option>
                        <option value="voicemail">Voicemail</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Direction</label>
                      <select
                        className="form-select"
                        name="direction"
                        value={formData.direction}
                        onChange={handleInputChange}
                      >
                        <option value="outbound">Outbound</option>
                        <option value="inbound">Inbound</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Duration (seconds)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="busy">Busy</option>
                        <option value="no_answer">No Answer</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Call Date & Time</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="callDate"
                        value={formData.callDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Notes</label>
                      <textarea
                        className="form-control"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowAddModal(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Add Call Log'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Call Details Modal */}
      {showViewModal && selectedCall && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Call Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <div className="d-flex align-items-center mb-3">
                      <i className={`${getCallTypeIcon(selectedCall.callType)} ${getCallTypeColor(selectedCall.callType)} fs-1 me-3`}></i>
                      <div>
                        <h5 className="mb-0">{selectedCall.callType.toUpperCase()} CALL</h5>
                        <small className="text-muted">{formatDate(selectedCall.callDate)}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small">Caller</label>
                    <p className="mb-0 fw-semibold">{selectedCall.callerName}</p>
                    {selectedCall.callerRole && <small className="text-muted">{selectedCall.callerRole}</small>}
                  </div>
                  <div className="col-6">
                    <label className="text-muted small">Receiver</label>
                    <p className="mb-0 fw-semibold">{selectedCall.receiverName}</p>
                    {selectedCall.receiverPhone && <small className="text-muted">{selectedCall.receiverPhone}</small>}
                  </div>
                  <div className="col-6">
                    <label className="text-muted small">Duration</label>
                    <p className="mb-0">{formatDuration(selectedCall.duration)}</p>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small">Status</label>
                    <p className="mb-0">
                      <span className={`badge ${getStatusBadge(selectedCall.status)}`}>
                        {selectedCall.status.replace('_', ' ')}
                      </span>
                    </p>
                  </div>
                  {selectedCall.notes && (
                    <div className="col-12">
                      <label className="text-muted small">Notes</label>
                      <p className="mb-0">{selectedCall.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={() => setShowViewModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Call;
