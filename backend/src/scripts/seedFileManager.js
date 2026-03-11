import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FileManager from '../models/FileManager.js';
import connectDB from '../config/database.js';

dotenv.config();

const BASE_URL = 'https://preskool.dreamstechnologies.com/html/template/assets/img';

const sampleItems = [
  {
    name: 'Project Details',
    type: 'folder',
    size: 28311552,
    fileCount: 208,
    ownerId: new mongoose.Types.ObjectId(),
    ownerName: 'Janet',
    ownerImg: `${BASE_URL}/students/student-01.jpg`,
    members: [
      { userId: new mongoose.Types.ObjectId(), name: 'Member 1', img: `${BASE_URL}/profiles/avatar-02.jpg`, role: 'Editor' },
      { userId: new mongoose.Types.ObjectId(), name: 'Member 2', img: `${BASE_URL}/profiles/avatar-01.jpg`, role: 'Viewer' }
    ],
    tags: ['project', 'important'],
    isFavorite: true,
    isShared: true,
    permissions: 'admin',
    color: '#007bff',
    description: 'Main project documentation and planning files'
  },
  {
    name: 'Website Backup',
    type: 'folder',
    size: 629145600,
    fileCount: 48,
    ownerId: new mongoose.Types.ObjectId(),
    ownerName: 'Janet',
    ownerImg: `${BASE_URL}/students/student-01.jpg`,
    members: [
      { userId: new mongoose.Types.ObjectId(), name: 'Member 1', img: `${BASE_URL}/profiles/avatar-11.jpg`, role: 'Editor' },
      { userId: new mongoose.Types.ObjectId(), name: 'Member 2', img: `${BASE_URL}/profiles/avatar-12.jpg`, role: 'Editor' }
    ],
    tags: ['backup', 'website'],
    isFavorite: false,
    isShared: false,
    permissions: 'admin',
    color: '#28a745',
    description: 'Complete website backup files'
  },
  {
    name: 'hsa.pdf',
    type: 'file',
    fileType: 'pdf',
    icon: `${BASE_URL}/icons/pdf-02.svg`,
    size: 157286400,
    ownerId: new mongoose.Types.ObjectId(),
    ownerName: 'Janet',
    ownerImg: `${BASE_URL}/students/student-01.jpg`,
    tags: ['document', 'important'],
    isFavorite: false,
    isShared: false,
    permissions: 'write',
    downloadUrl: '/files/hsa.pdf',
    thumbnail: `${BASE_URL}/thumbnails/pdf-thumb.png`,
    metadata: { pages: 45, description: 'Health Services Agreement' }
  },
  {
    name: 'Estimation.xlsx',
    type: 'file',
    fileType: 'xls',
    icon: `${BASE_URL}/icons/xls.svg`,
    size: 524288,
    ownerId: new mongoose.Types.ObjectId(),
    ownerName: 'Henriques',
    ownerImg: `${BASE_URL}/profiles/avatar-01.jpg`,
    tags: ['spreadsheet', 'finance'],
    isFavorite: true,
    isShared: true,
    permissions: 'write',
    downloadUrl: '/files/estimation.xlsx',
    metadata: { description: 'Project cost estimation' }
  },
  {
    name: 'Intro.pdf',
    type: 'file',
    fileType: 'pdf',
    icon: `${BASE_URL}/icons/pdf-02.svg`,
    size: 157286400,
    ownerId: new mongoose.Types.ObjectId(),
    ownerName: 'Nolan Harris',
    ownerImg: `${BASE_URL}/profiles/avatar-02.jpg`,
    tags: ['presentation', 'introduction'],
    isFavorite: false,
    isShared: false,
    permissions: 'read',
    downloadUrl: '/files/intro.pdf',
    thumbnail: `${BASE_URL}/thumbnails/pdf-thumb.png`,
    metadata: { pages: 25, description: 'Company introduction presentation' }
  },
  {
    name: 'Demo_Working.mp4',
    type: 'file',
    fileType: 'video',
    icon: `${BASE_URL}/icons/video.svg`,
    size: 262144000,
    ownerId: new mongoose.Types.ObjectId(),
    ownerName: 'Sarah',
    ownerImg: `${BASE_URL}/profiles/avatar-03.jpg`,
    tags: ['video', 'demo', 'presentation'],
    isFavorite: true,
    isShared: true,
    permissions: 'read',
    downloadUrl: '/files/demo-working.mp4',
    thumbnail: `${BASE_URL}/file-manager/video2.jpg`,
    metadata: { duration: 180, dimensions: { width: 1920, height: 1080 }, description: 'Product demo video' }
  },
  {
    name: 'voice.mp3',
    type: 'file',
    fileType: 'audio',
    icon: `${BASE_URL}/icons/audio.svg`,
    size: 188743680,
    ownerId: new mongoose.Types.ObjectId(),
    ownerName: 'William',
    ownerImg: `${BASE_URL}/profiles/avatar-04.jpg`,
    tags: ['audio', 'recording'],
    isFavorite: false,
    isShared: false,
    permissions: 'write',
    downloadUrl: '/files/voice.mp3',
    metadata: { duration: 5400, description: 'Voice recording notes' }
  },
  {
    name: 'Design Assets',
    type: 'folder',
    size: 104857600,
    fileCount: 35,
    ownerId: new mongoose.Types.ObjectId(),
    ownerName: 'Designer',
    ownerImg: `${BASE_URL}/profiles/avatar-05.jpg`,
    tags: ['design', 'assets'],
    isFavorite: true,
    isShared: true,
    permissions: 'write',
    color: '#6f42c1',
    description: 'UI/UX design assets and mockups'
  }
];

const seedFileManager = async () => {
  try {
    await connectDB();
    
    await FileManager.deleteMany({});
    console.log('Existing file manager items deleted');
    
    const items = await FileManager.insertMany(sampleItems);
    console.log(`${items.length} file manager items created successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding file manager:', error);
    process.exit(1);
  }
};

seedFileManager();
