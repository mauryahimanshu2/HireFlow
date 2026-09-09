import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function PublicRoute() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Outlet />
  }

  if (user.role === 'JobSeeker') {
    return <Navigate to="/jobseeker/dashboard" replace />
  }

  if (user.role === 'Recruiter') {
    return <Navigate to="/recruiter/dashboard" replace />
  }

  if (user.role === 'Admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <Navigate to="/" replace />
}

export default PublicRoute