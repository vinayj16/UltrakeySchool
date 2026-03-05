import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../api/client';
import DashboardAccessGrid from './Authentication/Login/DashboardAccessGrid';
import { useAuth } from '../store/authStore';
import { getRoleBasedDashboard } from '../utils/permissions';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await apiClient.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;

        // Store token in localStorage
        localStorage.setItem('authToken', token);
        
        // Update auth store with user data
        // The auth store will handle persisting the user data
        const authStoreData = {
          user,
          isAuthenticated: true
        };
        localStorage.setItem('auth-storage', JSON.stringify({ state: authStoreData }));

        toast.success('Login successful! Welcome back.');
        
        console.log('[LoginPage] User logged in:', user);
        console.log('[LoginPage] User role:', user.role);
        
        // Get role-based dashboard path
        const dashboardPath = getRoleBasedDashboard(user.role);
        console.log('[LoginPage] Redirecting to:', dashboardPath);
        
        // Redirect to role-specific dashboard
        navigate(dashboardPath, { replace: true });
        
        // Force page reload to ensure auth store is updated
        window.location.href = dashboardPath;
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Invalid email or password';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper">
          <div className="login-content">
            <div className="login-userset">
              <div className="login-logo logo-normal">
                <img src="/assets/img/logo.svg" alt="Logo" />
              </div>
              <Link to="/" className="login-logo logo-white">
                <img src="/assets/img/logo-white.svg" alt="Logo" />
              </Link>
              
              <div className="login-userheading">
                <h3>Sign In</h3>
                <h4>Access your account to continue</h4>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-login">
                  <label className="form-label">Email Address</label>
                  <div className="form-addons">
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span className="form-addon-icon">
                      <i className="ti ti-mail" />
                    </span>
                  </div>
                  {errors.email && (
                    <div className="invalid-feedback d-block">{errors.email}</div>
                  )}
                </div>

                <div className="form-login">
                  <label className="form-label">Password</label>
                  <div className="pass-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className={`pass-input form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span 
                      className="ti toggle-password ti-eye-off"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback d-block">{errors.password}</div>
                  )}
                </div>

                <div className="form-login authentication-check">
                  <div className="row">
                    <div className="col-6">
                      <div className="custom-control custom-checkbox">
                        <label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
                          <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            disabled={loading}
                          />
                          <span className="checkmarks" />
                          Remember Me
                        </label>
                      </div>
                    </div>
                    <div className="col-6 text-end">
                      <Link className="forgot-link" to="/forgot-password">
                        Forgot Password?
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="form-login">
                  <button 
                    type="submit" 
                    className="btn btn-login"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </div>
              </form>

              <div className="signinform">
                <h4>
                  Don't have an account?{' '}
                  <Link to="/register" className="hover-a">
                    Sign Up
                  </Link>
                </h4>
              </div>

              <div className="form-setlogin or-text">
                <h4>OR</h4>
              </div>

              <div className="form-sociallink">
                <ul className="d-flex">
                  <li>
                    <a href="#" className="facebook-logo">
                      <img src="/assets/img/icons/facebook-logo.svg" alt="Facebook" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src="/assets/img/icons/google.png" alt="Google" />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="apple-logo">
                      <img src="/assets/img/icons/apple-logo.svg" alt="Apple" />
                    </a>
                  </li>
                </ul>
              </div>

              {/* Demo Credentials */}
              <div className="alert alert-info mt-4" role="alert">
                <h6 className="alert-heading">
                  <i className="ti ti-info-circle me-2"></i>
                  Demo Credentials
                </h6>
                <p className="mb-1">
                  <strong>Email:</strong> admin@example.com
                </p>
                <p className="mb-0">
                  <strong>Password:</strong> password123
                </p>
              </div>

              <section className="dashboard-access-section mt-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
                  <div>
                    <h4 className="mb-1">Preview every dashboard without logging in</h4>
                    <p className="text-muted mb-0">Each card describes the KPI mix, the permissions it unlocks, and the next place to click once the session is seeded.</p>
                  </div>
                  <span className="badge bg-soft-primary text-uppercase">Preview mode</span>
                </div>
                <DashboardAccessGrid />
              </section>
            </div>
          </div>

          <div className="login-img">
            <img src="/assets/img/authentication/login-bg.jpg" alt="Login Background" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
