import mongoose from 'mongoose';
import axios from 'axios';
import crypto from 'crypto';
import logger from '../utils/logger.js';

// Video Conference Schema
const videoConferenceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  type: {
    type: String,
    enum: ['class', 'meeting', 'ptm', 'webinar', 'one_on_one'],
    default: 'meeting',
  },
  provider: {
    type: String,
    enum: ['jitsi', 'zoom', 'internal'],
    default: 'jitsi',
  },
  meetingId: {
    type: String,
    required: true,
    unique: true,
  },
  meetingUrl: String,
  password: String,
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['host', 'moderator', 'participant'],
      default: 'participant',
    },
    joinedAt: Date,
    leftAt: Date,
    duration: Number,
  }],
  scheduledStartTime: Date,
  scheduledEndTime: Date,
  actualStartTime: Date,
  actualEndTime: Date,
  duration: Number,
  maxParticipants: {
    type: Number,
    default: 100,
  },
  settings: {
    enableVideo: {
      type: Boolean,
      default: true,
    },
    enableAudio: {
      type: Boolean,
      default: true,
    },
    enableChat: {
      type: Boolean,
      default: true,
    },
    enableScreenShare: {
      type: Boolean,
      default: true,
    },
    enableRecording: {
      type: Boolean,
      default: false,
    },
    waitingRoom: {
      type: Boolean,
      default: false,
    },
    muteOnEntry: {
      type: Boolean,
      default: false,
    },
  },
  recording: {
    enabled: Boolean,
    url: String,
    duration: Number,
    size: Number,
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'ended', 'cancelled'],
    default: 'scheduled',
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true,
  },
}, {
  timestamps: true,
});

const VideoConference = mongoose.model('VideoConference', videoConferenceSchema);

class VideoConferencingService {
  constructor() {
    // Jitsi configuration
    this.jitsiDomain = process.env.JITSI_DOMAIN || 'meet.jit.si';
    
    // Zoom configuration
    this.zoomApiKey = process.env.ZOOM_API_KEY || '';
    this.zoomApiSecret = process.env.ZOOM_API_SECRET || '';
    this.zoomBaseUrl = 'https://api.zoom.us/v2';
  }

  /**
   * Create video conference
   * @param {Object} conferenceData - Conference data
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Conference
   */
  async createConference(conferenceData, tenantId) {
    try {
      const { provider = 'jitsi' } = conferenceData;

      // Generate unique meeting ID
      const meetingId = this.generateMeetingId();

      let meetingUrl;
      let externalMeetingData = {};

      // Create meeting based on provider
      if (provider === 'jitsi') {
        meetingUrl = await this.createJitsiMeeting(meetingId, conferenceData);
      } else if (provider === 'zoom') {
        externalMeetingData = await this.createZoomMeeting(conferenceData);
        meetingUrl = externalMeetingData.join_url;
      } else {
        // Internal provider
        meetingUrl = `${process.env.APP_URL}/conference/${meetingId}`;
      }

      const conference = new VideoConference({
        ...conferenceData,
        meetingId,
        meetingUrl,
        provider,
        tenant: tenantId,
        ...externalMeetingData,
      });

      await conference.save();
      await conference.populate(['host', 'participants.user']);

      logger.info(`Video conference created: ${conference._id}`);
      return conference;
    } catch (error) {
      logger.error(`Error creating video conference: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate unique meeting ID
   * @returns {string} Meeting ID
   */
  generateMeetingId() {
    return crypto.randomBytes(8).toString('hex');
  }

  /**
   * Create Jitsi meeting
   * @param {string} meetingId - Meeting ID
   * @param {Object} conferenceData - Conference data
   * @returns {string} Meeting URL
   */
  async createJitsiMeeting(meetingId, conferenceData) {
    const { title } = conferenceData;
    const roomName = `${meetingId}-${title.replace(/\s+/g, '-').toLowerCase()}`;
    return `https://${this.jitsiDomain}/${roomName}`;
  }

  /**
   * Create Zoom meeting
   * @param {Object} conferenceData - Conference data
   * @returns {Object} Zoom meeting data
   */
  async createZoomMeeting(conferenceData) {
    try {
      const { title, scheduledStartTime, duration, settings } = conferenceData;

      const token = this.generateZoomToken();

      const response = await axios.post(
        `${this.zoomBaseUrl}/users/me/meetings`,
        {
          topic: title,
          type: scheduledStartTime ? 2 : 1, // 1: Instant, 2: Scheduled
          start_time: scheduledStartTime,
          duration: duration || 60,
          settings: {
            host_video: settings?.enableVideo || true,
            participant_video: settings?.enableVideo || true,
            join_before_host: false,
            mute_upon_entry: settings?.muteOnEntry || false,
            waiting_room: settings?.waitingRoom || false,
            audio: 'both',
            auto_recording: settings?.enableRecording ? 'cloud' : 'none',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        meetingId: response.data.id.toString(),
        meetingUrl: response.data.join_url,
        password: response.data.password,
      };
    } catch (error) {
      logger.error(`Error creating Zoom meeting: ${error.message}`);
      throw new Error('Failed to create Zoom meeting');
    }
  }

  /**
   * Generate Zoom JWT token
   * @returns {string} JWT token
   */
  generateZoomToken() {
    // In production, implement proper JWT token generation for Zoom
    // This is a placeholder
    return this.zoomApiKey;
  }

  /**
   * Get conferences
   * @param {string} tenantId - Tenant ID
   * @param {Object} filters - Filters
   * @returns {Object} Conferences with pagination
   */
  async getConferences(tenantId, filters = {}) {
    try {
      const { page = 1, limit = 10, status, type, hostId } = filters;
      const query = { tenant: tenantId };

      if (status) query.status = status;
      if (type) query.type = type;
      if (hostId) query.host = hostId;

      const conferences = await VideoConference.find(query)
        .populate(['host', 'participants.user'])
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ scheduledStartTime: -1 });

      const total = await VideoConference.countDocuments(query);

      return {
        conferences,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error(`Error fetching conferences: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get conference by ID
   * @param {string} conferenceId - Conference ID
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Conference
   */
  async getConferenceById(conferenceId, tenantId) {
    try {
      const conference = await VideoConference.findOne({
        _id: conferenceId,
        tenant: tenantId,
      }).populate(['host', 'participants.user']);

      if (!conference) {
        throw new Error('Conference not found');
      }

      return conference;
    } catch (error) {
      logger.error(`Error fetching conference: ${error.message}`);
      throw error;
    }
  }

  /**
   * Start conference
   * @param {string} conferenceId - Conference ID
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Updated conference
   */
  async startConference(conferenceId, tenantId) {
    try {
      const conference = await VideoConference.findOneAndUpdate(
        { _id: conferenceId, tenant: tenantId },
        {
          status: 'active',
          actualStartTime: new Date(),
        },
        { new: true }
      ).populate(['host', 'participants.user']);

      if (!conference) {
        throw new Error('Conference not found');
      }

      logger.info(`Conference started: ${conferenceId}`);
      return conference;
    } catch (error) {
      logger.error(`Error starting conference: ${error.message}`);
      throw error;
    }
  }

  /**
   * End conference
   * @param {string} conferenceId - Conference ID
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Updated conference
   */
  async endConference(conferenceId, tenantId) {
    try {
      const conference = await VideoConference.findOne({
        _id: conferenceId,
        tenant: tenantId,
      });

      if (!conference) {
        throw new Error('Conference not found');
      }

      const endTime = new Date();
      const duration = conference.actualStartTime
        ? Math.floor((endTime - conference.actualStartTime) / 1000 / 60)
        : 0;

      conference.status = 'ended';
      conference.actualEndTime = endTime;
      conference.duration = duration;

      await conference.save();
      await conference.populate(['host', 'participants.user']);

      logger.info(`Conference ended: ${conferenceId}`);
      return conference;
    } catch (error) {
      logger.error(`Error ending conference: ${error.message}`);
      throw error;
    }
  }

  /**
   * Join conference
   * @param {string} conferenceId - Conference ID
   * @param {string} userId - User ID
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Updated conference
   */
  async joinConference(conferenceId, userId, tenantId) {
    try {
      const conference = await VideoConference.findOne({
        _id: conferenceId,
        tenant: tenantId,
      });

      if (!conference) {
        throw new Error('Conference not found');
      }

      // Check if user already in participants
      const existingParticipant = conference.participants.find(
        p => p.user.toString() === userId
      );

      if (existingParticipant) {
        existingParticipant.joinedAt = new Date();
      } else {
        conference.participants.push({
          user: userId,
          role: 'participant',
          joinedAt: new Date(),
        });
      }

      await conference.save();
      await conference.populate(['host', 'participants.user']);

      logger.info(`User ${userId} joined conference: ${conferenceId}`);
      return conference;
    } catch (error) {
      logger.error(`Error joining conference: ${error.message}`);
      throw error;
    }
  }

  /**
   * Leave conference
   * @param {string} conferenceId - Conference ID
   * @param {string} userId - User ID
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Updated conference
   */
  async leaveConference(conferenceId, userId, tenantId) {
    try {
      const conference = await VideoConference.findOne({
        _id: conferenceId,
        tenant: tenantId,
      });

      if (!conference) {
        throw new Error('Conference not found');
      }

      const participant = conference.participants.find(
        p => p.user.toString() === userId
      );

      if (participant) {
        participant.leftAt = new Date();
        if (participant.joinedAt) {
          participant.duration = Math.floor(
            (participant.leftAt - participant.joinedAt) / 1000 / 60
          );
        }
      }

      await conference.save();

      logger.info(`User ${userId} left conference: ${conferenceId}`);
      return conference;
    } catch (error) {
      logger.error(`Error leaving conference: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cancel conference
   * @param {string} conferenceId - Conference ID
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Updated conference
   */
  async cancelConference(conferenceId, tenantId) {
    try {
      const conference = await VideoConference.findOneAndUpdate(
        { _id: conferenceId, tenant: tenantId },
        { status: 'cancelled' },
        { new: true }
      );

      if (!conference) {
        throw new Error('Conference not found');
      }

      logger.info(`Conference cancelled: ${conferenceId}`);
      return conference;
    } catch (error) {
      logger.error(`Error cancelling conference: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get conference statistics
   * @param {string} tenantId - Tenant ID
   * @returns {Object} Statistics
   */
  async getConferenceStatistics(tenantId) {
    try {
      const conferences = await VideoConference.find({ tenant: tenantId });

      const stats = {
        total: conferences.length,
        scheduled: conferences.filter(c => c.status === 'scheduled').length,
        active: conferences.filter(c => c.status === 'active').length,
        ended: conferences.filter(c => c.status === 'ended').length,
        cancelled: conferences.filter(c => c.status === 'cancelled').length,
        totalDuration: conferences.reduce((sum, c) => sum + (c.duration || 0), 0),
        totalParticipants: conferences.reduce((sum, c) => sum + c.participants.length, 0),
        byType: {},
        byProvider: {},
      };

      conferences.forEach(c => {
        stats.byType[c.type] = (stats.byType[c.type] || 0) + 1;
        stats.byProvider[c.provider] = (stats.byProvider[c.provider] || 0) + 1;
      });

      return stats;
    } catch (error) {
      logger.error(`Error fetching conference statistics: ${error.message}`);
      throw error;
    }
  }
}

export default new VideoConferencingService();
