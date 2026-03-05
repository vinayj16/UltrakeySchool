import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import School from '../models/School.js';

dotenv.config();

const mockSchools = [
  {
    name: 'Skyline Academy',
    code: 'SKLA',
    shortName: 'Skyline',
    type: 'School',
    category: 'secondary',
    established: 1998,
    accreditation: ['CBSE'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    contact: {
      email: 'contact@skyline.edu',
      phone: '+1-555-0100',
      website: 'https://skyline.edu',
      address: {
        street: '101 Horizon Drive',
        city: 'Metropolis',
        state: 'NY',
        country: 'United States',
        postalCode: '10001'
      }
    },
    administration: {
      principalName: 'Aaron Miles',
      principalEmail: 'principal@skyline.edu',
      principalPhone: '+1-555-0101',
      adminContact: {
        name: 'Elena Bright',
        email: 'admin@skyline.edu',
        phone: '+1-555-0102'
      }
    },
    subscription: {
      planId: 'plan-premium',
      planName: 'Premium',
      status: 'active',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-01-01'),
      autoRenewal: true,
      billingCycle: 'annual',
      monthlyCost: 499,
      currency: 'USD',
      paymentMethod: 'card',
      lastPaymentDate: new Date('2024-01-01'),
      nextPaymentDate: new Date('2025-01-01'),
      features: {
        maxUsers: 1000,
        maxStudents: 1500,
        storageLimit: 2000,
        customDomain: true,
        whiteLabel: true,
        advancedAnalytics: true,
        prioritySupport: true
      }
    },
    academicYear: '2024-2025',
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workingHours: {
      start: '08:00',
      end: '15:30'
    },
    annualBudget: 5500000,
    monthlyRevenue: 520,
    totalRevenue: 6240,
    outstandingPayments: 0,
    status: 'Active',
    expiryDate: '2025-01-01',
    plan: 'Premium',
    students: 1200,
    totalStudents: 1200,
    totalTeachers: 85,
    totalStaff: 60,
    studentTeacherRatio: 14.1,
    genderDistribution: {
      maleStudents: 620,
      femaleStudents: 580,
      maleTeachers: 38,
      femaleTeachers: 47
    },
    tags: ['high-performing', 'cbse', 'international'],
    notes: 'Primary IIS-based campus.'
  },
  {
    name: 'Skyline Academy Inter',
    code: 'SKLI',
    shortName: 'Skyline Inter',
    type: 'Inter College',
    category: 'higher-secondary',
    established: 2006,
    accreditation: ['State Board'],
    description: 'Intermediate wing of Skyline Academy.',
    contact: {
      email: 'inter@skyline.edu',
      phone: '+1-555-0200',
      website: 'https://inter.skyline.edu',
      address: {
        street: '205 Horizon Drive',
        city: 'Metropolis',
        state: 'NY',
        country: 'United States',
        postalCode: '10002'
      }
    },
    administration: {
      principalName: 'Lakshmi Nair',
      principalEmail: 'principal-inter@skyline.edu',
      principalPhone: '+1-555-0201',
      adminContact: {
        name: 'Leo Martinez',
        email: 'admin-inter@skyline.edu',
        phone: '+1-555-0202'
      }
    },
    subscription: {
      planId: 'plan-medium',
      planName: 'Medium',
      status: 'active',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-09-30'),
      autoRenewal: false,
      billingCycle: 'semi-annual',
      monthlyCost: 299,
      currency: 'USD',
      paymentMethod: 'bank',
      lastPaymentDate: new Date('2024-03-01'),
      nextPaymentDate: new Date('2024-09-30'),
      features: {
        maxUsers: 500,
        maxStudents: 600,
        storageLimit: 700,
        customDomain: false,
        whiteLabel: false,
        advancedAnalytics: true
      }
    },
    academicYear: '2024-2025',
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    workingHours: {
      start: '08:30',
      end: '15:00'
    },
    annualBudget: 2000000,
    monthlyRevenue: 320,
    totalRevenue: 2560,
    outstandingPayments: 220,
    status: 'Active',
    expiryDate: '2024-09-30',
    plan: 'Medium',
    students: 520,
    totalStudents: 540,
    totalTeachers: 40,
    totalStaff: 32,
    studentTeacherRatio: 13.5,
    genderDistribution: {
      maleStudents: 280,
      femaleStudents: 260,
      maleTeachers: 18,
      femaleTeachers: 22
    },
    tags: ['intermediate', 'state-board'],
    notes: 'Separate payroll and fee cycle.'
  },
  {
    name: 'Skyline Academy Degree',
    code: 'SKLD',
    shortName: 'Skyline Degree',
    type: 'Degree College',
    category: 'undergraduate',
    established: 2012,
    accreditation: ['UGC', 'AICTE'],
    description: 'Degree college focusing on commerce and science.',
    contact: {
      email: 'degree@skyline.edu',
      phone: '+1-555-0300',
      website: 'https://degree.skyline.edu',
      address: {
        street: '308 Innovation Lane',
        city: 'Metropolis',
        state: 'NY',
        country: 'United States',
        postalCode: '10003'
      }
    },
    administration: {
      principalName: 'Dr. Mira Sethi',
      principalEmail: 'principal-degree@skyline.edu',
      principalPhone: '+1-555-0301',
      adminContact: {
        name: 'Ravi Patel',
        email: 'admin-degree@skyline.edu',
        phone: '+1-555-0302'
      }
    },
    subscription: {
      planId: 'plan-premium',
      planName: 'Premium',
      status: 'active',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2025-02-01'),
      autoRenewal: true,
      billingCycle: 'annual',
      monthlyCost: 549,
      currency: 'USD',
      paymentMethod: 'card',
      lastPaymentDate: new Date('2024-02-01'),
      nextPaymentDate: new Date('2025-02-01'),
      features: {
        maxUsers: 1200,
        maxStudents: 1800,
        storageLimit: 2500,
        customDomain: true,
        whiteLabel: true,
        advancedAnalytics: true,
        prioritySupport: true
      }
    },
    academicYear: '2024-2025',
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    annualBudget: 7500000,
    monthlyRevenue: 610,
    totalRevenue: 7320,
    outstandingPayments: 120,
    status: 'Active',
    expiryDate: '2025-02-01',
    plan: 'Premium',
    students: 1600,
    totalStudents: 1600,
    totalTeachers: 110,
    totalStaff: 90,
    studentTeacherRatio: 14.5,
    genderDistribution: {
      maleStudents: 900,
      femaleStudents: 700,
      maleTeachers: 60,
      femaleTeachers: 50
    },
    tags: ['degree', 'commerce', 'science'],
    notes: 'Includes engineering, commerce and arts streams.'
  },
  {
    name: 'Skyline Academy Engineering',
    code: 'SKLE',
    shortName: 'Skyline Eng',
    type: 'Engineering College',
    category: 'undergraduate',
    established: 2018,
    accreditation: ['AICTE'],
    description: 'Engineering campus inside Skyline campus.',
    contact: {
      email: 'eng@skyline.edu',
      phone: '+1-555-0400',
      website: 'https://engineering.skyline.edu',
      address: {
        street: '405 Tech Park',
        city: 'Innovation City',
        state: 'NY',
        country: 'United States',
        postalCode: '10004'
      }
    },
    administration: {
      principalName: 'Prof. Anil Khanna',
      principalEmail: 'principal-eng@skyline.edu',
      principalPhone: '+1-555-0401',
      adminContact: {
        name: 'Priya Jalota',
        email: 'admin-eng@skyline.edu',
        phone: '+1-555-0402'
      }
    },
    subscription: {
      planId: 'plan-premium',
      planName: 'Premium',
      status: 'active',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2025-04-01'),
      autoRenewal: true,
      billingCycle: 'annual',
      monthlyCost: 649,
      currency: 'USD',
      paymentMethod: 'card',
      lastPaymentDate: new Date('2024-04-01'),
      nextPaymentDate: new Date('2025-04-01'),
      features: {
        maxUsers: 1500,
        maxStudents: 2000,
        storageLimit: 3000,
        customDomain: true,
        whiteLabel: true,
        advancedAnalytics: true,
        prioritySupport: true
      }
    },
    academicYear: '2024-2025',
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workingHours: {
      start: '09:00',
      end: '18:00'
    },
    annualBudget: 9500000,
    monthlyRevenue: 710,
    totalRevenue: 8520,
    outstandingPayments: 250,
    status: 'Active',
    expiryDate: '2025-04-01',
    plan: 'Premium',
    students: 1900,
    totalStudents: 1900,
    totalTeachers: 130,
    totalStaff: 105,
    studentTeacherRatio: 14.6,
    genderDistribution: {
      maleStudents: 1200,
      femaleStudents: 700,
      maleTeachers: 80,
      femaleTeachers: 50
    },
    tags: ['engineering', 'technology', 'research'],
    notes: 'Feature-rich labs and research centre.'
  }
];

const seed = async () => {
  try {
    await connectDB();
    const codes = mockSchools.map((school) => school.code);
    await School.deleteMany({ code: { $in: codes } });
    await School.insertMany(mockSchools);
    console.log('Inserted mock schools:', mockSchools.map((s) => s.code));
    mongoose.connection.close();
  } catch (error) {
    console.error('Failed to seed mock schools:', error);
    process.exit(1);
  }
};

seed();
