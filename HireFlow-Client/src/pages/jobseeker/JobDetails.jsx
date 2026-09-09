import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import jobService from '../../services/jobService'
import applicationService from '../../services/applicationService'

function JobDetails() {
  const { jobId } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)

  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)

  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const getErrorMessage = (error, fallback) => {
    return (
      error.response?.data?.message ||
      error.response?.data?.title ||
      fallback
    )
  }

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true)
      setError('')

      try {
        const data =
          await jobService.getJobById(jobId)

        setJob(data)
      } catch (error) {
        setError(
          getErrorMessage(
            error,
            'Unable to load job details.',
          ),
        )
      } finally {
        setLoading(false)
      }
    }

    loadJob()
  }, [jobId])

  const handleApply = async () => {
    setApplying(true)
    setError('')
    setSuccessMessage('')

    try {
      await applicationService.applyForJob(jobId)

      setSuccessMessage(
        'Application submitted successfully.',
      )
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Unable to submit application.',
        ),
      )
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">
          Loading job...
        </p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">

          <h1 className="text-2xl font-bold text-gray-900">
            Job Not Found
          </h1>

          <Link
            to="/jobseeker/jobs"
            className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
          >
            Back to Jobs
          </Link>

        </div>
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
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Find Jobs
            </Link>

            <Link
              to="/jobseeker/applications"
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
            >
              My Applications
            </Link>

          </div>

        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">

        <Link
          to="/jobseeker/jobs"
          className="text-sm font-medium text-blue-600"
        >
          ← Back to Jobs
        </Link>

        <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm">

          {/* Header */}
          <div className="flex flex-col justify-between gap-6 sm:flex-row">

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-3xl font-bold text-gray-900">
                  {job.title}
                </h1>

                {job.isActive ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    Inactive
                  </span>
                )}

              </div>

              <p className="mt-3 text-lg text-gray-600">
                {job.companyName || 'Company'}
              </p>

            </div>

            {/* Apply */}
            {job.isActive && (
              <button
                type="button"
                onClick={handleApply}
                disabled={applying}
                className="h-fit rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {applying
                  ? 'Applying...'
                  : 'Apply Now'}
              </button>
            )}

          </div>

          {/* Messages */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <span>
                  {successMessage}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/jobseeker/applications',
                    )
                  }
                  className="font-semibold text-green-800 underline"
                >
                  View Applications
                </button>

              </div>
            </div>
          )}

          {/* Job information */}
          <div className="mt-8 grid gap-6 border-t pt-8 sm:grid-cols-2 lg:grid-cols-3">

            <div>
              <p className="text-sm text-gray-500">
                Location
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {job.location || 'Not specified'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Employment Type
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {job.employmentType || 'Not specified'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Experience
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {job.experienceRequired ||
                  'Not specified'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Salary
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {job.salaryMin != null ||
                job.salaryMax != null
                  ? `${job.salaryMin ?? '—'} - ${
                      job.salaryMax ?? '—'
                    }`
                  : 'Not specified'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Posted
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {new Date(
                  job.createdAt,
                ).toLocaleDateString()}
              </p>
            </div>

          </div>

          {/* Description */}
          <div className="mt-10 border-t pt-8">

            <h2 className="text-xl font-bold text-gray-900">
              Job Description
            </h2>

            <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
              {job.description}
            </p>

          </div>

          {/* Skills */}
          {job.skills && (
            <div className="mt-10 border-t pt-8">

              <h2 className="text-xl font-bold text-gray-900">
                Required Skills
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">

                {job.skills
                  .split(',')
                  .map((skill) => skill.trim())
                  .filter(Boolean)
                  .map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}

              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  )
}

export default JobDetails