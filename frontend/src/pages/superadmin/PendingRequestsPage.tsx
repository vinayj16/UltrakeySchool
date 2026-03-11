
import React from 'react';
import { Link } from 'react-router-dom';

const PendingRequestsPage: React.FC = () => {
  return (
    <div className="container-fluid">
      <div className="d-md-flex d-block align-items-center justify-content-between mb-4">
        <h3 className="page-title">Pending Requests</h3>
        <nav>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/super-admin/dashboard">Dashboard</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Pending Requests</li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Pending Institution Registrations</h4>
            </div>
            <div className="card-body">
              <div className="text-center py-5">
                <i className="ti ti-check-circle ti-4x text-success mb-3"></i>
                <h4 className="mb-3">No Pending Requests</h4>
                <p className="text-muted">All registration requests have been processed.</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>
                  <i className="ti ti-refresh me-2"></i>Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingRequestsPage;
