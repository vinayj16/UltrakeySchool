import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthLeft from '../authleft/AuthLeft'
import AuthFooter from '../authfooter/AuthFooter'
import authService from '../../../../api/authService'

const LockScreen: React.FC = () => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lockedUser, setLockedUser] = useState<{ name: string; role: string; initials: string } | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get current user from auth service
    const user = authService.getCurrentUser()
    
    if (!user) {
      // If no user is logged in, redirect to login
      navigate('/login')
      return
    }

    // Set locked user info
    const nameParts = user.name.split(' ')
    const initials = nameParts.length >= 2 
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : user.name.substring(0, 2).toUpperCase()

    setLockedUser({
      name: user.name,
      role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
      initials
    })
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password) {
      toast.error('Please enter your password')
      return
    }

    if (!lockedUser) {
      toast.error('No user session found')
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      
      // Get user email from current user
      const user = authService.getCurrentUser()
      if (!user?.email) {
        throw new Error('User email not found')
      }

      // Attempt to login with the password to unlock
      const response = await authService.login({
        email: user.email,
        password
      })

      if (response) {
        toast.success('Session unlocked successfully')
        navigate('/dashboard')
      }
    } catch (error: any) {
      console.error('Unlock error:', error)
      toast.error(error.message || 'Invalid password')
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  const handleSignInDifferent = () => {
    // Clear tokens and redirect to login
    authService.clearTokens()
    navigate('/login')
  }

  if (!lockedUser) {
    return (
      <div className="auth-root">
        <AuthLeft />
        <div className="auth-right">
          <div className="auth-right-scroll">
            <div className="auth-right-inner">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
          <AuthFooter />
        </div>
      </div>
    )
  }

  return (
    <div className="auth-root">
      <AuthLeft />

      <div className="auth-right">
        <div className="auth-right-scroll">
          <div className="auth-right-inner">

            {/* Avatar */}
            <div className="auth-avatar">{lockedUser.initials}</div>

            <h1>{lockedUser.name}</h1>
            <p className="auth-subtitle">
              {lockedUser.role} · Session locked. Enter your password to continue.
            </p>

            <div className="auth-info-box" style={{ animationDelay: '.45s' }}>
              <i className="ti ti-lock"></i>
              Your session has been locked for security. Only you can unlock it.
            </div>

            <form onSubmit={handleSubmit}>
              <div className="auth-field" style={{ animationDelay: '.52s' }}>
                <i className="ti ti-lock auth-icon"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <span
                  className={`ti auth-eye ${showPassword ? 'ti-eye' : 'ti-eye-off'}`}
                  onClick={() => setShowPassword(!showPassword)} 
                />
              </div>

              <button 
                type="submit" 
                className="auth-btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    UNLOCKING...
                  </>
                ) : (
                  'UNLOCK SESSION'
                )}
              </button>
            </form>

            <button
              className="auth-btn-secondary"
              onClick={handleSignInDifferent}
              disabled={loading}
            >
              Sign in as different user
            </button>

            <div className="auth-switch">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

          </div>
        </div>
        <AuthFooter />
      </div>
    </div>
  )
}

export default LockScreen
