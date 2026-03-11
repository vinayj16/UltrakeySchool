import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Performer from '../models/Performer.js';
import User from '../models/User.js';

dotenv.config();

const seedPerformers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get school ID (use existing or create new)
    const schoolId = new mongoose.Types.ObjectId();

    // Clear existing performer data
    await Performer.deleteMany({});
    console.log('Cleared existing performer data');

    // Get or create sample users
    let teachers = await User.find({ role: 'teacher' }).limit(10);
    let students = await User.find({ role: 'student' }).limit(10);

    // If no users exist, create sample ones
    if (teachers.length === 0) {
      const teacherData = [
        { name: 'Rubell', department: 'Physics Teacher' },
        { name: 'George Odell', department: 'English Teacher' },
        { name: 'Sarah Johnson', department: 'Mathematics Teacher' },
        { name: 'Michael Brown', department: 'Chemistry Teacher' },
        { name: 'Emily Davis', department: 'Biology Teacher' }
      ];

      teachers = await User.insertMany(
        teacherData.map(t => ({
          _id: new mongoose.Types.ObjectId(),
          schoolId,
          name: t.name,
          email: `${t.name.toLowerCase().replace(' ', '.')}@school.com`,
          role: 'teacher',
          department: t.department,
          isActive: true
        }))
      );
      console.log('Created sample teachers');
    }

    if (students.length === 0) {
      const studentData = [
        { name: 'Tenesa', class: 'XII, A' },
        { name: 'Michael', class: 'XII, B' },
        { name: 'Jessica Smith', class: 'XI, A' },
        { name: 'David Wilson', class: 'XI, B' },
        { name: 'Emma Thompson', class: 'X, A' }
      ];

      students = await User.insertMany(
        studentData.map(s => ({
          _id: new mongoose.Types.ObjectId(),
          schoolId,
          name: s.name,
          email: `${s.name.toLowerCase().replace(' ', '.')}@school.com`,
          role: 'student',
          classId: s.class,
          isActive: true
        }))
      );
      console.log('Created sample students');
    }

    // Create performer records
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const currentQuarter = Math.ceil(currentMonth / 3);

    const performerData = [];

    // Teacher performers
    const teacherPerformers = [
      {
        userId: teachers[0]._id,
        name: teachers[0].name,
        role: teachers[0].department || 'Physics Teacher',
        imageUrl: '/assets/img/performer/performer-01.webp',
        achievements: ['Excellent Student Feedback', 'Perfect Attendance', '100% Pass Rate'],
        performance: { rating: 9.8, attendance: 100 },
        metrics: {
          totalScore: 98,
          assignmentCompletion: 100,
          behaviorScore: 10
        }
      },
      {
        userId: teachers[1]._id,
        name: teachers[1].name,
        role: teachers[1].department || 'English Teacher',
        imageUrl: '/assets/img/performer/performer-02.webp',
        achievements: ['Outstanding Teaching', 'Department Head', 'Innovation Award'],
        performance: { rating: 9.7, attendance: 98 },
        metrics: {
          totalScore: 97,
          assignmentCompletion: 98,
          behaviorScore: 10
        }
      }
    ];

    if (teachers.length > 2) {
      teacherPerformers.push({
        userId: teachers[2]._id,
        name: teachers[2].name,
        role: teachers[2].department || 'Mathematics Teacher',
        imageUrl: '/assets/img/performer/performer-01.webp',
        achievements: ['Best Teacher Award', 'Student Favorite'],
        performance: { rating: 9.6, attendance: 97 },
        metrics: {
          totalScore: 96,
          assignmentCompletion: 97,
          behaviorScore: 9.5
        }
      });
    }

    teacherPerformers.forEach((tp, index) => {
      performerData.push({
        schoolId,
        userId: tp.userId,
        type: 'teacher',
        name: tp.name,
        role: tp.role,
        imageUrl: tp.imageUrl,
        achievements: tp.achievements,
        performance: tp.performance,
        metrics: tp.metrics,
        period: {
          month: currentMonth,
          year: currentYear,
          quarter: currentQuarter
        },
        isFeatured: index < 2,
        featuredOrder: index + 1,
        isActive: true
      });
    });

    // Student performers
    const studentPerformers = [
      {
        userId: students[0]._id,
        name: students[0].name,
        role: students[0].classId || 'XII, A',
        class: students[0].classId || 'XII, A',
        imageUrl: '/assets/img/performer/student-performer-01.webp',
        achievements: ['Academic Excellence', 'Sports Champion', 'Perfect Attendance'],
        performance: { rating: 9.9, attendance: 100, grade: 'A+' },
        metrics: {
          totalScore: 99,
          assignmentCompletion: 100,
          behaviorScore: 10,
          examScores: [
            { score: 98, maxScore: 100, date: new Date() },
            { score: 99, maxScore: 100, date: new Date() }
          ]
        }
      },
      {
        userId: students[1]._id,
        name: students[1].name,
        role: students[1].classId || 'XII, B',
        class: students[1].classId || 'XII, B',
        imageUrl: '/assets/img/performer/student-performer-02.webp',
        achievements: ['Perfect Scores', 'Leadership Award', 'Science Olympiad Winner'],
        performance: { rating: 9.8, attendance: 100, grade: 'A+' },
        metrics: {
          totalScore: 98,
          assignmentCompletion: 100,
          behaviorScore: 10,
          examScores: [
            { score: 97, maxScore: 100, date: new Date() },
            { score: 98, maxScore: 100, date: new Date() }
          ]
        }
      }
    ];

    if (students.length > 2) {
      studentPerformers.push({
        userId: students[2]._id,
        name: students[2].name,
        role: students[2].classId || 'XI, A',
        class: students[2].classId || 'XI, A',
        imageUrl: '/assets/img/performer/student-performer-01.webp',
        achievements: ['Top of Class', 'Art Competition Winner'],
        performance: { rating: 9.7, attendance: 99, grade: 'A+' },
        metrics: {
          totalScore: 97,
          assignmentCompletion: 99,
          behaviorScore: 9.8,
          examScores: [
            { score: 96, maxScore: 100, date: new Date() },
            { score: 97, maxScore: 100, date: new Date() }
          ]
        }
      });
    }

    studentPerformers.forEach((sp, index) => {
      performerData.push({
        schoolId,
        userId: sp.userId,
        type: 'student',
        name: sp.name,
        role: sp.role,
        class: sp.class,
        imageUrl: sp.imageUrl,
        achievements: sp.achievements,
        performance: sp.performance,
        metrics: sp.metrics,
        period: {
          month: currentMonth,
          year: currentYear,
          quarter: currentQuarter
        },
        isFeatured: index < 2,
        featuredOrder: index + 1,
        isActive: true
      });
    });

    // Insert performer records
    await Performer.insertMany(performerData);
    console.log(`Created ${performerData.length} performer records`);

    console.log('\n✅ Performer seed data created successfully!');
    console.log(`School ID: ${schoolId}`);
    console.log(`Teachers: ${teacherPerformers.length}`);
    console.log(`Students: ${studentPerformers.length}`);
    console.log(`Total Performers: ${performerData.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding performer data:', error);
    process.exit(1);
  }
};

seedPerformers();
