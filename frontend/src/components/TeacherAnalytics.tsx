import React, { useEffect, useState } from 'react';
import ChartLoader from '../utils/chartLoader';
import { isAuthenticated, isTeacher } from '../utils/auth';
import { apiService } from '../services/api';

interface TeacherAnalyticsProps {
  className?: string;
}

const TeacherAnalytics: React.FC<TeacherAnalyticsProps> = ({ className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    const initializeTeacherAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if user is authenticated and has teacher role
        if (!isAuthenticated()) {
          setError('Please log in to view teacher analytics');
          setIsLoading(false);
          return;
        }

        if (!isTeacher()) {
          setError('Access denied. Teacher privileges required.');
          setIsLoading(false);
          return;
        }

        // Fetch teacher-specific analytics data
        const [performanceData, attendanceData, classData, examData] = await Promise.all([
          apiService.get('/analytics/teacher/performance', { period: 'monthly' }),
          apiService.get('/analytics/teacher/attendance'),
          apiService.get('/analytics/teacher/classes'),
          apiService.get('/analytics/teacher/exams')
        ]);

        setAnalyticsData({
          performance: performanceData.success ? performanceData.data : null,
          attendance: attendanceData.success ? attendanceData.data : null,
          classes: classData.success ? classData.data : null,
          exams: examData.success ? examData.data : null
        });

        // Initialize teacher-specific charts
        await ChartLoader.loadTeacherCharts();
        setIsLoading(false);

      } catch (err) {
        console.error('Failed to initialize teacher analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to load teacher analytics');
        setIsLoading(false);
      }
    };

    initializeTeacherAnalytics();

    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, []);

  if (isLoading) {
    return (
      <div className={`teacher-analytics-loading ${className || ''}`}>
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="text-muted mb-0">Loading teacher analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`teacher-analytics-error ${className || ''}`}>
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '400px' }}>
          <i className="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
          <h5 className="text-danger mb-2">Error Loading Analytics</h5>
          <p className="text-muted text-center mb-4">{error}</p>
          <button className="btn btn-outline-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`teacher-analytics ${className || ''}`}>
      {/* Teacher Analytics Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Teacher Analytics</h2>
            <div className="text-muted">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Classes Handled</h6>
                  <h4 className="mb-0">
                    {analyticsData?.classes ? analyticsData.classes.length : '0'}
                  </h4>
                </div>
                <div className="avatar-sm bg-primary rounded-circle">
                  <i className="fas fa-chalkboard-teacher text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Exams Conducted</h6>
                  <h4 className="mb-0">
                    {analyticsData?.exams ? analyticsData.exams.length : '0'}
                  </h4>
                </div>
                <div className="avatar-sm bg-success rounded-circle">
                  <i className="fas fa-file-alt text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Class Average</h6>
                  <h4 className="mb-0 text-primary">
                    {analyticsData?.performance ? `${analyticsData.performance.averageScore || 0}%` : '0%'}
                  </h4>
                </div>
                <div className="avatar-sm bg-info rounded-circle">
                  <i className="fas fa-chart-bar text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-2">Attendance Rate</h6>
                  <h4 className="mb-0 text-success">
                    {analyticsData?.attendance ? `${analyticsData.attendance.overallRate || 0}%` : '0%'}
                  </h4>
                </div>
                <div className="avatar-sm bg-warning rounded-circle">
                  <i className="fas fa-check-circle text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Class Performance</h5>
            </div>
            <div className="card-body">
              <div id="teacher_performance_chart" style={{ minHeight: '350px' }}>
                {/* Chart will be rendered here */}
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Class Attendance</h5>
            </div>
            <div className="card-body">
              <div id="class_attendance_chart" style={{ minHeight: '350px' }}>
                {/* Chart will be rendered here */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Class Details */}
      {analyticsData && (
        <div className="row mt-4">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Class Performance Details</h5>
              </div>
              <div className="card-body">
                {analyticsData.performance ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Class</th>
                          <th>Subject</th>
                          <th>Average Score</th>
                          <th>Exam Count</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.performance.classes ? (
                          analyticsData.performance.classes.map((classData: any, index: number) => (
                            <tr key={index}>
                              <td>{classData.className || 'Unknown'}</td>
                              <td>{classData.subject || 'N/A'}</td>
                              <td>
                                <span className={`badge ${classData.averageScore >= 70 ? 'bg-success' : 'bg-warning'}`}>
                                  {classData.averageScore || 0}%
                                </span>
                              </td>
                              <td>{classData.examCount || 0}</td>
                              <td>
                                <span className={`badge ${classData.status === 'excellent' ? 'bg-success' : classData.status === 'good' ? 'bg-info' : 'bg-warning'}`}>
                                  {classData.status || 'Average'}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center text-muted">No performance data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">No performance data available</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Quick Stats</h5>
              </div>
              <div className="card-body">
                <div className="d-flex flex-column gap-3">
                  <div>
                    <h6 className="text-muted mb-1">Top Performing Class</h6>
                    <h5 className="mb-0">
                      {analyticsData.performance?.topClass || 'N/A'}
                    </h5>
                  </div>
                  
                  <div>
                    <h6 className="text-muted mb-1">Lowest Performing Class</h6>
                    <h5 className="mb-0 text-danger">
                      {analyticsData.performance?.lowestClass || 'N/A'}
                    </h5>
                  </div>
                  
                  <div>
                    <h6 className="text-muted mb-1">Total Students</h6>
                    <h5 className="mb-0">
                      {analyticsData.performance?.totalStudents || 0}
                    </h5>
                  </div>
                  
                  <div>
                    <h6 className="text-muted mb-1">Average Attendance</h6>
                    <h5 className="mb-0">
                      {analyticsData.attendance?.overallRate || 0}%
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Quick Actions</h6>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary btn-sm">
                    <i className="fas fa-plus me-2"></i>Add Exam
                  </button>
                  <button className="btn btn-success btn-sm">
                    <i className="fas fa-chart-line me-2"></i>View Reports
                  </button>
                  <button className="btn btn-info btn-sm">
                    <i className="fas fa-download me-2"></i>Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAnalytics;