import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getRoleBasedDashboard } from '../../../utils/permissions'
import { useAuthStore } from '../../../store/authStore'
import { setDemoUser } from '../../../utils/demoMode'
import { createMockUser } from '../../../utils/bypassAuth'
import AuthLeft from './authleft/AuthLeft'
import AuthFooter from './authfooter/AuthFooter'
import './dashboard-buttons.css'
import './LoginLayout.css'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }

    setLoading(true)

    try {
      await login(email, password)
      
      toast.success('Login successful!')
      
      // Get the updated user from auth store
      const authState = useAuthStore.getState()
      const user = authState.user as any
      const userRole = user?.role as string | undefined
      
      console.log('[Login] Auth store user after login:', authState.user)
      console.log('[Login] User role from store:', userRole)
      
      if (userRole) {
        localStorage.setItem('selectedUserRole', userRole)
      }
      
      const dashboardPath = getRoleBasedDashboard(userRole)
      console.log('[Login] Dashboard path:', dashboardPath)
      console.log('[Login] Navigating to:', dashboardPath)
      
      navigate(dashboardPath)
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDashboardSelect = (role: string, route: string) => {
    console.log(`[Login] Selected dashboard: ${role}`)
    
    // Create a proper demo user object
    const mockUser = createMockUser(role)
    
    // Add missing status property
    const userWithStatus = {
      ...mockUser,
      status: 'active' as const
    }
    
    // Set demo user for the selected role
    setDemoUser(userWithStatus)
    
    // Small delay to ensure demo user is set before navigation
    setTimeout(() => {
      console.log(`[Login] Navigating to: ${route}`)
      navigate(route)
    }, 100)
  }

  return (
    <div className="auth-root">
      <AuthLeft />

      <div className="auth-right">
        <div className="auth-right-scroll">
          <div className="auth-right-inner">

            <div className="auth-right-logo">
              <img src="/assets/img/Ultrakey_fav.png" alt="Ultrakey" />
            </div>

            <h1>Welcome Back</h1>
            <p className="auth-subtitle">Please enter your details to Login</p>

            <form onSubmit={handleSubmit}>
              <div className="auth-field has-label" style={{ animationDelay: '.5s' }}>
                <label>Email Address</label>
                <i className="ti ti-mail auth-icon"></i>
                <input
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  disabled={loading}
                  required
                />
              </div>

              <div className="auth-field has-label" style={{ animationDelay: '.58s' }}>
                <label>Password</label>
                <i className="ti ti-lock auth-icon"></i>
                <input
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password" 
                  disabled={loading}
                  required
                />
                <span
                  className={`ti auth-eye ${showPassword ? 'ti-eye' : 'ti-eye-off'}`}
                  onClick={() => !loading && setShowPassword(!showPassword)}
                  style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
                />
              </div>

              <div className="auth-meta">
                <label className="auth-remember">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)} 
                    disabled={loading}
                  />
                  Remember Me
                </label>
                <Link to="/forgot-password" className="auth-forgot">Forgot Password?</Link>
              </div>

              <button 
                type="submit" 
                className="auth-btn-primary"
                disabled={loading}
                style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <>
                    <i className="ti ti-loader" style={{ marginRight: 8, animation: 'spin 1s linear infinite' }}></i>
                    LOGGING IN...
                  </>
                ) : (
                  'LOGIN'
                )}
              </button>
            </form>

            <div className="auth-or">or</div>

            <div className="dashboard-grid">
              <div className="dashboard-grid-header">
                <h4 className="dashboard-title">Quick Dashboard Access</h4>
                <p className="dashboard-subtitle">Click any dashboard to preview with full functionality</p>
              </div>
              
              <div className="dashboard-buttons">
                <button 
                  className="dashboard-btn dashboard-btn-purple"
                  onClick={() => handleDashboardSelect('superadmin', '/super-admin/dashboard')}
                >
                  System Command Center
                </button>
                
                <button 
                  className="dashboard-btn dashboard-btn-blue"
                  onClick={() => handleDashboardSelect('institution_admin', '/dashboard')}
                >
                  Institution Analytics
                </button>
                
                <button 
                  className="dashboard-btn dashboard-btn-cyan"
                  onClick={() => handleDashboardSelect('school_admin', '/dashboard')}
                >
                  School Operations
                </button>
                
                <button 
                  className="dashboard-btn dashboard-btn-teal"
                  onClick={() => handleDashboardSelect('principal', '/dashboard')}
                >
                  Leadership Board
                </button>
                
                <button 
                  className="dashboard-btn dashboard-btn-green"
                  onClick={() => handleDashboardSelect('teacher', '/dashboard')}
                >
                  Teacher Intelligence
                </button>
                
                <button 
                  className="dashboard-btn dashboard-btn-lime"
                  onClick={() => handleDashboardSelect('student', '/dashboard')}
                >
                  Learner Snapshot
                </button>
                
                <button 
                  className="dashboard-btn dashboard-btn-yellow"
                  onClick={() => handleDashboardSelect('parent', '/dashboard')}
                >
                  Guardian Overview
                </button>
                
                <button 
                  className="dashboard-btn dashboard-btn-orange"
                  onClick={() => handleDashboardSelect('accountant', '/dashboard')}
                >
                  Finance Cockpit
                </button>
                
                <button 
                  className="dashboard-btn dashboard-btn-red"
                  onClick={() => handleDashboardSelect('hr_manager', '/dashboard')}
                >
                  People Pulse
                </button>
                
                <button 
                  className="dashboard-btn dashboard-btn-pink"
                  onClick={() => handleDashboardSelect('librarian', '/dashboard')}
                >
                  Library Board
                </button>
                
                <button 
                  className="dashboard-btn dashboard-btn-purple"
                  onClick={() => handleDashboardSelect('transport_manager', '/dashboard')}
                >
                  Transport Map
                </button>
                
                <button 
                  className="dashboard-btn dashboard-btn-indigo"
                  onClick={() => handleDashboardSelect('hostel_warden', '/dashboard')}
                >
                  Hostel Control
                </button>
                
                <button 
                  className="dashboard-btn dashboard-btn-gray"
                  onClick={() => handleDashboardSelect('staff_member', '/staff')}
                >
                  Staff Hub
                </button>
              </div>
            </div>

            <div className="auth-social-row">
              <a href="javascript:void(0);" className="auth-social-btn" title="Facebook">
                <i className="ti ti-brand-facebook"></i>
              </a>
              <a href="javascript:void(0);" className="auth-social-btn" title="Google">
                <i className="ti ti-brand-google"></i>
              </a>
              <a href="javascript:void(0);" className="auth-social-btn" title="Apple">
                <i className="ti ti-brand-apple"></i>
              </a>
            </div>

            <div className="auth-switch">
              Don't have an account?{' '}
              <Link to="/register">Create Account</Link>
            </div>

          </div>
        </div>
        <AuthFooter />
      </div>
    </div>
  )
}

export default Login
