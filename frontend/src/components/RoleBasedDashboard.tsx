import React, { useEffect, useState } from 'react'
import { useAuth } from '../store/authStore'
import { apiClient } from '../api/client'
import DashboardCharts from './DashboardCharts'
import AdminAnalytics from './AdminAnalytics'
import '../common/LoadingSpinner.css'

const RoleBasedDashboard: React.FC = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch dashboard data based on user role
        const response = await apiClient.get(`/dashboard/${user?.role?.toLowerCase()}`)
        
        if (response.data.success) {
          // Dashboard data fetched successfully
          console.log('Dashboard data loaded:', response.data.data)
        }
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err)
        setError(err.response?.data?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    } else {
      setLoading(false)
    }
  }, [user])

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
        <div className="text-center">
          <i className="ti ti-alert-circle fs-1 text-danger mb-3"></i>
          <h4 className="mb-3">Error Loading Dashboard</h4>
          <p className="text-muted mb-4">{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            <i className="ti ti-refresh me-2"></i>
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Render dashboard based on user role
  const renderDashboard = () => {
    const role = user?.role?.toLowerCase()

    switch (role) {
      case 'superadmin':
      case 'super_admin':
        return <AdminAnalytics />
      
      case 'admin':
      case 'school_admin':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>School Admin Dashboard</h2>
              <div className="text-muted">
                Welcome back, {user?.name}
              </div>
            </div>
            <DashboardCharts />
          </div>
        )
      
      case 'teacher':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Teacher Dashboard</h2>
              <div className="text-muted">
                Welcome back, {user?.name}
              </div>
            </div>
            <DashboardCharts />
          </div>
        )
      
      case 'student':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Student Dashboard</h2>
              <div className="text-muted">
                Welcome back, {user?.name}
              </div>
            </div>
            <DashboardCharts />
          </div>
        )
      
      case 'parent':
        return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Parent Dashboard</h2>
              <div className="text-muted">
                Welcome back, {user?.name}
              </div>
            </div>
            <DashboardCharts />
          </div>
        )
      
      default:
        return (
          <div className="d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
            <div className="text-center">
              <i className="ti ti-user-off fs-1 text-muted mb-3"></i>
              <h4 className="mb-3">Dashboard Not Available</h4>
              <p className="text-muted">
                Dashboard is not available for your role: {user?.role}
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="container-fluid">
      {renderDashboard()}
    </div>
  )
}

export default RoleBasedDashboard
