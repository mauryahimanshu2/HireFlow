import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import JobCard from '../../components/recruiter/JobCard'
import jobService from '../../services/jobService'

function Jobs() {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] =
    useState(false)

  const [pageError, setPageError] = useState('')
  const [successMessage, setSuccessMessage] =
    useState('')

  const getErrorMessage = (error, fallback) => {
    return (
      error.response?.data?.message ||
      error.response?.data?.title ||
      fallback
    )
  }

  const loadJobs = async () => {
    setLoading(true)
    setPageError('')

    try {
      const response = await jobService.getJobs()

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

  const handleEdit = (job) => {
    navigate(`/recruiter/jobs/edit/${job.id}`)
  }

  const handleToggleStatus = async (job) => {
    setActionLoading(true)
    setPageError('')
    setSuccessMessage('')

    try {
      const response = job.isActive
        ? await jobService.patchJob(job.id, {
            isActive: false,
          })
        : await jobService.patchJob(job.id, {
            isActive: true,
          })

      setJobs((previousJobs) =>
        previousJobs.map((item) =>
          item.id === job.id
            ? response
            : item,
        ),
      )

      setSuccessMessage(
        job.isActive
          ? 'Job deactivated successfully.'
          : 'Job activated successfully.',
      )
    } catch (error) {
      setPageError(
        getErrorMessage(
          error,
          'Unable to change job status.',
        ),
      )
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (job) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${job.title}"?`,
    )

    if (!confirmed) {
      return
    }

    setActionLoading(true)
    setPageError('')
    setSuccessMessage('')

    try {
      await jobService.deleteJob(job.id)

      setJobs((previousJobs) =>
        previousJobs.filter(
          (item) => item.id !== job.id,
        ),
      )

      setSuccessMessage(
        'Job deleted successfully.',
      )
    } catch (error) {
      setPageError(
        getErrorMessage(
          error,
          'Unable to delete job. A job with applications cannot be deleted.',
        ),
      )
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}

      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            to="/recruiter/dashboard"
            className="text-2xl font-bold text-blue-600"
          >
            HireFlow
          </Link>

          <Link
            to="/recruiter/dashboard"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Dashboard
          </Link>

        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* Header */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Jobs
            </h1>

            <p className="mt-2 text-gray-600">
              Create and manage your job postings.
            </p>
          </div>

          <Link
            to="/recruiter/jobs/create"
            className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            + Create Job
          </Link>

        </div>

        {/* Error */}

        {pageError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {pageError}
          </div>
        )}

        {/* Success */}

        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* Loading */}

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">
              Loading jobs...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

            <div className="text-5xl">
              💼
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No jobs found
            </h2>

            <p className="mt-2 text-gray-600">
              Create your first job posting.
            </p>

            <Link
              to="/recruiter/jobs/create"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Create Job
            </Link>

          </div>
        ) : (
          <div className="space-y-5">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={handleEdit}
                onToggleStatus={
                  handleToggleStatus
                }
                onDelete={handleDelete}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}

export default Jobs