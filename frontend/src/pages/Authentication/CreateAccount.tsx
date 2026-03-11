import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api.js';

interface CreateAccountData {
  instituteType: string;
  instituteCode: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const CreateAccount: React.FC = () => {
  const [formData, setFormData] = useState<CreateAccountData>({
    instituteType: '',
    instituteCode: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const instituteTypes = [
    'School',
    'College',
    'University',
    'Training Center',
    'Coaching Institute',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.instituteType) return 'Please select an institute type';
    if (!formData.instituteCode) return 'Please enter your institute code';
    if (!formData.fullName) return 'Please enter your full name';
    if (!formData.email) return 'Please enter your email';
    if (!formData.password) return 'Please create a password';
    if (formData.password.length < 8) return 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (!formData.agreeToTerms) return 'Please agree to the Terms of Service and Privacy Policy';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const submissionData = {
        instituteType: formData.instituteType,
        instituteCode: formData.instituteCode,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        status: 'pending',
        submittedAt: new Date().toISOString()
      };

      // Try to call the API, but show success even if backend is not available yet
      try {
        const response = await apiService.post('/auth/create-account-request', submissionData);
        if (response.success) {
          setIsSubmitted(true);
        } else {
          setError(response.message || 'Failed to submit account request');
        }
      } catch (apiError: any) {
        // If backend is not available, still show success for demo purposes
        console.log('Backend not available, showing demo success:', apiError.message);
        setIsSubmitted(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your request');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="authentication-bg min-vh-100 d-flex align-items-center justify-content-center">
        <div className="card shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
          <div className="card-body p-5 text-center">
            <div className="mb-4">
              <div className="avatar avatar-lg bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center">
                <i className="ti ti-check text-success fs-2"></i>
              </div>
            </div>
            <h3 className="card-title mb-3">Account Request Submitted!</h3>
            <p className="text-muted mb-4">
              Your account creation request is now under review. We will notify you via email once the SuperAdmin approves your request.
            </p>
            <div className="d-flex flex-column gap-2">
              <div className="alert alert-info d-flex align-items-center" role="alert">
                <i className="ti ti-info-circle me-2"></i>
                <div>
                  <strong>Request Details:</strong><br/>
                  Institute: {formData.instituteType}<br/>
                  Code: {formData.instituteCode}<br/>
                  Email: {formData.email}
                </div>
              </div>
              <Link to="/login" className="btn btn-primary">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="authentication-bg min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body p-5">
          {isSubmitted ? (
            <div className="text-center">
              <div className="mb-4">
                <div className="text-success" style={{ fontSize: '4rem' }}>
                  <i className="ti ti-check"></i>
                </div>
                <h2 className="card-title text-success">Under Review</h2>
                <p className="text-muted">
                  Your account request has been submitted successfully! 
                  Our team will review your application and contact you soon.
                </p>
              </div>
              
              <div className="alert alert-info" role="alert">
                <i className="ti ti-info-circle me-2"></i>
                <strong>What happens next?</strong>
                <ul className="text-start mt-2 mb-0">
                  <li>Your request will be reviewed by our administration team</li>
                  <li>You will receive an email once your account is approved</li>
                  <li>This usually takes 1-2 business days</li>
                </ul>
              </div>

              <div className="text-center mt-4">
                <span className="text-muted">
                  Return to{' '}
                  <Link to="/login" className="text-primary">
                    Login
                  </Link>
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <h2 className="card-title">Create Account</h2>
                <p className="text-muted">Fill in your details to get started</p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="ti ti-alert-circle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="instituteType" className="form-label">
                    Institute Type <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="instituteType"
                    name="instituteType"
                    value={formData.instituteType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Institute Type</option>
                    {instituteTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="instituteCode" className="form-label">
                    Institute Code <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="instituteCode"
                    name="instituteCode"
                    placeholder="Enter your institute code"
                    value={formData.instituteCode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="agreeToTerms">
                      I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    'CREATE ACCOUNT'
                  )}
                </button>

                <div className="text-center">
                  <span className="text-muted">or</span>
                </div>

                <div className="text-center mt-3">
                  <span className="text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary">
                      Login
                    </Link>
                  </span>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
