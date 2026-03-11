import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Attendance from '../models/Attendance.js';
import HomeWork from '../models/HomeWork.js';
import Fee from '../models/Fee.js';
import Notification from '../models/Notification.js';
import PTMSlot from '../models/PTMSlot.js';
import Event from '../models/Event.js';

class DashboardService {
  /**
   * Get Student Dashboard Data
   */
  async getStudentDashboard(userId, schoolId) {
    const student = await Student.findOne({ userId, schoolId })
      .populate('classId', 'name grade')
      .populate('sectionId', 'name');

    if (!student) {
      throw new Error('Student not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's schedule
    const todaySchedule = await this.getTodaySchedule(student.classId, student.sectionId);

    // Get attendance stats
    const attendanceStats = await this.getAttendanceStats(student._id, schoolId);

    // Get pending assignments
    const pendingAssignments = await HomeWork.find({
      schoolId,
      classId: student.classId,
      dueDate: { $gte: today },
      status: 'published'
    })
      .populate('subjectId', 'name')
      .sort({ dueDate: 1 })
      .limit(5);

    // Get fee status
    const feeStatus = await this.getFeeStatus(student._id, schoolId);

    // Get recent notifications
    const notifications = await Notification.find({
      schoolId,
      recipientId: userId,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get upcoming events
    const upcomingEvents = await Event.find({
      schoolId,
      date: { $gte: today },
      isActive: true
    })
      .sort({ date: 1 })
      .limit(5);

    // Get recent messages count
    const unreadMessages = await this.getUnreadMessagesCount(userId, schoolId);

    return {
      student: {
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        class: student.classId?.name,
        section: student.sectionId?.name,
        rollNumber: student.rollNumber,
        avatar: student.documents?.find(d => d.type === 'photo')?.url
      },
      quickStats: {
        attendance: attendanceStats.percentage,
        pendingAssignments: pendingAssignments.length,
        feeStatus: feeStatus.status,
        unreadMessages
      },
      todaySchedule,
      pendingAssignments: pendingAssignments.map(hw => ({
        id: hw._id,
        title: hw.title,
        subject: hw.subjectId?.name,
        dueDate: hw.dueDate,
        status: this.getHomeworkStatus(hw, student._id)
      })),
      feeStatus,
      notifications: notifications.map(n => ({
        id: n._id,
        title: n.title,
        message: n.message,
        timestamp: n.createdAt,
        isRead: n.isRead
      })),
      upcomingEvents: upcomingEvents.map(e => ({
        id: e._id,
        title: e.title,
        date: e.date,
        type: e.type
      }))
    };
  }

  /**
   * Get Teacher Dashboard Data
   */
  async getTeacherDashboard(userId, schoolId) {
    const teacher = await Teacher.findOne({ userId, schoolId })
      .populate('departmentId', 'name')
      .populate('classTeacherOf', 'name grade');

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's schedule
    const todaySchedule = await this.getTeacherSchedule(teacher._id, schoolId, today);

    // Get class statistics (if class teacher)
    let classStats = null;
    if (teacher.classTeacherOf) {
      classStats = await this.getClassStatistics(teacher.classTeacherOf, schoolId);
    }

    // Get pending tasks
    const pendingTasks = await this.getTeacherPendingTasks(teacher._id, schoolId);

    // Get recent messages
    const messages = await this.getRecentMessages(userId, schoolId, 3);

    // Get upcoming events
    const upcomingEvents = await Event.find({
      schoolId,
      date: { $gte: today },
      isActive: true
    })
      .sort({ date: 1 })
      .limit(5);

    // Get recent activities
    const recentActivities = await this.getTeacherRecentActivities(teacher._id, schoolId);

    return {
      teacher: {
        id: teacher._id,
        name: `${teacher.firstName} ${teacher.lastName}`,
        department: teacher.departmentId?.name,
        classTeacher: teacher.classTeacherOf?.name,
        avatar: teacher.profileImage
      },
      quickStats: {
        studentsInClass: classStats?.totalStudents || 0,
        presentToday: classStats?.presentToday || 0,
        pendingTasks: pendingTasks.length,
        unreadMessages: messages.unreadCount
      },
      todaySchedule,
      classStats,
      pendingTasks,
      messages: messages.messages,
      upcomingEvents: upcomingEvents.map(e => ({
        id: e._id,
        title: e.title,
        date: e.date,
        type: e.type
      })),
      recentActivities
    };
  }

  /**
   * Get Parent Dashboard Data
   */
  async getParentDashboard(userId, schoolId) {
    // Get all children
    const children = await Student.find({ parentId: userId, schoolId, isActive: true })
      .populate('classId', 'name grade')
      .populate('sectionId', 'name');

    if (!children || children.length === 0) {
      throw new Error('No children found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get progress for each child
    const childrenProgress = await Promise.all(
      children.map(async (child) => {
        const attendance = await this.getAttendanceStats(child._id, schoolId);
        const grades = await this.getAverageGrades(child._id, schoolId);
        const rank = await this.getStudentRank(child._id, child.classId, schoolId);

        return {
          id: child._id,
          name: `${child.firstName} ${child.lastName}`,
          class: child.classId?.name,
          section: child.sectionId?.name,
          avatar: child.documents?.find(d => d.type === 'photo')?.url,
          attendance: attendance.percentage,
          grades: grades.average,
          rank: rank.rank,
          totalStudents: rank.total
        };
      })
    );

    // Get combined fee status
    const feeStatus = await this.getCombinedFeeStatus(children.map(c => c._id), schoolId);

    // Get upcoming events
    const upcomingEvents = await Event.find({
      schoolId,
      date: { $gte: today },
      isActive: true
    })
      .sort({ date: 1 })
      .limit(5);

    // Get recent messages
    const messages = await this.getRecentMessages(userId, schoolId, 5);

    // Get notifications
    const notifications = await Notification.find({
      schoolId,
      recipientId: userId,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get upcoming PTM slots
    const ptmSlots = await PTMSlot.find({
      schoolId,
      bookedBy: userId,
      date: { $gte: today },
      status: 'booked'
    })
      .populate('teacherId', 'firstName lastName')
      .sort({ date: 1 })
      .limit(3);

    return {
      parent: {
        id: userId,
        childrenCount: children.length
      },
      children: childrenProgress,
      feeStatus,
      upcomingEvents: upcomingEvents.map(e => ({
        id: e._id,
        title: e.title,
        date: e.date,
        type: e.type
      })),
      messages: messages.messages,
      notifications: notifications.map(n => ({
        id: n._id,
        title: n.title,
        message: n.message,
        timestamp: n.createdAt,
        isRead: n.isRead
      })),
      ptmSlots: ptmSlots.map(slot => ({
        id: slot._id,
        teacher: `${slot.teacherId?.firstName} ${slot.teacherId?.lastName}`,
        date: slot.date,
        time: `${slot.startTime} - ${slot.endTime}`
      }))
    };
  }

  /**
   * Get Admin Dashboard Data
   */
  async getAdminDashboard(schoolId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get overall statistics
    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      activeStudents,
      presentToday,
      pendingFees,
      recentAdmissions
    ] = await Promise.all([
      Student.countDocuments({ schoolId, isActive: true }),
      Teacher.countDocuments({ schoolId, isActive: true }),
      this.getTotalClasses(schoolId),
      Student.countDocuments({ schoolId, status: 'active' }),
      Attendance.countDocuments({ schoolId, date: today, status: 'present' }),
      Fee.countDocuments({ schoolId, status: { $in: ['pending', 'overdue'] } }),
      this.getRecentAdmissions(schoolId, 7)
    ]);

    // Get attendance overview
    const attendanceOverview = await this.getAttendanceOverview(schoolId, today);

    // Get fee collection stats
    const feeStats = await this.getFeeCollectionStats(schoolId);

    // Get recent activities
    const recentActivities = await this.getSystemRecentActivities(schoolId);

    // Get upcoming events
    const upcomingEvents = await Event.find({
      schoolId,
      date: { $gte: today },
      isActive: true
    })
      .sort({ date: 1 })
      .limit(5);

    return {
      overview: {
        totalStudents,
        totalTeachers,
        totalClasses,
        activeStudents,
        attendanceToday: {
          present: presentToday,
          percentage: totalStudents > 0 ? ((presentToday / totalStudents) * 100).toFixed(2) : 0
        },
        pendingFees,
        recentAdmissions
      },
      attendanceOverview,
      feeStats,
      recentActivities,
      upcomingEvents: upcomingEvents.map(e => ({
        id: e._id,
        title: e.title,
        date: e.date,
        type: e.type
      }))
    };
  }

  // Helper methods
  async getTodaySchedule(classId, sectionId) {
    // Implementation for getting today's class schedule
    return [];
  }

  async getAttendanceStats(studentId, schoolId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const attendance = await Attendance.find({
      userId: studentId,
      schoolId,
      date: { $gte: thirtyDaysAgo }
    });

    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    return { total, present, percentage };
  }

  async getFeeStatus(studentId, schoolId) {
    const fees = await Fee.find({ studentId, schoolId });
    const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidAmount = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);
    const pendingAmount = totalAmount - paidAmount;

    return {
      status: pendingAmount === 0 ? 'Paid' : 'Pending',
      totalAmount,
      paidAmount,
      pendingAmount
    };
  }

  getHomeworkStatus(homework, studentId) {
    const submission = homework.submissions?.find(s => s.studentId.toString() === studentId.toString());
    if (!submission) return 'pending';
    return submission.status;
  }

  async getUnreadMessagesCount(userId, schoolId) {
    // Implementation for getting unread messages count
    return 0;
  }

  async getTeacherSchedule(teacherId, schoolId, date) {
    // Implementation for getting teacher's schedule
    return [];
  }

  async getClassStatistics(classId, schoolId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalStudents = await Student.countDocuments({ classId, schoolId, isActive: true });
    const presentToday = await Attendance.countDocuments({
      schoolId,
      date: today,
      status: 'present',
      userType: 'student'
    });

    return {
      totalStudents,
      presentToday,
      absentToday: totalStudents - presentToday,
      attendancePercentage: totalStudents > 0 ? ((presentToday / totalStudents) * 100).toFixed(2) : 0
    };
  }

  async getTeacherPendingTasks(teacherId, schoolId) {
    // Implementation for getting teacher's pending tasks
    return [];
  }

  async getRecentMessages(userId, schoolId, limit = 5) {
    // Implementation for getting recent messages
    return { messages: [], unreadCount: 0 };
  }

  async getTeacherRecentActivities(teacherId, schoolId) {
    // Implementation for getting teacher's recent activities
    return [];
  }

  async getAverageGrades(studentId, schoolId) {
    // Implementation for calculating average grades
    return { average: 0 };
  }

  async getStudentRank(studentId, classId, schoolId) {
    // Implementation for getting student rank
    return { rank: 0, total: 0 };
  }

  async getCombinedFeeStatus(studentIds, schoolId) {
    const fees = await Fee.find({ studentId: { $in: studentIds }, schoolId });
    const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidAmount = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);

    return {
      totalAmount,
      paidAmount,
      pendingAmount: totalAmount - paidAmount,
      status: totalAmount === paidAmount ? 'Paid' : 'Pending'
    };
  }

  async getTotalClasses(schoolId) {
    // Implementation for getting total classes
    return 0;
  }

  async getRecentAdmissions(schoolId, days) {
    // Implementation for getting recent admissions
    return 0;
  }

  async getAttendanceOverview(schoolId, date) {
    // Implementation for getting attendance overview
    return {};
  }

  async getFeeCollectionStats(schoolId) {
    // Implementation for getting fee collection stats
    return {};
  }

  /**
   * Get institute admin dashboard data
   */
  async getInstituteAdminDashboard(institutionId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all schools under this institution
    const schools = await School.find({ institutionId, isActive: true });
    const schoolIds = schools.map(s => s._id);

    // Get aggregate statistics across all schools
    const [
      totalSchools,
      totalStudents,
      totalTeachers,
      totalClasses,
      activeStudents,
      presentToday,
      pendingFees
    ] = await Promise.all([
      schools.length,
      Student.countDocuments({ schoolId: { $in: schoolIds }, isActive: true }),
      Teacher.countDocuments({ schoolId: { $in: schoolIds }, isActive: true }),
      Class.countDocuments({ schoolId: { $in: schoolIds }, isActive: true }),
      Student.countDocuments({ schoolId: { $in: schoolIds }, status: 'active' }),
      Attendance.countDocuments({ schoolId: { $in: schoolIds }, date: today, status: 'present' }),
      Fee.countDocuments({ schoolId: { $in: schoolIds }, status: { $in: ['pending', 'overdue'] } })
    ]);

    // Get school-wise overview
    const schoolsOverview = await Promise.all(
      schools.map(async (school) => {
        const [students, teachers] = await Promise.all([
          Student.countDocuments({ schoolId: school._id, isActive: true }),
          Teacher.countDocuments({ schoolId: school._id, isActive: true })
        ]);
        return {
          id: school._id,
          name: school.name,
          location: school.address?.city || 'N/A',
          students,
          teachers,
          status: school.isActive ? 'Active' : 'Inactive',
          statusClass: school.isActive ? 'badge-soft-success' : 'badge-soft-danger'
        };
      })
    );

    // Get recent activities across all schools
    const recentActivities = await this.getSystemRecentActivities(schoolIds[0]);

    return {
      welcomeMessage: 'Welcome Back, Institute Admin',
      lastUpdated: today.toLocaleDateString(),
      recentAlert: null,
      topStats: [
        {
          label: 'Total Schools',
          value: totalSchools,
          sub: 'Active institutions',
          icon: '/assets/img/icons/building.svg',
          avatarTone: 'bg-primary-transparent',
          delta: '+0',
          deltaTone: 'badge-soft-success'
        },
        {
          label: 'Total Students',
          value: totalStudents,
          sub: 'Across all schools',
          icon: '/assets/img/icons/students.svg',
          avatarTone: 'bg-success-transparent',
          delta: `+${activeStudents}`,
          deltaTone: 'badge-soft-success'
        },
        {
          label: 'Total Teachers',
          value: totalTeachers,
          sub: 'Teaching staff',
          icon: '/assets/img/icons/teacher.svg',
          avatarTone: 'bg-warning-transparent',
          delta: '+0',
          deltaTone: 'badge-soft-success'
        },
        {
          label: 'Total Classes',
          value: totalClasses,
          sub: 'Active classes',
          icon: '/assets/img/icons/class.svg',
          avatarTone: 'bg-info-transparent',
          delta: '+0',
          deltaTone: 'badge-soft-success'
        }
      ],
      schoolsOverview,
      performanceMetrics: [],
      financialSummary: [
        {
          label: 'Total Revenue',
          value: '$0',
          sub: 'This month',
          icon: 'ti ti-currency-dollar',
          tone: 'bg-success'
        },
        {
          label: 'Pending Fees',
          value: pendingFees,
          sub: 'Outstanding',
          icon: 'ti ti-alert-circle',
          tone: 'bg-warning'
        }
      ],
      attendanceTrend: [],
      enrollmentTrend: [],
      schoolsList: schoolsOverview,
      recentActivities: recentActivities.slice(0, 5),
      alerts: [],
      quickActions: [
        {
          label: 'Add School',
          to: '/schools/add',
          icon: 'ti ti-plus',
          bg: 'btn-primary'
        },
        {
          label: 'View Reports',
          to: '/reports',
          icon: 'ti ti-report',
          bg: 'btn-info'
        }
      ]
    };
  }

  async getSystemRecentActivities(schoolId) {
    // Implementation for getting system activities
    return [];
  }
}

export default new DashboardService();
