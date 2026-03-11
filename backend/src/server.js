// Load environment variables FIRST - before any other imports
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import hpp from 'hpp';
import connectDB from './config/database.js';
import logger from './utils/logger.js';

console.log('Server script starting...');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { errorHandler, notFound } from './middleware/errorHandler.js';

// Initialize express app
const app = express();

console.log('Express app initialized.');

// Connect to database
connectDB();

console.log('Database connection initiated.');

logger.info('Job queues disabled - Redis not configured');

// Middleware
app.use(helmet());
app.use(cors({
    origin: '*',
    credentials: true
}));

console.log('Core middleware configured.');

// Logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: logger.stream }));
} else {
  app.use(morgan('dev'));
}

// Security & Sanitization
app.use(hpp());
// app.use(sanitizeInput); // Commented out as source is unclear

// Body parsing
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

console.log('Request parsing middleware configured.');

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

console.log('Basic routes configured.');

// API routes with rate limiting
const API_VERSION = process.env.API_VERSION || 'v1';

const safeImportDefault = async (modulePath) => {
  try {
    const mod = await import(modulePath);
    return mod?.default ?? null;
  } catch (error) {
    logger.error(`Failed to load module: ${modulePath}`, { message: error?.message, stack: error?.stack });
    return null;
  }
};

app.use(`/api/${API_VERSION}/`, healthRoutes);
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);
// Core multi-tenant / management routes (loaded safely)
{
  const userManagement = await safeImportDefault('./routes/userManagementRoutes.js');
  if (userManagement) app.use(`/api/${API_VERSION}`, userManagement);
}
{
  const institutions = await safeImportDefault('./routes/institutionRoutes.js');
  if (institutions) app.use(`/api/${API_VERSION}/institutions`, institutions);
}
{
  const schools = await safeImportDefault('./routes/schoolRoutes.js');
  if (schools) app.use(`/api/${API_VERSION}/schools`, schools);
}
{
  const tenants = await safeImportDefault('./routes/tenantRoutes.js');
  if (tenants) app.use(`/api/${API_VERSION}/tenants`, tenants);
}
{
  const dashboard = await safeImportDefault('./routes/dashboardRoutes.js');
  if (dashboard) app.use(`/api/${API_VERSION}/dashboard`, dashboard);
}

// Attendance / statistics / notifications
{
  const attendanceRoutes = await safeImportDefault('./routes/attendanceRoutes.js');
  if (attendanceRoutes) app.use(`/api/${API_VERSION}/attendance`, attendanceRoutes);
}
{
  const performerRoutes = await safeImportDefault('./routes/performerRoutes.js');
  if (performerRoutes) app.use(`/api/${API_VERSION}/performers`, performerRoutes);
}
{
  const feeRoutes = await safeImportDefault('./routes/feeRoutes.js');
  if (feeRoutes) app.use(`/api/${API_VERSION}/fees`, feeRoutes);
}
{
  const scheduleRoutes = await safeImportDefault('./routes/scheduleRoutes.js');
  if (scheduleRoutes) app.use(`/api/${API_VERSION}/schedules`, scheduleRoutes);
}
{
  const statisticRoutes = await safeImportDefault('./routes/statisticRoutes.js');
  if (statisticRoutes) app.use(`/api/${API_VERSION}/statistics`, statisticRoutes);
}
{
  const notificationRoutes = await safeImportDefault('./routes/notificationRoutes.js');
  if (notificationRoutes) app.use(`/api/${API_VERSION}/notifications`, notificationRoutes);
}
{
  const userProfileRoutes = await safeImportDefault('./routes/userProfileRoutes.js');
  if (userProfileRoutes) app.use(`/api/${API_VERSION}/profile`, userProfileRoutes);
}
{
  const sidebarRoutes = await safeImportDefault('./routes/sidebarRoutes.js');
  if (sidebarRoutes) app.use(`/api/${API_VERSION}/sidebar`, sidebarRoutes);
}

// People / roles / menus
{
  const studentRoutes = await safeImportDefault('./routes/studentRoutes.js');
  if (studentRoutes) app.use(`/api/${API_VERSION}/students`, studentRoutes);
}
{
  const teacherRoutes = await safeImportDefault('./routes/teacherRoutes.js');
  if (teacherRoutes) app.use(`/api/${API_VERSION}/teachers`, teacherRoutes);
}
{
  const subscriptionRoutes = await safeImportDefault('./routes/subscriptionRoutes.js');
  if (subscriptionRoutes) app.use(`/api/${API_VERSION}/subscriptions`, subscriptionRoutes);
}
{
  const transactionRoutes = await safeImportDefault('./routes/transactionRoutes.js');
  if (transactionRoutes) app.use(`/api/${API_VERSION}/transactions`, transactionRoutes);
}
{
  const roleRoutes = await safeImportDefault('./routes/roleRoutes.js');
  if (roleRoutes) app.use(`/api/${API_VERSION}/roles`, roleRoutes);
}
{
  const menuRoutes = await safeImportDefault('./routes/menuRoutes.js');
  if (menuRoutes) app.use(`/api/${API_VERSION}/menus`, menuRoutes);
}
{
  const guardianRoutes = await safeImportDefault('./routes/guardianRoutes.js');
  if (guardianRoutes) app.use(`/api/${API_VERSION}/guardians`, guardianRoutes);
}
{
  const hrmRoutes = await safeImportDefault('./routes/hrmRoutes.js');
  if (hrmRoutes) app.use(`/api/${API_VERSION}/hrm`, hrmRoutes);
}
{
  const settingsRoutes = await safeImportDefault('./routes/settingsRoutes.js');
  if (settingsRoutes) app.use(`/api/${API_VERSION}/settings`, settingsRoutes);
}
{
  const bannedIPRoutes = await safeImportDefault('./routes/bannedIPRoutes.js');
  if (bannedIPRoutes) app.use(`/api/${API_VERSION}/banned-ips`, bannedIPRoutes);
}
{
  const storageSettingsRoutes = await safeImportDefault('./routes/storageSettingsRoutes.js');
  if (storageSettingsRoutes) app.use(`/api/${API_VERSION}/storage-settings`, storageSettingsRoutes);
}
{
  const supportTicketRoutes = await safeImportDefault('./routes/supportTicketRoutes.js');
  if (supportTicketRoutes) app.use(`/api/${API_VERSION}/support-tickets`, supportTicketRoutes);
}
{
  const contactMessageRoutes = await safeImportDefault('./routes/contactMessageRoutes.js');
  if (contactMessageRoutes) app.use(`/api/${API_VERSION}/contact-messages`, contactMessageRoutes);
}
{
  const classRoutes = await safeImportDefault('./routes/classRoutes.js');
  if (classRoutes) app.use(`/api/${API_VERSION}/classes`, classRoutes);
}
{
  const classScheduleRoutes = await safeImportDefault('./routes/classScheduleRoutes.js');
  if (classScheduleRoutes) app.use(`/api/${API_VERSION}/class-schedules`, classScheduleRoutes);
}
{
  const classRoomRoutes = await safeImportDefault('./routes/classRoomRoutes.js');
  if (classRoomRoutes) app.use(`/api/${API_VERSION}/classrooms`, classRoomRoutes);
}
{
  const religionRoutes = await safeImportDefault('./routes/religionRoutes.js');
  if (religionRoutes) app.use(`/api/${API_VERSION}/religions`, religionRoutes);
}
{
  const schoolSettingsRoutes = await safeImportDefault('./routes/schoolSettingsRoutes.js');
  if (schoolSettingsRoutes) app.use(`/api/${API_VERSION}/school-settings`, schoolSettingsRoutes);
}
{
  const gradeRoutes = await safeImportDefault('./routes/gradeRoutes.js');
  if (gradeRoutes) app.use(`/api/${API_VERSION}/grades`, gradeRoutes);
}
{
  const examScheduleRoutes = await safeImportDefault('./routes/examScheduleRoutes.js');
  if (examScheduleRoutes) app.use(`/api/${API_VERSION}/exam-schedules`, examScheduleRoutes);
}
{
  const noticeRoutes = await safeImportDefault('./routes/noticeRoutes.js');
  if (noticeRoutes) app.use(`/api/${API_VERSION}/notices`, noticeRoutes);
}
{
  const todoRoutes = await safeImportDefault('./routes/todoRoutes.js');
  if (todoRoutes) app.use(`/api/${API_VERSION}/todos`, todoRoutes);
}
{
  const noteRoutes = await safeImportDefault('./routes/noteRoutes.js');
  if (noteRoutes) app.use(`/api/${API_VERSION}/notes`, noteRoutes);
}
{
  const fileManagerRoutes = await safeImportDefault('./routes/fileManagerRoutes.js');
  if (fileManagerRoutes) app.use(`/api/${API_VERSION}/file-manager`, fileManagerRoutes);
}
{
  const studentAttendanceRoutes = await safeImportDefault('./routes/studentAttendanceRoutes.js');
  if (studentAttendanceRoutes) app.use(`/api/${API_VERSION}/student-attendance`, studentAttendanceRoutes);
}
{
  const permissionRoutes = await safeImportDefault('./routes/permissionRoutes.js');
  if (permissionRoutes) app.use(`/api/${API_VERSION}/permissions`, permissionRoutes);
}
{
  const academicReasonRoutes = await safeImportDefault('./routes/academicReasonRoutes.js');
  if (academicReasonRoutes) app.use(`/api/${API_VERSION}/academic-reasons`, academicReasonRoutes);
}
{
  const homeWorkRoutes = await safeImportDefault('./routes/homeWorkRoutes.js');
  if (homeWorkRoutes) app.use(`/api/${API_VERSION}/homework`, homeWorkRoutes);
}
{
  const subjectRoutes = await safeImportDefault('./routes/subjectRoutes.js');
  if (subjectRoutes) app.use(`/api/${API_VERSION}/subjects`, subjectRoutes);
}
{
  const syllabusRoutes = await safeImportDefault('./routes/syllabusRoutes.js');
  if (syllabusRoutes) app.use(`/api/${API_VERSION}/syllabus`, syllabusRoutes);
}
{
  const classTimetableRoutes = await safeImportDefault('./routes/classTimetableRoutes.js');
  if (classTimetableRoutes) app.use(`/api/${API_VERSION}/class-timetables`, classTimetableRoutes);
}
{
  const examRoutes = await safeImportDefault('./routes/examRoutes.js');
  if (examRoutes) app.use(`/api/${API_VERSION}/exams`, examRoutes);
}
{
  const resultRoutes = await safeImportDefault('./routes/resultRoutes.js');
  if (resultRoutes) app.use(`/api/${API_VERSION}/results`, resultRoutes);
}
{
  const leaveReportRoutes = await safeImportDefault('./routes/leaveReportRoutes.js');
  if (leaveReportRoutes) app.use(`/api/${API_VERSION}/leave-reports`, leaveReportRoutes);
}
{
  const eventRoutes = await safeImportDefault('./routes/eventRoutes.js');
  if (eventRoutes) app.use(`/api/${API_VERSION}/events`, eventRoutes);
}
{
  const commissionRoutes = await safeImportDefault('./routes/commissionRoutes.js');
  if (commissionRoutes) app.use(`/api/${API_VERSION}/commissions`, commissionRoutes);
}
{
  const customFieldRoutes = await safeImportDefault('./routes/customFieldRoutes.js');
  if (customFieldRoutes) app.use(`/api/${API_VERSION}/custom-fields`, customFieldRoutes);
}
{
  const calendarRoutes = await safeImportDefault('./routes/calendarRoutes.js');
  if (calendarRoutes) app.use(`/api/${API_VERSION}/calendar`, calendarRoutes);
}
{
  const callLogRoutes = await safeImportDefault('./routes/callLogRoutes.js');
  if (callLogRoutes) app.use(`/api/${API_VERSION}/call-logs`, callLogRoutes);
}
{
  const chatRoutes = await safeImportDefault('./routes/chatRoutes.js');
  if (chatRoutes) app.use(`/api/${API_VERSION}/chat`, chatRoutes);
}
{
  const organizationRoutes = await safeImportDefault('./routes/organizationRoutes.js');
  if (organizationRoutes) app.use(`/api/${API_VERSION}/organizations`, organizationRoutes);
}
{
  const academicEngineRoutes = await safeImportDefault('./routes/academicEngineRoutes.js');
  if (academicEngineRoutes) app.use(`/api/${API_VERSION}/academic-engine`, academicEngineRoutes);
}
{
  const transportRoutes = await safeImportDefault('./routes/transportRoutes.js');
  if (transportRoutes) app.use(`/api/${API_VERSION}/transport`, transportRoutes);
}
{
  const transportAssignmentRoutes = await safeImportDefault('./routes/transportAssignmentRoutes.js');
  if (transportAssignmentRoutes) app.use(`/api/${API_VERSION}/transport-assignments`, transportAssignmentRoutes);
}
{
  const transportReportRoutes = await safeImportDefault('./routes/transportReportRoutes.js');
  if (transportReportRoutes) app.use(`/api/${API_VERSION}/transport-reports`, transportReportRoutes);
}
{
  const driverRoutes = await safeImportDefault('./routes/driverRoutes.js');
  if (driverRoutes) app.use(`/api/${API_VERSION}/drivers`, driverRoutes);
}
{
  const transportRouteRoutes = await safeImportDefault('./routes/transportRouteRoutes.js');
  if (transportRouteRoutes) app.use(`/api/${API_VERSION}/transport/routes`, transportRouteRoutes);
}
{
  const pickupPointRoutes = await safeImportDefault('./routes/pickupPointRoutes.js');
  if (pickupPointRoutes) app.use(`/api/${API_VERSION}/transport/pickup-points`, pickupPointRoutes);
}
{
  const emailSettingsRoutes = await safeImportDefault('./routes/emailSettingsRoutes.js');
  if (emailSettingsRoutes) app.use(`/api/${API_VERSION}/email-settings`, emailSettingsRoutes);
}
{
  const gdprSettingsRoutes = await safeImportDefault('./routes/gdprSettingsRoutes.js');
  if (gdprSettingsRoutes) app.use(`/api/${API_VERSION}/gdpr-settings`, gdprSettingsRoutes);
}
{
  const analyticsRoutes = await safeImportDefault('./routes/analyticsRoutes.js');
  if (analyticsRoutes) app.use(`/api/${API_VERSION}/analytics`, analyticsRoutes);
}
{
  const branchRoutes = await safeImportDefault('./routes/branchRoutes.js');
  if (branchRoutes) app.use(`/api/${API_VERSION}/branches`, branchRoutes);
}
{
  const dsrRoutes = await safeImportDefault('./routes/dsrRoutes.js');
  if (dsrRoutes) app.use(`/api/${API_VERSION}/dsr`, dsrRoutes);
}
{
  const apiKeyRoutes = await safeImportDefault('./routes/apiKeyRoutes.js');
  if (apiKeyRoutes) app.use(`/api/${API_VERSION}/api-keys`, apiKeyRoutes);
}
{
  const reportRoutes = await safeImportDefault('./routes/reportRoutes.js');
  if (reportRoutes) app.use(`/api/${API_VERSION}/reports`, reportRoutes);
}
{
  const ptmRoutes = await safeImportDefault('./routes/ptmRoutes.js');
  if (ptmRoutes) app.use(`/api/${API_VERSION}/ptm`, ptmRoutes);
}
{
  const admissionRoutes = await safeImportDefault('./routes/admissionRoutes.js');
  if (admissionRoutes) app.use(`/api/${API_VERSION}/admissions`, admissionRoutes);
}
{
  const themeRoutes = await safeImportDefault('./routes/themeRoutes.js');
  if (themeRoutes) app.use(`/api/${API_VERSION}/theme`, themeRoutes);
}
{
  const libraryRoutes = await safeImportDefault('./routes/libraryRoutes.js');
  if (libraryRoutes) app.use(`/api/${API_VERSION}/library`, libraryRoutes);
}
{
  const hostelRoutes = await safeImportDefault('./routes/hostelRoutes.js');
  if (hostelRoutes) app.use(`/api/${API_VERSION}/hostel`, hostelRoutes);
}
{
  const inventoryRoutes = await safeImportDefault('./routes/inventoryRoutes.js');
  if (inventoryRoutes) app.use(`/api/${API_VERSION}/inventory`, inventoryRoutes);
}
{
  const canteenRoutes = await safeImportDefault('./routes/canteenRoutes.js');
  if (canteenRoutes) app.use(`/api/${API_VERSION}/canteen`, canteenRoutes);
}
{
  const sportRoutes = await safeImportDefault('./routes/sportRoutes.js');
  if (sportRoutes) app.use(`/api/${API_VERSION}/sports`, sportRoutes);
}
{
  const playerRoutes = await safeImportDefault('./routes/playerRoutes.js');
  if (playerRoutes) app.use(`/api/${API_VERSION}/players`, playerRoutes);
}
{
  const onlineExamRoutes = await safeImportDefault('./routes/onlineExamRoutes.js');
  if (onlineExamRoutes) app.use(`/api/${API_VERSION}/online-exams`, onlineExamRoutes);
}
{
  const blogRoutes = await safeImportDefault('./routes/blogRoutes.js');
  if (blogRoutes) app.use(`/api/${API_VERSION}/blog`, blogRoutes);
}
{
  const addonRoutes = await safeImportDefault('./routes/addonRoutes.js');
  if (addonRoutes) app.use(`/api/${API_VERSION}/addons`, addonRoutes);
}
{
  const membershipPlanRoutes = await safeImportDefault('./routes/membershipPlanRoutes.js');
  if (membershipPlanRoutes) app.use(`/api/${API_VERSION}/membership-plans`, membershipPlanRoutes);
}
{
  const advancedAttendanceRoutes = await safeImportDefault('./routes/advancedAttendanceRoutes.js');
  if (advancedAttendanceRoutes) app.use(`/api/${API_VERSION}/advanced-attendance`, advancedAttendanceRoutes);
}
{
  const idCardRoutes = await safeImportDefault('./routes/idCardRoutes.js');
  if (idCardRoutes) app.use(`/api/${API_VERSION}/id-cards`, idCardRoutes);
}
{
  const realtimeDashboardRoutes = await safeImportDefault('./routes/realtimeDashboardRoutes.js');
  if (realtimeDashboardRoutes) app.use(`/api/${API_VERSION}/realtime-dashboard`, realtimeDashboardRoutes);
}
{
  const paymentGatewayRoutes = await safeImportDefault('./routes/paymentGatewayRoutes.js');
  if (paymentGatewayRoutes) app.use(`/api/${API_VERSION}/payment-gateways`, paymentGatewayRoutes);
}
{
  const installmentRoutes = await safeImportDefault('./routes/installmentRoutes.js');
  if (installmentRoutes) app.use(`/api/${API_VERSION}/installments`, installmentRoutes);
}
{
  const scholarshipRoutes = await safeImportDefault('./routes/scholarshipRoutes.js');
  if (scholarshipRoutes) app.use(`/api/${API_VERSION}/scholarships`, scholarshipRoutes);
}
{
  const feeReminderRoutes = await safeImportDefault('./routes/feeReminderRoutes.js');
  if (feeReminderRoutes) app.use(`/api/${API_VERSION}/fee-reminders`, feeReminderRoutes);
}
{
  const advancedProctoringRoutes = await safeImportDefault('./routes/advancedProctoringRoutes.js');
  if (advancedProctoringRoutes) app.use(`/api/${API_VERSION}/proctoring`, advancedProctoringRoutes);
}
{
  const questionBankRoutes = await safeImportDefault('./routes/questionBankRoutes.js');
  if (questionBankRoutes) app.use(`/api/${API_VERSION}/question-bank`, questionBankRoutes);
}
{
  const groupChatRoutes = await safeImportDefault('./routes/groupChatRoutes.js');
  if (groupChatRoutes) app.use(`/api/${API_VERSION}/group-chat`, groupChatRoutes);
}
{
  const fileSharingRoutes = await safeImportDefault('./routes/fileSharingRoutes.js');
  if (fileSharingRoutes) app.use(`/api/${API_VERSION}/file-sharing`, fileSharingRoutes);
}
{
  const dashboardWidgetRoutes = await safeImportDefault('./routes/dashboardWidgetRoutes.js');
  if (dashboardWidgetRoutes) app.use(`/api/${API_VERSION}/dashboard-widgets`, dashboardWidgetRoutes);
}
{
  const financeRoutes = await safeImportDefault('./routes/financeRoutes.js');
  if (financeRoutes) app.use(`/api/${API_VERSION}/finance`, financeRoutes);
}
{
  const geofenceRoutes = await safeImportDefault('./routes/geofenceRoutes.js');
  if (geofenceRoutes) app.use(`/api/${API_VERSION}/geofence`, geofenceRoutes);
}
{
  const testimonialRoutes = await safeImportDefault('./routes/testimonialRoutes.js');
  if (testimonialRoutes) app.use(`/api/${API_VERSION}/testimonials`, testimonialRoutes);
}
{
  const agentRoutes = await safeImportDefault('./routes/agentRoutes.js');
  if (agentRoutes) app.use(`/api/${API_VERSION}/agents`, agentRoutes);
}
{
  const pendingInstitutionRegistrationRoutes = await safeImportDefault('./routes/pendingInstitutionRegistrationRoutes.js');
  if (pendingInstitutionRegistrationRoutes) app.use(`/api/${API_VERSION}/pending-registrations`, pendingInstitutionRegistrationRoutes);
}
{
  const superAdminRoutes = await safeImportDefault('./routes/superAdminRoutes.js');
  if (superAdminRoutes) app.use(`/api/${API_VERSION}/super-admin`, superAdminRoutes);
}

console.log('All routes configured.');

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

console.log('Error handling middleware configured.');

// Prefer configured PORT, fallback to 5000
const BASE_PORT = Number.parseInt(process.env.PORT, 10) || 5000;
const MAX_PORT_TRIES = Number.parseInt(process.env.PORT_TRIES, 10) || 10;

const startServer = (port, remainingTries = MAX_PORT_TRIES) => {
  console.log(`Starting server on port ${port}...`);

  const server = app.listen(port, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${port}`);
    console.log(`📡 API available at: http://localhost:${port}/api/v1`);
    console.log(`🔗 Health check: http://localhost:${port}/health`);
  }).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      if (remainingTries > 0) {
        const nextPort = port + 1;
        logger.warn(`Port ${port} in use; trying ${nextPort}...`);
        console.warn(`⚠️  Port ${port} is in use; trying ${nextPort}...`);
        return startServer(nextPort, remainingTries - 1);
      }

      logger.error(`Port ${port} is already in use (no more retries)`);
      console.error(`❌ Port ${port} is already in use. Please free up the port or set PORT in .env.`);
      console.error(`💡 To find/kill processes using port ${BASE_PORT}:`);
      console.error(`   Windows: netstat -ano | findstr :${BASE_PORT}`);
      console.error(`   Then: taskkill /PID <PID> /F`);
      process.exit(1);
    } else {
      logger.error('Server error:', error);
      console.error('❌ Server error:', error);
      process.exit(1);
    }
  });

  const gracefulShutdown = async () => {
    logger.info('Shutting down server...');
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection', { reason });
  });
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error });
    gracefulShutdown();
  });

  return server;
};

// Start the server
startServer(BASE_PORT);

console.log('Server start function called.');

export default app;
