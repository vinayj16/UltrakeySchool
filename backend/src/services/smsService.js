import twilio from 'twilio';
import logger from '../utils/logger.js';

class SMSService {
  constructor() {
    this.client = null;
    this.initialized = false;
    this.initialize();
  }

  initialize() {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;

      if (!accountSid || !authToken || !this.phoneNumber) {
        logger.warn('Twilio credentials not configured. SMS service disabled.');
        return;
      }

      this.client = twilio(accountSid, authToken);
      this.initialized = true;
      logger.info('SMS service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize SMS service', { error: error.message });
    }
  }

  async sendSMS(to, message) {
    if (!this.initialized) {
      logger.warn('SMS service not initialized. Skipping SMS send.');
      return { success: false, error: 'SMS service not configured' };
    }

    try {
      // Format phone number (ensure it has country code)
      const formattedPhone = this.formatPhoneNumber(to);

      const result = await this.client.messages.create({
        body: message,
        from: this.phoneNumber,
        to: formattedPhone,
      });

      logger.info('SMS sent successfully', {
        to: formattedPhone,
        sid: result.sid,
        status: result.status,
      });

      return {
        success: true,
        messageId: result.sid,
        status: result.status,
      };
    } catch (error) {
      logger.error('Failed to send SMS', {
        to,
        error: error.message,
      });

      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendBulkSMS(recipients, message) {
    if (!this.initialized) {
      logger.warn('SMS service not initialized. Skipping bulk SMS send.');
      return { success: false, error: 'SMS service not configured' };
    }

    const results = [];

    for (const recipient of recipients) {
      const result = await this.sendSMS(recipient.phone, message);
      results.push({
        phone: recipient.phone,
        name: recipient.name,
        ...result,
      });

      // Add small delay to avoid rate limiting
      await this.delay(100);
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    logger.info('Bulk SMS completed', {
      total: results.length,
      success: successCount,
      failed: failureCount,
    });

    return {
      success: true,
      total: results.length,
      successCount,
      failureCount,
      results,
    };
  }

  async sendAttendanceAlert(parent, student, attendanceData) {
    const message = `Alert: ${student.name} was marked ${attendanceData.status} on ${attendanceData.date}. - ${process.env.SCHOOL_NAME || 'School'}`;
    return await this.sendSMS(parent.phone, message);
  }

  async sendFeeReminder(parent, student, feeData) {
    const message = `Reminder: Fee payment of ₹${feeData.amount} is due for ${student.name} by ${feeData.dueDate}. - ${process.env.SCHOOL_NAME || 'School'}`;
    return await this.sendSMS(parent.phone, message);
  }

  async sendExamNotification(parent, student, examData) {
    const message = `Exam Alert: ${examData.examName} for ${student.name} is scheduled on ${examData.date} at ${examData.time}. - ${process.env.SCHOOL_NAME || 'School'}`;
    return await this.sendSMS(parent.phone, message);
  }

  async sendHomeworkNotification(parent, student, homeworkData) {
    const message = `New Homework: ${homeworkData.subject} homework assigned to ${student.name}. Due: ${homeworkData.dueDate}. - ${process.env.SCHOOL_NAME || 'School'}`;
    return await this.sendSMS(parent.phone, message);
  }

  async sendEmergencyAlert(recipients, message) {
    const emergencyMessage = `URGENT: ${message} - ${process.env.SCHOOL_NAME || 'School'}`;
    return await this.sendBulkSMS(recipients, emergencyMessage);
  }

  async sendOTP(phone, otp) {
    const message = `Your OTP is: ${otp}. Valid for 10 minutes. Do not share with anyone. - ${process.env.SCHOOL_NAME || 'School'}`;
    return await this.sendSMS(phone, message);
  }

  formatPhoneNumber(phone) {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '');

    // If number doesn't start with country code, add India's code (+91)
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }

    // Add + prefix
    return '+' + cleaned;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getMessageStatus(messageSid) {
    if (!this.initialized) {
      return { success: false, error: 'SMS service not configured' };
    }

    try {
      const message = await this.client.messages(messageSid).fetch();
      return {
        success: true,
        status: message.status,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage,
      };
    } catch (error) {
      logger.error('Failed to fetch message status', {
        messageSid,
        error: error.message,
      });
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default new SMSService();
