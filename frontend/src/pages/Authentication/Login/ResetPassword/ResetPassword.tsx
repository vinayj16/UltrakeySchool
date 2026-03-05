import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthLeft from '../authleft/AuthLeft'
import AuthFooter from '../authfooter/AuthFooter'
import authService from '../../../../api/authService'

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    // Verify the reset token on mount
    if (!token) {
      toast.error('Invalid or missing reset token')
      setVerifying(false)
      return
    }

    verifyToken()
  }, [token])

  const verifyToken = async () => {
    try {
      setVerifying(true)
      const response = await authService.verifyResetToken(token!)
      
      if (response.success) {
        setTokenValid(true)
      } else {
        toast.error(response.message || 'Invalid or expired reset token')
        setTokenValid(false)
      }
    } catch (error: any) {
      console.error('Token verification error:', error)
      toast.error(error.message || 'Invalid or expired reset token')
      setTokenValid(false)
    } finally {
      setVerifying(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      toast.error('Invalid reset token')
      return
    }

    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    // Validate password strength
    const validation = authService.validatePassword(password)
    if (!validation.valid) {
      toast.error(validation.errors[0])
      return
    }

    try {
      setLoading(true)
      
      const response = await authService.resetPassword(token, password)
      
      if (response.success) {
        toast.success('Password reset successfully! Redirecting to login...')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        toast.error(response.message || 'Password reset failed')
      }
    } catch (error: any) {
      console.error('Reset password error:', error)
      toast.error(error.message || 'Password reset failed')
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="auth-root">
        <AuthLeft />
        <div className="auth-right">
          <div className="auth-right-scroll">
            <div className="auth-right-inner">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Verifying...</span>
                </div>
                <p className="mt-3">Verifying reset token...</p>
              </div>
            </div>
          </div>
          <AuthFooter />
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="auth-root">
        <AuthLeft />
        <div className="auth-right">
          <div className="auth-right-scroll">
            <div className="auth-right-inner">
              <div className="auth-right-logo">
                <img src="/assets/img/Ultrakey_fav.png" alt="Ultrakey" />
              </div>
              
              <h1>Invalid Reset Link</h1>
              <p className="auth-subtitle">
                This password reset link is invalid or has expired.
              </p>

              <div className="auth-info-box" style={{ background: '#fee2e2', color: '#991b1b' }}>
                <i className="ti ti-alert-circle"></i>
                Please request a new password reset link.
              </div>

              <Link to="/forgot-password" className="auth-btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                REQUEST NEW LINK
              </Link>

              <div className="auth-switch">
                <Link to="/login">← Back to Login</Link>
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

            <div className="auth-right-logo">
              <img src="/assets/img/Ultrakey_fav.png" alt="Ultrakey" />
            </div>

            <h1>Reset Password</h1>
            <p className="auth-subtitle">
              Enter your new password below. Make sure it's strong and memorable.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="auth-field has-label" style={{ animationDelay: '.5s' }}>
                <label>New Password</label>
                <i className="ti ti-lock auth-icon"></i>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required 
                  minLength={8}
                  disabled={loading}
                />
                <span
                  className={`ti auth-eye ${showPass ? 'ti-eye' : 'ti-eye-off'}`}
                  onClick={() => setShowPass(!showPass)} 
                />
              </div>

              <div className="auth-field has-label" style={{ animationDelay: '.58s' }}>
                <label>Confirm Password</label>
                <i className="ti ti-lock-check auth-icon"></i>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Confirm new password"
                  required 
                  minLength={8}
                  disabled={loading}
                />
                <span
                  className={`ti auth-eye ${showConfirm ? 'ti-eye' : 'ti-eye-off'}`}
                  onClick={() => setShowConfirm(!showConfirm)} 
                />
              </div>

              {/* password match indicator */}
              {confirm.length > 0 && (
                <p style={{
                  fontSize: 12, marginBottom: 14, marginTop: -8,
                  color: password === confirm ? '#16a34a' : '#ef4444',
                  animation: 'fadeUp .3s ease both'
                }}>
                  <i className={`ti ${password === confirm ? 'ti-circle-check' : 'ti-circle-x'}`}
                    style={{ marginRight: 4 }}></i>
                  {password === confirm ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}

              <button 
                type="submit" 
                className="auth-btn-primary"
                disabled={loading || password !== confirm}
                style={{ 
                  opacity: loading || password !== confirm ? 0.55 : 1,
                  cursor: loading || password !== confirm ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    RESETTING...
                  </>
                ) : (
                  'RESET PASSWORD'
                )}
              </button>
            </form>

            <div className="auth-switch">
              <Link to="/login">← Back to Login</Link>
            </div>

          </div>
        </div>
        <AuthFooter />
      </div>
    </div>
  )
}

export default ResetPassword
