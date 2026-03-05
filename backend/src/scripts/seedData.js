import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Attendance.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Sample school ID
    const schoolId = new mongoose.Types.ObjectId();

    // Create sample users
    const students = [];
    for (let i = 1; i <= 30; i++) {
      students.push({
        _id: new mongoose.Types.ObjectId(),
        schoolId,
        name: `Student ${i}`,
        email: `student${i}@school.com`,
        password: 'Student123!',
        role: 'student',
        isActive: true
      });
    }

    const teachers = [];
    for (let i = 1; i <= 36; i++) {
      teachers.push({
        _id: new mongoose.Types.ObjectId(),
        schoolId,
        name: `Teacher ${i}`,
        email: `teacher${i}@school.com`,
        password: 'Teacher123!',
        role: 'teacher',
        isActive: true
      });
    }

    const staff = [];
    for (let i = 1; i <= 56; i++) {
      staff.push({
        _id: new mongoose.Types.ObjectId(),
        schoolId,
        name: `Staff ${i}`,
        email: `staff${i}@school.com`,
        password: 'Staff123!',
        role: 'staff_member',
        isActive: true
      });
    }

    await User.insertMany([...students, ...teachers, ...staff]);
    console.log('Created sample users');

    // Create attendance records for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceRecords = [];

    // Student attendance
    students.forEach((student, index) => {
      let status = 'present';
      if (index === 0) status = 'absent';
      if (index === 1) status = 'late';

      attendanceRecords.push({
        schoolId,
        userId: student._id,
        userType: 'student',
        date: today,
        status,
        checkInTime: status !== 'absent' ? new Date() : null
      });
    });

    // Teacher attendance
    teachers.forEach((teacher, index) => {
      let status = 'present';
      if (index < 3) status = 'absent';
      if (index >= 3 && index < 6) status = 'late';

      attendanceRecords.push({
        schoolId,
        userId: teacher._id,
        userType: 'teacher',
        date: today,
        status,
        checkInTime: status !== 'absent' ? new Date() : null
      });
    });

    // Staff attendance
    staff.forEach((staffMember, index) => {
      let status = 'present';
      if (index === 0) status = 'absent';
      if (index >= 1 && index < 11) status = 'late';

      attendanceRecords.push({
        schoolId,
        userId: staffMember._id,
        userType: 'staff',
        date: today,
        status,
        checkInTime: status !== 'absent' ? new Date() : null
      });
    });

    await Attendance.insertMany(attendanceRecords);
    console.log('Created attendance records');

    console.log('Seed data created successfully!');
    console.log(`School ID: ${schoolId}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
