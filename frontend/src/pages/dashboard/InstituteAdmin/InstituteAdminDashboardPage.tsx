/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { toast } from 'react-toastify'
import { apiClient } from '../../../api/client'

const InstituteAdminDashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview')
  const [alertVisible, setAlertVisible] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.get('/dashboard/institute-admin')
      
      if (response.data.success && response.data.data) {
        setDashboardData(response.data.data)
        toast.success('Institute Admin Dashboard loaded successfully')
      }
    } catch (err: any) {
      console.error('Error fetching institute admin dashboard:', err)
      setError(err.message || 'Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        <i className="ti ti-alert-circle me-2" />
        {error}
        <button className="btn btn-sm btn-danger ms-3" onClick={fetchDashboardData}>
          <i className="ti ti-refresh me-1" />Retry
        </button>
      </div>
    )
  }

  // Transform backend data for UI - using empty arrays/objects as fallbacks
  const welcomeMessage = dashboardData?.welcomeMessage || 'Welcome Back, Admin'
  const lastUpdated = dashboardData?.lastUpdated || new Date().toLocaleDateString()
  const recentAlert = dashboardData?.recentAlert || null
  const topStats = dashboardData?.topStats || []
  const schoolsOverview = dashboardData?.schoolsOverview || []
  const performanceMetrics = dashboardData?.performanceMetrics || []
  const financialSummary = dashboardData?.financialSummary || []
  const attendanceTrend = dashboardData?.attendanceTrend || []
  const enrollmentTrend = dashboardData?.enrollmentTrend || []
  const schoolsList = dashboardData?.schoolsList || []
  const recentActivities = dashboardData?.recentActivities || []
  const alerts = dashboardData?.alerts || []
  const quickActions = dashboardData?.quickActions || []

  const C = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'] // Colors for charts

  const navSections = [
    { id: 'overview',    label: 'Overview',    icon: 'ti ti-layout-dashboard' },
    { id: 'schools',     label: 'Schools',     icon: 'ti ti-building'         },
    { id: 'performance', label: 'Performance', icon: 'ti ti-chart-line'       },
    { id: 'finance',     label: 'Finance',     icon: 'ti ti-currency-dollar'  },
    { id: 'reports',     label: 'Reports',     icon: 'ti ti-report'           },
  ]

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Institute Admin Dashboard</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Institute Admin</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
          {quickActions.map((action: any) => (
            <Link key={action.label} to={action.to} className={`btn ${action.bg} text-white d-flex align-items-center`} style={{ fontSize: 13 }}>
              <i className={`${action.icon} me-1`} />{action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── ALERT + WELCOME BANNER ── */}
      <div className="row">
        <div className="col-md-12">
          {alertVisible && recentAlert && (
            <div className="alert-message">
              <div className={`alert alert-${recentAlert.type} rounded-pill d-flex align-items-center justify-content-between border-${recentAlert.type} mb-4`} role="alert">
                <div className="d-flex align-items-center">
                  <span className="me-2 avatar avatar-sm flex-shrink-0">
                    <img src={recentAlert.avatar || '/assets/img/profiles/avatar-27.webp'} alt="profile" className="img-fluid rounded-circle" />
                  </span>
                  <p className="mb-0" dangerouslySetInnerHTML={{ __html: recentAlert.message }} />
                </div>
                <button type="button" className="btn-close p-0" onClick={() => setAlertVisible(false)} aria-label="Close">
                  <span><i className="ti ti-x" /></span>
                </button>
              </div>
            </div>
          )}
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
                    <h1 className="text-white me-2">{welcomeMessage}</h1>
                    <Link to="/profile" className="avatar avatar-sm img-rounded bg-gray-800 dark-hover">
                      <i className="ti ti-edit text-white" />
                    </Link>
                  </div>
                  <p className="text-white mb-0">Have a good day at work</p>
                </div>
                <p className="text-white mb-0"><i className="ti ti-refresh me-1" />Updated recently on {lastUpdated}</p>
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
                {navSections.map((s: any) => (
                  <li key={s.id} className="nav-item">
                    <a
                      href="#"
                      className={`nav-link d-flex align-items-center ${activeSection === s.id ? 'active bg-primary text-white' : 'text-dark'}`}
                      style={{ fontSize: 13, padding: '6px 14px', borderRadius: 8 }}
                      onClick={e => { e.preventDefault(); setActiveSection(s.id) }}
                    >
                      <i className={`${s.icon} me-1`} />{s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ① OVERVIEW SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'overview' && (
        <>
          {/* Top Statistics Cards */}
          <div className="row">
            {topStats.map((stat: any) => (
              <div key={stat.label} className="col-xxl-3 col-xl-4 col-sm-6 d-flex">
                <div className="card flex-fill animate-card border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className={`avatar avatar-xl ${stat.avatarTone} me-2 p-1 flex-shrink-0`}>
                        <img src={stat.icon} alt="img" />
                      </div>
                      <div className="overflow-hidden flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                          <h4 className="counter mb-0">{stat.value}</h4>
                          <span className={`badge ${stat.deltaTone}`} style={{ fontSize: 10 }}>{stat.delta}</span>
                        </div>
                        <p className="mb-0" style={{ fontSize: 12 }}>{stat.label}</p>
                        <small className="text-muted">{stat.sub}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Schools Overview + Performance Metrics */}
          <div className="row mt-2">
            <div className="col-xxl-8 col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Schools Overview</h4>
                  <div className="dropdown">
                    <a href="#" className="bg-white dropdown-toggle" data-bs-toggle="dropdown"><i className="ti ti-calendar me-1" />This Year</a>
                    <ul className="dropdown-menu mt-2 p-3">
                      {['This Year','Last Year','Last 6 Months'].map((o: any) => <li key={o}><a href="#" className="dropdown-item rounded-1">{o}</a></li>)}
                    </ul>
                  </div>
                </div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={schoolsOverview}>
                      <XAxis dataKey="school" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="students" name="Students" fill="#6366f1" radius={[6,6,0,0]} />
                      <Bar dataKey="teachers" name="Teachers" fill="#10b981" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xxl-4 col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Performance Metrics</h4></div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={performanceMetrics} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" label>
                        {performanceMetrics.map((_: any, i: number) => <Cell key={i} fill={C[i % C.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: any, n: any) => [`${v}%`, n]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Trend + Enrollment Trend */}
          <div className="row">
            <div className="col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Attendance Trend</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={attendanceTrend}>
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0,100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}%`} />
                      <Tooltip formatter={(v: any, n: any) => [`${v}%`, n]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Enrollment Trend</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={enrollmentTrend}>
                      <defs>
                        <linearGradient id="colorEnrollment" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Area type="monotone" dataKey="enrollment" name="Enrollment" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEnrollment)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="row">
            <div className="col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Recent Activities</h4>
                  <Link to="/activities" className="fw-medium">View All</Link>
                </div>
                <div className="card-body">
                  {recentActivities.map((activity: any, i: number) => (
                    <div key={i} className={`d-flex align-items-start ${i < recentActivities.length - 1 ? 'mb-3' : 'mb-0'}`}>
                      <span className={`avatar avatar-sm flex-shrink-0 me-2 ${activity.bg} rounded-circle`}>
                        <i className={`${activity.icon} fs-14`} />
                      </span>
                      <div className="overflow-hidden flex-fill">
                        <p className="mb-0 text-truncate" style={{ fontSize: 13 }}>{activity.message}</p>
                        <small className="text-muted">{activity.time}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">System Alerts</h4>
                  <span className="badge bg-danger">{alerts.length} Active</span>
                </div>
                <div className="card-body">
                  {alerts.map((alert: any, i: number) => (
                    <div key={i} className={`alert alert-${alert.type} d-flex align-items-start ${i < alerts.length - 1 ? 'mb-3' : 'mb-0'}`} role="alert">
                      <i className={`${alert.icon} fs-18 me-2 flex-shrink-0 mt-1`} />
                      <div className="flex-fill">
                        <div className="fw-semibold mb-1">{alert.title}</div>
                        <div style={{ fontSize: 12 }}>{alert.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ② SCHOOLS SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'schools' && (
        <>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Schools List</h4>
                  <Link to="/schools/add" className="btn btn-sm btn-primary"><i className="ti ti-plus me-1" />Add School</Link>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead>
                        <tr>
                          <th>School Name</th>
                          <th>Location</th>
                          <th>Students</th>
                          <th>Teachers</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schoolsList.map((school: any, i: number) => (
                          <tr key={i}>
                            <td className="fw-semibold">{school.name}</td>
                            <td>{school.location}</td>
                            <td><span className="badge badge-soft-primary">{school.students}</span></td>
                            <td><span className="badge badge-soft-success">{school.teachers}</span></td>
                            <td><span className={`badge ${school.statusClass}`}>{school.status}</span></td>
                            <td>
                              <div className="d-flex gap-1">
                                <Link to={`/schools/${school.id}`} className="btn btn-sm btn-primary px-2 py-1">View</Link>
                                <Link to={`/schools/${school.id}/edit`} className="btn btn-sm btn-light px-2 py-1"><i className="ti ti-edit" /></Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ③ PERFORMANCE SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'performance' && (
        <div className="row">
          <div className="col-md-12">
            <div className="alert alert-info">
              <i className="ti ti-info-circle me-2" />
              Performance section data will be displayed here from backend
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ④ FINANCE SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'finance' && (
        <>
          <div className="row">
            {financialSummary.map((item: any) => (
              <div key={item.label} className="col-xl-3 col-sm-6 d-flex">
                <div className="card flex-fill animate-card border-0">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h2 className="mb-0">{item.value}</h2>
                      <p className="mb-0">{item.label}</p>
                      <small className="text-muted">{item.sub}</small>
                    </div>
                    <div className={`avatar avatar-xl ${item.tone} rounded d-flex align-items-center justify-content-center flex-shrink-0`}>
                      <i className={`${item.icon} fs-24 text-white`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ⑤ REPORTS SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'reports' && (
        <div className="row">
          <div className="col-md-12">
            <div className="alert alert-info">
              <i className="ti ti-info-circle me-2" />
              Reports section data will be displayed here from backend
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default InstituteAdminDashboardPage
