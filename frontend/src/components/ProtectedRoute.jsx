import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, hasRole, loading, user } = useAuth()
  const location = useLocation()

  console.log('ProtectedRoute - loading:', loading, 'isAuthenticated:', isAuthenticated(), 'user:', user, 'role:', role)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated()) {
    console.log('Not authenticated, redirecting to login')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && !hasRole(role)) {
    console.log('User does not have required role:', role, 'user role:', user?.role)
    return <Navigate to="/" replace />
  }

  console.log('Access granted')
  return children
}

export default ProtectedRoute
