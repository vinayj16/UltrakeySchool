import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StudentAttendance from '../models/StudentAttendance.js';
import connectDB from '../config/database.js';

dotenv.config();

const generateAttendanceRecords = () => {
  const records = [];
  const students = [
    { id: new mongoose.Types.ObjectId(), admissionNo: 'AD9892434', rollNo: '35013', name: 'Janet', class: 'III', section: 'A' },
    { id: new mongoose.Types.ObjectId(), admissionNo: 'AD9892433', rollNo: '35012', name: 'Joann', class: 'IV', section: 'A' },
    { id: new mongoose.Types.ObjectId(), admissionNo: 'AD9892432', rollNo: '35011', name: 'Kathleen', class: 'III', section: 'A' },
    { id: new mongoose.Types.ObjectId(), admissionNo: 'AD9892431', rollNo: '35010', name: 'Gifford', class: 'IV', section: 'B' },
    { id: new mongoose.Types.ObjectId(), admissionNo: 'AD9892430', rollNo: '35009', name: 'Hamish', class: 'III', section: 'A' },
    { id: new mongoose.Types.ObjectId(), admissionNo: 'AD9892429', rollNo: '35008', name: 'Edward', class: 'IV', section: 'A' },
    { id: new mongoose.Types.ObjectId(), admissionNo: 'AD9892428', rollNo: '35007', name: 'Bethany', class: 'III', section: 'B' },
    { id: new mongoose.Types.ObjectId(), admissionNo: 'AD9892427', rollNo: '35006', name: 'Ralph', class: 'IV', section: 'B' }
  ];

  const attendanceStatuses = ['present', 'late', 'absent', 'halfday'];
  const institutionId = new mongoose.Types.ObjectId();
  const markedBy = new mongoose.Types.ObjectId();
  const academicYear = '2024 / 2025';

  // Generate attendance for last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    students.forEach(student => {
      // Random attendance with higher probability of present
      const random = Math.random();
      let attendance;
      if (random < 0.75) attendance = 'present';
      else if (random < 0.85) attendance = 'late';
      else if (random < 0.95) attendance = 'halfday';
      else attendance = 'absent';

      records.push({
        studentId: student.id,
        admissionNo: student.admissionNo,
        rollNo: student.rollNo,
        studentName: student.name,
        className: student.class,
        section: student.section,
        date,
        attendance,
        notes: attendance === 'absent' ? 'Sick leave' : attendance === 'late' ? 'Traffic delay' : '',
        markedBy,
        markedByName: 'Admin User',
        academicYear,
        institutionId
      });
    });
  }

  return records;
};

const seedStudentAttendance = async () => {
  try {
    await connectDB();
    
    await StudentAttendance.deleteMany({});
    console.log('Existing attendance records deleted');
    
    const records = generateAttendanceRecords();
    const attendance = await StudentAttendance.insertMany(records);
    console.log(`${attendance.length} attendance records created successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding student attendance:', error);
    process.exit(1);
  }
};

seedStudentAttendance();
