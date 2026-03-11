import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { DASHBOARD_ACCESS_DATA, type DashboardAccessEntry } from '../../../data/dashboardAccessData'
import { setDemoUser, type DemoModeUser } from '../../../utils/demoMode'

const DashboardAccessGrid: React.FC = () => {
  const navigate = useNavigate()
  const [activatingRole, setActivatingRole] = useState<string | null>(null)

  const handleOpenDashboard = (entry: DashboardAccessEntry) => {
    if (activatingRole) return

    setActivatingRole(entry.previewId)

    try {
      const demoPayload: DemoModeUser = {
        id: `${entry.previewId}-${Date.now()}`,
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
    } catch (error) {
      console.error('[DashboardAccessGrid] Failed to seed demo user', error)
      toast.error('Unable to open dashboard. Please try again.')
      setActivatingRole(null)
    }
  }

  return (
    <div className="dashboard-access-grid">
      {DASHBOARD_ACCESS_DATA.map((entry) => (
        <article key={entry.previewId} className="dashboard-access-card shadow-sm">
          <header className="dashboard-access-card__header">
            <div>
              <p className="text-uppercase text-muted small mb-1">
                {entry.badge || entry.role.replace('_', ' ')}
              </p>
              <h5 className="mb-1">{entry.title}</h5>
              <p className="text-muted fs-sm">{entry.description}</p>
            </div>
            <span className="badge bg-soft-primary text-uppercase align-self-start">{entry.role}</span>
          </header>

          <div className="dashboard-access-card__kpis">
            {entry.kpis.map((kpi) => (
              <div key={kpi.label} className="dashboard-access-card__kpi">
                <p className="mb-0 text-muted small">{kpi.label}</p>
                <h6 className="mb-0">{kpi.value}</h6>
                {kpi.note && <small className="text-muted">{kpi.note}</small>}
              </div>
            ))}
          </div>

          <div className="dashboard-access-card__permissions">
            {entry.permissions.map((permission) => (
              <span key={permission} className="badge bg-light text-dark me-1 mb-1">
                {permission}
              </span>
            ))}
          </div>

          <p className="text-muted small mb-3">{entry.startingPoint}</p>

          <div className="dashboard-access-card__actions">
            <Link to={`/preview/${entry.previewId}`} className="btn btn-link text-decoration-none">
              Preview dashboard
            </Link>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleOpenDashboard(entry)}
              disabled={Boolean(activatingRole)}
            >
              {activatingRole === entry.previewId ? (
                <>
                  <i className="ti ti-loader me-2" style={{ animation: 'spin 1s linear infinite' }}></i>
                  Opening...
                </>
              ) : (
                'Open dashboard'
              )}
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

export default DashboardAccessGrid
