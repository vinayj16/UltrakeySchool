import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SupportTicket from '../models/SupportTicket.js';

dotenv.config();

const sampleTickets = [
  {
    ticketNumber: 'TKT-2024-000001',
    subject: 'Unable to access student dashboard',
    description: 'I am unable to log into the student dashboard. The page keeps showing a loading spinner and never loads. I have tried clearing my browser cache and using different browsers, but the issue persists.',
    status: 'open',
    requester: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1234567890',
      role: 'student'
    },
    category: {
      primary: 'technical',
      secondary: 'login-issues',
      tags: ['dashboard', 'login', 'loading']
    },
    priority: {
      level: 'high',
      sla: {
        responseTime: 60,
        resolutionTime: 240
      },
      autoEscalate: true,
      escalationThreshold: 180
    },
    source: 'portal',
    metadata: {
      browser: 'Chrome 120',
      os: 'Windows 11',
      device: 'Desktop'
    }
  },
  {
    ticketNumber: 'TKT-2024-000002',
    subject: 'Billing discrepancy in monthly invoice',
    description: 'I noticed that my monthly invoice shows charges for features that are not included in my subscription plan. The invoice amount is $150 more than expected. Please review and correct this.',
    status: 'in-progress',
    requester: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1234567891',
      role: 'admin'
    },
    category: {
      primary: 'billing',
      secondary: 'invoice-error',
      tags: ['invoice', 'overcharge', 'subscription']
    },
    priority: {
      level: 'medium',
      sla: {
        responseTime: 120,
        resolutionTime: 480
      },
      autoEscalate: false
    },
    communication: {
      messages: [
        {
          id: '1',
          sender: {
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            role: 'admin'
          },
          content: 'I have attached the invoice for your review.',
          timestamp: new Date('2024-01-15T10:00:00Z'),
          type: 'message',
          visibility: 'public'
        },
        {
          id: '2',
          sender: {
            name: 'Support Agent',
            email: 'support@example.com',
            role: 'agent'
          },
          content: 'Thank you for reporting this. We are reviewing your invoice and will get back to you within 24 hours.',
          timestamp: new Date('2024-01-15T10:30:00Z'),
          type: 'message',
          visibility: 'public'
        }
      ],
      totalMessages: 2,
      customerMessages: 1,
      agentMessages: 1
    },
    timeline: {
      createdAt: new Date('2024-01-15T09:45:00Z'),
      firstResponseAt: new Date('2024-01-15T10:30:00Z'),
      lastResponseAt: new Date('2024-01-15T10:30:00Z'),
      responseTime: 2700000
    },
    source: 'email'
  },
  {
    ticketNumber: 'TKT-2024-000003',
    subject: 'Feature request: Bulk student import',
    description: 'It would be very helpful to have a feature that allows bulk import of student data via CSV or Excel file. Currently, we have to add students one by one, which is time-consuming for large institutions.',
    status: 'pending',
    requester: {
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '+1234567892',
      role: 'admin'
    },
    category: {
      primary: 'feature',
      secondary: 'enhancement',
      tags: ['bulk-import', 'students', 'csv', 'excel']
    },
    priority: {
      level: 'low',
      sla: {
        responseTime: 240,
        resolutionTime: 1440
      },
      autoEscalate: false
    },
    communication: {
      messages: [
        {
          id: '1',
          sender: {
            name: 'Michael Brown',
            email: 'michael.brown@example.com',
            role: 'admin'
          },
          content: 'This feature would save us hours of manual data entry.',
          timestamp: new Date('2024-01-14T14:00:00Z'),
          type: 'message',
          visibility: 'public'
        },
        {
          id: '2',
          sender: {
            name: 'Product Team',
            email: 'product@example.com',
            role: 'agent'
          },
          content: 'Thank you for the suggestion. We have added this to our product roadmap for consideration.',
          timestamp: new Date('2024-01-14T16:00:00Z'),
          type: 'message',
          visibility: 'public'
        }
      ],
      totalMessages: 2,
      customerMessages: 1,
      agentMessages: 1
    },
    timeline: {
      createdAt: new Date('2024-01-14T14:00:00Z'),
      firstResponseAt: new Date('2024-01-14T16:00:00Z'),
      lastResponseAt: new Date('2024-01-14T16:00:00Z'),
      responseTime: 7200000
    },
    source: 'portal'
  },
  {
    ticketNumber: 'TKT-2024-000004',
    subject: 'Bug: Grade calculation error',
    description: 'The system is calculating final grades incorrectly. When I enter test scores, the weighted average does not match the expected result. This is affecting multiple students in my class.',
    status: 'resolved',
    requester: {
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '+1234567893',
      role: 'teacher'
    },
    category: {
      primary: 'bug',
      secondary: 'calculation-error',
      tags: ['grades', 'calculation', 'weighted-average']
    },
    priority: {
      level: 'urgent',
      sla: {
        responseTime: 30,
        resolutionTime: 120
      },
      autoEscalate: true,
      escalationThreshold: 90
    },
    communication: {
      messages: [
        {
          id: '1',
          sender: {
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            role: 'teacher'
          },
          content: 'This is urgent as I need to submit final grades by end of week.',
          timestamp: new Date('2024-01-13T09:00:00Z'),
          type: 'message',
          visibility: 'public'
        },
        {
          id: '2',
          sender: {
            name: 'Tech Support',
            email: 'tech@example.com',
            role: 'agent'
          },
          content: 'We have identified the issue and deployed a fix. Please verify that grades are now calculating correctly.',
          timestamp: new Date('2024-01-13T11:00:00Z'),
          type: 'message',
          visibility: 'public'
        },
        {
          id: '3',
          sender: {
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            role: 'teacher'
          },
          content: 'Confirmed! The grades are now calculating correctly. Thank you for the quick fix.',
          timestamp: new Date('2024-01-13T11:30:00Z'),
          type: 'message',
          visibility: 'public'
        }
      ],
      totalMessages: 3,
      customerMessages: 2,
      agentMessages: 1
    },
    timeline: {
      createdAt: new Date('2024-01-13T09:00:00Z'),
      firstResponseAt: new Date('2024-01-13T11:00:00Z'),
      lastResponseAt: new Date('2024-01-13T11:30:00Z'),
      resolvedAt: new Date('2024-01-13T11:30:00Z'),
      responseTime: 7200000,
      resolutionTime: 9000000
    },
    resolution: {
      summary: 'Fixed a rounding error in the weighted average calculation algorithm.',
      steps: [
        'Identified the bug in the grade calculation module',
        'Updated the weighted average formula',
        'Deployed the fix to production',
        'Verified with the teacher that grades are now correct'
      ]
    },
    satisfaction: {
      rating: 5,
      feedback: 'Excellent support! The issue was resolved quickly and professionally.',
      surveyCompletedAt: new Date('2024-01-13T12:00:00Z'),
      surveySent: true,
      surveySentAt: new Date('2024-01-13T11:35:00Z'),
      surveyCompleted: true,
      followUpRequired: false
    },
    source: 'portal'
  },
  {
    ticketNumber: 'TKT-2024-000005',
    subject: 'Password reset not working',
    description: 'I requested a password reset but did not receive the email. I have checked my spam folder and tried multiple times, but no email arrives.',
    status: 'closed',
    requester: {
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      phone: '+1234567894',
      role: 'parent'
    },
    category: {
      primary: 'account',
      secondary: 'password-reset',
      tags: ['password', 'email', 'reset']
    },
    priority: {
      level: 'medium',
      sla: {
        responseTime: 60,
        resolutionTime: 240
      },
      autoEscalate: false
    },
    communication: {
      messages: [
        {
          id: '1',
          sender: {
            name: 'David Wilson',
            email: 'david.wilson@example.com',
            role: 'parent'
          },
          content: 'I need to access my account to view my child\'s progress report.',
          timestamp: new Date('2024-01-12T15:00:00Z'),
          type: 'message',
          visibility: 'public'
        },
        {
          id: '2',
          sender: {
            name: 'Support Agent',
            email: 'support@example.com',
            role: 'agent'
          },
          content: 'I have manually reset your password and sent you a temporary password via email. Please check your inbox.',
          timestamp: new Date('2024-01-12T15:20:00Z'),
          type: 'message',
          visibility: 'public'
        },
        {
          id: '3',
          sender: {
            name: 'David Wilson',
            email: 'david.wilson@example.com',
            role: 'parent'
          },
          content: 'Received the email and successfully logged in. Thank you!',
          timestamp: new Date('2024-01-12T15:30:00Z'),
          type: 'message',
          visibility: 'public'
        }
      ],
      totalMessages: 3,
      customerMessages: 2,
      agentMessages: 1
    },
    timeline: {
      createdAt: new Date('2024-01-12T15:00:00Z'),
      firstResponseAt: new Date('2024-01-12T15:20:00Z'),
      lastResponseAt: new Date('2024-01-12T15:30:00Z'),
      resolvedAt: new Date('2024-01-12T15:30:00Z'),
      closedAt: new Date('2024-01-12T16:00:00Z'),
      responseTime: 1200000,
      resolutionTime: 1800000,
      totalTime: 3600000
    },
    resolution: {
      summary: 'Manually reset the user password and sent temporary credentials.',
      steps: [
        'Verified user identity',
        'Reset password in the system',
        'Sent temporary password via email',
        'Confirmed user was able to log in'
      ]
    },
    satisfaction: {
      rating: 4,
      feedback: 'Good service, but would prefer if the automated reset worked.',
      surveyCompletedAt: new Date('2024-01-12T16:30:00Z'),
      surveySent: true,
      surveySentAt: new Date('2024-01-12T16:05:00Z'),
      surveyCompleted: true,
      followUpRequired: false
    },
    source: 'chat'
  },
  {
    ticketNumber: 'TKT-2024-000006',
    subject: 'General inquiry about subscription plans',
    description: 'I would like to know more about the different subscription plans available and which one would be best for a school with 500 students.',
    status: 'closed',
    requester: {
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      phone: '+1234567895',
      role: 'admin'
    },
    category: {
      primary: 'general',
      secondary: 'inquiry',
      tags: ['subscription', 'plans', 'pricing']
    },
    priority: {
      level: 'low',
      sla: {
        responseTime: 240,
        resolutionTime: 480
      },
      autoEscalate: false
    },
    communication: {
      messages: [
        {
          id: '1',
          sender: {
            name: 'Lisa Anderson',
            email: 'lisa.anderson@example.com',
            role: 'admin'
          },
          content: 'We are considering upgrading from our current plan.',
          timestamp: new Date('2024-01-11T10:00:00Z'),
          type: 'message',
          visibility: 'public'
        },
        {
          id: '2',
          sender: {
            name: 'Sales Team',
            email: 'sales@example.com',
            role: 'agent'
          },
          content: 'Thank you for your interest! I have sent you detailed information about our Enterprise plan, which would be ideal for your school size. I will also schedule a demo call with you.',
          timestamp: new Date('2024-01-11T11:00:00Z'),
          type: 'message',
          visibility: 'public'
        }
      ],
      totalMessages: 2,
      customerMessages: 1,
      agentMessages: 1
    },
    timeline: {
      createdAt: new Date('2024-01-11T10:00:00Z'),
      firstResponseAt: new Date('2024-01-11T11:00:00Z'),
      lastResponseAt: new Date('2024-01-11T11:00:00Z'),
      resolvedAt: new Date('2024-01-11T11:00:00Z'),
      closedAt: new Date('2024-01-11T14:00:00Z'),
      responseTime: 3600000,
      resolutionTime: 3600000,
      totalTime: 14400000
    },
    resolution: {
      summary: 'Provided detailed information about subscription plans and scheduled a demo.',
      steps: [
        'Sent plan comparison document',
        'Recommended Enterprise plan',
        'Scheduled demo call'
      ]
    },
    satisfaction: {
      rating: 5,
      feedback: 'Very helpful and informative. Looking forward to the demo.',
      surveyCompletedAt: new Date('2024-01-11T15:00:00Z'),
      surveySent: true,
      surveySentAt: new Date('2024-01-11T14:05:00Z'),
      surveyCompleted: true,
      followUpRequired: true,
      followUpCompleted: false,
      followUpNotes: 'Schedule demo call for next week'
    },
    source: 'email'
  }
];

const seedSupportTickets = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await SupportTicket.deleteMany({});
    console.log('Cleared existing support tickets');

    const tickets = await SupportTicket.insertMany(sampleTickets);
    console.log(`Seeded ${tickets.length} support tickets`);

    const statistics = await SupportTicket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\nTicket Statistics:');
    statistics.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count}`);
    });

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding support tickets:', error);
    process.exit(1);
  }
};

seedSupportTickets();
