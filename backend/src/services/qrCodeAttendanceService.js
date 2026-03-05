import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';
import QRCode from 'qrcode';

class QRCodeAttendanceService {
  constructor() {
    this.qrCodeExpiry = parseInt(process.env.QR_CODE_EXPIRY_MINUTES) || 5; // minutes
    this.activeQRCodes = new Map(); // In production, use Redis
  }

  /**
   * Generate QR code for attendance session
   */
  async generateAttendanceQR(sessionData) {
    try {
      const { schoolId, classId, teacherId, location } = sessionData;

      // Generate unique session ID
      const sessionId = crypto.randomBytes(16).toString('hex');
      const timestamp = Date.now();
      const expiryTime = timestamp + this.qrCodeExpiry * 60 * 1000;

      const qrData = {
        sessionId,
        schoolId,
        classId,
        teacherId,
        timestamp,
        expiryTime,
        location,
      };

      // Store active QR code session
      this.activeQRCodes.set(sessionId, qrData);

      // Auto-expire after set time
      setTimeout(() => {
        this.activeQRCodes.delete(sessionId);
      }, this.qrCodeExpiry * 60 * 1000);

      // Generate QR code image
      const qrCodeString = JSON.stringify(qrData);
      const qrCodeImage = await QRCode.toDataURL(qrCodeString);

      logger.info('QR code generated for attendance', { sessionId, schoolId });

      return {
        sessionId,
        qrCodeImage,
        expiryTime: new Date(expiryTime),
        validFor: this.qrCodeExpiry,
      };
    } catch (error) {
      logger.error('Failed to generate QR code', { error: error.message });
      throw error;
    }
  }

  /**
   * Scan QR code and mark attendance
   */
  async scanQRCodeAttendance(qrCodeData, userId, location = null) {
    try {
      // Parse QR code data
      const sessionData = typeof qrCodeData === 'string' 
        ? JSON.parse(qrCodeData) 
        : qrCodeData;

      const { sessionId, schoolId, classId, expiryTime } = sessionData;

      // Verify QR code is still valid
      if (!this.activeQRCodes.has(sessionId)) {
        throw new Error('QR code has expired or is invalid');
      }

      if (Date.now() > expiryTime) {
        this.activeQRCodes.delete(sessionId);
        throw new Error('QR code has expired');
      }

      // Get user details
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify user belongs to the school
      if (user.schoolId?.toString() !== schoolId) {
        throw new Error('User does not belong to this school');
      }

      // Verify location if required
      if (sessionData.location && location) {
        const distance = this.calculateDistance(
          sessionData.location.latitude,
          sessionData.location.longitude,
          location.latitude,
          location.longitude
        );

        // Allow 100 meters radius
        if (distance > 0.1) {
          throw new Error('You are not at the correct location');
        }
      }

      // Mark attendance
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let attendance = await Attendance.findOne({
        userId: user._id,
        schoolId,
        date: today,
      });

      const now = new Date();

      if (!attendance) {
        // Create new attendance record
        attendance = new Attendance({
          schoolId,
          userId: user._id,
          userType: user.role,
          date: today,
          status: 'present',
          checkInTime: now,
          method: 'qr-code',
          qrCodeData: {
            qrCode: sessionId,
            scannedAt: now,
            location,
            verified: true,
          },
          location,
        });
      } else {
        // Update check-out time
        attendance.checkOutTime = now;
        attendance.qrCodeData = {
          qrCode: sessionId,
          scannedAt: now,
          location,
          verified: true,
        };
      }

      await attendance.save();

      logger.info('QR code attendance marked', {
        userId: user._id,
        sessionId,
        attendanceId: attendance._id,
      });

      return {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
        },
        attendance: {
          id: attendance._id,
          status: attendance.status,
          checkInTime: attendance.checkInTime,
          checkOutTime: attendance.checkOutTime,
        },
      };
    } catch (error) {
      logger.error('QR code scan failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Generate personal QR code for user
   */
  async generatePersonalQR(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate unique QR code for user
      const qrData = {
        userId: user._id,
        name: user.name,
        role: user.role,
        schoolId: user.schoolId,
        generatedAt: Date.now(),
      };

      // Store in user profile
      const qrCodeString = JSON.stringify(qrData);
      const qrCodeImage = await QRCode.toDataURL(qrCodeString);

      user.personalQRCode = {
        data: qrCodeString,
        imageUrl: qrCodeImage,
        generatedAt: new Date(),
      };

      await user.save();

      logger.info('Personal QR code generated', { userId });

      return {
        qrCodeImage,
        qrData,
      };
    } catch (error) {
      logger.error('Failed to generate personal QR code', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Scan personal QR code for attendance
   */
  async scanPersonalQR(qrCodeData, schoolId, markedBy) {
    try {
      const userData = typeof qrCodeData === 'string' 
        ? JSON.parse(qrCodeData) 
        : qrCodeData;

      const { userId } = userData;

      // Verify user
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.schoolId?.toString() !== schoolId) {
        throw new Error('User does not belong to this school');
      }

      // Mark attendance
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let attendance = await Attendance.findOne({
        userId: user._id,
        schoolId,
        date: today,
      });

      const now = new Date();

      if (!attendance) {
        attendance = new Attendance({
          schoolId,
          userId: user._id,
          userType: user.role,
          date: today,
          status: 'present',
          checkInTime: now,
          method: 'qr-code',
          markedBy,
          qrCodeData: {
            qrCode: 'personal',
            scannedAt: now,
            verified: true,
          },
        });
      } else {
        attendance.checkOutTime = now;
      }

      await attendance.save();

      logger.info('Personal QR code attendance marked', { userId: user._id });

      return {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
        },
        attendance: {
          id: attendance._id,
          status: attendance.status,
          checkInTime: attendance.checkInTime,
        },
      };
    } catch (error) {
      logger.error('Personal QR scan failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Get active QR sessions
   */
  getActiveSessions(schoolId) {
    const sessions = [];
    
    for (const [sessionId, data] of this.activeQRCodes.entries()) {
      if (data.schoolId === schoolId && Date.now() < data.expiryTime) {
        sessions.push({
          sessionId,
          classId: data.classId,
          teacherId: data.teacherId,
          expiryTime: new Date(data.expiryTime),
          remainingTime: Math.floor((data.expiryTime - Date.now()) / 1000),
        });
      }
    }

    return sessions;
  }

  /**
   * Invalidate QR session
   */
  invalidateSession(sessionId) {
    if (this.activeQRCodes.has(sessionId)) {
      this.activeQRCodes.delete(sessionId);
      logger.info('QR session invalidated', { sessionId });
      return { success: true, message: 'Session invalidated' };
    }
    throw new Error('Session not found');
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get QR code attendance statistics
   */
  async getStatistics(schoolId, dateRange = {}) {
    try {
      const query = {
        schoolId,
        method: 'qr-code',
      };

      if (dateRange.startDate) {
        query.date = { $gte: new Date(dateRange.startDate) };
      }
      if (dateRange.endDate) {
        query.date = { ...query.date, $lte: new Date(dateRange.endDate) };
      }

      const [total, verified] = await Promise.all([
        Attendance.countDocuments(query),
        Attendance.countDocuments({ ...query, 'qrCodeData.verified': true }),
      ]);

      return {
        total,
        verified,
        verificationRate: total > 0 ? (verified / total) * 100 : 0,
      };
    } catch (error) {
      logger.error('Failed to get QR code statistics', { error: error.message });
      throw error;
    }
  }
}

export default new QRCodeAttendanceService();
