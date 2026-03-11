import mongoose from 'mongoose';

const institutionContactSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  alternatePhone: String,
  website: String,
  fax: String,
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  }
}, { _id: false });

const institutionSubscriptionSchema = new mongoose.Schema({
  planId: { type: String, enum: ['basic', 'medium', 'premium'], required: true },
  planName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'cancelled', 'suspended', 'trial'], 
    default: 'active' 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  renewalDate: Date,
  autoRenewal: { type: Boolean, default: true },
  billingCycle: { 
    type: String, 
    enum: ['monthly', 'quarterly', 'semi-annual', 'annual'], 
    default: 'monthly' 
  },
  monthlyCost: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  paymentMethod: { 
    type: String, 
    enum: ['card', 'bank', 'check', 'wire'] 
  },
  lastPaymentDate: Date,
  nextPaymentDate: Date,
  discount: {
    type: { type: String, enum: ['percentage', 'fixed'] },
    value: Number,
    description: String
  }
}, { _id: false });

const institutionFeaturesSchema = new mongoose.Schema({
  maxUsers: { type: Number, required: true },
  maxStudents: { type: Number, required: true },
  maxTeachers: { type: Number, required: true },
  storageLimit: { type: Number, required: true }, // in GB
  apiCallsLimit: Number,
  customDomain: { type: Boolean, default: false },
  whiteLabel: { type: Boolean, default: false },
  advancedAnalytics: { type: Boolean, default: false },
  prioritySupport: { type: Boolean, default: false },
  trainingSessions: { type: Number, default: 0 },
  integrations: [{ type: String }]
}, { _id: false });

const institutionAnalyticsSchema = new mongoose.Schema({
  totalStudents: { type: Number, default: 0 },
  totalTeachers: { type: Number, default: 0 },
  totalStaff: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 0 },
  monthlyActiveUsers: { type: Number, default: 0 },
  loginFrequency: { type: Number, default: 0 },
  featureUsage: {
    attendance: Number,
    grades: Number,
    reports: Number,
    communication: Number,
    analytics: Number
  },
  growthRate: { type: Number, default: 0 },
  retentionRate: { type: Number, default: 0 },
  satisfactionScore: Number
}, { _id: false });

const institutionComplianceSchema = new mongoose.Schema({
  dataRetentionPolicy: { type: Boolean, default: false },
  gdprCompliant: { type: Boolean, default: false },
  hipaaCompliant: { type: Boolean, default: false },
  ferpaCompliant: { type: Boolean, default: false },
  securityAudits: { type: Boolean, default: false },
  backupFrequency: { type: String, default: 'weekly' },
  incidentResponsePlan: { type: Boolean, default: false },
  lastSecurityAudit: Date,
  dpoContact: { type: String, default: 'dpo@edumanage.pro' },
  dpoResponsibilities: {
    type: [String],
    default: [
      'Data protection compliance',
      'Breach notification',
      'DPIA coordination'
    ]
  },
  dpoContactInfoLocation: { type: String, default: 'privacy policy & system settings' },
  dpia: {
    highRiskProcessing: {
      type: [String],
      default: [
        'Student personal data processing',
        'Automated decision making for assessments',
        'Large-scale data processing'
      ]
    },
    mitigationMeasures: {
      type: [String],
      default: [
        'Data minimization implemented',
        'Privacy by design principles followed',
        'Regular DPIA reviews conducted',
        'Data protection officer appointed'
      ]
    },
    lastReview: Date
  }
}, { _id: false });

const institutionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  instituteCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  shortName: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['School', 'Inter College', 'Degree College'],
    required: true
  },
  category: {
    type: String,
    enum: ['primary', 'secondary', 'higher-secondary', 'undergraduate', 'postgraduate'],
    required: true
  },
  accreditation: [{
    type: String
  }],
  established: {
    type: Number,
    required: true
  },
  description: String,

  // Contact & Location
  contact: {
    type: institutionContactSchema,
    required: true
  },

  // Administration
  principalName: {
    type: String,
    required: true
  },
  principalEmail: {
    type: String,
    required: true,
    unique: true
  },
  principalPhone: {
    type: String,
    required: true
  },
  adminContact: {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true }
  },

  // Subscription & Billing
  subscription: {
    type: institutionSubscriptionSchema,
    required: true
  },

  // Features & Limits
  features: {
    type: institutionFeaturesSchema,
    required: true
  },

  // Analytics
  analytics: {
    type: institutionAnalyticsSchema,
    default: () => ({})
  },

  // Compliance & Security
  compliance: {
    type: institutionComplianceSchema,
    default: () => ({})
  },

  // Operational Data
  academicYear: {
    type: String,
    required: true
  },
  workingDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  workingHours: {
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  holidays: [{
    type: String
  }],
  timezone: {
    type: String,
    default: 'UTC'
  },

  // Financial
  annualBudget: Number,
  monthlyRevenue: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  outstandingPayments: {
    type: Number,
    default: 0
  },

  // System
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'trial', 'expired'],
    default: 'active'
  },
  tags: [{
    type: String
  }],
  notes: String,

  // Branding & Customization
  branding: {
    logo: {
      type: String
    },
    favicon: {
      type: String
    },
    primaryColor: {
      type: String,
      default: '#3b82f6'
    },
    secondaryColor: {
      type: String,
      default: '#64748b'
    },
    fontFamily: {
      type: String,
      default: 'Inter'
    },
    customCSS: {
      type: String
    }
  },

  // Legacy reference
  legacySchoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
institutionSchema.index({ name: 'text' });
institutionSchema.index({ type: 1 });
institutionSchema.index({ category: 1 });
institutionSchema.index({ status: 1 });
institutionSchema.index({ 'subscription.status': 1 });
institutionSchema.index({ 'subscription.endDate': 1 });

// Virtual for checking if subscription is expiring
institutionSchema.virtual('isSubscriptionExpiring').get(function() {
  if (!this.subscription || !this.subscription.endDate) return false;
  const daysUntilExpiry = Math.ceil((this.subscription.endDate - new Date()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
});

// Method to check if expired
institutionSchema.methods.isExpired = function() {
  return this.subscription && this.subscription.endDate < new Date();
};

// Method to check if subscription is active
institutionSchema.methods.isSubscriptionActive = function() {
  return this.subscription && 
    ['active', 'trial'].includes(this.subscription.status) && 
    this.subscription.endDate > new Date();
};

// Pre-save middleware to calculate total revenue
institutionSchema.pre('save', function(next) {
  if (this.subscription && this.subscription.monthlyCost) {
    this.monthlyRevenue = this.subscription.monthlyCost;
    const months = this.subscription.billingCycle === 'annual' ? 12 : 
                   this.subscription.billingCycle === 'semi-annual' ? 6 : 
                   this.subscription.billingCycle === 'quarterly' ? 3 : 1;
    this.totalRevenue = this.subscription.monthlyCost * months;
  }
  next();
});

export default mongoose.model('Institution', institutionSchema);
