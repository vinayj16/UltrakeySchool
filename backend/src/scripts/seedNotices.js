import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notice from '../models/Notice.js';
import Institution from '../models/Institution.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedNotices = async () => {
  try {
    await connectDB();

    await Notice.deleteMany({});
    console.log('Existing notices deleted');

    const institutions = await Institution.find().limit(2);
    
    if (institutions.length === 0) {
      console.log('No institutions found. Please seed institutions first.');
      process.exit(1);
    }

    const notices = [
      {
        title: 'Classes Preparation',
        description: 'Dear parents, we are pleased to inform you that classes for the new academic year will begin on June 1st, 2024. Please ensure that your child has all the necessary books and materials. We look forward to a productive year ahead.',
        noticeDate: new Date('2024-05-24'),
        publishDate: new Date('2024-05-25'),
        recipients: ['student', 'parent', 'teacher'],
        attachments: [{
          fileName: 'class_preparation.pdf',
          fileUrl: '/uploads/class_preparation.pdf',
          fileSize: 245678,
          fileType: 'application/pdf',
          uploadedAt: new Date()
        }],
        priority: 'high',
        status: 'published',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id,
        metadata: {
          createdBy: new mongoose.Types.ObjectId()
        }
      },
      {
        title: 'Fees Reminder',
        description: 'This is a gentle reminder that the school fees for the current term are due by May 31st, 2024. Please make the payment at the earliest to avoid any late fees. For any queries, please contact the accounts department.',
        noticeDate: new Date('2024-05-12'),
        publishDate: new Date('2024-05-15'),
        recipients: ['parent'],
        attachments: [{
          fileName: 'fees_structure.pdf',
          fileUrl: '/uploads/fees_structure.pdf',
          fileSize: 189234,
          fileType: 'application/pdf',
          uploadedAt: new Date()
        }],
        priority: 'medium',
        status: 'published',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id,
        metadata: {
          createdBy: new mongoose.Types.ObjectId()
        }
      },
      {
        title: 'Parent-Teacher Meeting',
        description: 'We are organizing a parent-teacher meeting on June 10th, 2024 from 10:00 AM to 2:00 PM. This is an excellent opportunity to discuss your child\'s progress and address any concerns. Your presence is highly appreciated.',
        noticeDate: new Date('2024-05-20'),
        publishDate: new Date('2024-05-22'),
        recipients: ['parent', 'teacher'],
        priority: 'high',
        status: 'published',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id,
        metadata: {
          createdBy: new mongoose.Types.ObjectId()
        }
      },
      {
        title: 'Sports Day Announcement',
        description: 'The annual sports day will be held on June 15th, 2024. All students are required to participate. Parents are invited to attend and cheer for their children. More details will be shared soon.',
        noticeDate: new Date('2024-05-18'),
        publishDate: new Date('2024-05-20'),
        recipients: ['student', 'parent', 'teacher'],
        priority: 'medium',
        status: 'published',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id,
        metadata: {
          createdBy: new mongoose.Types.ObjectId()
        }
      },
      {
        title: 'Library Books Return',
        description: 'All students who have borrowed books from the library are requested to return them by May 30th, 2024. Late returns will incur a fine. Please cooperate.',
        noticeDate: new Date('2024-05-15'),
        publishDate: new Date('2024-05-16'),
        recipients: ['student', 'librarian'],
        priority: 'low',
        status: 'published',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id,
        metadata: {
          createdBy: new mongoose.Types.ObjectId()
        }
      },
      {
        title: 'Staff Meeting',
        description: 'There will be a mandatory staff meeting on May 28th, 2024 at 3:00 PM in the conference room. All teaching and non-teaching staff are required to attend. Agenda will be shared via email.',
        noticeDate: new Date('2024-05-22'),
        publishDate: new Date('2024-05-23'),
        recipients: ['teacher', 'admin', 'staff'],
        priority: 'high',
        status: 'published',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id,
        metadata: {
          createdBy: new mongoose.Types.ObjectId()
        }
      },
      {
        title: 'Summer Vacation Notice',
        description: 'The school will be closed for summer vacation from June 20th to July 15th, 2024. Classes will resume on July 16th, 2024. We wish everyone a safe and enjoyable vacation.',
        noticeDate: new Date('2024-05-25'),
        publishDate: new Date('2024-05-27'),
        recipients: ['student', 'parent', 'teacher', 'staff'],
        priority: 'urgent',
        status: 'published',
        academicYear: '2024/2025',
        institutionId: institutions[0]._id,
        metadata: {
          createdBy: new mongoose.Types.ObjectId()
        }
      }
    ];

    const createdNotices = await Notice.insertMany(notices);
    console.log(`${createdNotices.length} notices created successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding notices:', error);
    process.exit(1);
  }
};

seedNotices();
