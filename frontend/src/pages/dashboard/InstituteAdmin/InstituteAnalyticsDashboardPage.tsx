/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { toast } from 'react-toastify'
import { apiClient } from '../../../api/client'

const InstituteAnalyticsDashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('admissions')
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
      
      const response = await apiClient.get('/analytics/institute-admin/dashboard')
      
      if (response.data.success && response.data.data) {
        setDashboardData(response.data.data)
        toast.success('Institute Analytics Dashboard loaded successfully')
      }
    } catch (err: any) {
      console.error('Error fetching institute analytics dashboard:', err)
      setError(err.message || 'Failed to load analytics data')
      toast.error('Failed to load analytics data')
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
  const topStats = dashboardData?.topStats || []
  const admissionKPIs = dashboardData?.admissionKPIs || []
  const admissionsYearData = dashboardData?.admissionsYearData || []
  const gradeStrength = dashboardData?.gradeStrength || []
  const admissionTrend = dashboardData?.admissionTrend || []
  const dropoutData = dashboardData?.dropoutData || []
  const seatOccupancy = dashboardData?.seatOccupancy || []
  const boardExams = dashboardData?.boardExams || []
  const topClasses = dashboardData?.topClasses || []
  const subjectPerf = dashboardData?.subjectPerf || []
  const perfTrend = dashboardData?.perfTrend || []
  const attPct = dashboardData?.attPct || []
  const staffKPIs = dashboardData?.staffKPIs || []
  const staffAttByDept = dashboardData?.staffAttByDept || []
  const staffTurnover = dashboardData?.staffTurnover || []
  const perfRating = dashboardData?.perfRating || []

  const C = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'] // Colors for charts

  const navSections = [
    { id: 'admissions',  label: 'Admissions',  icon: 'ti ti-user-plus'      },
    { id: 'academic',    label: 'Academic',    icon: 'ti ti-book'           },
    { id: 'attendance',  label: 'Attendance',  icon: 'ti ti-calendar-check' },
    { id: 'staff',       label: 'Staff',       icon: 'ti ti-users'          },
  ]

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Institute Analytics Dashboard</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/institute-admin">Institute Admin</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Analytics</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
          <Link to="/reports/export" className="btn btn-primary d-flex align-items-center" style={{ fontSize: 13 }}>
            <i className="ti ti-download me-1" />Export Report
          </Link>
          <Link to="/reports" className="btn btn-light d-flex align-items-center" style={{ fontSize: 13 }}>
            <i className="ti ti-report me-1" />View All Reports
          </Link>
        </div>
      </div>

      {/* ── TOP STATISTICS ── */}
      <div className="row mb-3">
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
          ① ADMISSIONS SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'admissions' && (
        <>
          {/* Admission KPIs */}
          <div className="row mb-3">
            {admissionKPIs.map((stat: any) => (
              <div key={stat.label} className="col-xl-3 col-sm-6 d-flex">
                <div className="card flex-fill animate-card border-0">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h2 className="mb-0">{stat.value}</h2>
                      <p className="mb-0">{stat.label}</p>
                      <small className="text-muted">{stat.sub}</small>
                    </div>
                    <div className={`avatar avatar-xl ${stat.tone} rounded d-flex align-items-center justify-content-center flex-shrink-0`}>
                      <i className={`${stat.icon} fs-24 text-white`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Admissions Year-over-Year + Grade Strength */}
          <div className="row">
            <div className="col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Admissions Year-over-Year</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={admissionsYearData}>
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="admissions" name="Admissions" fill="#6366f1" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Grade-wise Strength</h4></div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={gradeStrength} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="count" label>
                        {gradeStrength.map((_: any, i: number) => <Cell key={i} fill={C[i % C.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: any, n: any) => [`${v} students`, n]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Admission Trend + Dropout Analysis */}
          <div className="row">
            <div className="col-xl-8 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Monthly Admission Trend</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={admissionTrend}>
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="admissions" name="Admissions" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-4 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Dropout Analysis</h4></div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>Grade</th><th>Dropouts</th><th>Rate</th></tr></thead>
                      <tbody>
                        {dropoutData.map((d: any, i: number) => (
                          <tr key={i}>
                            <td>{d.grade}</td>
                            <td><span className="badge badge-soft-danger">{d.count}</span></td>
                            <td><small className="text-muted">{d.rate}%</small></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seat Occupancy */}
          <div className="row">
            <div className="col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Seat Occupancy by School</h4></div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>School</th><th>Total Seats</th><th>Occupied</th><th>Available</th><th>Occupancy %</th></tr></thead>
                      <tbody>
                        {seatOccupancy.map((s: any, i: number) => (
                          <tr key={i}>
                            <td className="fw-semibold">{s.school}</td>
                            <td>{s.total}</td>
                            <td><span className="badge badge-soft-success">{s.occupied}</span></td>
                            <td><span className="badge badge-soft-warning">{s.available}</span></td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="progress progress-xs flex-fill me-2" style={{ width: 100 }}>
                                  <div className={`progress-bar ${s.pct >= 90 ? 'bg-success' : s.pct >= 70 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${s.pct}%` }} />
                                </div>
                                <span className="fw-semibold" style={{ fontSize: 12 }}>{s.pct}%</span>
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
          ② ACADEMIC SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'academic' && (
        <>
          {/* Board Exam Results + Top Performing Classes */}
          <div className="row">
            <div className="col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Board Exam Results</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={boardExams}>
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0,100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}%`} />
                      <Tooltip formatter={(v: any, n: any) => [`${v}%`, n]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="passRate" name="Pass Rate" fill="#10b981" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Top Performing Classes</h4></div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>Class</th><th>School</th><th>Avg %</th></tr></thead>
                      <tbody>
                        {topClasses.map((c: any, i: number) => (
                          <tr key={i}>
                            <td className="fw-semibold">{c.class}</td>
                            <td><small className="text-muted">{c.school}</small></td>
                            <td><span className="badge badge-soft-success">{c.avg}%</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Performance + Performance Trend */}
          <div className="row">
            <div className="col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Subject-wise Performance</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={subjectPerf} layout="vertical" barSize={20}>
                      <XAxis type="number" domain={[0,100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}%`} />
                      <YAxis type="category" dataKey="subject" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={80} />
                      <Tooltip formatter={(v: any) => [`${v}%`, 'Avg Score']} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Bar dataKey="avg" name="Average" fill="#6366f1" radius={[0,6,6,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Performance Trend</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={perfTrend}>
                      <XAxis dataKey="term" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0,100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}%`} />
                      <Tooltip formatter={(v: any, n: any) => [`${v}%`, n]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="avg" name="Average %" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ③ ATTENDANCE SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'attendance' && (
        <>
          <div className="row">
            <div className="col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">School-wise Attendance Percentage</h4></div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>School</th><th>Students</th><th>Present</th><th>Absent</th><th>Attendance %</th></tr></thead>
                      <tbody>
                        {attPct.map((a: any, i: number) => (
                          <tr key={i}>
                            <td className="fw-semibold">{a.school}</td>
                            <td>{a.total}</td>
                            <td><span className="badge badge-soft-success">{a.present}</span></td>
                            <td><span className="badge badge-soft-danger">{a.absent}</span></td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="progress progress-xs flex-fill me-2" style={{ width: 100 }}>
                                  <div className={`progress-bar ${a.pct >= 90 ? 'bg-success' : a.pct >= 75 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${a.pct}%` }} />
                                </div>
                                <span className="fw-semibold" style={{ fontSize: 12 }}>{a.pct}%</span>
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
          ④ STAFF SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'staff' && (
        <>
          {/* Staff KPIs */}
          <div className="row mb-3">
            {staffKPIs.map((stat: any) => (
              <div key={stat.label} className="col-xl-3 col-sm-6 d-flex">
                <div className="card flex-fill animate-card border-0">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <h2 className="mb-0">{stat.value}</h2>
                      <p className="mb-0">{stat.label}</p>
                      <small className="text-muted">{stat.sub}</small>
                    </div>
                    <div className={`avatar avatar-xl ${stat.tone} rounded d-flex align-items-center justify-content-center flex-shrink-0`}>
                      <i className={`${stat.icon} fs-24 text-white`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Staff Attendance by Department + Staff Turnover */}
          <div className="row">
            <div className="col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Staff Attendance by Department</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={staffAttByDept}>
                      <XAxis dataKey="dept" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0,100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}%`} />
                      <Tooltip formatter={(v: any, n: any) => [`${v}%`, n]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Bar dataKey="pct" name="Attendance %" fill="#10b981" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Staff Turnover Trend</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={staffTurnover}>
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="joined" name="Joined" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="left" name="Left" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Rating Distribution */}
          <div className="row">
            <div className="col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Staff Performance Rating Distribution</h4></div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>Rating</th><th>Count</th><th>Percentage</th><th>Distribution</th></tr></thead>
                      <tbody>
                        {perfRating.map((r: any, i: number) => (
                          <tr key={i}>
                            <td className="fw-semibold">{r.rating}</td>
                            <td><span className="badge badge-soft-primary">{r.count}</span></td>
                            <td>{r.pct}%</td>
                            <td>
                              <div className="progress progress-sm" style={{ width: 200 }}>
                                <div className="progress-bar" style={{ width: `${r.pct}%`, backgroundColor: C[i % C.length] }} />
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
    </>
  )
}

export default InstituteAnalyticsDashboardPage
