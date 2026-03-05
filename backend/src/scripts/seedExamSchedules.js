import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ExamSchedule from '../models/ExamSchedule.js';
import Institution from '../models/Institution.js';
import Class from '../models/Class.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedExamSchedules = async () => {
  try {
    await connectDB();

    await ExamSchedule.deleteMany({});
    console.log('Existing exam schedules deleted');

    const institutions = await Institution.find().limit(2);
    const classes = await Class.find().limit(5);
    
    if (institutions.length === 0 || classes.length === 0) {
      console.log('No institutions or classes found. Please seed them first.');
      process.exit(1);
    }

    const examSchedules = [
      {
        examName: 'Week Test',
        classId: classes[0]._id,
        className: 'I',
        section: 'A',
        subject: 'English',
        examDate: new Date('2024-05-13'),
        startTime: '09:30 AM',
        endTime: '10:45 AM',
        duration: '3 hrs',
        roomNo: '101',
        maxMarks: 100,
        minMarks: 35,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id
      },
      {
        examName: 'Week Test',
        classId: classes[0]._id,
        className: 'I',
        section: 'A',
        subject: 'Spanish',
        examDate: new Date('2024-05-14'),
        startTime: '09:30 AM',
        endTime: '10:45 AM',
        duration: '3 hrs',
        roomNo: '104',
        maxMarks: 100,
        minMarks: 35,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id
      },
      {
        examName: 'Monthly Test',
        classId: classes[1]._id,
        className: 'II',
        section: 'B',
        subject: 'Mathematics',
        examDate: new Date('2024-05-15'),
        startTime: '10:00 AM',
        endTime: '12:00 PM',
        duration: '2 hrs',
        roomNo: '102',
        maxMarks: 100,
        minMarks: 40,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id
      },
      {
        examName: 'Unit Test',
        classId: classes[2]._id,
        className: 'III',
        section: 'A',
        subject: 'Physics',
        examDate: new Date('2024-05-16'),
        startTime: '09:00 AM',
        endTime: '11:30 AM',
        duration: '2.5 hrs',
        roomNo: '201',
        maxMarks: 100,
        minMarks: 35,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id
      },
      {
        examName: 'Chapter Wise Test',
        classId: classes[3]._id,
        className: 'IV',
        section: 'C',
        subject: 'Chemistry',
        examDate: new Date('2024-05-17'),
        startTime: '11:00 AM',
        endTime: '01:00 PM',
        duration: '2 hrs',
        roomNo: '202',
        maxMarks: 100,
        minMarks: 35,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id
      },
      {
        examName: 'Week Test',
        classId: classes[4]._id,
        className: 'V',
        section: 'A',
        subject: 'Biology',
        examDate: new Date('2024-05-20'),
        startTime: '09:30 AM',
        endTime: '11:30 AM',
        duration: '2 hrs',
        roomNo: '103',
        maxMarks: 100,
        minMarks: 35,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id
      },
      {
        examName: 'Monthly Test',
        classId: classes[0]._id,
        className: 'I',
        section: 'B',
        subject: 'History',
        examDate: new Date('2024-05-21'),
        startTime: '10:00 AM',
        endTime: '11:30 AM',
        duration: '1.5 hrs',
        roomNo: '105',
        maxMarks: 50,
        minMarks: 20,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id
      },
      {
        examName: 'Unit Test',
        classId: classes[1]._id,
        className: 'II',
        section: 'A',
        subject: 'Geography',
        examDate: new Date('2024-05-22'),
        startTime: '09:00 AM',
        endTime: '10:30 AM',
        duration: '1.5 hrs',
        roomNo: '106',
        maxMarks: 50,
        minMarks: 20,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id
      }
    ];

    const createdSchedules = await ExamSchedule.insertMany(examSchedules);
    console.log(`${createdSchedules.length} exam schedules created successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding exam schedules:', error);
    process.exit(1);
  }
};

seedExamSchedules();
