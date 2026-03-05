import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../../../../api/client";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await apiClient.post("/auth/login", {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        const { token, user, refreshToken } = response.data.data;

        // Store authentication data
        localStorage.setItem("token", token);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        localStorage.setItem("user", JSON.stringify(user));
        
        // Store additional user context
        if (user.schoolId) {
          localStorage.setItem("schoolId", user.schoolId);
        }
        if (user.role) {
          localStorage.setItem("userRole", user.role);
        }

        toast.success("Login successful! Welcome back.");

        // Redirect based on user role
        const redirectPath = getRedirectPath(user.role);
        navigate(redirectPath);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (err.response?.status === 401) {
        setErrors({ password: "Invalid email or password" });
      } else if (err.response?.status === 429) {
        toast.error("Too many login attempts. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRedirectPath = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "superadmin":
      case "admin":
        return "/dashboard";
      case "teacher":
        return "/teacher-dashboard";
      case "student":
        return "/student-dashboard";
      case "parent":
      case "guardian":
        return "/parent-dashboard";
      default:
        return "/dashboard";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="account-page">
      <div className="main-wrapper">
        <div className="container-fluid">
          <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
            <div className="row">
              {/* LEFT SIDE */}
              <div className="col-lg-6 d-none d-lg-block">
                <div className="login-background position-relative d-lg-flex align-items-center justify-content-center vh-100 overflowy-auto">
                  <div>
                    <img
                      src="/assets/img/authentication/authentication-02.jpg"
                      alt="Auth"
                    />
                  </div>

                  <div className="authen-overlay-item w-100 p-4">
                    <h4 className="text-white mb-3">
                      What's New on ULTRAKEY !!!
                    </h4>

                    {[
                      {
                        title: "Summer Vacation Holiday Homework",
                        desc: "The school will remain closed from April 20th to June...",
                      },
                      {
                        title: "New Academic Session Admission Start (2024-25)",
                        desc: "An academic term is a portion of an academic year...",
                      },
                      {
                        title: "Date sheet Final Exam Nursery to Sr.Kg",
                        desc: "Dear Parents, As the final examination for the session...",
                      },
                      {
                        title: "Annual Day Function",
                        desc: "Annual functions provide a platform for students...",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center flex-row mb-3 justify-content-between p-3 br-5 gap-3 card"
                      >
                        <div>
                          <h6>{item.title}</h6>
                          <p className="mb-0 text-truncate">{item.desc}</p>
                        </div>
                        <a href="#">
                          <i className="ti ti-chevrons-right"></i>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="col-lg-6 col-md-12">
                <div className="row justify-content-center align-items-center vh-100 overflow-auto">
                  <div className="col-md-8 mx-auto p-4">
                    <form onSubmit={handleSubmit}>
                      <div className="text-center mb-5">
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
                            <p>Please enter your details to sign in</p>
                          </div>

                          {/* Social Login (UI Only) */}
                          <div className="d-flex justify-content-center mb-3">
                            <button 
                              type="button"
                              className="btn btn-primary me-2"
                              onClick={() => toast.info("Social login coming soon")}
                            >
                              Facebook
                            </button>
                            <button 
                              type="button"
                              className="btn btn-outline-light me-2"
                              onClick={() => toast.info("Social login coming soon")}
                            >
                              Google
                            </button>
                            <button 
                              type="button"
                              className="btn btn-dark"
                              onClick={() => toast.info("Social login coming soon")}
                            >
                              Apple
                            </button>
                          </div>

                          <div className="login-or">
                            <span className="span-or">Or</span>
                          </div>

                          {/* Email */}
                          <div className="mb-3">
                            <label className="form-label">Email Address</label>
                            <input
                              type="email"
                              name="email"
                              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                              placeholder="Enter email"
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled={loading}
                            />
                            {errors.email && (
                              <div className="invalid-feedback">{errors.email}</div>
                            )}
                          </div>

                          {/* Password */}
                          <div className="mb-3">
                            <label className="form-label">Password</label>
                            <div className="position-relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleInputChange}
                                disabled={loading}
                              />
                              <button
                                type="button"
                                className="btn btn-link position-absolute end-0 top-0"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ zIndex: 10 }}
                              >
                                <i className={`ti ti-eye${showPassword ? '-off' : ''}`}></i>
                              </button>
                            </div>
                            {errors.password && (
                              <div className="invalid-feedback d-block">{errors.password}</div>
                            )}
                          </div>

                          {/* Remember */}
                          <div className="d-flex justify-content-between mb-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="rememberMe"
                                id="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleInputChange}
                                disabled={loading}
                              />
                              <label className="form-check-label ms-1" htmlFor="rememberMe">
                                Remember Me
                              </label>
                            </div>
                            <Link to="/forgot-password" className="link-danger">
                              Forgot Password?
                            </Link>
                          </div>

                          <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Signing In...
                              </>
                            ) : (
                              "Sign In"
                            )}
                          </button>

                          <div className="text-center mt-3">
                            <p>
                              Don't have an account?{" "}
                              <Link to="/register" className="hover-a">
                                Create Account
                              </Link>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-center mt-5">
                        <p>© 2026 - Ultrakey</p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* END RIGHT */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
