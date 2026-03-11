import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import { getSidebarMenu } from '../config/sidebar-menus'
import type { MenuItem, MenuSection } from '../config/sidebar-menus'
import '../styles/sidebar.css'

interface RoleSidebarProps {
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
  onMobileClose?: () => void
}

const RoleSidebar: React.FC<RoleSidebarProps> = ({ collapsed = false, onMobileClose }) => {
  const location = useLocation()
  const { user } = useAuth()
  
  const [isMiniMode, setIsMiniMode] = useState<boolean>(document.body.classList.contains('mini-sidebar'))
  
  // Get menu based on user role
  const menu = user ? getSidebarMenu(user.role) : []
  
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  
  // Auto-expand menu if any child is active
  useEffect(() => {
    const newExpandedItems: Record<string, boolean> = {}
    
    menu.forEach(section => {
      section.items.forEach(item => {
        if (item.children && item.children.length > 0) {
          const hasActiveChild = item.children.some(child => 
            child.path === location.pathname || 
            (child.path && location.pathname.startsWith(child.path))
          )
          
          if (hasActiveChild) {
            newExpandedItems[item.label] = true
          }
        }
      })
    })
    
    setExpandedItems(prev => ({ ...prev, ...newExpandedItems }))
  }, [location.pathname, menu])
  
  // Observe body class changes for mini-sidebar
  useEffect(() => {
    const checkMini = () => setIsMiniMode(document.body.classList.contains('mini-sidebar'))
    checkMini()
    const observer = new MutationObserver(checkMini)
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  
  const toggleItem = (itemLabel: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemLabel]: !prev[itemLabel]
    }))
  }
  
  const closeSidebar = () => {
    // Close sidebar on mobile (React state, if wired)
    onMobileClose?.()

    // Close sidebar for the template behavior (no jQuery dependency)
    if (typeof window === 'undefined') return
    document.querySelector('.main-wrapper')?.classList.remove('slide-nav')
    document.querySelector('.sidebar-overlay')?.classList.remove('opened')
    document.documentElement.classList.remove('menu-opened')
  }

  const closeSidebarIfMobile = () => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 1024) closeSidebar()
  }

  // Desktop UX: when sidebar is in mini mode, hover expands it temporarily.
  const handleMouseEnter = () => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 1024) return

    const isMini = collapsed || document.body.classList.contains('mini-sidebar')
    if (!isMini) return

    document.body.classList.add('expand-menu')
  }

  const handleMouseLeave = () => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 1024) return

    document.body.classList.remove('expand-menu')
  }

  const renderMenuItem = (item: MenuItem, itemKey: string) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems[itemKey]
    const isActive = item.path === location.pathname
    
    return (
      <li key={itemKey} className={hasChildren ? 'submenu' : ''}>
        {hasChildren ? (
          <>
            <a
              href="javascript:void(0);"
              className={`${isActive ? 'active' : ''}`}
              onClick={() => toggleItem(itemKey)}
            >
              <i className={item.icon}></i>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && (
                <span className={`menu-arrow ${isExpanded ? 'expanded' : ''}`}></span>
              )}
            </a>
            <ul style={{ display: isExpanded && !collapsed ? 'block' : 'none' }}>
              {item.children?.map((child, idx) => (
                <li key={idx}>
                  <NavLink
                    to={child.path}
                    className={({ isActive }) => isActive ? 'active' : ''}
                    onClick={closeSidebarIfMobile}
                  >
                    <i className={child.icon}></i>
                    <span>{child.label}</span>
                    {child.badge && <span className="badge">{child.badge}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <NavLink
            to={item.path}
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={closeSidebarIfMobile}
          >
            <i className={item.icon}></i>
            {!collapsed && (
              <>
                <span>{item.label}</span>
                {item.badge && <span className="badge">{item.badge}</span>}
              </>
            )}
          </NavLink>
        )}
      </li>
    )
  }
  
  const renderSection = (section: MenuSection, sectionIdx: number) => {
    return (
      <li key={sectionIdx}>
        {!collapsed && (
          <h6 className="submenu-hdr">
            <span>{section.title}</span>
          </h6>
        )}
        <ul>
          {section.items.map((item, itemIdx) => renderMenuItem(item, `${sectionIdx}-${itemIdx}`))}
        </ul>
      </li>
    )
  }
  
  const handleCloseClick = () => closeSidebar()

  return (
    <div
      className={`sidebar ${collapsed ? 'mini-sidebar' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sidebar-inner">
        {/* Fixed top area: close button + user/role card (does NOT scroll) */}
        <div className="sidebar-fixed-top">
          {/* Close Button - Only visible on mobile */}
          <button
            className="sidebar-close-btn"
            onClick={handleCloseClick}
            aria-label="Close sidebar"
            type="button"
          >
            <i className="ti ti-x"></i>
          </button>

          {/* School / User Info (fixed / standard) */}
          <div className="d-flex align-items-center border bg-white rounded p-2 sidebar-school-info">
            <div className="d-flex align-items-center">
              <div className="avatar avatar-md img-fluid rounded me-2 user-avatar">
                <i className="ti ti-user-circle"></i>
              </div>
              {(!isMiniMode || document.body.classList.contains('expand-menu')) && (
                <div className="user-info">
                  <div className="user-name">{user?.name || 'User'}</div>
                  <div className="user-role">{user?.role || 'Role'}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll area: only the menu (and footer) scrolls */}
        <div className="sidebar-scroll slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            {/* Menu Sections */}
            <ul>
              {menu.map((section, idx) => renderSection(section, idx))}
            </ul>

            {/* Footer */}
            {!collapsed && user?.schoolId && (
              <div className="sidebar-footer">
                <small>School ID: {user.schoolId}</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleSidebar
