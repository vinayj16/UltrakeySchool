import mongoose from 'mongoose';
import UserCredential from './src/models/UserCredential.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testUserCredential() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edusearch');
    console.log('✅ MongoDB connected');

    console.log('📊 Checking UserCredential collection...');
    const count = await UserCredential.countDocuments();
    console.log('📈 Total UserCredential documents:', count);

    if (count > 0) {
      console.log('📋 Sample UserCredential documents:');
      const docs = await UserCredential.find({}).limit(3).select('email role status hasLoggedIn');
      docs.forEach((doc, index) => {
        console.log(`  ${index + 1}. Email: ${doc.email}, Role: ${doc.role}, Status: ${doc.status}, LoggedIn: ${doc.hasLoggedIn}`);
      });

      // Test a specific query like the login function does
      console.log('🔍 Testing login query...');
      const testEmail = docs[0].email.toLowerCase();
      const foundUser = await UserCredential.findOne({ email: testEmail });
      if (foundUser) {
        console.log(`✅ Found user: ${foundUser.email} (${foundUser.role})`);
      } else {
        console.log(`❌ User not found with email: ${testEmail}`);
      }
    } else {
      console.log('⚠️  No UserCredential documents found. You need to create some credentials first.');
      console.log('💡 Use the SuperAdmin dashboard to create institution credentials.');
    }

    await mongoose.disconnect();
    console.log('✅ Test completed successfully');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testUserCredential();
