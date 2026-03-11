import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, AreaChart, Area,
} from 'recharts'
import apiClient from '../../api/client'
import TopStatCard from '../../components/dashboard/TopStatCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

// Chart colors
const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

const SuperAdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  // Header controls state
  const [recentInstitutions, setRecentInstitutions] = useState<any[]>([])
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [userCredentials, setUserCredentials] = useState<any[]>([])

  // Dashboard data state
  const [dashboardStats, setDashboardStats] = useState<any>(null)

  // Fetch dashboard statistics
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [
        statsRes,
        institutionsRes,
        transactionsRes,
        credentialsRes
      ] = await Promise.all([
        apiClient.get('/schools/dashboard/stats'),
        apiClient.get('/schools', { params: { limit: 10, sort: '-createdAt' } }),
        apiClient.get('/transactions', { params: { limit: 10, sort: '-createdAt' } }),
        apiClient.get('/admin/credentials')
      ])

      setDashboardStats(statsRes.data)
      setRecentInstitutions((institutionsRes.data as any)?.schools || [])
      setRecentTransactions((transactionsRes.data as any)?.transactions || [])
      setUserCredentials(credentialsRes.data?.credentials || [])
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err)
      setError(err.response?.data?.message || 'Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [selectedMonth])

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <LoadingSpinner />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="alert alert-danger m-4">
        <h4>Error Loading Dashboard</h4>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchDashboardData}>
          <i className="ti ti-refresh me-2" />Retry
        </button>
      </div>
    )
  }

  // Extract data with safe defaults
  const stats = dashboardStats || {}
  const totalInstitutions = stats.totalSchools || 0
  const activeInstitutions = stats.activeSchools || 0
  const totalStudents = stats.totalStudents || 0
  const totalTeachers = stats.totalTeachers || 0
  const totalStaff = stats.totalStaff || 0
  const totalParents = stats.totalParents || 0
  const monthlyRevenue = stats.monthlyRevenue || 0
  const yearlyRevenue = stats.yearlyRevenue || 0

  // Institution types
  const schoolsCount = stats.schoolsByType?.School || 0
  const interCollegesCount = stats.schoolsByType?.['Inter College'] || 0
  const degreeCollegesCount = stats.schoolsByType?.['Degree College'] || 0

  // Subscription data (mock data for now)
  const subAnalytics = { planDistribution: { Basic: 0, Medium: 0, Premium: 0 }, subscriptionStatus: { Active: 0, Suspended: 0, Expired: 0 }, newRegistrations: { Schools: 0, InterColleges: 0, DegreeColleges: 0 } }
  const planDistribution = subAnalytics.planDistribution || { Basic: 0, Medium: 0, Premium: 0 }
  const subscriptionStatus = subAnalytics.subscriptionStatus || { Active: 0, Suspended: 0, Expired: 0 }
  const newRegistrations = subAnalytics.newRegistrations || { Schools: 0, InterColleges: 0, DegreeColleges: 0 }

  // Transaction data
  const txStats = recentTransactions || {}
  const totalTransactions = txStats.length || 0
  const completedTransactions = txStats.filter((t: any) => t.status === 'success').length || 0
  const failedTransactions = txStats.filter((t: any) => t.status === 'failed').length || 0

  // Revenue data for charts (mock data for now - updated)
  const revenueData: any[] = []

  // Top stats for cards
  const topStats = [
    {
      label: 'Total Institutions',
      value: totalInstitutions.toString(),
      delta: '+12%',
      deltaTone: 'bg-danger',
      icon: '/assets/img/icons/institution.svg',
      active: activeInstitutions.toString(),
      inactive: (totalInstitutions - activeInstitutions).toString(),
      avatarTone: 'bg-danger-transparent'
    },
    {
      label: 'Monthly Revenue',
      value: `$${monthlyRevenue.toLocaleString()}`,
      delta: '+8%',
      deltaTone: 'bg-skyblue',
      icon: '/assets/img/icons/revenue.svg',
      active: `$${monthlyRevenue.toLocaleString()}`,
      inactive: `$${yearlyRevenue.toLocaleString()}`,
      avatarTone: 'bg-secondary-transparent'
    },
    {
      label: 'Total Users',
      value: (totalStudents + totalTeachers + totalStaff + totalParents).toLocaleString(),
      delta: '+15%',
      deltaTone: 'bg-warning',
      icon: '/assets/img/icons/students.svg',
      active: totalStudents.toString(),
      inactive: (totalTeachers + totalStaff + totalParents).toString(),
      avatarTone: 'bg-warning-transparent'
    },
    {
      label: 'Active Plans',
      value: (subscriptionStatus.Active || 0).toString(),
      delta: '+5%',
      deltaTone: 'bg-success',
      icon: '/assets/img/icons/subject.svg',
      active: (subscriptionStatus.Active || 0).toString(),
      inactive: ((subscriptionStatus.Suspended || 0) + (subscriptionStatus.Expired || 0)).toString(),
      avatarTone: 'bg-success-transparent'
    },
  ]

  // Calculate expiring subscriptions

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Super Admin Dashboard</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Super Admin</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
          <Link to="/super-admin/create-credentials" className="btn btn-primary text-white d-flex align-items-center" style={{ fontSize: 13 }}>
            <i className="ti ti-user-plus me-1" />Create Credentials
          </Link>
          <Link to="/super-admin/institutions" className="btn btn-success text-white d-flex align-items-center" style={{ fontSize: 13 }}>
            <i className="ti ti-building me-1" />Manage Institutions
          </Link>
          <Link to="/super-admin/analytics" className="btn btn-info text-white d-flex align-items-center" style={{ fontSize: 13 }}>
            <i className="ti ti-chart-line me-1" />Analytics
          </Link>
        </div>
      </div>

      {/* WELCOME BANNER */}
      <div className="row">
        <div className="col-md-12">
          <div className="card bg-dark mb-4">
            <div className="overlay-img">
              <img src="/assets/img/bg/shape-04.webp" alt="shape" className="img-fluid shape-01" />
              <img src="/assets/img/bg/shape-01.webp" alt="shape" className="img-fluid shape-02" />
              <img src="/assets/img/bg/shape-02.webp" alt="shape" className="img-fluid shape-03" />
              <img src="/assets/img/bg/shape-03.webp" alt="shape" className="img-fluid shape-04" />
            </div>
            <div className="card-body">
              <div className="d-flex align-items-xl-center justify-content-xl-between flex-xl-row flex-column">
                <div className="mb-3 mb-xl-0">
                  <div className="d-flex align-items-center flex-wrap mb-2">
                    <h1 className="text-white me-2">Welcome Back, Super Admin</h1>
                    <Link to="/profile" className="avatar avatar-sm img-rounded bg-gray-800 dark-hover">
                      <i className="ti ti-edit text-white" />
                    </Link>
                  </div>
                  <p className="text-white mb-0">Platform Overview – {totalInstitutions} Institutions Managed</p>
                </div>
                <p className="text-white mb-0">
                  <i className="ti ti-refresh me-1" />Updated recently on {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION NAV TABS ── */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-2">
              <ul className="nav nav-pills flex-wrap gap-1">
                {[
                  { id: 'overview', label: 'Overview', icon: 'ti ti-layout-dashboard' },
                  { id: 'institutions', label: 'Institutions', icon: 'ti ti-building' },
                  { id: 'users', label: 'Users', icon: 'ti ti-users' },
                  { id: 'analytics', label: 'Analytics', icon: 'ti ti-chart-line' },
                  { id: 'revenue', label: 'Revenue', icon: 'ti ti-currency-dollar' }
                ].map(section => (
                  <li key={section.id} className="nav-item">
                    <a
                      href="#"
                      className="nav-link d-flex align-items-center active bg-primary text-white"
                      style={{ fontSize: 13, padding: '6px 14px', borderRadius: 8 }}
                      onClick={e => e.preventDefault()}
                    >
                      <i className={`${section.icon} me-1`} />{section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* TOP STAT CARDS */}
      <div className="row">
        {topStats.map(stat => <TopStatCard key={stat.label} {...stat} />)}
      </div>

      {/* INSTITUTION TYPE BREAKDOWN */}
      <div className="row mt-4">
        {[
          { label: 'Schools', count: schoolsCount, icon: 'ti ti-school', bg: 'bg-primary-transparent', iconBg: 'bg-primary', color: 'text-primary' },
          { label: 'Inter Colleges', count: interCollegesCount, icon: 'ti ti-building', bg: 'bg-warning-transparent', iconBg: 'bg-warning', color: 'text-warning' },
          { label: 'Degree Colleges', count: degreeCollegesCount, icon: 'ti ti-award', bg: 'bg-info-transparent', iconBg: 'bg-info', color: 'text-info' }
        ].map(row => {
          const active = recentInstitutions.filter((s: any) => s.type === row.label && s.status === 'active').length
          const total = recentInstitutions.filter((s: any) => s.type === row.label).length
          const students = recentInstitutions.filter((s: any) => s.type === row.label).reduce((sum: number, s: any) => sum + (s.totalStudents || 0), 0)
          return (
            <div key={row.label} className="col-xl-4 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <span className={`avatar avatar-lg ${row.bg} rounded me-2`}>
                        <i className={`${row.icon} fs-20`} />
                      </span>
                      <div>
                        <h4 className="mb-0">{row.count}</h4>
                        <p className="mb-0">Total {row.label}</p>
                      </div>
                    </div>
                    <span className={`avatar avatar-md ${row.iconBg} rounded-circle`}>
                      <i className={`${row.icon} text-white fs-18`} />
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between border-top pt-3">
                    <div className="text-center">
                      <h6 className="text-success mb-1">{active}</h6>
                      <small className="text-muted">Active</small>
                    </div>
                    <div className="text-center">
                      <h6 className="text-danger mb-1">{total - active}</h6>
                      <small className="text-muted">Inactive</small>
                    </div>
                    <div className="text-center">
                      <h6 className={`${row.color} mb-1`}>{students.toLocaleString()}</h6>
                      <small className="text-muted">Students</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* USER CREDENTIALS MANAGEMENT */}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h4 className="card-title"><i className="ti ti-users me-2 text-primary" />User Credentials Management</h4>
              <button className="btn btn-primary btn-sm" onClick={() => window.location.href = '/super-admin/create-credentials'}>
                <i className="ti ti-plus me-1" />Create New Credentials
              </button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Institution</th>
                      <th>Status</th>
                      <th>Login Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userCredentials.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center text-muted py-4">
                          <i className="ti ti-users-off me-2" />
                          No user credentials created yet
                        </td>
                      </tr>
                    ) : (
                      userCredentials.map((cred: any) => (
                        <tr key={cred.userId}>
                          <td>
                            <code className="text-muted">{cred.userId}</code>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar avatar-sm bg-primary-transparent rounded-circle me-2">
                                <span className="text-primary fw-semibold">
                                  {cred.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                </span>
                              </div>
                              {cred.fullName}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">
                              <i className="ti ti-mail me-1" />
                              {cred.email}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${
                              cred.role === 'institution_admin' ? 'bg-success' :
                              cred.role === 'school_admin' ? 'bg-info' :
                              cred.role === 'teacher' ? 'bg-warning' :
                              'bg-secondary'
                            }`}>
                              {cred.role.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <div>
                              <div className="fw-semibold">{cred.instituteType}</div>
                              <small className="text-muted">{cred.instituteCode}</small>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${
                              cred.status === 'active' ? 'bg-success' : 'bg-danger'
                            }`}>
                              {cred.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            {cred.hasLoggedIn ? (
                              <span className="badge bg-success">
                                <i className="ti ti-check me-1" />
                                Logged In
                              </span>
                            ) : (
                              <span className="badge bg-warning">
                                <i className="ti ti-clock me-1" />
                                Never Logged In
                              </span>
                            )}
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(cred.createdAt).toLocaleDateString()}
                            </small>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-primary btn-sm" title="View Details">
                                <i className="ti ti-eye" />
                              </button>
                              <button className="btn btn-outline-secondary btn-sm" title="Edit">
                                <i className="ti ti-edit" />
                              </button>
                              <button className="btn btn-outline-danger btn-sm" title="Delete">
                                <i className="ti ti-trash" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {userCredentials.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <small className="text-muted">
                    Showing {userCredentials.length} user credentials
                  </small>
                  <div>
                    <span className="badge bg-success me-2">
                      {userCredentials.filter((c: any) => c.hasLoggedIn).length} Active Users
                    </span>
                    <span className="badge bg-warning">
                      {userCredentials.filter((c: any) => !c.hasLoggedIn).length} Pending First Login
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        {/* User Demographics */}
        <div className="col-xxl-8 col-xl-7 d-flex">
          <div className="card flex-fill">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h4 className="card-title">User Demographics</h4>
              <Link to="/super-admin/users" className="fw-medium">View All</Link>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {[
                  { label: 'Students', value: totalStudents.toLocaleString(), icon: 'ti ti-school', bg: 'bg-primary-transparent', bar: 'bg-primary', pct: 65 },
                  { label: 'Teachers', value: totalTeachers.toLocaleString(), icon: 'ti ti-chalkboard', bg: 'bg-success-transparent', bar: 'bg-success', pct: 25 },
                  { label: 'Staff', value: totalStaff.toLocaleString(), icon: 'ti ti-briefcase', bg: 'bg-warning-transparent', bar: 'bg-warning', pct: 10 },
                  { label: 'Parents', value: totalParents.toLocaleString(), icon: 'ti ti-users', bg: 'bg-info-transparent', bar: 'bg-info', pct: 45 }
                ].map(u => (
                  <div key={u.label} className="col-md-3 col-6">
                    <div className="border rounded p-3 text-center">
                      <span className={`avatar avatar-md ${u.bg} rounded-circle mb-2 d-block mx-auto`}>
                        <i className={`${u.icon} fs-18`} />
                      </span>
                      <h4 className="fw-bold mb-1">{u.value}</h4>
                      <p className="text-muted mb-2" style={{ fontSize: 12 }}>{u.label}</p>
                      <div className="progress progress-xs">
                        <div className={`progress-bar ${u.bar} rounded`} style={{ width: `${u.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* USER ROLE PIE CHART */}
              <div className="border-top mt-3 pt-3">
                <h5 className="mb-2">Platform User Distribution</h5>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Students', value: totalStudents },
                        { name: 'Parents', value: totalParents },
                        { name: 'Teachers', value: totalTeachers },
                        { name: 'Staff', value: totalStaff }
                      ]}
                      cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={3} dataKey="value"
                    >
                      {[0, 1, 2, 3].map(i => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={v => [(v || 0).toLocaleString(), '']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="col-xxl-4 col-xl-5 d-flex flex-column">
          <div className="card flex-fill">
            <div className="card-header">
              <h4 className="card-title">Platform Stats</h4>
            </div>
            <div className="card-body">
              {[
                { label: 'Total Institutions', value: totalInstitutions, icon: 'ti ti-building', bg: 'bg-primary-transparent', color: 'text-primary' },
                { label: 'Active Subscriptions', value: subscriptionStatus.Active, icon: 'ti ti-check-circle', bg: 'bg-success-transparent', color: 'text-success' },
                { label: 'Total Transactions', value: totalTransactions, icon: 'ti ti-credit-card', bg: 'bg-info-transparent', color: 'text-info' },
                { label: 'Monthly Revenue', value: `$${monthlyRevenue.toLocaleString()}`, icon: 'ti ti-coin', bg: 'bg-warning-transparent', color: 'text-warning' }
              ].map((stat, i, arr) => (
                <div key={stat.label} className={`d-flex align-items-center justify-content-between ${i < arr.length - 1 ? 'mb-3' : ''}`}>
                  <div className="d-flex align-items-center">
                    <span className={`avatar avatar-md ${stat.bg} rounded me-3`}>
                      <i className={`${stat.icon} fs-16`} />
                    </span>
                    <p className="mb-0">{stat.label}</p>
                  </div>
                  <h5 className={`mb-0 ${stat.color}`}>{stat.value}</h5>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* REVENUE & REGISTRATIONS CHART */}
      <div className="row mt-4">
        <div className="col-xxl-8 col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h4 className="card-title">Revenue Trends</h4>
            </div>
            <div className="card-body pb-0">
              {revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => [`$${(v || 0).toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="revenue" name="Revenue" stroke={COLORS[0]} strokeWidth={2.5} dot={{ fill: COLORS[0], r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">No revenue data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Platform Earnings */}
        <div className="col-xxl-4 col-xl-6 d-flex flex-column">
          <div className="card mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div>
                  <h6 className="mb-1">Platform Earnings</h6>
                  <h2>${monthlyRevenue.toLocaleString()}</h2>
                </div>
                <span className="avatar avatar-lg bg-primary rounded-circle">
                  <i className="ti ti-coin fs-20" />
                </span>
              </div>
              {revenueData.length > 0 && (
                <ResponsiveContainer width="100%" height={70}>
                  <AreaChart data={revenueData.slice(-6)}>
                    <defs>
                      <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="revenue" stroke={COLORS[0]} strokeWidth={2} fill="url(#earnGrad)" dot={false} />
                    <Tooltip formatter={v => [`$${(v || 0).toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Financial Snapshot */}
          <div className="card flex-fill">
            <div className="card-header"><h4 className="card-title">Financial Snapshot</h4></div>
            <div className="card-body pb-1">
              {[
                { label: 'Yearly Revenue', value: `$${yearlyRevenue.toLocaleString()}`, badge: 'badge-soft-success', delta: '+8%' },
                { label: 'Monthly Revenue', value: `$${monthlyRevenue.toLocaleString()}`, badge: 'badge-soft-primary', delta: '+5%' },
                { label: 'Completed Transactions', value: completedTransactions, badge: 'badge-soft-success', delta: 'Success' },
                { label: 'Failed Payments', value: failedTransactions, badge: 'badge-soft-danger', delta: failedTransactions > 0 ? 'Fix Now' : 'None' }
              ].map((f, i, arr) => (
                <div key={f.label} className={`d-flex align-items-center justify-content-between py-2 ${i < arr.length - 1 ? 'border-bottom' : ''}`}>
                  <p className="mb-0" style={{ fontSize: 12 }}>{f.label}</p>
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="mb-0">{f.value}</h6>
                    <span className={`badge ${f.badge}`}>{f.delta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* SUBSCRIPTION ANALYTICS */}
      <div className="row mt-4">
        {/* Subscription Status */}
        <div className="col-xxl-4 col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="card-title mb-3">Subscription Status</h4>
              <div className="mb-3">
                <select 
                  className="form-select form-select-sm" 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const date = new Date()
                    date.setMonth(date.getMonth() - i)
                    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                    const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                    return <option key={value} value={value}>{label}</option>
                  })}
                </select>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-2 mb-3">
                {[
                  { label: 'Active', value: subscriptionStatus.Active, bg: 'bg-success-transparent', color: 'text-success' },
                  { label: 'Suspended', value: subscriptionStatus.Suspended, bg: 'bg-warning-transparent', color: 'text-warning' },
                  { label: 'Expired', value: subscriptionStatus.Expired, bg: 'bg-danger-transparent', color: 'text-danger' }
                ].map(s => (
                  <div key={s.label} className="col-4 text-center">
                    <div className={`${s.bg} rounded p-2`}>
                      <h5 className={`${s.color} mb-0`}>{s.value}</h5>
                      <small className="text-muted">{s.label}</small>
                    </div>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie 
                    data={[
                      { name: 'Active', value: subscriptionStatus.Active },
                      { name: 'Suspended', value: subscriptionStatus.Suspended },
                      { name: 'Expired', value: subscriptionStatus.Expired }
                    ]} 
                    cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value"
                  >
                    {[0, 1, 2].map(i => <Cell key={i} fill={[COLORS[1], COLORS[2], COLORS[3]][i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="col-xxl-4 col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h4 className="card-title">Plan Distribution</h4>
            </div>
            <div className="card-body">
              <div className="row g-2 mb-3">
                {[
                  { label: 'Basic', value: planDistribution.Basic, bg: 'bg-info-transparent', color: 'text-info' },
                  { label: 'Medium', value: planDistribution.Medium, bg: 'bg-warning-transparent', color: 'text-warning' },
                  { label: 'Premium', value: planDistribution.Premium, bg: 'bg-success-transparent', color: 'text-success' }
                ].map(p => (
                  <div key={p.label} className="col-4 text-center">
                    <div className={`${p.bg} rounded p-2`}>
                      <h5 className={`${p.color} mb-0`}>{p.value}</h5>
                      <small className="text-muted">{p.label}</small>
                    </div>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie 
                    data={[
                      { name: 'Basic', value: planDistribution.Basic },
                      { name: 'Medium', value: planDistribution.Medium },
                      { name: 'Premium', value: planDistribution.Premium }
                    ]} 
                    cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value"
                  >
                    {[0, 1, 2].map(i => <Cell key={i} fill={[COLORS[4], COLORS[2], COLORS[1]][i]} />)}
                  </Pie>
                  <Tooltip formatter={v => [`${v || 0} institutions`, '']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* New Institution Signups */}
        <div className="col-xxl-4 col-xl-12 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h4 className="card-title mb-1">New Institution Signups</h4>
              <div className="d-flex gap-2">
                <span className="badge bg-success">{newRegistrations.Schools + newRegistrations.InterColleges + newRegistrations.DegreeColleges} this month</span>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-2 mb-3">
                {[
                  { label: 'Schools', value: newRegistrations.Schools, bg: 'bg-primary-transparent', color: 'text-primary' },
                  { label: 'Inter Colleges', value: newRegistrations.InterColleges, bg: 'bg-warning-transparent', color: 'text-warning' },
                  { label: 'Degree Colleges', value: newRegistrations.DegreeColleges, bg: 'bg-info-transparent', color: 'text-info' }
                ].map(r => (
                  <div key={r.label} className="col-4 text-center">
                    <div className={`${r.bg} rounded p-2`}>
                      <h5 className={`${r.color} mb-0`}>{r.value}</h5>
                      <small className="text-muted" style={{ fontSize: 10 }}>{r.label}</small>
                    </div>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart 
                  data={[
                    { name: 'Schools', value: newRegistrations.Schools },
                    { name: 'Inter Colleges', value: newRegistrations.InterColleges },
                    { name: 'Degree Colleges', value: newRegistrations.DegreeColleges }
                  ]} 
                  barSize={32}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                  <Bar dataKey="value" name="New Signups" radius={[6, 6, 0, 0]}>
                    {[0, 1, 2].map(i => <Cell key={i} fill={[COLORS[0], COLORS[2], COLORS[4]][i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SuperAdminDashboard
