import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Statistic from '../models/Statistic.js';
import User from '../models/User.js';

dotenv.config();

const seedStatistics = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const schoolId = new mongoose.Types.ObjectId();

    await Statistic.deleteMany({});
    console.log('Cleared existing statistic data');

    const students = await User.find({ role: 'student' });
    const teachers = await User.find({ role: 'teacher' });

    const studentCount = students.length || 2847;
    const teacherCount = teachers.length || 156;
    const activeStudents = students.filter(s => s.isActive).length || 2654;
    const activeTeachers = teachers.filter(t => t.isActive).length || 142;

    const statistics = [
      {
        schoolId,
        statId: 'students',
        label: 'Total Students',
        value: studentCount,
        delta: 12.5,
        deltaType: 'increase',
        active: activeStudents,
        inactive: studentCount - activeStudents,
        total: studentCount,
        icon: '/assets/img/icons/student.svg',
        category: 'academic',
        trend: 'up',
        period: 'this-month',
        previousPeriod: {
          value: Math.floor(studentCount * 0.89),
          delta: 12.5
        },
        thresholds: {
          warning: 2500,
          critical: 2000
        },
        alerts: [],
        metadata: {
          gradeDistribution: { A: 45, B: 30, C: 15, D: 7, F: 3 }
        },
        isActive: true
      },
      {
        schoolId,
        statId: 'teachers',
        label: 'Total Teachers',
        value: teacherCount,
        delta: -2.1,
        deltaType: 'decrease',
        active: activeTeachers,
        inactive: teacherCount - activeTeachers,
        total: teacherCount,
        icon: '/assets/img/icons/teacher.svg',
        category: 'staff',
        trend: 'down',
        period: 'this-month',
        previousPeriod: {
          value: Math.floor(teacherCount * 1.02),
          delta: -2.1
        },
        thresholds: {
          warning: 140,
          critical: 130
        },
        alerts: teacherCount < 140 ? [{
          type: 'warning',
          message: 'Teacher count below recommended threshold',
          triggeredAt: new Date(Date.now() - 86400000),
          acknowledged: false
        }] : [],
        metadata: {
          subjectDistribution: { math: 20, science: 25, english: 18, history: 15, arts: 12 }
        },
        isActive: true
      },
      {
        schoolId,
        statId: 'revenue',
        label: 'Total Revenue',
        value: 125000,
        delta: 8.3,
        deltaType: 'increase',
        active: 115000,
        inactive: 10000,
        total: 125000,
        icon: '/assets/img/icons/revenue.svg',
        category: 'finance',
        trend: 'up',
        period: 'this-month',
        previousPeriod: {
          value: 115500,
          delta: 8.3
        },
        thresholds: {
          warning: 100000,
          critical: 80000
        },
        alerts: [],
        metadata: {
          paymentMethods: { cash: 40, card: 35, online: 25 }
        },
        isActive: true
      },
      {
        schoolId,
        statId: 'attendance',
        label: 'Average Attendance',
        value: 94.2,
        delta: 1.8,
        deltaType: 'increase',
        active: 2678,
        inactive: 169,
        total: 2847,
        icon: '/assets/img/icons/attendance.svg',
        category: 'academic',
        trend: 'up',
        period: 'this-month',
        previousPeriod: {
          value: 92.4,
          delta: 1.8
        },
        thresholds: {
          warning: 85,
          critical: 75
        },
        alerts: [],
        metadata: {
          subjectWise: { math: 96, science: 95, english: 93, history: 92 }
        },
        isActive: true
      }
    ];

    await Statistic.insertMany(statistics);
    console.log(`Created ${statistics.length} statistic records`);

    console.log('\nStatistic seed data created successfully');
    console.log(`School ID: ${schoolId}`);
    console.log(`Total Statistics: ${statistics.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding statistic data:', error);
    process.exit(1);
  }
};

seedStatistics();
