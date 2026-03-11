import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import agentService, { type Agent } from '../../services/agentService'

const AgentsManagementPage: React.FC = () => {
  const navigate = useNavigate()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true)
        setError(null)
        const agentsData = await agentService.getAll()
        setAgents(agentsData)
      } catch (err: any) {
        console.error('Error fetching agents:', err)
        setError(err.message || 'Failed to fetch agents')
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  // Filter and search agents
  const filteredAgents = useMemo(() => {
    let filtered = agents

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(agent => agent.status === filterStatus)
    }

    // Search
    if (searchTerm) {
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.phone.includes(searchTerm) ||
        agent.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.state.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [agents, filterStatus, searchTerm])

  const handleSelectAgent = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      setSelectedAgents(selectedAgents.filter(id => id !== agentId))
    } else {
      setSelectedAgents([...selectedAgents, agentId])
    }
  }

  const handleSelectAll = () => {
    setSelectedAgents(filteredAgents.map(agent => agent._id))
  }

  // Action handlers
  const handleEditAgent = (agentId: string) => {
    navigate(`/super-admin/agents/${agentId}/edit`)
  }

  const handleViewDetails = (agentId: string) => {
    navigate(`/super-admin/agents/${agentId}`)
  }

  const handleDeleteAgent = async (agentId: string) => {
    if (window.confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      try {
        await agentService.delete(agentId)
        setAgents(prevAgents => prevAgents.filter(agent => agent._id !== agentId))
        setSelectedAgents(prevSelected => prevSelected.filter(id => id !== agentId))
        alert('Agent deleted successfully')
      } catch (error: any) {
        console.error('Error deleting agent:', error)
        alert(error.message || 'Failed to delete agent')
      }
    }
  }

  const handleBulkActivate = async () => {
    try {
      // For now, we'll update locally. In a real implementation, you'd have a bulk update API
      const updatedAgents = agents.map(agent => {
        if (selectedAgents.includes(agent._id)) {
          return { ...agent, status: 'Active' as const }
        }
        return agent
      })
      setAgents(updatedAgents)
      alert(`Activated ${selectedAgents.length} agents`)
      setSelectedAgents([])
    } catch (error: any) {
      console.error('Error activating agents:', error)
      alert('Failed to activate agents')
    }
  }

  const handleBulkSuspend = async () => {
    if (window.confirm(`Are you sure you want to suspend ${selectedAgents.length} agents?`)) {
      try {
        // For now, we'll update locally. In a real implementation, you'd have a bulk update API
        const updatedAgents = agents.map(agent => {
          if (selectedAgents.includes(agent._id)) {
            return { ...agent, status: 'Suspended' as const }
          }
          return agent
        })
        setAgents(updatedAgents)
        alert(`Suspended ${selectedAgents.length} agents`)
        setSelectedAgents([])
      } catch (error: any) {
        console.error('Error suspending agents:', error)
        alert('Failed to suspend agents')
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Active': { bg: 'bg-success', text: 'text-white' },
      'Suspended': { bg: 'bg-warning', text: 'text-dark' },
      'Inactive': { bg: 'bg-secondary', text: 'text-white' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Inactive']
    return <span className={`badge ${config.bg} ${config.text}`}>{status}</span>
  }

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
              <h5 className="text-muted">Loading agents...</h5>
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
              <h5 className="text-danger">Error Loading Agents</h5>
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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Agents Management</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href="/super-admin/dashboard">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">Agents</li>
                </ol>
              </nav>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-primary d-flex align-items-center"
                onClick={() => navigate('/super-admin/agents/add')}
              >
                <i className="ti ti-user-plus me-2" />Add Agent
              </button>
              <button className="btn btn-outline-success d-flex align-items-center">
                <i className="ti ti-download me-2" />Export
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="card mb-3">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Search</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="ti ti-search" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search agents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">&nbsp;</label>
                  <div className="d-flex gap-2">
                    {selectedAgents.length > 0 && (
                      <>
                        <button className="btn btn-success btn-sm" onClick={handleBulkActivate}>
                          <i className="ti ti-check me-1" />Activate ({selectedAgents.length})
                        </button>
                        <button className="btn btn-warning btn-sm" onClick={handleBulkSuspend}>
                          <i className="ti ti-pause me-1" />Suspend ({selectedAgents.length})
                        </button>
                      </>
                    )}
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => setSelectedAgents([])}>
                      <i className="ti ti-refresh me-1" />Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agents Table */}
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedAgents.length === filteredAgents.length && filteredAgents.length > 0}
                            onChange={handleSelectAll}
                          />
                        </div>
                      </th>
                      <th>Agent Details</th>
                      <th>Status</th>
                      <th>Commission</th>
                      <th>Created Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAgents.map((agent) => (
                      <tr key={agent._id}>
                        <td>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={selectedAgents.includes(agent._id)}
                              onChange={() => handleSelectAgent(agent._id)}
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="fw-semibold">{agent.name}</div>
                            <div className="text-muted small">{agent.email}</div>
                            <div className="text-muted small">{agent.phone}</div>
                            <div className="text-muted small">{agent.city}, {agent.state}</div>
                          </div>
                        </td>
                        <td>{getStatusBadge(agent.status)}</td>
                        <td>
                          <div className="fw-semibold">{agent.commissionRate}%</div>
                          <div className="text-muted small">commission rate</div>
                        </td>
                        <td>
                          <div className="text-muted small">{new Date(agent.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td>
                          <div className="dropdown">
                            <button
                              className="btn btn-sm btn-outline-secondary dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              <i className="ti ti-dots-vertical" />
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button className="dropdown-item" onClick={() => handleViewDetails(agent._id)}>
                                  <i className="ti ti-eye me-2" />View Details
                                </button>
                              </li>
                              <li>
                                <button className="dropdown-item" onClick={() => handleEditAgent(agent._id)}>
                                  <i className="ti ti-edit me-2" />Edit
                                </button>
                              </li>
                              <li><hr className="dropdown-divider" /></li>
                              <li>
                                <button className="dropdown-item text-danger" onClick={() => handleDeleteAgent(agent._id)}>
                                  <i className="ti ti-trash me-2" />Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredAgents.length === 0 && (
                <div className="text-center py-5">
                  <i className="ti ti-user-off fs-48 text-muted mb-3 d-block" />
                  <h5 className="text-muted">No agents found</h5>
                  <p className="text-muted">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Institution {
  id: string
  name: string
  type: string
  plan: string
  status: 'Active' | 'Suspended' | 'Expired'
  subscriptionExpiry: string
  autoRenew: boolean
  lastPaymentDate: string
  nextPaymentDate: string
  overdueAmount: number
  contactEmail: string
  contactPhone: string
}

interface ExpiryAlert {
  id: string
  institutionId: string
  institutionName: string
  daysUntilExpiry: number
  expiryDate: string
  plan: string
  amount: number
  autoRenew: boolean
  status: 'pending' | 'renewed' | 'expired'
  reminderSent: boolean
  lastReminderDate?: string
}

interface OverduePayment {
  id: string
  institutionId: string
  institutionName: string
  amount: number
  dueDate: string
  daysOverdue: number
  plan: string
  status: 'overdue' | 'paid' | 'cancelled'
  paymentMethod: string
  reminderCount: number
  lastReminderDate?: string
}

interface RenewalReminder {
  id: string
  institutionId: string
  institutionName: string
  expiryDate: string
  daysUntilExpiry: number
  plan: string
  renewalAmount: number
  status: 'scheduled' | 'sent' | 'acknowledged'
  nextReminderDate: string
  reminderFrequency: 'daily' | 'weekly' | 'bi-weekly'
}

interface AutoRenewSetting {
  id: string
  institutionId: string
  institutionName: string
  plan: string
  autoRenew: boolean
  paymentMethod: string
  lastRenewalDate?: string
  nextRenewalDate: string
  renewalAmount: number
  status: 'active' | 'paused' | 'failed'
}

const AlertsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'expiry' | 'overdue' | 'suspended' | 'reminders' | 'autorenew'>('expiry')
  const [showRenewModal, setShowRenewModal] = useState(false)
  const [showAutoRenewModal, setShowAutoRenewModal] = useState(false)
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data
  const [institutions] = useState<Institution[]>([
    {
      id: '1',
      name: 'Springfield Elementary School',
      type: 'School',
      plan: 'Premium',
      status: 'Active',
      subscriptionExpiry: '2024-06-15',
      autoRenew: true,
      lastPaymentDate: '2024-05-15',
      nextPaymentDate: '2024-06-15',
      overdueAmount: 0,
      contactEmail: 'admin@springfield.edu',
      contactPhone: '+91-9876543210'
    },
    {
      id: '2',
      name: 'Riverdale High School',
      type: 'School',
      plan: 'Professional',
      status: 'Active',
      subscriptionExpiry: '2024-06-08',
      autoRenew: false,
      lastPaymentDate: '2024-05-08',
      nextPaymentDate: '2024-06-08',
      overdueAmount: 0,
      contactEmail: 'admin@riverdale.edu',
      contactPhone: '+91-9876543211'
    },
    {
      id: '3',
      name: 'Greenwood Inter College',
      type: 'Inter College',
      plan: 'Basic',
      status: 'Suspended',
      subscriptionExpiry: '2024-05-20',
      autoRenew: false,
      lastPaymentDate: '2024-04-20',
      nextPaymentDate: '2024-05-20',
      overdueAmount: 4999,
      contactEmail: 'admin@greenwood.edu',
      contactPhone: '+91-9876543212'
    },
    {
      id: '4',
      name: 'Tech Degree College',
      type: 'Degree College',
      plan: 'Premium',
      status: 'Active',
      subscriptionExpiry: '2024-07-01',
      autoRenew: true,
      lastPaymentDate: '2024-06-01',
      nextPaymentDate: '2024-07-01',
      overdueAmount: 0,
      contactEmail: 'admin@techcollege.edu',
      contactPhone: '+91-9876543213'
    },
    {
      id: '5',
      name: 'Lincoln Elementary',
      type: 'School',
      plan: 'Professional',
      status: 'Active',
      subscriptionExpiry: '2024-06-25',
      autoRenew: false,
      lastPaymentDate: '2024-05-25',
      nextPaymentDate: '2024-06-25',
      overdueAmount: 0,
      contactEmail: 'admin@lincoln.edu',
      contactPhone: '+91-9876543214'
    }
  ])

  const [expiryAlerts] = useState<ExpiryAlert[]>([
    {
      id: 'EXP001',
      institutionId: '2',
      institutionName: 'Riverdale High School',
      daysUntilExpiry: 5,
      expiryDate: '2024-06-08',
      plan: 'Professional',
      amount: 9999,
      autoRenew: false,
      status: 'pending',
      reminderSent: true,
      lastReminderDate: '2024-06-03'
    },
    {
      id: 'EXP002',
      institutionId: '1',
      institutionName: 'Springfield Elementary School',
      daysUntilExpiry: 12,
      expiryDate: '2024-06-15',
      plan: 'Premium',
      amount: 24999,
      autoRenew: true,
      status: 'pending',
      reminderSent: true,
      lastReminderDate: '2024-06-01'
    },
    {
      id: 'EXP003',
      institutionId: '5',
      institutionName: 'Lincoln Elementary',
      daysUntilExpiry: 29,
      expiryDate: '2024-06-25',
      plan: 'Professional',
      amount: 9999,
      autoRenew: false,
      status: 'pending',
      reminderSent: false
    }
  ])

  const [overduePayments] = useState<OverduePayment[]>([
    {
      id: 'OV001',
      institutionId: '3',
      institutionName: 'Greenwood Inter College',
      amount: 4999,
      dueDate: '2024-05-20',
      daysOverdue: 19,
      plan: 'Basic',
      status: 'overdue',
      paymentMethod: 'Credit Card',
      reminderCount: 5,
      lastReminderDate: '2024-06-05'
    }
  ])

  const [renewalReminders] = useState<RenewalReminder[]>([
    {
      id: 'REN001',
      institutionId: '2',
      institutionName: 'Riverdale High School',
      expiryDate: '2024-06-08',
      daysUntilExpiry: 5,
      plan: 'Professional',
      renewalAmount: 9999,
      status: 'scheduled',
      nextReminderDate: '2024-06-06',
      reminderFrequency: 'daily'
    },
    {
      id: 'REN002',
      institutionId: '1',
      institutionName: 'Springfield Elementary School',
      expiryDate: '2024-06-15',
      daysUntilExpiry: 12,
      plan: 'Premium',
      renewalAmount: 24999,
      status: 'sent',
      nextReminderDate: '2024-06-10',
      reminderFrequency: 'weekly'
    }
  ])

  const [autoRenewSettings] = useState<AutoRenewSetting[]>([
    {
      id: 'AR001',
      institutionId: '1',
      institutionName: 'Springfield Elementary School',
      plan: 'Premium',
      autoRenew: true,
      paymentMethod: 'Credit Card',
      lastRenewalDate: '2024-05-15',
      nextRenewalDate: '2024-06-15',
      renewalAmount: 24999,
      status: 'active'
    },
    {
      id: 'AR002',
      institutionId: '4',
      institutionName: 'Tech Degree College',
      plan: 'Premium',
      autoRenew: true,
      paymentMethod: 'Bank Transfer',
      lastRenewalDate: '2024-06-01',
      nextRenewalDate: '2024-07-01',
      renewalAmount: 24999,
      status: 'active'
    }
  ])

  // Handler functions
  const handleRenewSubscription = (institution: Institution) => {
    setSelectedInstitution(institution)
    setShowRenewModal(true)
  }

  const handleToggleAutoRenew = (setting: AutoRenewSetting) => {
    // In a real app, this would update the auto-renew setting
    console.log('Toggle auto-renew for:', setting.institutionName)
  }

  const handleSendReminder = (reminderId: string) => {
    // In a real app, this would send a reminder
    console.log('Send reminder:', reminderId)
  }

  const handleContactInstitution = (institution: Institution) => {
    // In a real app, this would open contact options
    console.log('Contact institution:', institution.name)
  }

  // Calculations
  const expiring7Days = expiryAlerts.filter(a => a.daysUntilExpiry <= 7).length
  const expiring30Days = expiryAlerts.filter(a => a.daysUntilExpiry <= 30).length
  const suspendedInstitutions = institutions.filter(i => i.status === 'Suspended').length
  const totalOverdueAmount = overduePayments.reduce((sum, p) => sum + p.amount, 0)
  const activeAutoRenew = autoRenewSettings.filter(a => a.autoRenew && a.status === 'active').length

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  const getExpiryColor = (days: number) => {
    if (days <= 7) return 'bg-danger'
    if (days <= 15) return 'bg-warning'
    if (days <= 30) return 'bg-info'
    return 'bg-secondary'
  }

  const getPlanBadge = (plan: string) => {
    const planConfig = {
      'Basic': 'bg-info',
      'Professional': 'bg-warning',
      'Premium': 'bg-danger'
    }
    return planConfig[plan as keyof typeof planConfig] || 'bg-secondary'
  }

  return (
    <>
      {/* Page Header */}
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Expiry & Alerts</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/super-admin/dashboard">Dashboard</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Expiry & Alerts</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div className="pe-1 mb-2">
            <button className="btn btn-outline-light bg-white btn-icon me-1">
              <i className="ti ti-refresh"></i>
            </button>
          </div>
          <div className="dropdown me-2 mb-2">
            <button className="btn btn-light fw-medium dropdown-toggle" data-bs-toggle="dropdown">
              <i className="ti ti-file-export me-2"></i>
              Export
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-3">
              <li>
                <button className="dropdown-item">
                  <i className="ti ti-file-type-pdf me-2"></i>Export as PDF
                </button>
              </li>
              <li>
                <button className="dropdown-item">
                  <i className="ti ti-file-type-xls me-2"></i>Export as Excel
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card bg-danger">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="text-white mb-1">{expiring7Days}</h4>
                  <p className="text-white mb-0">Expiring in 7 days</p>
                </div>
                <div className="avatar avatar-lg bg-white bg-opacity-20 rounded-circle">
                  <i className="ti ti-calendar-time text-white fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card bg-warning">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="text-white mb-1">{expiring30Days}</h4>
                  <p className="text-white mb-0">Expiring in 30 days</p>
                </div>
                <div className="avatar avatar-lg bg-white bg-opacity-20 rounded-circle">
                  <i className="ti ti-calendar-event text-white fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card bg-info">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="text-white mb-1">{formatCurrency(totalOverdueAmount)}</h4>
                  <p className="text-white mb-0">Overdue Amount</p>
                </div>
                <div className="avatar avatar-lg bg-white bg-opacity-20 rounded-circle">
                  <i className="ti ti-credit-card-off text-white fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card bg-secondary">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="text-white mb-1">{suspendedInstitutions}</h4>
                  <p className="text-white mb-0">Suspended Institutions</p>
                </div>
                <div className="avatar avatar-lg bg-white bg-opacity-20 rounded-circle">
                  <i className="ti ti-ban text-white fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card mb-4">
        <div className="card-body p-0">
          <ul className="nav nav-tabs nav-tabs-bottom d-flex justify-content-between" role="tablist">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'expiry' ? 'active' : ''}`}
                onClick={() => setActiveTab('expiry')}
              >
                <i className="ti ti-calendar-time me-2"></i>Expiry Alerts
                <span className="badge bg-danger ms-2">{expiring7Days}</span>
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overdue' ? 'active' : ''}`}
                onClick={() => setActiveTab('overdue')}
              >
                <i className="ti ti-credit-card-off me-2"></i>Overdue Payments
                <span className="badge bg-warning ms-2">{overduePayments.length}</span>
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'suspended' ? 'active' : ''}`}
                onClick={() => setActiveTab('suspended')}
              >
                <i className="ti ti-ban me-2"></i>Suspended Institutions
                <span className="badge bg-secondary ms-2">{suspendedInstitutions}</span>
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'reminders' ? 'active' : ''}`}
                onClick={() => setActiveTab('reminders')}
              >
                <i className="ti ti-bell me-2"></i>Renewal Reminders
                <span className="badge bg-info ms-2">{renewalReminders.length}</span>
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'autorenew' ? 'active' : ''}`}
                onClick={() => setActiveTab('autorenew')}
              >
                <i className="ti ti-refresh me-2"></i>Auto-renew Settings
                <span className="badge bg-success ms-2">{activeAutoRenew}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search institutions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-secondary" type="button">
                  <i className="ti ti-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expiry Alerts Tab */}
      {activeTab === 'expiry' && (
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Subscription Expiry Alerts</h4>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Institution</th>
                    <th>Plan</th>
                    <th>Expiry Date</th>
                    <th>Days Until Expiry</th>
                    <th>Amount</th>
                    <th>Auto-renew</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expiryAlerts.map((alert) => (
                    <tr key={alert.id}>
                      <td>
                        <div className="fw-medium">{alert.institutionName}</div>
                      </td>
                      <td>
                        <span className={`badge ${getPlanBadge(alert.plan)}`}>
                          {alert.plan}
                        </span>
                      </td>
                      <td>{alert.expiryDate}</td>
                      <td>
                        <span className={`badge ${getExpiryColor(alert.daysUntilExpiry)}`}>
                          {alert.daysUntilExpiry} days
                        </span>
                      </td>
                      <td>{formatCurrency(alert.amount)}</td>
                      <td>
                        <span className={`badge ${alert.autoRenew ? 'bg-success' : 'bg-secondary'}`}>
                          {alert.autoRenew ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${alert.status === 'pending' ? 'bg-warning' : alert.status === 'renewed' ? 'bg-success' : 'bg-danger'}`}>
                          {alert.status}
                        </span>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            <i className="ti ti-dots-vertical"></i>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <button className="dropdown-item" onClick={() => handleRenewSubscription(institutions.find(i => i.id === alert.institutionId)!)}>
                                <i className="ti ti-refresh me-2"></i>Renew Now
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item" onClick={() => handleContactInstitution(institutions.find(i => i.id === alert.institutionId)!)}>
                                <i className="ti ti-phone me-2"></i>Contact Institution
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Overdue Payments Tab */}
      {activeTab === 'overdue' && (
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Overdue Payments</h4>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Institution</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Days Overdue</th>
                    <th>Payment Method</th>
                    <th>Reminders Sent</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {overduePayments.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        <div className="fw-medium">{payment.institutionName}</div>
                      </td>
                      <td>
                        <span className={`badge ${getPlanBadge(payment.plan)}`}>
                          {payment.plan}
                        </span>
                      </td>
                      <td>{formatCurrency(payment.amount)}</td>
                      <td>{payment.dueDate}</td>
                      <td>
                        <span className="badge bg-danger">
                          {payment.daysOverdue} days
                        </span>
                      </td>
                      <td>{payment.paymentMethod}</td>
                      <td>{payment.reminderCount}</td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            <i className="ti ti-dots-vertical"></i>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <button className="dropdown-item" onClick={() => handleContactInstitution(institutions.find(i => i.id === payment.institutionId)!)}>
                                <i className="ti ti-phone me-2"></i>Contact Institution
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item" onClick={() => handleSendReminder(payment.id)}>
                                <i className="ti ti-bell me-2"></i>Send Reminder
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Suspended Institutions Tab */}
      {activeTab === 'suspended' && (
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Suspended Institutions</h4>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Institution</th>
                    <th>Type</th>
                    <th>Plan</th>
                    <th>Expiry Date</th>
                    <th>Overdue Amount</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {institutions.filter(i => i.status === 'Suspended').map((institution) => (
                    <tr key={institution.id}>
                      <td>
                        <div className="fw-medium">{institution.name}</div>
                      </td>
                      <td>{institution.type}</td>
                      <td>
                        <span className={`badge ${getPlanBadge(institution.plan)}`}>
                          {institution.plan}
                        </span>
                      </td>
                      <td>{institution.subscriptionExpiry}</td>
                      <td>{formatCurrency(institution.overdueAmount)}</td>
                      <td>
                        <div>
                          <div>{institution.contactEmail}</div>
                          <small className="text-muted">{institution.contactPhone}</small>
                        </div>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            <i className="ti ti-dots-vertical"></i>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <button className="dropdown-item" onClick={() => handleRenewSubscription(institution)}>
                                <i className="ti ti-refresh me-2"></i>Reactivate
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item" onClick={() => handleContactInstitution(institution)}>
                                <i className="ti ti-phone me-2"></i>Contact Institution
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Renewal Reminders Tab */}
      {activeTab === 'reminders' && (
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Renewal Reminders</h4>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Institution</th>
                    <th>Plan</th>
                    <th>Expiry Date</th>
                    <th>Days Until Expiry</th>
                    <th>Renewal Amount</th>
                    <th>Frequency</th>
                    <th>Status</th>
                    <th>Next Reminder</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {renewalReminders.map((reminder) => (
                    <tr key={reminder.id}>
                      <td>
                        <div className="fw-medium">{reminder.institutionName}</div>
                      </td>
                      <td>
                        <span className={`badge ${getPlanBadge(reminder.plan)}`}>
                          {reminder.plan}
                        </span>
                      </td>
                      <td>{reminder.expiryDate}</td>
                      <td>
                        <span className={`badge ${getExpiryColor(reminder.daysUntilExpiry)}`}>
                          {reminder.daysUntilExpiry} days
                        </span>
                      </td>
                      <td>{formatCurrency(reminder.renewalAmount)}</td>
                      <td>{reminder.reminderFrequency}</td>
                      <td>
                        <span className={`badge ${reminder.status === 'scheduled' ? 'bg-info' : reminder.status === 'sent' ? 'bg-success' : 'bg-warning'}`}>
                          {reminder.status}
                        </span>
                      </td>
                      <td>{reminder.nextReminderDate}</td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            <i className="ti ti-dots-vertical"></i>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <button className="dropdown-item" onClick={() => handleSendReminder(reminder.id)}>
                                <i className="ti ti-bell me-2"></i>Send Now
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item" onClick={() => handleContactInstitution(institutions.find(i => i.id === reminder.institutionId)!)}>
                                <i className="ti ti-phone me-2"></i>Contact Institution
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Auto-renew Settings Tab */}
      {activeTab === 'autorenew' && (
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Auto-renew Settings</h4>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Institution</th>
                    <th>Plan</th>
                    <th>Payment Method</th>
                    <th>Renewal Amount</th>
                    <th>Last Renewal</th>
                    <th>Next Renewal</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {autoRenewSettings.map((setting) => (
                    <tr key={setting.id}>
                      <td>
                        <div className="fw-medium">{setting.institutionName}</div>
                      </td>
                      <td>
                        <span className={`badge ${getPlanBadge(setting.plan)}`}>
                          {setting.plan}
                        </span>
                      </td>
                      <td>{setting.paymentMethod}</td>
                      <td>{formatCurrency(setting.renewalAmount)}</td>
                      <td>{setting.lastRenewalDate || 'N/A'}</td>
                      <td>{setting.nextRenewalDate}</td>
                      <td>
                        <span className={`badge ${setting.status === 'active' ? 'bg-success' : setting.status === 'paused' ? 'bg-warning' : 'bg-danger'}`}>
                          {setting.status}
                        </span>
                      </td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={setting.autoRenew}
                            onChange={() => handleToggleAutoRenew(setting)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Renewal Modal */}
      {showRenewModal && selectedInstitution && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Renew Subscription</h5>
                <button type="button" className="btn-close" onClick={() => setShowRenewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Institution</label>
                  <input type="text" className="form-control" value={selectedInstitution.name} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label">Current Plan</label>
                  <input type="text" className="form-control" value={selectedInstitution.plan} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label">Renewal Amount</label>
                  <input type="text" className="form-control" value={formatCurrency(9999)} readOnly />
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="enableAutoRenew" defaultChecked />
                    <label className="form-check-label" htmlFor="enableAutoRenew">
                      Enable Auto-renew
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRenewModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setShowRenewModal(false)}>
                  Renew Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AlertsPage

