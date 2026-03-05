import videoConferencingService from '../services/videoConferencingService.js';
import { successResponse, createdResponse, errorResponse, validationErrorResponse, notFoundResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

// Validation constants
const VALID_STATUSES = ['scheduled', 'in_progress', 'ended', 'cancelled'];
const VALID_PLATFORMS = ['zoom', 'meet', 'teams', 'jitsi', 'webex'];
const VALID_RECORDING_STATUSES = ['enabled', 'disabled', 'paused'];
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_DURATION_MINUTES = 480; // 8 hours
const MIN_DURATION_MINUTES = 5;
const MAX_PARTICIPANTS = 1000;

// Helper function to validate MongoDB ObjectId
const validateObjectId = (id, fieldName = 'ID') => {
  if (!id) {
    return fieldName + ' is required';
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return 'Invalid ' + fieldName + ' format';
  }
  return null;
};

// Helper function to validate date
const validateDate = (dateString, fieldName = 'Date') => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid ' + fieldName + ' format';
  }
  return null;
};

// Helper function to validate date range
const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start >= end) {
    return 'Start date must be before end date';
  }
  return null;
};

class VideoConferencingController {
  async createConference(req, res) {
    try {
      logger.info('Creating video conference');
      
      const { title, description, scheduledStartTime, duration, platform, participants, recordingEnabled } = req.body;
      const hostId = req.user?.id;
      const institution = req.user?.institution;
      
      // Validation
      const errors = [];
      
      const hostIdError = validateObjectId(hostId, 'Host ID');
      if (hostIdError) errors.push(hostIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (!title || title.trim().length === 0) {
        errors.push('Conference title is required');
      } else if (title.length > MAX_TITLE_LENGTH) {
        errors.push('Title must not exceed ' + MAX_TITLE_LENGTH + ' characters');
      }
      
      if (description && description.length > MAX_DESCRIPTION_LENGTH) {
        errors.push('Description must not exceed ' + MAX_DESCRIPTION_LENGTH + ' characters');
      }
      
      if (scheduledStartTime) {
        const dateError = validateDate(scheduledStartTime, 'Scheduled start time');
        if (dateError) errors.push(dateError);
        else {
          const startTime = new Date(scheduledStartTime);
          if (startTime < new Date()) {
            errors.push('Scheduled start time must be in the future');
          }
        }
      }
      
      if (duration) {
        const durationNum = parseInt(duration);
        if (isNaN(durationNum) || durationNum < MIN_DURATION_MINUTES || durationNum > MAX_DURATION_MINUTES) {
          errors.push('Duration must be between ' + MIN_DURATION_MINUTES + ' and ' + MAX_DURATION_MINUTES + ' minutes');
        }
      }
      
      if (platform && !VALID_PLATFORMS.includes(platform)) {
        errors.push('Invalid platform. Must be one of: ' + VALID_PLATFORMS.join(', '));
      }
      
      if (participants && Array.isArray(participants)) {
        if (participants.length > MAX_PARTICIPANTS) {
          errors.push('Maximum ' + MAX_PARTICIPANTS + ' participants allowed');
        }
        participants.forEach((participantId, index) => {
          const participantError = validateObjectId(participantId, 'Participant ID at index ' + index);
          if (participantError) {
            errors.push(participantError);
          }
        });
      }
      
      if (recordingEnabled !== undefined && typeof recordingEnabled !== 'boolean') {
        errors.push('Recording enabled must be a boolean');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const conference = await videoConferencingService.createConference(
        { ...req.body, host: hostId },
        institution
      );
      
      logger.info('Video conference created successfully:', { conferenceId: conference._id });
      return createdResponse(res, conference, 'Video conference created successfully');
    } catch (error) {
      logger.error('Error creating video conference:', error);
      return errorResponse(res, error.message);
    }
  }

  async getConferences(req, res) {
    try {
      logger.info('Fetching video conferences');
      
      const institution = req.user?.institution;
      const { status, platform, startDate, endDate, page, limit, sortBy, sortOrder } = req.query;
      
      // Validation
      const errors = [];
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (status && !VALID_STATUSES.includes(status)) {
        errors.push('Invalid status. Must be one of: ' + VALID_STATUSES.join(', '));
      }
      
      if (platform && !VALID_PLATFORMS.includes(platform)) {
        errors.push('Invalid platform. Must be one of: ' + VALID_PLATFORMS.join(', '));
      }
      
      if (startDate) {
        const startDateError = validateDate(startDate, 'Start date');
        if (startDateError) errors.push(startDateError);
      }
      
      if (endDate) {
        const endDateError = validateDate(endDate, 'End date');
        if (endDateError) errors.push(endDateError);
      }
      
      if (startDate && endDate) {
        const dateRangeError = validateDateRange(startDate, endDate);
        if (dateRangeError) errors.push(dateRangeError);
      }
      
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 20;
      
      if (pageNum < 1) {
        errors.push('Page must be greater than 0');
      }
      
      if (limitNum < 1 || limitNum > 100) {
        errors.push('Limit must be between 1 and 100');
      }
      
      const validSortOrders = ['asc', 'desc'];
      if (sortOrder && !validSortOrders.includes(sortOrder)) {
        errors.push('Invalid sort order. Must be one of: ' + validSortOrders.join(', '));
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const filters = {
        status,
        platform,
        startDate,
        endDate,
        page: pageNum,
        limit: limitNum,
        sortBy: sortBy || 'scheduledStartTime',
        sortOrder: sortOrder || 'desc'
      };
      
      const result = await videoConferencingService.getConferences(institution, filters);
      
      logger.info('Video conferences fetched successfully:', { count: result.conferences?.length || 0 });
      return successResponse(res, result, 'Video conferences retrieved successfully');
    } catch (error) {
      logger.error('Error fetching video conferences:', error);
      return errorResponse(res, error.message);
    }
  }

  async getConferenceById(req, res) {
    try {
      logger.info('Fetching video conference by ID');
      
      const { conferenceId } = req.params;
      const institution = req.user?.institution;
      
      // Validation
      const errors = [];
      
      const conferenceIdError = validateObjectId(conferenceId, 'Conference ID');
      if (conferenceIdError) errors.push(conferenceIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const conference = await videoConferencingService.getConferenceById(conferenceId, institution);
      
      if (!conference) {
        return notFoundResponse(res, 'Video conference not found');
      }
      
      logger.info('Video conference fetched successfully:', { conferenceId });
      return successResponse(res, conference, 'Video conference retrieved successfully');
    } catch (error) {
      logger.error('Error fetching video conference:', error);
      return errorResponse(res, error.message);
    }
  }

  async startConference(req, res) {
    try {
      logger.info('Starting video conference');
      
      const { conferenceId } = req.params;
      const institution = req.user?.institution;
      const userId = req.user?.id;
      
      // Validation
      const errors = [];
      
      const conferenceIdError = validateObjectId(conferenceId, 'Conference ID');
      if (conferenceIdError) errors.push(conferenceIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const conference = await videoConferencingService.startConference(conferenceId, institution, userId);
      
      if (!conference) {
        return notFoundResponse(res, 'Video conference not found');
      }
      
      logger.info('Conference started successfully:', { conferenceId });
      return successResponse(res, conference, 'Conference started successfully');
    } catch (error) {
      logger.error('Error starting conference:', error);
      return errorResponse(res, error.message);
    }
  }

  async endConference(req, res) {
    try {
      logger.info('Ending video conference');
      
      const { conferenceId } = req.params;
      const institution = req.user?.institution;
      const userId = req.user?.id;
      
      // Validation
      const errors = [];
      
      const conferenceIdError = validateObjectId(conferenceId, 'Conference ID');
      if (conferenceIdError) errors.push(conferenceIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const conference = await videoConferencingService.endConference(conferenceId, institution, userId);
      
      if (!conference) {
        return notFoundResponse(res, 'Video conference not found');
      }
      
      logger.info('Conference ended successfully:', { conferenceId });
      return successResponse(res, conference, 'Conference ended successfully');
    } catch (error) {
      logger.error('Error ending conference:', error);
      return errorResponse(res, error.message);
    }
  }

  async joinConference(req, res) {
    try {
      logger.info('Joining video conference');
      
      const { conferenceId } = req.params;
      const userId = req.user?.id;
      const institution = req.user?.institution;
      
      // Validation
      const errors = [];
      
      const conferenceIdError = validateObjectId(conferenceId, 'Conference ID');
      if (conferenceIdError) errors.push(conferenceIdError);
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const conference = await videoConferencingService.joinConference(conferenceId, userId, institution);
      
      if (!conference) {
        return notFoundResponse(res, 'Video conference not found');
      }
      
      logger.info('Joined conference successfully:', { conferenceId, userId });
      return successResponse(res, conference, 'Joined conference successfully');
    } catch (error) {
      logger.error('Error joining conference:', error);
      return errorResponse(res, error.message);
    }
  }

  async leaveConference(req, res) {
    try {
      logger.info('Leaving video conference');
      
      const { conferenceId } = req.params;
      const userId = req.user?.id;
      const institution = req.user?.institution;
      
      // Validation
      const errors = [];
      
      const conferenceIdError = validateObjectId(conferenceId, 'Conference ID');
      if (conferenceIdError) errors.push(conferenceIdError);
      
      const userIdError = validateObjectId(userId, 'User ID');
      if (userIdError) errors.push(userIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const conference = await videoConferencingService.leaveConference(conferenceId, userId, institution);
      
      if (!conference) {
        return notFoundResponse(res, 'Video conference not found');
      }
      
      logger.info('Left conference successfully:', { conferenceId, userId });
      return successResponse(res, conference, 'Left conference successfully');
    } catch (error) {
      logger.error('Error leaving conference:', error);
      return errorResponse(res, error.message);
    }
  }

  async cancelConference(req, res) {
    try {
      logger.info('Cancelling video conference');
      
      const { conferenceId } = req.params;
      const institution = req.user?.institution;
      const userId = req.user?.id;
      const { reason } = req.body;
      
      // Validation
      const errors = [];
      
      const conferenceIdError = validateObjectId(conferenceId, 'Conference ID');
      if (conferenceIdError) errors.push(conferenceIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (reason && reason.length > MAX_DESCRIPTION_LENGTH) {
        errors.push('Reason must not exceed ' + MAX_DESCRIPTION_LENGTH + ' characters');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const conference = await videoConferencingService.cancelConference(conferenceId, institution, userId, reason);
      
      if (!conference) {
        return notFoundResponse(res, 'Video conference not found');
      }
      
      logger.info('Conference cancelled successfully:', { conferenceId });
      return successResponse(res, conference, 'Conference cancelled successfully');
    } catch (error) {
      logger.error('Error cancelling conference:', error);
      return errorResponse(res, error.message);
    }
  }

  async getStatistics(req, res) {
    try {
      logger.info('Fetching conference statistics');
      
      const institution = req.user?.institution;
      const { startDate, endDate } = req.query;
      
      // Validation
      const errors = [];
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (startDate) {
        const startDateError = validateDate(startDate, 'Start date');
        if (startDateError) errors.push(startDateError);
      }
      
      if (endDate) {
        const endDateError = validateDate(endDate, 'End date');
        if (endDateError) errors.push(endDateError);
      }
      
      if (startDate && endDate) {
        const dateRangeError = validateDateRange(startDate, endDate);
        if (dateRangeError) errors.push(dateRangeError);
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const stats = await videoConferencingService.getConferenceStatistics(institution, { startDate, endDate });
      
      logger.info('Conference statistics fetched successfully');
      return successResponse(res, stats, 'Conference statistics retrieved successfully');
    } catch (error) {
      logger.error('Error fetching conference statistics:', error);
      return errorResponse(res, error.message);
    }
  }

  async updateConference(req, res) {
    try {
      logger.info('Updating video conference');
      
      const { conferenceId } = req.params;
      const { title, description, scheduledStartTime, duration, platform, recordingEnabled } = req.body;
      const institution = req.user?.institution;
      const userId = req.user?.id;
      
      // Validation
      const errors = [];
      
      const conferenceIdError = validateObjectId(conferenceId, 'Conference ID');
      if (conferenceIdError) errors.push(conferenceIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (title !== undefined) {
        if (!title || title.trim().length === 0) {
          errors.push('Conference title cannot be empty');
        } else if (title.length > MAX_TITLE_LENGTH) {
          errors.push('Title must not exceed ' + MAX_TITLE_LENGTH + ' characters');
        }
      }
      
      if (description && description.length > MAX_DESCRIPTION_LENGTH) {
        errors.push('Description must not exceed ' + MAX_DESCRIPTION_LENGTH + ' characters');
      }
      
      if (scheduledStartTime) {
        const dateError = validateDate(scheduledStartTime, 'Scheduled start time');
        if (dateError) errors.push(dateError);
        else {
          const startTime = new Date(scheduledStartTime);
          if (startTime < new Date()) {
            errors.push('Scheduled start time must be in the future');
          }
        }
      }
      
      if (duration) {
        const durationNum = parseInt(duration);
        if (isNaN(durationNum) || durationNum < MIN_DURATION_MINUTES || durationNum > MAX_DURATION_MINUTES) {
          errors.push('Duration must be between ' + MIN_DURATION_MINUTES + ' and ' + MAX_DURATION_MINUTES + ' minutes');
        }
      }
      
      if (platform && !VALID_PLATFORMS.includes(platform)) {
        errors.push('Invalid platform. Must be one of: ' + VALID_PLATFORMS.join(', '));
      }
      
      if (recordingEnabled !== undefined && typeof recordingEnabled !== 'boolean') {
        errors.push('Recording enabled must be a boolean');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const conference = await videoConferencingService.updateConference(conferenceId, institution, userId, req.body);
      
      if (!conference) {
        return notFoundResponse(res, 'Video conference not found');
      }
      
      logger.info('Conference updated successfully:', { conferenceId });
      return successResponse(res, conference, 'Conference updated successfully');
    } catch (error) {
      logger.error('Error updating conference:', error);
      return errorResponse(res, error.message);
    }
  }

  async deleteConference(req, res) {
    try {
      logger.info('Deleting video conference');
      
      const { conferenceId } = req.params;
      const institution = req.user?.institution;
      const userId = req.user?.id;
      
      // Validation
      const errors = [];
      
      const conferenceIdError = validateObjectId(conferenceId, 'Conference ID');
      if (conferenceIdError) errors.push(conferenceIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const result = await videoConferencingService.deleteConference(conferenceId, institution, userId);
      
      if (!result) {
        return notFoundResponse(res, 'Video conference not found');
      }
      
      logger.info('Conference deleted successfully:', { conferenceId });
      return successResponse(res, null, 'Conference deleted successfully');
    } catch (error) {
      logger.error('Error deleting conference:', error);
      return errorResponse(res, error.message);
    }
  }

  async addParticipants(req, res) {
    try {
      logger.info('Adding participants to conference');
      
      const { conferenceId } = req.params;
      const { participantIds } = req.body;
      const institution = req.user?.institution;
      
      // Validation
      const errors = [];
      
      const conferenceIdError = validateObjectId(conferenceId, 'Conference ID');
      if (conferenceIdError) errors.push(conferenceIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
        errors.push('Participant IDs array is required and must not be empty');
      } else {
        if (participantIds.length > MAX_PARTICIPANTS) {
          errors.push('Maximum ' + MAX_PARTICIPANTS + ' participants allowed');
        }
        participantIds.forEach((participantId, index) => {
          const participantError = validateObjectId(participantId, 'Participant ID at index ' + index);
          if (participantError) {
            errors.push(participantError);
          }
        });
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const conference = await videoConferencingService.addParticipants(conferenceId, institution, participantIds);
      
      if (!conference) {
        return notFoundResponse(res, 'Video conference not found');
      }
      
      logger.info('Participants added successfully:', { conferenceId, count: participantIds.length });
      return successResponse(res, conference, 'Participants added successfully');
    } catch (error) {
      logger.error('Error adding participants:', error);
      return errorResponse(res, error.message);
    }
  }

  async removeParticipants(req, res) {
    try {
      logger.info('Removing participants from conference');
      
      const { conferenceId } = req.params;
      const { participantIds } = req.body;
      const institution = req.user?.institution;
      
      // Validation
      const errors = [];
      
      const conferenceIdError = validateObjectId(conferenceId, 'Conference ID');
      if (conferenceIdError) errors.push(conferenceIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
        errors.push('Participant IDs array is required and must not be empty');
      } else {
        participantIds.forEach((participantId, index) => {
          const participantError = validateObjectId(participantId, 'Participant ID at index ' + index);
          if (participantError) {
            errors.push(participantError);
          }
        });
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const conference = await videoConferencingService.removeParticipants(conferenceId, institution, participantIds);
      
      if (!conference) {
        return notFoundResponse(res, 'Video conference not found');
      }
      
      logger.info('Participants removed successfully:', { conferenceId, count: participantIds.length });
      return successResponse(res, conference, 'Participants removed successfully');
    } catch (error) {
      logger.error('Error removing participants:', error);
      return errorResponse(res, error.message);
    }
  }

  async getParticipants(req, res) {
    try {
      logger.info('Fetching conference participants');
      
      const { conferenceId } = req.params;
      const institution = req.user?.institution;
      const { page, limit } = req.query;
      
      // Validation
      const errors = [];
      
      const conferenceIdError = validateObjectId(conferenceId, 'Conference ID');
      if (conferenceIdError) errors.push(conferenceIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 20;
      
      if (pageNum < 1) {
        errors.push('Page must be greater than 0');
      }
      
      if (limitNum < 1 || limitNum > 100) {
        errors.push('Limit must be between 1 and 100');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const result = await videoConferencingService.getParticipants(conferenceId, institution, {
        page: pageNum,
        limit: limitNum
      });
      
      if (!result) {
        return notFoundResponse(res, 'Video conference not found');
      }
      
      logger.info('Conference participants fetched successfully:', { conferenceId });
      return successResponse(res, result, 'Participants retrieved successfully');
    } catch (error) {
      logger.error('Error fetching participants:', error);
      return errorResponse(res, error.message);
    }
  }

  async getRecordings(req, res) {
    try {
      logger.info('Fetching conference recordings');
      
      const { conferenceId } = req.params;
      const institution = req.user?.institution;
      
      // Validation
      const errors = [];
      
      const conferenceIdError = validateObjectId(conferenceId, 'Conference ID');
      if (conferenceIdError) errors.push(conferenceIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const recordings = await videoConferencingService.getRecordings(conferenceId, institution);
      
      if (!recordings) {
        return notFoundResponse(res, 'Video conference not found');
      }
      
      logger.info('Conference recordings fetched successfully:', { conferenceId });
      return successResponse(res, recordings, 'Recordings retrieved successfully');
    } catch (error) {
      logger.error('Error fetching recordings:', error);
      return errorResponse(res, error.message);
    }
  }

  async updateRecordingSettings(req, res) {
    try {
      logger.info('Updating recording settings');
      
      const { conferenceId } = req.params;
      const { recordingEnabled, autoRecording } = req.body;
      const institution = req.user?.institution;
      
      // Validation
      const errors = [];
      
      const conferenceIdError = validateObjectId(conferenceId, 'Conference ID');
      if (conferenceIdError) errors.push(conferenceIdError);
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (recordingEnabled !== undefined && typeof recordingEnabled !== 'boolean') {
        errors.push('Recording enabled must be a boolean');
      }
      
      if (autoRecording !== undefined && typeof autoRecording !== 'boolean') {
        errors.push('Auto recording must be a boolean');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const conference = await videoConferencingService.updateRecordingSettings(conferenceId, institution, req.body);
      
      if (!conference) {
        return notFoundResponse(res, 'Video conference not found');
      }
      
      logger.info('Recording settings updated successfully:', { conferenceId });
      return successResponse(res, conference, 'Recording settings updated successfully');
    } catch (error) {
      logger.error('Error updating recording settings:', error);
      return errorResponse(res, error.message);
    }
  }

  async getUpcomingConferences(req, res) {
    try {
      logger.info('Fetching upcoming conferences');
      
      const institution = req.user?.institution;
      const { page, limit } = req.query;
      
      // Validation
      const errors = [];
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 20;
      
      if (pageNum < 1) {
        errors.push('Page must be greater than 0');
      }
      
      if (limitNum < 1 || limitNum > 100) {
        errors.push('Limit must be between 1 and 100');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const result = await videoConferencingService.getUpcomingConferences(institution, {
        page: pageNum,
        limit: limitNum
      });
      
      logger.info('Upcoming conferences fetched successfully');
      return successResponse(res, result, 'Upcoming conferences retrieved successfully');
    } catch (error) {
      logger.error('Error fetching upcoming conferences:', error);
      return errorResponse(res, error.message);
    }
  }

  async getPastConferences(req, res) {
    try {
      logger.info('Fetching past conferences');
      
      const institution = req.user?.institution;
      const { page, limit } = req.query;
      
      // Validation
      const errors = [];
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 20;
      
      if (pageNum < 1) {
        errors.push('Page must be greater than 0');
      }
      
      if (limitNum < 1 || limitNum > 100) {
        errors.push('Limit must be between 1 and 100');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const result = await videoConferencingService.getPastConferences(institution, {
        page: pageNum,
        limit: limitNum
      });
      
      logger.info('Past conferences fetched successfully');
      return successResponse(res, result, 'Past conferences retrieved successfully');
    } catch (error) {
      logger.error('Error fetching past conferences:', error);
      return errorResponse(res, error.message);
    }
  }

  async searchConferences(req, res) {
    try {
      logger.info('Searching conferences');
      
      const institution = req.user?.institution;
      const { q, page, limit } = req.query;
      
      // Validation
      const errors = [];
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (!q || q.trim().length === 0) {
        errors.push('Search query is required');
      } else if (q.length > 200) {
        errors.push('Search query must not exceed 200 characters');
      }
      
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 20;
      
      if (pageNum < 1) {
        errors.push('Page must be greater than 0');
      }
      
      if (limitNum < 1 || limitNum > 100) {
        errors.push('Limit must be between 1 and 100');
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const result = await videoConferencingService.searchConferences(institution, q, {
        page: pageNum,
        limit: limitNum
      });
      
      logger.info('Conferences searched successfully:', { query: q });
      return successResponse(res, result, 'Search results retrieved successfully');
    } catch (error) {
      logger.error('Error searching conferences:', error);
      return errorResponse(res, error.message);
    }
  }

  async exportConferences(req, res) {
    try {
      logger.info('Exporting conferences');
      
      const institution = req.user?.institution;
      const { format, status, platform, startDate, endDate } = req.query;
      
      // Validation
      const errors = [];
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      const validFormats = ['json', 'csv', 'xlsx', 'pdf'];
      if (!format || format.trim().length === 0) {
        errors.push('Export format is required');
      } else if (!validFormats.includes(format.toLowerCase())) {
        errors.push('Invalid export format. Must be one of: ' + validFormats.join(', '));
      }
      
      if (status && !VALID_STATUSES.includes(status)) {
        errors.push('Invalid status. Must be one of: ' + VALID_STATUSES.join(', '));
      }
      
      if (platform && !VALID_PLATFORMS.includes(platform)) {
        errors.push('Invalid platform. Must be one of: ' + VALID_PLATFORMS.join(', '));
      }
      
      if (startDate) {
        const startDateError = validateDate(startDate, 'Start date');
        if (startDateError) errors.push(startDateError);
      }
      
      if (endDate) {
        const endDateError = validateDate(endDate, 'End date');
        if (endDateError) errors.push(endDateError);
      }
      
      if (startDate && endDate) {
        const dateRangeError = validateDateRange(startDate, endDate);
        if (dateRangeError) errors.push(dateRangeError);
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const data = await videoConferencingService.exportConferences(institution, {
        format: format.toLowerCase(),
        status,
        platform,
        startDate,
        endDate
      });
      
      logger.info('Conferences exported successfully:', { format });
      return successResponse(res, data, 'Conferences exported successfully');
    } catch (error) {
      logger.error('Error exporting conferences:', error);
      return errorResponse(res, error.message);
    }
  }

  async getAnalytics(req, res) {
    try {
      logger.info('Fetching conference analytics');
      
      const institution = req.user?.institution;
      const { groupBy, startDate, endDate } = req.query;
      
      // Validation
      const errors = [];
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      const validGroupBy = ['platform', 'status', 'host', 'day', 'week', 'month'];
      const groupByValue = groupBy || 'status';
      
      if (!validGroupBy.includes(groupByValue)) {
        errors.push('Invalid groupBy. Must be one of: ' + validGroupBy.join(', '));
      }
      
      if (startDate) {
        const startDateError = validateDate(startDate, 'Start date');
        if (startDateError) errors.push(startDateError);
      }
      
      if (endDate) {
        const endDateError = validateDate(endDate, 'End date');
        if (endDateError) errors.push(endDateError);
      }
      
      if (startDate && endDate) {
        const dateRangeError = validateDateRange(startDate, endDate);
        if (dateRangeError) errors.push(dateRangeError);
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const analytics = await videoConferencingService.getAnalytics(institution, {
        groupBy: groupByValue,
        startDate,
        endDate
      });
      
      logger.info('Conference analytics fetched successfully');
      return successResponse(res, analytics, 'Analytics retrieved successfully');
    } catch (error) {
      logger.error('Error fetching analytics:', error);
      return errorResponse(res, error.message);
    }
  }

  async bulkDeleteConferences(req, res) {
    try {
      logger.info('Bulk deleting conferences');
      
      const institution = req.user?.institution;
      const { conferenceIds } = req.body;
      const userId = req.user?.id;
      
      // Validation
      const errors = [];
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (!conferenceIds || !Array.isArray(conferenceIds) || conferenceIds.length === 0) {
        errors.push('Conference IDs array is required and must not be empty');
      } else {
        conferenceIds.forEach((conferenceId, index) => {
          const idError = validateObjectId(conferenceId, 'Conference ID at index ' + index);
          if (idError) {
            errors.push(idError);
          }
        });
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const result = await videoConferencingService.bulkDeleteConferences(conferenceIds, institution, userId);
      
      logger.info('Conferences bulk deleted successfully:', { count: result.deletedCount || 0 });
      return successResponse(res, result, result.deletedCount + ' conference(s) deleted successfully');
    } catch (error) {
      logger.error('Error bulk deleting conferences:', error);
      return errorResponse(res, error.message);
    }
  }

  async bulkUpdateConferences(req, res) {
    try {
      logger.info('Bulk updating conferences');
      
      const institution = req.user?.institution;
      const { conferenceIds, updates } = req.body;
      
      // Validation
      const errors = [];
      
      if (!institution) {
        errors.push('Institution information is required');
      }
      
      if (!conferenceIds || !Array.isArray(conferenceIds) || conferenceIds.length === 0) {
        errors.push('Conference IDs array is required and must not be empty');
      } else {
        conferenceIds.forEach((conferenceId, index) => {
          const idError = validateObjectId(conferenceId, 'Conference ID at index ' + index);
          if (idError) {
            errors.push(idError);
          }
        });
      }
      
      if (!updates || typeof updates !== 'object') {
        errors.push('Updates object is required');
      } else {
        if (updates.status && !VALID_STATUSES.includes(updates.status)) {
          errors.push('Invalid status. Must be one of: ' + VALID_STATUSES.join(', '));
        }
        
        if (updates.platform && !VALID_PLATFORMS.includes(updates.platform)) {
          errors.push('Invalid platform. Must be one of: ' + VALID_PLATFORMS.join(', '));
        }
        
        if (updates.duration) {
          const durationNum = parseInt(updates.duration);
          if (isNaN(durationNum) || durationNum < MIN_DURATION_MINUTES || durationNum > MAX_DURATION_MINUTES) {
            errors.push('Duration must be between ' + MIN_DURATION_MINUTES + ' and ' + MAX_DURATION_MINUTES + ' minutes');
          }
        }
      }
      
      if (errors.length > 0) {
        return validationErrorResponse(res, errors);
      }
      
      const result = await videoConferencingService.bulkUpdateConferences(conferenceIds, institution, updates);
      
      logger.info('Conferences bulk updated successfully:', { count: result.modifiedCount || 0 });
      return successResponse(res, result, result.modifiedCount + ' conference(s) updated successfully');
    } catch (error) {
      logger.error('Error bulk updating conferences:', error);
      return errorResponse(res, error.message);
    }
  }
}

export default new VideoConferencingController();
