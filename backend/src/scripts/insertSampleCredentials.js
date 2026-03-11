/**
 * Insert sample institution credentials into MongoDB UserCredential collection
 * Run this script to create sample users for testing
 * 
 * Usage: node src/scripts/insertSampleCredentials.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import UserCredential model
const UserCredential = require('../models/UserCredential');

const SAMPLE_CREDENTIALS = [
  {
    userId: 'INST_ADMIN_001',
    email: 'admin@school.edu',
    password: 'Admin@123', // Plain password for testing
    role: 'institution_admin',
    permissions: ['read', 'write', 'manage_students', 'manage_staff', 'manage_finances'],
    instituteType: 'School',
    instituteCode: 'SCH001',
    fullName: 'School Administrator',
    status: 'active',
    emailVerified: true,
    hasLoggedIn: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 'TEACHER_001',
    email: 'teacher@school.edu',
    password: 'Teacher@123',
    role: 'teacher',
    permissions: ['read', 'write', 'manage_students'],
    instituteType: 'School',
    instituteCode: 'SCH001',
    fullName: 'John Teacher',
    status: 'active',
    emailVerified: true,
    hasLoggedIn: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 'STUDENT_001',
    email: 'student@school.edu',
    password: 'Student@123',
    role: 'student',
    permissions: ['read'],
    instituteType: 'School',
    instituteCode: 'SCH001',
    fullName: 'Jane Student',
    status: 'active',
    emailVerified: true,
    hasLoggedIn: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: 'SCHOOL_ADMIN_001',
    email: 'principal@school.edu',
    password: 'Principal@123',
    role: 'school_admin',
    permissions: ['read', 'write', 'manage_students', 'manage_staff', 'manage_finances', 'manage_library'],
    instituteType: 'School',
    instituteCode: 'SCH002',
    fullName: 'School Principal',
    status: 'active',
    emailVerified: true,
    hasLoggedIn: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function insertSampleCredentials() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edusearch', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully!');

    // Clear existing sample credentials (optional)
    console.log('Clearing existing sample credentials...');
    await UserCredential.deleteMany({ 
      userId: { $in: ['INST_ADMIN_001', 'TEACHER_001', 'STUDENT_001', 'SCHOOL_ADMIN_001'] }
    });
    console.log('Existing sample credentials cleared.');

    // Insert sample credentials
    console.log('Inserting sample credentials...');
    const insertedCredentials = await UserCredential.insertMany(SAMPLE_CREDENTIALS);
    
    console.log('✅ Sample credentials created successfully!');
    console.log('📧 Inserted', insertedCredentials.length, 'credentials:');
    
    insertedCredentials.forEach((cred, index) => {
      console.log(`\n${index + 1}. ${cred.fullName} (${cred.role})`);
      console.log('   Email:', cred.email);
      console.log('   Password:', cred.password);
      console.log('   Role:', cred.role);
      console.log('   Institution:', cred.instituteType, '-', cred.instituteCode);
      console.log('   Status:', cred.status);
    });

    console.log('\n🎯 You can now test login with these credentials:');
    console.log('   SuperAdmin: superadmin@ultrakey.com / SuperAdmin@123');
    console.log('   Institution Admin: admin@school.edu / Admin@123');
    console.log('   Teacher: teacher@school.edu / Teacher@123');
    console.log('   Student: student@school.edu / Student@123');
    console.log('   School Admin: principal@school.edu / Principal@123');
    
  } catch (error) {
    console.error('❌ Error inserting sample credentials:', error.message);
    if (error.code === 11000) {
      console.error('MongoDB connection error. Please check:');
      console.error('1. MongoDB is running');
      console.error('2. Connection string is correct');
      console.error('3. Database exists');
    }
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the function
insertSampleCredentials();
