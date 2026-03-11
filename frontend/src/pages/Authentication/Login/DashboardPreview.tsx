import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DASHBOARD_ACCESS_DATA, type DashboardAccessEntry } from '../../../data/dashboardAccessData'
import { setDemoUser, type DemoModeUser } from '../../../utils/demoMode'

const DashboardPreview: React.FC = () => {
  const { previewId } = useParams()
  const navigate = useNavigate()
  const entry = previewId
    ? DASHBOARD_ACCESS_DATA.find((item) => item.previewId === previewId)
    : null

  const handleOpenDashboard = () => {
    if (!entry) return

    const demoPayload: DemoModeUser = {
      id: `${entry.previewId}-preview`,
      name: entry.demoUser.name,
      email: entry.demoUser.email,
      role: entry.demoUser.role,
      plan: entry.demoUser.plan,
      modules: entry.demoUser.modules,
      permissions: entry.demoUser.permissions,
      status: entry.demoUser.status ?? 'active'
    }

    setDemoUser(demoPayload)

    navigate(entry.route)
  }

  if (!entry) {
    return (
      <div className="dashboard-preview d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="card p-4 text-center">
          <h4 className="mb-3">Dashboard preview not found</h4>
          <p className="text-muted mb-3">Please choose a role from the login page.</p>
          <Link to="/login" className="btn btn-primary">Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-preview">
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
            <div>
              <p className="text-uppercase text-muted small mb-1">{entry.role}</p>
              <h3 className="mb-2">{entry.title}</h3>
              <p className="text-muted mb-0">{entry.description}</p>
            </div>
            <div>
              <span className="badge bg-soft-primary text-uppercase">Preview</span>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-3 mb-4">
            {entry.kpis.map((kpi) => (
              <div key={kpi.label} className="dashboard-preview__kpi">
                <p className="text-muted small mb-1">{kpi.label}</p>
                <h5 className="mb-1">{kpi.value}</h5>
                {kpi.note && <p className="text-muted fs-sm mb-0">{kpi.note}</p>}
              </div>
            ))}
          </div>

          <div className="mb-4">
            <h6 className="mb-2">Permissions highlighted</h6>
            <div className="d-flex flex-wrap gap-2">
              {entry.permissions.map((permission) => (
                <span key={permission} className="badge bg-light text-dark">
                  {permission}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h6 className="mb-2">Where to start</h6>
            <p className="text-muted mb-0">{entry.startingPoint}</p>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-primary" type="button" onClick={handleOpenDashboard}>
              Open live dashboard
            </button>
            <Link to="/login" className="btn btn-outline-primary">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPreview
