import express from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import settingsController from '../controllers/settingsController.js';
import EmailSettings from '../models/EmailSettings.js';
import Settings from '../models/Settings.js';
import ConnectedApp from '../models/ConnectedApp.js';

const router = express.Router();

// Public route for launch date (no authentication required)
router.get('/launch-date', settingsController.getLaunchDate);

// Email Templates Routes - All data from database
router.get('/email-templates', authenticate, async (req, res) => {
  try {
    const templates = await EmailSettings.find({ tenantId: req.tenantId });
    res.json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch email templates', error: error.message });
  }
});

router.post('/email-templates', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const newTemplate = new EmailSettings({
      ...req.body,
      tenantId: req.tenantId,
      status: 'Active'
    });
    await newTemplate.save();
    res.status(201).json({ success: true, data: newTemplate });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create email template', error: error.message });
  }
});

router.put('/email-templates/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const template = await EmailSettings.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update email template', error: error.message });
  }
});

router.delete('/email-templates/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const template = await EmailSettings.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.tenantId
    });
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, message: 'Template deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete email template', error: error.message });
  }
});

// OTP Settings - All data from database
router.get('/otp', authenticate, async (req, res) => {
  try {
    const settings = await Settings.findOne({ tenantId: req.tenantId, type: 'otp' });
    if (!settings) {
      return res.json({
        success: true,
        data: {
          otpType: 'SMS',
          otpDigitLimit: '6',
          otpExpireTime: '5 mins'
        }
      });
    }
    res.json({ success: true, data: settings.data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch OTP settings', error: error.message });
  }
});

router.put('/otp', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { tenantId: req.tenantId, type: 'otp' },
      { data: req.body, updatedAt: new Date() },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: settings.data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update OTP settings', error: error.message });
  }
});

// Connected Apps Routes - All data from database
router.get('/connected-apps', authenticate, async (req, res) => {
  try {
    const apps = await ConnectedApp.find({ 
      $or: [
        { tenantId: req.tenantId },
        { isGlobal: true }
      ]
    }).sort({ name: 1 });
    
    res.json({ 
      success: true, 
      data: { apps } 
    });
  } catch (error) {
    console.error('Error fetching connected apps:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch connected apps', 
      error: error.message 
    });
  }
});

router.post('/connected-apps/:appId/connect', authenticate, async (req, res) => {
  try {
    const { appId } = req.params;
    const { credentials } = req.body;
    
    const app = await ConnectedApp.findOne({ 
      _id: appId,
      $or: [
        { tenantId: req.tenantId },
        { isGlobal: true }
      ]
    });
    
    if (!app) {
      return res.status(404).json({ 
        success: false, 
        message: 'App not found' 
      });
    }
    
    app.isConnected = true;
    app.connectedAt = new Date();
    app.connectedBy = req.user.id;
    if (credentials) {
      app.credentials = credentials;
    }
    
    await app.save();
    
    res.json({ 
      success: true, 
      message: 'App connected successfully',
      data: { app } 
    });
  } catch (error) {
    console.error('Error connecting app:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to connect app', 
      error: error.message 
    });
  }
});

router.post('/connected-apps/:appId/disconnect', authenticate, async (req, res) => {
  try {
    const { appId } = req.params;
    
    const app = await ConnectedApp.findOne({ 
      _id: appId,
      tenantId: req.tenantId
    });
    
    if (!app) {
      return res.status(404).json({ 
        success: false, 
        message: 'App not found' 
      });
    }
    
    app.isConnected = false;
    app.connectedAt = null;
    app.connectedBy = null;
    app.credentials = null;
    
    await app.save();
    
    res.json({ 
      success: true, 
      message: 'App disconnected successfully',
      data: { app } 
    });
  } catch (error) {
    console.error('Error disconnecting app:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to disconnect app', 
      error: error.message 
    });
  }
});

// Notification Preferences Routes - All data from database
router.get('/notification-preferences', authenticate, async (req, res) => {
  try {
    let settings = await Settings.findOne({ 
      tenantId: req.tenantId, 
      userId: req.user.id,
      type: 'notification_preferences' 
    });
    
    if (!settings) {
      // Return default preferences
      const defaultPreferences = {
        emailNotifications: true,
        newsAndUpdates: true,
        tipsAndTutorials: false,
        offersAndPromotions: false,
        moreActivity: true,
        allReminders: true,
        activityOnly: false,
        importantRemindersOnly: false
      };
      
      return res.json({ 
        success: true, 
        data: { preferences: defaultPreferences } 
      });
    }
    
    res.json({ 
      success: true, 
      data: { preferences: settings.data } 
    });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch notification preferences', 
      error: error.message 
    });
  }
});

router.put('/notification-preferences', authenticate, async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { 
        tenantId: req.tenantId, 
        userId: req.user.id,
        type: 'notification_preferences' 
      },
      { 
        data: req.body, 
        updatedAt: new Date() 
      },
      { 
        new: true, 
        upsert: true, 
        runValidators: true 
      }
    );
    
    res.json({ 
      success: true, 
      message: 'Notification preferences updated successfully',
      data: { preferences: settings.data } 
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update notification preferences', 
      error: error.message 
    });
  }
});



// Notification Preferences Routes - All data from database
router.get('/notification-preferences', authenticate, async (req, res) => {
  try {
    const settings = await Settings.findOne({ 
      userId: req.user.id,
      type: 'notification-preferences' 
    });
    
    if (!settings) {
      return res.json({
        success: true,
        data: {
          preferences: {
            emailNotifications: false,
            newsAndUpdates: false,
            tipsAndTutorials: false,
            offersAndPromotions: false,
            moreActivity: false,
            allReminders: false,
            activityOnly: false,
            importantRemindersOnly: false
          }
        }
      });
    }
    
    res.json({ 
      success: true, 
      data: { preferences: settings.data } 
    });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch notification preferences', 
      error: error.message 
    });
  }
});

router.put('/notification-preferences', authenticate, async (req, res) => {
  try {
    const { preferences } = req.body;
    
    const settings = await Settings.findOneAndUpdate(
      { 
        userId: req.user.id,
        type: 'notification-preferences' 
      },
      { 
        data: preferences,
        updatedAt: new Date() 
      },
      { 
        new: true, 
        upsert: true, 
        runValidators: true 
      }
    );
    
    res.json({ 
      success: true, 
      message: 'Notification preferences updated successfully',
      data: { preferences: settings.data } 
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update notification preferences', 
      error: error.message 
    });
  }
});

// Security Settings Routes - All data from database
router.get('/security', authenticate, async (req, res) => {
  try {
    const user = await req.user;
    
    res.json({
      success: true,
      data: {
        settings: {
          twoFactorEnabled: user.twoFactorEnabled || false,
          googleAuthEnabled: user.googleAuthEnabled || false,
          phoneNumber: user.phone || '',
          phoneVerified: user.phoneVerified || false,
          email: user.email || '',
          emailVerified: user.emailVerified || false
        }
      }
    });
  } catch (error) {
    console.error('Error fetching security settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch security settings',
      error: error.message
    });
  }
});

router.put('/security/two-factor', authenticate, async (req, res) => {
  try {
    const { enabled } = req.body;
    
    // Update user's two-factor setting
    req.user.twoFactorEnabled = enabled;
    await req.user.save();
    
    res.json({
      success: true,
      message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error('Error updating two-factor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update two-factor authentication',
      error: error.message
    });
  }
});

router.put('/security/google-auth', authenticate, async (req, res) => {
  try {
    const { enabled } = req.body;
    
    // Update user's Google auth setting
    req.user.googleAuthEnabled = enabled;
    await req.user.save();
    
    res.json({
      success: true,
      message: `Google authentication ${enabled ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error('Error updating Google auth:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update Google authentication',
      error: error.message
    });
  }
});

router.post('/security/deactivate', authenticate, async (req, res) => {
  try {
    // Deactivate user account
    req.user.status = 'inactive';
    req.user.deactivatedAt = new Date();
    await req.user.save();
    
    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Error deactivating account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate account',
      error: error.message
    });
  }
});

router.delete('/security/delete', authenticate, async (req, res) => {
  try {
    // Soft delete user account
    req.user.status = 'deleted';
    req.user.deletedAt = new Date();
    await req.user.save();
    
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message
    });
  }
});

// General Settings Routes
router.get('/', authenticate, settingsController.getSettings);
router.put('/company', authenticate, authorize(['admin']), settingsController.updateCompanySettings);
router.put('/localization', authenticate, authorize(['admin']), settingsController.updateLocalization);
router.put('/prefixes', authenticate, authorize(['admin']), settingsController.updatePrefixes);
router.put('/preferences', authenticate, authorize(['admin']), settingsController.updatePreferences);

// Maintenance Settings Routes - All data from database
router.get('/maintenance', authenticate, async (req, res) => {
  try {
    const settings = await Settings.findOne({ tenantId: req.tenantId, type: 'maintenance' });
    if (!settings) {
      return res.json({
        success: true,
        data: {
          enabled: false,
          message: 'System is currently under maintenance. We\'ll be back shortly.',
          startTime: '',
          endTime: '',
          affectedModules: [],
          notifyUsers: true,
          allowAdminAccess: true
        }
      });
    }
    res.json({ success: true, data: settings.data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch maintenance settings', error: error.message });
  }
});

router.put('/maintenance', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { tenantId: req.tenantId, type: 'maintenance' },
      { data: req.body, updatedAt: new Date() },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: settings.data, message: 'Maintenance settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update maintenance settings', error: error.message });
  }
});

// Scheduled Maintenance Routes - All data from database
router.get('/maintenance/scheduled', authenticate, async (req, res) => {
  try {
    const maintenanceList = await Settings.find({ tenantId: req.tenantId, type: 'scheduled_maintenance' }).sort({ 'data.date': 1 });
    const data = maintenanceList.map(item => ({ id: item._id, ...item.data }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch scheduled maintenance', error: error.message });
  }
});

router.post('/maintenance/scheduled', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const newMaintenance = new Settings({
      tenantId: req.tenantId,
      type: 'scheduled_maintenance',
      data: req.body
    });
    await newMaintenance.save();
    res.status(201).json({ success: true, data: { id: newMaintenance._id, ...newMaintenance.data }, message: 'Scheduled maintenance created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create scheduled maintenance', error: error.message });
  }
});

router.put('/maintenance/scheduled/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const maintenance = await Settings.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId, type: 'scheduled_maintenance' },
      { data: req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!maintenance) {
      return res.status(404).json({ success: false, message: 'Scheduled maintenance not found' });
    }
    res.json({ success: true, data: { id: maintenance._id, ...maintenance.data }, message: 'Scheduled maintenance updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update scheduled maintenance', error: error.message });
  }
});

router.delete('/maintenance/scheduled/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const maintenance = await Settings.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.tenantId,
      type: 'scheduled_maintenance'
    });
    if (!maintenance) {
      return res.status(404).json({ success: false, message: 'Scheduled maintenance not found' });
    }
    res.json({ success: true, message: 'Scheduled maintenance deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete scheduled maintenance', error: error.message });
  }
});

export default router;


