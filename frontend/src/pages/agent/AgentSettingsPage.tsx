import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import userProfileService from '../../services/userProfileService';

interface AgentSettings {
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    commissionAlerts: boolean;
    newInstitutionAlerts: boolean;
    performanceReports: boolean;
  };
  privacy: {
    showProfileToPublic: boolean;
    showPerformanceStats: boolean;
    allowContactRequests: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
    theme: 'light' | 'dark' | 'auto';
  };
  security: {
    twoFactorAuth: boolean;
    emailVerification: boolean;
    sessionTimeout: number;
    lastPasswordChange: string;
  };
}

const DEFAULT_SETTINGS: AgentSettings = {
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    commissionAlerts: true,
    newInstitutionAlerts: true,
    performanceReports: false
  },
  privacy: {
    showProfileToPublic: false,
    showPerformanceStats: true,
    allowContactRequests: false
  },
  preferences: {
    language: 'English',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
    theme: 'light'
  },
  security: {
    twoFactorAuth: false,
    emailVerification: true,
    sessionTimeout: 30,
    lastPasswordChange: new Date().toISOString().split('T')[0]
  }
};

const AgentSettingsPage = () => {
  const [settings, setSettings] = useState<AgentSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'preferences' | 'security'>('notifications');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const profile = await userProfileService.getProfile();
      
      // Extract settings from profile preferences or use defaults
      const userSettings: AgentSettings = {
        notifications: {
          emailNotifications: (profile as any).preferences?.notifications?.emailNotifications ?? DEFAULT_SETTINGS.notifications.emailNotifications,
          smsNotifications: (profile as any).preferences?.notifications?.smsNotifications ?? DEFAULT_SETTINGS.notifications.smsNotifications,
          pushNotifications: (profile as any).preferences?.notifications?.pushNotifications ?? DEFAULT_SETTINGS.notifications.pushNotifications,
          commissionAlerts: (profile as any).preferences?.notifications?.commissionAlerts ?? DEFAULT_SETTINGS.notifications.commissionAlerts,
          newInstitutionAlerts: (profile as any).preferences?.notifications?.newInstitutionAlerts ?? DEFAULT_SETTINGS.notifications.newInstitutionAlerts,
          performanceReports: (profile as any).preferences?.notifications?.performanceReports ?? DEFAULT_SETTINGS.notifications.performanceReports
        },
        privacy: {
          showProfileToPublic: (profile as any).preferences?.privacy?.showProfileToPublic ?? DEFAULT_SETTINGS.privacy.showProfileToPublic,
          showPerformanceStats: (profile as any).preferences?.privacy?.showPerformanceStats ?? DEFAULT_SETTINGS.privacy.showPerformanceStats,
          allowContactRequests: (profile as any).preferences?.privacy?.allowContactRequests ?? DEFAULT_SETTINGS.privacy.allowContactRequests
        },
        preferences: {
          language: (profile as any).preferences?.language ?? DEFAULT_SETTINGS.preferences.language,
          timezone: (profile as any).preferences?.timezone ?? DEFAULT_SETTINGS.preferences.timezone,
          dateFormat: (profile as any).preferences?.dateFormat ?? DEFAULT_SETTINGS.preferences.dateFormat,
          currency: (profile as any).preferences?.currency ?? DEFAULT_SETTINGS.preferences.currency,
          theme: (profile as any).preferences?.theme ?? DEFAULT_SETTINGS.preferences.theme
        },
        security: {
          twoFactorAuth: (profile as any).preferences?.security?.twoFactorAuth ?? DEFAULT_SETTINGS.security.twoFactorAuth,
          emailVerification: (profile as any).preferences?.security?.emailVerification ?? DEFAULT_SETTINGS.security.emailVerification,
          sessionTimeout: (profile as any).preferences?.security?.sessionTimeout ?? DEFAULT_SETTINGS.security.sessionTimeout,
          lastPasswordChange: (profile as any).preferences?.security?.lastPasswordChange ?? profile.updatedAt?.split('T')[0] ?? DEFAULT_SETTINGS.security.lastPasswordChange
        }
      };

      setSettings(userSettings);
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
      // Use default settings on error
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (category: keyof AgentSettings, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [setting]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Save settings to user profile preferences
      await userProfileService.updateProfile({
        preferences: settings as any
      });
      
      toast.success('Settings saved successfully!');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings(DEFAULT_SETTINGS);
      toast.info('Settings reset to default values. Click Save to apply changes.');
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold">Settings</h4>
          <p className="text-muted mb-0">Manage your account settings and preferences</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-danger" onClick={handleReset}>
            <i className="ti ti-refresh me-2" />Reset to Default
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Saving...
              </>
            ) : (
              <>
                <i className="ti ti-check me-2" />Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <i className="ti ti-bell me-2" />Notifications
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'privacy' ? 'active' : ''}`}
                onClick={() => setActiveTab('privacy')}
              >
                <i className="ti ti-lock me-2" />Privacy
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                <i className="ti ti-settings me-2" />Preferences
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <i className="ti ti-shield me-2" />Security
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="tab-content">
              <h6 className="mb-4">Notification Preferences</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="emailNotifications"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="emailNotifications">
                      Email Notifications
                    </label>
                  </div>
                  <small className="text-muted d-block">Receive notifications via email</small>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="smsNotifications"
                      checked={settings.notifications.smsNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="smsNotifications">
                      SMS Notifications
                    </label>
                  </div>
                  <small className="text-muted d-block">Receive notifications via SMS</small>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="pushNotifications"
                      checked={settings.notifications.pushNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="pushNotifications">
                      Push Notifications
                    </label>
                  </div>
                  <small className="text-muted d-block">Receive browser push notifications</small>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="commissionAlerts"
                      checked={settings.notifications.commissionAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'commissionAlerts', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="commissionAlerts">
                      Commission Alerts
                    </label>
                  </div>
                  <small className="text-muted d-block">Get notified about new commissions</small>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="newInstitutionAlerts"
                      checked={settings.notifications.newInstitutionAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'newInstitutionAlerts', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="newInstitutionAlerts">
                      New Institution Alerts
                    </label>
                  </div>
                  <small className="text-muted d-block">Get notified when institutions are added</small>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="performanceReports"
                      checked={settings.notifications.performanceReports}
                      onChange={(e) => handleSettingChange('notifications', 'performanceReports', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="performanceReports">
                      Performance Reports
                    </label>
                  </div>
                  <small className="text-muted d-block">Receive monthly performance reports</small>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="tab-content">
              <h6 className="mb-4">Privacy Settings</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="showProfileToPublic"
                      checked={settings.privacy.showProfileToPublic}
                      onChange={(e) => handleSettingChange('privacy', 'showProfileToPublic', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="showProfileToPublic">
                      Show Profile to Public
                    </label>
                  </div>
                  <small className="text-muted d-block">Make your profile visible to everyone</small>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="showPerformanceStats"
                      checked={settings.privacy.showPerformanceStats}
                      onChange={(e) => handleSettingChange('privacy', 'showPerformanceStats', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="showPerformanceStats">
                      Show Performance Stats
                    </label>
                  </div>
                  <small className="text-muted d-block">Display your performance statistics</small>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="allowContactRequests"
                      checked={settings.privacy.allowContactRequests}
                      onChange={(e) => handleSettingChange('privacy', 'allowContactRequests', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="allowContactRequests">
                      Allow Contact Requests
                    </label>
                  </div>
                  <small className="text-muted d-block">Let others contact you</small>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="tab-content">
              <h6 className="mb-4">General Preferences</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Language</label>
                  <select
                    className="form-select"
                    value={settings.preferences.language}
                    onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Timezone</label>
                  <select
                    className="form-select"
                    value={settings.preferences.timezone}
                    onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                  >
                    <option value="Asia/Kolkata">India (IST)</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Date Format</label>
                  <select
                    className="form-select"
                    value={settings.preferences.dateFormat}
                    onChange={(e) => handleSettingChange('preferences', 'dateFormat', e.target.value)}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Currency</label>
                  <select
                    className="form-select"
                    value={settings.preferences.currency}
                    onChange={(e) => handleSettingChange('preferences', 'currency', e.target.value)}
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Theme</label>
                  <select
                    className="form-select"
                    value={settings.preferences.theme}
                    onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="tab-content">
              <h6 className="mb-4">Security Settings</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="twoFactorAuth"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="twoFactorAuth">
                      Two-Factor Authentication
                    </label>
                  </div>
                  <small className="text-muted d-block">Add an extra layer of security</small>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="emailVerification"
                      checked={settings.security.emailVerification}
                      onChange={(e) => handleSettingChange('security', 'emailVerification', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="emailVerification">
                      Email Verification
                    </label>
                  </div>
                  <small className="text-muted d-block">Verify email for sensitive actions</small>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value) || 30)}
                    min="5"
                    max="120"
                  />
                  <small className="text-muted d-block">Auto-logout after inactivity</small>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Last Password Change</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.security.lastPasswordChange}
                    disabled
                  />
                  <small className="text-muted d-block">Last time you changed your password</small>
                </div>
                <div className="col-12 mt-3">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => toast.info('Password change feature coming soon')}
                  >
                    <i className="ti ti-key me-2" />Change Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentSettingsPage;
