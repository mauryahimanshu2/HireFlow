import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import JobCard from '../../components/recruiter/JobCard'
import jobService from '../../services/jobService'
import recruiterService from '../../services/recruiterService'
import companyService from '../../services/companyService'

function Jobs() {
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [hasProfile, setHasProfile] = useState(true)
  const [hasCompany, setHasCompany] = useState(true)

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const [pageError, setPageError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

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

    // Check recruiter profile and company existence first
    try {
      const profile = await recruiterService.getProfile()
      setHasProfile(Boolean(profile))

      if (profile?.companyId) {
        setHasCompany(true)
      } else {
        // Try fetching company directly
        try {
          const company = await companyService.getCompanies()
          setHasCompany(Boolean(company))
        } catch {
          setHasCompany(false)
        }
      }
    } catch {
      setHasProfile(false)
      setHasCompany(false)
    }

    try {
      const response = await jobService.getMyJobs()

      setJobs(
        Array.isArray(response)
          ? response
          : response?.items || [],
      )
    } catch (error) {
      if (error.response?.status !== 404) {
        setPageError(
          getErrorMessage(
            error,
            'Unable to load your jobs.',
          ),
        )
      } else {
        setJobs([])
      }
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

  const isSetupComplete = hasProfile && hasCompany

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

          {isSetupComplete ? (
            <Link
              to="/recruiter/jobs/create"
              className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
            >
              + Create Job
            </Link>
          ) : (
            <button
              disabled
              title="Please complete profile & company setup first"
              className="cursor-not-allowed rounded-lg bg-gray-300 px-5 py-3 font-semibold text-gray-500"
            >
              + Create Job
            </button>
          )}
        </div>

        {/* Requirements Warning Banner */}
        {!isSetupComplete && !loading && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⚠️</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-900">
                  Profile & Company Setup Required
                </h3>
                <p className="mt-1 text-sm text-amber-800">
                  Before posting jobs, you must complete your Recruiter Profile and create or attach your Company.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {!hasProfile && (
                    <Link
                      to="/recruiter/profile"
                      className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                    >
                      1. Create Recruiter Profile
                    </Link>
                  )}

                  {!hasCompany && (
                    <Link
                      to="/recruiter/company"
                      className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                    >
                      {hasProfile ? '1. Create Company Profile' : '2. Create Company Profile'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

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
              {isSetupComplete
                ? 'You have not created any job postings yet.'
                : 'Complete your profile & company to post your first job.'}
            </p>

            {isSetupComplete && (
              <Link
                to="/recruiter/jobs/create"
                className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Create Job
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
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