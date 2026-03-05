import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';
import axios from 'axios';

class FaceRecognitionService {
  constructor() {
    this.apiUrl = process.env.FACE_RECOGNITION_API_URL;
    this.apiKey = process.env.FACE_RECOGNITION_API_KEY;
    this.confidenceThreshold = parseFloat(process.env.FACE_RECOGNITION_THRESHOLD) || 85;
  }

  /**
   * Register face for a user
   */
  async registerFace(userId, imageData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Extract face encoding (in production, use actual face recognition API)
      const faceEncoding = await this.extractFaceEncoding(imageData);

      if (!faceEncoding) {
        throw new Error('No face detected in image');
      }

      if (!user.faceRecognitionData) {
        user.faceRecognitionData = {};
      }

      user.faceRecognitionData = {
        encoding: faceEncoding,
        imageUrl: imageData.url,
        registeredAt: new Date(),
        isActive: true,
      };

      await user.save();

      logger.info('Face registered', { userId });
      return {
        success: true,
        message: 'Face registered successfully',
      };
    } catch (error) {
      logger.error('Failed to register face', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Verify face and mark attendance
   */
  async verifyFaceAttendance(imageData, schoolId, location = null) {
    try {
      // Extract face encoding from captured image
      const capturedEncoding = await this.extractFaceEncoding(imageData);

      if (!capturedEncoding) {
        throw new Error('No face detected in image');
      }

      // Find matching user
      const users = await User.find({
        schoolId,
        'faceRecognitionData.isActive': true,
      });

      let matchedUser = null;
      let highestConfidence = 0;

      for (const user of users) {
        if (!user.faceRecognitionData?.encoding) continue;

        const confidence = await this.compareFaces(
          capturedEncoding,
          user.faceRecognitionData.encoding
        );

        if (confidence > highestConfidence && confidence >= this.confidenceThreshold) {
          highestConfidence = confidence;
          matchedUser = user;
        }
      }

      if (!matchedUser) {
        throw new Error('Face not recognized');
      }

      // Mark attendance
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let attendance = await Attendance.findOne({
        userId: matchedUser._id,
        schoolId,
        date: today,
      });

      const now = new Date();

      if (!attendance) {
        // Create new attendance record
        attendance = new Attendance({
          schoolId,
          userId: matchedUser._id,
          userType: matchedUser.role,
          date: today,
          status: 'present',
          checkInTime: now,
          method: 'face-recognition',
          faceRecognitionData: {
            imageUrl: imageData.url,
            confidence: highestConfidence,
            timestamp: now,
            verified: true,
          },
          location,
        });
      } else {
        // Update check-out time
        attendance.checkOutTime = now;
        attendance.faceRecognitionData = {
          imageUrl: imageData.url,
          confidence: highestConfidence,
          timestamp: now,
          verified: true,
        };
      }

      await attendance.save();

      logger.info('Face recognition attendance marked', {
        userId: matchedUser._id,
        confidence: highestConfidence,
      });

      return {
        success: true,
        user: {
          id: matchedUser._id,
          name: matchedUser.name,
          role: matchedUser.role,
        },
        attendance: {
          id: attendance._id,
          status: attendance.status,
          checkInTime: attendance.checkInTime,
          checkOutTime: attendance.checkOutTime,
        },
        confidence: highestConfidence,
      };
    } catch (error) {
      logger.error('Face recognition failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Extract face encoding from image
   */
  async extractFaceEncoding(imageData) {
    try {
      // In production, use actual face recognition API (AWS Rekognition, Azure Face API, etc.)
      if (this.apiUrl && this.apiKey) {
        const response = await axios.post(
          `${this.apiUrl}/extract-encoding`,
          {
            image: imageData.base64 || imageData.url,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        return response.data.encoding;
      }

      // Fallback: Generate mock encoding for development
      return this.generateMockEncoding(imageData);
    } catch (error) {
      logger.error('Failed to extract face encoding', { error: error.message });
      throw error;
    }
  }

  /**
   * Compare two face encodings
   */
  async compareFaces(encoding1, encoding2) {
    try {
      // In production, use actual face recognition API
      if (this.apiUrl && this.apiKey) {
        const response = await axios.post(
          `${this.apiUrl}/compare-faces`,
          {
            encoding1,
            encoding2,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        return response.data.confidence;
      }

      // Fallback: Calculate similarity for development
      return this.calculateSimilarity(encoding1, encoding2);
    } catch (error) {
      logger.error('Failed to compare faces', { error: error.message });
      return 0;
    }
  }

  /**
   * Generate mock encoding for development
   */
  generateMockEncoding(imageData) {
    // Generate a simple hash-based encoding
    const hash = require('crypto')
      .createHash('sha256')
      .update(imageData.url || imageData.base64 || 'default')
      .digest('hex');

    // Convert to array of numbers (128-dimensional vector)
    const encoding = [];
    for (let i = 0; i < 128; i++) {
      encoding.push(parseInt(hash.substr(i % hash.length, 2), 16));
    }

    return encoding;
  }

  /**
   * Calculate similarity between encodings
   */
  calculateSimilarity(encoding1, encoding2) {
    if (!encoding1 || !encoding2 || encoding1.length !== encoding2.length) {
      return 0;
    }

    // Calculate Euclidean distance
    let sumSquaredDiff = 0;
    for (let i = 0; i < encoding1.length; i++) {
      const diff = encoding1[i] - encoding2[i];
      sumSquaredDiff += diff * diff;
    }

    const distance = Math.sqrt(sumSquaredDiff);

    // Convert distance to confidence (0-100)
    // Lower distance = higher confidence
    const maxDistance = Math.sqrt(encoding1.length * 255 * 255);
    const confidence = Math.max(0, 100 - (distance / maxDistance) * 100);

    return confidence;
  }

  /**
   * Deactivate face recognition for user
   */
  async deactivateFaceRecognition(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.faceRecognitionData) {
        user.faceRecognitionData.isActive = false;
      }

      await user.save();

      logger.info('Face recognition deactivated', { userId });
      return {
        success: true,
        message: 'Face recognition deactivated successfully',
      };
    } catch (error) {
      logger.error('Failed to deactivate face recognition', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Get face recognition statistics
   */
  async getStatistics(schoolId, dateRange = {}) {
    try {
      const query = {
        schoolId,
        method: 'face-recognition',
      };

      if (dateRange.startDate) {
        query.date = { $gte: new Date(dateRange.startDate) };
      }
      if (dateRange.endDate) {
        query.date = { ...query.date, $lte: new Date(dateRange.endDate) };
      }

      const [total, verified, avgConfidence] = await Promise.all([
        Attendance.countDocuments(query),
        Attendance.countDocuments({ ...query, 'faceRecognitionData.verified': true }),
        Attendance.aggregate([
          { $match: query },
          {
            $group: {
              _id: null,
              avgConfidence: { $avg: '$faceRecognitionData.confidence' },
            },
          },
        ]),
      ]);

      return {
        total,
        verified,
        verificationRate: total > 0 ? (verified / total) * 100 : 0,
        averageConfidence: avgConfidence[0]?.avgConfidence || 0,
      };
    } catch (error) {
      logger.error('Failed to get face recognition statistics', { error: error.message });
      throw error;
    }
  }
}

export default new FaceRecognitionService();
