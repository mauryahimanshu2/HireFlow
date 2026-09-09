import { useEffect, useState } from 'react'
import {
  Link,
  useParams,
} from 'react-router-dom'
import jobService from '../../services/jobService'

function JobDetails() {
  const { jobId } = useParams()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')

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
      setPageError('')

      try {
        const response =
          await jobService.getJobById(jobId)

        setJob(response)
      } catch (error) {
        setPageError(
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

  const formatSalary = () => {
    if (
      job?.salaryMin == null &&
      job?.salaryMax == null
    ) {
      return 'Salary not specified'
    }

    if (
      job?.salaryMin != null &&
      job?.salaryMax != null
    ) {
      return `₹${Number(
        job.salaryMin,
      ).toLocaleString()} - ₹${Number(
        job.salaryMax,
      ).toLocaleString()}`
    }

    if (job?.salaryMin != null) {
      return `From ₹${Number(
        job.salaryMin,
      ).toLocaleString()}`
    }

    return `Up to ₹${Number(
      job.salaryMax,
    ).toLocaleString()}`
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

  if (pageError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">

          <h2 className="text-xl font-bold text-gray-900">
            Unable to load job
          </h2>

          <p className="mt-2 text-red-600">
            {pageError}
          </p>

          <Link
            to="/jobseeker/jobs"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Jobs
          </Link>

        </div>
      </div>
    )
  }

  if (!job) {
    return null
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

          <Link
            to="/jobseeker/jobs"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Back to Jobs
          </Link>

        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">

        <div className="rounded-2xl bg-white p-8 shadow-sm">

          {/* Title */}

          <div className="border-b pb-6">

            <div className="flex flex-col justify-between gap-4 md:flex-row">

              <div>

                <h1 className="text-3xl font-bold text-gray-900">
                  {job.title}
                </h1>

                <p className="mt-2 text-lg font-semibold text-blue-600">
                  {job.companyName ||
                    'Company'}
                </p>

              </div>

              <span className="h-fit rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                {job.isActive
                  ? 'Active'
                  : 'Inactive'}
              </span>

            </div>

          </div>

          {/* Job information */}

          <div className="grid gap-6 border-b py-6 md:grid-cols-2">

            <div>
              <p className="text-sm text-gray-500">
                Location
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {job.location ||
                  'Not specified'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Employment Type
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {job.employmentType ||
                  'Not specified'}
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
                {formatSalary()}
              </p>
            </div>

          </div>

          {/* Description */}

          <section className="py-6">

            <h2 className="text-xl font-bold text-gray-900">
              Job Description
            </h2>

            <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
              {job.description}
            </p>

          </section>

          {/* Skills */}

          {job.skills && (
            <section className="border-t py-6">

              <h2 className="text-xl font-bold text-gray-900">
                Required Skills
              </h2>

              <p className="mt-4 whitespace-pre-line text-gray-600">
                {job.skills}
              </p>

            </section>
          )}

          {/* Apply will be added in Module 7 */}

          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
            Application functionality will be
            available in the Applications module.
          </div>

        </div>

      </main>
    </div>
  )
}

export default JobDetails