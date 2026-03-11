import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ClassRoom from '../models/ClassRoom.js';

dotenv.config();

const sampleRooms = [
  { roomNo: '101', capacity: 50, status: 'active', building: 'Main Building', floor: 1, roomType: 'classroom', facilities: ['projector', 'whiteboard', 'ac'] },
  { roomNo: '102', capacity: 40, status: 'active', building: 'Main Building', floor: 1, roomType: 'classroom', facilities: ['whiteboard', 'ac'] },
  { roomNo: '108', capacity: 40, status: 'active', building: 'Main Building', floor: 1, roomType: 'classroom', facilities: ['smartboard', 'ac', 'wifi'] },
  { roomNo: '109', capacity: 40, status: 'active', building: 'Main Building', floor: 1, roomType: 'classroom', facilities: ['projector', 'whiteboard'] },
  { roomNo: '110', capacity: 50, status: 'active', building: 'Main Building', floor: 1, roomType: 'classroom', facilities: ['smartboard', 'ac', 'wifi', 'audio-system'] },
  { roomNo: '201', capacity: 45, status: 'active', building: 'Main Building', floor: 2, roomType: 'classroom', facilities: ['projector', 'whiteboard', 'ac'] },
  { roomNo: '202', capacity: 45, status: 'active', building: 'Main Building', floor: 2, roomType: 'classroom', facilities: ['whiteboard', 'ac'] },
  { roomNo: 'LAB-1', capacity: 30, status: 'active', building: 'Science Block', floor: 1, roomType: 'laboratory', facilities: ['computers', 'wifi', 'ac'] },
  { roomNo: 'LAB-2', capacity: 30, status: 'active', building: 'Science Block', floor: 1, roomType: 'computer-lab', facilities: ['computers', 'wifi', 'ac', 'projector'] },
  { roomNo: 'AUD-1', capacity: 200, status: 'active', building: 'Main Building', floor: 0, roomType: 'auditorium', facilities: ['projector', 'audio-system', 'ac', 'wifi'] }
];

const seedClassRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await ClassRoom.deleteMany({});
    console.log('Cleared existing class rooms');

    const institutionId = new mongoose.Types.ObjectId();
    const academicYear = '2024/2025';

    const roomsWithInstitution = sampleRooms.map(room => ({
      ...room,
      institutionId,
      academicYear,
      currentOccupancy: 0
    }));

    const rooms = await ClassRoom.insertMany(roomsWithInstitution);
    console.log(`Seeded ${rooms.length} class rooms`);

    const statistics = await ClassRoom.aggregate([
      {
        $group: {
          _id: '$roomType',
          count: { $sum: 1 },
          totalCapacity: { $sum: '$capacity' }
        }
      }
    ]);

    console.log('\nClass Room Statistics:');
    statistics.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} rooms, Total Capacity: ${stat.totalCapacity}`);
    });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding class rooms:', error);
    process.exit(1);
  }
};

seedClassRooms();
