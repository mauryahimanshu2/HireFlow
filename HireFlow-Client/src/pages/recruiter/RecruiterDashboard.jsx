import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function RecruiterDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/recruiter/dashboard"
            className="text-2xl font-bold text-blue-600"
          >
            HireFlow
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/recruiter/profile"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              My Profile
            </Link>

            <Link
              to="/recruiter/company"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Company
            </Link>

            <Link
              to="/recruiter/jobs"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Jobs
            </Link>

            <Link
              to="/recruiter/applicants"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Applicants
            </Link>

            <div className="border-l pl-4">
              <p className="text-sm font-semibold text-gray-900">
                {user?.name}
              </p>

              <p className="text-xs text-gray-500">
                Recruiter
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
            Manage your recruiter profile, company and jobs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/recruiter/profile"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">👤</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              My Profile
            </h2>

            <p className="mt-2 text-gray-600">
              Manage your recruiter information.
            </p>
          </Link>

          <Link
            to="/recruiter/company"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">🏢</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Company
            </h2>

            <p className="mt-2 text-gray-600">
              Manage your company information and logo.
            </p>
          </Link>

          <Link
            to="/recruiter/jobs"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">💼</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Manage Jobs
            </h2>

            <p className="mt-2 text-gray-600">
              Create and manage job postings.
            </p>
          </Link>

          <Link
            to="/recruiter/applicants"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-3xl">👥</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Applicants
            </h2>

            <p className="mt-2 text-gray-600">
              Review candidates and applications.
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default RecruiterDashboard