import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/authStore'

interface ProtectedRouteProps {
  children?: React.ReactNode
  element?: React.ReactElement
  requiredPlan?: 'basic' | 'medium' | 'premium'
  requiredRole?: string
  requiredRoles?: string[]
  requiredModule?: string
  requiredModules?: string[]
  requiredPermissions?: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  element,
  requiredRole,
  requiredRoles,
  requiredModule,
  requiredModules,
  requiredPermissions,
  requiredPlan
}) => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  // Check authentication
  if (!isAuthenticated || !user) {
    console.log('[ProtectedRoute] User not authenticated, redirecting to login');
    console.log('[ProtectedRoute] isAuthenticated:', isAuthenticated);
    console.log('[ProtectedRoute] user:', user);
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  console.log('[ProtectedRoute] User authenticated:', user.email, 'Role:', user.role);

  // Normalize roles for comparison (handle both superadmin and super_admin, SUPER_ADMIN, staff_member = STAFF, etc.)
  const normalizeRole = (role: string) => {
    const normalized = role.toLowerCase().replace(/_/g, '').replace(/-/g, '')
    if (normalized === 'staffmember') return 'staff'
    return normalized
  }

  const userRoleNormalized = user.role ? normalizeRole(user.role) : ''
  console.log('[ProtectedRoute] Normalized user role:', userRoleNormalized);

  // Check role requirements
  if (requiredRole) {
    const requiredRoleNormalized = normalizeRole(requiredRole)
    console.log('[ProtectedRoute] Required role (normalized):', requiredRoleNormalized);
    if (userRoleNormalized !== requiredRoleNormalized) {
      console.log('[ProtectedRoute] Role mismatch:', user.role, 'required:', requiredRole);
      return <Navigate to="/unauthorized" replace />
    }
  }

  if (requiredRoles && user.role) {
    console.log('[ProtectedRoute] Required roles:', requiredRoles);
    const hasMatchingRole = requiredRoles.some(role => {
      const normalized = normalizeRole(role);
      console.log('[ProtectedRoute] Checking role:', role, '(normalized:', normalized, ') against user role:', userRoleNormalized);
      return normalized === userRoleNormalized;
    });
    if (!hasMatchingRole) {
      console.log('[ProtectedRoute] Role not in required roles:', user.role, 'required:', requiredRoles);
      return <Navigate to="/unauthorized" replace />
    }
    console.log('[ProtectedRoute] Role match found!');
  }

  // Check module requirements
  if (requiredModule && !user.modules?.includes(requiredModule)) {
    console.log('[ProtectedRoute] Module not available:', requiredModule)
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="card text-center p-5">
          <div className="card-body">
            <div className="mb-4">
              <i className="ti ti-package-x fs-1 text-info mb-3"></i>
            </div>
            <h4 className="mb-3">Module Not Available</h4>
            <p className="text-muted mb-4">
              This module is not included in your current plan.
              <br />
              Please upgrade your plan to access this feature.
            </p>
            <button className="btn btn-primary">Upgrade Plan</button>
          </div>
        </div>
      </div>
    )
  }

  if (requiredModules && user.modules) {
    const hasAllModules = requiredModules.every(mod => user.modules?.includes(mod) || false)
    if (!hasAllModules) {
      console.log('[ProtectedRoute] Missing required modules')
      return (
        <div className="d-flex align-items-center justify-content-center vh-100">
          <div className="card text-center p-5">
            <div className="card-body">
              <div className="mb-4">
                <i className="ti ti-package-x fs-1 text-info mb-3"></i>
              </div>
              <h4 className="mb-3">Modules Not Available</h4>
              <p className="text-muted mb-4">
                Some required modules are not included in your current plan.
              </p>
              <button className="btn btn-primary">Upgrade Plan</button>
            </div>
          </div>
        </div>
      )
    }
  }

  // Check permission requirements
  if (requiredPermissions && user.permissions) {
    const hasAllPermissions = requiredPermissions.every(perm => 
      user.permissions?.includes(perm) || user.permissions?.includes('*') || false
    )
    if (!hasAllPermissions) {
      console.log('[ProtectedRoute] Missing required permissions')
      return <Navigate to="/unauthorized" replace />
    }
  }

  // Check plan requirements
  if (requiredPlan && user.plan) {
    const planHierarchy = { basic: 1, medium: 2, premium: 3 }
    const userPlanLevel = planHierarchy[user.plan as keyof typeof planHierarchy] ?? 0
    const requiredPlanLevel = planHierarchy[requiredPlan]
    
    if (userPlanLevel < requiredPlanLevel) {
      console.log('[ProtectedRoute] Plan upgrade required')
      return (
        <div className="d-flex align-items-center justify-content-center vh-100">
          <div className="card text-center p-5">
            <div className="card-body">
              <div className="mb-4">
                <i className="ti ti-crown fs-1 text-warning mb-3"></i>
              </div>
              <h4 className="mb-3">Upgrade Required</h4>
              <p className="text-muted mb-4">
                This feature requires a {requiredPlan} plan or higher.
                <br />
                Your current plan: {user.plan}
              </p>
              <button className="btn btn-primary">Upgrade Plan</button>
            </div>
          </div>
        </div>
      )
    }
  }

  // All checks passed
  if (element) return <>{element}</>
  return <>{children}</>
}

export default ProtectedRoute
