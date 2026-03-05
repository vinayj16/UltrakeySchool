import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  googleAuthEnabled: boolean;
  phoneNumber: string;
  phoneVerified: boolean;
  email: string;
  emailVerified: boolean;
}

const SecuritySettings: React.FC = () => {
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    googleAuthEnabled: false,
    phoneNumber: '',
    phoneVerified: false,
    email: '',
    emailVerified: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSecuritySettings();
  }, []);

  const fetchSecuritySettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/settings/security');
      
      if (response.data.success) {
        const data = response.data.data?.settings || {};
        setSettings({
          twoFactorEnabled: data.twoFactorEnabled ?? false,
          googleAuthEnabled: data.googleAuthEnabled ?? false,
          phoneNumber: data.phoneNumber || '',
          phoneVerified: data.phoneVerified ?? false,
          email: data.email || '',
          emailVerified: data.emailVerified ?? false
        });
      } else {
        setError(response.data.message || 'Failed to load security settings');
      }
    } catch (err: any) {
      console.error('Error fetching security settings:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load security settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTwoFactor = async (enabled: boolean) => {
    try {
      setUpdating(true);
      const response = await apiClient.put('/settings/security/two-factor', {
        enabled
      });
      
      if (response.data.success) {
        setSettings(prev => ({ ...prev, twoFactorEnabled: enabled }));
        toast.success(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`);
      } else {
        toast.error(response.data.message || 'Failed to update two-factor authentication');
      }
    } catch (err: any) {
      console.error('Error toggling two-factor:', err);
      toast.error(err.response?.data?.message || 'Failed to update two-factor authentication');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleGoogleAuth = async (enabled: boolean) => {
    try {
      setUpdating(true);
      const response = await apiClient.put('/settings/security/google-auth', {
        enabled
      });
      
      if (response.data.success) {
        setSettings(prev => ({ ...prev, googleAuthEnabled: enabled }));
        toast.success(`Google authentication ${enabled ? 'enabled' : 'disabled'}`);
      } else {
        toast.error(response.data.message || 'Failed to update Google authentication');
      }
    } catch (err: any) {
      console.error('Error toggling Google auth:', err);
      toast.error(err.response?.data?.message || 'Failed to update Google authentication');
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = () => {
    // Open change password modal or navigate to change password page
    toast.info('Change password functionality - to be implemented');
  };

  const handleManageDevices = () => {
    // Navigate to device management page
    toast.info('Device management - to be implemented');
  };

  const handleViewActivity = () => {
    // Navigate to account activity page
    toast.info('Account activity - to be implemented');
  };

  const handleDeactivateAccount = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? You can reactivate it by signing in again.')) {
      try {
        setUpdating(true);
        const response = await apiClient.post('/settings/security/deactivate');
        
        if (response.data.success) {
          toast.success('Account deactivated successfully');
          // Redirect to login page
          window.location.href = '/login';
        } else {
          toast.error(response.data.message || 'Failed to deactivate account');
        }
      } catch (err: any) {
        console.error('Error deactivating account:', err);
        toast.error(err.response?.data?.message || 'Failed to deactivate account');
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      try {
        setUpdating(true);
        const response = await apiClient.delete('/settings/security/delete');
        
        if (response.data.success) {
          toast.success('Account deleted successfully');
          // Redirect to login page
          window.location.href = '/login';
        } else {
          toast.error(response.data.message || 'Failed to delete account');
        }
      } catch (err: any) {
        console.error('Error deleting account:', err);
        toast.error(err.response?.data?.message || 'Failed to delete account');
      } finally {
        setUpdating(false);
      }
    }
  };

  return (
    <div className="content">
      <div className="d-md-flex d-block align-items-center justify-content-between border-bottom pb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">General Settings</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/">Dashboard</a>
              </li>
              <li className="breadcrumb-item">
                <a href="#!">Settings</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">General Settings</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div className="pe-1 mb-2">
            <button 
              className="btn btn-outline-light bg-white btn-icon" 
              data-bs-toggle="tooltip"
              data-bs-placement="top" 
              title="Refresh"
              onClick={fetchSecuritySettings}
              disabled={loading || updating}
            >
              <i className="ti ti-refresh"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xxl-2 col-xl-3">
          <div className="pt-3 d-flex flex-column list-group mb-4">
            <a href="/profile-settings" className="d-block rounded p-2">Profile Settings</a>
            <a href="/security-settings" className="d-block rounded active p-2">Security Settings</a>
            <a href="/notifications-settings" className="d-block rounded p-2">Notifications</a>
            <a href="/connected-apps" className="d-block rounded p-2">Connected Apps</a>
          </div>
        </div>
        <div className="col-xxl-10 col-xl-9">
          <div className="border-start ps-3 flex-fill">
            <div className="d-flex align-items-center justify-content-between flex-wrap border-bottom mb-3 pt-3">
              <div className="mb-3">
                <h5>Security Settings</h5>
                <p>Manage your account security and privacy</p>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger mb-3">
                <i className="ti ti-alert-circle me-2" />
                {error}
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-danger ms-3"
                  onClick={fetchSecuritySettings}
                >
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading security settings...</p>
              </div>
            ) : (
              <div className="d-block">
                <div className="d-flex justify-content-between align-items-center rounded flex-wrap bg-white border rounded p-3 pb-0 mb-3">
                  <div className="mb-3">
                    <h6>Password</h6>
                    <p>Set a unique password to protect the account</p>
                  </div>
                  <div className="mb-3">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={handleChangePassword}
                      disabled={updating}
                    >
                      Change Password
                    </button>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center rounded flex-wrap bg-white border rounded p-3 pb-0 mb-3">
                  <div className="mb-3">
                    <h6>Two Factor Authentication</h6>
                    <p>Receive codes via SMS or email every time you login</p>
                  </div>
                  <div className="mb-3">
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        id="twoFactor"
                        checked={settings.twoFactorEnabled}
                        onChange={(e) => handleToggleTwoFactor(e.target.checked)}
                        disabled={updating}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center rounded flex-wrap bg-white border rounded p-3 pb-0 mb-3">
                  <div className="mb-3">
                    <h6>Google Authentication</h6>
                    <p>Connect to Google for authentication</p>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    {settings.googleAuthEnabled && (
                      <span className="badge badge-soft-success me-3">
                        <i className="ti ti-circle-filled fs-5 me-1"></i>Connected
                      </span>
                    )}
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        id="googleAuth"
                        checked={settings.googleAuthEnabled}
                        onChange={(e) => handleToggleGoogleAuth(e.target.checked)}
                        disabled={updating}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center rounded flex-wrap bg-white border rounded p-3 pb-0 mb-3">
                  <div className="mb-3">
                    <h6>Phone Number Verification</h6>
                    <p>The phone number associated with the account</p>
                  </div>
                  <div className="d-flex align-items-center flex-wrap">
                    <p className="mb-3 me-3">{settings.phoneNumber || 'Not set'}</p>
                    {settings.phoneVerified && (
                      <span className="badge badge-soft-success me-3 mb-3">
                        <i className="ti ti-checks me-1"></i>Verified
                      </span>
                    )}
                    <button className="btn btn-light mb-3">
                      <i className="ti ti-edit me-2"></i>Edit
                    </button>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center rounded flex-wrap bg-white border rounded p-3 pb-0 mb-3">
                  <div className="mb-3">
                    <h6>Email Address</h6>
                    <p>The email address associated with the account</p>
                  </div>
                  <div className="d-flex align-items-center flex-wrap">
                    <p className="mb-3 me-3">
                      <a href={`mailto:${settings.email}`}>{settings.email || 'Not set'}</a>
                    </p>
                    {settings.emailVerified && (
                      <span className="badge badge-soft-success me-3 mb-3">
                        <i className="ti ti-checks me-1"></i>Verified
                      </span>
                    )}
                    <button className="btn btn-light mb-3">
                      <i className="ti ti-edit me-2"></i>Edit
                    </button>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center rounded flex-wrap bg-white border rounded p-3 pb-0 mb-3">
                  <div className="mb-3">
                    <h6>Device Management</h6>
                    <p>The devices associated with the account</p>
                  </div>
                  <div className="mb-3">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={handleManageDevices}
                      disabled={updating}
                    >
                      Manage
                    </button>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center rounded flex-wrap bg-white border rounded p-3 pb-0 mb-3">
                  <div className="mb-3">
                    <h6>Account Activity</h6>
                    <p>The activities of the account</p>
                  </div>
                  <div className="mb-3">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={handleViewActivity}
                      disabled={updating}
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center rounded flex-wrap bg-white border rounded p-3 pb-0 mb-3">
                  <div className="mb-3">
                    <h6>Deactivate Account</h6>
                    <p>This will shutdown your account. Your account will be reactivated when you sign in again</p>
                  </div>
                  <div className="mb-3">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={handleDeactivateAccount}
                      disabled={updating}
                    >
                      {updating ? 'Processing...' : 'Deactivate'}
                    </button>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center rounded flex-wrap bg-white border rounded p-3 pb-0 mb-3">
                  <div className="mb-3">
                    <h6>Delete Account</h6>
                    <p>Your account will be permanently deleted</p>
                  </div>
                  <div className="mb-3">
                    <button 
                      className="btn btn-outline-danger"
                      onClick={handleDeleteAccount}
                      disabled={updating}
                    >
                      {updating ? 'Processing...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
