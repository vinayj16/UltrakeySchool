import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';
import StudentDetailTabs from '../../components/students/StudentDetailTabs';
import StudentSidebar from '../../components/students/StudentSidebar';
import type { StudentProfile } from '../../data/students';

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface TimetableSession {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacherId?: Teacher;
  roomNumber?: string;
}

interface DaySchedule {
  day: string;
  sessions: TimetableSession[];
}

interface Student {
  _id: string;
  admissionNumber: string;
  rollNumber?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  classId?: {
    _id: string;
    name: string;
  };
  sectionId?: {
    _id: string;
    name: string;
  };
  admissionDate: string;
  status: string;
  email?: string;
  phone?: string;
  profilePhoto?: string;
  bloodGroup?: string;
  address?: string;
  religion?: string;
  caste?: string;
  category?: string;
  motherTongue?: string;
  languages?: string[];
}

const StudentTimeTablePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [timetable, setTimetable] = useState<DaySchedule[]>([]);

  const fetchStudentData = async () => {
    if (!id) {
      setError('Student ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch student details
      const studentResponse = await apiClient.get(`/students/${id}`);
      if (studentResponse.data.success) {
        setStudent(studentResponse.data.data);
      }

      // Fetch student timetable
      const timetableResponse = await apiClient.get(`/students/${id}/timetable`);
      if (timetableResponse.data.success) {
        const timetableData = timetableResponse.data.data || [];
        
        // Group sessions by day
        const groupedByDay = groupSessionsByDay(timetableData);
        setTimetable(groupedByDay);
      }
    } catch (err: any) {
      console.error('Error fetching student data:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load student data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const groupSessionsByDay = (sessions: TimetableSession[]): DaySchedule[] => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const grouped: { [key: string]: TimetableSession[] } = {};

    // Initialize all days
    daysOfWeek.forEach(day => {
      grouped[day] = [];
    });

    // Group sessions by day
    sessions.forEach(session => {
      if (grouped[session.day]) {
        grouped[session.day].push(session);
      }
    });

    // Sort sessions by start time for each day
    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
      });
    });

    // Convert to array format
    return daysOfWeek.map(day => ({
      day,
      sessions: grouped[day]
    }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const capitalize = (str?: string) => {
    if (!str) return 'N/A';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const mapStudentToProfile = (student: Student): StudentProfile => {
    const fullName = `${student.firstName} ${student.lastName}`;
    const classLabel = student.classId?.name || 'N/A';
    const section = student.sectionId?.name || 'N/A';
    const avatar = student.profilePhoto || `https://ui-avatars.com/api/?name=${fullName}&background=random`;

    return {
      admissionNo: student.admissionNumber,
      rollNo: student.rollNumber || 'N/A',
      name: fullName,
      classLabel: `${classLabel}, ${section}`,
      status: capitalize(student.status) as 'Active' | 'Inactive',
      avatar,
      primaryContact: {
        phone: student.phone || 'N/A',
        email: student.email || 'N/A',
      },
      siblings: [],
      hostel: {
        name: 'Not Assigned',
        room: 'N/A',
      },
      transport: {
        route: 'N/A',
        busNumber: 'N/A',
        pickupPoint: 'N/A',
      },
      basicInfo: [
        { label: 'Gender', value: capitalize(student.gender) },
        { label: 'Date Of Birth', value: formatDate(student.dateOfBirth) },
        { label: 'Blood Group', value: student.bloodGroup || 'N/A' },
        { label: 'Religion', value: student.religion || 'N/A' },
        { label: 'Caste', value: student.caste || 'N/A' },
        { label: 'Category', value: student.category || 'N/A' },
        { label: 'Mother Tongue', value: student.motherTongue || 'N/A' },
        { label: 'Languages', value: student.languages?.join(', ') || 'N/A' },
      ],
      parents: [],
      documents: [],
      addresses: {
        current: student.address || 'N/A',
        permanent: student.address || 'N/A',
      },
      previousSchool: {
        name: 'N/A',
        address: 'N/A',
      },
      bank: {
        name: 'N/A',
        branch: 'N/A',
        ifsc: 'N/A',
      },
      medical: {
        allergies: [],
        medications: 'N/A',
      },
      loginCredentials: [],
    };
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    // Assuming time is in HH:mm format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getSessionColorClass = (index: number) => {
    const colors = [
      'bg-light-300',
      'bg-light-200',
      'bg-light-100',
      'bg-info-transparent',
      'bg-success-transparent',
      'bg-warning-transparent'
    ];
    return colors[index % colors.length];
  };

  const getTeacherAvatar = (teacher?: Teacher) => {
    if (!teacher) return 'https://ui-avatars.com/api/?name=Teacher&background=random';
    
    if (teacher.avatar) return teacher.avatar;
    
    const fullName = `${teacher.firstName} ${teacher.lastName}`;
    return `https://ui-avatars.com/api/?name=${fullName}&background=random`;
  };

  const getTeacherName = (teacher?: Teacher) => {
    if (!teacher) return 'Not Assigned';
    return `${teacher.firstName} ${teacher.lastName}`;
  };

  return (
    <>
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Student Details</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/students">Student</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Student Details
              </li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <button className="btn btn-light me-2 mb-2" type="button">
            <i className="ti ti-lock me-2" />
            Login Details
          </button>
          <Link to={`/students/edit/${id}`} className="btn btn-primary d-flex align-items-center mb-2">
            <i className="ti ti-edit-circle me-2" />
            Edit Student
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading student data...</span>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="ti ti-alert-circle fs-1 text-danger mb-3"></i>
            <h4 className="mb-3">{error}</h4>
            <button className="btn btn-primary" onClick={fetchStudentData}>
              <i className="ti ti-refresh me-2"></i>
              Retry
            </button>
          </div>
        </div>
      ) : !student ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="ti ti-user-off fs-1 text-muted mb-3"></i>
            <h4 className="mb-3">Student not found</h4>
            <Link to="/students" className="btn btn-primary">
              <i className="ti ti-arrow-left me-2"></i>
              Back to Students
            </Link>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-xxl-3 col-xl-4">
            <StudentSidebar profile={mapStudentToProfile(student)} />
          </div>
          <div className="col-xxl-9 col-xl-8">
            <StudentDetailTabs active="timetable" />

            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
                <h4 className="mb-3">Time Table</h4>
                <div className="dropdown mb-3">
                  <button className="btn btn-outline-light border-white bg-white dropdown-toggle shadow-md" type="button">
                    <i className="ti ti-calendar-due me-2" />
                    This Year
                  </button>
                </div>
              </div>
              <div className="card-body">
                {timetable.length === 0 || timetable.every(day => day.sessions.length === 0) ? (
                  <div className="text-center py-5">
                    <i className="ti ti-calendar-off fs-1 text-muted mb-3"></i>
                    <h4 className="mb-3">No timetable available</h4>
                    <p className="text-muted">The timetable for this student has not been set up yet.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-nowrap overflow-auto">
                    {timetable.map((daySchedule) => (
                      <div className="d-flex flex-column me-4 flex-fill min-w-300" key={daySchedule.day}>
                        <div className="mb-3">
                          <h6>{daySchedule.day}</h6>
                        </div>
                        {daySchedule.sessions.length === 0 ? (
                          <div className="bg-light rounded p-3 mb-4">
                            <p className="text-muted mb-0">No classes scheduled</p>
                          </div>
                        ) : (
                          daySchedule.sessions.map((session, idx) => (
                            <div className={`${getSessionColorClass(idx)} rounded p-3 mb-4`} key={session._id}>
                              <p className="d-flex align-items-center text-nowrap mb-1">
                                <i className="ti ti-clock me-1" />
                                {formatTime(session.startTime)} - {formatTime(session.endTime)}
                              </p>
                              <p className="text-dark fw-semibold mb-1">{session.subject}</p>
                              {session.roomNumber && (
                                <p className="text-muted small mb-2">
                                  <i className="ti ti-door me-1" />
                                  Room {session.roomNumber}
                                </p>
                              )}
                              <div className="bg-white rounded p-1 mt-3">
                                <Link 
                                  to={session.teacherId ? `/teachers/details/${session.teacherId._id}` : '#'} 
                                  className="text-muted d-flex align-items-center"
                                  onClick={(e) => !session.teacherId && e.preventDefault()}
                                >
                                  <span className="avatar avatar-sm me-2">
                                    <img 
                                      src={getTeacherAvatar(session.teacherId)} 
                                      alt={getTeacherName(session.teacherId)} 
                                    />
                                  </span>
                                  {getTeacherName(session.teacherId)}
                                </Link>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentTimeTablePage;
