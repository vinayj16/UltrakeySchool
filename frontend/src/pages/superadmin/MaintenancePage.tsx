import React, { useState, useEffect } from 'react'
import { apiService } from '../../services/api'

interface MaintenanceSettings {
  enabled: boolean
  message: string
  startTime: string
  endTime: string
  affectedModules: string[]
  notifyUsers: boolean
  allowAdminAccess: boolean
}

interface ScheduledMaintenance {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  description: string
}

const MaintenancePage: React.FC = () => {
  const [settings, setSettings] = useState<MaintenanceSettings>({
    enabled: false,
    message: 'System is currently under maintenance. We\'ll be back shortly.',
    startTime: '',
    endTime: '',
    affectedModules: [],
    notifyUsers: true,
    allowAdminAccess: true
  })

  const [scheduledMaintenance, setScheduledMaintenance] = useState<ScheduledMaintenance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch maintenance settings
        const settingsResponse = await apiService.get<MaintenanceSettings>('/settings/maintenance')
        if (settingsResponse.success && settingsResponse.data) {
          setSettings({
            ...settingsResponse.data,
            affectedModules: settingsResponse.data.affectedModules || []
          })
        }
        
        // Fetch scheduled maintenance
        const maintenanceResponse = await apiService.get('/settings/maintenance/scheduled')
        if (maintenanceResponse.success && maintenanceResponse.data) {
          setScheduledMaintenance(maintenanceResponse.data as ScheduledMaintenance[])
        }
      } catch (err) {
        console.error('Error fetching maintenance data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch maintenance data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const availableModules = [
    'User Management',
    'Student Records',
    'Financial System',
    'Attendance System',
    'Library System',
    'HR Management',
    'Reports & Analytics',
    'Communication Tools',
    'Settings & Configuration'
  ]

  const handleMaintenanceToggle = () => {
    setSettings(prev => ({ ...prev, enabled: !prev.enabled }))
  }

  const handleModuleToggle = (module: string) => {
    setSettings(prev => ({
      ...prev,
      affectedModules: (prev.affectedModules || []).includes(module)
        ? (prev.affectedModules || []).filter(m => m !== module)
        : [...(prev.affectedModules || []), module]
    }))
  }

          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={async () => {
              try {
                setLoading(true)
                const response = await apiService.put('/settings/maintenance', settings)
                
                if (response.success) {
                  console.log('Maintenance settings saved successfully:', response.data)
                  if (response.data) {
                    setSettings(response.data as MaintenanceSettings)
                  }
                  alert('Maintenance settings saved successfully!')
                } else {
                  setError('Failed to save maintenance settings')
                }
              } catch (err) {
                console.error('Error saving maintenance settings:', err)
                setError(err instanceof Error ? err.message : 'Failed to save maintenance settings')
              } finally {
                setLoading(false)
              }
            }}>
              Save Settings
            </button>
            <button className="btn btn-secondary">Cancel</button>
          </div>

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <span className="badge bg-warning">Scheduled</span>
      case 'in-progress':
        return <span className="badge bg-info">In Progress</span>
      case 'completed':
        return <span className="badge bg-success">Completed</span>
      case 'cancelled':
        return <span className="badge bg-danger">Cancelled</span>
      default:
        return <span className="badge bg-secondary">Unknown</span>
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="text-center">
          <div className="alert alert-danger">{error}</div>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="">
      {/* Page Header */}
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Maintenance Mode</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="#">Dashboard</a>
              </li>
              <li className="breadcrumb-item">
                <a href="#">System</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Maintenance Mode
              </li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <div className="pe-1 mb-2">
            <button 
              className="btn btn-outline-light bg-white btn-icon me-1" 
              title="Refresh"
              onClick={() => window.location.reload()}
            >
              <i className="ti ti-refresh"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6">
          <div className={`card ${settings.enabled ? 'bg-warning' : 'bg-success'}`}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="text-white mb-1">
                    {settings.enabled ? 'ACTIVE' : 'INACTIVE'}
                  </h4>
                  <p className="text-white mb-0">Maintenance Status</p>
                </div>
                <div className="avatar avatar-lg bg-white bg-opacity-20 rounded-circle">
                  <i className={`ti ${settings.enabled ? 'ti-alert-triangle' : 'ti-check'} text-white fs-4`}></i>
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
                  <h4 className="text-white mb-1">{(scheduledMaintenance || []).filter(m => m.status === 'scheduled').length}</h4>
                  <p className="text-white mb-0">Scheduled</p>
                </div>
                <div className="avatar avatar-lg bg-white bg-opacity-20 rounded-circle">
                  <i className="ti ti-calendar text-white fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card bg-primary">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="text-white mb-1">{settings.affectedModules?.length || 0}</h4>
                  <p className="text-white mb-0">Affected Modules</p>
                </div>
                <div className="avatar avatar-lg bg-white bg-opacity-20 rounded-circle">
                  <i className="ti ti-puzzle text-white fs-4"></i>
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
                  <h4 className="text-white mb-1">{(scheduledMaintenance || []).filter(m => m.status === 'completed').length}</h4>
                  <p className="text-white mb-0">Completed</p>
                </div>
                <div className="avatar avatar-lg bg-white bg-opacity-20 rounded-circle">
                  <i className="ti ti-checks text-white fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Settings */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Maintenance Settings</h5>
          <div className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="maintenance-toggle"
              checked={settings.enabled}
              onChange={handleMaintenanceToggle}
            />
            <label className="form-check-label" htmlFor="maintenance-toggle">
              {settings.enabled ? 'Disable' : 'Enable'} Maintenance Mode
            </label>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Maintenance Message</label>
              <textarea 
                className="form-control" 
                rows={3}
                value={settings.message}
                onChange={(e) => setSettings(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter maintenance message for users"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Maintenance Schedule</label>
              <div className="row">
                <div className="col-6">
                  <input 
                    type="datetime-local" 
                    className="form-control mb-2"
                    value={settings.startTime}
                    onChange={(e) => setSettings(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                  <small className="text-muted">Start Time</small>
                </div>
                <div className="col-6">
                  <input 
                    type="datetime-local" 
                    className="form-control mb-2"
                    value={settings.endTime}
                    onChange={(e) => setSettings(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                  <small className="text-muted">End Time</small>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Affected Modules</label>
              <div className="row">
                {availableModules.map((module) => (
                  <div key={module} className="col-md-6 mb-2">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id={`module-${module}`}
                        checked={(settings.affectedModules || []).includes(module)}
                        onChange={() => handleModuleToggle(module)}
                      />
                      <label className="form-check-label" htmlFor={`module-${module}`}>
                        {module}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Additional Options</label>
              <div className="space-y-2">
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="notify-users"
                    checked={settings.notifyUsers}
                    onChange={(e) => setSettings(prev => ({ ...prev, notifyUsers: e.target.checked }))}
                  />
                  <label className="form-check-label" htmlFor="notify-users">
                    Notify users via email
                  </label>
                </div>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="admin-access"
                    checked={settings.allowAdminAccess}
                    onChange={(e) => setSettings(prev => ({ ...prev, allowAdminAccess: e.target.checked }))}
                  />
                  <label className="form-check-label" htmlFor="admin-access">
                    Allow admin access during maintenance
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Maintenance */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Scheduled Maintenance</h5>
          <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#schedule-maintenance">
            <i className="ti ti-plus me-2"></i>Schedule Maintenance
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(scheduledMaintenance || []).map((maintenance) => (
                  <tr key={maintenance.id}>
                    <td>{maintenance.title}</td>
                    <td>{maintenance.date}</td>
                    <td>{maintenance.startTime} - {maintenance.endTime}</td>
                    <td>{getStatusBadge(maintenance.status)}</td>
                    <td>{maintenance.description}</td>
                    <td>
                      <div className="dropdown">
                        <button 
                          className="btn btn-sm btn-white btn-icon" 
                          data-bs-toggle="dropdown"
                        >
                          <i className="ti ti-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button className="dropdown-item">
                              <i className="ti ti-edit me-2"></i>Edit
                            </button>
                          </li>
                          <li>
                            <button className="dropdown-item">
                              <i className="ti ti-player-play me-2"></i>Start Now
                            </button>
                          </li>
                          <li>
                            <button className="dropdown-item text-danger">
                              <i className="ti ti-trash me-2"></i>Cancel
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

      {/* Schedule Maintenance Modal */}
      <div className="modal fade" id="schedule-maintenance" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Schedule Maintenance</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" placeholder="Enter maintenance title" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={3} placeholder="Enter maintenance description"></textarea>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Duration</label>
                    <div className="row">
                      <div className="col-6">
                        <input type="time" className="form-control" placeholder="Start" />
                      </div>
                      <div className="col-6">
                        <input type="time" className="form-control" placeholder="End" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select className="form-select">
                    <option>Select maintenance type</option>
                    <option>Emergency</option>
                    <option>Routine</option>
                    <option>Upgrade</option>
                    <option>Security Update</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary">Schedule Maintenance</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaintenancePage
