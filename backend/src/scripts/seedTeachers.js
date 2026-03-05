import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Teacher from '../models/Teacher.js';
import TeacherLeave from '../models/TeacherLeave.js';
import TeacherRoutine from '../models/TeacherRoutine.js';
import TeacherSalary from '../models/TeacherSalary.js';
import TeacherLibrary from '../models/TeacherLibrary.js';
import connectDB from '../config/database.js';

dotenv.config();

const schoolId = new mongoose.Types.ObjectId();
const userId = new mongoose.Types.ObjectId();
const departmentId = new mongoose.Types.ObjectId();
const subjectId1 = new mongoose.Types.ObjectId();
const subjectId2 = new mongoose.Types.ObjectId();
const classId = new mongoose.Types.ObjectId();
const sectionId = new mongoose.Types.ObjectId();
const bookId = new mongoose.Types.ObjectId();

const teachers = [
  {
    _id: new mongoose.Types.ObjectId(),
    schoolId,
    userId,
    employeeId: 'TCH001',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: new Date('1985-05-15'),
    gender: 'male',
    bloodGroup: 'O+',
    email: 'john.smith@school.com',
    phone: '+1234567890',
    alternatePhone: '+1234567891',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001'
    },
    qualification: {
      degree: 'M.Sc',
      specialization: 'Mathematics',
      university: 'State University',
      year: 2008
    },
    experience: {
      totalYears: 12,
      previousSchools: [
        {
          name: 'City High School',
          position: 'Math Teacher',
          from: new Date('2010-06-01'),
          to: new Date('2015-05-31')
        }
      ]
    },
    joiningDate: new Date('2015-06-01'),
    departmentId,
    designation: 'Senior Teacher',
    subjects: [subjectId1, subjectId2],
    classes: [
      {
        classId,
        sectionId,
        subjectId: subjectId1,
        isClassTeacher: true
      }
    ],
    salary: {
      basic: 50000,
      allowances: 15000,
      deductions: 5000,
      total: 60000,
      currency: 'USD',
      paymentMode: 'bank_transfer'
    },
    bankDetails: {
      accountNumber: '1234567890',
      bankName: 'National Bank',
      branchName: 'Main Branch',
      ifscCode: 'NATB0001234'
    },
    emergencyContact: {
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '+1234567892'
    },
    documents: [
      {
        type: 'resume',
        name: 'resume.pdf',
        url: '/uploads/teachers/resume_001.pdf'
      },
      {
        type: 'degree',
        name: 'msc_certificate.pdf',
        url: '/uploads/teachers/degree_001.pdf'
      },
      {
        type: 'photo',
        name: 'profile.jpg',
        url: '/uploads/teachers/photo_001.jpg'
      }
    ],
    status: 'active',
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId(),
    schoolId,
    userId: new mongoose.Types.ObjectId(),
    employeeId: 'TCH002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: new Date('1990-08-22'),
    gender: 'female',
    bloodGroup: 'A+',
    email: 'sarah.johnson@school.com',
    phone: '+1234567893',
    address: {
      street: '456 Oak Ave',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10002'
    },
    qualification: {
      degree: 'M.A',
      specialization: 'English Literature',
      university: 'State University',
      year: 2012
    },
    experience: {
      totalYears: 8
    },
    joiningDate: new Date('2016-07-01'),
    departmentId,
    designation: 'Teacher',
    subjects: [subjectId2],
    classes: [],
    salary: {
      basic: 45000,
      allowances: 12000,
      deductions: 4500,
      total: 52500,
      currency: 'USD',
      paymentMode: 'bank_transfer'
    },
    bankDetails: {
      accountNumber: '9876543210',
      bankName: 'National Bank',
      branchName: 'East Branch',
      ifscCode: 'NATB0005678'
    },
    emergencyContact: {
      name: 'Michael Johnson',
      relationship: 'Brother',
      phone: '+1234567894'
    },
    documents: [
      {
        type: 'photo',
        name: 'profile.jpg',
        url: '/uploads/teachers/photo_002.jpg'
      }
    ],
    status: 'active',
    isActive: true
  }
];

const teacherLeaves = [
  {
    schoolId,
    teacherId: teachers[0]._id,
    leaveType: 'sick',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-17'),
    totalDays: 3,
    reason: 'Medical treatment required',
    status: 'approved',
    appliedDate: new Date('2024-03-10'),
    reviewedBy: userId,
    reviewedDate: new Date('2024-03-11'),
    reviewComments: 'Approved. Get well soon.'
  },
  {
    schoolId,
    teacherId: teachers[0]._id,
    leaveType: 'casual',
    startDate: new Date('2024-04-20'),
    endDate: new Date('2024-04-20'),
    totalDays: 1,
    reason: 'Personal work',
    status: 'pending',
    appliedDate: new Date('2024-04-15')
  },
  {
    schoolId,
    teacherId: teachers[1]._id,
    leaveType: 'earned',
    startDate: new Date('2024-05-01'),
    endDate: new Date('2024-05-05'),
    totalDays: 5,
    reason: 'Family vacation',
    status: 'approved',
    appliedDate: new Date('2024-04-10'),
    reviewedBy: userId,
    reviewedDate: new Date('2024-04-12'),
    reviewComments: 'Approved'
  }
];

const teacherRoutines = [
  {
    schoolId,
    teacherId: teachers[0]._id,
    dayOfWeek: 1,
    periods: [
      {
        periodNumber: 1,
        startTime: '08:00',
        endTime: '08:45',
        subjectId: subjectId1,
        classId,
        sectionId,
        roomNumber: '101',
        periodType: 'lecture'
      },
      {
        periodNumber: 2,
        startTime: '08:50',
        endTime: '09:35',
        subjectId: subjectId1,
        classId,
        sectionId,
        roomNumber: '101',
        periodType: 'lecture'
      },
      {
        periodNumber: 3,
        startTime: '09:40',
        endTime: '10:25',
        periodType: 'break'
      },
      {
        periodNumber: 4,
        startTime: '10:30',
        endTime: '11:15',
        subjectId: subjectId2,
        classId,
        sectionId,
        roomNumber: '102',
        periodType: 'lecture'
      }
    ],
    academicYear: '2024-2025',
    term: '1',
    isActive: true
  },
  {
    schoolId,
    teacherId: teachers[0]._id,
    dayOfWeek: 2,
    periods: [
      {
        periodNumber: 1,
        startTime: '08:00',
        endTime: '08:45',
        periodType: 'free'
      },
      {
        periodNumber: 2,
        startTime: '08:50',
        endTime: '09:35',
        subjectId: subjectId1,
        classId,
        sectionId,
        roomNumber: '101',
        periodType: 'lecture'
      }
    ],
    academicYear: '2024-2025',
    term: '1',
    isActive: true
  }
];

const teacherSalaries = [
  {
    schoolId,
    teacherId: teachers[0]._id,
    month: 2,
    year: 2024,
    basicSalary: 50000,
    allowances: {
      hra: 10000,
      da: 3000,
      ta: 1500,
      medical: 500,
      other: 0
    },
    deductions: {
      pf: 2500,
      tax: 2000,
      insurance: 500,
      loan: 0,
      other: 0
    },
    workingDays: 28,
    presentDays: 27,
    leaveDays: 1,
    overtimeHours: 0,
    overtimeAmount: 0,
    paymentDate: new Date('2024-03-01'),
    paymentMode: 'bank_transfer',
    paymentStatus: 'paid',
    transactionId: 'TXN20240301001'
  },
  {
    schoolId,
    teacherId: teachers[0]._id,
    month: 3,
    year: 2024,
    basicSalary: 50000,
    allowances: {
      hra: 10000,
      da: 3000,
      ta: 1500,
      medical: 500,
      other: 0
    },
    deductions: {
      pf: 2500,
      tax: 2000,
      insurance: 500,
      loan: 0,
      other: 0
    },
    workingDays: 31,
    presentDays: 28,
    leaveDays: 3,
    overtimeHours: 0,
    overtimeAmount: 0,
    paymentMode: 'bank_transfer',
    paymentStatus: 'pending'
  },
  {
    schoolId,
    teacherId: teachers[1]._id,
    month: 2,
    year: 2024,
    basicSalary: 45000,
    allowances: {
      hra: 9000,
      da: 2000,
      ta: 1000,
      medical: 0,
      other: 0
    },
    deductions: {
      pf: 2250,
      tax: 1800,
      insurance: 450,
      loan: 0,
      other: 0
    },
    workingDays: 28,
    presentDays: 28,
    leaveDays: 0,
    overtimeHours: 0,
    overtimeAmount: 0,
    paymentDate: new Date('2024-03-01'),
    paymentMode: 'bank_transfer',
    paymentStatus: 'paid',
    transactionId: 'TXN20240301002'
  }
];

const teacherLibraryRecords = [
  {
    schoolId,
    teacherId: teachers[0]._id,
    bookId,
    issueDate: new Date('2024-02-01'),
    dueDate: new Date('2024-03-01'),
    returnDate: new Date('2024-02-28'),
    status: 'returned',
    issuedBy: userId,
    returnedTo: userId,
    fineAmount: 0,
    finePaid: true
  },
  {
    schoolId,
    teacherId: teachers[0]._id,
    bookId,
    issueDate: new Date('2024-03-15'),
    dueDate: new Date('2024-04-15'),
    status: 'issued',
    issuedBy: userId,
    fineAmount: 0,
    finePaid: false
  },
  {
    schoolId,
    teacherId: teachers[1]._id,
    bookId,
    issueDate: new Date('2024-01-10'),
    dueDate: new Date('2024-02-10'),
    status: 'overdue',
    issuedBy: userId,
    fineAmount: 150,
    finePaid: false,
    remarks: 'Book not returned yet'
  }
];

const seedTeachers = async () => {
  try {
    await connectDB();
    
    await Teacher.deleteMany({});
    await TeacherLeave.deleteMany({});
    await TeacherRoutine.deleteMany({});
    await TeacherSalary.deleteMany({});
    await TeacherLibrary.deleteMany({});
    
    await Teacher.insertMany(teachers);
    console.log('Teachers seeded successfully');
    
    await TeacherLeave.insertMany(teacherLeaves);
    console.log('Teacher leaves seeded successfully');
    
    await TeacherRoutine.insertMany(teacherRoutines);
    console.log('Teacher routines seeded successfully');
    
    await TeacherSalary.insertMany(teacherSalaries);
    console.log('Teacher salaries seeded successfully');
    
    await TeacherLibrary.insertMany(teacherLibraryRecords);
    console.log('Teacher library records seeded successfully');
    
    console.log('All teacher data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding teacher data:', error);
    process.exit(1);
  }
};

seedTeachers();
