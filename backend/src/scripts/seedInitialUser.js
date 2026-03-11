/**
 * Create initial superadmin user if none exists (no data wipe).
 * Use for first-time setup: npm run seed:initial
 */
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

const SUPERADMIN = {
  name: 'Super Admin',
  email: 'superadmin@eduadmin.com',
  password: 'Admin@123',
  role: 'superadmin',
  plan: 'premium',
  permissions: ['*'],
  modules: [],
  status: 'active'
};

const seedInitialUser = async () => {
  try {
    await connectDB();
    const existing = await User.findOne({ role: 'superadmin' });
    if (existing) {
      console.log('Superadmin already exists:', existing.email);
      process.exit(0);
      return;
    }
    await User.create(SUPERADMIN);
    console.log('Initial superadmin created.');
    console.log('Login:', SUPERADMIN.email, '/', SUPERADMIN.password);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedInitialUser();
