/**
 * Seed MongoDB using the schema described in database/mongodb-data-structure.sql
 * This script is intentionally limited: it creates placeholder users, roles,
 * institutions and pending registrations so that you can inspect how the
 * collections are structured. Run it with `npm run seed:structure`.
 */

import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.MONGO_DB_NAME || 'ultrakeysedu';
const SALT_ROUNDS = 10;

const seedUsers = async (db) => {
  const plainUsers = [
    {
      name: 'System Admin',
      email: 'superadmin@ultrakeys.com',
      password: 'SuperAdmin@2026',
      role: 'superadmin',
      plan: 'premium',
      status: 'active',
      preferences: { theme: 'dark', language: 'en' }
    },
    {
      name: 'Institution Owner',
      email: 'admin@dpsschool.edu',
      password: 'SchoolAdmin#2026',
      role: 'institution_admin',
      plan: 'basic',
      status: 'active',
      preferences: { theme: 'light', language: 'en' }
    },
    {
      name: 'Math Teacher',
      email: 'maths@dpsschool.edu',
      password: 'Teacher1@2026',
      role: 'teacher',
      plan: 'basic',
      status: 'active',
      preferences: { theme: 'light', language: 'en' }
    }
  ];

  const hashedUsers = await Promise.all(
    plainUsers.map(async (user) => ({
      ...user,
      email: user.email.toLowerCase(),
      password: await bcrypt.hash(user.password, SALT_ROUNDS),
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  );

  await db.collection('users').deleteMany({ email: { $in: hashedUsers.map((u) => u.email) } });
  await db.collection('users').insertMany(hashedUsers);
};

const seedRoles = async (db) => {
  const sampleRoles = [
    {
      roleId: 'superadmin',
      name: 'Super Admin',
      description: 'System superuser with unrestricted access',
      hierarchy: 1,
      permissions: {
        dashboard: { read: true, manageUsers: true, manageSettings: true, export: true, viewReports: true, approve: true },
        academic: { read: true, update: true, manageSettings: true },
        attendance: { read: true, update: true, manageSettings: true }
      },
      defaultModules: ['dashboard', 'reports', 'institution-settings'],
      canAccessAllModules: true,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      roleId: 'institution_admin',
      name: 'Institution Administrator',
      description: 'Manages a single institute',
      hierarchy: 2,
      permissions: {
        dashboard: { read: true, manageUsers: true, viewReports: true },
        academic: { read: true, manageUsers: true },
        fees: { read: true, manageFinance: true }
      },
      defaultModules: ['dashboard', 'academic', 'fees'],
      canAccessAllModules: false,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await db.collection('roles').deleteMany({ roleId: { $in: sampleRoles.map((r) => r.roleId) } });
  await db.collection('roles').insertMany(sampleRoles);
};

const seedInstitutions = async (db) => {
  const institutions = [
    {
      name: 'UltraKey Demo School',
      type: 'SCHOOL',
      code: 'ULTRAKID',
      email: 'hello@ultrakey.app',
      phone: '+91-9876543210',
      website: 'https://ultrakey.app',
      affiliation: 'CBSE',
      accreditation: ['ISO 9001'],
      address: {
        street: '123 Innovation Drive',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        postalCode: '560001'
      },
      logo: '/assets/img/logo.png',
      status: 'ACTIVE',
      plan: 'basic',
      subscription: {
        planId: 'basic',
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        billingCycle: 'monthly',
        isActive: true,
        autoRenew: true,
        paymentMethod: 'card'
      },
      settings: {
        academicYear: '2025-2026',
        timezone: 'Asia/Kolkata',
        language: 'en',
        currency: 'INR',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await db.collection('institutions').deleteMany({ code: { $in: institutions.map((i) => i.code) } });
  await db.collection('institutions').insertMany(institutions);
};

const seedPendingRegistrations = async (db) => {
  const pending = [
    {
      instituteType: 'School',
      instituteCode: 'ULTRA2026',
      fullName: 'Anita Sharma',
      email: 'pending@school.edu',
      status: 'pending',
      agreedToTerms: true,
      registrationDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await db.collection('pendingInstitutionRegistrations').deleteMany({
    instituteCode: { $in: pending.map((p) => p.instituteCode) }
  });
  await db.collection('pendingInstitutionRegistrations').insertMany(pending);
};

const runSeeder = async () => {
  const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
  try {
    await client.connect();
    console.log(`Connected to MongoDB at ${MONGO_URI}`);
    const db = client.db(DB_NAME);

    await seedUsers(db);
    await seedRoles(db);
    await seedInstitutions(db);
    await seedPendingRegistrations(db);

    console.log('MongoDB schema documents inserted successfully');
  } catch (error) {
    console.error('Failed to seed MongoDB structure:', error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
};

runSeeder();
