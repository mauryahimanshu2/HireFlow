import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ApplicationCard from '../../components/jobseeker/ApplicationCard'
import applicationService from '../../services/applicationService'

function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const getErrorMessage = (error, fallback) => {
    return (
      error.response?.data?.message ||
      error.response?.data?.title ||
      fallback
    )
  }

  const loadApplications = async () => {
    setLoading(true)
    setError('')

    try {
      const data =
        await applicationService.getMyApplications()

      setApplications(Array.isArray(data) ? data : [])
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Unable to load your applications.',
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [])

  const handleWithdraw = async (applicationId) => {
    const confirmed = window.confirm(
      'Are you sure you want to withdraw this application?',
    )

    if (!confirmed) {
      return
    }

    setError('')
    setSuccessMessage('')

    try {
      await applicationService.withdrawApplication(
        applicationId,
      )

      setSuccessMessage(
        'Application withdrawn successfully.',
      )

      await loadApplications()
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Unable to withdraw application.',
        ),
      )
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">
          Loading applications...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            to="/jobseeker/dashboard"
            className="text-2xl font-bold text-blue-600"
          >
            HireFlow
          </Link>

          <div className="flex gap-3">

            <Link
              to="/jobseeker/jobs"
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Find Jobs
            </Link>

            <Link
              to="/jobseeker/dashboard"
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Dashboard
            </Link>

          </div>

        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-6 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Applications
          </h1>

          <p className="mt-2 text-gray-600">
            Track the jobs you have applied for.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              No Applications Yet
            </h2>

            <p className="mt-2 text-gray-600">
              Start applying for jobs that match your skills.
            </p>

            <Link
              to="/jobseeker/jobs"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Find Jobs
            </Link>

          </div>
        ) : (
          <div className="space-y-5">
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onWithdraw={handleWithdraw}
              />
            ))}
          </div>
        )}

      </main>

    </div>
  )
}

export default Applications