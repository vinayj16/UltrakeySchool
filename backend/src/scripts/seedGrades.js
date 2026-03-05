import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Grade from '../models/Grade.js';
import Institution from '../models/Institution.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedGrades = async () => {
  try {
    await connectDB();

    await Grade.deleteMany({});
    console.log('Existing grades deleted');

    const institutions = await Institution.find().limit(3);
    
    if (institutions.length === 0) {
      console.log('No institutions found. Please seed institutions first.');
      process.exit(1);
    }

    const grades = [
      {
        grade: 'O',
        marksFrom: 90,
        marksTo: 100,
        points: 10,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id,
        displayOrder: 1,
        description: 'Outstanding performance'
      },
      {
        grade: 'A+',
        marksFrom: 80,
        marksTo: 89,
        points: 9,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id,
        displayOrder: 2,
        description: 'Excellent performance'
      },
      {
        grade: 'A',
        marksFrom: 70,
        marksTo: 79,
        points: 8,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id,
        displayOrder: 3,
        description: 'Very good performance'
      },
      {
        grade: 'B+',
        marksFrom: 60,
        marksTo: 69,
        points: 7,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id,
        displayOrder: 4,
        description: 'Good performance'
      },
      {
        grade: 'B',
        marksFrom: 50,
        marksTo: 59,
        points: 6,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id,
        displayOrder: 5,
        description: 'Above average performance'
      },
      {
        grade: 'C+',
        marksFrom: 40,
        marksTo: 49,
        points: 5,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id,
        displayOrder: 6,
        description: 'Average performance'
      },
      {
        grade: 'C',
        marksFrom: 35,
        marksTo: 39,
        points: 4,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id,
        displayOrder: 7,
        description: 'Pass'
      },
      {
        grade: 'F',
        marksFrom: 0,
        marksTo: 34,
        points: 0,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id,
        displayOrder: 8,
        description: 'Fail'
      },
      {
        grade: 'A',
        marksFrom: 85,
        marksTo: 100,
        points: 10,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[1]._id,
        displayOrder: 1,
        description: 'Excellent'
      },
      {
        grade: 'B',
        marksFrom: 70,
        marksTo: 84,
        points: 8,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[1]._id,
        displayOrder: 2,
        description: 'Good'
      },
      {
        grade: 'C',
        marksFrom: 55,
        marksTo: 69,
        points: 6,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[1]._id,
        displayOrder: 3,
        description: 'Average'
      },
      {
        grade: 'D',
        marksFrom: 40,
        marksTo: 54,
        points: 4,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[1]._id,
        displayOrder: 4,
        description: 'Pass'
      },
      {
        grade: 'F',
        marksFrom: 0,
        marksTo: 39,
        points: 0,
        status: 'active',
        academicYear: '2024/2025',
        institutionId: institutions[1]._id,
        displayOrder: 5,
        description: 'Fail'
      }
    ];

    const createdGrades = await Grade.insertMany(grades);
    console.log(`${createdGrades.length} grades created successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding grades:', error);
    process.exit(1);
  }
};

seedGrades();
