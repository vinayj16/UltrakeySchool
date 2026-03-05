import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../store/authStore'
import { canAccessRoute } from '../utils/permissions'
import Header from '../components/layout/Header'
import RoleSidebar from '../components/RoleSidebar'

// Route Guard Component - Checks authentication and permissions
const RouteGuard: React.FC = () => {
  const location = useLocation()
  const { user } = useAuth()
  const navigate = useNavigate()

  // Check if user is authenticated
  if (!user) {
    console.log('[RouteGuard] No user found, redirecting to login')
    navigate('/login', { replace: true })
    return null
  }

  // Check if user can access current route
  if (!canAccessRoute(user, location.pathname)) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="card text-center p-5">
          <div className="card-body">
            <div className="mb-4">
              <i className="ti ti-lock fs-1 text-warning mb-3"></i>
            </div>
            <h4 className="mb-3">Access Restricted</h4>
            <p className="text-muted mb-4">
              This module is not available for your role or plan.
              <br />
              Please contact your administrator for access.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <Outlet />
}

// Main Layout Component
const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  const handleMobileClose = () => {
    // Close mobile sidebar
  }

  return (
    <div className="main-wrapper">
      <Header />
      <div className="main-container" style={{ display: 'flex' }}>
        <RoleSidebar 
          collapsed={isSidebarCollapsed}
          onCollapse={handleSidebarToggle}
          onMobileClose={handleMobileClose}
        />
        <div className="page-wrapper" style={{ flex: 1 }}>
          <div className="content container-fluid">
            {/* Global module-based route guard */}
            <RouteGuard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainLayout