/**
 * Email Configuration
 * Handles email sending with nodemailer, validation, retry logic, and rate limiting
 */

import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

// Validation constants
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 200;
const MAX_RECIPIENTS = 100;
const MAX_ATTACHMENTS = 10;
const MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024; // 25MB
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 2000;
const RATE_LIMIT_PER_MINUTE = 60;
const RATE_LIMIT_PER_HOUR = 1000;

// Email templates configuration
const TEMPLATES = {
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password_reset',
  EMAIL_VERIFICATION: 'email_verification',
  NOTIFICATION: 'notification',
  INVITATION: 'invitation',
  REMINDER: 'reminder',
  ALERT: 'alert'
};

// Rate limiting tracking
const rateLimitTracker = {
  minute: { count: 0, resetAt: Date.now() + 60000 },
  hour: { count: 0, resetAt: Date.now() + 3600000 }
};

// Helper function to validate email address
const validateEmail = (email) => {
  const errors = [];
  
  if (!email || typeof email !== 'string') {
    errors.push('Email is required and must be a string');
    return errors;
  }
  
  const trimmedEmail = email.trim();
  
  if (trimmedEmail.length === 0) {
    errors.push('Email cannot be empty');
  }
  
  if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
    errors.push('Email must not exceed ' + MAX_EMAIL_LENGTH + ' characters');
  }
  
  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.push('Invalid email format');
  }
  
  return errors;
};

// Helper function to validate email options
const validateEmailOptions = (options) => {
  const errors = [];
  
  if (!options || typeof options !== 'object') {
    errors.push('Email options must be an object');
    return errors;
  }
  
  // Validate recipient(s)
  if (options.to) {
    const recipients = Array.isArray(options.to) ? options.to : [options.to];
    
    if (recipients.length === 0) {
      errors.push('At least one recipient is required');
    }
    
    if (recipients.length > MAX_RECIPIENTS) {
      errors.push('Maximum ' + MAX_RECIPIENTS + ' recipients allowed per email');
    }
    
    recipients.forEach((email, index) => {
      const emailErrors = validateEmail(email);
      if (emailErrors.length > 0) {
        errors.push('Recipient ' + index + ': ' + emailErrors.join(', '));
      }
    });
  } else {
    errors.push('Recipient email (to) is required');
  }
  
  // Validate sender
  if (options.from) {
    const fromErrors = validateEmail(options.from);
    if (fromErrors.length > 0) {
      errors.push('Sender email: ' + fromErrors.join(', '));
    }
  }
  
  // Validate subject
  if (!options.subject || typeof options.subject !== 'string') {
    errors.push('Subject is required and must be a string');
  } else if (options.subject.trim().length === 0) {
    errors.push('Subject cannot be empty');
  } else if (options.subject.length > MAX_SUBJECT_LENGTH) {
    errors.push('Subject must not exceed ' + MAX_SUBJECT_LENGTH + ' characters');
  }
  
  // Validate content
  if (!options.text && !options.html) {
    errors.push('Either text or html content is required');
  }
  
  // Validate attachments
  if (options.attachments) {
    if (!Array.isArray(options.attachments)) {
      errors.push('Attachments must be an array');
    } else if (options.attachments.length > MAX_ATTACHMENTS) {
      errors.push('Maximum ' + MAX_ATTACHMENTS + ' attachments allowed');
    }
  }
  
  return errors;
};

// Helper function to check rate limits
const checkRateLimit = () => {
  const now = Date.now();
  
  // Reset minute counter if needed
  if (now >= rateLimitTracker.minute.resetAt) {
    rateLimitTracker.minute.count = 0;
    rateLimitTracker.minute.resetAt = now + 60000;
  }
  
  // Reset hour counter if needed
  if (now >= rateLimitTracker.hour.resetAt) {
    rateLimitTracker.hour.count = 0;
    rateLimitTracker.hour.resetAt = now + 3600000;
  }
  
  // Check limits
  if (rateLimitTracker.minute.count >= RATE_LIMIT_PER_MINUTE) {
    const waitTime = Math.ceil((rateLimitTracker.minute.resetAt - now) / 1000);
    return {
      allowed: false,
      reason: 'Rate limit exceeded: ' + RATE_LIMIT_PER_MINUTE + ' emails per minute. Try again in ' + waitTime + ' seconds.'
    };
  }
  
  if (rateLimitTracker.hour.count >= RATE_LIMIT_PER_HOUR) {
    const waitTime = Math.ceil((rateLimitTracker.hour.resetAt - now) / 60000);
    return {
      allowed: false,
      reason: 'Rate limit exceeded: ' + RATE_LIMIT_PER_HOUR + ' emails per hour. Try again in ' + waitTime + ' minutes.'
    };
  }
  
  return { allowed: true };
};

// Helper function to increment rate limit counters
const incrementRateLimit = () => {
  rateLimitTracker.minute.count++;
  rateLimitTracker.hour.count++;
};

// Helper function to sanitize email content
const sanitizeContent = (content) => {
  if (!content) return content;
  
  // Remove potentially dangerous HTML/script tags
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
};

// Create transporter with validation
const createTransporter = () => {
  try {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    
    // Validate required configuration
    if (!host || !user || !pass) {
      throw new Error('Missing required SMTP configuration (SMTP_HOST, SMTP_USER, SMTP_PASS)');
    }
    
    if (isNaN(port) || port < 1 || port > 65535) {
      throw new Error('Invalid SMTP_PORT. Must be between 1 and 65535');
    }
    
    const config = {
      host,
      port,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
      pool: true, // Use pooled connections
      maxConnections: parseInt(process.env.SMTP_MAX_CONNECTIONS) || 5,
      maxMessages: parseInt(process.env.SMTP_MAX_MESSAGES) || 100,
      rateDelta: parseInt(process.env.SMTP_RATE_DELTA) || 1000,
      rateLimit: parseInt(process.env.SMTP_RATE_LIMIT) || 5,
      tls: {
        rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false'
      }
    };
    
    logger.info('Creating email transporter:', {
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.auth.user
    });
    
    return nodemailer.createTransport(config);
  } catch (error) {
    logger.error('Error creating email transporter:', error);
    throw error;
  }
};

// Send email with retry logic
export const sendEmail = async (options, retryCount = 0) => {
  try {
    // Validate options
    const validationErrors = validateEmailOptions(options);
    if (validationErrors.length > 0) {
      logger.error('Email validation failed:', { errors: validationErrors });
      throw new Error('Email validation failed: ' + validationErrors.join('; '));
    }
    
    // Check rate limits
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      logger.warn('Email rate limit exceeded:', { reason: rateLimitCheck.reason });
      throw new Error(rateLimitCheck.reason);
    }
    
    // Sanitize content
    const sanitizedHtml = options.html ? sanitizeContent(options.html) : undefined;
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: options.from || process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      text: options.text,
      html: sanitizedHtml,
      attachments: options.attachments || [],
      replyTo: options.replyTo,
      priority: options.priority || 'normal',
      headers: options.headers
    };
    
    logger.info('Sending email:', {
      to: options.to,
      subject: options.subject,
      hasAttachments: (options.attachments || []).length > 0,
      attempt: retryCount + 1
    });
    
    const info = await transporter.sendMail(mailOptions);
    
    // Increment rate limit counter
    incrementRateLimit();
    
    logger.info('Email sent successfully:', {
      to: options.to,
      subject: options.subject,
      messageId: info.messageId,
      response: info.response
    });
    
    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    };
  } catch (error) {
    logger.error('Error sending email:', {
      to: options.to,
      subject: options.subject,
      error: error.message,
      attempt: retryCount + 1
    });
    
    // Retry logic
    if (retryCount < MAX_RETRY_ATTEMPTS) {
      logger.info('Retrying email send:', {
        attempt: retryCount + 2,
        maxAttempts: MAX_RETRY_ATTEMPTS,
        delayMs: RETRY_DELAY_MS
      });
      
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * (retryCount + 1)));
      return sendEmail(options, retryCount + 1);
    }
    
    throw error;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (user) => {
  try {
    if (!user || !user.email || !user.name) {
      throw new Error('User object with email and name is required');
    }
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to EduSearch!</h1>
          </div>
          <div class="content">
            <p>Hello ${user.name},</p>
            <p>Thank you for registering with EduSearch. Your account has been created successfully.</p>
            <p>You can now log in and start using our platform to manage your educational institution efficiently.</p>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>EduSearch Team</p>
            <p>&copy; ${new Date().getFullYear()} EduSearch. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return sendEmail({
      to: user.email,
      subject: 'Welcome to EduSearch',
      html,
      text: 'Welcome to EduSearch! Your account has been created successfully.'
    });
  } catch (error) {
    logger.error('Error sending welcome email:', error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    if (!user || !user.email || !user.name) {
      throw new Error('User object with email and name is required');
    }
    
    if (!resetToken || typeof resetToken !== 'string') {
      throw new Error('Reset token is required');
    }
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = frontendUrl + '/reset-password?token=' + resetToken;
    const expiryHours = parseInt(process.env.PASSWORD_RESET_EXPIRY_HOURS) || 1;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello ${user.name},</p>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
            <div class="warning">
              <strong>Important:</strong> This link will expire in ${expiryHours} hour(s).
            </div>
            <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>EduSearch Team</p>
            <p>&copy; ${new Date().getFullYear()} EduSearch. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return sendEmail({
      to: user.email,
      subject: 'Password Reset Request - EduSearch',
      html,
      text: 'Password reset requested. Link: ' + resetUrl,
      priority: 'high'
    });
  } catch (error) {
    logger.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send email verification
export const sendVerificationEmail = async (user, verificationToken) => {
  try {
    if (!user || !user.email || !user.name) {
      throw new Error('User object with email and name is required');
    }
    
    if (!verificationToken || typeof verificationToken !== 'string') {
      throw new Error('Verification token is required');
    }
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verifyUrl = frontendUrl + '/verify-email?token=' + verificationToken;
    const expiryHours = parseInt(process.env.EMAIL_VERIFICATION_EXPIRY_HOURS) || 24;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <p>Hello ${user.name},</p>
            <p>Thank you for registering with EduSearch. Please verify your email address by clicking the button below:</p>
            <a href="${verifyUrl}" class="button">Verify Email</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #28a745;">${verifyUrl}</p>
            <p>This link will expire in ${expiryHours} hours.</p>
            <p>If you didn't create an account with EduSearch, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>EduSearch Team</p>
            <p>&copy; ${new Date().getFullYear()} EduSearch. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return sendEmail({
      to: user.email,
      subject: 'Verify Your Email - EduSearch',
      html,
      text: 'Please verify your email. Link: ' + verifyUrl
    });
  } catch (error) {
    logger.error('Error sending verification email:', error);
    throw error;
  }
};

// Send notification email
export const sendNotificationEmail = async (user, notification) => {
  try {
    if (!user || !user.email || !user.name) {
      throw new Error('User object with email and name is required');
    }
    
    if (!notification || !notification.title || !notification.message) {
      throw new Error('Notification object with title and message is required');
    }
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #17a2b8; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${notification.title}</h1>
          </div>
          <div class="content">
            <p>Hello ${user.name},</p>
            <p>${notification.message}</p>
            ${notification.actionUrl ? '<p><a href="' + notification.actionUrl + '" style="display: inline-block; padding: 10px 20px; background-color: #17a2b8; color: white; text-decoration: none; border-radius: 5px;">View Details</a></p>' : ''}
          </div>
          <div class="footer">
            <p>Best regards,<br>EduSearch Team</p>
            <p>&copy; ${new Date().getFullYear()} EduSearch. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return sendEmail({
      to: user.email,
      subject: notification.title,
      html,
      text: notification.message,
      priority: notification.priority || 'normal'
    });
  } catch (error) {
    logger.error('Error sending notification email:', error);
    throw error;
  }
};

// Send bulk emails with progress tracking
export const sendBulkEmails = async (recipients, subject, html, options = {}) => {
  try {
    if (!Array.isArray(recipients) || recipients.length === 0) {
      throw new Error('Recipients array is required and must not be empty');
    }
    
    if (recipients.length > MAX_RECIPIENTS) {
      throw new Error('Maximum ' + MAX_RECIPIENTS + ' recipients allowed per bulk send');
    }
    
    if (!subject || !html) {
      throw new Error('Subject and HTML content are required');
    }
    
    logger.info('Starting bulk email send:', {
      recipientCount: recipients.length,
      subject
    });
    
    const promises = recipients.map(recipient => {
      const personalizedHtml = html
        .replace(/\{\{name\}\}/g, recipient.name || 'User')
        .replace(/\{\{email\}\}/g, recipient.email || '');
      
      return sendEmail({
        to: recipient.email,
        subject,
        html: personalizedHtml,
        text: options.text,
        ...options
      }).catch(error => ({
        error: true,
        email: recipient.email,
        message: error.message
      }));
    });
    
    const results = await Promise.allSettled(promises);
    
    const successful = results.filter(r => r.status === 'fulfilled' && !r.value.error).length;
    const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.error)).length;
    
    const failedEmails = results
      .filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.error))
      .map(r => r.status === 'rejected' ? r.reason : r.value);
    
    logger.info('Bulk email send completed:', {
      total: recipients.length,
      successful,
      failed
    });
    
    if (failedEmails.length > 0) {
      logger.warn('Failed emails:', failedEmails);
    }
    
    return {
      successful,
      failed,
      total: recipients.length,
      failedEmails: failedEmails.length > 0 ? failedEmails : undefined
    };
  } catch (error) {
    logger.error('Error in bulk email send:', error);
    throw error;
  }
};

// Test email configuration
export const testEmailConfig = async () => {
  try {
    logger.info('Testing email configuration...');
    
    const transporter = createTransporter();
    await transporter.verify();
    
    logger.info('Email configuration test successful');
    
    return {
      success: true,
      message: 'Email configuration is valid and SMTP server is reachable'
    };
  } catch (error) {
    logger.error('Email configuration test failed:', error);
    
    return {
      success: false,
      message: error.message,
      error: error.code || 'UNKNOWN_ERROR'
    };
  }
};

// Get email configuration status
export const getEmailConfigStatus = () => {
  const config = {
    host: process.env.SMTP_HOST || 'Not configured',
    port: process.env.SMTP_PORT || 'Not configured',
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || 'Not configured',
    from: process.env.EMAIL_FROM || process.env.SMTP_USER || 'Not configured',
    configured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  };
  
  return config;
};

// Get rate limit status
export const getRateLimitStatus = () => {
  const now = Date.now();
  
  return {
    minute: {
      count: rateLimitTracker.minute.count,
      limit: RATE_LIMIT_PER_MINUTE,
      remaining: RATE_LIMIT_PER_MINUTE - rateLimitTracker.minute.count,
      resetsIn: Math.max(0, Math.ceil((rateLimitTracker.minute.resetAt - now) / 1000))
    },
    hour: {
      count: rateLimitTracker.hour.count,
      limit: RATE_LIMIT_PER_HOUR,
      remaining: RATE_LIMIT_PER_HOUR - rateLimitTracker.hour.count,
      resetsIn: Math.max(0, Math.ceil((rateLimitTracker.hour.resetAt - now) / 60000))
    }
  };
};

// Reset rate limits (for testing or admin purposes)
export const resetRateLimits = () => {
  const now = Date.now();
  rateLimitTracker.minute = { count: 0, resetAt: now + 60000 };
  rateLimitTracker.hour = { count: 0, resetAt: now + 3600000 };
  
  logger.info('Rate limits reset');
  
  return { success: true, message: 'Rate limits have been reset' };
};

export {
  TEMPLATES,
  MAX_EMAIL_LENGTH,
  MAX_SUBJECT_LENGTH,
  MAX_RECIPIENTS,
  MAX_ATTACHMENTS,
  MAX_ATTACHMENT_SIZE,
  EMAIL_PATTERN,
  validateEmail,
  validateEmailOptions
};
