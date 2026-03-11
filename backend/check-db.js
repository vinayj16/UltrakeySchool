import mongoose from 'mongoose';
import UserCredential from './src/models/UserCredential.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function checkCredentials() {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edusearch');
    console.log('✅ Connected to database');

    console.log('📊 Checking UserCredential collection...');
    const count = await UserCredential.countDocuments();
    console.log('📈 Total credentials:', count);

    if (count > 0) {
      console.log('📋 All credentials:');
      const creds = await UserCredential.find({}).select('userId email role status hasLoggedIn createdAt');
      creds.forEach((cred, index) => {
        console.log(`  ${index + 1}. ID: ${cred.userId}, Email: ${cred.email}, Role: ${cred.role}, Status: ${cred.status}, LoggedIn: ${cred.hasLoggedIn}`);
      });

      // Test login query
      console.log('\n🔍 Testing login queries...');
      const superadminCred = await UserCredential.findOne({ role: 'superadmin' });
      if (superadminCred) {
        console.log(`✅ Found superadmin: ${superadminCred.email} (${superadminCred.role})`);
        console.log(`   Password hash length: ${superadminCred.password.length}`);
      } else {
        console.log('❌ No superadmin credentials found');
      }

      const institutionCreds = await UserCredential.find({ role: 'institution_admin' });
      if (institutionCreds.length > 0) {
        console.log(`✅ Found ${institutionCreds.length} institution admin credentials`);
        institutionCreds.forEach((cred, index) => {
          console.log(`   ${index + 1}. ${cred.email} - Status: ${cred.status}`);
        });
      } else {
        console.log('❌ No institution admin credentials found');
      }
    } else {
      console.log('⚠️ No credentials found in database');
      console.log('💡 You need to create credentials first');
    }

    await mongoose.disconnect();
    console.log('\n✅ Check completed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

checkCredentials();
