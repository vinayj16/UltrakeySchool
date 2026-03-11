import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Class from '../models/Class.js';
import ClassSchedule from '../models/ClassSchedule.js';

dotenv.config();

const sampleClasses = [
  { name: 'I', section: 'A', students: 30, subjects: 3, status: 'active', academicYear: '2024/2025', capacity: 40, room: 'R101' },
  { name: 'I', section: 'B', students: 25, subjects: 3, status: 'active', academicYear: '2024/2025', capacity: 40, room: 'R102' },
  { name: 'II', section: 'A', students: 40, subjects: 3, status: 'active', academicYear: '2024/2025', capacity: 45, room: 'R201' },
  { name: 'II', section: 'B', students: 35, subjects: 3, status: 'active', academicYear: '2024/2025', capacity: 45, room: 'R202' },
  { name: 'II', section: 'C', students: 25, subjects: 3, status: 'inactive', academicYear: '2024/2025', capacity: 40, room: 'R203' },
  { name: 'III', section: 'A', students: 30, subjects: 3, status: 'active', academicYear: '2024/2025', capacity: 40, room: 'R301' },
  { name: 'III', section: 'B', students: 25, subjects: 5, status: 'active', academicYear: '2024/2025', capacity: 40, room: 'R302' },
  { name: 'IV', section: 'A', students: 20, subjects: 5, status: 'active', academicYear: '2024/2025', capacity: 35, room: 'R401' },
  { name: 'IV', section: 'B', students: 30, subjects: 5, status: 'inactive', academicYear: '2024/2025', capacity: 40, room: 'R402' },
  { name: 'V', section: 'A', students: 35, subjects: 5, status: 'active', academicYear: '2024/2025', capacity: 40, room: 'R501' }
];

const seedClasses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Class.deleteMany({});
    await ClassSchedule.deleteMany({});
    console.log('Cleared existing classes and schedules');

    const institutionId = new mongoose.Types.ObjectId();
    
    const classesWithInstitution = sampleClasses.map(cls => ({
      ...cls,
      institutionId
    }));

    const classes = await Class.insertMany(classesWithInstitution);
    console.log(`Seeded ${classes.length} classes`);

    const sampleSchedules = [
      {
        classId: classes[0]._id,
        className: 'I',
        section: 'A',
        subject: 'Mathematics',
        teacher: 'John Smith',
        teacherId: new mongoose.Types.ObjectId(),
        room: 'R101',
        day: 'Monday',
        startTime: '09:00 AM',
        endTime: '10:00 AM',
        duration: 60,
        status: 'active',
        academicYear: '2024/2025',
        institutionId,
        recurrence: 'weekly'
      }
    ];

    const schedules = await ClassSchedule.insertMany(sampleSchedules);
    console.log(`Seeded ${schedules.length} schedules`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding classes:', error);
    process.exit(1);
  }
};

seedClasses();
