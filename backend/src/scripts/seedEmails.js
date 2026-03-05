import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Email from '../models/Email.js';
import connectDB from '../config/database.js';

dotenv.config();

const sampleEmails = [
  {
    sender: {
      userId: new mongoose.Types.ObjectId(),
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/assets/img/profiles/avatar-01.jpg'
    },
    recipients: [
      { userId: new mongoose.Types.ObjectId(), name: 'Me', email: 'me@company.com', type: 'to' }
    ],
    subject: 'Project Update - Q4 Planning Meeting',
    content: 'Hi Team,\n\nI wanted to provide an update on our Q4 planning. The meeting is scheduled for tomorrow at 2 PM. Please review the attached documents before the meeting.\n\nAgenda:\n1. Q4 Goals Review\n2. Resource Allocation\n3. Timeline Planning\n4. Risk Assessment\n\nBest regards,\nJohn Doe\nProject Manager',
    isRead: false,
    isStarred: true,
    isImportant: true,
    hasAttachment: true,
    attachments: [
      {
        fileName: 'Q4_Planning_Document.pdf',
        fileSize: 2560000,
        fileType: 'application/pdf',
        fileUrl: '/assets/files/q4-planning.pdf',
        uploadedAt: new Date()
      }
    ],
    folder: 'inbox',
    tags: ['work', 'important', 'meeting'],
    labels: ['Project Alpha'],
    priority: 'high',
    size: 2560000,
    status: 'delivered',
    category: 'primary',
    userId: new mongoose.Types.ObjectId()
  },
  {
    sender: {
      userId: new mongoose.Types.ObjectId(),
      name: 'Envato Security',
      email: 'security@envato.com',
      avatar: '/assets/img/profiles/avatar-02.jpg'
    },
    recipients: [
      { userId: new mongoose.Types.ObjectId(), name: 'Me', email: 'me@company.com', type: 'to' }
    ],
    subject: '🔐 Security Alert: Unusual Account Activity Detected',
    content: 'Dear User,\n\nWe have detected unusual activity on your Envato account. This could indicate unauthorized access.\n\nActions taken:\n- Temporary account lock\n- Password reset required\n- Security verification sent to your email\n\nPlease review your account security settings immediately.\n\nIf this was you, please ignore this message.\n\nBest regards,\nEnvato Security Team',
    isRead: false,
    isStarred: false,
    isImportant: true,
    hasAttachment: false,
    attachments: [],
    folder: 'inbox',
    tags: ['security', 'urgent'],
    labels: ['Security'],
    priority: 'urgent',
    size: 1850,
    isEncrypted: true,
    isSigned: true,
    status: 'delivered',
    category: 'primary',
    userId: new mongoose.Types.ObjectId()
  },
  {
    sender: {
      userId: new mongoose.Types.ObjectId(),
      name: 'Twitter Notifications',
      email: 'notify@twitter.com',
      avatar: '/assets/img/profiles/avatar-03.jpg'
    },
    recipients: [
      { userId: new mongoose.Types.ObjectId(), name: 'Me', email: 'me@company.com', type: 'to' }
    ],
    subject: 'You have new mentions and likes',
    content: 'Hello!\n\nYou have received:\n- 15 new likes on your tweets\n- 3 new mentions\n- 2 new followers\n\nCheck out what\'s happening on Twitter!\n\n#TwitterUpdates',
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachment: false,
    attachments: [],
    folder: 'inbox',
    tags: ['social'],
    labels: ['Notifications'],
    priority: 'low',
    size: 890,
    status: 'delivered',
    category: 'social',
    userId: new mongoose.Types.ObjectId()
  },
  {
    sender: {
      userId: new mongoose.Types.ObjectId(),
      name: 'HR Department',
      email: 'hr@company.com',
      avatar: '/assets/img/profiles/avatar-04.jpg'
    },
    recipients: [
      { userId: new mongoose.Types.ObjectId(), name: 'Me', email: 'me@company.com', type: 'to' },
      { userId: new mongoose.Types.ObjectId(), name: 'Development Team', email: 'dev-team@company.com', type: 'cc' }
    ],
    subject: 'Policy Update: Remote Work Guidelines',
    content: 'Dear Team,\n\nWe are updating our remote work policy effective next month. Please review the attached document for complete details.\n\nKey changes:\n1. Flexible hours for remote employees\n2. New equipment reimbursement policy\n3. Updated communication guidelines\n\nPlease acknowledge receipt of this email.\n\nBest regards,\nHR Department',
    isRead: true,
    isStarred: false,
    isImportant: true,
    hasAttachment: true,
    attachments: [
      {
        fileName: 'remote_work_policy_2024.pdf',
        fileSize: 1800000,
        fileType: 'application/pdf',
        fileUrl: '/assets/files/remote-policy.pdf',
        uploadedAt: new Date()
      }
    ],
    folder: 'inbox',
    tags: ['hr', 'policy'],
    labels: ['Company Policies'],
    priority: 'high',
    size: 1800000,
    status: 'delivered',
    category: 'updates',
    userId: new mongoose.Types.ObjectId()
  },
  {
    sender: {
      userId: new mongoose.Types.ObjectId(),
      name: 'Sarah Johnson',
      email: 'sarah.j@personal.com',
      avatar: '/assets/img/profiles/avatar-05.jpg'
    },
    recipients: [
      { userId: new mongoose.Types.ObjectId(), name: 'Me', email: 'me@company.com', type: 'to' }
    ],
    subject: 'Weekend Plans - Let\'s Catch Up!',
    content: 'Hey!\n\nHow have you been? It\'s been ages since we last met. Are you free this weekend? I was thinking we could go to that new restaurant downtown.\n\nLet me know what you think!\n\nHugs,\nSarah',
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachment: false,
    attachments: [],
    folder: 'inbox',
    tags: ['personal'],
    labels: ['Friends'],
    priority: 'normal',
    size: 890,
    status: 'delivered',
    category: 'primary',
    userId: new mongoose.Types.ObjectId()
  },
  {
    sender: {
      userId: new mongoose.Types.ObjectId(),
      name: 'Me',
      email: 'me@company.com'
    },
    recipients: [
      { userId: new mongoose.Types.ObjectId(), name: 'ABC Corp', email: 'contact@abccorp.com', type: 'to' }
    ],
    subject: 'Q3 Project Status Update [Draft]',
    content: 'Dear ABC Corp Team,\n\nI hope this email finds you well. I wanted to provide you with an update on our Q3 project progress.\n\nCurrent Status:\n- Phase 1: Completed ✓\n- Phase 2: 85% Complete\n- Phase 3: Scheduled to begin next week\n\n[TO BE COMPLETED WITH MORE DETAILS]\n\nPlease let me know if you have any questions.\n\nBest regards,\n[Your Name]',
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachment: false,
    attachments: [],
    folder: 'drafts',
    tags: ['work', 'client'],
    labels: ['Q3 Project'],
    priority: 'normal',
    size: 950,
    status: 'draft',
    category: 'primary',
    userId: new mongoose.Types.ObjectId()
  },
  {
    sender: {
      userId: new mongoose.Types.ObjectId(),
      name: 'Me',
      email: 'me@company.com'
    },
    recipients: [
      { userId: new mongoose.Types.ObjectId(), name: 'Client', email: 'client@example.com', type: 'to' }
    ],
    subject: 'Meeting Confirmation',
    content: 'Dear Client,\n\nThank you for scheduling a meeting with us. This email confirms our meeting on Friday at 3 PM.\n\nLooking forward to discussing the project details.\n\nBest regards,\nYour Name',
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachment: false,
    attachments: [],
    folder: 'sent',
    tags: ['work', 'meeting'],
    labels: [],
    priority: 'normal',
    size: 450,
    status: 'sent',
    category: 'primary',
    userId: new mongoose.Types.ObjectId()
  },
  {
    sender: {
      userId: new mongoose.Types.ObjectId(),
      name: 'Spam Sender',
      email: 'spam@suspicious.com'
    },
    recipients: [
      { userId: new mongoose.Types.ObjectId(), name: 'Me', email: 'me@company.com', type: 'to' }
    ],
    subject: 'You Won $1,000,000! Claim Now!',
    content: 'Congratulations! You have won $1,000,000 in our lottery. Click here to claim your prize now!\n\n[Suspicious Link]',
    isRead: false,
    isStarred: false,
    isImportant: false,
    hasAttachment: false,
    attachments: [],
    folder: 'spam',
    tags: ['spam'],
    labels: [],
    priority: 'low',
    size: 320,
    status: 'delivered',
    category: 'promotions',
    userId: new mongoose.Types.ObjectId()
  }
];

const seedEmails = async () => {
  try {
    await connectDB();
    
    await Email.deleteMany({});
    console.log('Existing emails deleted');
    
    const emails = await Email.insertMany(sampleEmails);
    console.log(`${emails.length} emails created successfully`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding emails:', error);
    process.exit(1);
  }
};

seedEmails();
