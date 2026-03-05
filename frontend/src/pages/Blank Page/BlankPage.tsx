import React from 'react'
import { Link } from 'react-router-dom'

const BlankPage: React.FC = () => {
  return (
    <div className="page-wrapper">
      <div className="content blank-page">
        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Blank</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <a href="javascript:void(0);">Content</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">Blank</li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <div className="pe-1 mb-2">
              <button 
                className="btn btn-outline-light bg-white btn-icon me-1" 
                data-bs-toggle="tooltip"
                data-bs-placement="top" 
                aria-label="Refresh" 
                data-bs-original-title="Refresh"
                onClick={() => window.location.reload()}
              >
                <i className="ti ti-refresh"></i>
              </button>
            </div>
            <div className="pe-1 mb-2">
              <button 
                type="button" 
                className="btn btn-outline-light bg-white btn-icon me-1"
                data-bs-toggle="tooltip" 
                data-bs-placement="top" 
                aria-label="Print"
                data-bs-original-title="Print"
                onClick={() => window.print()}
              >
                <i className="ti ti-printer"></i>
              </button>
            </div>
          </div>
        </div>
        {/* /Page Header */}

        {/* Blank Content Area */}
        <div className="card">
          <div className="card-body">
            <p className="text-muted">This is a blank page template. Add your content here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlankPage
