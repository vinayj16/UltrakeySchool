import mongoose from 'mongoose';
import Settings from '../models/Settings.js';
import dotenv from 'dotenv';

dotenv.config();

const defaultSettings = {
  settingsId: 'system-settings',
  company: {
    name: 'UltraKey EduSearch',
    shortName: 'UltraKey',
    tagline: 'Transforming Education Through Technology',
    description: 'A comprehensive school management platform',
    logo: '/assets/images/logo.png',
    favicon: '/assets/images/favicon.ico',
    phone: '+1 555 0123',
    alternatePhone: '+1 555 0124',
    email: 'info@ultrakey.com',
    website: 'https://www.ultrakey.com',
    address: {
      street: '123 Education Avenue',
      city: 'Springfield',
      state: 'IL',
      country: 'United States',
      postalCode: '62701'
    },
    timezone: 'America/Chicago',
    currency: 'USD',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    fiscalYearStart: '07/01',
    taxId: 'TAX123456789',
    registrationNumber: 'REG987654321',
    established: '2020'
  },
  email: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    username: 'noreply@ultrakey.com',
    password: 'password123',
    fromEmail: 'noreply@ultrakey.com',
    fromName: 'UltraKey EduSearch',
    replyToEmail: 'support@ultrakey.com',
    enableTLS: true,
    enableAuth: true,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    testEmail: 'test@ultrakey.com',
    templates: {
      welcome: 'welcome-email.html',
      passwordReset: 'password-reset.html',
      invoice: 'invoice.html',
      notification: 'notification.html'
    }
  },
  sms: {
    provider: 'twilio',
    accountSid: 'AC1234567890',
    authToken: 'token123',
    phoneNumber: '+15550123',
    senderId: 'ULTRAKEY',
    enableDeliveryReports: true,
    testPhoneNumber: '+15550124',
    rateLimit: 100,
    templates: {
      welcome: 'Welcome to UltraKey!',
      otp: 'Your verification code is: {code}',
      alert: 'Alert: {message}',
      reminder: 'Reminder: {message}'
    }
  },
  storage: {
    provider: 'local',
    maxFileSize: 104857600,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'],
    enableCompression: true,
    enableCaching: true,
    backupEnabled: true,
    backupFrequency: 'daily',
    retentionPeriod: 365
  },
  payment: {
    gateway: 'stripe',
    apiKey: 'pk_test_123',
    secretKey: 'sk_test_123',
    webhookSecret: 'whsec_123',
    testMode: true,
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR'],
    defaultCurrency: 'USD',
    taxCalculation: 'exclusive',
    invoicePrefix: 'INV',
    autoInvoice: true,
    paymentTerms: 30,
    lateFeePercentage: 2.5,
    gracePeriod: 7
  },
  tax: {
    rate: 8.5,
    type: 'percentage',
    inclusive: false,
    taxId: 'TAX123456789',
    categories: [
      { name: 'Education Services', rate: 8.5, description: 'Core educational services' },
      { name: 'Digital Content', rate: 8.5, description: 'Online learning materials' }
    ],
    exemptions: [
      { category: 'Educational Materials', rate: 0, conditions: 'Approved textbooks' }
    ],
    regions: [
      { country: 'United States', rate: 8.5 },
      { country: 'United Kingdom', rate: 20 }
    ]
  },
  security: {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
      preventReuse: 5,
      expiryDays: 90
    },
    sessionPolicy: {
      timeout: 7200,
      rememberMe: true,
      concurrentSessions: 3,
      forceLogout: false
    },
    twoFactorAuth: {
      enabled: true,
      required: false,
      methods: ['sms', 'app'],
      gracePeriod: 7
    },
    ipWhitelist: [],
    loginAttempts: {
      maxAttempts: 5,
      lockoutDuration: 900,
      progressiveDelay: true
    },
    auditLog: {
      enabled: true,
      retentionDays: 365,
      sensitiveActions: ['login', 'password_change', 'data_export', 'settings_change']
    }
  },
  notifications: {
    email: {
      enabled: true,
      frequency: 'immediate',
      types: ['account', 'academic', 'billing', 'system']
    },
    sms: {
      enabled: true,
      frequency: 'immediate',
      types: ['security', 'urgent', 'reminders']
    },
    inApp: {
      enabled: true,
      soundEnabled: true,
      types: ['messages', 'updates', 'alerts']
    },
    push: {
      enabled: true,
      types: ['important', 'reminders', 'updates']
    },
    digest: {
      enabled: true,
      frequency: 'weekly',
      includeStats: true
    }
  },
  integrations: {
    google: {
      enabled: false,
      classroom: false,
      drive: false,
      calendar: false
    },
    microsoft: {
      enabled: false,
      teams: false,
      onedrive: false,
      outlook: false
    },
    zoom: {
      enabled: false
    },
    slack: {
      enabled: false
    },
    api: {
      enabled: true,
      rateLimit: 1000,
      allowedIPs: []
    }
  },
  backup: {
    enabled: true,
    frequency: 'daily',
    retention: 30,
    type: 'incremental',
    location: 'cloud',
    compression: true,
    encryption: true,
    autoVerify: true,
    notificationEmail: 'admin@ultrakey.com',
    lastBackup: new Date('2024-06-15T02:00:00Z'),
    nextBackup: new Date('2024-06-16T02:00:00Z')
  },
  maintenance: {
    enabled: false,
    schedule: {
      day: 'sunday',
      time: '02:00',
      duration: 120
    },
    message: 'System is under maintenance. Please check back later.',
    allowedIPs: ['192.168.1.0/24'],
    bypassToken: 'maintenance-bypass-123',
    lastMaintenance: new Date('2024-06-09T02:00:00Z'),
    nextMaintenance: new Date('2024-06-16T02:00:00Z')
  },
  version: '1.0.0',
  environment: 'production',
  updatedBy: 'system'
};

async function seedSettings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ultrakeysedusearch');
    console.log('Connected to MongoDB');

    await Settings.deleteMany({});
    console.log('Cleared existing settings');

    const settings = await Settings.create(defaultSettings);
    console.log('Seeded system settings successfully');

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding settings:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedSettings();
}

export default seedSettings;
