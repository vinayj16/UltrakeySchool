import mongoose from 'mongoose';
import Staff from '../models/Staff.js';
import Department from '../models/Department.js';
import Designation from '../models/Designation.js';
import Leave from '../models/Leave.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleDepartments = [
  {
    departmentId: 'dep1',
    name: 'Academics',
    code: 'ACAD',
    head: 's1',
    description: 'Teaching and academic staff department',
    budget: 250000,
    employeeCount: 15,
    status: 'active'
  },
  {
    departmentId: 'dep2',
    name: 'Finance',
    code: 'FIN',
    head: 's2',
    description: 'Financial management and accounting',
    budget: 150000,
    employeeCount: 5,
    status: 'active'
  },
  {
    departmentId: 'dep3',
    name: 'Administration',
    code: 'ADMIN',
    head: 'principal_id',
    description: 'School administration and management',
    budget: 100000,
    employeeCount: 8,
    status: 'active'
  }
];

const sampleDesignations = [
  {
    designationId: 'des1',
    name: 'Senior Teacher',
    code: 'ST',
    level: 3,
    department: 'dep1',
    description: 'Experienced teacher with leadership responsibilities',
    responsibilities: [
      'Teaching advanced subjects',
      'Mentoring junior teachers',
      'Curriculum development',
      'Department coordination'
    ],
    qualifications: [
      'Master\'s degree in relevant field',
      '5+ years teaching experience',
      'Leadership training preferred'
    ],
    salaryRange: {
      min: 40000,
      max: 60000,
      currency: 'USD'
    },
    status: 'active'
  },
  {
    designationId: 'des2',
    name: 'Senior Accountant',
    code: 'SA',
    level: 2,
    department: 'dep2',
    description: 'Senior financial management position',
    responsibilities: [
      'Financial planning and analysis',
      'Team supervision',
      'Regulatory compliance',
      'Budget management'
    ],
    qualifications: [
      'CPA certification',
      'MBA in Finance',
      '7+ years accounting experience'
    ],
    salaryRange: {
      min: 50000,
      max: 80000,
      currency: 'USD'
    },
    status: 'active'
  },
  {
    designationId: 'des3',
    name: 'Teacher',
    code: 'T',
    level: 4,
    department: 'dep1',
    description: 'Classroom teacher position',
    responsibilities: [
      'Classroom teaching',
      'Student assessment',
      'Parent communication',
      'Lesson planning'
    ],
    qualifications: [
      'Bachelor\'s degree in Education',
      'Teaching certification',
      '1+ years teaching experience preferred'
    ],
    salaryRange: {
      min: 30000,
      max: 50000,
      currency: 'USD'
    },
    status: 'active'
  }
];

const sampleStaff = [
  {
    staffId: 's1',
    employeeId: 'EMP001',
    firstName: 'Alice',
    lastName: 'Johnson',
    fullName: 'Alice Johnson',
    email: 'alice.johnson@school.com',
    phone: '+1 234 567 8901',
    alternatePhone: '+1 234 567 8902',
    avatar: '/assets/img/staff/staff-01.jpg',
    dateOfBirth: '1985-03-15',
    gender: 'female',
    maritalStatus: 'married',
    bloodGroup: 'O+',
    nationality: 'American',
    religion: 'Christian',
    department: 'dep1',
    departmentName: 'Academics',
    designation: 'des1',
    designationName: 'Senior Teacher',
    employeeType: 'permanent',
    employmentStatus: 'active',
    joiningDate: '2020-08-15',
    confirmationDate: '2021-02-15',
    contact: {
      email: 'alice.johnson@school.com',
      phone: '+1 234 567 8901',
      alternatePhone: '+1 234 567 8902',
      address: {
        street: '123 Education Lane',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        country: 'USA'
      },
      emergencyContact: {
        name: 'Robert Johnson',
        relationship: 'Husband',
        phone: '+1 234 567 8903'
      }
    },
    qualifications: [
      {
        degree: 'Master of Education',
        institution: 'University of Illinois',
        yearOfCompletion: 2010,
        grade: 'A',
        specialization: 'Mathematics Education',
        certificates: ['Teaching License', 'CPR Certified']
      }
    ],
    experience: [
      {
        organization: 'Springfield High School',
        position: 'Mathematics Teacher',
        startDate: '2020-08-15',
        isCurrent: true,
        responsibilities: ['Teaching Mathematics to grades 9-12'],
        achievements: ['Improved student test scores by 15%']
      }
    ],
    salary: {
      basic: 45000,
      hra: 11250,
      conveyance: 1920,
      lta: 4500,
      medical: 1500,
      otherAllowances: 3000,
      totalEarnings: 68070,
      providentFund: 5400,
      professionalTax: 240,
      incomeTax: 8500,
      otherDeductions: 500,
      totalDeductions: 14640,
      netSalary: 53430,
      currency: 'USD',
      effectiveFrom: '2024-01-01'
    },
    bankDetails: {
      accountNumber: '1234567890',
      bankName: 'First National Bank',
      ifscCode: 'FNBA0000123',
      branch: 'Springfield Main'
    },
    performanceRating: 4.5,
    lastPromotion: '2023-01-01',
    nextPromotionDue: '2025-01-01',
    createdBy: 'admin',
    updatedBy: 'hr_manager',
    notes: 'Excellent teacher with strong student engagement.',
    tags: ['senior-teacher', 'mathematics', 'high-performer']
  },
  {
    staffId: 's2',
    employeeId: 'EMP002',
    firstName: 'Bob',
    lastName: 'Smith',
    fullName: 'Bob Smith',
    email: 'bob.smith@school.com',
    phone: '+1 234 567 8904',
    dateOfBirth: '1978-07-22',
    gender: 'male',
    maritalStatus: 'married',
    bloodGroup: 'A+',
    nationality: 'American',
    department: 'dep2',
    departmentName: 'Finance',
    designation: 'des2',
    designationName: 'Senior Accountant',
    employeeType: 'permanent',
    employmentStatus: 'active',
    joiningDate: '2019-03-01',
    confirmationDate: '2019-09-01',
    contact: {
      email: 'bob.smith@school.com',
      phone: '+1 234 567 8904',
      address: {
        street: '456 Finance Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62702',
        country: 'USA'
      }
    },
    qualifications: [
      {
        degree: 'Master of Business Administration',
        institution: 'Harvard Business School',
        yearOfCompletion: 2005,
        grade: 'A-',
        specialization: 'Finance',
        certificates: ['CPA', 'CFA Level 2']
      }
    ],
    experience: [
      {
        organization: 'Springfield School District',
        position: 'Senior Accountant',
        startDate: '2019-03-01',
        isCurrent: true,
        responsibilities: ['Financial planning and budgeting']
      }
    ],
    salary: {
      basic: 55000,
      hra: 13750,
      conveyance: 1920,
      lta: 5500,
      medical: 1500,
      otherAllowances: 4000,
      totalEarnings: 81670,
      providentFund: 6600,
      professionalTax: 240,
      incomeTax: 11000,
      otherDeductions: 600,
      totalDeductions: 18440,
      netSalary: 63230,
      currency: 'USD',
      effectiveFrom: '2024-01-01'
    },
    performanceRating: 4.2,
    createdBy: 'admin',
    updatedBy: 'hr_manager',
    tags: ['senior-accountant', 'finance', 'cpa']
  }
];

const sampleLeaves = [
  {
    leaveId: 'L1',
    staffId: 's1',
    staffName: 'Alice Johnson',
    leaveType: 'casual',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    days: 3,
    reason: 'Family emergency',
    status: 'approved',
    appliedOn: new Date('2024-01-10T09:00:00Z'),
    approvedBy: 'principal_id',
    approvedOn: new Date('2024-01-12T14:30:00Z'),
    comments: 'Approved for family emergency.'
  },
  {
    leaveId: 'L2',
    staffId: 's2',
    staffName: 'Bob Smith',
    leaveType: 'annual',
    startDate: '2024-02-01',
    endDate: '2024-02-05',
    days: 5,
    reason: 'Vacation',
    status: 'pending',
    appliedOn: new Date('2024-01-15T11:20:00Z')
  }
];

async function seedHRM() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ultrakeysedusearch');
    console.log('Connected to MongoDB');

    await Department.deleteMany({});
    await Designation.deleteMany({});
    await Staff.deleteMany({});
    await Leave.deleteMany({});
    console.log('Cleared existing HRM data');

    const departments = await Department.insertMany(sampleDepartments);
    console.log(`Seeded ${departments.length} departments`);

    const designations = await Designation.insertMany(sampleDesignations);
    console.log(`Seeded ${designations.length} designations`);

    const staff = await Staff.insertMany(sampleStaff);
    console.log(`Seeded ${staff.length} staff members`);

    const leaves = await Leave.insertMany(sampleLeaves);
    console.log(`Seeded ${leaves.length} leave records`);

    console.log('HRM data seeded successfully');

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding HRM data:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedHRM();
}

export default seedHRM;
