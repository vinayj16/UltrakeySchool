/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { toast } from 'react-toastify'
import { apiClient } from '../../../api/client'

const InstituteFinanceDashboardPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('financial')
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
      
      const response = await apiClient.get('/analytics/institute-admin/fees')
      
      if (response.data.success && response.data.data) {
        setDashboardData(response.data.data)
        toast.success('Institute Finance Dashboard loaded successfully')
      }
    } catch (err: any) {
      console.error('Error fetching institute finance dashboard:', err)
      setError(err.message || 'Failed to load finance data')
      toast.error('Failed to load finance data')
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
  const financeKPIs = dashboardData?.financeKPIs || []
  const revenueData = dashboardData?.revenueData || []
  const expensePie = dashboardData?.expensePie || []
  const budgetVsActual = dashboardData?.budgetVsActual || []
  const recentInvoices = dashboardData?.recentInvoices || []
  const feeByTerm = dashboardData?.feeByTerm || []
  const schoolWiseRevenue = dashboardData?.schoolWiseRevenue || []
  const paymentModes = dashboardData?.paymentModes || []
  const overduePayments = dashboardData?.overduePayments || []
  const expenseTrend = dashboardData?.expenseTrend || []
  const profitMargin = dashboardData?.profitMargin || []

  const C = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'] // Colors for charts

  const navSections = [
    { id: 'financial',   label: 'Financial Overview',   icon: 'ti ti-currency-dollar' },
    { id: 'revenue',     label: 'Revenue',              icon: 'ti ti-trending-up'     },
    { id: 'expenses',    label: 'Expenses',             icon: 'ti ti-trending-down'   },
    { id: 'collections', label: 'Fee Collections',      icon: 'ti ti-receipt'         },
  ]

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Institute Finance Dashboard</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item"><Link to="/institute-admin">Institute Admin</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Finance</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
          <Link to="/finance/reports" className="btn btn-primary d-flex align-items-center" style={{ fontSize: 13 }}>
            <i className="ti ti-report me-1" />Financial Reports
          </Link>
          <Link to="/finance/export" className="btn btn-light d-flex align-items-center" style={{ fontSize: 13 }}>
            <i className="ti ti-download me-1" />Export Data
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
          ① FINANCIAL OVERVIEW SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'financial' && (
        <>
          {/* Finance KPIs */}
          <div className="row mb-3">
            {financeKPIs.map((stat: any) => (
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

          {/* Revenue Trend + Expense Breakdown */}
          <div className="row">
            <div className="col-xl-8 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Revenue Trend (Last 12 Months)</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-4 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Expense Breakdown</h4></div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={expensePie} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" label>
                        {expensePie.map((_: any, i: number) => <Cell key={i} fill={C[i % C.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: any, n: any) => [`$${Number(v).toLocaleString()}`, n]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Budget vs Actual + Profit Margin */}
          <div className="row">
            <div className="col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Budget vs Actual (This Year)</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={budgetVsActual}>
                      <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="budget" name="Budget" fill="#6366f1" radius={[6,6,0,0]} />
                      <Bar dataKey="actual" name="Actual" fill="#10b981" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Profit Margin Trend</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={profitMargin}>
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}%`} />
                      <Tooltip formatter={(v: any, n: any) => [`${v}%`, n]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Line type="monotone" dataKey="margin" name="Profit Margin" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ② REVENUE SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'revenue' && (
        <>
          {/* School-wise Revenue + Payment Modes */}
          <div className="row">
            <div className="col-xl-8 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">School-wise Revenue</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={schoolWiseRevenue}>
                      <XAxis dataKey="school" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-4 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Payment Modes</h4></div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={paymentModes} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" label>
                        {paymentModes.map((_: any, i: number) => <Cell key={i} fill={C[i % C.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: any, n: any) => [`${v}%`, n]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Fee Collection by Term */}
          <div className="row">
            <div className="col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Fee Collection by Term</h4></div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>Term</th><th>Expected</th><th>Collected</th><th>Pending</th><th>Collection %</th></tr></thead>
                      <tbody>
                        {feeByTerm.map((term: any, i: number) => (
                          <tr key={i}>
                            <td className="fw-semibold">{term.term}</td>
                            <td>${Number(term.expected).toLocaleString()}</td>
                            <td><span className="badge badge-soft-success">${Number(term.collected).toLocaleString()}</span></td>
                            <td><span className="badge badge-soft-warning">${Number(term.pending).toLocaleString()}</span></td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="progress progress-xs flex-fill me-2" style={{ width: 100 }}>
                                  <div className={`progress-bar ${term.pct >= 90 ? 'bg-success' : term.pct >= 70 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${term.pct}%` }} />
                                </div>
                                <span className="fw-semibold" style={{ fontSize: 12 }}>{term.pct}%</span>
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
          ③ EXPENSES SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'expenses' && (
        <>
          {/* Expense Trend */}
          <div className="row">
            <div className="col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Monthly Expense Trend</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={expenseTrend}>
                      <defs>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Expense']} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Area type="monotone" dataKey="salaries" name="Salaries" stroke="#6366f1" fillOpacity={1} fill="url(#colorExpense)" stackId="1" />
                      <Area type="monotone" dataKey="infrastructure" name="Infrastructure" stroke="#f59e0b" fillOpacity={1} fill="url(#colorExpense)" stackId="1" />
                      <Area type="monotone" dataKey="operations" name="Operations" stroke="#10b981" fillOpacity={1} fill="url(#colorExpense)" stackId="1" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ④ FEE COLLECTIONS SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'collections' && (
        <>
          {/* Recent Invoices + Overdue Payments */}
          <div className="row">
            <div className="col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Recent Invoices</h4>
                  <Link to="/finance/invoices" className="btn btn-sm btn-primary">View All</Link>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>Invoice #</th><th>School</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
                      <tbody>
                        {recentInvoices.map((inv: any, i: number) => (
                          <tr key={i}>
                            <td className="fw-semibold">{inv.invoiceNo}</td>
                            <td>{inv.school}</td>
                            <td>${Number(inv.amount).toLocaleString()}</td>
                            <td><small className="text-muted">{inv.date}</small></td>
                            <td><span className={`badge ${inv.statusClass}`}>{inv.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Overdue Payments</h4>
                  <span className="badge bg-danger">{overduePayments.length} Overdue</span>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>School</th><th>Amount</th><th>Days</th></tr></thead>
                      <tbody>
                        {overduePayments.map((payment: any, i: number) => (
                          <tr key={i}>
                            <td className="fw-semibold" style={{ fontSize: 13 }}>{payment.school}</td>
                            <td><span className="badge badge-soft-danger">${Number(payment.amount).toLocaleString()}</span></td>
                            <td><small className="text-muted">{payment.days} days</small></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Link to="/finance/overdue" className="btn btn-warning btn-sm w-100 mt-3">
                    <i className="ti ti-send me-1" />Send Reminders
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default InstituteFinanceDashboardPage
