import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import authService from '../../../api/authService'

const Illustration: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }

    setLoading(true)

    try {
      const response = await authService.login({ email, password })

      if (response) {
        toast.success('Login successful!')
        navigate('/dashboard')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="main-wrapper">
      <div className="container-fuild">
        <div className="login-wrapper w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
          <div className="row">
            <div className="col-lg-6">
              <div>
                <img 
                  src="/assets/img/authentication/authentication-06.svg" 
                  alt="Login Illustration" 
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
                <div className="col-md-8 mx-auto p-4">
                  <form onSubmit={handleSubmit}>
                    <div>
                      <div className="mx-auto mb-5 text-center">
                        <img 
                          src="/assets/img/authentication/authentication-logo.png"
                          className="img-fluid" 
                          alt="Logo"
                        />
                      </div>
                      <div className="card">
                        <div className="card-body p-4">
                          <div className="mb-4">
                            <h2 className="mb-2">Welcome</h2>
                            <p className="mb-0">Please enter your details to sign in</p>
                          </div>
                          <div className="mt-4">
                            <div className="d-flex align-items-center justify-content-center flex-wrap">
                              <div className="text-center me-2 flex-fill">
                                <a href="javascript:void(0);" className="bg-primary br-10 p-2 btn btn-primary d-flex align-items-center justify-content-center">
                                  <img 
                                    className="img-fluid m-1"
                                    src="/assets/img/icons/facebook-logo.png"
                                    alt="Facebook"
                                  />
                                </a>
                              </div>
                              <div className="text-center me-2 flex-fill">
                                <a href="javascript:void(0);" className="br-10 p-2 btn btn-outline-light d-flex align-items-center justify-content-center">
                                  <img 
                                    className="img-fluid m-1"
                                    src="/assets/img/icons/google-logo.png"
                                    alt="Google"
                                  />
                                </a>
                              </div>
                              <div className="text-center flex-fill">
                                <a href="javascript:void(0);" className="bg-dark br-10 p-2 btn btn-dark d-flex align-items-center justify-content-center">
                                  <img 
                                    className="img-fluid m-1"
                                    src="/assets/img/icons/apple-logo.png" 
                                    alt="Apple"
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="login-or">
                            <span className="span-or">Or</span>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <div className="input-icon mb-3 position-relative">
                              <span className="input-icon-addon">
                                <i className="ti ti-mail"></i>
                              </span>
                              <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control" 
                                placeholder="Enter your email"
                                disabled={loading}
                                required
                              />
                            </div>
                            <label className="form-label">Password</label>
                            <div className="pass-group position-relative">
                              <input 
                                type={showPassword ? "text" : "password"} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pass-input form-control" 
                                placeholder="Enter your password"
                                disabled={loading}
                                required
                              />
                              <span 
                                className={`ti toggle-password ${showPassword ? 'ti-eye' : 'ti-eye-off'}`}
                                onClick={togglePassword}
                                style={{ 
                                  position: 'absolute', 
                                  right: '10px', 
                                  top: '50%', 
                                  transform: 'translateY(-50%)',
                                  cursor: loading ? 'not-allowed' : 'pointer',
                                  opacity: loading ? 0.5 : 1
                                }}
                              ></span>
                            </div>
                          </div>
                          <div className="form-wrap form-wrap-checkbox mb-3">
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center">
                                <div className="form-check form-check-md mb-0">
                                  <input 
                                    className="form-check-input mt-0" 
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={loading}
                                  />
                                </div>
                                <p className="ms-1 mb-0">Remember Me</p>
                              </div>
                              <div className="text-end">
                                <Link to="/forgot-password-2" className="link-danger">Forgot Password?</Link>
                              </div>
                            </div>
                          </div>
                          <div className="mb-3">
                            <button 
                              type="submit" 
                              className="btn btn-primary w-100"
                              disabled={loading}
                              style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                            >
                              {loading ? (
                                <>
                                  <i className="ti ti-loader" style={{ marginRight: 8, animation: 'spin 1s linear infinite' }}></i>
                                  Signing In...
                                </>
                              ) : (
                                'Sign In'
                              )}
                            </button>
                          </div>
                          <div className="text-center">
                            <h6 className="fw-normal text-dark mb-0">
                              Don't have an account? 
                              <Link to="/register-2" className="hover-a ms-1">Create Account</Link>
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 text-center">
                        <p className="mb-0">Copyright &copy; 2026 - Ultrakey</p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Illustration
