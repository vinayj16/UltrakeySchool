import React, { useState, useEffect } from 'react'
import analyticsService, { type AnalyticsData } from '../../services/analyticsService'

const AnalyticsReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await analyticsService.getFullAnalytics()
      setAnalyticsData(data)
    } catch (err: any) {
      console.error('Failed to fetch analytics:', err)
      setError(err.response?.data?.message || 'Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error || !analyticsData) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="ti ti-alert-circle me-2"></i>
        {error || 'Failed to load analytics data'}
      </div>
    )
  }

  const hasValidStructure =
    analyticsData?.institutionGrowth != null &&
    Array.isArray(analyticsData?.revenueGrowth?.monthly) &&
    analyticsData?.renewalRate != null &&
    analyticsData?.churnRate != null
  if (!hasValidStructure) {
    return (
      <div className="alert alert-warning" role="alert">
        <i className="ti ti-alert-triangle me-2"></i>
        Incomplete analytics data. Connect the backend or try again later.
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-success' : 'text-danger'
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? 'ti ti-arrow-up' : 'ti ti-arrow-down'
  }

  const instGrowth = analyticsData?.institutionGrowth?.monthly;
  const lastInst = instGrowth?.length ? instGrowth[instGrowth.length - 1] : null;
  const revGrowth = analyticsData?.revenueGrowth?.monthly;
  const lastRev = revGrowth?.length ? revGrowth[revGrowth.length - 1] : null;
  const renewal = analyticsData?.renewalRate;
  const churn = analyticsData?.churnRate;

  const renderOverviewCards = () => (
    <div className="row mb-4">
      <div className="col-lg-3 col-md-6">
        <div className="card bg-primary">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h4 className="text-white mb-1">{lastInst?.count ?? 0}</h4>
                <p className="text-white mb-0">Total Institutions</p>
                <small className="text-white-50">
                  <i className={getGrowthIcon(lastInst?.growth ?? 0)}></i>
                  {formatPercentage(lastInst?.growth ?? 0)} growth
                </small>
              </div>
              <div className="avatar avatar-lg bg-white bg-opacity-20 rounded-circle">
                <i className="ti ti-building text-white fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-6">
        <div className="card bg-success">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h4 className="text-white mb-1">{formatCurrency(lastRev?.revenue ?? 0)}</h4>
                <p className="text-white mb-0">Monthly Revenue</p>
                <small className="text-white-50">
                  <i className={getGrowthIcon(lastRev?.growth ?? 0)}></i>
                  {formatPercentage(lastRev?.growth ?? 0)} growth
                </small>
              </div>
              <div className="avatar avatar-lg bg-white bg-opacity-20 rounded-circle">
                <i className="ti ti-currency-rupee text-white fs-4"></i>
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
                <h4 className="text-white mb-1">{formatPercentage(renewal?.current ?? 0)}</h4>
                <p className="text-white mb-0">Renewal Rate</p>
                <small className="text-white-50">
                  <i className={getGrowthIcon((renewal?.current ?? 0) - (renewal?.previous ?? 0))}></i>
                  {formatPercentage((renewal?.current ?? 0) - (renewal?.previous ?? 0))} vs last month
                </small>
              </div>
              <div className="avatar avatar-lg bg-white bg-opacity-20 rounded-circle">
                <i className="ti ti-refresh text-white fs-4"></i>
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
                <h4 className="text-white mb-1">{formatPercentage(churn?.current ?? 0)}</h4>
                <p className="text-white mb-0">Churn Rate</p>
                <small className="text-white-50">
                  <i className={getGrowthIcon(-((churn?.current ?? 0) - (churn?.previous ?? 0)))}></i>
                  {formatPercentage(Math.abs((churn?.current ?? 0) - (churn?.previous ?? 0)))} improvement
                </small>
              </div>
              <div className="avatar avatar-lg bg-white bg-opacity-20 rounded-circle">
                <i className="ti ti-user-off text-white fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderInstitutionGrowth = () => (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="card-title">Institution Growth</h5>
        <div className="btn-group btn-group-sm">
          <button 
            className={`btn ${selectedPeriod === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedPeriod('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`btn ${selectedPeriod === 'yearly' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedPeriod('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>{selectedPeriod === 'monthly' ? 'Month' : 'Year'}</th>
                <th>Institutions</th>
                <th>Growth Rate</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {(analyticsData?.institutionGrowth?.[selectedPeriod] ?? []).map((item, index) => {
                const period = selectedPeriod === 'monthly' 
                  ? (item as { month: string; count: number; growth: number }).month 
                  : (item as { year: string; count: number; growth: number }).year;
                
                return (
                  <tr key={index}>
                    <td>{period}</td>
                    <td>{item.count}</td>
                    <td className={getGrowthColor(item.growth)}>
                      {formatPercentage(item.growth)}
                    </td>
                    <td>
                      <i className={`${getGrowthIcon(item.growth)} ${getGrowthColor(item.growth)}`}></i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderRevenueGrowth = () => (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="card-title">Revenue Growth</h5>
        <div className="btn-group btn-group-sm">
          <button 
            className={`btn ${selectedPeriod === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedPeriod('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`btn ${selectedPeriod === 'yearly' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedPeriod('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>{selectedPeriod === 'monthly' ? 'Month' : 'Year'}</th>
                <th>Revenue</th>
                <th>Growth Rate</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {(analyticsData?.revenueGrowth?.[selectedPeriod] ?? []).map((item, index) => {
                const period = selectedPeriod === 'monthly' 
                  ? (item as { month: string; revenue: number; growth: number }).month 
                  : (item as { year: string; revenue: number; growth: number }).year;
                
                return (
                  <tr key={index}>
                    <td>{period}</td>
                    <td>{formatCurrency(item.revenue)}</td>
                    <td className={getGrowthColor(item.growth)}>
                      {formatPercentage(item.growth)}
                    </td>
                    <td>
                      <i className={`${getGrowthIcon(item.growth)} ${getGrowthColor(item.growth)}`}></i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  return (
    <div className="">
      {/* Page Header */}
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Analytics & Reports</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/super-admin/dashboard">Dashboard</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Analytics & Reports
              </li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div className="pe-1 mb-2">
            <button 
              className="btn btn-outline-light bg-white btn-icon me-1" 
              title="Refresh"
              onClick={fetchAnalytics}
            >
              <i className="ti ti-refresh"></i>
            </button>
          </div>
          <div className="dropdown me-2 mb-2">
            <button className="btn btn-light fw-medium dropdown-toggle" data-bs-toggle="dropdown">
              <i className="ti ti-file-export me-2"></i>Export
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#"><i className="ti ti-file-type-pdf me-2"></i>Export as PDF</a></li>
              <li><a className="dropdown-item" href="#"><i className="ti ti-file-type-xls me-2"></i>Export as Excel</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      {renderOverviewCards()}

      {/* Institution Growth */}
      {renderInstitutionGrowth()}

      {/* Revenue Growth */}
      {renderRevenueGrowth()}

      {/* Plan Distribution */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title">Plan Distribution</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Institutions</th>
                  <th>Percentage</th>
                  <th>Revenue</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {(analyticsData?.planDistribution ?? []).map((plan, index) => (
                  <tr key={index}>
                    <td>
                      <span className={`badge ${
                        plan.plan === 'Premium' ? 'bg-warning' :
                        plan.plan === 'Professional' ? 'bg-info' : 'bg-secondary'
                      } text-white`}>
                        {plan.plan}
                      </span>
                    </td>
                    <td>{plan.count}</td>
                    <td>{formatPercentage(plan.percentage)}</td>
                    <td>{formatCurrency(plan.revenue)}</td>
                    <td>
                      <div className="progress" style={{ height: '6px' }}>
                        <div 
                          className={`progress-bar ${
                            plan.plan === 'Premium' ? 'bg-warning' :
                            plan.plan === 'Professional' ? 'bg-info' : 'bg-secondary'
                          }`}
                          style={{ width: `${plan.percentage}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Institution Type Distribution */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title">Institution Type Distribution</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Institution Type</th>
                  <th>Count</th>
                  <th>Percentage</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {(analyticsData?.institutionTypeDistribution ?? []).map((type, index) => (
                  <tr key={index}>
                    <td>{type.type}</td>
                    <td>{type.count}</td>
                    <td>{formatPercentage(type.percentage)}</td>
                    <td>
                      <div className="progress" style={{ height: '6px' }}>
                        <div 
                          className="progress-bar bg-primary"
                          style={{ width: `${type.percentage}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Churn and Renewal Rates */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Churn Rate</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Current Month</span>
                  <span className={`badge ${(analyticsData?.churnRate?.current ?? 0) <= 3 ? 'bg-success' : 'bg-danger'} text-white`}>
                    {formatPercentage(analyticsData?.churnRate?.current ?? 0)}
                  </span>
                </div>
                <small className="text-muted">
                  Previous: {formatPercentage(analyticsData?.churnRate?.previous ?? 0)}
                </small>
              </div>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.churnRate.monthly.map((item, index) => (
                      <tr key={index}>
                        <td>{item.month}</td>
                        <td className={item.rate <= 3 ? 'text-success' : 'text-danger'}>
                          {formatPercentage(item.rate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Renewal Rate</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Current Month</span>
                  <span className={`badge ${analyticsData.renewalRate.current >= 90 ? 'bg-success' : 'bg-warning'} text-white`}>
                    {formatPercentage(analyticsData.renewalRate.current)}
                  </span>
                </div>
                <small className="text-muted">
                  Previous: {formatPercentage(analyticsData.renewalRate.previous)}
                </small>
              </div>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.renewalRate.monthly.map((item, index) => (
                      <tr key={index}>
                        <td>{item.month}</td>
                        <td className={item.rate >= 90 ? 'text-success' : 'text-warning'}>
                          {formatPercentage(item.rate)}
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

      {/* Branch Growth */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title">Branch Growth</h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <h6>Total Branches</h6>
              <span className="badge bg-primary text-white">{analyticsData.branchGrowth.total}</span>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Branches</th>
                  <th>Growth</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.branchGrowth.monthly.map((item, index) => (
                  <tr key={index}>
                    <td>{item.month}</td>
                    <td>{item.count}</td>
                    <td className={getGrowthColor(item.growth)}>
                      {formatPercentage(item.growth)}
                    </td>
                    <td>
                      <i className={`${getGrowthIcon(item.growth)} ${getGrowthColor(item.growth)}`}></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Module Usage Analytics */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title">Module Usage Analytics</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Active</th>
                  <th>Total</th>
                  <th>Usage Rate</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.moduleUsage.map((module, index) => (
                  <tr key={index}>
                    <td>{module.module}</td>
                    <td>{module.active}</td>
                    <td>{module.total}</td>
                    <td className={module.usage >= 80 ? 'text-success' : module.usage >= 50 ? 'text-warning' : 'text-danger'}>
                      {formatPercentage(module.usage)}
                    </td>
                    <td>
                      <div className="progress" style={{ height: '6px' }}>
                        <div 
                          className={`progress-bar ${
                            module.usage >= 80 ? 'bg-success' : 
                            module.usage >= 50 ? 'bg-warning' : 'bg-danger'
                          }`}
                          style={{ width: `${module.usage}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Support Load Report */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Support Load Report</h5>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="text-center">
                <h4>{analyticsData.supportLoad.total}</h4>
                <p className="text-muted mb-0">Total Tickets</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <h4 className="text-danger">{analyticsData.supportLoad.open}</h4>
                <p className="text-muted mb-0">Open Tickets</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <h4 className="text-success">{analyticsData.supportLoad.resolved}</h4>
                <p className="text-muted mb-0">Resolved Tickets</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <h4>{analyticsData.supportLoad.averageResolutionTime}h</h4>
                <p className="text-muted mb-0">Avg Resolution Time</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <h6>By Priority</h6>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Priority</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.supportLoad.byPriority.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <span className={`badge ${
                            item.priority === 'Urgent' ? 'bg-danger' :
                            item.priority === 'High' ? 'bg-warning' :
                            item.priority === 'Medium' ? 'bg-info' : 'bg-secondary'
                          } text-white`}>
                            {item.priority}
                          </span>
                        </td>
                        <td>{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-6">
              <h6>By Category</h6>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.supportLoad.byCategory.map((item, index) => (
                      <tr key={index}>
                        <td>{item.category}</td>
                        <td>{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsReportsPage
