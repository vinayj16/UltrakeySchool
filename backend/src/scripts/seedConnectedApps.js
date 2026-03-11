import mongoose from 'mongoose';
import ConnectedApp from '../models/ConnectedApp.js';
import dotenv from 'dotenv';

dotenv.config();

const defaultApps = [
  {
    name: 'slack',
    displayName: 'Slack',
    description: 'Team communication platform with channels for group discussions and direct messaging.',
    logo: '/assets/img/icons/connected-app-01.svg',
    category: 'communication',
    isGlobal: true,
    isConnected: false,
    status: 'active'
  },
  {
    name: 'google-calendar',
    displayName: 'Google Calendar',
    description: 'Google Calendar is a web-based scheduling tool that allows users to create, manage, and share events.',
    logo: '/assets/img/icons/connected-app-02.svg',
    category: 'calendar',
    isGlobal: true,
    isConnected: false,
    status: 'active'
  },
  {
    name: 'gmail',
    displayName: 'Gmail',
    description: 'Gmail is a free email service by Google that offers robust spam protection & 15GB of storage.',
    logo: '/assets/img/icons/connected-app-03.svg',
    category: 'email',
    isGlobal: true,
    isConnected: false,
    status: 'active'
  },
  {
    name: 'github',
    displayName: 'GitHub',
    description: 'GitHub is a web-based platform for version control and collaboration, allowing developers to host and review code.',
    logo: '/assets/img/icons/connected-app-04.svg',
    category: 'development',
    isGlobal: true,
    isConnected: false,
    status: 'active'
  }
];

async function seedConnectedApps() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing global apps
    await ConnectedApp.deleteMany({ isGlobal: true });
    console.log('Cleared existing global connected apps');

    // Insert default apps
    const apps = await ConnectedApp.insertMany(defaultApps);
    console.log(`Seeded ${apps.length} connected apps successfully`);

    console.log('\nSeeded Apps:');
    apps.forEach(app => {
      console.log(`- ${app.displayName} (${app.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding connected apps:', error);
    process.exit(1);
  }
}

seedConnectedApps();
