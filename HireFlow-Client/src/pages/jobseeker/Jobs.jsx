import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import JobCard from '../../components/jobseeker/JobCard'
import JobSearch from '../../components/jobseeker/JobSearch'
import jobService from '../../services/jobService'

function Jobs() {
  const [jobs, setJobs] = useState([])

  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')

  const getErrorMessage = (error, fallback) => {
    return (
      error.response?.data?.message ||
      error.response?.data?.title ||
      fallback
    )
  }

  const loadJobs = async (filters = {}) => {
    setLoading(true)
    setPageError('')

    try {
      const response =
        await jobService.getJobs(filters)

      setJobs(
        Array.isArray(response)
          ? response
          : response?.items || [],
      )
    } catch (error) {
      setPageError(
        getErrorMessage(
          error,
          'Unable to load jobs.',
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

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

          <Link
            to="/jobseeker/dashboard"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Dashboard
          </Link>

        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Find Jobs
          </h1>

          <p className="mt-2 text-gray-600">
            Search for your next opportunity.
          </p>
        </div>

        {/* Search */}

        <JobSearch
          onSearch={loadJobs}
        />

        {/* Error */}

        {pageError && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {pageError}
          </div>
        )}

        {/* Jobs */}

        {loading ? (
          <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">
              Loading jobs...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">

            <div className="text-5xl">
              🔍
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No jobs found
            </h2>

            <p className="mt-2 text-gray-600">
              Try changing your search filters.
            </p>

          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
              />
            ))}

          </div>
        )}

      </main>
    </div>
  )
}

export default Jobs