/**
 * Create Initial Super Admin User
 * Run this script once to create the first superadmin account
 * 
 * Usage: node src/scripts/createSuperAdmin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('../models/User');

const SUPERADMIN_DATA = {
  name: 'Super Administrator',
  email: 'superadmin@ultrakey.com',
  password: 'SuperAdmin@123', // Change this!
  role: 'SUPER_ADMIN',
  status: 'active',
  isEmailVerified: true,
  permissions: ['*'], // All permissions
  modules: ['*'], // All modules
  plan: 'premium'
};

async function createSuperAdmin() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edusearch', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Connected to MongoDB');

    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ 
      role: 'SUPER_ADMIN',
      email: SUPERADMIN_DATA.email 
    });

    if (existingSuperAdmin) {
      console.log('⚠ Super Admin already exists!');
      console.log('Email:', existingSuperAdmin.email);
      console.log('Name:', existingSuperAdmin.name);
      console.log('\nIf you forgot the password, delete this user from MongoDB and run this script again.');
      process.exit(0);
    }

    // Hash password
    console.log('\nCreating Super Admin user...');
    const hashedPassword = await bcrypt.hash(SUPERADMIN_DATA.password, 10);

    // Create superadmin user
    const superAdmin = await User.create({
      ...SUPERADMIN_DATA,
      password: hashedPassword
    });

    console.log('\n✓ Super Admin created successfully!');
    console.log('\n═══════════════════════════════════════');
    console.log('  LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════════');
    console.log('Email:', SUPERADMIN_DATA.email);
    console.log('Password:', SUPERADMIN_DATA.password);
    console.log('═══════════════════════════════════════');
    console.log('\n⚠ IMPORTANT: Change the password after first login!');
    console.log('\nYou can now:');
    console.log('1. Login at http://localhost:5173/login');
    console.log('2. Create schools and assign admins');
    console.log('3. School admins can then create teachers, students, etc.');

    process.exit(0);
  } catch (error) {
    console.error('\n✗ Error creating Super Admin:', error.message);
    process.exit(1);
  }
}

// Run the script
createSuperAdmin();
