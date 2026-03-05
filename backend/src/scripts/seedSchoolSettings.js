import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SchoolSettings from '../models/SchoolSettings.js';
import Institution from '../models/Institution.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedSchoolSettings = async () => {
  try {
    await connectDB();

    await SchoolSettings.deleteMany({});
    console.log('Existing school settings deleted');

    const institutions = await Institution.find().limit(5);
    
    if (institutions.length === 0) {
      console.log('No institutions found. Please seed institutions first.');
      process.exit(1);
    }

    const schoolSettings = [
      {
        institutionId: institutions[0]._id,
        basicInfo: {
          schoolName: 'Springfield High School',
          phoneNumber: '+1-555-0101',
          email: 'info@springfieldhigh.edu',
          fax: '+1-555-0102',
          address: '123 Education Lane, Springfield, IL 62701',
          website: 'https://www.springfieldhigh.edu'
        },
        academicSettings: {
          academicYear: '2024/2025',
          sessionStartDate: new Date('2024-09-01'),
          sessionEndDate: new Date('2025-06-30'),
          weekendDays: ['Saturday', 'Sunday'],
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          classStartTime: '08:00',
          classEndTime: '15:00',
          periodDuration: 45,
          breakDuration: 15
        },
        examSettings: {
          passingPercentage: 40,
          gradingSystem: 'percentage',
          maxMarks: 100
        },
        attendanceSettings: {
          minimumAttendance: 75,
          lateArrivalTime: 15,
          halfDayThreshold: 4
        },
        feeSettings: {
          currency: 'USD',
          lateFeePercentage: 5,
          lateFeeGracePeriod: 7
        },
        notificationSettings: {
          enableEmailNotifications: true,
          enableSMSNotifications: true,
          enablePushNotifications: true
        },
        status: 'active'
      },
      {
        institutionId: institutions[1]._id,
        basicInfo: {
          schoolName: 'Riverside Academy',
          phoneNumber: '+1-555-0201',
          email: 'contact@riversideacademy.edu',
          address: '456 River Road, Portland, OR 97201',
          website: 'https://www.riversideacademy.edu'
        },
        academicSettings: {
          academicYear: '2024/2025',
          sessionStartDate: new Date('2024-08-15'),
          sessionEndDate: new Date('2025-06-15'),
          weekendDays: ['Sunday'],
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          classStartTime: '07:30',
          classEndTime: '14:30',
          periodDuration: 50,
          breakDuration: 10
        },
        examSettings: {
          passingPercentage: 50,
          gradingSystem: 'gpa',
          maxMarks: 100
        },
        attendanceSettings: {
          minimumAttendance: 80,
          lateArrivalTime: 10,
          halfDayThreshold: 3
        },
        feeSettings: {
          currency: 'USD',
          lateFeePercentage: 10,
          lateFeeGracePeriod: 5
        },
        notificationSettings: {
          enableEmailNotifications: true,
          enableSMSNotifications: false,
          enablePushNotifications: true
        },
        status: 'active'
      },
      {
        institutionId: institutions[2]._id,
        basicInfo: {
          schoolName: 'Oakwood International School',
          phoneNumber: '+1-555-0301',
          email: 'admin@oakwoodintl.edu',
          address: '789 Oak Street, Boston, MA 02101',
          website: 'https://www.oakwoodintl.edu'
        },
        academicSettings: {
          academicYear: '2024/2025',
          sessionStartDate: new Date('2024-09-05'),
          sessionEndDate: new Date('2025-07-05'),
          weekendDays: ['Saturday', 'Sunday'],
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          classStartTime: '08:30',
          classEndTime: '16:00',
          periodDuration: 40,
          breakDuration: 20
        },
        examSettings: {
          passingPercentage: 45,
          gradingSystem: 'letter',
          maxMarks: 100
        },
        attendanceSettings: {
          minimumAttendance: 85,
          lateArrivalTime: 20,
          halfDayThreshold: 5
        },
        feeSettings: {
          currency: 'USD',
          lateFeePercentage: 8,
          lateFeeGracePeriod: 10
        },
        notificationSettings: {
          enableEmailNotifications: true,
          enableSMSNotifications: true,
          enablePushNotifications: false
        },
        status: 'active'
      }
    ];

    const createdSettings = await SchoolSettings.insertMany(schoolSettings);
    console.log(`${createdSettings.length} school settings created successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding school settings:', error);
    process.exit(1);
  }
};

seedSchoolSettings();
