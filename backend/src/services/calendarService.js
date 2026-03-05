import HomeWork from '../models/HomeWork.js';
import Exam from '../models/Exam.js';
import Event from '../models/Event.js';
import Schedule from '../models/Schedule.js';

class CalendarService {
  async getCalendarEvents(schoolId, startDate, endDate, filters = {}) {
    const { entityTypes } = filters;
    
    const query = {
      schoolId,
      $or: []
    };

    const events = [];

    // Get Homework events
    if (!entityTypes || entityTypes.includes('homework')) {
      const homeworks = await HomeWork.find({
        schoolId,
        dueDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        isActive: true
      }).populate('subjectId', 'name code');
      
      homeworks.forEach(hw => {
        events.push({
          id: hw._id,
          type: 'homework',
          title: hw.title,
          date: hw.dueDate,
          color: '#4caf50',
          details: hw
        });
      });
    }

    // Get Exam events
    if (!entityTypes || entityTypes.includes('exam')) {
      const exams = await Exam.find({
        schoolId,
        examDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        isActive: true
      }).populate('subjectId', 'name code');
      
      exams.forEach(exam => {
        events.push({
          id: exam._id,
          type: 'exam',
          title: exam.title,
          date: exam.examDate,
          color: '#f44336',
          details: exam
        });
      });
    }

    // Get Event events
    if (!entityTypes || entityTypes.includes('event')) {
      const schoolEvents = await Event.find({
        schoolId,
        $or: [
          { startDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
          { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } }
        ],
        isActive: true
      }).populate('organizer', 'firstName lastName');
      
      schoolEvents.forEach(event => {
        events.push({
          id: event._id,
          type: 'event',
          title: event.title,
          date: event.startDate,
          endDate: event.endDate,
          color: '#2196f3',
          details: event
        });
      });
    }

    // Get Schedule events
    if (!entityTypes || entityTypes.includes('schedule')) {
      const schedules = await Schedule.find({
        schoolId,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        isDeleted: false
      });
      
      schedules.forEach(schedule => {
        events.push({
          id: schedule._id,
          type: 'schedule',
          title: schedule.title,
          date: schedule.date,
          color: '#9c27b0',
          details: schedule
        });
      });
    }

    // Sort by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    return events;
  }

  async getCalendarAnalytics(schoolId, startDate, endDate) {
    const [homeworkCount, examCount, eventCount, scheduleCount] = await Promise.all([
      HomeWork.countDocuments({
        schoolId,
        dueDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        isActive: true
      }),
      Exam.countDocuments({
        schoolId,
        examDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        isActive: true
      }),
      Event.countDocuments({
        schoolId,
        startDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        isActive: true
      }),
      Schedule.countDocuments({
        schoolId,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        isDeleted: false
      })
    ]);

    return {
      homework: homeworkCount,
      exams: examCount,
      events: eventCount,
      schedules: scheduleCount,
      total: homeworkCount + examCount + eventCount + scheduleCount
    };
  }
}

export default new CalendarService();
