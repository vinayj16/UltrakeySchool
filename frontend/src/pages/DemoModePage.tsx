import React from 'react'
import { useNavigate } from 'react-router-dom'
import { setDemoUser } from '../utils/demoMode'
import { createMockUser } from '../utils/bypassAuth'
import './DemoModePage.css'

interface DashboardConfig {
  role: string
  name: string
  description: string
  icon: string
  color: string
  route: string
}

const DASHBOARDS: DashboardConfig[] = [
  {
    role: 'superadmin',
    name: 'System Command Center',
    description: 'Platform-wide monitoring and control',
    icon: 'ti ti-server',
    color: 'purple',
    route: '/super-admin/dashboard'
  },
  {
    role: 'institution_admin',
    name: 'Institution Analytics',
    description: 'Institution performance metrics',
    icon: 'ti ti-building-factory',
    color: 'blue',
    route: '/dashboard'
  },
  {
    role: 'school_admin',
    name: 'School Operations',
    description: 'School management dashboard',
    icon: 'ti ti-school',
    color: 'cyan',
    route: '/dashboard'
  },
  {
    role: 'principal',
    name: 'Leadership Board',
    description: 'Academic oversight dashboard',
    icon: 'ti ti-crown',
    color: 'teal',
    route: '/dashboard'
  },
  {
    role: 'teacher',
    name: 'Teacher Intelligence',
    description: 'Class performance and assignments',
    icon: 'ti ti-chalkboard',
    color: 'green',
    route: '/dashboard'
  },
  {
    role: 'student',
    name: 'Learner Snapshot',
    description: 'Personal academic dashboard',
    icon: 'ti ti-user',
    color: 'lime',
    route: '/dashboard'
  },
  {
    role: 'parent',
    name: 'Guardian Overview',
    description: 'Children progress tracking',
    icon: 'ti ti-users-group',
    color: 'yellow',
    route: '/dashboard'
  },
  {
    role: 'accountant',
    name: 'Finance Cockpit',
    description: 'Revenue and financial metrics',
    icon: 'ti ti-currency-dollar',
    color: 'orange',
    route: '/dashboard'
  },
  {
    role: 'hr_manager',
    name: 'People Pulse',
    description: 'HR and employee management',
    icon: 'ti ti-user-heart',
    color: 'red',
    route: '/dashboard'
  },
  {
    role: 'librarian',
    name: 'Library Board',
    description: 'Books and borrowing management',
    icon: 'ti ti-book',
    color: 'pink',
    route: '/dashboard'
  },
  {
    role: 'transport_manager',
    name: 'Transport Map',
    description: 'Vehicle and route management',
    icon: 'ti ti-map-pins',
    color: 'purple',
    route: '/dashboard'
  },
  {
    role: 'hostel_warden',
    name: 'Hostel Control',
    description: 'Room and occupancy management',
    icon: 'ti ti-home',
    color: 'indigo',
    route: '/dashboard'
  },
  {
    role: 'staff_member',
    name: 'Staff Hub',
    description: 'Staff tasks and communications',
    icon: 'ti ti-briefcase',
    color: 'gray',
    route: '/staff'
  }
]

const DemoModePage: React.FC = () => {
  const navigate = useNavigate()

  const handleDashboardSelect = (dashboard: DashboardConfig) => {
    console.log('[DemoModePage] Selected dashboard:', dashboard.role)
    
    // Create a proper demo user object
    const mockUser = createMockUser(dashboard.role)
    console.log('[DemoModePage] Created mock user:', mockUser)
    
    // Add missing status property
    const userWithStatus = {
      ...mockUser,
      status: 'active' as const
    }
    
    // Set demo user for the selected role
    setDemoUser(userWithStatus)
    
    // Small delay to ensure demo user is set before navigation
    setTimeout(() => {
      console.log('[DemoModePage] Navigating to:', dashboard.route)
      navigate(dashboard.route)
    }, 100)
  }

  return (
    <div className="demo-mode-page">
      <div className="demo-container">
        {/* Header */}
        <div className="demo-header">
          <h1 className="demo-title">Demo Mode</h1>
          <p className="demo-subtitle">Click any dashboard to preview with full functionality</p>
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {DASHBOARDS.map((dashboard) => (
            <button
              key={dashboard.role}
              onClick={() => handleDashboardSelect(dashboard)}
              className={`dashboard-card ${dashboard.color}`}
            >
              {/* Icon */}
              <div className={`dashboard-icon ${dashboard.color}`}>
                <i className={`${dashboard.icon}`} />
              </div>

              {/* Content */}
              <div className="dashboard-content">
                <h3 className="dashboard-name">{dashboard.name}</h3>
                <p className="dashboard-description">{dashboard.description}</p>
              </div>

              {/* Hover Indicator */}
              <div className="dashboard-arrow">
                <i className="ti ti-arrow-right" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="demo-footer">
          <p>All dashboards work with full functionality • No backend required</p>
        </div>
      </div>
    </div>
  )
}

export default DemoModePage
