import React, { useState, useEffect, type JSX } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import { getEnhancedSidebarMenu } from '../config/enhanced-sidebar-menus'
import type { MenuItem, MenuSection } from '../config/enhanced-sidebar-menus'
import '../styles/sidebar.css'
import '../styles/enhanced-sidebar.css'

interface EnhancedSidebarProps {
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
  onMobileClose?: () => void
}

const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({ 
  collapsed = false, 
  onCollapse, 
  onMobileClose 
}) => {
  const location = useLocation()
  const { user } = useAuth()
  
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [isMiniMode, setIsMiniMode] = useState<boolean>(
    document.body.classList.contains('mini-sidebar')
  )
  
  // Get menu based on user role
  const menu = user ? getEnhancedSidebarMenu(user.role) : []
  
  // Auto-expand menu if any child is active
  useEffect(() => {
    const newExpandedItems: Record<string, boolean> = {}
    
    menu.forEach((section: MenuSection) => {
      section.items.forEach((item: MenuItem) => {
        if (item.children && item.children.length > 0) {
          const hasActiveChild = item.children.some((child: MenuItem) => 
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
  
  // Toggle sidebar collapse/expand
  const toggleCollapse = () => {
    const newState = !collapsed
    onCollapse?.(newState)
    
    // Update body classes for sidebar state
    if (newState) {
      document.body.classList.add('mini-sidebar')
    } else {
      document.body.classList.remove('mini-sidebar')
    }
  }
  
  // Toggle individual menu items
  const toggleItem = (itemLabel: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemLabel]: !prev[itemLabel]
    }))
  }
  
  // Close sidebar on mobile
  const closeSidebar = () => {
    setIsMobileOpen(false)
    onMobileClose?.()
    document.querySelector('.main-wrapper')?.classList.remove('slide-nav')
    document.querySelector('.sidebar-overlay')?.classList.remove('opened')
    document.documentElement.classList.remove('menu-opened')
  }
  
  // Close sidebar if mobile
  const closeSidebarIfMobile = () => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 1024) closeSidebar()
  }
  
  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen)
    if (!isMobileOpen) {
      document.documentElement.classList.add('menu-opened')
      document.querySelector('.main-wrapper')?.classList.add('slide-nav')
      document.querySelector('.sidebar-overlay')?.classList.add('opened')
    } else {
      closeSidebar()
    }
  }
  
  // Desktop hover expand for mini mode
  const handleMouseEnter = () => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 1024) return
    if (!collapsed && !isMiniMode) return
    document.body.classList.add('expand-menu')
  }
  
  const handleMouseLeave = () => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 1024) return
    document.body.classList.remove('expand-menu')
  }
  
  const renderMenuItem = (item: MenuItem, itemKey: string): JSX.Element => {
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
              {item.children?.map((child: MenuItem, idx: number) => (
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
  
  const renderSection = (section: MenuSection, sectionIdx: number): JSX.Element => {
    return (
      <li key={sectionIdx}>
        {!collapsed && (
          <h6 className="submenu-hdr">
            <span>{section.title}</span>
          </h6>
        )}
        <ul>
          {section.items.map((item: MenuItem, itemIdx: number) => renderMenuItem(item, `${sectionIdx}-${itemIdx}`))}
        </ul>
      </li>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`sidebar-overlay ${isMobileOpen ? 'opened' : ''}`}
        onClick={closeSidebar}
      />
      
      {/* Sidebar */}
      <div
        className={`sidebar ${collapsed ? 'mini-sidebar' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="sidebar-inner">
          {/* Fixed top area */}
          <div className="sidebar-fixed-top">
            {/* Mobile menu toggle */}
            <button
              className="sidebar-mobile-toggle d-md-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              type="button"
            >
              <i className="ti ti-menu-2"></i>
            </button>

            {/* Desktop collapse toggle */}
            <button
              className="sidebar-collapse-btn d-none d-md-block"
              onClick={toggleCollapse}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              type="button"
            >
              <i className={`ti ${collapsed ? 'ti-menu-2' : 'ti-chevron-left'}`}></i>
            </button>

            {/* User info */}
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

          {/* Scroll area */}
          <div className="sidebar-scroll slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                {menu.map((section, idx) => renderSection(section, idx))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EnhancedSidebar
