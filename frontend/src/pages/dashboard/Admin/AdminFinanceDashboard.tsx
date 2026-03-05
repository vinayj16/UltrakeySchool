/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import adminAnalyticsService from '../../../services/adminAnalyticsService'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

// ─── COMPONENT ────────────────────────────────────────────────────────────────
const AdminFinanceDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview')
  const [reminderSent, setReminderSent]   = useState<Record<string, boolean>>({})
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddFee, setShowAddFee]         = useState(false)
  const [expenseForm, setExpenseForm]       = useState({ category: '', desc: '', amount: '', date: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [financeData, setFinanceData] = useState<any>(null)
  const period = 'month' // Fixed period for now

  // Fetch finance data on component mount
  useEffect(() => {
    fetchFinanceData()
  }, [period])

  const fetchFinanceData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch fees analytics data
      const response = await adminAnalyticsService.getFeesAnalytics(period)
      
      if (response.success && response.data) {
        setFinanceData(response.data)
        toast.success('Finance data loaded successfully')
      }
    } catch (err: any) {
      console.error('Error fetching finance data:', err)
      setError(err.message || 'Failed to load finance data')
      toast.error('Failed to load finance data')
    } finally {
      setLoading(false)
    }
  }

  const sendReminder = async (name: string) => {
    try {
      const response = await adminAnalyticsService.sendFeeReminders()
      if (response.success) {
        setReminderSent(prev => ({ ...prev, [name]: true }))
        toast.success('Fee reminder sent successfully')
      }
    } catch (err: any) {
      console.error('Error sending reminder:', err)
      toast.error('Failed to send fee reminder')
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
        <button className="btn btn-sm btn-danger ms-3" onClick={fetchFinanceData}>
          <i className="ti ti-refresh me-1" />Retry
        </button>
      </div>
    )
  }

  // Transform backend data for UI - using empty arrays/objects as fallbacks
  const finSummary = financeData?.summary || []
  const monthlyFeeTrend = financeData?.monthlyTrend || []
  const paymentMode = financeData?.paymentModes || []
  const C = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'] // Chart colors
  const recentTransactions = financeData?.recentTransactions || []
  const installmentData = financeData?.installmentData || []
  const classCollection = financeData?.classCollection || []
  const scholarshipStudents = financeData?.scholarshipStudents || []
  const pendingByGrade = financeData?.pendingByGrade || []
  const overdueList = financeData?.overdueStudents || []
  const expensePie = financeData?.expenseCategories || []
  const monthlyExpenseTrend = financeData?.monthlyExpenses || []
  const expenseRecords = financeData?.recentExpenses || []
  const payrollSummary = financeData?.payrollSummary || []
  const staffPayroll = financeData?.staffPayroll || []
  const overBudgetAlerts = financeData?.budgetAlerts || []
  const budgetVsActual = financeData?.budgetComparison || []
  const yearlyBudget = financeData?.yearlyBudget || []
  const reportTypes = financeData?.reportTypes || []
  const auditLog = financeData?.auditLog || []
  const expenseCategories = financeData?.expenseCategories || []

  const navSections = [
    { id: 'overview',  label: 'Overview',         icon: 'ti ti-layout-dashboard'   },
    { id: 'collection',label: 'Fee Collection',   icon: 'ti ti-currency-dollar'    },
    { id: 'pending',   label: 'Pending Fees',     icon: 'ti ti-alert-circle'       },
    { id: 'expenses',  label: 'Expenses',         icon: 'ti ti-receipt'            },
    { id: 'payroll',   label: 'Salary & Payroll', icon: 'ti ti-users'              },
    { id: 'budget',    label: 'Budget vs Actual', icon: 'ti ti-scale'              },
    { id: 'reports',   label: 'Reports',          icon: 'ti ti-report-analytics'   },
  ]

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Finance Dashboard</h3>
          <nav><ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Finance</li>
          </ol></nav>
        </div>
        {/* Quick Action Buttons */}
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
          <button className="btn btn-primary d-flex align-items-center" onClick={() => setShowAddFee(true)}>
            <i className="ti ti-plus me-1" />Collect Fee
          </button>
          <button className="btn btn-warning d-flex align-items-center" onClick={() => setShowAddExpense(true)}>
            <i className="ti ti-receipt me-1" />Add Expense
          </button>
          <Link to="/finance/reports/daily" className="btn btn-success d-flex align-items-center">
            <i className="ti ti-download me-1" />Export PDF
          </Link>
          <Link to="/finance/reports/export" className="btn btn-info text-white d-flex align-items-center">
            <i className="ti ti-table-export me-1" />Export Excel
          </Link>
        </div>
      </div>

      {/* ── SECTION NAV ── */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-2">
              <ul className="nav nav-pills flex-wrap gap-1">
                {navSections.map(s => (
                  <li key={s.id} className="nav-item">
                    <a href="#"
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

      {/* ══════════ ① OVERVIEW ══════════ */}
      {activeSection === 'overview' && (
        <>
          {/* 6 Summary Cards */}
          <div className="row">
            {finSummary.map((stat: any) => (
              <div key={stat.label} className="col-xxl-2 col-xl-4 col-sm-6 d-flex">
                <div className="card flex-fill animate-card border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <div className={`avatar avatar-lg ${stat.avatarTone} rounded d-flex align-items-center justify-content-center me-2 flex-shrink-0`}>
                        <i className={`${stat.icon} fs-20`} />
                      </div>
                      <div className="overflow-hidden flex-fill">
                        <div className="d-flex align-items-center justify-content-between">
                          <h4 className="mb-0 counter">{stat.value}</h4>
                          <span className={`badge ${stat.deltaTone}`} style={{ fontSize: 10 }}>{stat.delta}</span>
                        </div>
                        <p className="mb-0" style={{ fontSize: 11 }}>{stat.label}</p>
                      </div>
                    </div>
                    <div className="border-top pt-2">
                      <small className="text-muted">{stat.sub}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Collection vs Expenses Area + Payment Mode Pie */}
          <div className="row">
            <div className="col-xl-8 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Collection vs Expenses (Monthly)</h4>
                  <div className="dropdown">
                    <a href="#" className="bg-white dropdown-toggle" data-bs-toggle="dropdown"><i className="ti ti-calendar me-1" />Last 9 Months</a>
                    <ul className="dropdown-menu mt-2 p-3">
                      {['Last 6 Months','Last 9 Months','This Year'].map(o => <li key={o}><a href="#" className="dropdown-item rounded-1">{o}</a></li>)}
                    </ul>
                  </div>
                </div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={monthlyFeeTrend}>
                      <defs>
                        <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}   />
                        </linearGradient>
                        <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}    />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v || 0)/1000}k`} />
                      <Tooltip formatter={(v,n) => [`$${(v || 0).toLocaleString()}`,n]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Area type="monotone" dataKey="collected" name="Collected" stroke="#6366f1" strokeWidth={2.5} fill="url(#colGrad)" dot={false} />
                      <Area type="monotone" dataKey="expenses"  name="Expenses"  stroke="#ef4444" strokeWidth={2}   fill="url(#expGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-4 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Payment Mode Distribution</h4></div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={paymentMode} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                        {paymentMode.map((_: any, i: number) => <Cell key={i} fill={C[i]} />)}
                      </Pie>
                      <Tooltip formatter={(v,n) => [`${v}%`,n]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="row g-2 mt-1">
                    {paymentMode.map((p: any, i: number) => (
                      <div key={p.name} className="col-6">
                        <div className="border rounded p-2 text-center">
                          <div className="fw-semibold" style={{ color: C[i], fontSize: 16 }}>{p.value}%</div>
                          <small className="text-muted">{p.name}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Transactions + Installment Status */}
          <div className="row">
            <div className="col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Today's Transactions</h4>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-primary" onClick={() => setShowAddFee(true)}><i className="ti ti-plus me-1" />Collect Fee</button>
                    <Link to="/finance/transactions" className="btn btn-sm btn-light">View All</Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>Txn ID</th><th>Student</th><th>Class</th><th>Amount</th><th>Mode</th><th>Time</th><th>Receipt</th></tr></thead>
                      <tbody>
                        {recentTransactions.map((t: any, i: number) => (
                          <tr key={i}>
                            <td><span className={`badge ${t.cls2}`}>{t.id}</span></td>
                            <td className="fw-semibold" style={{ fontSize: 13 }}>{t.student}</td>
                            <td>{t.cls}</td>
                            <td className="text-success fw-semibold">{t.amount}</td>
                            <td><span className="badge bg-light text-dark">{t.mode}</span></td>
                            <td><small className="text-muted">{t.time}</small></td>
                            <td><button className="btn btn-sm btn-light px-2 py-1"><i className="ti ti-printer" /></button></td>
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
                <div className="card-header"><h4 className="card-title">Term-wise Collection Status</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={installmentData} barSize={32} barGap={4}>
                      <XAxis dataKey="term" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v || 0)/1000}k`} />
                      <Tooltip formatter={(v,n) => [`$${(v || 0).toLocaleString()}`,n]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="collected" name="Collected" fill="#6366f1" radius={[6,6,0,0]} />
                      <Bar dataKey="target"    name="Target"    fill="#e0e7ff" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════ ② FEE COLLECTION ══════════ */}
      {activeSection === 'collection' && (
        <>
          {/* Class-wise Bar + Monthly Line */}
          <div className="row">
            <div className="col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Class-wise Fee Collection</h4>
                  <div className="dropdown">
                    <a href="#" className="bg-white dropdown-toggle" data-bs-toggle="dropdown"><i className="ti ti-calendar me-1" />February</a>
                    <ul className="dropdown-menu mt-2 p-3">
                      {['January','February','March','April'].map(o => <li key={o}><a href="#" className="dropdown-item rounded-1">{o}</a></li>)}
                    </ul>
                  </div>
                </div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={classCollection} barSize={20} barGap={4}>
                      <XAxis dataKey="cls" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v || 0)/1000}k`} />
                      <Tooltip formatter={(v,n) => [`$${(v || 0).toLocaleString()}`,n]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="collected" name="Collected" fill="#6366f1" radius={[6,6,0,0]} />
                      <Bar dataKey="pending"   name="Pending"   fill="#ef4444" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Monthly Fee Trend</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={monthlyFeeTrend}>
                      <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v || 0)/1000}k`} />
                      <Tooltip formatter={(v,n) => [`$${(v || 0).toLocaleString()}`,n]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="collected" name="Collected" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1' }} />
                      <Line type="monotone" dataKey="expenses"  name="Expenses"  stroke="#ef4444" strokeWidth={2}   dot={{ r: 3, fill: '#ef4444' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Scholarship Students */}
          <div className="row">
            <div className="col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Scholarship / Concession Students</h4>
                  <span className="badge bg-info">{scholarshipStudents.length} Students</span>
                </div>
                <div className="card-body">
                  <ul className="list-group">
                    {scholarshipStudents.map((s: any, i: number) => (
                      <li key={i} className="list-group-item d-flex align-items-center justify-content-between">
                        <div>
                          <p className="mb-0 fw-semibold" style={{ fontSize: 13 }}>{s.name} <small className="text-muted">({s.cls})</small></p>
                          <small className="text-muted">{s.type} Scholarship</small>
                        </div>
                        <div className="text-end">
                          <div className="fw-semibold text-success">{s.amount}</div>
                          <span className={`badge ${s.cls2}`}>{s.pct} waiver</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Recent Transactions</h4>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-primary" onClick={() => setShowAddFee(true)}><i className="ti ti-plus me-1" />Collect Fee</button>
                    <button className="btn btn-sm btn-success"><i className="ti ti-download me-1" />Export</button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>Txn ID</th><th>Student</th><th>Amount</th><th>Mode</th><th>Time</th><th>Action</th></tr></thead>
                      <tbody>
                        {recentTransactions.map((t: any, i: number) => (
                          <tr key={i}>
                            <td><span className={`badge ${t.cls2}`}>{t.id}</span></td>
                            <td>{t.student} <small className="text-muted">({t.cls})</small></td>
                            <td className="text-success fw-semibold">{t.amount}</td>
                            <td><span className="badge bg-light text-dark">{t.mode}</span></td>
                            <td><small className="text-muted">{t.time}</small></td>
                            <td>
                              <div className="d-flex gap-1">
                                <button className="btn btn-sm btn-light px-2 py-1"><i className="ti ti-printer" /></button>
                                <button className="btn btn-sm btn-warning px-2 py-1"><i className="ti ti-edit" /></button>
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

      {/* ══════════ ③ PENDING FEES ══════════ */}
      {activeSection === 'pending' && (
        <>
          {/* Pending by Grade Bar */}
          <div className="row">
            <div className="col-xl-8 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Pending Fees by Grade</h4>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-warning"><i className="ti ti-send me-1" />Send All Reminders</button>
                    <button className="btn btn-sm btn-success"><i className="ti ti-download me-1" />Download Report</button>
                    <button className="btn btn-sm btn-info text-white"><i className="ti ti-table-export me-1" />Export Excel</button>
                  </div>
                </div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={pendingByGrade} barSize={32}>
                      <XAxis dataKey="grade" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v || 0)/1000}k`} />
                      <Tooltip formatter={(v) => [`$${(v || 0).toLocaleString()}`,'Pending']} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Bar dataKey="pending" name="Pending Fees" fill="#ef4444" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-4 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Pending Summary</h4></div>
                <div className="card-body">
                  {[
                    { lbl: 'Total Pending', val: '$32,400', tone: 'text-danger fw-bold fs-4'    },
                    { lbl: 'Students > 60 days', val: '38 students', tone: 'text-danger fw-semibold' },
                    { lbl: 'Students 30–60 days', val: '52 students', tone: 'text-warning fw-semibold'},
                    { lbl: 'Students < 30 days',  val: '34 students', tone: 'text-info fw-semibold'   },
                    { lbl: 'Reminders Sent',       val: '86 / 124',   tone: 'text-success fw-semibold'},
                  ].map((r, i: number) => (
                    <div key={i} className={`d-flex justify-content-between align-items-center py-2 ${i < 4 ? 'border-bottom' : ''}`}>
                      <p className="mb-0 text-muted">{r.lbl}</p>
                      <span className={r.tone}>{r.val}</span>
                    </div>
                  ))}
                  <button className="btn btn-warning w-100 mt-3"><i className="ti ti-send me-1" />Send All Reminders</button>
                  <button className="btn btn-light w-100 mt-2"><i className="ti ti-calculator me-1" />Auto Late Fee Calc</button>
                </div>
              </div>
            </div>
          </div>

          {/* Overdue Students Table */}
          <div className="row">
            <div className="col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Overdue Students List</h4>
                  <div className="d-flex gap-2">
                    <span className="badge bg-danger me-1">{overdueList.length} Overdue</span>
                    <button className="btn btn-sm btn-success"><i className="ti ti-download me-1" />Download PDF</button>
                    <button className="btn btn-sm btn-info text-white"><i className="ti ti-table-export me-1" />Export Excel</button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead>
                        <tr><th>Student</th><th>Class</th><th>Pending Amount</th><th>Days Overdue</th><th>Reminder Status</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {overdueList.map((s: any, i: number) => (
                          <tr key={i}>
                            <td className="fw-semibold">{s.name}</td>
                            <td>{s.cls}</td>
                            <td className="text-danger fw-semibold">{s.amount}</td>
                            <td><span className={`badge ${s.cls2}`}>{s.days} days</span></td>
                            <td>
                              {s.remSent || reminderSent[s.name]
                                ? <span className="badge badge-soft-success"><i className="ti ti-check me-1" />Sent</span>
                                : <span className="badge badge-soft-secondary">Not Sent</span>
                              }
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <button className="btn btn-sm btn-warning px-2 py-1" onClick={() => sendReminder(s.name)}>
                                  <i className="ti ti-send" />
                                </button>
                                <Link to="/fees/collect" className="btn btn-sm btn-success px-2 py-1">Collect</Link>
                                <button className="btn btn-sm btn-info px-2 py-1 text-white"><i className="ti ti-eye" /></button>
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

      {/* ══════════ ④ EXPENSES ══════════ */}
      {activeSection === 'expenses' && (
        <>
          {/* Expense Summary Cards */}
          <div className="row mb-3">
            {[
              { label: 'Total Expenses (Month)', value: '$42,800', tone: 'bg-danger',   icon: 'ti ti-receipt'         },
              { label: 'Largest Category',       value: 'Salaries', tone: 'bg-warning',  icon: 'ti ti-users'           },
              { label: 'Pending Approvals',      value: '3',        tone: 'bg-info',     icon: 'ti ti-clock'           },
              { label: 'Over Budget Categories', value: '3',        tone: 'bg-secondary',icon: 'ti ti-alert-triangle'  },
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

          {/* Expense Pie + Monthly Trend */}
          <div className="row">
            <div className="col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Expense Category Distribution</h4></div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={expensePie} cx="50%" cy="50%" outerRadius={85} paddingAngle={3} dataKey="value">
                        {expensePie.map((_: any, i: number) => <Cell key={i} fill={C[i]} />)}
                      </Pie>
                      <Tooltip formatter={(v,n) => [`${v}%`,n]} contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Monthly Expense Trend</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={monthlyExpenseTrend}>
                      <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v || 0)/1000}k`} />
                      <Tooltip formatter={(v) => [`$${(v || 0).toLocaleString()}`,'Expenses']} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Line type="monotone" dataKey="v" name="Expenses" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3, fill: '#ef4444' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Expense Records Table */}
          <div className="row">
            <div className="col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Expense Records</h4>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-warning" onClick={() => setShowAddExpense(true)}><i className="ti ti-plus me-1" />Add Expense</button>
                    <button className="btn btn-sm btn-success"><i className="ti ti-download me-1" />Export PDF</button>
                    <button className="btn btn-sm btn-info text-white"><i className="ti ti-table-export me-1" />Export Excel</button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>Exp ID</th><th>Category</th><th>Description</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                      <tbody>
                        {expenseRecords.map((e: any, i: number) => (
                          <tr key={i}>
                            <td><span className="badge badge-soft-secondary">{e.id}</span></td>
                            <td><span className="badge badge-soft-primary">{e.category}</span></td>
                            <td style={{ fontSize: 13 }}>{e.desc}</td>
                            <td className="text-danger fw-semibold">{e.amount}</td>
                            <td><small className="text-muted">{e.date}</small></td>
                            <td><span className={`badge ${e.cls2}`}>{e.status}</span></td>
                            <td>
                              <div className="d-flex gap-1">
                                <button className="btn btn-sm btn-warning px-2 py-1"><i className="ti ti-edit" /></button>
                                <button className="btn btn-sm btn-danger  px-2 py-1"><i className="ti ti-trash" /></button>
                                <button className="btn btn-sm btn-light   px-2 py-1"><i className="ti ti-eye" /></button>
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

      {/* ══════════ ⑤ SALARY & PAYROLL ══════════ */}
      {activeSection === 'payroll' && (
        <>
          <div className="row mb-3">
            {payrollSummary.map((c: any) => (
              <div key={c.label} className="col-xl-3 col-sm-6 d-flex">
                <div className="card flex-fill animate-card border-0">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div><h2 className="mb-0">{c.value}</h2><p className="mb-0">{c.label}</p><small className="text-muted">{c.sub}</small></div>
                    <div className={`avatar avatar-xl ${c.tone} rounded d-flex align-items-center justify-content-center flex-shrink-0`}>
                      <i className={`${c.icon} fs-24 text-white`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Staff-wise Salary Report – February 2025</h4>
                  <div className="d-flex gap-2">
                    <div className="dropdown">
                      <a href="#" className="btn btn-sm btn-light dropdown-toggle" data-bs-toggle="dropdown"><i className="ti ti-calendar me-1" />February 2025</a>
                      <ul className="dropdown-menu mt-2 p-3">
                        {['January 2025','February 2025','March 2025'].map(o => <li key={o}><a href="#" className="dropdown-item rounded-1">{o}</a></li>)}
                      </ul>
                    </div>
                    <button className="btn btn-sm btn-success"><i className="ti ti-download me-1" />Export Payroll</button>
                    <button className="btn btn-sm btn-primary"><i className="ti ti-send me-1" />Process Pending</button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>Name</th><th>Dept</th><th>Role</th><th>Gross Salary</th><th>Deductions</th><th>Net Salary</th><th>Status</th><th>Actions</th></tr></thead>
                      <tbody>
                        {staffPayroll.map((s: any, i: number) => (
                          <tr key={i}>
                            <td className="fw-semibold">{s.name}</td>
                            <td>{s.dept}</td>
                            <td><small className="text-muted">{s.role}</small></td>
                            <td>{s.gross}</td>
                            <td className="text-danger">{s.deduct}</td>
                            <td className="text-success fw-semibold">{s.net}</td>
                            <td><span className={`badge ${s.cls2}`}>{s.status}</span></td>
                            <td>
                              <div className="d-flex gap-1">
                                <button className="btn btn-sm btn-light px-2 py-1"><i className="ti ti-printer" /></button>
                                <button className="btn btn-sm btn-warning px-2 py-1"><i className="ti ti-edit" /></button>
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

      {/* ══════════ ⑥ BUDGET vs ACTUAL ══════════ */}
      {activeSection === 'budget' && (
        <>
          {/* Over Budget Alerts */}
          {overBudgetAlerts.length > 0 && (
            <div className="row mb-3">
              <div className="col-md-12">
                <div className="card border-danger">
                  <div className="card-header d-flex align-items-center justify-content-between bg-danger-transparent">
                    <h4 className="card-title text-danger"><i className="ti ti-alert-triangle me-2" />Over Budget Alerts</h4>
                    <span className="badge bg-danger">{overBudgetAlerts.length} Categories Over Budget</span>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      {overBudgetAlerts.map((a: any, i: number) => (
                        <div key={i} className="col-xl-4 col-md-6">
                          <div className="alert alert-danger d-flex align-items-start mb-0" role="alert">
                            <i className="ti ti-trending-up fs-18 me-2 flex-shrink-0 mt-1" />
                            <div>
                              <div className="fw-semibold">{a.category} – Over Budget</div>
                              <div style={{ fontSize: 12 }}>Budget: {a.budget} → Actual: {a.actual}</div>
                              <span className="badge bg-danger mt-1">{a.overage} over</span>
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

          {/* Budget vs Actual Bar + Yearly Trend */}
          <div className="row">
            <div className="col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Budget vs Actual – This Month</h4>
                </div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={budgetVsActual} barSize={22} barGap={4}>
                      <XAxis dataKey="dept" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v || 0)/1000}k`} />
                      <Tooltip formatter={(v,n) => [`$${(v || 0).toLocaleString()}`,n]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="budget" name="Budget" fill="#6366f1" radius={[6,6,0,0]} />
                      <Bar dataKey="actual" name="Actual" fill="#10b981" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="col-xl-6 d-flex">
              <div className="card flex-fill">
                <div className="card-header"><h4 className="card-title">Yearly Budget vs Actual Trend</h4></div>
                <div className="card-body pb-0">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={yearlyBudget}>
                      <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v || 0)/1000}k`} />
                      <Tooltip formatter={(v,n) => [`$${(v || 0).toLocaleString()}`,n]} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="budget" name="Budget" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="actual" name="Actual" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Variance Table */}
          <div className="row">
            <div className="col-md-12 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Variance Analysis</h4>
                  <button className="btn btn-sm btn-success"><i className="ti ti-download me-1" />Export Budget Report</button>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>Category</th><th>Planned Budget</th><th>Actual Spending</th><th>Variance</th><th>Status</th></tr></thead>
                      <tbody>
                        {budgetVsActual.map((b: any, i: number) => (
                          <tr key={i}>
                            <td className="fw-semibold">{b.dept}</td>
                            <td>${b.budget.toLocaleString()}</td>
                            <td>${b.actual.toLocaleString()}</td>
                            <td className={b.variance >= 0 ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
                              {b.variance >= 0 ? '+' : ''}{b.variance >= 0 ? `Saved $${b.variance}` : `Over $${Math.abs(b.variance)}`}
                            </td>
                            <td>
                              <span className={`badge ${b.variance >= 0 ? 'badge-soft-success' : 'badge-soft-danger'}`}>
                                {b.variance >= 0 ? 'Under Budget' : 'Over Budget'}
                              </span>
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

      {/* ══════════ ⑦ REPORTS ══════════ */}
      {activeSection === 'reports' && (
        <>
          {/* Report Cards Grid */}
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Generate & Download Reports</h4>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-success"><i className="ti ti-file-type-pdf me-1" />Export PDF</button>
                    <button className="btn btn-sm btn-info text-white"><i className="ti ti-table-export me-1" />Export Excel</button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    {reportTypes.map((r: any) => (
                      <div key={r.label} className="col-xxl-4 col-xl-6 col-md-6">
                        <Link to={r.to} className={`d-flex align-items-start ${r.bg} border ${r.border} rounded p-3 class-hover`} style={{ textDecoration: 'none' }}>
                          <div className={`avatar avatar-lg ${r.border.replace('border-','bg-')} rounded me-3 d-flex align-items-center justify-content-center flex-shrink-0`}>
                            <i className={`${r.icon} fs-20 text-white`} />
                          </div>
                          <div className="flex-fill overflow-hidden">
                            <div className="d-flex align-items-center mb-1">
                              <h6 className="mb-0 me-2">{r.label}</h6>
                              {r.badge && <span className="badge bg-primary" style={{ fontSize: 10 }}>{r.badge}</span>}
                            </div>
                            <p className="text-muted mb-0" style={{ fontSize: 12 }}>{r.desc}</p>
                          </div>
                          <i className="ti ti-chevron-right text-muted ms-2 flex-shrink-0" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* P&L Quick Summary */}
          <div className="row">
            <div className="col-xl-5 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title">Profit & Loss – February 2025</h4>
                  <button className="btn btn-sm btn-success"><i className="ti ti-download me-1" />Download P&L</button>
                </div>
                <div className="card-body">
                  {[
                    { lbl: 'Fee Revenue',     val: '+$64,200', cls: 'text-success'               },
                    { lbl: 'Other Income',    val: '+$3,800',  cls: 'text-success'               },
                    { lbl: 'Total Income',    val: '+$68,000', cls: 'text-success fw-bold fs-5'  },
                    { lbl: '──────',          val: '',         cls: ''                            },
                    { lbl: 'Staff Salary',    val: '-$24,800', cls: 'text-danger'                },
                    { lbl: 'Maintenance',     val: '-$5,800',  cls: 'text-danger'                },
                    { lbl: 'Electricity',     val: '-$3,400',  cls: 'text-danger'                },
                    { lbl: 'Transport',       val: '-$4,200',  cls: 'text-danger'                },
                    { lbl: 'Events & Misc',   val: '-$4,600',  cls: 'text-danger'                },
                    { lbl: 'Total Expenses',  val: '-$42,800', cls: 'text-danger fw-bold fs-5'   },
                    { lbl: '──────',          val: '',         cls: ''                            },
                    { lbl: 'NET PROFIT',      val: '+$25,200', cls: 'text-success fw-bold fs-4'  },
                  ].map((r, i: number) => r.lbl === '──────'
                    ? <hr key={i} className="my-1" />
                    : (
                      <div key={i} className="d-flex justify-content-between align-items-center py-1">
                        <p className="mb-0 text-muted">{r.lbl}</p>
                        <span className={r.cls}>{r.val}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Audit Log */}
            <div className="col-xl-7 d-flex">
              <div className="card flex-fill">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="card-title"><i className="ti ti-shield-check me-2 text-success" />Audit Log – Who Edited What</h4>
                  <Link to="/finance/audit" className="btn btn-sm btn-light">View Full Log</Link>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead><tr><th>User</th><th>Action</th><th>Record</th><th>Time</th><th>Type</th></tr></thead>
                      <tbody>
                        {auditLog.map((a: any, i: number) => (
                          <tr key={i}>
                            <td className="fw-semibold" style={{ fontSize: 13 }}>{a.user}</td>
                            <td style={{ fontSize: 13 }}>{a.action}</td>
                            <td><span className={`badge ${a.cls2}`}>{a.record}</span></td>
                            <td><small className="text-muted">{a.time}</small></td>
                            <td><i className="ti ti-check text-success" /></td>
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

      {/* ── ADD EXPENSE MODAL ── */}
      {showAddExpense && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="ti ti-receipt me-2" />Add New Expense</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddExpense(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Expense Category <span className="text-danger">*</span></label>
                  <select className="form-select" value={expenseForm.category} onChange={e => setExpenseForm(p => ({ ...p, category: e.target.value }))}>
                    <option value="">Select Category</option>
                    {expenseCategories.map((c: any) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="Enter expense description" value={expenseForm.desc} onChange={e => setExpenseForm(p => ({ ...p, desc: e.target.value }))} />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Amount ($) <span className="text-danger">*</span></label>
                    <input type="number" className="form-control" placeholder="0.00" value={expenseForm.amount} onChange={e => setExpenseForm(p => ({ ...p, amount: e.target.value }))} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date <span className="text-danger">*</span></label>
                    <input type="date" className="form-control" value={expenseForm.date} onChange={e => setExpenseForm(p => ({ ...p, date: e.target.value }))} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Payment Method</label>
                  <select className="form-select">
                    <option>Bank Transfer</option>
                    <option>Cash</option>
                    <option>Cheque</option>
                    <option>UPI</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Remarks / Notes</label>
                  <textarea className="form-control" rows={2} placeholder="Optional notes..." />
                </div>
                <div className="mb-3">
                  <label className="form-label">Upload Receipt</label>
                  <input type="file" className="form-control" accept=".pdf,.jpg,.png" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddExpense(false)}>Cancel</button>
                <button type="button" className="btn btn-warning" onClick={() => setShowAddExpense(false)}><i className="ti ti-plus me-1" />Add Expense</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── COLLECT FEE MODAL ── */}
      {showAddFee && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="ti ti-currency-dollar me-2" />Collect Fee</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddFee(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Student Name / ID <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="Search student name or ID..." />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Class</label>
                    <select className="form-select">
                      <option>Select Class</option>
                      {['Class I','Class II','Class III','Class IV','Class V','Class VI','Class VII','Class VIII'].map((c: any) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Section</label>
                    <select className="form-select">
                      <option>A</option><option>B</option><option>C</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Fee Type <span className="text-danger">*</span></label>
                  <select className="form-select">
                    <option>Term Fee</option>
                    <option>Annual Fee</option>
                    <option>Transport Fee</option>
                    <option>Exam Fee</option>
                    <option>Late Fine</option>
                  </select>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Amount ($) <span className="text-danger">*</span></label>
                    <input type="number" className="form-control" placeholder="0.00" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Payment Mode <span className="text-danger">*</span></label>
                    <select className="form-select">
                      <option>Cash</option>
                      <option>UPI</option>
                      <option>Online</option>
                      <option>Bank Transfer</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Transaction / Receipt No.</label>
                  <input type="text" className="form-control" placeholder="Auto-generated if blank" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Remarks</label>
                  <textarea className="form-control" rows={2} placeholder="Optional..." />
                </div>
                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" defaultChecked />
                  <label className="form-check-label">Send SMS/Email receipt to parent</label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddFee(false)}>Cancel</button>
                <button type="button" className="btn btn-light" onClick={() => setShowAddFee(false)}><i className="ti ti-printer me-1" />Save & Print</button>
                <button type="button" className="btn btn-primary" onClick={() => setShowAddFee(false)}><i className="ti ti-check me-1" />Collect Fee</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminFinanceDashboard