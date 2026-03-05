import ClassSchedule from '../models/ClassSchedule.js';
import mongoose from 'mongoose';

class ClassScheduleService {
  async createSchedule(scheduleData) {
    const conflictingSchedule = await ClassSchedule.findOne({
      day: scheduleData.day,
      startTime: scheduleData.startTime,
      $or: [
        { teacherId: scheduleData.teacherId },
        { room: scheduleData.room, classId: scheduleData.classId }
      ],
      academicYear: scheduleData.academicYear,
      institutionId: scheduleData.institutionId,
      status: { $ne: 'cancelled' },
      isDeleted: false
    });

    if (conflictingSchedule) {
      throw new Error('Schedule conflict: Teacher or room is already booked for this time slot');
    }

    const schedule = new ClassSchedule(scheduleData);
    return await schedule.save();
  }

  async getScheduleById(scheduleId) {
    return await ClassSchedule.findById(scheduleId)
      .populate('classId', 'name section students')
      .populate('teacherId', 'name email')
      .populate('subjectId', 'name code')
      .populate('institutionId', 'name');
  }

  async getScheduleByScheduleId(scheduleId) {
    return await ClassSchedule.findOne({ scheduleId, isDeleted: false })
      .populate('classId', 'name section students')
      .populate('teacherId', 'name email')
      .populate('subjectId', 'name code');
  }

  async getAllSchedules(filters = {}, options = {}) {
    const {
      className,
      section,
      day,
      status,
      teacherId,
      classId,
      academicYear,
      institutionId,
      search
    } = filters;

    const {
      page = 1,
      limit = 20,
      sortBy = 'day',
      sortOrder = 'asc'
    } = options;

    const query = { isDeleted: false };

    if (className) query.className = className;
    if (section) query.section = section;
    if (day) query.day = day;
    if (status) query.status = status;
    if (teacherId) query.teacherId = teacherId;
    if (classId) query.classId = classId;
    if (academicYear) query.academicYear = academicYear;
    if (institutionId) query.institutionId = institutionId;

    if (search) {
      query.$or = [
        { scheduleId: { $regex: search, $options: 'i' } },
        { className: { $regex: search, $options: 'i' } },
        { section: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { teacher: { $regex: search, $options: 'i' } },
        { room: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [schedules, total] = await Promise.all([
      ClassSchedule.find(query)
        .populate('classId', 'name section students')
        .populate('teacherId', 'name email')
        .populate('subjectId', 'name code')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      ClassSchedule.countDocuments(query)
    ]);

    return {
      schedules,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateSchedule(scheduleId, updateData) {
    const schedule = await ClassSchedule.findById(scheduleId);
    if (!schedule) {
      throw new Error('Schedule not found');
    }

    if (updateData.day || updateData.startTime || updateData.teacherId || updateData.room) {
      const conflictingSchedule = await ClassSchedule.findOne({
        _id: { $ne: scheduleId },
        day: updateData.day || schedule.day,
        startTime: updateData.startTime || schedule.startTime,
        $or: [
          { teacherId: updateData.teacherId || schedule.teacherId },
          { room: updateData.room || schedule.room, classId: schedule.classId }
        ],
        academicYear: schedule.academicYear,
        institutionId: schedule.institutionId,
        status: { $ne: 'cancelled' },
        isDeleted: false
      });

      if (conflictingSchedule) {
        throw new Error('Schedule conflict: Teacher or room is already booked for this time slot');
      }
    }

    Object.assign(schedule, updateData);
    return await schedule.save();
  }

  async deleteSchedule(scheduleId) {
    const schedule = await ClassSchedule.findById(scheduleId);
    if (!schedule) {
      throw new Error('Schedule not found');
    }

    schedule.isDeleted = true;
    return await schedule.save();
  }

  async getSchedulesByClass(classId, day) {
    const query = { classId, isDeleted: false, status: 'active' };
    if (day) query.day = day;

    return await ClassSchedule.find(query)
      .populate('teacherId', 'name email')
      .populate('subjectId', 'name code')
      .sort({ day: 1, startTime: 1 });
  }

  async getSchedulesByTeacher(teacherId, day) {
    const query = { teacherId, isDeleted: false, status: 'active' };
    if (day) query.day = day;

    return await ClassSchedule.find(query)
      .populate('classId', 'name section')
      .populate('subjectId', 'name code')
      .sort({ day: 1, startTime: 1 });
  }

  async getSchedulesByDay(day, institutionId) {
    const query = { day, isDeleted: false, status: 'active' };
    if (institutionId) query.institutionId = institutionId;

    return await ClassSchedule.find(query)
      .populate('classId', 'name section')
      .populate('teacherId', 'name email')
      .populate('subjectId', 'name code')
      .sort({ startTime: 1 });
  }

  async getSchedulesByRoom(room, day) {
    const query = { room, isDeleted: false, status: 'active' };
    if (day) query.day = day;

    return await ClassSchedule.find(query)
      .populate('classId', 'name section')
      .populate('teacherId', 'name email')
      .populate('subjectId', 'name code')
      .sort({ day: 1, startTime: 1 });
  }

  async getWeeklySchedule(classId) {
    const schedules = await ClassSchedule.find({
      classId,
      isDeleted: false,
      status: 'active'
    })
      .populate('teacherId', 'name email')
      .populate('subjectId', 'name code')
      .sort({ day: 1, startTime: 1 });

    const weeklySchedule = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };

    schedules.forEach(schedule => {
      weeklySchedule[schedule.day].push(schedule);
    });

    return weeklySchedule;
  }

  async getTeacherWeeklySchedule(teacherId) {
    const schedules = await ClassSchedule.find({
      teacherId,
      isDeleted: false,
      status: 'active'
    })
      .populate('classId', 'name section')
      .populate('subjectId', 'name code')
      .sort({ day: 1, startTime: 1 });

    const weeklySchedule = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };

    schedules.forEach(schedule => {
      weeklySchedule[schedule.day].push(schedule);
    });

    return weeklySchedule;
  }

  async checkScheduleConflict(teacherId, day, startTime, endTime, excludeScheduleId) {
    const query = {
      teacherId,
      day,
      isDeleted: false,
      status: { $ne: 'cancelled' },
      $or: [
        { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
        { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
        { startTime: { $gte: startTime }, endTime: { $lte: endTime } }
      ]
    };

    if (excludeScheduleId) {
      query._id = { $ne: excludeScheduleId };
    }

    return await ClassSchedule.findOne(query);
  }

  async getScheduleStatistics(institutionId, academicYear) {
    const match = { isDeleted: false };
    if (institutionId) match.institutionId = mongoose.Types.ObjectId(institutionId);
    if (academicYear) match.academicYear = academicYear;

    const [
      totalSchedules,
      activeSchedules,
      schedulesByDay,
      schedulesBySubject,
      teacherWorkload
    ] = await Promise.all([
      ClassSchedule.countDocuments(match),
      ClassSchedule.countDocuments({ ...match, status: 'active' }),
      ClassSchedule.aggregate([
        { $match: match },
        { $group: { _id: '$day', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      ClassSchedule.aggregate([
        { $match: match },
        { $group: { _id: '$subject', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      ClassSchedule.aggregate([
        { $match: match },
        { $group: { _id: '$teacherId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    return {
      totalSchedules,
      activeSchedules,
      schedulesByDay,
      schedulesBySubject,
      teacherWorkload
    };
  }

  async bulkUpdateStatus(scheduleIds, status, userId) {
    return await ClassSchedule.updateMany(
      { _id: { $in: scheduleIds }, isDeleted: false },
      {
        $set: {
          status,
          'metadata.updatedBy': userId,
          updatedAt: new Date()
        }
      }
    );
  }

  async cancelSchedule(scheduleId, userId) {
    const schedule = await ClassSchedule.findById(scheduleId);
    if (!schedule) {
      throw new Error('Schedule not found');
    }

    schedule.status = 'cancelled';
    schedule.metadata.updatedBy = userId;
    return await schedule.save();
  }

  async searchSchedules(searchTerm, institutionId) {
    const query = {
      $or: [
        { scheduleId: { $regex: searchTerm, $options: 'i' } },
        { className: { $regex: searchTerm, $options: 'i' } },
        { section: { $regex: searchTerm, $options: 'i' } },
        { subject: { $regex: searchTerm, $options: 'i' } },
        { teacher: { $regex: searchTerm, $options: 'i' } },
        { room: { $regex: searchTerm, $options: 'i' } }
      ],
      isDeleted: false
    };

    if (institutionId) query.institutionId = institutionId;

    return await ClassSchedule.find(query)
      .populate('classId', 'name section')
      .populate('teacherId', 'name email')
      .populate('subjectId', 'name code')
      .sort({ day: 1, startTime: 1 })
      .limit(50);
  }
}

export default new ClassScheduleService();
