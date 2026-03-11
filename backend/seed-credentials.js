import mongoose from 'mongoose';
import UserCredential from './src/models/UserCredential.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function seedCredentials() {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edusearch');
    console.log('✅ Connected to database');

    // Create default superadmin credential
    const superadminData = {
      userId: 'superadmin-001',
      email: 'superadmin@ultrakey.com',
      password: 'Admin@ultrakey123', // Plain password, will be hashed by auth service if needed
      role: 'superadmin',
      permissions: ['read', 'write', 'manage_students', 'manage_staff', 'manage_finances', 'manage_library'],
      instituteType: 'System',
      instituteCode: 'SYS001',
      fullName: 'System Administrator',
      status: 'active',
      hasLoggedIn: false
    };

    // Check if superadmin already exists
    const existingSuperadmin = await UserCredential.findOne({ role: 'superadmin' });
    if (existingSuperadmin) {
      console.log('⚠️ Superadmin credential already exists, skipping...');
    } else {
      const superadmin = new UserCredential(superadminData);
      await superadmin.save();
      console.log('✅ Created superadmin credential:');
      console.log(`   Email: ${superadmin.email}`);
      console.log(`   Password: ${superadminData.password}`);
      console.log(`   Role: ${superadmin.role}`);
    }

    // Create sample institution admin credential
    const institutionData = {
      userId: 'inst-001',
      email: 'admin@school.edu',
      password: 'Admin@school123',
      role: 'institution_admin',
      permissions: ['read', 'write', 'manage_students'],
      instituteType: 'School',
      instituteCode: 'SCH001',
      fullName: 'School Administrator',
      status: 'active',
      hasLoggedIn: false
    };

    // Check if institution admin already exists
    const existingInstitution = await UserCredential.findOne({ email: institutionData.email });
    if (existingInstitution) {
      console.log('⚠️ Institution admin credential already exists, skipping...');
    } else {
      const institution = new UserCredential(institutionData);
      await institution.save();
      console.log('✅ Created institution admin credential:');
      console.log(`   Email: ${institution.email}`);
      console.log(`   Password: ${institutionData.password}`);
      console.log(`   Role: ${institution.role}`);
    }

    // Show all credentials
    console.log('\n📋 All credentials in database:');
    const allCreds = await UserCredential.find({}).select('userId email role status hasLoggedIn');
    allCreds.forEach((cred, index) => {
      console.log(`  ${index + 1}. ${cred.email} (${cred.role}) - Status: ${cred.status}, LoggedIn: ${cred.hasLoggedIn}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Seeding completed successfully!');
    console.log('\n🔐 You can now login with:');
    console.log('   Superadmin: superadmin@ultrakey.com / Admin@ultrakey123');
    console.log('   Institution: admin@school.edu / Admin@school123');

  } catch (error) {
    console.error('❌ Error seeding credentials:', error.message);
    console.error('Stack:', error.stack);
  }
}

seedCredentials();
