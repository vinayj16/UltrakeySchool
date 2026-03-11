import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';

interface OtpSettings {
  otpType: 'SMS' | 'Email' | 'Both';
  otpDigitLimit: number;
  otpExpireTime: number; // in minutes
  enableForLogin: boolean;
  enableForRegistration: boolean;
  enableForPasswordReset: boolean;
  enableForTransactions: boolean;
}

const OtpSettingsPage = () => {
  const [settings, setSettings] = useState<OtpSettings>({
    otpType: 'SMS',
    otpDigitLimit: 6,
    otpExpireTime: 5,
    enableForLogin: true,
    enableForRegistration: true,
    enableForPasswordReset: true,
    enableForTransactions: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOtpSettings();
  }, []);

  const fetchOtpSettings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/settings/otp');

      if (response.data.success) {
        const data = response.data.data;
        setSettings({
          otpType: data.otpType || 'SMS',
          otpDigitLimit: data.otpDigitLimit || 6,
          otpExpireTime: data.otpExpireTime || 5,
          enableForLogin: data.enableForLogin !== false,
          enableForRegistration: data.enableForRegistration !== false,
          enableForPasswordReset: data.enableForPasswordReset !== false,
          enableForTransactions: data.enableForTransactions || false
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch OTP settings:', error);
      toast.error('Failed to load OTP settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await apiClient.put('/settings/otp', settings);

      if (response.data.success) {
        toast.success('OTP settings saved successfully');
      } else {
        toast.error('Failed to save OTP settings');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save OTP settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof OtpSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="content bg-white">
      <div className="d-md-flex d-block align-items-center justify-content-between border-bottom pb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">System Settings</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/settings">Settings</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                OTP Settings
              </li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div className="pe-1 mb-2">
            <button 
              className="btn btn-outline-light bg-white btn-icon"
              onClick={fetchOtpSettings}
              title="Refresh"
            >
              <i className="ti ti-refresh"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xxl-2 col-xl-3">
          <div className="pt-3 d-flex flex-column list-group mb-4">
            <Link to="/settings/email" className="d-block rounded p-2">
              Email Settings
            </Link>
            <Link to="/settings/email-templates" className="d-block rounded p-2">
              Email Templates
            </Link>
            <Link to="/settings/sms" className="d-block rounded p-2">
              SMS Settings
            </Link>
            <Link to="/settings/otp" className="d-block rounded active p-2">
              OTP
            </Link>
            <Link to="/settings/gdpr" className="d-block rounded p-2">
              GDPR Cookies
            </Link>
          </div>
        </div>
        <div className="col-xxl-10 col-xl-9">
          <div className="flex-fill border-start ps-3">
            <form onSubmit={handleSubmit}>
              <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom pt-3 mb-3">
                <div className="mb-3">
                  <h5 className="mb-1">OTP Configuration</h5>
                  <p className="mb-0">Configure One-Time Password settings for authentication</p>
                </div>
                <div className="mb-3">
                  <button 
                    className="btn btn-light me-2" 
                    type="button"
                    onClick={() => fetchOtpSettings()}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary" 
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
              <div className="d-md-flex">
                <div className="row flex-fill">
                  <div className="col-xl-10">
                    <div className="d-block">
                      {/* OTP Type */}
                      <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                        <div className="row align-items-center flex-fill">
                          <div className="col-xxl-8 col-lg-6">
                            <div className="mb-3">
                              <h6>OTP Type</h6>
                              <p className="mb-0">Select the delivery method for OTP</p>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-lg-6">
                            <div className="mb-3">
                              <select 
                                className="form-select"
                                value={settings.otpType}
                                onChange={(e) => handleChange('otpType', e.target.value as 'SMS' | 'Email' | 'Both')}
                              >
                                <option value="SMS">SMS</option>
                                <option value="Email">Email</option>
                                <option value="Both">Both (SMS & Email)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* OTP Digit Limit */}
                      <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                        <div className="row align-items-center flex-fill">
                          <div className="col-xxl-8 col-lg-6">
                            <div className="mb-3">
                              <h6>OTP Digit Limit</h6>
                              <p className="mb-0">Number of digits in the OTP code</p>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-lg-6">
                            <div className="mb-3">
                              <select 
                                className="form-select"
                                value={settings.otpDigitLimit}
                                onChange={(e) => handleChange('otpDigitLimit', parseInt(e.target.value))}
                              >
                                <option value="4">4 Digits</option>
                                <option value="5">5 Digits</option>
                                <option value="6">6 Digits</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* OTP Expire Time */}
                      <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                        <div className="row align-items-center flex-fill">
                          <div className="col-xxl-8 col-lg-6">
                            <div className="mb-3">
                              <h6>OTP Expiration Time</h6>
                              <p className="mb-0">How long the OTP remains valid</p>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-lg-6">
                            <div className="mb-3">
                              <select 
                                className="form-select"
                                value={settings.otpExpireTime}
                                onChange={(e) => handleChange('otpExpireTime', parseInt(e.target.value))}
                              >
                                <option value="2">2 Minutes</option>
                                <option value="5">5 Minutes</option>
                                <option value="10">10 Minutes</option>
                                <option value="15">15 Minutes</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enable OTP for Login */}
                      <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                        <div className="row align-items-center flex-fill">
                          <div className="col-xxl-8 col-lg-6">
                            <div className="mb-3">
                              <h6>Enable OTP for Login</h6>
                              <p className="mb-0">Require OTP verification during login</p>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-lg-6">
                            <div className="mb-3">
                              <div className="status-toggle">
                                <input 
                                  type="checkbox" 
                                  id="enableForLogin"
                                  className="check"
                                  checked={settings.enableForLogin}
                                  onChange={(e) => handleChange('enableForLogin', e.target.checked)}
                                />
                                <label htmlFor="enableForLogin" className="checktoggle"></label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enable OTP for Registration */}
                      <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                        <div className="row align-items-center flex-fill">
                          <div className="col-xxl-8 col-lg-6">
                            <div className="mb-3">
                              <h6>Enable OTP for Registration</h6>
                              <p className="mb-0">Require OTP verification during registration</p>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-lg-6">
                            <div className="mb-3">
                              <div className="status-toggle">
                                <input 
                                  type="checkbox" 
                                  id="enableForRegistration"
                                  className="check"
                                  checked={settings.enableForRegistration}
                                  onChange={(e) => handleChange('enableForRegistration', e.target.checked)}
                                />
                                <label htmlFor="enableForRegistration" className="checktoggle"></label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enable OTP for Password Reset */}
                      <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                        <div className="row align-items-center flex-fill">
                          <div className="col-xxl-8 col-lg-6">
                            <div className="mb-3">
                              <h6>Enable OTP for Password Reset</h6>
                              <p className="mb-0">Require OTP verification for password reset</p>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-lg-6">
                            <div className="mb-3">
                              <div className="status-toggle">
                                <input 
                                  type="checkbox" 
                                  id="enableForPasswordReset"
                                  className="check"
                                  checked={settings.enableForPasswordReset}
                                  onChange={(e) => handleChange('enableForPasswordReset', e.target.checked)}
                                />
                                <label htmlFor="enableForPasswordReset" className="checktoggle"></label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enable OTP for Transactions */}
                      <div className="d-flex align-items-center justify-content-between flex-wrap border mb-3 p-3 pb-0 rounded">
                        <div className="row align-items-center flex-fill">
                          <div className="col-xxl-8 col-lg-6">
                            <div className="mb-3">
                              <h6>Enable OTP for Transactions</h6>
                              <p className="mb-0">Require OTP verification for financial transactions</p>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-lg-6">
                            <div className="mb-3">
                              <div className="status-toggle">
                                <input 
                                  type="checkbox" 
                                  id="enableForTransactions"
                                  className="check"
                                  checked={settings.enableForTransactions}
                                  onChange={(e) => handleChange('enableForTransactions', e.target.checked)}
                                />
                                <label htmlFor="enableForTransactions" className="checktoggle"></label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpSettingsPage;
