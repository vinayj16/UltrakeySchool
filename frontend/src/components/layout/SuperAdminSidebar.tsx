import React from 'react'
import { NavLink } from 'react-router-dom'
import '../../styles/sidebar.css'

const SuperAdminSidebar: React.FC = () => {
  const items = [
    { to: '/super-admin/dashboard', label: 'Dashboard', icon: 'ti ti-layout-dashboard' },
    { to: '/super-admin/institutions/schools', label: 'Schools', icon: 'ti ti-building-bank' },
    { to: '/super-admin/memberships', label: 'Subscriptions / Plans', icon: 'ti ti-crown' },
    { to: '/super-admin/transactions', label: 'Transactions', icon: 'ti ti-report-money' },
    { to: '/super-admin/tickets', label: 'Support / Tickets', icon: 'ti ti-ticket' },
    { to: '/super-admin/analytics', label: 'Analytics', icon: 'ti ti-chart-line' },
    { to: '/super-admin/modules', label: 'Modules Control', icon: 'ti ti-puzzle' },
    { to: '/super-admin/audit-logs', label: 'Audit Logs', icon: 'ti ti-shield-check' },
    { to: '/super-admin/impersonate', label: 'Impersonate School', icon: 'ti ti-user-switch' },
    { to: '/super-admin/alerts', label: 'Expiry & Alerts', icon: 'ti ti-alert-triangle' },
    { to: '/super-admin/settings', label: 'Platform Settings', icon: 'ti ti-settings' },
  ]

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll">
        <div id="sidebar-menu" className="sidebar-menu">
          {/* Platform Info Header */}
          <div className="d-flex align-items-center border bg-white rounded p-2 mb-4 sidebar-school-info">
            <div className="d-flex align-items-center">
              <div className="avatar avatar-md img-fluid rounded me-2 user-avatar">
                <i className="ti ti-crown"></i>
              </div>
              <div className="user-info">
                <div className="user-name">Super Admin</div>
                <div className="user-role">Platform</div>
              </div>
            </div>
          </div>

          {/* Menu Section */}
          <div className="sidebar-menu-section">
            <div className="menu-section-title">PLATFORM</div>
            <div className="menu-items">
              {items.map((it) => (
                <div key={it.to} className="sidebar-menu-item">
                  <NavLink 
                    to={it.to} 
                    className={({ isActive }) => 'menu-link' + (isActive ? ' active' : '')}
                  >
                    <i className={`${it.icon} menu-icon`}></i>
                    <span className="menu-label">{it.label}</span>
                  </NavLink>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="sidebar-footer">
            <small>Platform Control</small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminSidebar
