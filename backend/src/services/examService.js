import Exam from '../models/Exam.js';

class ExamService {
  async createExam(schoolId, data) {
    return await Exam.create({ ...data, schoolId });
  }

  async getExams(schoolId, filters = {}) {
    return await Exam.find({ schoolId, ...filters })
      .populate('classId', 'name section')
      .populate('subjectId', 'name code')
      .populate('invigilator', 'firstName lastName');
  }

  async getExamById(examId, schoolId) {
    const exam = await Exam.findOne({ _id: examId, schoolId })
      .populate('classId', 'name section')
      .populate('subjectId', 'name code')
      .populate('invigilator', 'firstName lastName')
      .populate('attendance.studentId', 'firstName lastName studentId');
    if (!exam) throw new Error('Exam not found');
    return exam;
  }

  async updateExam(examId, schoolId, updates) {
    const exam = await Exam.findOneAndUpdate(
      { _id: examId, schoolId },
      { $set: updates },
      { new: true }
    );
    if (!exam) throw new Error('Exam not found');
    return exam;
  }

  async deleteExam(examId, schoolId) {
    const exam = await Exam.findOneAndDelete({ _id: examId, schoolId });
    if (!exam) throw new Error('Exam not found');
    return exam;
  }

  async getExamsByClass(schoolId, classId) {
    return await Exam.find({ schoolId, classId, isActive: true })
      .populate('subjectId', 'name code')
      .sort({ examDate: 1 });
  }

  async markAttendance(examId, schoolId, studentId, status) {
    const exam = await Exam.findOne({ _id: examId, schoolId });
    if (!exam) throw new Error('Exam not found');
    
    const existing = exam.attendance.find(a => a.studentId.toString() === studentId);
    if (existing) {
      existing.status = status;
    } else {
      exam.attendance.push({ studentId, status });
    }
    await exam.save();
    return exam;
  }

  async getAttendance(examId, schoolId) {
    const exam = await Exam.findOne({ _id: examId, schoolId })
      .populate('attendance.studentId', 'firstName lastName studentId');
    if (!exam) throw new Error('Exam not found');
    return exam.attendance;
  }
}

export default new ExamService();
