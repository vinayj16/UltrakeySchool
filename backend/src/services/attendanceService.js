import Attendance from '../models/Attendance.js';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, subWeeks } from '../utils/dateHelpers.js';

class AttendanceService {
  async getAttendanceStats(schoolId, dateRange = 'today') {
    const { startDate, endDate } = this.getDateRange(dateRange);

    const [students, teachers, staff] = await Promise.all([
      this.getStatsForType(schoolId, 'student', startDate, endDate),
      this.getStatsForType(schoolId, 'teacher', startDate, endDate),
      this.getStatsForType(schoolId, 'staff', startDate, endDate)
    ]);

    return { students, teachers, staff };
  }

  async getStatsForType(schoolId, userType, startDate, endDate) {
    const stats = await Attendance.aggregate([
      {
        $match: {
          schoolId: schoolId,
          userType: userType,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      present: 0,
      absent: 0,
      late: 0,
      emergency: 0,
      total: 0
    };

    stats.forEach(stat => {
      result[stat._id] = stat.count;
      result.total += stat.count;
    });

    // Get emergency count (present status)
    result.emergency = result.present;

    return result;
  }

  getDateRange(range) {
    const now = new Date();
    
    switch (range) {
      case 'today':
        return {
          startDate: startOfDay(now),
          endDate: endOfDay(now)
        };
      case 'this-week':
        return {
          startDate: startOfWeek(now),
          endDate: endOfWeek(now)
        };
      case 'last-week':
        const lastWeek = subWeeks(now, 1);
        return {
          startDate: startOfWeek(lastWeek),
          endDate: endOfWeek(lastWeek)
        };
      default:
        return {
          startDate: startOfDay(now),
          endDate: endOfDay(now)
        };
    }
  }

  async markAttendance(schoolId, userId, userType, status, markedBy, remarks = '') {
    const today = startOfDay(new Date());

    const attendance = await Attendance.findOneAndUpdate(
      {
        schoolId,
        userId,
        userType,
        date: today
      },
      {
        status,
        markedBy,
        remarks,
        checkInTime: status === 'present' || status === 'late' ? new Date() : null
      },
      {
        upsert: true,
        new: true
      }
    );

    return attendance;
  }

  async getAttendanceHistory(schoolId, userId, userType, startDate, endDate) {
    const attendance = await Attendance.find({
      schoolId,
      userId,
      userType,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    return attendance;
  }

  async getBulkAttendance(schoolId, userType, date) {
    const startDate = startOfDay(date);
    const endDate = endOfDay(date);

    const attendance = await Attendance.find({
      schoolId,
      userType,
      date: { $gte: startDate, $lte: endDate }
    }).populate('userId', 'name email');

    return attendance;
  }
}

export default new AttendanceService();
/**
 * Get attendance with summary statistics
 */
async function getAttendanceWithSummary(schoolId, classId, sectionId, date) {
  const startDate = startOfDay(date);
  const endDate = endOfDay(date);

  let query = {
    schoolId,
    date: { $gte: startDate, $lte: endDate }
  };

  if (classId) {
    query.classId = classId;
  }
  if (sectionId) {
    query.sectionId = sectionId;
  }

  const attendance = await Attendance.find(query)
    .populate('userId', 'name email')
    .sort({ date: -1 });

  // Calculate summary
  const totalStudents = attendance.length;
  const present = attendance.filter(a => a.status === 'present').length;
  const absent = attendance.filter(a => a.status === 'absent').length;
  const late = attendance.filter(a => a.status === 'late').length;
  const percentage = totalStudents > 0 ? ((present / totalStudents) * 100).toFixed(2) : 0;

  return {
    attendance,
    summary: {
      total_students: totalStudents,
      present,
      absent,
      late,
      percentage: parseFloat(percentage)
    }
  };
}

// Add method to AttendanceService class
AttendanceService.prototype.getAttendanceWithSummary = getAttendanceWithSummary;
