// Mock data for dashboards when backend is disabled

export const MOCK_DASHBOARD_DATA: Record<string, any> = {
  superadmin: {
    institutions: 278,
    activeRegions: 12,
    platformUptime: '98.6%',
    totalUsers: 15420,
    activeSessions: 2341,
    monthlyRevenue: 125000,
    recentActivities: [
      { id: 1, type: 'institution_added', message: 'New institution registered', time: '2 hours ago' },
      { id: 2, type: 'payment_received', message: 'Payment received from ABC School', time: '3 hours ago' },
      { id: 3, type: 'user_registered', message: '50 new users registered', time: '5 hours ago' }
    ]
  },
  institution_admin: {
    totalStudents: 2450,
    totalTeachers: 180,
    attendanceRate: 92,
    monthlyRevenue: 45000,
    pendingFees: 8500,
    activeClasses: 45,
    upcomingEvents: 8
  },
  school_admin: {
    totalStudents: 850,
    totalTeachers: 45,
    attendanceRate: 94,
    pendingFees: 12500,
    activeClasses: 28,
    upcomingExams: 5
  },
  principal: {
    studentAttendance: 96,
    teacherPerformance: 4.2,
    academicExcellence: 88,
    announcements: 11,
    upcomingEvents: 6
  },
  teacher: {
    myStudents: 32,
    classesToday: 4,
    pendingAssignments: 8,
    averageGrade: 'B+',
    todaySchedule: [
      { time: '9:00 AM', subject: 'Mathematics', class: 'Grade 10-A' },
      { time: '10:30 AM', subject: 'Physics', class: 'Grade 11-B' },
      { time: '1:00 PM', subject: 'Chemistry', class: 'Grade 12-A' },
      { time: '2:30 PM', subject: 'Mathematics', class: 'Grade 10-B' }
    ]
  },
  student: {
    currentGPA: 3.7,
    attendanceRate: 98,
    completedAssignments: 24,
    totalAssignments: 28,
    upcomingExams: 3,
    todayClasses: [
      { time: '9:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith' },
      { time: '10:30 AM', subject: 'English', teacher: 'Ms. Johnson' },
      { time: '1:00 PM', subject: 'Science', teacher: 'Dr. Brown' }
    ]
  },
  parent: {
    children: 2,
    averageGrades: 'A-',
    attendanceRate: 97,
    outstandingFees: 250,
    upcomingEvents: 4
  },
  accountant: {
    monthlyRevenue: 45000,
    outstandingFees: 8500,
    paidInvoices: 156,
    budgetUtilization: 78,
    recentTransactions: [
      { id: 1, type: 'Fee Payment', amount: 500, date: 'Today' },
      { id: 2, type: 'Salary', amount: -15000, date: 'Yesterday' },
      { id: 3, type: 'Fee Payment', amount: 750, date: '2 days ago' }
    ]
  },
  hr_manager: {
    totalEmployees: 89,
    openPositions: 5,
    leaveRequests: 12,
    trainingCompletion: 94,
    upcomingReviews: 8
  },
  librarian: {
    totalBooks: 12450,
    booksBorrowed: 234,
    overdueReturns: 18,
    activeMembers: 892,
    popularBooks: [
      { title: 'To Kill a Mockingbird', borrowed: 45 },
      { title: '1984', borrowed: 38 },
      { title: 'The Great Gatsby', borrowed: 32 }
    ]
  },
  transport_manager: {
    activeVehicles: 15,
    dailyRoutes: 28,
    passengersToday: 456,
    fuelEfficiency: '12.5 km/l',
    vehicleStatus: [
      { vehicle: 'Bus 01', status: 'Active', route: 'Route A' },
      { vehicle: 'Bus 02', status: 'Active', route: 'Route B' },
      { vehicle: 'Bus 03', status: 'Maintenance', route: '-' }
    ]
  },
  hostel_warden: {
    totalRooms: 120,
    occupiedRooms: 98,
    occupancyRate: 82,
    maintenanceRequests: 7,
    upcomingInspections: 3
  },
  staff_member: {
    tasksCompleted: 28,
    attendanceRate: 96,
    pendingTasks: 5,
    leaveBalance: '12 days',
    upcomingEvents: 4
  }
}

export const getMockDashboardData = (role: string) => {
  const normalizedRole = role.toLowerCase().replace(/-/g, '_')
  return MOCK_DASHBOARD_DATA[normalizedRole] || MOCK_DASHBOARD_DATA.institution_admin
}
