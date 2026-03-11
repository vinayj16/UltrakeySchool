import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { superAdminService } from '../../services/superAdminService'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import TopStatCard from '../../components/dashboard/TopStatCard'

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const C = ['#6366f1','#10b981','#f59e0b','#ef4444','#06b6d4','#8b5cf6','#ec4899','#14b8a6']

const AnalyticsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('institutions')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Data from backend
  const [analyticsSummary, setAnalyticsSummary] = useState<any>(null)
  const [institutionsAnalytics, setInstitutionsAnalytics] = useState<any>(null)
  const [revenueAnalytics, setRevenueAnalytics] = useState<any>(null)
  const [userAnalytics, setUserAnalytics] = useState<any>(null)
  const [branchAnalytics, setBranchAnalytics] = useState<any>(null)
  const [subscriptionAnalytics, setSubscriptionAnalytics] = useState<any>(null)
  const [supportAnalytics, setSupportAnalytics] = useState<any>(null)

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [
          summaryRes,
          institutionsRes,
          revenueRes,
          userRes,
          branchRes,
          subscriptionRes,
          supportRes
        ] = await Promise.all([
          superAdminService.getAnalyticsSummary(),
          superAdminService.getInstitutionsAnalytics(),
          superAdminService.getRevenueAnalytics(),
          superAdminService.getUserAnalytics(),
          superAdminService.getBranchAnalytics(),
          superAdminService.getSubscriptionAnalytics(),
          superAdminService.getSupportAnalytics()
        ])

        setAnalyticsSummary(summaryRes)
        setInstitutionsAnalytics(institutionsRes)
        setRevenueAnalytics(revenueRes)
        setUserAnalytics(userRes)
        setBranchAnalytics(branchRes)
        setSubscriptionAnalytics(subscriptionRes)
        setSupportAnalytics(supportRes)
      } catch (error: any) {
        console.error('Error fetching analytics data:', error)
        setError(error.message || 'Failed to fetch analytics data')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5 className="text-muted">Loading analytics...</h5>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="text-center py-5">
              <i className="ti ti-alert-circle fs-48 text-danger mb-3 d-block" />
              <h5 className="text-danger">Error Loading Analytics</h5>
              <p className="text-muted">{error}</p>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                <i className="ti ti-refresh me-2" />Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Generate top stats from backend data
  const topStats = [
    { 
      label: 'Total Institutions',  
      value: analyticsSummary?.totalInstitutions?.toString() || '0', 
      delta: analyticsSummary?.institutionsGrowth || '+0%', 
      deltaTone: 'bg-success', 
      icon: '/assets/img/icons/student.svg', 
      active: `${analyticsSummary?.activeInstitutions || 0} Active`, 
      inactive: `${analyticsSummary?.inactiveInstitutions || 0} Inactive`, 
      avatarTone: 'bg-success-transparent' 
    },
    { 
      label: 'Monthly Revenue',     
      value: `$${analyticsSummary?.monthlyRevenue?.toLocaleString() || '0'}`, 
      delta: analyticsSummary?.revenueGrowth || '+0%', 
      deltaTone: 'bg-primary', 
      icon: '/assets/img/icons/teacher.svg', 
      active: `$${analyticsSummary?.paidRevenue?.toLocaleString() || '0'} Paid`, 
      inactive: `$${analyticsSummary?.dueRevenue?.toLocaleString() || '0'} Due`, 
      avatarTone: 'bg-primary-transparent' 
    },
    { 
      label: 'Total Platform Users',
      value: analyticsSummary?.totalUsers?.toLocaleString() || '0', 
      delta: analyticsSummary?.usersGrowth || '+0%', 
      deltaTone: 'bg-warning', 
      icon: '/assets/img/icons/staff.svg', 
      active: `${analyticsSummary?.activeUsers || 0} Active`, 
      inactive: `${analyticsSummary?.inactiveUsers || 0} Idle`, 
      avatarTone: 'bg-warning-transparent' 
    },
    { 
      label: 'Expiring Plans',      
      value: analyticsSummary?.expiringPlans?.toString() || '0', 
      delta: 'Within 30d', 
      deltaTone: 'bg-danger', 
      icon: '/assets/img/icons/subject.svg', 
      active: `${analyticsSummary?.criticalExpiring || 0} Critical`, 
      inactive: `${analyticsSummary?.warningExpiring || 0} Warning`, 
      avatarTone: 'bg-danger-transparent' 
    },
  ]

  const sections = [
    { id:'institutions', label:'① Institutions Overview' },
    { id:'revenue',      label:'② Revenue Analytics'     },
    { id:'users',        label:'③ User Analytics'        },
    { id:'branches',     label:'④ Branch Analytics'      },
    { id:'subscriptions',label:'⑤ Subscriptions'        },
    { id:'support',      label:'⑥ Support & Tickets'    },
  ]

  return (
    <>
      {/* ── PAGE HEADER ───────────────────────────────────────────── */}
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Super Admin Analytics</h3>
          <nav><ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/super-admin/dashboard">Dashboard</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Analytics</li>
          </ol></nav>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="dropdown">
            <a href="#" className="bg-white dropdown-toggle btn btn-light" data-bs-toggle="dropdown">
              <i className="ti ti-calendar me-2" />This Month
            </a>
            <ul className="dropdown-menu mt-2 p-3">
              {['Today','This Week','This Month','This Year'].map(o => (
                <li key={o}><a href="#" className="dropdown-item rounded-1">{o}</a></li>
              ))}
            </ul>
          </div>
          <Link to="/super-admin/reports" className="btn btn-success">
            <i className="ti ti-download me-2" />Export Report
          </Link>
        </div>
      </div>

      {/* ── TOP STAT CARDS ────────────────────────────────────────── */}
      <div className="row mb-4">
        {topStats.map(stat => <TopStatCard key={stat.label} {...stat} />)}
      </div>

      {/* ── SECTION TABS ──────────────────────────────────────────── */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="list-tab">
            <ul className="nav">
              {sections.map(s => (
                <li key={s.id}>
                  <a href="#"
                    className={activeSection === s.id ? 'active' : ''}
                    onClick={e => { e.preventDefault(); setActiveSection(s.id) }}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ① INSTITUTIONS OVERVIEW
      ══════════════════════════════════════════════════════════════ */}
      {activeSection === 'institutions' && (
        <>
          <div className="row mb-4">
            {/* Generate KPIs from institutions analytics data */}
            {institutionsAnalytics?.kpis?.map((kpi: any, index: number) => (
              <TopStatCard key={index} {...kpi} />
            )) || [
              <div key="no-data" className="col-12">
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="ti ti-chart-bar fs-48 text-muted mb-3 d-block" />
                    <h5 className="text-muted">No institution analytics data available</h5>
                  </div>
                </div>
              </div>
            ]}
          </div>

          <div className="row mb-4">
            {/* Institution Growth by Year */}
            <div className="col-xxl-8 col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Institution Growth by Year</h4>
                  <div className="dropdown">
                    <a href="#" className="bg-white dropdown-toggle" data-bs-toggle="dropdown">
                      <i className="ti ti-calendar me-2" />All Years
                    </a>
                    <ul className="dropdown-menu mt-2 p-3">
                      {['All Years','Last 3 Years'].map(o => <li key={o}><a href="#" className="dropdown-item rounded-1">{o}</a></li>)}
                    </ul>
                  </div>
                </div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={institutionsAnalytics?.growthByYear || []} barSize={20} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="year" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius:10, fontSize:12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }} />
                      <Bar dataKey="schools"         name="Schools"         fill={C[0]} radius={[6,6,0,0]} />
                      <Bar dataKey="interColleges"   name="Inter Colleges"  fill={C[1]} radius={[6,6,0,0]} />
                      <Bar dataKey="degreeColleges"  name="Degree Colleges" fill={C[2]} radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Type + Status Pies */}
            <div className="col-xxl-4 col-xl-5 d-flex flex-column">
              <div className="card flex-fill mb-3">
                <div className="card-header"><h4 className="card-title">By Institution Type</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={institutionsAnalytics?.byType || []} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={3} dataKey="value">
                        {(institutionsAnalytics?.byType || []).map((_: any, i: number) => <Cell key={i} fill={C[i]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius:8, fontSize:12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card flex-fill mb-0">
                <div className="card-header"><h4 className="card-title">By Status</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={institutionsAnalytics?.byStatus || []} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={3} dataKey="value">
                        {(institutionsAnalytics?.byStatus || []).map((_: any, i: number) => <Cell key={i} fill={[C[1],C[2],C[3]][i]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius:8, fontSize:12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            {/* Registration Trend */}
            <div className="col-xxl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Monthly Registration Trend</h4>
                </div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={institutionsAnalytics?.registrationTrend || []}>
                      <defs>
                        <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={C[0]} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={C[0]} stopOpacity={0}    />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="m" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius:10, fontSize:12 }} />
                      <Area type="monotone" dataKey="v" name="New Registrations" stroke={C[0]} strokeWidth={2.5} fill="url(#regGrad)" dot={{ fill:C[0], r:3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Plan Distribution bar */}
            <div className="col-xxl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Plan Distribution</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={institutionsAnalytics?.byPlan || []} barSize={48}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="plan" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius:10, fontSize:12 }} />
                      <Bar dataKey="count" name="Institutions" radius={[6,6,0,0]}>
                        {(institutionsAnalytics?.byPlan || []).map((_: any, i: number) => <Cell key={i} fill={[C[4],C[2],C[1]][i]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Recently Registered Table */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Recently Registered Institutions</h4>
                  <Link to="/super-admin/institutions" className="fw-medium">View All</Link>
                </div>
                <div className="card-body px-0">
                  <div className="custom-datatable-filter table-responsive">
                    <table className="table">
                      <thead className="thead-light">
                        <tr><th>Institution</th><th>Type</th><th>Plan</th><th>Status</th><th>Students</th><th>Joined</th><th>Expiry</th><th>Action</th></tr>
                      </thead>
                      <tbody>
                        {institutionsAnalytics?.recentInstitutions?.map((r: any, i: number) => (
                          <tr key={i}>
                            <td><span className="fw-semibold">{r.name}</span></td>
                            <td><span className={`badge ${r.type==='School'?'badge-soft-primary':r.type==='Inter College'?'badge-soft-warning':'badge-soft-info'}`}>{r.type}</span></td>
                            <td><span className={`badge ${r.plan==='Premium'?'badge-soft-success':r.plan==='Medium'?'badge-soft-warning':'badge-soft-info'}`}>{r.plan}</span></td>
                            <td><span className={`badge ${r.statusCls}`}><i className="ti ti-circle-filled fs-8 me-1"></i>{r.status}</span></td>
                            <td>{r.students?.toLocaleString() || '0'}</td>
                            <td>{r.joined}</td>
                            <td>{r.expiry}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <Link to={`/super-admin/institutions/${r._id}`} className="btn btn-sm btn-light"><i className="ti ti-eye" /></Link>
                                <button className="btn btn-sm btn-light"><i className="ti ti-bell" /></button>
                              </div>
                            </td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan={8} className="text-center py-4">
                              <span className="text-muted">No recent institutions found</span>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          ② REVENUE ANALYTICS
      ══════════════════════════════════════════════════════════════ */}
      {activeSection === 'revenue' && (
        <>
          <div className="row mb-4">
            {revenueAnalytics?.kpis?.map((kpi: any, index: number) => (
              <TopStatCard key={index} {...kpi} />
            )) || [
              <div key="no-rev-data" className="col-12">
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="ti ti-chart-line fs-48 text-muted mb-3 d-block" />
                    <h5 className="text-muted">No revenue analytics data available</h5>
                  </div>
                </div>
              </div>
            ]}
          </div>

          <div className="row mb-4">
            {/* Monthly Revenue by Plan */}
            <div className="col-xxl-8 col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Monthly Revenue by Plan</h4>
                  <div className="dropdown">
                    <a href="#" className="bg-white dropdown-toggle" data-bs-toggle="dropdown">
                      <i className="ti ti-calendar me-2" />This Year
                    </a>
                    <ul className="dropdown-menu mt-2 p-3">
                      {['This Year','Last Year'].map(o => <li key={o}><a href="#" className="dropdown-item rounded-1">{o}</a></li>)}
                    </ul>
                  </div>
                </div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={revenueAnalytics?.monthlyByPlan || []} barSize={16} barGap={3}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="m" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`} />
                      <Tooltip formatter={v=>[`$${v}`,'']} contentStyle={{ borderRadius:10, fontSize:12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }} />
                      <Bar dataKey="basic"   name="Basic"   fill={C[4]} radius={[4,4,0,0]} />
                      <Bar dataKey="medium"  name="Medium"  fill={C[2]} radius={[4,4,0,0]} />
                      <Bar dataKey="premium" name="Premium" fill={C[1]} radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Revenue by Plan Pie */}
            <div className="col-xxl-4 col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Revenue Share by Plan</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={revenueAnalytics?.byPlan || []} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                        {(revenueAnalytics?.byPlan || []).map((_: any, i: number) => <Cell key={i} fill={[C[4],C[2],C[1]][i]} />)}
                      </Pie>
                      <Tooltip formatter={v=>[`$${v}`,'']} contentStyle={{ borderRadius:8, fontSize:12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Growth Trend */}
          <div className="row mb-4">
            <div className="col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <h4 className="card-title">Revenue Growth Trend</h4>
                </div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={revenueAnalytics?.growthTrend || []}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C[1]} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={C[1]} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="m" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}K`} />
                      <Tooltip formatter={v=>[`$${v}K`,'Revenue']} contentStyle={{ borderRadius:10, fontSize:12 }} />
                      <Area type="monotone" dataKey="rev" name="Revenue" stroke={C[1]} strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill:C[1], r:3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Recent Transactions</h4>
                </div>
                <div className="card-body px-0">
                  <div className="custom-datatable-filter table-responsive">
                    <table className="table">
                      <thead className="thead-light">
                        <tr><th>ID</th><th>Institution</th><th>Plan</th><th>Amount</th><th>Date</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {revenueAnalytics?.recentTransactions?.map((txn: any, i: number) => (
                          <tr key={i}>
                            <td><span className="fw-semibold">{txn.id}</span></td>
                            <td>{txn.inst}</td>
                            <td><span className={`badge ${txn.plan==='Premium'?'badge-soft-success':txn.plan==='Medium'?'badge-soft-warning':'badge-soft-info'}`}>{txn.plan}</span></td>
                            <td>${txn.amount}</td>
                            <td>{txn.date}</td>
                            <td><span className={`badge ${txn.cls}`}>{txn.status}</span></td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              <span className="text-muted">No recent transactions found</span>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          ③ USER ANALYTICS
      ══════════════════════════════════════════════════════════════ */}
      {activeSection === 'users' && (
        <>
          <div className="row mb-4">
            {userAnalytics?.kpis?.map((kpi: any, index: number) => (
              <TopStatCard key={index} {...kpi} />
            )) || [
              <div key="no-user-data" className="col-12">
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="ti ti-users fs-48 text-muted mb-3 d-block" />
                    <h5 className="text-muted">No user analytics data available</h5>
                  </div>
                </div>
              </div>
            ]}
          </div>

          <div className="row mb-4">
            {/* User Role Distribution */}
            <div className="col-xxl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">User Role Distribution</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={userAnalytics?.byRole || []} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                        {(userAnalytics?.byRole || []).map((_: any, i: number) => <Cell key={i} fill={C[i]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius:8, fontSize:12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* User Growth Trend */}
            <div className="col-xxl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">User Growth Trend</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={userAnalytics?.growthTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="m" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius:10, fontSize:12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }} />
                      <Line type="monotone" dataKey="students" name="Students" stroke={C[0]} strokeWidth={2.5} dot={{ fill:C[0], r:3 }} />
                      <Line type="monotone" dataKey="teachers" name="Teachers" stroke={C[1]} strokeWidth={2.5} dot={{ fill:C[1], r:3 }} />
                      <Line type="monotone" dataKey="staff"    name="Staff"    stroke={C[2]} strokeWidth={2.5} dot={{ fill:C[2], r:3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          ④ BRANCH ANALYTICS
      ══════════════════════════════════════════════════════════════ */}
      {activeSection === 'branches' && (
        <>
          <div className="row mb-4">
            {branchAnalytics?.kpis?.map((kpi: any, index: number) => (
              <TopStatCard key={index} {...kpi} />
            )) || [
              <div key="no-branch-data" className="col-12">
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="ti ti-building fs-48 text-muted mb-3 d-block" />
                    <h5 className="text-muted">No branch analytics data available</h5>
                  </div>
                </div>
              </div>
            ]}
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Branch Overview</h4>
                </div>
                <div className="card-body px-0">
                  <div className="custom-datatable-filter table-responsive">
                    <table className="table">
                      <thead className="thead-light">
                        <tr><th>Branch Name</th><th>Institution</th><th>City</th><th>Students</th><th>Teachers</th><th>Status</th><th>Revenue</th></tr>
                      </thead>
                      <tbody>
                        {branchAnalytics?.branches?.map((branch: any, i: number) => (
                          <tr key={i}>
                            <td><span className="fw-semibold">{branch.name}</span></td>
                            <td>{branch.inst}</td>
                            <td>{branch.city}</td>
                            <td>{branch.students?.toLocaleString() || '0'}</td>
                            <td>{branch.teachers || '0'}</td>
                            <td><span className={`badge ${branch.status === 'Active' ? 'badge-soft-success' : 'badge-soft-warning'}`}>{branch.status}</span></td>
                            <td>${branch.revenue || '0'}</td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan={7} className="text-center py-4">
                              <span className="text-muted">No branch data available</span>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          ⑤ SUBSCRIPTIONS
      ══════════════════════════════════════════════════════════════ */}
      {activeSection === 'subscriptions' && (
        <>
          <div className="row mb-4">
            {subscriptionAnalytics?.kpis?.map((kpi: any, index: number) => (
              <TopStatCard key={index} {...kpi} />
            )) || [
              <div key="no-sub-data" className="col-12">
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="ti ti-card fs-48 text-muted mb-3 d-block" />
                    <h5 className="text-muted">No subscription analytics data available</h5>
                  </div>
                </div>
              </div>
            ]}
          </div>

          <div className="row mb-4">
            {/* Subscription Status Trend */}
            <div className="col-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header">
                  <h4 className="card-title">Subscription Status Trend</h4>
                </div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={subscriptionAnalytics?.statusTrend || []}>
                      <defs>
                        <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C[1]} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={C[1]} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="m" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius:10, fontSize:12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }} />
                      <Area type="monotone" dataKey="active" name="Active" stroke={C[1]} strokeWidth={2.5} fill="url(#activeGrad)" dot={{ fill:C[1], r:3 }} />
                      <Area type="monotone" dataKey="suspended" name="Suspended" stroke={C[2]} strokeWidth={2.5} dot={{ fill:C[2], r:3 }} />
                      <Area type="monotone" dataKey="expired" name="Expired" stroke={C[3]} strokeWidth={2.5} dot={{ fill:C[3], r:3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          ⑥ SUPPORT & TICKETS
      ══════════════════════════════════════════════════════════════ */}
      {activeSection === 'support' && (
        <>
          <div className="row mb-4">
            {supportAnalytics?.kpis?.map((kpi: any, index: number) => (
              <TopStatCard key={index} {...kpi} />
            )) || [
              <div key="no-support-data" className="col-12">
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="ti ti-headset fs-48 text-muted mb-3 d-block" />
                    <h5 className="text-muted">No support analytics data available</h5>
                  </div>
                </div>
              </div>
            ]}
          </div>

          <div className="row mb-4">
            {/* Tickets by Category */}
            <div className="col-xxl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Tickets by Category</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={supportAnalytics?.ticketsByType || []} barSize={36}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="cat" tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius:10, fontSize:12 }} />
                      <Bar dataKey="count" name="Tickets" radius={[6,6,0,0]}>
                        {(supportAnalytics?.ticketsByType || []).map((_: any, i: number) => <Cell key={i} fill={C[i % C.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Monthly Tickets Trend */}
            <div className="col-xxl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Monthly Tickets – Raised vs Resolved</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={supportAnalytics?.ticketsTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="m" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius:10, fontSize:12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }} />
                      <Line type="monotone" dataKey="raised"   name="Raised"   stroke={C[3]} strokeWidth={2.5} dot={{ fill:C[3], r:3 }} />
                      <Line type="monotone" dataKey="resolved" name="Resolved" stroke={C[1]} strokeWidth={2.5} dot={{ fill:C[1], r:3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Recent Support Tickets</h4>
                </div>
                <div className="card-body px-0">
                  <div className="custom-datatable-filter table-responsive">
                    <table className="table">
                      <thead className="thead-light">
                        <tr><th>Ticket ID</th><th>From</th><th>Issue</th><th>Date</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {supportAnalytics?.recentTickets?.map((ticket: any, i: number) => (
                          <tr key={i}>
                            <td><span className="fw-semibold">{ticket.id}</span></td>
                            <td>{ticket.from}</td>
                            <td>{ticket.issue}</td>
                            <td>{ticket.date}</td>
                            <td><span className={`badge ${ticket.cls2}`}>{ticket.status}</span></td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan={5} className="text-center py-4">
                              <span className="text-muted">No recent tickets found</span>
                            </td>
                          </tr>
                        )}
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

export default AnalyticsPage
