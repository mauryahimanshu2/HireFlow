import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navigationItems = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Users', to: '/admin/users' },
  { label: 'Jobs', to: '/admin/jobs' },
]

function AdminNavigation() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link to="/admin/dashboard" className="text-2xl font-bold tracking-tight text-blue-600">HireFlow</Link>
          <div className="flex items-center gap-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 sm:justify-start">
          <div className="border-l border-slate-200 pl-4">
            <p className="text-sm font-semibold text-slate-900">Welcome, {user?.name || 'Admin'}</p>
            <p className="text-xs font-medium text-slate-500">Admin</p>
          </div>
          <button type="button" onClick={handleLogout} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">Logout</button>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavigation
