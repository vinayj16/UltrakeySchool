import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import { getRoleBasedDashboard } from '../utils/permissions'

interface RoleBasedDashboardRouterProps {
  children?: React.ReactNode
}

const RoleBasedDashboardRouter: React.FC<RoleBasedDashboardRouterProps> = ({ children }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Only redirect if user is authenticated and on root path
    if (user && location.pathname === '/') {
      const dashboardPath = getRoleBasedDashboard(user.role)
      if (dashboardPath !== '/') {
        navigate(dashboardPath, { replace: true })
      }
    }
  }, [user, location.pathname, navigate])

  // Show loading state while determining dashboard
  if (!user) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default RoleBasedDashboardRouter