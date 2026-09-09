import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function JobSeekerDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/jobseeker/dashboard"
            className="text-2xl font-bold text-blue-600"
          >
            HireFlow
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/jobseeker/profile"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              My Profile
            </Link>

            <Link
              to="/jobseeker/applications"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Applications
            </Link>

            <div className="border-l pl-4">
              <p className="text-sm font-semibold text-gray-900">
                {user?.name}
              </p>

              <p className="text-xs text-gray-500">
                Job Seeker
              </p>
            </div>

            <button
              onClick={logout}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name}
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your profile and track your job applications.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Link
            to="/jobseeker/profile"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">👤</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              My Profile
            </h2>

            <p className="mt-2 text-gray-600">
              Create and manage your professional profile.
            </p>
          </Link>

          <Link
            to="/jobs"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">💼</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Find Jobs
            </h2>

            <p className="mt-2 text-gray-600">
              Search and apply for available jobs.
            </p>
          </Link>

          <Link
            to="/jobseeker/applications"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">📋</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Applications
            </h2>

            <p className="mt-2 text-gray-600">
              Track the status of your applications.
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default JobSeekerDashboard