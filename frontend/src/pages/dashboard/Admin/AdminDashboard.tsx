/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { apiClient } from '../../../api/client'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview')
  const [activeAttTab, setActiveAttTab] = useState('students')
  const [leaveModal, setLeaveModal] = useState<any>(null)
  const [feeReminderSent, setFeeReminderSent] = useState(false)
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
      
      const response = await apiClient.get('/dashboard/admin')
      
      if (response.data.success && response.data.data) {
        setDashboardData(response.data.data)
        toast.success('Dashboard data loaded successfully')
      }
    } catch (err: any) {
      console.error('Error fetching dashboard:', err)
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
  const quickActions = dashboardData?.quickActions || []
  const dailyStats = dashboardData?.dailyStats || []
  const attTrend = dashboardData?.attendanceTrend || []
  const recentNotifications = dashboardData?.recentNotifications || []
  const presentAbsent = dashboardData?.presentAbsent || []
  const leaveRequests = dashboardData?.leaveRequests || []
  const admissionCards = dashboardData?.admissionCards || []
  const classStrength = dashboardData?.classStrength || []
  const admissionTrend = dashboardData?.admissionTrend || []
  const sectionStrength = dashboardData?.sectionStrength || []
  const newApplications = dashboardData?.newApplications || []
  const feeCards = dashboardData?.feeCards || []
  const paymentModePie = dashboardData?.paymentModes || []
  const C = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'] // Colors for charts
  const pendingByClass = dashboardData?.pendingByClass || []
  const overdueStudents = dashboardData?.overdueStudents || []
  const absentStudents = dashboardData?.absentStudents || []
  const frequentAbsentees = dashboardData?.frequentAbsentees || []
  const staffCards = dashboardData?.staffCards || []
  const staffAlerts = dashboardData?.staffAlerts || []
  const resultStatus = dashboardData?.resultStatus || []
  const todaySchedule = dashboardData?.todaySchedule || []
  const upcomingExams = dashboardData?.upcomingExams || []
  const busRoutes = dashboardData?.busRoutes || []
  const maintRequests = dashboardData?.maintRequests || []
  const complaintTickets = dashboardData?.complaintTickets || []
  const notifAlerts = dashboardData?.notifAlerts || []

  const navSections = [
    { id: 'overview',    label: 'Overview',    icon: 'ti ti-layout-dashboard' },
    { id: 'admissions',  label: 'Admissions',  icon: 'ti ti-file-plus'        },
    { id: 'fees',        label: 'Fees',        icon: 'ti ti-currency-dollar'  },
    { id: 'attendance',  label: 'Attendance',  icon: 'ti ti-calendar-check'   },
    { id: 'staff',       label: 'Staff',       icon: 'ti ti-users'            },
    { id: 'exams',       label: 'Exams',       icon: 'ti ti-exam'             },
    { id: 'transport',   label: 'Transport',   icon: 'ti ti-bus'              },
    { id: 'alerts',      label: 'Alerts',      icon: 'ti ti-bell'             },
  ]

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">School Admin Dashboard</h3>
          <nav><ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Admin</li>
          </ol></nav>
        </div>
        {/* Quick Action Buttons */}
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
          {quickActions.map((q: any) => (
            <Link key={q.label} to={q.to} className={`btn ${q.bg} text-white d-flex align-items-center`} style={{ fontSize: 13 }}>
              <i className={`${q.icon} me-1`} />{q.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── SECTION NAV TABS ── */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-2">
              <ul className="nav nav-pills flex-wrap gap-1">
                {navSections.map(s => (
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

      {activeSection === 'overview' && (
        <>
          {/* Daily Summary Cards */}
          <div className="row">
            {dailyStats.map((stat: any) => (
              <div key={stat.label} className="col-xxl-2 col-xl-4 col-sm-6 d-flex">
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

          {/* Today's Attendance Trend + Notifications */}
          <div className="row mt-2">
            <div className="col-xxl-8 col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Monthly Attendance Trend</h4>
                  <div className="dropdown">
                    <a href="#" className="bg-white dropdown-toggle" data-bs-toggle="dropdown"><i className="ti ti-calendar me-1" />This Year</a>
                    <ul className="dropdown-menu mt-2 p-3">
                      {['This Year','Last Year','Last 6 Months'].map(o => <li key={o}><a href="#" className="dropdown-item rounded-1">{o}</a></li>)}
                    </ul>
                  </div>
                </div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={attTrend}>
                      <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[80,100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                      <Tooltip formatter={(v,n) => [`${v}%`,n]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="students" name="Students" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1' }} />
                      <Line type="monotone" dataKey="staff"    name="Staff"    stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xxl-4 col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Recent Activity</h4>
                  <Link to="/notifications" className="fw-medium">View All</Link>
                </div>
                <div className="card-body">
                  {recentNotifications.map((n: any, i: number) => (
                    <div key={i} className={`d-flex align-items-start ${i < recentNotifications.length - 1 ? 'mb-3' : 'mb-0'}`}>
                      <span className={`avatar avatar-sm flex-shrink-0 me-2 ${n.bg} rounded-circle`}>
                        <i className={`${n.icon} fs-14`} />
                      </span>
                      <div className="overflow-hidden flex-fill">
                        <p className="mb-0 text-truncate" style={{ fontSize: 13 }}>{n.msg}</p>
                        <small className="text-muted">{n.time}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Today's Present vs Absent + Quick Leave Requests */}
          <div className="row">
            <div className="col-xl-8 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">This Week – Present vs Absent</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={presentAbsent} barSize={28} barGap={4}>
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="present" name="Present" fill="#6366f1" radius={[6,6,0,0]} />
                      <Bar dataKey="absent"  name="Absent"  fill="#ef4444" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-4 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Leave Requests Today</h4>
                  <span className="badge bg-warning">{leaveRequests.length} Pending</span>
                </div>
                <div className="card-body">
                  {leaveRequests.map((lr: any, i: number) => (
                    <div key={i} className={`border rounded p-3 ${i < leaveRequests.length - 1 ? 'mb-3' : 'mb-0'}`}>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center overflow-hidden">
                          <span className="avatar avatar-sm flex-shrink-0 me-2"><img src={lr.avatar} alt="p" className="rounded-circle" /></span>
                          <div className="overflow-hidden">
                            <h6 className="mb-0 text-truncate" style={{ fontSize: 13 }}>{lr.name}</h6>
                            <small className="text-muted">{lr.role}</small>
                          </div>
                        </div>
                        <span className={`badge ${lr.cls2}`}>{lr.type}</span>
                      </div>
                      <p className="mb-2 text-muted" style={{ fontSize: 12 }}>Dates: <strong>{lr.days}</strong></p>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-success flex-fill" onClick={() => setLeaveModal(lr)}>✓ Approve</button>
                        <button className="btn btn-sm btn-danger flex-fill">✗ Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeSection === 'admissions' && (
        <>
          <div className="row mb-3">
            {admissionCards.map((c: any) => (
              <div key={c.label} className="col-xl-3 col-sm-6 d-flex">
                <div className="card flex-fill animate-card border-0">
                  <div className="card-body d-flex align-items-center">
                    <div className={`avatar avatar-xl ${c.tone.replace('bg-','bg-').replace('-transparent','')} rounded me-3 d-flex align-items-center justify-content-center flex-shrink-0`}>
                      <i className={`${c.icon} fs-24 text-white`} />
                    </div>
                    <div>
                      <h2 className="mb-0">{c.value}</h2>
                      <p className="mb-0">{c.label}</p>
                      <small className="text-muted">{c.sub}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Class-wise Bar + Trend Line */}
          <div className="row">
            <div className="col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Class-wise Student Strength</h4>
                  <Link to="/admissions" className="btn btn-sm btn-primary">View All</Link>
                </div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={classStrength} barSize={28} barGap={4}>
                      <XAxis dataKey="cls" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="students"  name="Students"  fill="#6366f1" radius={[6,6,0,0]} />
                      <Bar dataKey="capacity"  name="Capacity"  fill="#e0e7ff" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Monthly Admission Trend</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={admissionTrend}>
                      <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Line type="monotone" dataKey="v" name="Admissions" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Section-wise + New Applications table */}
          <div className="row">
            <div className="col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Section-wise Strength</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={sectionStrength} layout="vertical" barSize={18}>
                      <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="section" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={50} />
                      <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Bar dataKey="count" name="Students" fill="#6366f1" radius={[0,6,6,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">New Applications</h4>
                  <Link to="/admissions/new" className="btn btn-sm btn-primary"><i className="ti ti-plus me-1" />Add New</Link>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead>
                        <tr><th>Name</th><th>Class</th><th>Date</th><th>Status</th><th>Action</th></tr>
                      </thead>
                      <tbody>
                        {newApplications.map((a: any, i: number) => (
                          <tr key={i}>
                            <td>{a.name}</td>
                            <td>{a.cls}</td>
                            <td><small className="text-muted">{a.date}</small></td>
                            <td><span className={`badge ${a.cls2}`}>{a.status}</span></td>
                            <td>
                              <div className="d-flex gap-1">
                                <button className="btn btn-sm btn-success px-2 py-1">✓</button>
                                <button className="btn btn-sm btn-danger px-2 py-1">✗</button>
                                <Link to="/admissions/detail" className="btn btn-sm btn-light px-2 py-1">View</Link>
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

     {activeSection === 'fees' && (
        <>
          <div className="row mb-3">
            {feeCards.map((c: any) => (
              <div key={c.label} className="col-xl-3 col-sm-6 d-flex">
                <div className="card flex-fill animate-card border-0">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h2 className="mb-0">{c.value}</h2>
                      <p className="mb-0">{c.label}</p>
                    </div>
                    <div className={`avatar avatar-xl ${c.tone} rounded d-flex align-items-center justify-content-center flex-shrink-0`}>
                      <i className={`${c.icon} fs-24 text-white`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Mode Pie + Pending by Class Bar */}
          <div className="row">
            <div className="col-xl-4 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Payment Mode Breakdown</h4></div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={paymentModePie} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                        {paymentModePie.map((_: any, i: number) => <Cell key={i} fill={C[i]} />)}
                      </Pie>
                      <Tooltip formatter={(v,n) => [`${v}%`,n]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="row g-2 mt-2">
                    {paymentModePie.map((p: any, i: number) => (
                      <div key={p.name} className="col-4 text-center">
                        <div className="border rounded p-2">
                          <div className="fw-semibold" style={{ color: C[i] }}>{p.value}%</div>
                          <small className="text-muted">{p.name}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-8 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Pending Fees by Class</h4>
                  <button
                    className={`btn btn-sm ${feeReminderSent ? 'btn-success' : 'btn-primary'}`}
                    onClick={() => setFeeReminderSent(true)}
                  >
                    <i className={`ti ${feeReminderSent ? 'ti-check' : 'ti-send'} me-1`} />
                    {feeReminderSent ? 'Reminders Sent!' : 'Send Fee Reminder'}
                  </button>
                </div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={pendingByClass} barSize={28}>
                      <XAxis dataKey="cls" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v || 0)/1000}k`} />
                      <Tooltip formatter={(v) => [`$${(v || 0).toLocaleString()}`,'Pending']} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Bar dataKey="pending" name="Pending Fees" fill="#ef4444" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Overdue Students List */}
          <div className="row">
            <div className="col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Overdue Students (60+ Days)</h4>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-warning"><i className="ti ti-send me-1" />Bulk Reminder</button>
                    <Link to="/fees/overdue" className="btn btn-sm btn-light">View All</Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead>
                        <tr><th>Student</th><th>Class</th><th>Amount</th><th>Overdue Since</th><th>Action</th></tr>
                      </thead>
                      <tbody>
                        {overdueStudents.map((s: any, i: number) => (
                          <tr key={i}>
                            <td>{s.name}</td>
                            <td>{s.cls}</td>
                            <td className="text-danger fw-semibold">{s.amount}</td>
                            <td><span className={`badge ${s.cls2}`}>{s.days}</span></td>
                            <td>
                              <div className="d-flex gap-1">
                                <button className="btn btn-sm btn-warning px-2 py-1"><i className="ti ti-send" /></button>
                                <Link to="/fees/collect" className="btn btn-sm btn-success px-2 py-1">Collect</Link>
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

     {activeSection === 'attendance' && (
        <>
          {/* Tab: Students / Staff */}
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="list-tab">
                <ul className="nav">
                  {['students','staff'].map(t => (
                    <li key={t}>
                      <a href="#" className={activeAttTab === t ? 'active' : ''} onClick={e => { e.preventDefault(); setActiveAttTab(t) }}>
                        {t === 'students' ? 'Student Attendance' : 'Staff Attendance'}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Summary mini-cards */}
          <div className="row mb-3">
            {(activeAttTab === 'students'
              ? [['Present Today','3,442','bg-success-transparent','bg-success'],['Absent Today','212','bg-danger-transparent','bg-danger'],['Late Arrivals','28','bg-warning-transparent','bg-warning'],['Overall %','94.2%','bg-primary-transparent','bg-primary']]
              : [['Present Today','430','bg-success-transparent','bg-success'],['Absent Today','16','bg-danger-transparent','bg-danger'],['On Leave','7','bg-warning-transparent','bg-warning'],['Attendance %','96.4%','bg-primary-transparent','bg-primary']]
            ).map(([lbl,val,bg]) => (
              <div key={lbl} className="col-xl-3 col-sm-6 d-flex">
                <div className={`card flex-fill animate-card border-0`}>
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h2 className="mb-0">{val}</h2>
                      <p className="mb-0">{lbl}</p>
                    </div>
                    <div className={`avatar avatar-xl ${bg} rounded d-flex align-items-center justify-content-center`}>
                      <i className={`ti ti-calendar-check fs-24`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trend + Stacked Bar */}
          <div className="row">
            <div className="col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Monthly Attendance Trend</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={attTrend}>
                      <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[80,100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} />
                      <Tooltip formatter={(v,n)=>[`${v}%`,n]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey={activeAttTab === 'students' ? 'students' : 'staff'} name={activeAttTab === 'students' ? 'Students' : 'Staff'} stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">This Week – Present vs Absent</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={presentAbsent} barSize={22} barGap={4}>
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="present" name="Present" fill="#6366f1" stackId="a" radius={[0,0,0,0]} />
                      <Bar dataKey="absent"  name="Absent"  fill="#ef4444" stackId="a" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Absent list + Frequent Absentees */}
          <div className="row">
            <div className="col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Today's Absent Students</h4>
                  <Link to="/attendance/absent" className="btn btn-sm btn-light">View All</Link>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>Name</th><th>Class</th><th>Consecutive Days</th><th>Action</th></tr></thead>
                      <tbody>
                        {absentStudents.map((s: any, i: number) => (
                          <tr key={i}>
                            <td>{s.name}</td>
                            <td>{s.cls}</td>
                            <td><span className={`badge ${s.cls2}`}>{s.days} days</span></td>
                            <td><button className="btn btn-sm btn-light px-2 py-1"><i className="ti ti-send" /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Frequent Absentees</h4>
                  <span className="badge bg-danger">{frequentAbsentees.length} At Risk</span>
                </div>
                <div className="card-body">
                  <ul className="list-group">
                    {frequentAbsentees.map((s: any, i: number) => (
                      <li key={i} className="list-group-item">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <div>
                            <span className="fw-semibold" style={{ fontSize: 13 }}>{s.name}</span>
                            <small className="text-muted ms-2">{s.cls}</small>
                          </div>
                          <span className="text-danger fw-semibold" style={{ fontSize: 13 }}>{s.count} absences</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress progress-xs flex-fill">
                            <div className={`progress-bar ${s.bar} rounded`} style={{ width: s.pct }} />
                          </div>
                          <small className="text-muted">{s.pct} present</small>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeSection === 'staff' && (
        <>
          <div className="row mb-3">
            {staffCards.map((c: any) => (
              <div key={c.label} className="col-xl-3 col-sm-6 d-flex">
                <div className="card flex-fill animate-card border-0">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h2 className="mb-0">{c.value}</h2>
                      <p className="mb-0">{c.label}</p>
                      <small className="text-muted">{c.sub}</small>
                    </div>
                    <div className={`avatar avatar-xl ${c.tone} rounded d-flex align-items-center justify-content-center flex-shrink-0`}>
                      <i className={`${c.icon} fs-24 text-white`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Leave Requests + Alerts */}
          <div className="row">
            <div className="col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Leave Requests Pending</h4>
                  <div className="d-flex gap-2">
                    <Link to="/staff/add" className="btn btn-sm btn-primary"><i className="ti ti-user-plus me-1" />Add Staff</Link>
                    <Link to="/staff/assign" className="btn btn-sm btn-info text-white"><i className="ti ti-school me-1" />Assign Teacher</Link>
                  </div>
                </div>
                <div className="card-body">
                  {leaveRequests.map((lr: any, i: number) => (
                    <div key={i} className={`card shadow-sm ${i < leaveRequests.length - 1 ? 'mb-3' : 'mb-0'}`}>
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="d-flex align-items-center overflow-hidden me-2">
                            <span className="avatar avatar-md flex-shrink-0 me-2"><img src={lr.avatar} alt="p" /></span>
                            <div className="overflow-hidden">
                              <h6 className="mb-0 text-truncate">{lr.name} <span className={`badge ${lr.cls2} ms-1`}>{lr.type}</span></h6>
                              <small className="text-muted">{lr.role}</small>
                            </div>
                          </div>
                          <small className="text-muted fw-semibold">{lr.days}</small>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-success flex-fill">✓ Approve Leave</button>
                          <button className="btn btn-sm btn-danger flex-fill">✗ Reject</button>
                          <button className="btn btn-sm btn-light flex-fill">View Details</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Staff Performance Alerts</h4>
                  <span className="badge bg-danger">{staffAlerts.length} Alerts</span>
                </div>
                <div className="card-body">
                  {staffAlerts.map((a: any, i: number) => (
                    <div key={i} className={`alert alert-${a.type} d-flex align-items-start ${i < staffAlerts.length - 1 ? 'mb-3' : 'mb-0'}`} role="alert">
                      <i className={`${a.icon} fs-18 me-2 flex-shrink-0 mt-1`} />
                      <div className="flex-fill">
                        <div className="fw-semibold">{a.title}</div>
                        <div style={{ fontSize: 12 }}>{a.desc}</div>
                      </div>
                    </div>
                  ))}
                  <div className="border-top pt-3 mt-3">
                    <h6 className="mb-3">Quick Actions</h6>
                    <div className="d-flex flex-wrap gap-2">
                      <Link to="/staff/add"    className="btn btn-sm btn-primary"><i className="ti ti-user-plus me-1" />Add Staff</Link>
                      <Link to="/staff/assign" className="btn btn-sm btn-success"><i className="ti ti-school me-1" />Assign Class Teacher</Link>
                      <Link to="/staff/leave"  className="btn btn-sm btn-warning"><i className="ti ti-calendar-x me-1" />Manage Leaves</Link>
                      <Link to="/staff/report" className="btn btn-sm btn-info text-white"><i className="ti ti-report me-1" />Staff Report</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeSection === 'exams' && (
        <>
          {/* Result / Hall Ticket Status */}
          <div className="row mb-3">
            {resultStatus.map((r: any) => (
              <div key={r.label} className="col-xl-4 col-sm-6 d-flex">
                <div className="card flex-fill animate-card border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="mb-0 fw-semibold">{r.label}</p>
                      <h4 className="mb-0">{r.value}</h4>
                    </div>
                    <div className="progress progress-xs">
                      <div className={`progress-bar ${r.bar} rounded`} style={{ width: r.pct }} />
                    </div>
                    <small className="text-muted">{r.pct} complete</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row">
            {/* Today's Schedule */}
            <div className="col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Today's Schedule – Class VIII-A</h4>
                  <div className="dropdown">
                    <a href="#" className="bg-white dropdown-toggle" data-bs-toggle="dropdown"><i className="ti ti-school-bell me-1" />VIII-A</a>
                    <ul className="dropdown-menu mt-2 p-3">
                      {['VIII-A','VIII-B','IX-A','X-A','X-B'].map((c: any) => <li key={c}><a href="#" className="dropdown-item rounded-1">{c}</a></li>)}
                    </ul>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>Time</th><th>Subject</th><th>Teacher</th><th>Room</th></tr></thead>
                      <tbody>
                        {todaySchedule.map((s: any, i: number) => (
                          <tr key={i}>
                            <td><small className="text-muted">{s.time}</small></td>
                            <td><span className="badge badge-soft-primary">{s.subject}</span></td>
                            <td>{s.teacher}</td>
                            <td><small>{s.room}</small></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Exams */}
            <div className="col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Upcoming Exams</h4>
                  <div className="d-flex gap-2">
                    <Link to="/exams/create" className="btn btn-sm btn-primary"><i className="ti ti-plus me-1" />Create</Link>
                    <Link to="/exams/hall-tickets" className="btn btn-sm btn-warning"><i className="ti ti-ticket me-1" />Hall Tickets</Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>Exam</th><th>Date</th><th>Classes</th><th>Status</th><th>Action</th></tr></thead>
                      <tbody>
                        {upcomingExams.map((e: any, i: number) => (
                          <tr key={i}>
                            <td className="fw-semibold">{e.exam}</td>
                            <td><small className="text-muted">{e.date}</small></td>
                            <td><small>{e.classes}</small></td>
                            <td><span className={`badge ${e.cls2}`}>{e.status}</span></td>
                            <td><Link to="/exams/detail" className="btn btn-sm btn-light px-2 py-1">Manage</Link></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="border-top pt-3 mt-3">
                    <h6 className="mb-2">Quick Actions</h6>
                    <div className="d-flex flex-wrap gap-2">
                      <Link to="/exams/result/publish" className="btn btn-sm btn-success"><i className="ti ti-upload me-1" />Publish Results</Link>
                      <Link to="/exams/hall-tickets"   className="btn btn-sm btn-warning"><i className="ti ti-ticket me-1" />Generate Hall Tickets</Link>
                      <Link to="/exams/report"         className="btn btn-sm btn-info text-white"><i className="ti ti-report me-1" />Exam Report</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeSection === 'transport' && (
        <>
          {/* Bus Status Cards */}
          <div className="row mb-3">
            {[
              { label: 'Total Buses',    value: '12',  tone: 'bg-primary',   icon: 'ti ti-bus'              },
              { label: 'On Route',       value: '9',   tone: 'bg-success',   icon: 'ti ti-circle-check'     },
              { label: 'Delayed',        value: '2',   tone: 'bg-warning',   icon: 'ti ti-clock'            },
              { label: 'Breakdown/Idle', value: '1',   tone: 'bg-danger',    icon: 'ti ti-alert-triangle'   },
            ].map((c: any) => (
              <div key={c.label} className="col-xl-3 col-sm-6 d-flex">
                <div className="card flex-fill animate-card border-0">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div><h2 className="mb-0">{c.value}</h2><p className="mb-0">{c.label}</p></div>
                    <div className={`avatar avatar-xl ${c.tone} rounded d-flex align-items-center justify-content-center flex-shrink-0`}>
                      <i className={`${c.icon} fs-24 text-white`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Route Status Table + Maintenance */}
          <div className="row">
            <div className="col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Bus Route Status</h4>
                  <Link to="/transport/routes" className="btn btn-sm btn-primary">Manage Routes</Link>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>Route</th><th>Bus No.</th><th>Students</th><th>Driver</th><th>Status</th></tr></thead>
                      <tbody>
                        {busRoutes.map((b: any, i: number) => (
                          <tr key={i}>
                            <td className="fw-semibold" style={{ fontSize: 13 }}>{b.route}</td>
                            <td><small className="text-muted">{b.bus}</small></td>
                            <td>{b.students}/{b.capacity}</td>
                            <td>{b.driver}</td>
                            <td><span className={`badge ${b.cls2}`}>{b.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Maintenance + Complaints */}
            <div className="col-xl-5 d-flex flex-column">
              <div className="card mb-4">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Maintenance Requests</h4>
                  <span className="badge bg-danger">2 Critical</span>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>Area</th><th>Priority</th><th>Status</th></tr></thead>
                      <tbody>
                        {maintRequests.map((m: any, i: number) => (
                          <tr key={i}>
                            <td style={{ fontSize: 13 }}>{m.area}</td>
                            <td><span className={`badge ${m.cls2}`}>{m.priority}</span></td>
                            <td>{m.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Complaint Tickets</h4>
                  <Link to="/complaints" className="fw-medium">View All</Link>
                </div>
                <div className="card-body">
                  {complaintTickets.slice(0,3).map((c: any, i: number) => (
                    <div key={i} className={`d-flex align-items-start ${i < 2 ? 'mb-3' : 'mb-0'}`}>
                      <span className={`badge ${c.cls2} flex-shrink-0 me-2`}>{c.id}</span>
                      <div className="overflow-hidden flex-fill">
                        <p className="mb-0 text-truncate fw-semibold" style={{ fontSize: 13 }}>{c.issue}</p>
                        <small className="text-muted">{c.from} · {c.date}</small>
                      </div>
                      <span className={`badge ${c.cls2} flex-shrink-0 ms-1`}>{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeSection === 'alerts' && (
        <>
          {/* Alert cards with action buttons */}
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title"><i className="ti ti-alert-triangle me-2 text-danger" />Active Alerts & Risk Indicators</h4>
                  <span className="badge bg-danger">{notifAlerts.length} Active</span>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    {notifAlerts.map((a: any, i: number) => (
                      <div key={i} className="col-xxl col-md-6">
                        <div className={`alert alert-${a.type} d-flex align-items-start mb-0`} role="alert">
                          <i className={`${a.icon} fs-18 me-2 flex-shrink-0 mt-1`} />
                          <div className="flex-fill">
                            <div className="fw-semibold mb-1">{a.title}</div>
                            <div style={{ fontSize: 12 }} className="mb-2">{a.desc}</div>
                            <button className={`btn btn-sm btn-${a.type === 'secondary' ? 'secondary' : a.type}`} style={{ fontSize: 11 }}>
                              <i className="ti ti-arrow-right me-1" />{a.action}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Notifications + Complaint Tickets */}
          <div className="row">
            <div className="col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Recent Notifications</h4>
                  <div className="d-flex gap-2">
                    <Link to="/notifications/send" className="btn btn-sm btn-primary"><i className="ti ti-send me-1" />Send</Link>
                    <Link to="/notifications"      className="btn btn-sm btn-light">View All</Link>
                  </div>
                </div>
                <div className="card-body">
                  {recentNotifications.map((n: any, i: number) => (
                    <div key={i} className={`d-flex align-items-start ${i < recentNotifications.length - 1 ? 'mb-4' : 'mb-0'}`}>
                      <span className={`avatar avatar-md flex-shrink-0 me-2 ${n.bg} rounded-circle`}>
                        <i className={`${n.icon} fs-16`} />
                      </span>
                      <div className="overflow-hidden flex-fill">
                        <p className="mb-0 text-truncate fw-semibold" style={{ fontSize: 13 }}>{n.msg}</p>
                        <small className="text-muted">{n.time}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Complaint Tickets</h4>
                  <div className="d-flex gap-2">
                    <span className="badge bg-danger me-1">3 Open</span>
                    <Link to="/complaints" className="btn btn-sm btn-light">View All</Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>Ticket</th><th>From</th><th>Issue</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                      <tbody>
                        {complaintTickets.map((c: any, i: number) => (
                          <tr key={i}>
                            <td><span className={`badge ${c.cls2}`}>{c.id}</span></td>
                            <td style={{ fontSize: 13 }}>{c.from}</td>
                            <td style={{ fontSize: 13 }}>{c.issue}</td>
                            <td><small className="text-muted">{c.date}</small></td>
                            <td><span className={`badge ${c.cls2}`}>{c.status}</span></td>
                            <td><Link to="/complaints/detail" className="btn btn-sm btn-light px-2 py-1">Resolve</Link></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Export + Report Actions */}
          <div className="row mt-2">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header"><h4 className="card-title">Daily Reports & Exports</h4></div>
                <div className="card-body">
                  <div className="row g-3">
                    {[
                      { label: 'Daily Attendance Report', icon: 'ti ti-calendar-stats',    to: '/reports/attendance',  bg: 'bg-primary-transparent',   border: 'border-primary'   },
                      { label: 'Fee Collection Report',   icon: 'ti ti-report-money',      to: '/reports/fees',        bg: 'bg-success-transparent',   border: 'border-success'   },
                      { label: 'Admission Summary',       icon: 'ti ti-file-description',  to: '/reports/admissions',  bg: 'bg-warning-transparent',   border: 'border-warning'   },
                      { label: 'Staff Report',            icon: 'ti ti-users',             to: '/reports/staff',       bg: 'bg-info-transparent',      border: 'border-info'      },
                      { label: 'Exam Progress Report',    icon: 'ti ti-exam',              to: '/reports/exams',       bg: 'bg-secondary-transparent', border: 'border-secondary' },
                      { label: 'Export All Data',         icon: 'ti ti-download',          to: '/reports/export',      bg: 'bg-danger-transparent',    border: 'border-danger'    },
                    ].map((r: any) => (
                      <div key={r.label} className="col-xxl-2 col-md-4 col-sm-6">
                        <Link to={r.to} className={`d-block ${r.bg} border ${r.border} rounded p-3 text-center class-hover`}>
                          <i className={`${r.icon} fs-28 mb-2 d-block`} />
                          <p className="text-dark mb-0" style={{ fontSize: 12 }}>{r.label}</p>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Leave Approval Modal */}
      {leaveModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Approve Leave Request</h5>
                <button type="button" className="btn-close" onClick={() => setLeaveModal(null)} />
              </div>
              <div className="modal-body">
                <p><strong>Staff:</strong> {leaveModal.name}</p>
                <p><strong>Role:</strong> {leaveModal.role}</p>
                <p><strong>Type:</strong> <span className={`badge ${leaveModal.cls2}`}>{leaveModal.type}</span></p>
                <p><strong>Dates:</strong> {leaveModal.days}</p>
                <div className="mb-3">
                  <label className="form-label">Remarks (optional)</label>
                  <textarea className="form-control" rows={2} placeholder="Add approval remarks..." />
                </div>
                <div className="mb-3">
                  <label className="form-label">Assign Substitute</label>
                  <select className="form-select">
                    <option>Select substitute teacher...</option>
                    <option>Ms. Anita</option>
                    <option>Mr. Dev</option>
                    <option>Ms. Priya</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger"   onClick={() => setLeaveModal(null)}>Reject</button>
                <button type="button" className="btn btn-secondary" onClick={() => setLeaveModal(null)}>Cancel</button>
                <button type="button" className="btn btn-success"  onClick={() => setLeaveModal(null)}>✓ Approve Leave</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminDashboard
