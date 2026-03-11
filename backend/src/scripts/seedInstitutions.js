import mongoose from 'mongoose';
import Institution from '../models/Institution.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleInstitutions = [
  {
    institutionId: 'inst-001',
    name: 'Springfield International School',
    shortName: 'SIS',
    type: 'School',
    category: 'secondary',
    accreditation: ['CBSE', 'International Baccalaureate'],
    established: 1995,
    description: 'A premier international school offering CBSE and IB curricula with world-class facilities.',
    contact: {
      email: 'info@springfield.edu',
      phone: '+1-555-0123',
      alternatePhone: '+1-555-0124',
      website: 'https://www.springfield.edu',
      address: {
        street: '123 Education Avenue',
        city: 'Springfield',
        state: 'IL',
        country: 'United States',
        postalCode: '62701'
      },
      coordinates: {
        latitude: 39.7817,
        longitude: -89.6501
      }
    },
    principalName: 'Dr. Sarah Johnson',
    principalEmail: 'principal@springfield.edu',
    principalPhone: '+1-555-0125',
    adminContact: {
      name: 'Mike Chen',
      email: 'admin@springfield.edu',
      phone: '+1-555-0126'
    },
    subscription: {
      planId: 'plan-premium',
      planName: 'Premium Plan',
      status: 'active',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      renewalDate: new Date('2024-12-31'),
      autoRenewal: true,
      billingCycle: 'annual',
      monthlyCost: 499,
      currency: 'USD',
      paymentMethod: 'card',
      lastPaymentDate: new Date('2024-01-01'),
      nextPaymentDate: new Date('2024-12-31')
    },
    features: {
      maxUsers: 500,
      maxStudents: 1000,
      maxTeachers: 50,
      storageLimit: 1000,
      apiCallsLimit: 1000000,
      customDomain: true,
      whiteLabel: true,
      advancedAnalytics: true,
      prioritySupport: true,
      trainingSessions: 12,
      integrations: ['Google Classroom', 'Microsoft Teams', 'Zoom', 'Google Drive']
    },
    analytics: {
      totalStudents: 850,
      totalTeachers: 45,
      totalStaff: 120,
      activeUsers: 920,
      monthlyActiveUsers: 890,
      loginFrequency: 85,
      featureUsage: new Map([
        ['attendance', 95],
        ['grades', 88],
        ['reports', 76],
        ['communication', 92]
      ]),
      growthRate: 12.5,
      retentionRate: 96.5,
      satisfactionScore: 4.7
    },
    compliance: {
      dataRetentionPolicy: true,
      gdprCompliant: true,
      ferpaCompliant: true,
      securityAudits: true,
      backupFrequency: 'daily',
      incidentResponsePlan: true,
      lastSecurityAudit: new Date('2024-03-15'),
      dpoContact: 'dpo@edumanage.pro',
      dpoResponsibilities: [
        'Data protection compliance',
        'Breach notification',
        'DPIA coordination'
      ],
      dpoContactInfoLocation: 'privacy policy & system settings',
      dpia: {
        highRiskProcessing: [
          'Student personal data processing',
          'Automated decision making for assessments',
          'Large-scale data processing'
        ],
        mitigationMeasures: [
          'Data minimization implemented',
          'Privacy by design principles followed',
          'Regular DPIA reviews conducted',
          'Data protection officer appointed'
        ],
        lastReview: new Date('2024-05-01')
      }
    },
    academicYear: '2024-2025',
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    workingHours: {
      start: '08:00',
      end: '15:00'
    },
    holidays: [new Date('2024-01-01'), new Date('2024-07-04'), new Date('2024-12-25')],
    timezone: 'America/Chicago',
    annualBudget: 5000000,
    monthlyRevenue: 499,
    totalRevenue: 5988,
    outstandingPayments: 0,
    status: 'active',
    lastLogin: new Date('2024-06-15T09:30:00Z'),
    lastActivity: new Date('2024-06-15T14:30:00Z'),
    tags: ['premium', 'international', 'cbse', 'ib', 'high-performing'],
    notes: 'Flagship institution with excellent performance metrics and high satisfaction scores.'
  },
  {
    institutionId: 'inst-002',
    name: 'Riverside Inter College',
    shortName: 'RIC',
    type: 'Inter College',
    category: 'higher-secondary',
    accreditation: ['State Board', 'NCERT'],
    established: 1988,
    description: 'Established inter college providing quality intermediate education with strong academic focus.',
    contact: {
      email: 'info@riverside.edu',
      phone: '+1-555-0456',
      website: 'https://www.riverside.edu',
      address: {
        street: '456 Knowledge Boulevard',
        city: 'Riverside',
        state: 'CA',
        country: 'United States',
        postalCode: '92501'
      }
    },
    principalName: 'Prof. Robert Martinez',
    principalEmail: 'principal@riverside.edu',
    principalPhone: '+1-555-0457',
    adminContact: {
      name: 'Lisa Wong',
      email: 'admin@riverside.edu',
      phone: '+1-555-0458'
    },
    subscription: {
      planId: 'plan-medium',
      planName: 'Medium Plan',
      status: 'active',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-07-31'),
      renewalDate: new Date('2024-07-31'),
      autoRenewal: true,
      billingCycle: 'semi-annual',
      monthlyCost: 299,
      currency: 'USD',
      paymentMethod: 'bank',
      lastPaymentDate: new Date('2024-02-01'),
      nextPaymentDate: new Date('2024-07-31')
    },
    features: {
      maxUsers: 200,
      maxStudents: 500,
      maxTeachers: 25,
      storageLimit: 500,
      apiCallsLimit: 500000,
      customDomain: false,
      whiteLabel: false,
      advancedAnalytics: true,
      prioritySupport: false,
      trainingSessions: 6,
      integrations: ['Google Classroom', 'Zoom']
    },
    analytics: {
      totalStudents: 420,
      totalTeachers: 22,
      totalStaff: 35,
      activeUsers: 450,
      monthlyActiveUsers: 430,
      loginFrequency: 78,
      featureUsage: new Map([
        ['attendance', 92],
        ['grades', 85],
        ['reports', 68],
        ['communication', 88]
      ]),
      growthRate: 8.2,
      retentionRate: 94.1,
      satisfactionScore: 4.3
    },
    compliance: {
      dataRetentionPolicy: true,
      gdprCompliant: false,
      ferpaCompliant: true,
      securityAudits: true,
      backupFrequency: 'weekly',
      incidentResponsePlan: true,
      lastSecurityAudit: new Date('2024-01-20')
    },
    academicYear: '2024-2025',
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workingHours: {
      start: '09:00',
      end: '16:00'
    },
    holidays: [new Date('2024-01-01'), new Date('2024-07-04'), new Date('2024-12-25')],
    timezone: 'America/Los_Angeles',
    annualBudget: 1200000,
    monthlyRevenue: 299,
    totalRevenue: 1794,
    outstandingPayments: 299,
    status: 'active',
    lastLogin: new Date('2024-06-10T09:45:00Z'),
    lastActivity: new Date('2024-06-10T11:15:00Z'),
    tags: ['medium', 'inter-college', 'growing', 'state-board'],
    notes: 'Growing institution with good engagement. Outstanding payment due for renewal.'
  },
  {
    institutionId: 'inst-003',
    name: 'Metro Degree College',
    shortName: 'MDC',
    type: 'Degree College',
    category: 'undergraduate',
    accreditation: ['UGC', 'NAAC Grade A'],
    established: 1975,
    description: 'Premier degree college offering undergraduate programs in science, commerce, and arts.',
    contact: {
      email: 'info@metrodegree.edu',
      phone: '+1-555-0789',
      alternatePhone: '+1-555-0790',
      website: 'https://www.metrodegree.edu',
      fax: '+1-555-0791',
      address: {
        street: '789 University Drive',
        city: 'Metropolis',
        state: 'NY',
        country: 'United States',
        postalCode: '10001'
      }
    },
    principalName: 'Dr. Jennifer Adams',
    principalEmail: 'principal@metrodegree.edu',
    principalPhone: '+1-555-0792',
    adminContact: {
      name: 'David Kumar',
      email: 'admin@metrodegree.edu',
      phone: '+1-555-0793'
    },
    subscription: {
      planId: 'plan-premium',
      planName: 'Premium Plan',
      status: 'active',
      startDate: new Date('2023-09-01'),
      endDate: new Date('2024-08-31'),
      renewalDate: new Date('2024-08-31'),
      autoRenewal: true,
      billingCycle: 'annual',
      monthlyCost: 799,
      currency: 'USD',
      paymentMethod: 'wire',
      lastPaymentDate: new Date('2023-09-01'),
      nextPaymentDate: new Date('2024-08-31'),
      discount: {
        type: 'percentage',
        value: 10,
        description: 'Volume discount for multiple branches'
      }
    },
    features: {
      maxUsers: 1000,
      maxStudents: 2500,
      maxTeachers: 80,
      storageLimit: 2000,
      apiCallsLimit: 2000000,
      customDomain: true,
      whiteLabel: true,
      advancedAnalytics: true,
      prioritySupport: true,
      trainingSessions: 24,
      integrations: ['Google Classroom', 'Microsoft Teams', 'Zoom', 'Google Drive', 'Moodle', 'Canvas']
    },
    analytics: {
      totalStudents: 2100,
      totalTeachers: 75,
      totalStaff: 200,
      activeUsers: 2250,
      monthlyActiveUsers: 2150,
      loginFrequency: 82,
      featureUsage: new Map([
        ['attendance', 89],
        ['grades', 91],
        ['reports', 85],
        ['communication', 95],
        ['analytics', 78]
      ]),
      growthRate: 15.3,
      retentionRate: 97.2,
      satisfactionScore: 4.8
    },
    compliance: {
      dataRetentionPolicy: true,
      gdprCompliant: true,
      hipaaCompliant: false,
      ferpaCompliant: true,
      securityAudits: true,
      backupFrequency: 'daily',
      incidentResponsePlan: true,
      lastSecurityAudit: new Date('2024-04-10')
    },
    academicYear: '2024-2025',
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workingHours: {
      start: '08:30',
      end: '17:30'
    },
    holidays: [new Date('2024-01-01'), new Date('2024-07-04'), new Date('2024-12-25'), new Date('2024-05-27')],
    timezone: 'America/New_York',
    annualBudget: 8500000,
    monthlyRevenue: 799,
    totalRevenue: 9588,
    outstandingPayments: 0,
    status: 'active',
    lastLogin: new Date('2024-06-12T08:15:00Z'),
    lastActivity: new Date('2024-06-12T16:45:00Z'),
    tags: ['premium', 'degree-college', 'ugc-accredited', 'multi-branch', 'high-growth'],
    notes: 'Large degree college with excellent performance metrics. Volume discount applied.'
  }
];

async function seedInstitutions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ultrakeysedusearch');
    console.log('Connected to MongoDB');

    await Institution.deleteMany({});
    console.log('Cleared existing institutions');

    const institutions = await Institution.insertMany(sampleInstitutions);
    console.log(`Seeded ${institutions.length} institutions successfully`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding institutions:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedInstitutions();
}

export default seedInstitutions;
