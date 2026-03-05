import { Outlet } from 'react-router-dom'
import { useAuth } from '../store/authStore'

// Agent Sidebar Component
const AgentSidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <h4 className="mb-0">Agent Portal</h4>
        </div>
      </div>
      <div className="sidebar-content">
        <h6 className="sidebar-section-title">MAIN</h6>
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <a href="/agent/dashboard" className="sidebar-link active">
              <i className="ti ti-layout-dashboard me-2" />Dashboard
            </a>
          </li>
          <li className="sidebar-item">
            <a href="/agent/institutions" className="sidebar-link">
              <i className="ti ti-building me-2" />My Institutions
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

// Agent Header Component
const AgentHeader = () => {
  const { user } = useAuth()

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h5 className="mb-0">Agent Dashboard</h5>
        </div>
        <div className="header-right">
          <div className="header-actions">
            <button className="btn btn-icon btn-outline-light">
              <i className="ti ti-bell" />
            </button>
            <div className="dropdown">
              <button className="btn btn-outline-light dropdown-toggle d-flex align-items-center">
                <div className="avatar avatar-sm bg-primary text-white rounded-circle me-2">
                  <i className="ti ti-user fs-12" />
                </div>
                <span>{user?.name || 'Agent User'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

// Main Agent Layout Component
const AgentLayout = () => {
  return (
    <div className="page-body">
      <AgentSidebar />
      <div className="main-content">
        <AgentHeader />
        <div className="inner-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AgentLayout
