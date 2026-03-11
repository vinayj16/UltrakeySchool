import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Religion from '../models/Religion.js';

dotenv.config();

const sampleReligions = [
  { name: 'Hindu', code: 'HIN', status: 'active', displayOrder: 1, description: 'Hinduism' },
  { name: 'Christian', code: 'CHR', status: 'active', displayOrder: 2, description: 'Christianity' },
  { name: 'Islam', code: 'ISL', status: 'active', displayOrder: 3, description: 'Islam' },
  { name: 'Buddhist', code: 'BUD', status: 'active', displayOrder: 4, description: 'Buddhism' },
  { name: 'Sikh', code: 'SIK', status: 'active', displayOrder: 5, description: 'Sikhism' },
  { name: 'Jain', code: 'JAI', status: 'active', displayOrder: 6, description: 'Jainism' },
  { name: 'Jewish', code: 'JEW', status: 'active', displayOrder: 7, description: 'Judaism' },
  { name: 'Other', code: 'OTH', status: 'active', displayOrder: 8, description: 'Other religions' },
  { name: 'Prefer not to say', code: 'PNS', status: 'active', displayOrder: 9, description: 'Prefer not to disclose' }
];

const seedReligions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Religion.deleteMany({});
    console.log('Cleared existing religions');

    const religions = await Religion.insertMany(sampleReligions);
    console.log(`Seeded ${religions.length} religions`);

    const statistics = await Religion.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\nReligion Statistics:');
    statistics.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count}`);
    });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding religions:', error);
    process.exit(1);
  }
};

seedReligions();
