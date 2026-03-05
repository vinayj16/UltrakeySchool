import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import apiClient from '../../api/client'

type HostelStats = {
  totalResidents: number
  totalRooms: number
  maintenanceIssues: number
  pendingComplaints: number
  vacantRooms: number
}

type Room = {
  id: string
  roomNumber: string
  block: string
  currentResidents: number
  capacity: number
}

type OccupancyBlock = {
  block: string
  occupied: number
  vacant: number
}

const HostelDashboardPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<HostelStats>({
    totalResidents: 0,
    totalRooms: 0,
    maintenanceIssues: 0,
    pendingComplaints: 0,
    vacantRooms: 0
  })
  const [roomData, setRoomData] = useState<Room[]>([])
  const [occupancyData, setOccupancyData] = useState<OccupancyBlock[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch hostel statistics
        const statsResponse = await apiClient.get('/hostel/dashboard/stats')
        if (statsResponse.data.success) {
          setStats(statsResponse.data.data)
        }

        // Fetch room occupancy data
        const roomsResponse = await apiClient.get('/hostel/dashboard/rooms')
        if (roomsResponse.data.success) {
          setRoomData(roomsResponse.data.data.roomData || [])
        }

        // Fetch occupancy distribution
        const occupancyResponse = await apiClient.get('/hostel/dashboard/occupancy')
        if (occupancyResponse.data.success) {
          setOccupancyData(occupancyResponse.data.data.occupancyData || [])
        }

      } catch (err) {
        console.error('Error fetching hostel data:', err)
        setError('Failed to load hostel dashboard data')
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
          <h3 className="page-title mb-1">Hostel Warden Dashboard</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Dashboard</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Hostel</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
          <Link to="/hostel/rooms" className="btn btn-primary">
            <i className="ti ti-door me-1" />Rooms
          </Link>
          <Link to="/hostel/residents" className="btn btn-success">
            <i className="ti ti-users me-1" />Residents
          </Link>
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="row mb-4">
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="card flex-fill border-0">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h2 className="mb-0">{stats.totalResidents}</h2>
                <p className="mb-0">Total Residents</p>
                <small className="text-muted">{stats.vacantRooms} vacant rooms</small>
              </div>
              <div className="avatar avatar-xl bg-primary rounded d-flex align-items-center justify-content-center">
                <i className="ti ti-users fs-24 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="card flex-fill border-0">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h2 className="mb-0">{stats.totalRooms}</h2>
                <p className="mb-0">Total Rooms</p>
                <small className="text-muted">{stats.totalResidents} occupied</small>
              </div>
              <div className="avatar avatar-xl bg-success rounded d-flex align-items-center justify-content-center">
                <i className="ti ti-door fs-24 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="card flex-fill border-0">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h2 className="mb-0">{stats.maintenanceIssues}</h2>
                <p className="mb-0">Maintenance Issues</p>
                <small className="text-muted">2 critical</small>
              </div>
              <div className="avatar avatar-xl bg-warning rounded d-flex align-items-center justify-content-center">
                <i className="ti ti-tool fs-24 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="card flex-fill border-0">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h2 className="mb-0">{stats.pendingComplaints}</h2>
                <p className="mb-0">Pending Complaints</p>
                <small className="text-muted">1 urgent</small>
              </div>
              <div className="avatar avatar-xl bg-danger rounded d-flex align-items-center justify-content-center">
                <i className="ti ti-alert-circle fs-24 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROOM OCCUPANCY CHART ── */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Room Occupancy Distribution</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="block" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="occupied" fill="#22c55e" name="Occupied" />
                  <Bar dataKey="vacant" fill="#ef4444" name="Vacant" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROOM OCCUPANCY TABLE ── */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">Room Occupancy Status</h5>
              <Link to="/hostel/rooms/assign" className="btn btn-sm btn-primary">
                <i className="ti ti-plus me-1" />Assign Room
              </Link>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Room No.</th>
                      <th>Block</th>
                      <th>Residents</th>
                      <th>Capacity</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomData.map((room) => (
                      <tr key={room.roomNumber}>
                        <td>{room.roomNumber}</td>
                        <td>{room.block}</td>
                        <td>{room.currentResidents}</td>
                        <td>{room.capacity}</td>
                        <td>
                          <span className={`badge ${
                            room.currentResidents === room.capacity 
                              ? 'bg-success-transparent' 
                              : room.currentResidents === 0 
                                ? 'bg-secondary-transparent' 
                                : 'bg-info-transparent'
                          }`}>
                            {room.currentResidents === room.capacity 
                              ? 'Full' 
                              : room.currentResidents === 0 
                                ? 'Vacant' 
                                : 'Available'}
                          </span>
                        </td>
                        <td>
                          <Link to={`/hostel/rooms/${room.id}/edit`} className="btn btn-sm btn-primary">
                            <i className="ti ti-edit" />
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
                <Link to="/hostel/rooms" className="btn btn-light border">
                  <i className="ti ti-door me-2" />Manage Rooms
                </Link>
                <Link to="/hostel/residents" className="btn btn-light border">
                  <i className="ti ti-users me-2" />Manage Residents
                </Link>
                <Link to="/hostel/maintenance" className="btn btn-light border">
                  <i className="ti ti-tool me-2" />Maintenance Issues
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Pending Issues</h5>
            </div>
            <div className="card-body">
              <div className="alert alert-danger mb-2">
                <i className="ti ti-alert-triangle me-2" />
                Room 205 - Water blockage (Urgent)
              </div>
              <div className="alert alert-warning mb-2">
                <i className="ti ti-alert-circle me-2" />
                Room 312 - AC not cooling
              </div>
              <div className="alert alert-info mb-0">
                <i className="ti ti-info-circle me-2" />
                Complaint from Room 115 resident
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HostelDashboardPage
