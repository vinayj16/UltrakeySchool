class AcademicEngineService {
  getAcademicStructure(institutionType) {
    switch (institutionType) {
      case 'SCHOOL':
        return this.getSchoolStructure();
      case 'INTER_COLLEGE':
        return this.getInterCollegeStructure();
      case 'DEGREE_COLLEGE':
        return this.getDegreeCollegeStructure();
      default:
        throw new Error(`Unsupported institution type: ${institutionType}`);
    }
  }

  getSchoolStructure() {
    return {
      hierarchy: ['academic_year', 'class', 'section'],
      studentGrouping: 'class_section',
      terminology: {
        student: 'Student',
        teacher: 'Teacher',
        class: 'Class',
        section: 'Section',
        exam: 'Exam',
        result: 'Result'
      },
      modules: [
        'classes', 'sections', 'subjects', 'students', 'teachers', 
        'attendance', 'exams', 'fees', 'reports'
      ],
      features: {
        promotion: true,
        streams: false,
        departments: false,
        courses: false,
        semesters: false,
        credits: false
      }
    };
  }

  getInterCollegeStructure() {
    return {
      hierarchy: ['academic_year', 'year', 'stream', 'section'],
      studentGrouping: 'year_stream_section',
      terminology: {
        student: 'Student',
        teacher: 'Lecturer',
        class: 'Year',
        section: 'Section',
        exam: 'Exam',
        result: 'Result'
      },
      modules: [
        'inter_years', 'streams', 'sections', 'students', 'lecturers',
        'attendance', 'exams', 'practicals', 'fees', 'reports'
      ],
      features: {
        promotion: true,
        streams: true,
        departments: false,
        courses: false,
        semesters: false,
        credits: false,
        practicals: true,
        boardExams: true
      }
    };
  }

  getDegreeCollegeStructure() {
    return {
      hierarchy: ['department', 'course', 'year', 'semester', 'subject'],
      studentGrouping: 'course_semester',
      terminology: {
        student: 'Student',
        teacher: 'Professor',
        class: 'Course',
        section: 'Semester',
        exam: 'Semester Exam',
        result: 'Result'
      },
      modules: [
        'departments', 'courses', 'semesters', 'subjects', 'students', 
        'faculty', 'attendance', 'internal_assessments', 'examinations', 
        'results', 'fees', 'placement', 'reports'
      ],
      features: {
        promotion: false,
        streams: false,
        departments: true,
        courses: true,
        semesters: true,
        credits: true,
        practicals: true,
        boardExams: false,
        gpa: true,
        cgpa: true,
        workload: true
      }
    };
  }

  getAvailableModules(institutionType) {
    const baseModules = [
      'dashboard', 'users', 'roles', 'communication', 'library', 
      'transport', 'hostel', 'settings'
    ];

    const specificModules = {
      SCHOOL: ['students', 'teachers', 'academics', 'attendance', 'exams', 'fees', 'reports'],
      INTER_COLLEGE: ['students', 'lecturers', 'inter_academics', 'attendance', 'exams', 'practicals', 'fees', 'reports'],
      DEGREE_COLLEGE: ['students', 'faculty', 'departments', 'courses', 'semesters', 'attendance', 'internal_assessments', 'examinations', 'results', 'fees', 'placement', 'reports']
    };

    return [...baseModules, ...(specificModules[institutionType] || [])];
  }

  getStudentGroupingLogic(institutionType) {
    const logic = {
      SCHOOL: { groupBy: 'class_section', fields: ['classId', 'sectionId'], promotionLogic: 'class_to_class' },
      INTER_COLLEGE: { groupBy: 'year_stream_section', fields: ['yearId', 'streamId', 'sectionId'], promotionLogic: 'year_to_year' },
      DEGREE_COLLEGE: { groupBy: 'course_semester', fields: ['courseId', 'semesterId'], promotionLogic: 'semester_to_semester' }
    };
    return logic[institutionType];
  }

  getAttendanceRules(institutionType) {
    const baseRules = { minimumRequired: 75, shortageAllowed: 25, medicalLeaveAllowed: 10 };
    const specificRules = {
      SCHOOL: { ...baseRules, dailyAttendance: true, subjectWise: false },
      INTER_COLLEGE: { ...baseRules, dailyAttendance: true, subjectWise: true, practicalAttendance: true, boardCompliance: true },
      DEGREE_COLLEGE: { ...baseRules, dailyAttendance: false, subjectWise: true, creditBased: true, internalEligibility: true }
    };
    return specificRules[institutionType];
  }

  getExamSystem(institutionType) {
    const systems = {
      SCHOOL: { type: 'annual', internalWeightage: 0, externalWeightage: 100, subjects: ['theory'], grading: 'percentage' },
      INTER_COLLEGE: { type: 'board_preparation', internalWeightage: 20, externalWeightage: 80, subjects: ['theory', 'practical'], grading: 'percentage', boardIntegration: true },
      DEGREE_COLLEGE: { type: 'semester', internalWeightage: 40, externalWeightage: 60, subjects: ['theory', 'practical', 'assignment'], grading: 'gpa', creditSystem: true, backlog: true }
    };
    return systems[institutionType];
  }

  getRequiredRoles(institutionType) {
    const baseRoles = ['SUPER_ADMIN', 'INSTITUTION_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT', 'LIBRARIAN', 'TRANSPORT_MANAGER', 'HOSTEL_WARDEN'];
    const specificRoles = {
      SCHOOL: ['TEACHER', 'STUDENT', 'PARENT'],
      INTER_COLLEGE: ['LECTURER', 'STUDENT', 'PARENT', 'PRINCIPAL', 'VICE_PRINCIPAL'],
      DEGREE_COLLEGE: ['PROFESSOR', 'ASSISTANT_PROFESSOR', 'HOD', 'EXAM_CONTROLLER', 'STUDENT', 'PARENT', 'PRINCIPAL']
    };
    return [...baseRoles, ...(specificRoles[institutionType] || [])];
  }
}

export default new AcademicEngineService();
