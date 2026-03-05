/**
 * Mock API Interceptor - Returns mock data for all API calls in demo mode
 * This allows the frontend to work completely standalone without a backend
 */

import type { AxiosInstance } from 'axios'
import { isDemoMode } from './demoMode'

// Mock dashboard data for different roles - ALL FIELDS PRESENT BUT EMPTY/ZERO
// This ensures UI shows all sections but with no data until DB is populated
const mockDashboardData = {
  'institute-admin': {
    success: true,
    data: {
      welcomeMessage: 'Welcome Back, Admin',
      lastUpdated: new Date().toLocaleDateString(),
      recentAlert: null,
      topStats: [
        { label: 'Total Schools', value: '0', change: '0%', icon: 'building' },
        { label: 'Total Students', value: '0', change: '0%', icon: 'users' },
        { label: 'Total Teachers', value: '0', change: '0%', icon: 'user' },
        { label: 'Monthly Revenue', value: '$0', change: '0%', icon: 'dollar' }
      ],
      schoolsOverview: [],
      performanceMetrics: [],
      financialSummary: [],
      attendanceTrend: [],
      enrollmentTrend: [],
      schoolsList: [],
      recentActivities: [],
      alerts: [],
      quickActions: [
        { label: 'Add School', icon: 'plus', link: '/schools/add' },
        { label: 'View Reports', icon: 'chart', link: '/reports' },
        { label: 'Manage Users', icon: 'users', link: '/users' },
        { label: 'Settings', icon: 'settings', link: '/settings' }
      ]
    }
  },
  'teacher': {
    success: true,
    data: {
      welcomeMessage: 'Welcome Back, Teacher',
      lastUpdated: new Date().toLocaleDateString(),
      topStats: [
        { label: 'My Students', value: '0', change: '0%', icon: 'users' },
        { label: 'Classes Today', value: '0', change: '0%', icon: 'book' },
        { label: 'Pending Assignments', value: '0', change: '0%', icon: 'clipboard' },
        { label: 'Average Grade', value: 'N/A', change: '0%', icon: 'star' }
      ],
      todaySchedule: [],
      recentSubmissions: [],
      upcomingClasses: [],
      pendingGrading: [],
      recentActivities: [],
      quickActions: [
        { label: 'Take Attendance', icon: 'check', link: '/attendance' },
        { label: 'Grade Assignments', icon: 'edit', link: '/grades' },
        { label: 'Create Assignment', icon: 'plus', link: '/homework/add' },
        { label: 'View Timetable', icon: 'calendar', link: '/timetable' }
      ]
    }
  },
  'student': {
    success: true,
    data: {
      welcomeMessage: 'Welcome Back, Student',
      lastUpdated: new Date().toLocaleDateString(),
      topStats: [
        { label: 'Current GPA', value: '0.0', change: '0%', icon: 'star' },
        { label: 'Attendance', value: '0%', change: '0%', icon: 'check' },
        { label: 'Completed Assignments', value: '0/0', change: '0%', icon: 'clipboard' },
        { label: 'Upcoming Exams', value: '0', change: '0', icon: 'test' }
      ],
      todayClasses: [],
      pendingHomework: [],
      recentGrades: [],
      upcomingExams: [],
      recentActivities: [],
      quickActions: [
        { label: 'View Grades', icon: 'star', link: '/grades' },
        { label: 'Submit Assignment', icon: 'upload', link: '/homework' },
        { label: 'Check Attendance', icon: 'check', link: '/attendance' },
        { label: 'View Timetable', icon: 'calendar', link: '/timetable' }
      ]
    }
  },
  'parent': {
    success: true,
    data: {
      welcomeMessage: 'Welcome Back, Parent',
      lastUpdated: new Date().toLocaleDateString(),
      topStats: [
        { label: 'Children', value: '0', change: '0', icon: 'users' },
        { label: 'Average Grade', value: 'N/A', change: '0%', icon: 'star' },
        { label: 'Attendance Rate', value: '0%', change: '0%', icon: 'check' },
        { label: 'Outstanding Fees', value: '$0', change: '0%', icon: 'dollar' }
      ],
      childrenList: [],
      childrenSchedule: [],
      recentReports: [],
      upcomingEvents: [],
      feeStatus: [],
      recentActivities: [],
      quickActions: [
        { label: 'View Children', icon: 'users', link: '/children' },
        { label: 'Pay Fees', icon: 'dollar', link: '/fees' },
        { label: 'Check Grades', icon: 'star', link: '/grades' },
        { label: 'Contact Teacher', icon: 'message', link: '/messages' }
      ]
    }
  },
  'principal': {
    success: true,
    data: {
      welcomeMessage: 'Welcome Back, Principal',
      lastUpdated: new Date().toLocaleDateString(),
      topStats: [
        { label: 'Total Students', value: '0', change: '0%', icon: 'users' },
        { label: 'Total Teachers', value: '0', change: '0%', icon: 'user' },
        { label: 'Attendance Rate', value: '0%', change: '0%', icon: 'check' },
        { label: 'Academic Performance', value: '0%', change: '0%', icon: 'star' }
      ],
      attendanceOverview: [],
      performanceMetrics: [],
      upcomingEvents: [],
      recentActivities: [],
      alerts: [],
      quickActions: [
        { label: 'View Reports', icon: 'chart', link: '/reports' },
        { label: 'Manage Staff', icon: 'users', link: '/staff' },
        { label: 'Announcements', icon: 'bell', link: '/announcements' },
        { label: 'Settings', icon: 'settings', link: '/settings' }
      ]
    }
  },
  'staff': {
    success: true,
    data: {
      welcomeMessage: 'Welcome Back, Staff',
      lastUpdated: new Date().toLocaleDateString(),
      topStats: [
        { label: 'Tasks Completed', value: '0', change: '0%', icon: 'check' },
        { label: 'Attendance Rate', value: '0%', change: '0%', icon: 'calendar' },
        { label: 'Pending Tasks', value: '0', change: '0', icon: 'clipboard' },
        { label: 'Leave Balance', value: '0 days', change: '0', icon: 'calendar' }
      ],
      myTasks: [],
      upcomingEvents: [],
      recentActivities: [],
      leaveStatus: [],
      quickActions: [
        { label: 'View Tasks', icon: 'clipboard', link: '/tasks' },
        { label: 'Apply Leave', icon: 'calendar', link: '/leave' },
        { label: 'Check Attendance', icon: 'check', link: '/attendance' },
        { label: 'Profile', icon: 'user', link: '/profile' }
      ]
    }
  },
  'accountant': {
    success: true,
    data: {
      welcomeMessage: 'Welcome Back, Accountant',
      lastUpdated: new Date().toLocaleDateString(),
      topStats: [
        { label: 'Monthly Revenue', value: '$0', change: '0%', icon: 'dollar' },
        { label: 'Outstanding Fees', value: '$0', change: '0%', icon: 'money' },
        { label: 'Paid Invoices', value: '0', change: '0%', icon: 'invoice' },
        { label: 'Budget Utilization', value: '0%', change: '0%', icon: 'chart' }
      ],
      revenueTrends: [],
      pendingPayments: [],
      recentTransactions: [],
      expenseSummary: [],
      quickActions: [
        { label: 'Collect Fees', icon: 'dollar', link: '/fees/collect' },
        { label: 'View Invoices', icon: 'invoice', link: '/invoices' },
        { label: 'Expenses', icon: 'money', link: '/expenses' },
        { label: 'Reports', icon: 'chart', link: '/reports' }
      ]
    }
  },
  'hr_manager': {
    success: true,
    data: {
      welcomeMessage: 'Welcome Back, HR Manager',
      lastUpdated: new Date().toLocaleDateString(),
      topStats: [
        { label: 'Total Employees', value: '0', change: '0', icon: 'users' },
        { label: 'Open Positions', value: '0', change: '0', icon: 'briefcase' },
        { label: 'Leave Requests', value: '0', change: '0', icon: 'calendar' },
        { label: 'Training Completion', value: '0%', change: '0%', icon: 'book' }
      ],
      employeeDistribution: [],
      upcomingReviews: [],
      leaveRequests: [],
      recentHires: [],
      quickActions: [
        { label: 'Manage Staff', icon: 'users', link: '/hrm/staffs' },
        { label: 'Approve Leaves', icon: 'check', link: '/hrm/approve-request' },
        { label: 'Payroll', icon: 'dollar', link: '/hrm/payroll' },
        { label: 'Reports', icon: 'chart', link: '/reports' }
      ]
    }
  },
  'librarian': {
    success: true,
    data: {
      welcomeMessage: 'Welcome Back, Librarian',
      lastUpdated: new Date().toLocaleDateString(),
      topStats: [
        { label: 'Total Books', value: '0', change: '0', icon: 'book' },
        { label: 'Books Borrowed', value: '0', change: '0', icon: 'borrow' },
        { label: 'Overdue Returns', value: '0', change: '0', icon: 'alert' },
        { label: 'Active Members', value: '0', change: '0%', icon: 'users' }
      ],
      borrowingTrends: [],
      popularBooks: [],
      overdueList: [],
      recentActivities: [],
      quickActions: [
        { label: 'Issue Book', icon: 'plus', link: '/library/issue-book' },
        { label: 'Return Book', icon: 'return', link: '/library/return' },
        { label: 'Add Book', icon: 'book', link: '/library/books/add' },
        { label: 'Reports', icon: 'chart', link: '/library/report' }
      ]
    }
  },
  'transport_manager': {
    success: true,
    data: {
      welcomeMessage: 'Welcome Back, Transport Manager',
      lastUpdated: new Date().toLocaleDateString(),
      topStats: [
        { label: 'Active Vehicles', value: '0', change: '0', icon: 'bus' },
        { label: 'Daily Routes', value: '0', change: '0', icon: 'route' },
        { label: 'Passengers Today', value: '0', change: '0%', icon: 'users' },
        { label: 'Fuel Efficiency', value: '0 km/l', change: '0%', icon: 'fuel' }
      ],
      routeUtilization: [],
      vehicleStatus: [],
      maintenanceSchedule: [],
      recentActivities: [],
      quickActions: [
        { label: 'Manage Routes', icon: 'route', link: '/transport/routes' },
        { label: 'Vehicle Status', icon: 'bus', link: '/transport/vehicle' },
        { label: 'Assign Vehicle', icon: 'assign', link: '/transport/assign-vehicle' },
        { label: 'Reports', icon: 'chart', link: '/transport/report' }
      ]
    }
  },
  'hostel_warden': {
    success: true,
    data: {
      welcomeMessage: 'Welcome Back, Hostel Warden',
      lastUpdated: new Date().toLocaleDateString(),
      topStats: [
        { label: 'Total Rooms', value: '0', change: '0', icon: 'home' },
        { label: 'Occupied Rooms', value: '0', change: '0', icon: 'users' },
        { label: 'Occupancy Rate', value: '0%', change: '0%', icon: 'chart' },
        { label: 'Maintenance Requests', value: '0', change: '0', icon: 'tool' }
      ],
      monthlyOccupancy: [],
      roomStatus: [],
      maintenanceRequests: [],
      recentActivities: [],
      quickActions: [
        { label: 'Manage Rooms', icon: 'home', link: '/hostel/rooms' },
        { label: 'Room Types', icon: 'list', link: '/hostel/room-types' },
        { label: 'Hostel List', icon: 'building', link: '/hostel/list' },
        { label: 'Reports', icon: 'chart', link: '/hostel/report' }
      ]
    }
  }
}

/**
 * Setup mock API interceptor for demo mode
 * Only intercepts requests when in demo mode
 */
export function setupMockApiInterceptor(axiosInstance: AxiosInstance) {
  // Request interceptor - handle mock requests in demo mode before they go to network
  axiosInstance.interceptors.request.use(
    (request) => {
      // If not in demo mode, let request proceed to backend
      if (!isDemoMode()) {
        return request
      }

      // DEMO MODE: Check if we should mock this request
      const url = request.url || ''
      
      // Mock dashboard stats requests
      if (url.includes('/schools/dashboard/stats')) {
        // Create a mock response that will be returned directly
        request.adapter = () => Promise.resolve({
          data: {
            success: true,
            data: {
              totalSchools: 0,
              activeSchools: 0,
              totalStudents: 0,
              totalTeachers: 0,
              monthlyRevenue: 0,
              revenueGrowth: 0
            },
            message: 'Demo mode - no data in database'
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: request
        })
      }
      
      // Mock analytics subscriptions requests
      if (url.includes('/schools/analytics/subscriptions')) {
        request.adapter = () => Promise.resolve({
          data: {
            success: true,
            data: [],
            meta: {
              pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false
              }
            },
            message: 'Demo mode - no data in database'
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: request
        })
      }
      
      // Mock transactions stats requests
      if (url.includes('/transactions/stats')) {
        request.adapter = () => Promise.resolve({
          data: {
            success: true,
            data: {
              totalTransactions: 0,
              monthlyVolume: 0,
              successRate: 100
            },
            message: 'Demo mode - no transaction data'
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: request
        })
      }
      
      // Mock membership plans requests
      if (url.includes('/membership-plans')) {
        request.adapter = () => Promise.resolve({
          data: {
            success: true,
            data: {
              plans: [],
              meta: {
                pagination: {
                  page: 1,
                  limit: 10,
                  total: 0,
                  totalPages: 0,
                  hasNextPage: false,
                  hasPrevPage: false
                }
              }
            },
            message: 'Demo mode - no membership plans in database'
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: request
        })
      }

      // Mock membership addons requests
      if (url.includes('/membership-addons')) {
        request.adapter = () => Promise.resolve({
          data: {
            success: true,
            data: [],
            message: 'Demo mode - no membership addons in database'
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: request
        })
      }
      
      // Mock any other common API calls to prevent connection errors
      if (url.includes('/schools/') || url.includes('/transactions/') || url.includes('/analytics/') || url.includes('/notifications') || url.includes('/staff') || url.includes('/students') || url.includes('/teachers') || url.includes('/fees') || url.includes('/attendance') || url.includes('/exams') || url.includes('/library') || url.includes('/reports') || url.includes('/dashboard') || url.includes('/users') || url.includes('/departments') || url.includes('/subjects') || url.includes('/classes') || url.includes('/charts/') || url.includes('/metrics/') || url.includes('/statistics/') || url.includes('/membership-plans') || url.includes('/membership-addons')) {
        request.adapter = () => Promise.resolve({
          data: {
            success: true,
            data: [],
            meta: {
              pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false
              }
            },
            message: 'Demo mode - no data in database'
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: request
        })
      }

      return request
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor - return mock data ONLY in demo mode
  axiosInstance.interceptors.response.use(
    (response) => {
      // If not in demo mode, return actual response from backend
      if (!isDemoMode()) {
        return response
      }

      // DEMO MODE: Return mock data
      const url = response.config.url || ''
      // Suppress verbose logging - only log important events
      // // console.log('[MockAPI] Demo mode - Intercepting request:', url)
      
      // Dashboard endpoints
      if (url.includes('/dashboard/')) {
        const dashboardType = url.split('/dashboard/')[1].split('?')[0] // Remove query params
        const mockData = mockDashboardData[dashboardType as keyof typeof mockDashboardData]
        
        if (mockData) {
          // // console.log('[MockAPI] Returning empty/zero mock data for dashboard:', dashboardType)
          return {
            ...response,
            data: mockData
          }
        }
      }

      // Events endpoint
      if (url.includes('/events')) {
        // // console.log('[MockAPI] Returning empty events array')
        return {
          ...response,
          data: {
            success: true,
            data: [], // Empty array for events
            message: 'No events in database'
          }
        }
      }

      // Notices endpoint
      if (url.includes('/notices')) {
        // console.log('[MockAPI] Returning empty notices array')
        return {
          ...response,
          data: {
            success: true,
            data: [], // Empty array for notices
            message: 'No notices in database'
          }
        }
      }

      // Students endpoint
      if (url.includes('/students')) {
        // console.log('[MockAPI] Returning empty students array')
        return {
          ...response,
          data: {
            success: true,
            data: [], // Empty array for students
            meta: {
              pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false
              }
            },
            message: 'No students in database'
          }
        }
      }

      // Teachers endpoint
      if (url.includes('/teachers')) {
        // console.log('[MockAPI] Returning empty teachers array')
        return {
          ...response,
          data: {
            success: true,
            data: [], // Empty array for teachers
            meta: {
              pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false
              }
            },
            message: 'No teachers in database'
          }
        }
      }

      // Classes endpoint
      if (url.includes('/classes')) {
        // console.log('[MockAPI] Returning empty classes array')
        return {
          ...response,
          data: {
            success: true,
            data: [], // Empty array for classes
            message: 'No classes in database'
          }
        }
      }

      // Attendance endpoint
      if (url.includes('/attendance')) {
        // console.log('[MockAPI] Returning empty attendance array')
        return {
          ...response,
          data: {
            success: true,
            data: [], // Empty array for attendance
            message: 'No attendance records in database'
          }
        }
      }

      // Fees endpoint
      if (url.includes('/fees')) {
        // console.log('[MockAPI] Returning empty fees array')
        return {
          ...response,
          data: {
            success: true,
            data: [], // Empty array for fees
            message: 'No fee records in database'
          }
        }
      }

      // Library endpoint
      if (url.includes('/library')) {
        // console.log('[MockAPI] Returning empty library array')
        return {
          ...response,
          data: {
            success: true,
            data: [], // Empty array for library
            message: 'No library records in database'
          }
        }
      }

      // Transport endpoint
      if (url.includes('/transport')) {
        // console.log('[MockAPI] Returning empty transport array')
        return {
          ...response,
          data: {
            success: true,
            data: [], // Empty array for transport
            message: 'No transport records in database'
          }
        }
      }

      // Hostel endpoint
      if (url.includes('/hostel')) {
        // console.log('[MockAPI] Returning empty hostel array')
        return {
          ...response,
          data: {
            success: true,
            data: [], // Empty array for hostel
            message: 'No hostel records in database'
          }
        }
      }

      // Exams endpoint
      if (url.includes('/exam')) {
        // console.log('[MockAPI] Returning empty exams array')
        return {
          ...response,
          data: {
            success: true,
            data: [], // Empty array for exams
            message: 'No exam records in database'
          }
        }
      }

      // HRM endpoints
      if (url.includes('/hrm') || url.includes('/staff') || url.includes('/payroll')) {
        // console.log('[MockAPI] Returning empty HRM array')
        return {
          ...response,
          data: {
            success: true,
            data: [], // Empty array for HRM
            message: 'No HRM records in database'
          }
        }
      }

      // Notifications endpoint
      if (url.includes('/notification')) {
        // console.log('[MockAPI] Returning empty notifications array')
        return {
          ...response,
          data: {
            success: true,
            data: [], // Empty array for notifications
            message: 'No notifications in database'
          }
        }
      }

      // Settings endpoints
      if (url.includes('/settings') || url.includes('/school-settings')) {
        // console.log('[MockAPI] Returning empty settings object')
        return {
          ...response,
          data: {
            success: true,
            data: {
              _id: '507f1f77bcf86cd799439011',
              institutionId: '507f1f77bcf86cd799439011',
              basicInfo: {
                schoolName: '',
                address: '',
                phone: '',
                email: ''
              },
              academicSettings: {
                academicYear: '2024/2025',
                sessionStartDate: '',
                sessionEndDate: '',
                weekendDays: ['Sunday'],
                workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                classStartTime: '08:00',
                classEndTime: '15:00',
                periodDuration: 45,
                breakDuration: 15
              },
              examSettings: {
                passingPercentage: 40,
                gradingSystem: 'percentage',
                maxMarks: 100
              },
              attendanceSettings: {
                minimumAttendance: 75,
                lateArrivalTime: 15,
                halfDayThreshold: 4
              },
              feeSettings: {
                currency: 'USD',
                lateFeePercentage: 5,
                lateFeeGracePeriod: 7
              },
              notificationSettings: {
                enableEmailNotifications: true,
                enableSMSNotifications: false,
                enablePushNotifications: true
              },
              status: 'active'
            },
            message: 'Default settings - no custom settings in database'
          }
        }
      }

      // Results endpoint
      if (url.includes('/results')) {
        // console.log('[MockAPI] Returning empty results array')
        return {
          ...response,
          data: {
            success: true,
            data: [],
            meta: {
              pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false
              }
            },
            message: 'No results in database'
          }
        }
      }

      // Grades endpoint
      if (url.includes('/grades')) {
        // console.log('[MockAPI] Returning empty grades array')
        return {
          ...response,
          data: {
            success: true,
            data: [],
            meta: {
              pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false
              }
            },
            message: 'No grades in database'
          }
        }
      }

      // Exam schedules endpoint
      if (url.includes('/exam-schedule')) {
        // console.log('[MockAPI] Returning empty exam schedules array')
        return {
          ...response,
          data: {
            success: true,
            data: [],
            meta: {
              pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false
              }
            },
            message: 'No exam schedules in database'
          }
        }
      }

      // Profile endpoint
      if (url.includes('/profile')) {
        // console.log('[MockAPI] Returning empty profile object')
        return {
          ...response,
          data: {
            success: true,
            data: {
              name: 'Demo User',
              email: 'demo@example.com',
              role: 'superadmin',
              avatar: '',
              phone: '',
              address: ''
            },
            message: 'Demo profile'
          }
        }
      }

      // Transactions/Revenue endpoints
      if (url.includes('/transactions') || url.includes('/revenue')) {
        // console.log('[MockAPI] Returning empty transactions/revenue data')
        return {
          ...response,
          data: {
            success: true,
            data: {
              total: 0,
              revenue: 0,
              transactions: [],
              stats: {
                totalRevenue: 0,
                totalTransactions: 0,
                averageTransaction: 0
              }
            },
            message: 'No transaction data in database'
          }
        }
      }

      // Schools endpoint
      if (url.includes('/schools')) {
        return {
          ...response,
          data: {
            success: true,
            data: {
              stats: {
                totalSchools: 0,
                activeSchools: 0,
                totalStudents: 0,
                totalTeachers: 0
              },
              schools: [],
              analytics: {
                subscriptions: [],
                revenue: []
              }
            },
            message: 'No schools in database'
          }
        }
      }

      // Analytics endpoint
      if (url.includes('/analytics')) {
        return {
          ...response,
          data: {
            success: true,
            data: {},
            message: 'No analytics data in database'
          }
        }
      }

      // Membership plans endpoint
      if (url.includes('/membership-plans')) {
        return {
          ...response,
          data: {
            success: true,
            data: {
              plans: [],
              meta: {
                pagination: {
                  page: 1,
                  limit: 10,
                  total: 0,
                  totalPages: 0,
                  hasNextPage: false,
                  hasPrevPage: false
                }
              }
            },
            message: 'No membership plans in database'
          }
        }
      }

      // Membership addons endpoint
      if (url.includes('/membership-addons')) {
        return {
          ...response,
          data: {
            success: true,
            data: [],
            message: 'No membership addons in database'
          }
        }
      }

      // Default mock response for any other endpoint in demo mode
      // console.log('[MockAPI] Returning default empty mock response for:', url)
      return {
        ...response,
        data: {
          success: true,
          data: [], // Default to empty array
          message: 'Demo mode - no data in database'
        }
      }
    },
    (error) => {
      // If in demo mode and request fails, return empty mock data instead of error
      if (isDemoMode()) {
        const url = error.config?.url || ''
        // console.log('[MockAPI] Request failed in demo mode, returning empty mock data for:', url)
        
        // Check if it's a dashboard endpoint
        if (url.includes('/dashboard/')) {
          const dashboardType = url.split('/dashboard/')[1].split('?')[0]
          const mockData = mockDashboardData[dashboardType as keyof typeof mockDashboardData]
          
          if (mockData) {
            return Promise.resolve({
              data: mockData,
              status: 200,
              statusText: 'OK',
              headers: {},
              config: error.config
            })
          }
        }

        // School settings endpoint
        if (url.includes('/school-settings')) {
          return Promise.resolve({
            data: {
              success: true,
              data: {
                _id: '507f1f77bcf86cd799439011',
                institutionId: '507f1f77bcf86cd799439011',
                basicInfo: {
                  schoolName: '',
                  address: '',
                  phone: '',
                  email: ''
                },
                academicSettings: {
                  academicYear: '2024/2025',
                  sessionStartDate: '',
                  sessionEndDate: '',
                  weekendDays: ['Sunday'],
                  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                  classStartTime: '08:00',
                  classEndTime: '15:00',
                  periodDuration: 45,
                  breakDuration: 15
                },
                examSettings: {
                  passingPercentage: 40,
                  gradingSystem: 'percentage',
                  maxMarks: 100
                },
                attendanceSettings: {
                  minimumAttendance: 75,
                  lateArrivalTime: 15,
                  halfDayThreshold: 4
                },
                feeSettings: {
                  currency: 'USD',
                  lateFeePercentage: 5,
                  lateFeeGracePeriod: 7
                },
                notificationSettings: {
                  enableEmailNotifications: true,
                  enableSMSNotifications: false,
                  enablePushNotifications: true
                },
                status: 'active'
              },
              message: 'Default settings'
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: error.config
          })
        }

        // Exams endpoint
        if (url.includes('/exam')) {
          return Promise.resolve({
            data: {
              success: true,
              data: [],
              meta: {
                pagination: {
                  page: 1,
                  limit: 10,
                  total: 0,
                  totalPages: 0,
                  hasNextPage: false,
                  hasPrevPage: false
                }
              },
              message: 'No exams in database'
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: error.config
          })
        }

        // Grades endpoint
        if (url.includes('/grades')) {
          return Promise.resolve({
            data: {
              success: true,
              data: [],
              meta: {
                pagination: {
                  page: 1,
                  limit: 10,
                  total: 0,
                  totalPages: 0,
                  hasNextPage: false,
                  hasPrevPage: false
                }
              },
              message: 'No grades in database'
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: error.config
          })
        }
        
        // Schools dashboard stats endpoint
        if (url.includes('/schools/dashboard/stats')) {
          return Promise.resolve({
            data: {
              success: true,
              data: {
                totalSchools: 0,
                activeSchools: 0,
                totalStudents: 0,
                totalTeachers: 0,
                monthlyRevenue: 0,
                revenueGrowth: 0
              },
              message: 'Demo mode - no data in database'
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: error.config
          })
        }
        
        // Schools analytics subscriptions endpoint
        if (url.includes('/schools/analytics/subscriptions')) {
          return Promise.resolve({
            data: {
              success: true,
              data: [],
              meta: {
                pagination: {
                  page: 1,
                  limit: 10,
                  total: 0,
                  totalPages: 0,
                  hasNextPage: false,
                  hasPrevPage: false
                }
              },
              message: 'Demo mode - no data in database'
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: error.config
          })
        }
        
        // Transactions stats endpoint
        if (url.includes('/transactions/stats')) {
          return Promise.resolve({
            data: {
              success: true,
              data: {
                totalTransactions: 0,
                totalRevenue: 0,
                monthlyRevenue: 0,
                pendingTransactions: 0,
                completedTransactions: 0
              },
              message: 'Demo mode - no data in database'
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: error.config
          })
        }
        
        // Transactions analytics revenue endpoint
        if (url.includes('/transactions/analytics/revenue')) {
          return Promise.resolve({
            data: {
              success: true,
              data: [],
              meta: {
                pagination: {
                  page: 1,
                  limit: 10,
                  total: 0,
                  totalPages: 0,
                  hasNextPage: false,
                  hasPrevPage: false
                }
              },
              message: 'Demo mode - no data in database'
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: error.config
          })
        }
        
        // Return empty array for list endpoints with pagination
        return Promise.resolve({
          data: {
            success: true,
            data: [],
            meta: {
              pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false
              }
            },
            message: 'Demo mode - no data in database'
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: error.config
        })
      }
      
      // Not in demo mode, return actual error
      return Promise.reject(error)
    }
  )
}

