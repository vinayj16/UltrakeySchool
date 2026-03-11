import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import agentService, { type Agent } from '../../services/agentService'

const AgentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgent = async () => {
      if (!id) {
        setError('Agent ID is required')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const agentData = await agentService.getById(id)
        setAgent(agentData)
      } catch (err: any) {
        console.error('Error fetching agent:', err)
        setError(err.message || 'Failed to fetch agent details')
      } finally {
        setLoading(false)
      }
    }

    fetchAgent()
  }, [id])

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5 className="text-muted">Loading agent details...</h5>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="text-center py-5">
              <i className="ti ti-user-off fs-48 text-muted mb-3 d-block" />
              <h5 className="text-muted">{error || 'Agent not found'}</h5>
              <p className="text-muted">{error ? 'Please try again later.' : 'The agent you\'re looking for doesn\'t exist.'}</p>
              <button className="btn btn-primary" onClick={() => navigate('/super-admin/agents')}>
                <i className="ti ti-arrow-left me-2" />Back to Agents
              </button>
            </div>
          </div>
        </div>
      </div>
    )
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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Agent Details</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href="/super-admin/dashboard">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="/super-admin/agents">Agents</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">Agent Details</li>
                </ol>
              </nav>
            </div>
            <div>
              <button className="btn btn-light" onClick={() => navigate('/super-admin/agents')}>
                <i className="ti ti-arrow-left me-2" />Back to Agents
              </button>
            </div>
          </div>

          {/* Agent Profile Card */}
          <div className="card mb-3">
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <div className="d-flex align-items-center mb-3">
                    <div className="avatar avatar-xl bg-primary-transparent rounded-circle me-3">
                      <i className="ti ti-user fs-36 text-primary" />
                    </div>
                    <div>
                      <h4 className="mb-1">{agent.name}</h4>
                      <div className="d-flex gap-2 mb-2">
                        {getStatusBadge(agent.status)}
                      </div>
                      <div className="text-muted">
                        <i className="ti ti-calendar me-1" />Created: {new Date(agent.createdAt).toLocaleDateString()}
                      </div>
                      {agent.updatedBy && (
                        <div className="text-muted">
                          <i className="ti ti-pencil me-1" />Last updated by: {agent.updatedBy.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <button className="btn btn-primary me-2" onClick={() => navigate(`/super-admin/agents/${agent._id}/edit`)}>
                    <i className="ti ti-edit me-2" />Edit Agent
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="row g-3">
            {/* Contact Information */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="ti ti-phone-call me-2" />Contact Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="text-muted small">Email</label>
                    <div className="fw-semibold">{agent.email}</div>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small">Phone</label>
                    <div className="fw-semibold">{agent.phone}</div>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small">Commission Rate</label>
                    <div className="fw-semibold">{agent.commissionRate}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="ti ti-map-pin me-2" />Address Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="text-muted small">Address</label>
                    <div className="fw-semibold">{agent.address}</div>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small">City, State</label>
                    <div className="fw-semibold">{agent.city}, {agent.state}</div>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small">Country</label>
                    <div className="fw-semibold">{agent.country}</div>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small">Postal Code</label>
                    <div className="fw-semibold">{agent.postalCode}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="ti ti-info-circle me-2" />Additional Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="text-muted small">Created Date</label>
                        <div className="fw-semibold">{new Date(agent.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small">Last Updated</label>
                        <div className="fw-semibold">{new Date(agent.updatedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="text-muted small">Created By</label>
                        <div className="fw-semibold">{agent.createdBy?.name || 'System'}</div>
                      </div>
                      {agent.updatedBy && (
                        <div className="mb-3">
                          <label className="text-muted small">Updated By</label>
                          <div className="fw-semibold">{agent.updatedBy.name}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  {agent.notes && (
                    <div className="mt-3">
                      <label className="text-muted small">Notes</label>
                      <div className="fw-semibold">{agent.notes}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentDetailsPage
