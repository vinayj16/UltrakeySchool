import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Note from '../models/Note.js';
import connectDB from '../config/database.js';

dotenv.config();

const sampleNotes = [
  {
    title: 'Plan a trip to another country',
    description: 'Space, the final frontier. These are the voyages of the Starship Enterprise.',
    priority: 'medium',
    tag: 'personal',
    status: 'active',
    userId: new mongoose.Types.ObjectId(),
    userName: 'John Doe',
    userAvatar: '/assets/img/profiles/avatar-01.jpg',
    important: true
  },
  {
    title: 'Improve touch typing',
    description: 'Well, the way they make shows is, they make one show.',
    priority: 'low',
    tag: 'work',
    status: 'active',
    userId: new mongoose.Types.ObjectId(),
    userName: 'Jane Smith',
    userAvatar: '/assets/img/profiles/avatar-02.jpg',
    important: true
  },
  {
    title: 'Learn calligraphy',
    description: 'Calligraphy, the art of beautiful handwriting. The term may derive from the Greek words.',
    priority: 'low',
    tag: 'social',
    status: 'active',
    userId: new mongoose.Types.ObjectId(),
    userName: 'Mike Johnson',
    userAvatar: '/assets/img/profiles/avatar-03.jpg',
    important: true
  },
  {
    title: 'Backup Files EOD',
    description: 'Project files should be took backup before end of the day.',
    priority: 'high',
    tag: 'personal',
    status: 'active',
    userId: new mongoose.Types.ObjectId(),
    userName: 'Sarah Wilson',
    userAvatar: '/assets/img/profiles/avatar-05.jpg',
    important: true
  },
  {
    title: 'Download Server Logs',
    description: 'Server log is a text document that contains a record of all activity.',
    priority: 'low',
    tag: 'work',
    status: 'active',
    userId: new mongoose.Types.ObjectId(),
    userName: 'Tom Brown',
    userAvatar: '/assets/img/profiles/avatar-06.jpg',
    important: true
  },
  {
    title: 'Team meet at Starbucks',
    description: 'Meeting all teamets at Starbucks for identifying them all.',
    priority: 'medium',
    tag: 'social',
    status: 'active',
    userId: new mongoose.Types.ObjectId(),
    userName: 'Emily Davis',
    userAvatar: '/assets/img/profiles/avatar-07.jpg',
    important: true
  },
  {
    title: 'Create a compost pile',
    description: 'Compost pile refers to fruit and vegetable scraps, used tea, coffee grounds etc..',
    priority: 'high',
    tag: 'social',
    status: 'trash',
    userId: new mongoose.Types.ObjectId(),
    userName: 'Chris Martin',
    userAvatar: '/assets/img/profiles/avatar-08.jpg',
    important: true,
    deletedAt: new Date(Date.now() - 86400000)
  },
  {
    title: 'Take a hike at a local park',
    description: 'Hiking involves a long energetic walk in a natural environment.',
    priority: 'low',
    tag: 'personal',
    status: 'trash',
    userId: new mongoose.Types.ObjectId(),
    userName: 'Lisa Anderson',
    userAvatar: '/assets/img/profiles/avatar-09.jpg',
    important: true,
    deletedAt: new Date(Date.now() - 172800000)
  },
  {
    title: 'Research a topic interested',
    description: 'Research a topic interested by listen actively and attentively.',
    priority: 'medium',
    tag: 'work',
    status: 'trash',
    userId: new mongoose.Types.ObjectId(),
    userName: 'David Lee',
    userAvatar: '/assets/img/profiles/avatar-10.jpg',
    important: true,
    deletedAt: new Date(Date.now() - 259200000)
  },
  {
    title: 'Weekly Team Standup',
    description: 'Discuss progress, blockers, and upcoming tasks with the team.',
    priority: 'medium',
    tag: 'work',
    status: 'active',
    userId: new mongoose.Types.ObjectId(),
    userName: 'Project Manager',
    userAvatar: '/assets/img/profiles/avatar-11.jpg',
    important: false
  }
];

const seedNotes = async () => {
  try {
    await connectDB();
    
    await Note.deleteMany({});
    console.log('Existing notes deleted');
    
    const notes = await Note.insertMany(sampleNotes);
    console.log(`${notes.length} notes created successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding notes:', error);
    process.exit(1);
  }
};

seedNotes();
