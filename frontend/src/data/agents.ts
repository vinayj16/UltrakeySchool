export interface Institution {
  id: string
  name: string
  type: string
  location: string
  establishedDate: string
  status: 'Active' | 'Inactive' | 'Pending'
  revenue: number
}

export interface Agent {
  id: string
  name: string
  email: string
  phone: string
  status: 'Active' | 'Suspended' | 'Inactive'
  joinDate: string
  lastLogin: string
  institutionsCreated: number
  institutions: Institution[]
  totalRevenue: number
  commissionRate: number
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  performance: 'Excellent' | 'Good' | 'Average' | 'Poor'
  notes: string
}

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@agent.com',
    phone: '+1-555-0101',
    status: 'Active',
    joinDate: '2024-01-15',
    lastLogin: '2024-06-20 10:30 AM',
    institutionsCreated: 12,
    institutions: [
      { id: '1', name: 'Harvard University', type: 'University', location: 'Cambridge, MA', establishedDate: '2024-02-01', status: 'Active', revenue: 5000 },
      { id: '2', name: 'MIT', type: 'University', location: 'Cambridge, MA', establishedDate: '2024-02-15', status: 'Active', revenue: 4500 },
      { id: '3', name: 'Stanford University', type: 'University', location: 'Stanford, CA', establishedDate: '2024-03-01', status: 'Active', revenue: 6000 }
    ],
    totalRevenue: 45000,
    commissionRate: 10,
    address: '123 Agent Street',
    city: 'New York',
    state: 'NY',
    country: 'United States',
    postalCode: '10001',
    performance: 'Excellent',
    notes: 'Top performing agent with excellent client relationships'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@agent.com',
    phone: '+1-555-0102',
    status: 'Active',
    joinDate: '2024-02-20',
    lastLogin: '2024-06-19 02:15 PM',
    institutionsCreated: 8,
    institutions: [
      { id: '4', name: 'UCLA', type: 'University', location: 'Los Angeles, CA', establishedDate: '2024-03-10', status: 'Active', revenue: 4000 },
      { id: '5', name: 'Berkeley', type: 'University', location: 'Berkeley, CA', establishedDate: '2024-04-01', status: 'Active', revenue: 3800 }
    ],
    totalRevenue: 32000,
    commissionRate: 8,
    address: '456 Sales Avenue',
    city: 'Los Angeles',
    state: 'CA',
    country: 'United States',
    postalCode: '90001',
    performance: 'Good',
    notes: 'Consistent performer, good communication skills'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@agent.com',
    phone: '+1-555-0103',
    status: 'Suspended',
    joinDate: '2024-03-10',
    lastLogin: '2024-06-10 09:45 AM',
    institutionsCreated: 5,
    institutions: [
      { id: '6', name: 'University of Chicago', type: 'University', location: 'Chicago, IL', establishedDate: '2024-03-20', status: 'Active', revenue: 3500 },
      { id: '7', name: 'Northwestern', type: 'University', location: 'Evanston, IL', establishedDate: '2024-04-15', status: 'Inactive', revenue: 3200 }
    ],
    totalRevenue: 18000,
    commissionRate: 7,
    address: '789 Business Blvd',
    city: 'Chicago',
    state: 'IL',
    country: 'United States',
    postalCode: '60601',
    performance: 'Average',
    notes: 'Under performance review, needs improvement'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@agent.com',
    phone: '+1-555-0104',
    status: 'Active',
    joinDate: '2024-04-05',
    lastLogin: '2024-06-18 04:30 PM',
    institutionsCreated: 6,
    institutions: [
      { id: '8', name: 'Rice University', type: 'University', location: 'Houston, TX', establishedDate: '2024-04-25', status: 'Active', revenue: 4000 },
      { id: '9', name: 'University of Texas', type: 'University', location: 'Austin, TX', establishedDate: '2024-05-10', status: 'Active', revenue: 4200 }
    ],
    totalRevenue: 24000,
    commissionRate: 9,
    address: '321 Partnership Way',
    city: 'Houston',
    state: 'TX',
    country: 'United States',
    postalCode: '77001',
    performance: 'Good',
    notes: 'Reliable agent, growing client base'
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert.wilson@agent.com',
    phone: '+1-555-0105',
    status: 'Inactive',
    joinDate: '2024-05-12',
    lastLogin: '2024-05-28 11:20 AM',
    institutionsCreated: 3,
    institutions: [
      { id: '10', name: 'Arizona State University', type: 'University', location: 'Tempe, AZ', establishedDate: '2024-05-20', status: 'Pending', revenue: 3000 }
    ],
    totalRevenue: 12000,
    commissionRate: 6,
    address: '654 Commission Drive',
    city: 'Phoenix',
    state: 'AZ',
    country: 'United States',
    postalCode: '85001',
    performance: 'Poor',
    notes: 'New agent, still learning the process'
  }
]

// Get all institutions from all agents
export const getAllInstitutions = () => {
  const allInstitutions: (Institution & { agentName: string; agentId: string })[] = []
  
  mockAgents.forEach(agent => {
    agent.institutions.forEach(institution => {
      allInstitutions.push({
        ...institution,
        agentName: agent.name,
        agentId: agent.id
      })
    })
  })
  
  // Sort by latest first (by establishedDate)
  return allInstitutions.sort((a, b) => new Date(b.establishedDate).getTime() - new Date(a.establishedDate).getTime())
}

// Get all agents
export const getAllAgents = (): Agent[] => {
  return mockAgents
}

// Get agent by ID
export const getAgentById = (id: string): Agent | null => {
  return mockAgents.find(agent => agent.id === id) || null
}

// Filter agents by status
export const getAgentsByStatus = (status: string): Agent[] => {
  if (status === 'all') return mockAgents
  return mockAgents.filter(agent => agent.status === status)
}

// Filter agents by performance
export const getAgentsByPerformance = (performance: string): Agent[] => {
  if (performance === 'all') return mockAgents
  return mockAgents.filter(agent => agent.performance === performance)
}

// Search agents
export const searchAgents = (searchTerm: string): Agent[] => {
  const term = searchTerm.toLowerCase()
  return mockAgents.filter(agent =>
    agent.name.toLowerCase().includes(term) ||
    agent.email.toLowerCase().includes(term) ||
    agent.phone.includes(term) ||
    agent.city.toLowerCase().includes(term) ||
    agent.state.toLowerCase().includes(term)
  )
}
