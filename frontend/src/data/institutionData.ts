import { mockSchools, type School } from './schools'
import type { InstitutionRouteType } from '../utils/institutionUtils'

// Filter institutions by type
export const getInstitutionsByType = (type: InstitutionRouteType): School[] => {
  const typeMap: Record<InstitutionRouteType, string> = {
    'schools': 'School',
    'inter-colleges': 'Inter College',
    'degree-colleges': 'Degree College',
    'engineering-colleges': 'Engineering College'
  }
  
  return mockSchools.filter(school => school.type === typeMap[type])
}

// Get institution by ID and type
export const getInstitutionById = (id: string, type: InstitutionRouteType): School | null => {
  const institutions = getInstitutionsByType(type)
  return institutions.find(school => school.id === id) || null
}

// Create mock data for different institution types if needed
export const createMockInstitution = (type: InstitutionRouteType, id: string): School => {
  const typeMap: Record<InstitutionRouteType, string> = {
    'schools': 'School',
    'inter-colleges': 'Inter College',
    'degree-colleges': 'Degree College',
    'engineering-colleges': 'Engineering College'
  }
  
  const nameMap: Record<InstitutionRouteType, string> = {
    'schools': 'Sample School',
    'inter-colleges': 'Sample Inter College',
    'degree-colleges': 'Sample Degree College',
    'engineering-colleges': 'Sample Engineering College'
  }
  
  return {
    id,
    name: nameMap[type],
    type: typeMap[type] as 'School' | 'Inter College' | 'Degree College' | 'Engineering College',
    plan: 'Premium',
    status: 'Active',
    expiryDate: '2024-12-31',
    students: 450,
    monthlyRevenue: 199,
    totalRevenue: 2388,
    adminName: 'Admin User',
    adminEmail: `admin@${type.replace('-', '')}.edu`,
    adminPhone: '+1-555-0123',
    address: '123 Education Street',
    city: 'Sample City',
    state: 'Sample State',
    country: 'United States',
    postalCode: '12345',
    createdAt: '2024-01-15',
    lastLogin: '2024-06-15 09:30 AM'
  }
}
