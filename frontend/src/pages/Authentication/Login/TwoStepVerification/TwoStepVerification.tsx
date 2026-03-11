import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthLeft from '../authleft/AuthLeft'
import AuthFooter from '../authfooter/AuthFooter'
import { apiClient } from '../../../../api/client'

const TwoStepVerification: React.FC = () => {
  const [method, setMethod] = useState<'sms' | 'app'>('sms')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [userPhone, setUserPhone] = useState<string>('')
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Get user info from location state (passed from login)
    const state = location.state as any
    if (state?.userId && state?.phone) {
      setUserPhone(state.phone)
    } else {
      // If no state, redirect to login
      toast.error('Please login first')
      navigate('/login')
    }
  }, [location, navigate])

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
      toast.error('Please enter a 6-digit code')
      return
    }

    setLoading(true)

    try {
      const state = location.state as any
      const userId = state?.userId

      if (!userId) {
        throw new Error('User ID not found')
      }

      // Verify 2FA code
      const response = await apiClient.post('/auth/verify-2fa', {
        userId,
        token: code,
        method: method === 'app' ? 'totp' : 'sms'
      })

      if (response.data.success) {
        toast.success('Verification successful!')
        
        // Store tokens if provided
        if (response.data.data?.accessToken) {
          localStorage.setItem('accessToken', response.data.data.accessToken)
          localStorage.setItem('refreshToken', response.data.data.refreshToken)
        }

        // Navigate to dashboard
        navigate('/dashboard')
      } else {
        throw new Error(response.data.message || 'Verification failed')
      }
    } catch (error: any) {
      console.error('2FA verification error:', error)
      toast.error(error.response?.data?.error?.message || error.message || 'Verification failed')
      
      // Clear OTP on error
      setOtp(['', '', '', '', '', ''])
      inputs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (method !== 'sms') return

    setResending(true)

    try {
      const state = location.state as any
      const userId = state?.userId

      if (!userId) {
        throw new Error('User ID not found')
      }

      // Resend SMS OTP
      const response = await apiClient.post('/auth/resend-2fa', {
        userId,
        method: 'sms'
      })

      if (response.data.success) {
        toast.success('Verification code resent!')
      } else {
        throw new Error(response.data.message || 'Failed to resend code')
      }
    } catch (error: any) {
      console.error('Resend error:', error)
      toast.error(error.response?.data?.error?.message || error.message || 'Failed to resend code')
    } finally {
      setResending(false)
    }
  }

  const isComplete = otp.join('').length === 6
  const maskedPhone = userPhone ? `••••${userPhone.slice(-2)}` : '••••'

  return (
    <div className="auth-root">
      <AuthLeft />

      <div className="auth-right">
        <div className="auth-right-scroll">
          <div className="auth-right-inner">

            <div className="auth-right-logo">
              <img src="/assets/img/Ultrakey_fav.png" alt="Ultrakey" />
            </div>

            <div className="auth-icon-circle">
              <i className="ti ti-shield-check"></i>
            </div>

            <h1>Two-Step Verification</h1>
            <p className="auth-subtitle">
              Your account is protected. Enter the verification code to continue.
            </p>

            {/* Method toggle */}
            <div style={{
              display: 'flex', gap: 8, marginBottom: 20,
              animation: 'fadeUp .5s ease both .45s'
            }}>
              <button
                type="button"
                onClick={() => { setMethod('sms'); setOtp(['','','','','','']) }}
                disabled={loading || resending}
                style={{
                  flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                  fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 13,
                  cursor: loading || resending ? 'not-allowed' : 'pointer', 
                  transition: 'all .2s',
                  background: method === 'sms' ? '#1A6FA8' : '#f1f5f9',
                  color: method === 'sms' ? '#fff' : '#64748b',
                  opacity: loading || resending ? 0.6 : 1
                }}
              >
                <i className="ti ti-device-mobile" style={{ marginRight: 6 }}></i>SMS Code
              </button>
              <button
                type="button"
                onClick={() => { setMethod('app'); setOtp(['','','','','','']) }}
                disabled={loading || resending}
                style={{
                  flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                  fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 13,
                  cursor: loading || resending ? 'not-allowed' : 'pointer', 
                  transition: 'all .2s',
                  background: method === 'app' ? '#1A6FA8' : '#f1f5f9',
                  color: method === 'app' ? '#fff' : '#64748b',
                  opacity: loading || resending ? 0.6 : 1
                }}
              >
                <i className="ti ti-shield" style={{ marginRight: 6 }}></i>Auth App
              </button>
            </div>

            <div className="auth-info-box" style={{ animationDelay: '.5s' }}>
              <i className="ti ti-info-circle"></i>
              {method === 'sms'
                ? `A 6-digit code was sent to your registered mobile number ending in ${maskedPhone}.`
                : 'Open your authenticator app and enter the 6-digit code shown for Ultrakey.'}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="auth-otp-row">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { inputs.current[i] = el }}
                    type="text" inputMode="numeric"
                    maxLength={1} value={digit}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="auth-otp-input"
                    disabled={loading}
                  />
                ))}
              </div>

              <button
                type="submit" className="auth-btn-primary"
                disabled={!isComplete || loading}
                style={{ 
                  opacity: (isComplete && !loading) ? 1 : 0.55, 
                  cursor: (isComplete && !loading) ? 'pointer' : 'not-allowed' 
                }}
              >
                {loading ? (
                  <>
                    <i className="ti ti-loader" style={{ marginRight: 8, animation: 'spin 1s linear infinite' }}></i>
                    VERIFYING...
                  </>
                ) : (
                  'VERIFY & CONTINUE'
                )}
              </button>
            </form>

            {method === 'sms' && (
              <div className="auth-resend">
                Didn't receive the code?{' '}
                <button 
                  onClick={handleResend}
                  disabled={resending || loading}
                  style={{ cursor: (resending || loading) ? 'not-allowed' : 'pointer' }}
                >
                  {resending ? 'Resending...' : 'Resend Code'}
                </button>
              </div>
            )}

            <div className="auth-switch">
              <Link to="/login">← Back to Sign In</Link>
            </div>

          </div>
        </div>
        <AuthFooter />
      </div>
    </div>
  )
}

export default TwoStepVerification
