import React from 'react'
import InstitutionCreationWizard from '../superadmin/InstitutionCreationWizard'

const AgentAddInstitutionPage: React.FC = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Add New Institution</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href="/super-admin/dashboard">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/super-admin/institutions">Institutions</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">Add Institution</li>
                </ol>
              </nav>
            </div>
          </div>
          <InstitutionCreationWizard />
        </div>
      </div>
    </div>
  )
}

export default AgentAddInstitutionPage
