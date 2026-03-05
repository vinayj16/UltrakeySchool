import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthLeft from '../authleft/AuthLeft'
import AuthFooter from '../authfooter/AuthFooter'
import { apiClient } from '../../../../api/client'

const EmailVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    // If token is provided in URL, verify it automatically
    if (token) {
      verifyEmailWithToken(token)
    }
  }, [token])

  const verifyEmailWithToken = async (verificationToken: string) => {
    try {
      setLoading(true)
      const response = await apiClient.post('/auth/verify-email', { token: verificationToken })
      
      if (response.data.success) {
        toast.success('Email verified successfully!')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        toast.error(response.data.message || 'Email verification failed')
      }
    } catch (error: any) {
      console.error('Email verification error:', error)
      toast.error(error.response?.data?.error?.message || 'Email verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) inputs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      inputs.current[index - 1]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit code')
      return
    }

    try {
      setLoading(true)
      // Use the OTP code as the verification token
      await verifyEmailWithToken(code)
    } catch (error: any) {
      console.error('Email verification error:', error)
      toast.error(error.message || 'Email verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      setResending(true)
      // This would typically call a resend verification email endpoint
      const response = await apiClient.post('/auth/resend-verification')
      
      if (response.data.success) {
        toast.success('Verification code sent to your email')
        setOtp(['', '', '', '', '', ''])
        inputs.current[0]?.focus()
      } else {
        toast.error(response.data.message || 'Failed to resend code')
      }
    } catch (error: any) {
      console.error('Resend code error:', error)
      toast.error(error.response?.data?.error?.message || 'Failed to resend code')
    } finally {
      setResending(false)
    }
  }

  if (loading && token) {
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
                <p className="mt-3">Verifying your email...</p>
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

            <h1>Verify Your Email</h1>
            <p className="auth-subtitle">
              We sent a 6-digit code to your email address. Enter it below to verify.
            </p>

            <div className="auth-info-box">
              <i className="ti ti-info-circle"></i>
              Didn't receive the email? Check your spam folder or request a new code.
            </div>

            <form onSubmit={handleSubmit}>
              <div className="auth-otp-row">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { inputs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="auth-otp-input"
                    disabled={loading}
                  />
                ))}
              </div>

              <button 
                type="submit" 
                className="auth-btn-primary"
                disabled={otp.join('').length < 6 || loading}
                style={{ 
                  opacity: otp.join('').length === 6 && !loading ? 1 : 0.55,
                  cursor: otp.join('').length === 6 && !loading ? 'pointer' : 'not-allowed' 
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    VERIFYING...
                  </>
                ) : (
                  'VERIFY EMAIL'
                )}
              </button>
            </form>

            <div className="auth-resend">
              Didn't receive the code?{' '}
              <button 
                onClick={handleResendCode}
                disabled={resending}
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>

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

export default EmailVerification
