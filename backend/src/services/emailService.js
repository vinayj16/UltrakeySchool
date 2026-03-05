/**
 * Email Service
 * Handles sending emails using SendGrid (or other providers)
 */

import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

// Email configuration
const config = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

// Create transporter
let transporter = null;

const createTransporter = () => {
  try {
    transporter = nodemailer.createTransport({
      ...config,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    logger.info('Email transporter created successfully');
    return transporter;
  } catch (error) {
    logger.error('Failed to create email transporter:', error);
    return null;
  }
};

// Initialize transporter
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  createTransporter();
}

const createOtpTemplate = (data = {}) => {
  const expiresIn = data.expiresIn || '10 minutes';
  const note = data.note ? `<p style="margin-top: 20px;">${data.note}</p>` : '';
  return {
    subject: data.subject || 'Your EduManage Pro verification code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background: #fdfdfd;">
        <h2 style="color: #2c3e50; margin-bottom: 10px;">EduManage Pro Verification</h2>
        <p style="margin-bottom: 10px;">Use the code below to complete authentication. The code expires in ${expiresIn}.</p>
        <div style="background: #f2f6ff; padding: 20px; text-align: center; border-radius: 8px; margin: 15px 0;">
          <span style="font-size: 32px; letter-spacing: 6px; font-weight: 600;">${data.otp || '------'}</span>
        </div>
        <p style="margin: 0;">If you did not request this, safely ignore this message.</p>
        ${note}
        <p style="margin-top: 20px;">Secure regards,<br>The EduManage Pro Security Team</p>
      </div>
    `
  };
};

const createPTMParentTemplate = (data = {}) => {
  const schoolName = data.schoolName || 'EduManage Pro';
  const meetingUrl = data.meetingUrl
    ? `<p><strong>Meeting Link:</strong> <a href="${data.meetingUrl}" target="_blank" style="color:#1c87c9;">Join Meeting</a></p>`
    : '<p><strong>Meeting Link:</strong> Will be shared via the portal shortly.</p>';
  const notes = data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : '';

  return {
    subject: data.subject || 'Reminder: Upcoming Parent-Teacher Meeting',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px; border-radius: 10px; background: #fff; border: 1px solid #eee;">
        <h2 style="color: #0d3b66;">Parent-Teacher Meeting Reminder</h2>
        <p>Dear ${data.parentName || 'Parent / Guardian'},</p>
        <p>This is a reminder for the scheduled meeting for <strong>${data.studentName || 'your child'}</strong> with ${data.teacherName || 'the teacher'}.</p>
        <p><strong>Date:</strong> ${data.date || 'TBD'}</p>
        <p><strong>Time:</strong> ${data.time || 'TBD'}</p>
        ${meetingUrl}
        ${notes}
        <p>We recommend joining at least five minutes before the scheduled time.</p>
        <p>Best regards,<br>${schoolName} PTM Team</p>
      </div>
    `
  };
};

const createPTMTeacherTemplate = (data = {}) => {
  const meetingUrl = data.meetingUrl
    ? `<p><strong>Meeting Link:</strong> <a href="${data.meetingUrl}" target="_blank" style="color:#1c87c9;">Open Meeting</a></p>`
    : '<p><strong>Meeting Link:</strong> Will be created shortly.</p>';
  const notes = data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : '';

  return {
    subject: data.subject || 'Reminder: Parent-Teacher Meeting Upcoming',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 10px; border: 1px solid #ddd;">
        <h2 style="color: #1a1a1a;">PTM Reminder</h2>
        <p>Dear ${data.teacherName || 'Teacher'},</p>
        <p>You have a parent-teacher meeting scheduled for <strong>${data.studentName || 'a student'}</strong> with ${data.parentName || 'a parent'}.</p>
        <p><strong>Date:</strong> ${data.date || 'TBD'}</p>
        <p><strong>Time:</strong> ${data.time || 'TBD'}</p>
        ${meetingUrl}
        ${notes}
        <p>Thank you for engaging with families to support our learners.</p>
        <p>EduManage Pro Support Team</p>
      </div>
    `
  };
};

const templateRegistry = {
  otp: createOtpTemplate,
  'ptm-reminder': createPTMParentTemplate,
  'ptm-reminder-teacher': createPTMTeacherTemplate
};

const renderTemplate = (templateName, data = {}) => {
  const renderer = templateRegistry[templateName];
  if (!renderer) {
    return null;
  }
  return renderer(data);
};

/**
 * Send email
 * @param {Object} options - Email options
 * @returns {Promise} Send result
 */
export const sendEmail = async (options) => {
  try {
    if (!transporter) {
      transporter = createTransporter();
    }

    let subject = options.subject || 'EduSearch Notification';
    let html = options.html || '';
    let text = options.text || '';

    if (options.template) {
      const templateContent = renderTemplate(options.template, options.data || {});
      if (!templateContent) {
        throw new Error(`Email template "${options.template}" not found`);
      }
      subject = options.subject || templateContent.subject || subject;
      html = options.html || templateContent.html || html;
      text = options.text || templateContent.text || text;
    }

    const mailOptions = {
      from: options.from || process.env.SMTP_FROM || `"EduSearch" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject,
      html,
      text,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${options.to}: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected
    };
  } catch (error) {
    logger.error('Failed to send email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send welcome email to new user
 */
export const sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome to EduSearch!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4a90e2;">Welcome to EduSearch!</h2>
      <p>Hello ${name},</p>
      <p>Welcome to EduSearch! We're excited to have you on board.</p>
      <p>With EduSearch, you can:</p>
      <ul>
        <li>Manage students, teachers, and staff</li>
        <li>Track attendance and academic performance</li>
        <li>Handle fees and finances</li>
        <li>Communicate effectively</li>
      </ul>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br>The EduSearch Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  const subject = 'EduSearch - Password Reset Request';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4a90e2;">Reset Your Password</h2>
      <p>You requested a password reset for your EduSearch account.</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; background-color: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>The EduSearch Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};

/**
 * Send fee reminder email
 */
export const sendFeeReminderEmail = async (email, studentName, amount, dueDate) => {
  const subject = 'EduSearch - Fee Payment Reminder';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4a90e2;">Fee Payment Reminder</h2>
      <p>Dear Parent/Guardian,</p>
      <p>This is a reminder that a fee payment is due for <strong>${studentName}</strong>.</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p><strong>Amount Due:</strong> $${amount}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
      </div>
      <p>Please log in to EduSearch to make the payment.</p>
      <p>Best regards,<br>The EduSearch Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};

/**
 * Send attendance alert email
 */
export const sendAttendanceAlertEmail = async (email, studentName, date, status) => {
  const subject = 'EduSearch - Attendance Alert';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #e74c3c;">Attendance Alert</h2>
      <p>Dear Parent/Guardian,</p>
      <p>Your child <strong>${studentName}</strong> was marked as <strong>${status}</strong> on ${date}.</p>
      <p>Please contact the school if you have any questions.</p>
      <p>Best regards,<br>The EduSearch Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};

/**
 * Send exam results notification
 */
export const sendExamResultEmail = async (email, studentName, examName) => {
  const subject = 'EduSearch - Exam Results Published';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4a90e2;">Exam Results Available</h2>
      <p>Hello,</p>
      <p>The results for <strong>${examName}</strong> have been published for <strong>${studentName}</strong>.</p>
      <p>Please log in to EduSearch to view the results.</p>
      <p>Best regards,<br>The EduSearch Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};

/**
 * Send notice/announcement notification
 */
export const sendNoticeEmail = async (email, title, content) => {
  const subject = `EduSearch - ${title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4a90e2;">${title}</h2>
      <div>${content}</div>
      <p style="margin-top: 20px;">Best regards,<br>The EduSearch Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};

/**
 * Send custom email with template
 */
export const sendTemplatedEmail = async (email, templateName, data) => {
  // Template definitions
  const templates = {
    welcome: {
      subject: 'Welcome to EduSearch!',
      html: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a90e2;">Welcome ${data.name}!</h2>
          <p>Thank you for joining EduSearch.</p>
        </div>
      `
    },
    feeReceipt: {
      subject: 'Fee Payment Receipt',
      html: (data) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a90e2;">Payment Receipt</h2>
          <p>Amount: $${data.amount}</p>
          <p>Date: ${data.date}</p>
          <p>Transaction ID: ${data.transactionId}</p>
        </div>
      `
    }
  };

  const template = templates[templateName];
  if (!template) {
    return { success: false, error: 'Template not found' };
  }

  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html(data)
  });
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendFeeReminderEmail,
  sendAttendanceAlertEmail,
  sendExamResultEmail,
  sendNoticeEmail,
  sendTemplatedEmail
};
