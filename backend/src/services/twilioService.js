import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let twilioClient;
if (accountSid && authToken) {
  twilioClient = twilio(accountSid, authToken);
}

class TwilioService {
  constructor() {
    this.templates = {
      welcome: "Welcome to EduSearch! Your account has been created. Access your dashboard at: {{url}}",
      feeReminder: "Fee Reminder: ₹{{amount}} due by {{dueDate}}. Pay now: {{paymentUrl}}",
      attendanceAlert: "{{studentName}} attendance: {{percentage}}%. Contact school if needed.",
      examResult: "{{studentName}} exam result: {{subject}} - {{marks}}/{{totalMarks}} ({{percentage}}%)",
      notice: "Notice from {{schoolName}}: {{title}}. Check portal for details.",
      emergency: "EMERGENCY ALERT from {{schoolName}}: {{message}}. Contact: {{contact}}"
    };
  }

  // Send SMS
  async sendSMS(to, message, options = {}) {
    try {
      if (!twilioClient) {
        console.warn('Twilio not configured, SMS not sent');
        return { success: false, message: 'SMS service not configured' };
      }

      // Ensure phone number has country code
      const formattedNumber = this.formatPhoneNumber(to);

      const smsOptions = {
        body: message,
        from: fromPhoneNumber,
        to: formattedNumber,
        ...options
      };

      const result = await twilioClient.messages.create(smsOptions);

      console.log(`SMS sent successfully to ${to}: ${result.sid}`);

      return {
        success: true,
        messageId: result.sid,
        to: to,
        status: result.status,
        cost: result.price
      };
    } catch (error) {
      console.error('SMS sending failed:', error);
      return {
        success: false,
        error: error.message,
        to: to
      };
    }
  }

  // Send bulk SMS
  async sendBulkSMS(recipients, message, options = {}) {
    const promises = recipients.map(recipient =>
      this.sendSMS(recipient.phone || recipient, message, options)
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

  // Send welcome SMS
  async sendWelcomeSMS(user) {
    const message = this.templates.welcome
      .replace('{{url}}', process.env.FRONTEND_URL || 'https://edusearch.com/login');

    return this.sendSMS(user.phone, message);
  }

  // Send fee reminder SMS
  async sendFeeReminderSMS(student, feeDetails) {
    const message = this.templates.feeReminder
      .replace('{{amount}}', feeDetails.totalAmount)
      .replace('{{dueDate}}', feeDetails.dueDate)
      .replace('{{paymentUrl}}', feeDetails.paymentUrl || process.env.FRONTEND_URL + '/fees');

    return this.sendSMS(student.phone, message);
  }

  // Send attendance alert SMS
  async sendAttendanceAlertSMS(parent, student, attendance) {
    const message = this.templates.attendanceAlert
      .replace('{{studentName}}', student.name)
      .replace('{{percentage}}', attendance.percentage);

    return this.sendSMS(parent.phone, message);
  }

  // Send exam result SMS
  async sendExamResultSMS(student, exam, result) {
    const message = this.templates.examResult
      .replace('{{studentName}}', student.name)
      .replace('{{subject}}', exam.subject)
      .replace('{{marks}}', result.marks)
      .replace('{{totalMarks}}', result.totalMarks)
      .replace('{{percentage}}', result.percentage);

    return this.sendSMS(student.phone, message);
  }

  // Send notice SMS
  async sendNoticeSMS(recipient, notice) {
    const message = this.templates.notice
      .replace('{{schoolName}}', notice.schoolName || 'School')
      .replace('{{title}}', notice.title);

    return this.sendSMS(recipient.phone, message);
  }

  // Send emergency alert SMS
  async sendEmergencyAlertSMS(recipient, alert) {
    const message = this.templates.emergency
      .replace('{{schoolName}}', alert.schoolName || 'School')
      .replace('{{message}}', alert.message)
      .replace('{{contact}}', alert.contact || 'school office');

    return this.sendSMS(recipient.phone, message, { priority: 'high' });
  }

  // Format phone number to international format
  formatPhoneNumber(phoneNumber) {
    // Remove all non-numeric characters
    let cleaned = phoneNumber.replace(/\D/g, '');

    // If it starts with 0, replace with country code (assuming India +91)
    if (cleaned.startsWith('0')) {
      cleaned = '91' + cleaned.substring(1);
    }

    // If it doesn't start with +, add +
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }

    return cleaned;
  }

  // Get SMS delivery status
  async getSMSStatus(messageId) {
    try {
      if (!twilioClient) {
        return { success: false, message: 'SMS service not configured' };
      }

      const message = await twilioClient.messages(messageId).fetch();

      return {
        success: true,
        messageId: message.sid,
        status: message.status,
        to: message.to,
        from: message.from,
        dateSent: message.dateSent,
        dateDelivered: message.dateDelivered,
        price: message.price,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage
      };
    } catch (error) {
      console.error('Get SMS status error:', error);
      return {
        success: false,
        error: error.message,
        messageId
      };
    }
  }

  // Get account balance/usage
  async getAccountInfo() {
    try {
      if (!twilioClient) {
        return { success: false, message: 'SMS service not configured' };
      }

      const account = await twilioClient.api.accounts(accountSid).fetch();
      const balance = await twilioClient.api.balance.fetch();

      return {
        success: true,
        account: {
          sid: account.sid,
          friendlyName: account.friendlyName,
          status: account.status,
          type: account.type,
          balance: balance.balance,
          currency: balance.currency
        }
      };
    } catch (error) {
      console.error('Get account info error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export default new TwilioService();
