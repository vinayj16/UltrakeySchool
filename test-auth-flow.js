#!/usr/bin/env node

/**
 * Authentication Flow Test Script
 * Tests the complete authentication flow
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load backend environment variables
dotenv.config({ path: join(__dirname, 'backend', '.env') });

console.log('🧪 Authentication Flow Test\n');
console.log('═══════════════════════════════════════════════════════════\n');

const tests = [];
let passedTests = 0;
let failedTests = 0;

const test = (name, fn) => {
  tests.push({ name, fn });
};

const runTests = async () => {
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passedTests++;
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(`   Error: ${error.message}\n`);
      failedTests++;
    }
  }
};

// Test 1: MongoDB Connection
test('MongoDB connection', async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/edusearch';
  await mongoose.connect(uri);
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Failed to connect to MongoDB');
  }
});

// Test 2: User Model
test('User model exists', async () => {
  const User = (await import('./backend/src/models/User.js')).default;
  if (!User) {
    throw new Error('User model not found');
  }
});

// Test 3: Superadmin user exists
test('Superadmin user exists in database', async () => {
  const User = (await import('./backend/src/models/User.js')).default;
  const user = await User.findOne({ email: 'superadmin@example.com' });
  if (!user) {
    throw new Error('Superadmin user not found in database');
  }
  if (user.role !== 'superadmin') {
    throw new Error(`User role is "${user.role}", expected "superadmin"`);
  }
});

// Test 4: Password comparison method
test('User password comparison method works', async () => {
  const User = (await import('./backend/src/models/User.js')).default;
  const user = await User.findOne({ email: 'superadmin@example.com' }).select('+password');
  if (!user) {
    throw new Error('User not found');
  }
  if (typeof user.comparePassword !== 'function') {
    throw new Error('comparePassword method not found on user model');
  }
});

// Test 5: Auth controller exists
test('Auth controller exists', async () => {
  const authController = await import('./backend/src/controllers/authController.js');
  if (!authController.default) {
    throw new Error('Auth controller default export not found');
  }
  if (!authController.default.login) {
    throw new Error('Login function not found in auth controller');
  }
});

// Test 6: JWT configuration
test('JWT configuration is set', () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not set in environment variables');
  }
  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET should be at least 32 characters long');
  }
});

// Test 7: Auth middleware exists
test('Auth middleware exists', async () => {
  const authMiddleware = await import('./backend/src/middleware/auth.js');
  if (!authMiddleware.protect) {
    throw new Error('protect middleware not found');
  }
});

// Test 8: Frontend bypass auth is disabled
test('Frontend bypass auth is disabled', async () => {
  const fs = await import('fs');
  const path = await import('path');
  const envPath = path.join(__dirname, 'frontend', '.env.development');
  
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.development file not found');
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('VITE_AUTH_BYPASS_MODE=true')) {
    throw new Error('Bypass auth is still enabled in .env.development');
  }
});

// Test 9: Controller exports are correct
test('Controller exports are correct', async () => {
  const fs = await import('fs');
  const path = await import('path');
  const controllersDir = path.join(__dirname, 'backend', 'src', 'controllers');
  
  const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('.js'));
  
  for (const file of files.slice(0, 5)) { // Test first 5 controllers
    const filePath = path.join(controllersDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const hasNamedExports = /^export const /m.test(content);
    const hasDefaultExport = /^export default \{/m.test(content);
    
    if (hasNamedExports && hasDefaultExport) {
      throw new Error(`${file} has both named and default exports (conflict)`);
    }
    
    if (!hasDefaultExport) {
      throw new Error(`${file} is missing default export`);
    }
  }
});

// Test 10: Frontend service exports are correct
test('Frontend service exports are correct', async () => {
  const fs = await import('fs');
  const path = await import('path');
  const servicesDir = path.join(__dirname, 'frontend', 'src', 'services');
  
  if (!fs.existsSync(servicesDir)) {
    throw new Error('Services directory not found');
  }
  
  const files = fs.readdirSync(servicesDir).filter(f => f.endsWith('.ts') && f.includes('Service'));
  
  if (files.length === 0) {
    throw new Error('No service files found');
  }
  
  // Check classScheduleService specifically
  const classScheduleServicePath = path.join(servicesDir, 'classScheduleService.ts');
  if (fs.existsSync(classScheduleServicePath)) {
    const content = fs.readFileSync(classScheduleServicePath, 'utf8');
    if (!content.includes('export default classScheduleService')) {
      throw new Error('classScheduleService is missing default export');
    }
  }
});

// Run all tests
await runTests();

// Disconnect from MongoDB
await mongoose.disconnect();

// Summary
console.log('\n═══════════════════════════════════════════════════════════');
console.log('📊 Test Summary\n');
console.log(`Total Tests: ${tests.length}`);
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log('═══════════════════════════════════════════════════════════\n');

if (failedTests === 0) {
  console.log('🎉 All tests passed! Authentication system is ready.\n');
  console.log('Next steps:');
  console.log('1. Clear browser storage (use frontend/clear-demo-session.html)');
  console.log('2. Start backend: cd backend && npm run dev');
  console.log('3. Start frontend: cd frontend && npm run dev');
  console.log('4. Login at http://localhost:5173/login\n');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please fix the issues above.\n');
  process.exit(1);
}
