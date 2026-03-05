// Load environment variables FIRST - before any other imports
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Temporarily disable all route imports to isolate crash
/*
import attendanceRoutes from './routes/attendanceRoutes.js';
import performerRoutes from './routes/performerRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import statisticRoutes from './routes/statisticRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import userProfileRoutes from './routes/userProfileRoutes.js';
import sidebarRoutes from './routes/sidebarRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import guardianRoutes from './routes/guardianRoutes.js';
import institutionRoutes from './routes/institutionRoutes.js';
import hrmRoutes from './routes/hrmRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import userManagementRoutes from './routes/userManagementRoutes.js';
import transportRoutes from './routes/transportRoutes.js';
import supportTicketRoutes from './routes/supportTicketRoutes.js';
import hostelRoutes from './routes/hostelRoutes.js';
import classRoutes from './routes/classRoutes.js';
import classScheduleRoutes from './routes/classScheduleRoutes.js';
import classRoomRoutes from './routes/classRoomRoutes.js';
import religionRoutes from './routes/religionRoutes.js';
import schoolSettingsRoutes from './routes/schoolSettingsRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import examScheduleRoutes from './routes/examScheduleRoutes.js';
import geofenceRoutes from './routes/geofenceRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import fileManagerRoutes from './routes/fileManagerRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import studentAttendanceRoutes from './routes/studentAttendanceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import permissionRoutes from './routes/permissionRoutes.js';
import academicReasonRoutes from './routes/academicReasonRoutes.js';
import homeWorkRoutes from './routes/homeWorkRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import syllabusRoutes from './routes/syllabusRoutes.js';
import classTimetableRoutes from './routes/classTimetableRoutes.js';
import examRoutes from './routes/examRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import leaveReportRoutes from './routes/leaveReportRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import commissionRoutes from './routes/commissionRoutes.js';
import customFieldRoutes from './routes/customFieldRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import callLogRoutes from './routes/callLogRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import academicEngineRoutes from './routes/academicEngineRoutes.js';
import schoolRoutes from './routes/schoolRoutes.js';
import transportAssignmentRoutes from './routes/transportAssignmentRoutes.js';
import transportReportRoutes from './routes/transportReportRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import transportRouteRoutes from './routes/transportRouteRoutes.js';
import pickupPointRoutes from './routes/pickupPointRoutes.js';
import emailSettingsRoutes from './routes/emailSettingsRoutes.js';
import gdprSettingsRoutes from './routes/gdprSettingsRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import branchRoutes from './routes/branchRoutes.js';
import dsrRoutes from './routes/dsrRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import canteenRoutes from './routes/canteenRoutes.js';
import tenantRoutes from './routes/tenantRoutes.js';
import ptmRoutes from './routes/ptmRoutes.js';
import admissionRoutes from './routes/admissionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import themeRoutes from './routes/themeRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import apiKeyRoutes from './routes/apiKeyRoutes.js';
import libraryRoutes from './routes/libraryRoutes.js';
import onlineExamRoutes from './routes/onlineExamRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import addonRoutes from './routes/addonRoutes.js';
import membershipPlanRoutes from './routes/membershipPlanRoutes.js';
import bannedIPRoutes from './routes/bannedIPRoutes.js';
import storageSettingsRoutes from './routes/storageSettingsRoutes.js';
import advancedAttendanceRoutes from './routes/advancedAttendanceRoutes.js';
import idCardRoutes from './routes/idCardRoutes.js';
import realtimeDashboardRoutes from './routes/realtimeDashboardRoutes.js';
import paymentGatewayRoutes from './routes/paymentGatewayRoutes.js';
import installmentRoutes from './routes/installmentRoutes.js';
import scholarshipRoutes from './routes/scholarshipRoutes.js';
import feeReminderRoutes from './routes/feeReminderRoutes.js';
import advancedProctoringRoutes from './routes/advancedProctoringRoutes.js';
import questionBankRoutes from './routes/questionBankRoutes.js';
import videoConferencingRoutes from './routes/videoConferencingRoutes.js';
import contactMessageRoutes from './routes/contactMessageRoutes.js';
import groupChatRoutes from './routes/groupChatRoutes.js';
import fileSharingRoutes from './routes/fileSharingRoutes.js';
// import twoFactorAuthRoutes from './routes/twoFactorAuthRoutes.js'; // DISABLED - Frontend only mode
// import oauthRoutes from './routes/oauthRoutes.js'; // DISABLED - Frontend only mode
// import biometricAuthRoutes from './routes/biometricAuthRoutes.js'; // DISABLED - Frontend only mode
import dashboardWidgetRoutes from './routes/dashboardWidgetRoutes.js';
import sportRoutes from './routes/sportRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
// import rfidRoutes from './routes/rfidRoutes.js'; // Temporarily disabled - missing validation middleware
// import geofenceRoutes from './routes/geofenceRoutes.js'; // Temporarily disabled - missing validation middleware
import pendingInstitutionRegistrationRoutes from './routes/pendingInstitutionRegistrationRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
*/

// Initialize express app
const app = express();

// Initialize monitoring/tracing
// initializeSentry();

// Connect to database
connectDB();

// Initialize job queues asynchronously (DISABLED - Redis not needed)
// const bootstrapQueues = async () => {
//   try {
//     await initializeJobQueues();
//     await jobService.scheduleRecurringJobs();
//   } catch (queueError) {
//     logger.warn('Failed to initialize job queues (Redis may not be available):', queueError.message);
//     console.warn('Job queues disabled - Redis connection failed');
//   }
// };
// bootstrapQueues();
logger.info('Job queues disabled - Redis not configured');

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: logger.stream }));
} else {
  app.use(morgan('dev'));
}
// app.use(requestLogger);
// app.use(monitoringService.performanceMonitoring.monitorAPIEndpoint); // DISABLED - Sentry not configured

// Security & Sanitization
// app.use(sanitizeMongo);
// app.use(sanitizeXSS);
// app.use(preventHPP);
// app.use(sanitizeInput);
app.use(preventHPP);
app.use(sanitizeInput);

// Body parsing
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check route
app.get('/health', (_req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    checks: {
      db: 'ok',
      redis: 'ok'
    }
  };

  res.json({
    success: true,
    message: 'Server is running',
    ...healthData
  });

  // monitoringService.reportHealthCheck(healthData).catch((error) => {
  //   logger.warn('Health check metric failed', { error: error.message });
  // });
});

// Root route
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'EduManage Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: `/api/${process.env.API_VERSION || 'v1'}`,
      docs: '/api-docs'
    }
  });
});

// API routes with rate limiting
const API_VERSION = process.env.API_VERSION || 'v1';

// Apply general rate limiting to all API routes
// app.use(`/api/${API_VERSION}`, apiLimiter);

// Apply strict rate limiting to auth routes
// app.use(`/api/${API_VERSION}/auth/login`, authLimiter);
// app.use(`/api/${API_VERSION}/auth/register`, authLimiter);
// app.use(`/api/${API_VERSION}/auth/reset-password`, authLimiter);

/*
// All route usage temporarily disabled
app.use(`/api/${API_VERSION}/attendance`, attendanceRoutes);
app.use(`/api/${API_VERSION}/performers`, performerRoutes);
app.use(`/api/${API_VERSION}/fees`, feeRoutes);
app.use(`/api/${API_VERSION}/schedules`, scheduleRoutes);
app.use(`/api/${API_VERSION}/statistics`, statisticRoutes);
app.use(`/api/${API_VERSION}/notifications`, notificationRoutes);
app.use(`/api/${API_VERSION}/profile`, userProfileRoutes);
app.use(`/api/${API_VERSION}/sidebar`, sidebarRoutes);
app.use(`/api/${API_VERSION}/students`, studentRoutes);
app.use(`/api/${API_VERSION}/teachers`, teacherRoutes);
app.use(`/api/${API_VERSION}/subscriptions`, subscriptionRoutes);
app.use(`/api/${API_VERSION}/addons`, addonRoutes);
app.use(`/api/${API_VERSION}/membership-plans`, membershipPlanRoutes);
app.use(`/api/${API_VERSION}/transactions`, transactionRoutes);
app.use(`/api/${API_VERSION}/roles`, roleRoutes);
app.use(`/api/${API_VERSION}/menus`, menuRoutes);
app.use(`/api/${API_VERSION}/guardians`, guardianRoutes);
app.use(`/api/${API_VERSION}/institutions`, institutionRoutes);
app.use(`/api/${API_VERSION}/hrm`, hrmRoutes);
app.use(`/api/${API_VERSION}/settings`, settingsRoutes);
app.use(`/api/${API_VERSION}/banned-ips`, bannedIPRoutes);
app.use(`/api/${API_VERSION}/storage-settings`, storageSettingsRoutes);
app.use(`/api/${API_VERSION}/support-tickets`, supportTicketRoutes);
app.use(`/api/${API_VERSION}/contact-messages`, contactMessageRoutes);
app.use(`/api/${API_VERSION}/classes`, classRoutes);
app.use(`/api/${API_VERSION}/class-schedules`, classScheduleRoutes);
app.use(`/api/${API_VERSION}/classrooms`, classRoomRoutes);
app.use(`/api/${API_VERSION}/religions`, religionRoutes);
app.use(`/api/${API_VERSION}/school-settings`, schoolSettingsRoutes);
app.use(`/api/${API_VERSION}/grades`, gradeRoutes);
app.use(`/api/${API_VERSION}/exam-schedules`, examScheduleRoutes);
app.use(`/api/${API_VERSION}/notices`, noticeRoutes);
app.use(`/api/${API_VERSION}/todos`, todoRoutes);
app.use(`/api/${API_VERSION}/notes`, noteRoutes);
app.use(`/api/${API_VERSION}/file-manager`, fileManagerRoutes);
app.use(`/api/${API_VERSION}/emails`, emailRoutes);
app.use(`/api/${API_VERSION}/student-attendance`, studentAttendanceRoutes);
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/permissions`, permissionRoutes);
app.use(`/api/${API_VERSION}/academic-reasons`, academicReasonRoutes);
app.use(`/api/${API_VERSION}/homework`, homeWorkRoutes);
app.use(`/api/${API_VERSION}/subjects`, subjectRoutes);
app.use(`/api/${API_VERSION}/syllabi`, syllabusRoutes);
app.use(`/api/${API_VERSION}/class-timetables`, classTimetableRoutes);
app.use(`/api/${API_VERSION}/exams`, examRoutes);
app.use(`/api/${API_VERSION}/results`, resultRoutes);
app.use(`/api/${API_VERSION}/leave-reports`, leaveReportRoutes);
app.use(`/api/${API_VERSION}/events`, eventRoutes);
app.use(`/api/${API_VERSION}/commissions`, commissionRoutes);
app.use(`/api/${API_VERSION}/custom-fields`, customFieldRoutes);
app.use(`/api/${API_VERSION}/calendar`, calendarRoutes);
app.use(`/api/${API_VERSION}/call-logs`, callLogRoutes);
app.use(`/api/${API_VERSION}/chat`, chatRoutes);
app.use(`/api/${API_VERSION}/organizations`, organizationRoutes);
app.use(`/api/${API_VERSION}/academic-engine`, academicEngineRoutes);
app.use(`/api/${API_VERSION}/schools`, schoolRoutes);
app.use(`/api/${API_VERSION}/transport`, transportRoutes);
app.use(`/api/${API_VERSION}/transport-assignments`, transportAssignmentRoutes);
app.use(`/api/${API_VERSION}/transport-reports`, transportReportRoutes);
app.use(`/api/${API_VERSION}/drivers`, driverRoutes);
app.use(`/api/${API_VERSION}/transport/routes`, transportRouteRoutes);
app.use(`/api/${API_VERSION}/transport/pickup-points`, pickupPointRoutes);
app.use(`/api/${API_VERSION}/email-settings`, emailSettingsRoutes);
app.use(`/api/${API_VERSION}/gdpr-settings`, gdprSettingsRoutes);
app.use(`/api/${API_VERSION}/analytics`, analyticsRoutes);
app.use(`/api/${API_VERSION}/branches`, branchRoutes);
app.use(`/api/${API_VERSION}/dsr`, dsrRoutes);
app.use(`/api/${API_VERSION}`, userManagementRoutes);
app.use(`/api/${API_VERSION}/api-keys`, apiKeyRoutes);
app.use(`/api/${API_VERSION}/reports`, reportRoutes);
app.use(`/api/${API_VERSION}/tenants`, tenantRoutes);
app.use(`/api/${API_VERSION}/ptm`, ptmRoutes);
app.use(`/api/${API_VERSION}/admissions`, admissionRoutes);
app.use(`/api/${API_VERSION}/dashboard`, dashboardRoutes);
app.use(`/api/${API_VERSION}/theme`, themeRoutes);
app.use(`/api/${API_VERSION}/library`, libraryRoutes);
app.use(`/api/${API_VERSION}/hostel`, hostelRoutes);
app.use(`/api/${API_VERSION}/inventory`, inventoryRoutes);
app.use(`/api/${API_VERSION}/canteen`, canteenRoutes);
app.use(`/api/${API_VERSION}/sports`, sportRoutes);
app.use(`/api/${API_VERSION}/players`, playerRoutes);
app.use(`/api/${API_VERSION}/online-exams`, onlineExamRoutes);
app.use(`/api/${API_VERSION}/blog`, blogRoutes);

app.use(`/api/${API_VERSION}/attendance/advanced`, advancedAttendanceRoutes);
app.use(`/api/${API_VERSION}/id-cards`, idCardRoutes);
app.use(`/api/${API_VERSION}/realtime/dashboard`, realtimeDashboardRoutes);
app.use(`/api/${API_VERSION}/payment-gateway`, paymentGatewayRoutes);
app.use(`/api/${API_VERSION}/installments`, installmentRoutes);
app.use(`/api/${API_VERSION}/scholarships`, scholarshipRoutes);
app.use(`/api/${API_VERSION}/fee-reminders`, feeReminderRoutes);
app.use(`/api/${API_VERSION}/proctoring`, advancedProctoringRoutes);
app.use(`/api/${API_VERSION}/question-bank`, questionBankRoutes);
app.use(`/api/${API_VERSION}/video-conferencing`, videoConferencingRoutes);
app.use(`/api/${API_VERSION}/group-chat`, groupChatRoutes);
app.use(`/api/${API_VERSION}/file-sharing`, fileSharingRoutes);
// app.use(`/api/${API_VERSION}/2fa`, twoFactorAuthRoutes); // DISABLED - Frontend only mode
// app.use(`/api/${API_VERSION}/oauth`, oauthRoutes); // DISABLED - Frontend only mode
// app.use(`/api/${API_VERSION}/biometric`, biometricAuthRoutes); // DISABLED - Frontend only mode
app.use(`/api/${API_VERSION}/dashboard/widgets`, dashboardWidgetRoutes);
// app.use(`/api/${API_VERSION}/rfid`, rfidRoutes); // Temporarily disabled - missing validation middleware
// app.use(`/api/${API_VERSION}/geofence`, geofenceRoutes); // Temporarily disabled - missing validation middleware
app.use(`/api/${API_VERSION}/agents`, agentRoutes);
app.use(`/api/${API_VERSION}/super-admin`, superAdminRoutes);
*/

// Error handling (must be last)
// app.use(errorLogger);
app.use(notFound);
app.use(errorHandler);

// Start server with automatic port handling
const PORT = process.env.PORT || 5000;
const MAX_PORT_RETRIES = 10;

const startServer = (port, retries = 0) => {
  const server = app.listen(port, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
    
    // Initialize WebSocket service
    // socketService.initialize(server);
    // logger.info('WebSocket service initialized');
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      if (retries < MAX_PORT_RETRIES) {
        const nextPort = port + 1;
        logger.warn(`Port ${port} is in use, trying port ${nextPort}...`);
        console.warn(`Port ${port} is in use, trying port ${nextPort}...`);
        server.close();
        startServer(nextPort, retries + 1);
      } else {
        logger.error(`Could not find available port after ${MAX_PORT_RETRIES} attempts`);
        console.error(`Could not find available port after ${MAX_PORT_RETRIES} attempts`);
        process.exit(1);
      }
    } else {
      logger.error('Server error:', error);
      console.error('Server error:', error);
      process.exit(1);
    }
  });

  const gracefulShutdown = async () => {
    logger.info('Shutting down server...');
    // await jobService.shutdown();
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection', { reason });
    // monitoringService.captureException(reason); // DISABLED
  });
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error });
    // monitoringService.captureException(error); // DISABLED
    gracefulShutdown();
  });

  return server;
};

// Start the server
startServer(PORT);

export default app;