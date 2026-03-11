import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiService } from '../../services/api'
import { getInstitutionConfigFromPath } from '../../utils/institutionUtils'

interface Institution {
  id: string
  name: string
  type: 'School' | 'Inter College' | 'Degree College' | 'University'
  location: string
  status: 'Active' | 'Suspended' | 'Expired'
  establishedDate: string
  revenue: number
  plan: 'Basic' | 'Medium' | 'Premium'
  students: number
  adminEmail: string
  adminPhone: string
  adminName: string
}

const InstitutionsPage = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended' | 'Expired'>('All')
  const [typeFilter, setTypeFilter] = useState<string>('All')
  const [showAdminProfile, setShowAdminProfile] = useState(false)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch institutions from API
        const response = await apiService.get('/schools')
        
        if (response.success && response.data) {
          setInstitutions(response.data as Institution[])
        } else {
          setError('Failed to fetch institutions')
        }
      } catch (err) {
        console.error('Error fetching institutions:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch institutions')
      } finally {
        setLoading(false)
      }
    }

    fetchInstitutions()
  }, [])

  // Filter institutions based on search and filters
  const filteredInstitutions = institutions.filter(institution => {
    const matchesSearch = institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       institution.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'All' || institution.status === statusFilter
    const matchesType = typeFilter === 'All' || institution.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  // Pagination
  const totalPages = Math.ceil(filteredInstitutions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentInstitutions = filteredInstitutions.slice(startIndex, endIndex)

  // Get unique types for filter dropdown
  const uniqueTypes = ['All', ...Array.from(new Set(institutions.map(inst => inst.type)))]

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-success'
      case 'Suspended': return 'bg-warning'
      case 'Expired': return 'bg-danger'
      default: return 'bg-secondary'
    }
  }

  const getCreatorBadgeClass = (createdBy: string) => {
    switch (createdBy) {
      case 'Agent': return 'bg-primary'
      case 'Admin': return 'bg-info'
      default: return 'bg-secondary'
    }
  }

  const getCreatorTypeText = (createdBy: string, agentName: string) => {
    switch (createdBy) {
      case 'Agent': 
        // Extract agent number from name (e.g., "John Smith" -> "Agent 1")
        if (agentName.includes('John')) return 'Agent 1'
        if (agentName.includes('Sarah')) return 'Agent 2'
        if (agentName.includes('Michael')) return 'Agent 3'
        if (agentName.includes('Emily')) return 'Agent 4'
        return 'Agent'
      case 'Admin': return 'Self Admin'
      default: return 'Unknown'
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this institution? This action cannot be undone.')) {
      try {
        const response = await apiService.delete(`/schools/${id}`)
        if (response.success) {
          // Refresh institutions list
          const updatedResponse = await apiService.get('/schools')
          if (updatedResponse.success && updatedResponse.data) {
            setInstitutions(updatedResponse.data as Institution[])
          }
        }
      } catch (err) {
        console.error('Error deleting institution:', err)
      }
    }
  }

  const handleEdit = (id: string) => {
    // Navigate to edit page
    window.location.href = `/super-admin/institutions/edit/${id}`
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
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold">Institutions Management</h4>
          <p className="text-muted mb-0">View and manage all registered institutions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 bg-primary text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="card-title mb-0">Total Institutions</h5>
                  <h3 className="mb-0">{institutions.length}</h3>
                </div>
                <div className="avatar avatar-md bg-white bg-opacity-20 rounded-circle">
                  <i className="ti ti-building fs-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-success text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="card-title mb-0">Active</h5>
                  <h3 className="mb-0">{institutions.filter(i => i.status === 'Active').length}</h3>
                </div>
                <div className="avatar avatar-md bg-white bg-opacity-20 rounded-circle">
                  <i className="ti ti-check fs-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-warning text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="card-title mb-0">Suspended</h5>
                  <h3 className="mb-0">{institutions.filter(i => i.status === 'Suspended').length}</h3>
                </div>
                <div className="avatar avatar-md bg-white bg-opacity-20 rounded-circle">
                  <i className="ti ti-alert-triangle fs-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 bg-danger text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5 className="card-title mb-0">Expired</h5>
                  <h3 className="mb-0">{institutions.filter(i => i.status === 'Expired').length}</h3>
                </div>
                <div className="avatar avatar-md bg-white bg-opacity-20 rounded-circle">
                  <i className="ti ti-x fs-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, location, or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold">Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold">Type</label>
              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold">&nbsp;</label>
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('All')
                  setTypeFilter('All')
                  setCurrentPage(1)
                }}
              >
                <i className="ti ti-refresh me-2" />Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Institutions Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="ti ti-building me-2" />Institutions List
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Institution Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentInstitutions.map((institution) => (
                  <tr key={institution.id}>
                    <td className="fw-semibold">{institution.name}</td>
                    <td>{institution.type}</td>
                    <td>{institution.location}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(institution.status)} text-white`}>
                        {institution.status}
                      </span>
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
                            <button className="dropdown-item">
                              <i className="ti ti-eye me-2" />View Details
                            </button>
                          </li>
                          <li>
                            <button className="dropdown-item" onClick={() => handleEdit(institution.id)}>
                              <i className="ti ti-edit me-2" />Edit
                            </button>
                          </li>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <button className="dropdown-item text-danger" onClick={() => handleDelete(institution.id)}>
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

          {/* Empty State */}
          {currentInstitutions.length === 0 && (
            <div className="text-center py-5">
              <i className="ti ti-building-off fs-48 text-muted mb-3 d-block" />
              <h5 className="text-muted">No institutions found</h5>
              <p className="text-muted">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredInstitutions.length)} of {filteredInstitutions.length} institutions
              </div>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <i className="ti ti-chevron-left" />
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1
                    return (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    )
                  })}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <i className="ti ti-chevron-right" />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InstitutionsPage
