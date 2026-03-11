import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Todo from '../models/Todo.js';
import connectDB from '../config/database.js';

dotenv.config();

const sampleTodos = [
  {
    title: 'Meeting with Shaun Park at 4:50pm',
    description: 'Discuss about new project requirements and timeline',
    priority: 'high',
    status: 'new',
    userId: new mongoose.Types.ObjectId(),
    userName: 'Shaun Park',
    userAvatar: '/assets/img/users/user-24.jpg',
    important: false,
    dueDate: new Date(Date.now() + 86400000)
  },
  {
    title: 'Team meet at Starbucks',
    description: 'Discuss about new project implementation strategy',
    priority: 'high',
    status: 'pending',
    userId: new mongoose.Types.ObjectId(),
    userName: 'Team Member',
    userAvatar: '/assets/img/profiles/avatar-02.jpg',
    important: true,
    dueDate: new Date(Date.now() + 172800000)
  },
  {
    title: 'New User Registered',
    description: 'Add new user to the system and configure permissions',
    priority: 'high',
    status: 'pending',
    userId: new mongoose.Types.ObjectId(),
    userName: 'Admin',
    userAvatar: '/assets/img/profiles/avatar-03.jpg',
    important: true,
    tags: ['admin', 'user-management']
  },
  {
    title: 'Download Complete',
    description: 'Install console machines and prerequisite softwares',
    priority: 'high',
    status: 'inprogress',
    userId: new mongoose.Types.ObjectId(),
    userName: 'Developer',
    userAvatar: '/assets/img/profiles/avatar-04.jpg',
    important: true,
    tags: ['installation', 'setup']
  },
  {
    title: 'Meet Lisa to discuss project details',
    description: 'Discuss about additional features and requirements',
    priority: 'high',
    status: 'new',
    userId: new mongoose.Types.ObjectId(),
    userName: 'Lisa',
    userAvatar: '/assets/img/users/user-30.jpg',
    important: true,
    dueDate: new Date(Date.now() + 259200000)
  },
  {
    title: 'Code Review Session',
    description: 'Review pull requests and provide feedback',
    priority: 'medium',
    status: 'pending',
    userId: new mongoose.Types.ObjectId(),
    userName: 'Tech Lead',
    userAvatar: '/assets/img/profiles/avatar-05.jpg',
    important: false,
    tags: ['code-review', 'development']
  },
  {
    title: 'Update Documentation',
    description: 'Update API documentation with new endpoints',
    priority: 'low',
    status: 'new',
    userId: new mongoose.Types.ObjectId(),
    userName: 'Developer',
    userAvatar: '/assets/img/profiles/avatar-06.jpg',
    important: false,
    tags: ['documentation']
  },
  {
    title: 'Database Backup',
    description: 'Perform weekly database backup and verification',
    priority: 'high',
    status: 'done',
    completed: true,
    userId: new mongoose.Types.ObjectId(),
    userName: 'IT Team',
    userAvatar: '/assets/img/profiles/avatar-07.jpg',
    important: true,
    tags: ['backup', 'maintenance'],
    completedAt: new Date(Date.now() - 86400000)
  },
  {
    title: 'Old Task',
    description: 'This task is no longer needed',
    priority: 'low',
    status: 'trash',
    userId: new mongoose.Types.ObjectId(),
    userName: 'Manager',
    userAvatar: '/assets/img/profiles/avatar-08.jpg',
    important: false,
    deletedAt: new Date(Date.now() - 172800000)
  },
  {
    title: 'Prepare Presentation',
    description: 'Create slides for quarterly review meeting',
    priority: 'medium',
    status: 'inprogress',
    userId: new mongoose.Types.ObjectId(),
    userName: 'Manager',
    userAvatar: '/assets/img/profiles/avatar-09.jpg',
    important: true,
    tags: ['presentation', 'meeting'],
    dueDate: new Date(Date.now() + 432000000)
  }
];

const seedTodos = async () => {
  try {
    await connectDB();
    
    await Todo.deleteMany({});
    console.log('Existing todos deleted');
    
    const todos = await Todo.insertMany(sampleTodos);
    console.log(`${todos.length} todos created successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding todos:', error);
    process.exit(1);
  }
};

seedTodos();
