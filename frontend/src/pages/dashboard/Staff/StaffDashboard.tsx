import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../../api/client';

interface DashboardData {
  teacher: {
    id: string;
    name: string;
    department?: string;
    classTeacher?: string;
    avatar?: string;
  };
  quickStats: {
    studentsInClass: number;
    presentToday: number;
    pendingTasks: number;
    unreadMessages: number;
  };
  todaySchedule: any[];
  classStats: any;
  pendingTasks: any[];
  messages: any[];
  upcomingEvents: any[];
  recentActivities: any[];
}

const StaffDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/dashboard/teacher');

      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load dashboard data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="ti ti-alert-circle me-2 fs-4"></i>
          <div className="flex-grow-1">
            <h5 className="alert-heading">Error Loading Dashboard</h5>
            <p className="mb-0">{error}</p>
          </div>
          <button
            className="btn btn-outline-danger ms-3"
            onClick={fetchDashboardData}
          >
            <i className="ti ti-refresh me-1"></i>Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-5">
        <i className="ti ti-database-off" style={{ fontSize: '48px', color: '#ccc' }}></i>
        <p className="mt-2 text-muted">No dashboard data available</p>
      </div>
    );
  }

  const { teacher, quickStats, todaySchedule, classStats, pendingTasks, messages, upcomingEvents, recentActivities } = dashboardData;

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Staff Dashboard</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Staff Dashboard</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <button
            className="btn btn-outline-light bg-white btn-icon me-2"
            onClick={handleRefresh}
            title="Refresh"
          >
            <i className="ti ti-refresh"></i>
          </button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="row mb-4">
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="card flex-fill animate-card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="overflow-hidden">
                  <h6 className="text-muted mb-2">Students in Class</h6>
                  <h3 className="mb-0">{quickStats.studentsInClass}</h3>
                </div>
                <div className="avatar avatar-lg bg-primary-transparent flex-shrink-0">
                  <i className="ti ti-users fs-24"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="card flex-fill animate-card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="overflow-hidden">
                  <h6 className="text-muted mb-2">Present Today</h6>
                  <h3 className="mb-0">{quickStats.presentToday}</h3>
                </div>
                <div className="avatar avatar-lg bg-success-transparent flex-shrink-0">
                  <i className="ti ti-calendar-check fs-24"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="card flex-fill animate-card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="overflow-hidden">
                  <h6 className="text-muted mb-2">Pending Tasks</h6>
                  <h3 className="mb-0">{quickStats.pendingTasks}</h3>
                </div>
                <div className="avatar avatar-lg bg-warning-transparent flex-shrink-0">
                  <i className="ti ti-clipboard-list fs-24"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="card flex-fill animate-card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div className="overflow-hidden">
                  <h6 className="text-muted mb-2">Unread Messages</h6>
                  <h3 className="mb-0">{quickStats.unreadMessages}</h3>
                </div>
                <div className="avatar avatar-lg bg-danger-transparent flex-shrink-0">
                  <i className="ti ti-message fs-24"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT ROW */}
      <div className="row">
        {/* TEACHER PROFILE */}
        <div className="col-xxl-4 col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                {teacher.avatar ? (
                  <img
                    src={teacher.avatar}
                    className="avatar avatar-xxl rounded me-3"
                    alt={teacher.name}
                  />
                ) : (
                  <div className="avatar avatar-xxl rounded me-3 bg-light d-flex align-items-center justify-content-center">
                    <i className="ti ti-user fs-24 text-muted"></i>
                  </div>
                )}
                <div>
                  <h4 className="mb-1">{teacher.name}</h4>
                  {teacher.department && (
                    <p className="text-muted mb-1">Department: {teacher.department}</p>
                  )}
                  {teacher.classTeacher && (
                    <p className="text-muted mb-0">Class Teacher: {teacher.classTeacher}</p>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2">
                <Link to="/teacher/profile" className="btn btn-primary flex-fill">
                  <i className="ti ti-user me-1"></i>View Profile
                </Link>
                <Link to="/teacher/edit" className="btn btn-outline-primary flex-fill">
                  <i className="ti ti-edit me-1"></i>Edit
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* TODAY'S SCHEDULE */}
        <div className="col-xxl-4 col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title mb-0">Today&apos;s Schedule</h5>
            </div>
            <div className="card-body">
              {todaySchedule && todaySchedule.length > 0 ? (
                <div className="list-group list-group-flush">
                  {todaySchedule.slice(0, 5).map((schedule: any, index: number) => (
                    <div key={index} className="list-group-item px-0">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{schedule.subject || schedule.title}</h6>
                          <small className="text-muted">
                            <i className="ti ti-clock me-1"></i>
                            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                          </small>
                        </div>
                        {schedule.class && (
                          <span className="badge badge-soft-primary">{schedule.class}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <i className="ti ti-calendar-off fs-24 text-muted"></i>
                  <p className="text-muted mt-2 mb-0">No classes scheduled for today</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CLASS STATISTICS */}
        <div className="col-xxl-4 col-xl-12 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title mb-0">Class Statistics</h5>
            </div>
            <div className="card-body">
              {classStats ? (
                <div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Total Students</span>
                    <strong>{classStats.totalStudents || 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Present Today</span>
                    <strong className="text-success">{classStats.presentToday || 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Absent Today</span>
                    <strong className="text-danger">{classStats.absentToday || 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Attendance Rate</span>
                    <strong>{classStats.attendanceRate || 0}%</strong>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3">
                  <i className="ti ti-chart-bar-off fs-24 text-muted"></i>
                  <p className="text-muted mt-2 mb-0">No class statistics available</p>
                  <small className="text-muted">You are not assigned as a class teacher</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="row">
        {/* PENDING TASKS */}
        <div className="col-xxl-4 col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">Pending Tasks</h5>
              <Link to="/tasks" className="btn btn-sm btn-primary">View All</Link>
            </div>
            <div className="card-body">
              {pendingTasks && pendingTasks.length > 0 ? (
                <div className="list-group list-group-flush">
                  {pendingTasks.slice(0, 5).map((task: any, index: number) => (
                    <div key={index} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{task.title || task.description}</h6>
                          <small className="text-muted">{task.type || 'Task'}</small>
                        </div>
                        {task.dueDate && (
                          <span className="badge badge-soft-warning">
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <i className="ti ti-clipboard-check fs-24 text-muted"></i>
                  <p className="text-muted mt-2 mb-0">No pending tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RECENT MESSAGES */}
        <div className="col-xxl-4 col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">Recent Messages</h5>
              <Link to="/messages" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body">
              {messages && messages.length > 0 ? (
                <div className="list-group list-group-flush">
                  {messages.map((message: any, index: number) => (
                    <div key={index} className="list-group-item px-0">
                      <div className="d-flex align-items-start">
                        <div className="avatar avatar-md bg-primary-transparent rounded me-2 flex-shrink-0">
                          <i className="ti ti-message fs-16"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{message.subject || message.title}</h6>
                          <p className="text-muted mb-1 small">{message.preview || message.message}</p>
                          <small className="text-muted">
                            <i className="ti ti-clock me-1"></i>
                            {formatDate(message.timestamp || message.createdAt)}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <i className="ti ti-message-off fs-24 text-muted"></i>
                  <p className="text-muted mt-2 mb-0">No recent messages</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* UPCOMING EVENTS */}
        <div className="col-xxl-4 col-xl-12 d-flex">
          <div className="card flex-fill">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">Upcoming Events</h5>
              <Link to="/events" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body">
              {upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="list-group list-group-flush">
                  {upcomingEvents.map((event: any) => (
                    <div key={event.id} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{event.title}</h6>
                          <small className="text-muted text-capitalize">{event.type}</small>
                        </div>
                        <span className="badge badge-soft-info">
                          {formatDate(event.date)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <i className="ti ti-calendar-event fs-24 text-muted"></i>
                  <p className="text-muted mt-2 mb-0">No upcoming events</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITIES */}
      {recentActivities && recentActivities.length > 0 && (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Recent Activities</h5>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  {recentActivities.slice(0, 10).map((activity: any, index: number) => (
                    <div key={index} className="list-group-item px-0">
                      <div className="d-flex align-items-start">
                        <div className="avatar avatar-sm bg-light rounded me-2 flex-shrink-0">
                          <i className="ti ti-activity fs-14"></i>
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-1">{activity.description || activity.activity}</p>
                          <small className="text-muted">
                            <i className="ti ti-clock me-1"></i>
                            {formatDate(activity.timestamp || activity.createdAt)}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-xl-2 col-md-3 col-sm-4 col-6">
                  <Link to="/attendance/mark" className="card border-0 border-bottom border-primary border-2 animate-card">
                    <div className="card-body text-center">
                      <div className="avatar avatar-lg bg-primary rounded mb-2 mx-auto">
                        <i className="ti ti-calendar-check fs-24"></i>
                      </div>
                      <h6 className="mb-0">Mark Attendance</h6>
                    </div>
                  </Link>
                </div>
                <div className="col-xl-2 col-md-3 col-sm-4 col-6">
                  <Link to="/homework/assign" className="card border-0 border-bottom border-success border-2 animate-card">
                    <div className="card-body text-center">
                      <div className="avatar avatar-lg bg-success rounded mb-2 mx-auto">
                        <i className="ti ti-book-2 fs-24"></i>
                      </div>
                      <h6 className="mb-0">Assign Homework</h6>
                    </div>
                  </Link>
                </div>
                <div className="col-xl-2 col-md-3 col-sm-4 col-6">
                  <Link to="/grades/enter" className="card border-0 border-bottom border-warning border-2 animate-card">
                    <div className="card-body text-center">
                      <div className="avatar avatar-lg bg-warning rounded mb-2 mx-auto">
                        <i className="ti ti-report-analytics fs-24"></i>
                      </div>
                      <h6 className="mb-0">Enter Grades</h6>
                    </div>
                  </Link>
                </div>
                <div className="col-xl-2 col-md-3 col-sm-4 col-6">
                  <Link to="/timetable" className="card border-0 border-bottom border-dark border-2 animate-card">
                    <div className="card-body text-center">
                      <div className="avatar avatar-lg bg-dark rounded mb-2 mx-auto">
                        <i className="ti ti-calendar fs-24"></i>
                      </div>
                      <h6 className="mb-0">View Timetable</h6>
                    </div>
                  </Link>
                </div>
                <div className="col-xl-2 col-md-3 col-sm-4 col-6">
                  <Link to="/students" className="card border-0 border-bottom border-info border-2 animate-card">
                    <div className="card-body text-center">
                      <div className="avatar avatar-lg bg-info rounded mb-2 mx-auto">
                        <i className="ti ti-users fs-24"></i>
                      </div>
                      <h6 className="mb-0">My Students</h6>
                    </div>
                  </Link>
                </div>
                <div className="col-xl-2 col-md-3 col-sm-4 col-6">
                  <Link to="/leave/apply" className="card border-0 border-bottom border-danger border-2 animate-card">
                    <div className="card-body text-center">
                      <div className="avatar avatar-lg bg-danger rounded mb-2 mx-auto">
                        <i className="ti ti-calendar-event fs-24"></i>
                      </div>
                      <h6 className="mb-0">Apply Leave</h6>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
