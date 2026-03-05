import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Schedule from '../models/Schedule.js';
import User from '../models/User.js';

dotenv.config();

const seedSchedules = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const schoolId = new mongoose.Types.ObjectId();

    await Schedule.deleteMany({});
    console.log('Cleared existing schedule data');

    let teachers = await User.find({ role: 'teacher' }).limit(5);
    let students = await User.find({ role: 'student' }).limit(10);

    if (teachers.length === 0) {
      const teacherData = [
        { name: 'Ms. Anderson', email: 'anderson@school.com' },
        { name: 'Mr. Rodriguez', email: 'rodriguez@school.com' },
        { name: 'Dr. Smith', email: 'smith@school.com' }
      ];

      teachers = await User.insertMany(
        teacherData.map(t => ({
          _id: new mongoose.Types.ObjectId(),
          schoolId,
          name: t.name,
          email: t.email,
          role: 'teacher',
          isActive: true
        }))
      );
      console.log('Created sample teachers');
    }

    if (students.length === 0) {
      const studentData = [
        { name: 'Alex Chen', email: 'alex@school.com' },
        { name: 'Emma Wilson', email: 'emma@school.com' },
        { name: 'Liam Brown', email: 'liam@school.com' },
        { name: 'Sophia Lee', email: 'sophia@school.com' },
        { name: 'Noah Garcia', email: 'noah@school.com' }
      ];

      students = await User.insertMany(
        studentData.map(s => ({
          _id: new mongoose.Types.ObjectId(),
          schoolId,
          name: s.name,
          email: s.email,
          role: 'student',
          isActive: true
        }))
      );
      console.log('Created sample students');
    }

    const now = new Date();
    const schedules = [];

    const buildParticipant = (user) => ({
      userId: user._id,
      name: user.name,
      role: user.role,
      avatar: '/assets/img/placeholder-avatar.webp',
      email: user.email
    });

    schedules.push({
      schoolId,
      title: 'Parents Teacher Meet',
      description: 'Monthly parent-teacher conference to discuss student progress',
      type: 'meeting',
      priority: 'medium',
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
      startTime: '09:10 AM',
      endTime: '10:50 AM',
      location: 'Conference Room A',
      virtualLink: 'https://meet.google.com/abc-defg-hij',
      participants: students.slice(0, 3).map(buildParticipant),
      organizer: buildParticipant(teachers[0]),
      status: 'upcoming',
      isRecurring: true,
      recurrencePattern: 'monthly',
      tags: ['parent-teacher', 'conference'],
      notes: 'Please bring report cards',
      isActive: true
    });

    schedules.push({
      schoolId,
      title: 'Mathematics Class',
      description: 'Advanced Algebra session',
      type: 'class',
      priority: 'high',
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3),
      startTime: '10:00 AM',
      endTime: '11:30 AM',
      location: 'Room 201',
      participants: students.slice(0, 5).map(buildParticipant),
      organizer: buildParticipant(teachers[1]),
      status: 'upcoming',
      isRecurring: true,
      recurrencePattern: 'weekly',
      tags: ['mathematics', 'algebra', 'class'],
      notes: 'Bring calculators',
      isActive: true
    });

    schedules.push({
      schoolId,
      title: 'Final Exam - Physics',
      description: 'End of term physics examination',
      type: 'exam',
      priority: 'urgent',
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
      startTime: '09:00 AM',
      endTime: '12:00 PM',
      location: 'Examination Hall',
      participants: students.map(buildParticipant),
      organizer: buildParticipant(teachers[0]),
      status: 'upcoming',
      tags: ['physics', 'exam', 'final'],
      notes: 'No calculators allowed',
      isActive: true
    });

    schedules.push({
      schoolId,
      title: 'School Annual Event',
      description: 'Annual school celebration and awards ceremony',
      type: 'event',
      priority: 'high',
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 12),
      startTime: '02:00 PM',
      endTime: '06:00 PM',
      location: 'School Auditorium',
      participants: students.map(buildParticipant),
      organizer: buildParticipant(teachers[2]),
      status: 'upcoming',
      tags: ['event', 'annual', 'celebration'],
      notes: 'Formal attire required',
      isActive: true
    });

    schedules.push({
      schoolId,
      title: 'Science Lab Session',
      description: 'Practical chemistry experiments',
      type: 'class',
      priority: 'medium',
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4),
      startTime: '01:00 PM',
      endTime: '03:00 PM',
      location: 'Science Lab',
      participants: students.slice(0, 4).map(buildParticipant),
      organizer: buildParticipant(teachers[2]),
      status: 'upcoming',
      isRecurring: true,
      recurrencePattern: 'weekly',
      tags: ['science', 'chemistry', 'lab'],
      notes: 'Wear lab coats',
      isActive: true
    });

    await Schedule.insertMany(schedules);
    console.log(`Created ${schedules.length} schedule records`);

    console.log('\nSchedule seed data created successfully');
    console.log(`School ID: ${schoolId}`);
    console.log(`Total Schedules: ${schedules.length}`);
    console.log(`Teachers: ${teachers.length}`);
    console.log(`Students: ${students.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding schedule data:', error);
    process.exit(1);
  }
};

seedSchedules();
