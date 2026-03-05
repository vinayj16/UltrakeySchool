import sgMail from '@sendgrid/mail';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

class EmailService {
  constructor() {
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@edusearch.com';
    this.templates = this.loadTemplates();
  }

  // Load email templates
  loadTemplates() {
    const templatesDir = path.join(__dirname, '../templates/emails');
    const templates = {};

    try {
      // Load HTML templates
      const welcomeTemplate = path.join(templatesDir, 'welcome.html');
      const passwordResetTemplate = path.join(templatesDir, 'password-reset.html');
      const feeReminderTemplate = path.join(templatesDir, 'fee-reminder.html');
      const attendanceAlertTemplate = path.join(templatesDir, 'attendance-alert.html');
      const examResultTemplate = path.join(templatesDir, 'exam-result.html');
      const noticeTemplate = path.join(templatesDir, 'notice.html');

      if (fs.existsSync(welcomeTemplate)) {
        templates.welcome = fs.readFileSync(welcomeTemplate, 'utf8');
      }
      if (fs.existsSync(passwordResetTemplate)) {
        templates.passwordReset = fs.readFileSync(passwordResetTemplate, 'utf8');
      }
      if (fs.existsSync(feeReminderTemplate)) {
        templates.feeReminder = fs.readFileSync(feeReminderTemplate, 'utf8');
      }
      if (fs.existsSync(attendanceAlertTemplate)) {
        templates.attendanceAlert = fs.readFileSync(attendanceAlertTemplate, 'utf8');
      }
      if (fs.existsSync(examResultTemplate)) {
        templates.examResult = fs.readFileSync(examResultTemplate, 'utf8');
      }
      if (fs.existsSync(noticeTemplate)) {
        templates.notice = fs.readFileSync(noticeTemplate, 'utf8');
      }
    } catch (error) {
      console.warn('Email templates not found, using default templates');
    }

    return templates;
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    const subject = 'Welcome to EduSearch!';
    const html = this.templates.welcome || this.getDefaultWelcomeTemplate(user);

    return this.sendEmail(user.email, subject, html);
  }

  // Send password reset email
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request';
    const html = this.templates.passwordReset || this.getDefaultPasswordResetTemplate(user, resetUrl);

    return this.sendEmail(user.email, subject, html);
  }

  // Send fee reminder email
  async sendFeeReminderEmail(student, fees) {
    const subject = 'Fee Payment Reminder';
    const html = this.templates.feeReminder || this.getDefaultFeeReminderTemplate(student, fees);

    return this.sendEmail(student.email, subject, html);
  }

  // Send attendance alert
  async sendAttendanceAlertEmail(parent, student, attendance) {
    const subject = 'Student Attendance Alert';
    const html = this.templates.attendanceAlert || this.getDefaultAttendanceAlertTemplate(parent, student, attendance);

    return this.sendEmail(parent.email, subject, html);
  }

  // Send exam result notification
  async sendExamResultEmail(student, exam, result) {
    const subject = `Exam Result: ${exam.subject}`;
    const html = this.templates.examResult || this.getDefaultExamResultTemplate(student, exam, result);

    return this.sendEmail(student.email, subject, html);
  }

  // Send notice/announcement
  async sendNoticeEmail(recipients, notice) {
    const subject = `Notice: ${notice.title}`;
    const html = this.templates.notice || this.getDefaultNoticeTemplate(notice);

    // Send to multiple recipients
    const promises = recipients.map(recipient =>
      this.sendEmail(recipient.email, subject, html)
    );

    return Promise.all(promises);
  }

  // Generic email sending method
  async sendEmail(to, subject, html, text = null, attachments = []) {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        console.warn('SendGrid API key not configured, email not sent');
        return { success: false, message: 'Email service not configured' };
      }

      const msg = {
        to: to,
        from: {
          email: this.fromEmail,
          name: 'EduSearch'
        },
        subject: subject,
        html: html,
        text: text || this.htmlToText(html),
        attachments: attachments
      };

      const result = await sgMail.send(msg);
      console.log(`Email sent successfully to ${to}: ${subject}`);

      return {
        success: true,
        messageId: result[0]?.headers?.['x-message-id'] || 'sent',
        to: to,
        subject: subject
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error.message,
        to: to,
        subject: subject
      };
    }
  }

  // Bulk email sending
  async sendBulkEmail(recipients, subject, html, text = null) {
    const promises = recipients.map(recipient =>
      this.sendEmail(recipient.email, subject, html, text)
    );

    const results = await Promise.allSettled(promises);
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    return {
      total: recipients.length,
      successful,
      failed,
      results
    };
  }

  // Convert HTML to text for email clients that don't support HTML
  htmlToText(html) {
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  // Default email templates
  getDefaultWelcomeTemplate(user) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to EduSearch!</h1>
        <p>Dear ${user.name},</p>
        <p>Welcome to EduSearch! Your account has been successfully created.</p>
        <p>You can now:</p>
        <ul>
          <li>Access your dashboard</li>
          <li>View academic information</li>
          <li>Manage fees and payments</li>
          <li>Communicate with teachers and staff</li>
        </ul>
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>EduSearch Team</p>
      </div>
    `;
  }

  getDefaultPasswordResetTemplate(user, resetUrl) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>Dear ${user.name},</p>
        <p>You have requested to reset your password. Click the link below to reset your password:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>EduSearch Team</p>
      </div>
    `;
  }

  getDefaultFeeReminderTemplate(student, fees) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc3545;">Fee Payment Reminder</h1>
        <p>Dear ${student.name},</p>
        <p>This is a reminder that you have outstanding fees that need to be paid.</p>
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3>Outstanding Fees:</h3>
          <p><strong>Total Amount:</strong> ₹${fees.totalAmount}</p>
          <p><strong>Due Date:</strong> ${fees.dueDate}</p>
        </div>
        <p>Please make the payment as soon as possible to avoid any inconvenience.</p>
        <p>Best regards,<br>EduSearch Team</p>
      </div>
    `;
  }

  getDefaultAttendanceAlertTemplate(parent, student, attendance) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ffc107;">Attendance Alert</h1>
        <p>Dear ${parent.name},</p>
        <p>This is to inform you about your child's attendance.</p>
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3>Student: ${student.name}</h3>
          <p><strong>Class:</strong> ${student.class}</p>
          <p><strong>Attendance Rate:</strong> ${attendance.percentage}%</p>
          <p><strong>Days Present:</strong> ${attendance.present}/${attendance.total}</p>
        </div>
        <p>Please ensure regular attendance for better academic performance.</p>
        <p>Best regards,<br>EduSearch Team</p>
      </div>
    `;
  }

  getDefaultExamResultTemplate(student, exam, result) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #28a745;">Exam Result Notification</h1>
        <p>Dear ${student.name},</p>
        <p>Your exam results are now available.</p>
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3>Exam Details:</h3>
          <p><strong>Subject:</strong> ${exam.subject}</p>
          <p><strong>Exam Date:</strong> ${exam.date}</p>
          <p><strong>Marks Obtained:</strong> ${result.marks}/${result.totalMarks}</p>
          <p><strong>Percentage:</strong> ${result.percentage}%</p>
          <p><strong>Grade:</strong> ${result.grade}</p>
        </div>
        <p>Congratulations on your performance!</p>
        <p>Best regards,<br>EduSearch Team</p>
      </div>
    `;
  }

  getDefaultNoticeTemplate(notice) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #007bff;">Important Notice</h1>
        <h2>${notice.title}</h2>
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
          ${notice.content}
        </div>
        <p><strong>Date:</strong> ${notice.date}</p>
        ${notice.attachment ? `<p><strong>Attachment:</strong> <a href="${notice.attachment}">Download</a></p>` : ''}
        <p>Best regards,<br>EduSearch Team</p>
      </div>
    `;
  }
}

// Export singleton instance
export default new EmailService();
