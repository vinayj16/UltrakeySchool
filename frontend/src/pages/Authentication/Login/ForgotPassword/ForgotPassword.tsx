import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthLeft from '../authleft/AuthLeft'
import AuthFooter from '../authfooter/AuthFooter'
import authService from '../../../../api/authService'

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    try {
      setLoading(true)
      const response = await authService.forgotPassword(email)
      
      if (response.success) {
        setSent(true)
        toast.success(response.message || 'Password reset link sent to your email')
      } else {
        toast.error(response.message || 'Failed to send reset link')
      }
    } catch (error: any) {
      console.error('Forgot password error:', error)
      toast.error(error.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      setLoading(true)
      const response = await authService.forgotPassword(email)
      
      if (response.success) {
        toast.success('Password reset link resent to your email')
      } else {
        toast.error(response.message || 'Failed to resend reset link')
      }
    } catch (error: any) {
      console.error('Resend error:', error)
      toast.error(error.message || 'Failed to resend reset link')
    } finally {
      setLoading(false)
    }
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

            <h1>Forgot Password?</h1>
            <p className="auth-subtitle">
              {sent
                ? 'Check your inbox for the reset link'
                : "No worries! Enter your email and we'll send you a reset link"}
            </p>

            {sent ? (
              <>
                <div className="auth-info-box">
                  <i className="ti ti-circle-check"></i>
                  A password reset link has been sent to <strong>{email}</strong>.
                  Please check your inbox and spam folder.
                </div>
                <button
                  className="auth-btn-primary"
                  onClick={handleResend}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      SENDING...
                    </>
                  ) : (
                    'RESEND EMAIL'
                  )}
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="auth-field" style={{ animationDelay: '.5s' }}>
                  <i className="ti ti-mail auth-icon"></i>
                  <input
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                    disabled={loading}
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
                      SENDING...
                    </>
                  ) : (
                    'SEND RESET LINK'
                  )}
                </button>
              </form>
            )}

            <div className="auth-switch">
              Remember your password?{' '}
              <Link to="/login">Back to Login</Link>
            </div>

          </div>
        </div>
        <AuthFooter />
      </div>
    </div>
  )
}

export default ForgotPassword
