import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import apiClient from '../../api/client'

const TransportDashboardPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalRoutes: 0,
    busesRunning: 0,
    totalStudents: 0,
    pendingIssues: 0
  })
  const [routeData, setRouteData] = useState<Array<{
    route: string
    bus: string
    students: number
    status: string
    arrivalTime: string
  }>>([])
  const [complaints, setComplaints] = useState<Array<{
    title: string
    severity: string
    route: string
  }>>([])
  const [busStatusData, setBusStatusData] = useState<Array<{
    status: string
    count: number
  }>>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch transport statistics
        const statsResponse = await apiClient.get('/transport/dashboard/stats')
        if (statsResponse.data.success) {
          setStats(statsResponse.data.data)
        }

        // Fetch route data
        const routesResponse = await apiClient.get('/transport/dashboard/routes')
        if (routesResponse.data.success) {
          setRouteData(routesResponse.data.data)
        }

        // Fetch complaints
        const complaintsResponse = await apiClient.get('/transport/dashboard/complaints')
        if (complaintsResponse.data.success) {
          setComplaints(complaintsResponse.data.data)
        }

        // Fetch bus status distribution
        const statusResponse = await apiClient.get('/transport/dashboard/status')
        if (statusResponse.data.success) {
          setBusStatusData(statusResponse.data.data)
        }

      } catch (err) {
        console.error('Error fetching transport data:', err)
        setError('Failed to load transport dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    )
  }

  return (
    <div>
      {/* ── PAGE HEADER ── */}
      <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">Transport Manager Dashboard</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Transport</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
          <Link to="/transport/routes" className="btn btn-primary">
            <i className="ti ti-route me-1" />Routes
          </Link>
          <Link to="/transport/vehicles" className="btn btn-success">
            <i className="ti ti-bus me-1" />Vehicles
          </Link>
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="row mb-4">
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="card flex-fill border-0">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h2 className="mb-0">{stats.totalRoutes}</h2>
                <p className="mb-0">Total Routes</p>
                <small className="text-muted">Active today</small>
              </div>
              <div className="avatar avatar-xl bg-primary rounded d-flex align-items-center justify-content-center">
                <i className="ti ti-route fs-24 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="card flex-fill border-0">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h2 className="mb-0">{stats.busesRunning}</h2>
                <p className="mb-0">Buses Running</p>
                <small className="text-muted">2 under maintenance</small>
              </div>
              <div className="avatar avatar-xl bg-success rounded d-flex align-items-center justify-content-center">
                <i className="ti ti-bus fs-24 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="card flex-fill border-0">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h2 className="mb-0">{stats.totalStudents}</h2>
                <p className="mb-0">Total Students</p>
                <small className="text-muted">Using transport</small>
              </div>
              <div className="avatar avatar-xl bg-info rounded d-flex align-items-center justify-content-center">
                <i className="ti ti-users fs-24 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="card flex-fill border-0">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h2 className="mb-0">{stats.pendingIssues}</h2>
                <p className="mb-0">Pending Issues</p>
                <small className="text-muted">1 critical</small>
              </div>
              <div className="avatar avatar-xl bg-danger rounded d-flex align-items-center justify-content-center">
                <i className="ti ti-alert-circle fs-24 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BUS STATUS DISTRIBUTION CHART ── */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Bus Status Distribution</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={busStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ── TODAY'S ROUTES ── */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">Today's Bus Status</h5>
              <Link to="/transport/routes" className="btn btn-sm btn-primary">
                <i className="ti ti-plus me-1" />Add Route
              </Link>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Route</th>
                      <th>Bus</th>
                      <th>Students</th>
                      <th>Status</th>
                      <th>Arrival Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routeData.map((route, index) => (
                      <tr key={index}>
                        <td>{route.route}</td>
                        <td>{route.bus}</td>
                        <td>{route.students}</td>
                        <td>
                          <span className={`badge ${
                            route.status === 'On Time' 
                              ? 'bg-success-transparent' 
                              : route.status === 'Delayed'
                                ? 'bg-warning-transparent'
                                : 'bg-danger-transparent'
                          }`}>
                            {route.status}
                          </span>
                        </td>
                        <td>{route.arrivalTime}</td>
                        <td>
                          <Link to="#" className="btn btn-sm btn-primary">
                            <i className="ti ti-map" />
                          </Link>
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

      {/* ── QUICK LINKS ── */}
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-2">
                <Link to="/transport/routes" className="btn btn-light border">
                  <i className="ti ti-route me-2" />Manage Routes
                </Link>
                <Link to="/transport/vehicles" className="btn btn-light border">
                  <i className="ti ti-bus me-2" />Manage Vehicles
                </Link>
                <Link to="/transport/drivers" className="btn btn-light border">
                  <i className="ti ti-user me-2" />Manage Drivers
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Pending Complaints</h5>
            </div>
            <div className="card-body">
              {complaints.map((complaint, index) => (
                <div key={index} className={`alert ${
                  complaint.severity === 'critical' 
                    ? 'alert-danger' 
                    : 'alert-warning'
                } mb-2`}>
                  <i className={`ti ti-${complaint.severity === 'critical' ? 'alert-triangle' : 'alert-circle'} me-2`} />
                  {complaint.title} - {complaint.route}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransportDashboardPage
