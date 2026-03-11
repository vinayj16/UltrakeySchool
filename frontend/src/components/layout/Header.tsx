import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import apiClient from '../../api/client';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  sender?: {
    name: string;
    photo?: string;
  };
}

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [, setAddNewOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const notificationRef = useRef<HTMLLIElement>(null);
  const profileRef = useRef<HTMLLIElement>(null);

  const isMobileView = viewportWidth < 1024;

  useEffect(() => {
    document.body.classList.toggle('mini-sidebar', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', isMobileSidebarOpen);
  }, [isMobileSidebarOpen]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await apiClient.get('/notifications', {
        params: { limit: 5, unreadOnly: false }
      });
      
      if (response.data.success && response.data.data) {
        setNotifications(response.data.data);
        const unread = response.data.data.filter((n: Notification) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllAsRead = async () => {
    try {
      await apiClient.post('/notifications/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          <img src="/assets/img/logo.svg" alt="Logo" />
        </Link>
        <Link to="/" className="logo-small">
          <img src="/assets/img/logo-small.svg" alt="Logo" />
        </Link>
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
        >
          <i className="ti ti-menu-2" />
        </button>
      </div>

      <div className="header-right">
        <ul className="nav user-menu">
          {/* Dark Mode Toggle */}
          <li className="nav-item">
            <button
              className="nav-link"
              onClick={() => setDarkMode(!isDarkMode)}
            >
              <i className={isDarkMode ? 'ti ti-sun' : 'ti ti-moon'} />
            </button>
          </li>

          {/* Notifications */}
          <li className="nav-item dropdown" ref={notificationRef}>
            <button
              className="nav-link"
              onClick={() => {
                setNotificationOpen(!isNotificationOpen);
                setProfileOpen(false);
                setAddNewOpen(false);
              }}
            >
              <i className="ti ti-bell" />
              {unreadCount > 0 && (
                <span className="badge badge-pill">{unreadCount}</span>
              )}
            </button>
            {isNotificationOpen && (
              <div className="dropdown-menu dropdown-menu-end show">
                <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                  <h4 className="notification-title mb-0">
                    Notifications ({unreadCount})
                  </h4>
                  {unreadCount > 0 && (
                    <button className="btn btn-link p-0" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="text-center py-3">
                      <p className="text-muted mb-0">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      >
                        <div className="d-flex">
                          <span className="avatar avatar-lg me-2 flex-shrink-0">
                            {notification.sender?.photo ? (
                              <img src={notification.sender.photo} alt="Profile" />
                            ) : (
                              <span className="avatar-title rounded-circle bg-primary">
                                {notification.sender?.name?.charAt(0) || 'N'}
                              </span>
                            )}
                          </span>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{notification.title}</h6>
                            <p className="mb-1">{notification.message}</p>
                            <span className="text-muted small">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="text-center border-top pt-3">
                  <Link to="/notifications" className="btn btn-link">
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </li>

          {/* Profile Dropdown */}
          <li className="nav-item dropdown" ref={profileRef}>
            <button
              className="nav-link"
              onClick={() => {
                setProfileOpen(!isProfileOpen);
                setNotificationOpen(false);
                setAddNewOpen(false);
              }}
            >
              <span className="avatar avatar-md rounded">
                {user?.photo ? (
                  <img src={user.photo} alt="Profile" className="img-fluid" />
                ) : (
                  <span className="avatar-title rounded-circle bg-primary">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </span>
            </button>
            {isProfileOpen && (
              <div className="dropdown-menu dropdown-menu-end show">
                <div className="d-flex align-items-center px-2 py-3 border-bottom">
                  <span className="avatar avatar-md me-2 online avatar-rounded">
                    {user?.photo ? (
                      <img src={user.photo} alt="Profile" />
                    ) : (
                      <span className="avatar-title rounded-circle bg-primary">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </span>
                  <div>
                    <h6 className="mb-0">{user?.name || 'User'}</h6>
                    <p className="text-muted mb-0 small">{user?.email || ''}</p>
                  </div>
                </div>
                <Link to="/profile" className="dropdown-item">
                  <i className="ti ti-user-circle me-2" />
                  My Profile
                </Link>
                <Link to="/settings" className="dropdown-item">
                  <i className="ti ti-settings me-2" />
                  Settings
                </Link>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={handleLogout}>
                  <i className="ti ti-logout me-2" />
                  Logout
                </button>
              </div>
            )}
          </li>

          {/* Mobile Menu Toggle */}
          {isMobileView && (
            <li className="nav-item">
              <button
                className="nav-link mobile-menu-toggle"
                onClick={() => setMobileSidebarOpen(!isMobileSidebarOpen)}
              >
                <i className="ti ti-menu-2" />
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
