import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'
import JobForm from '../../components/recruiter/JobForm'
import jobService from '../../services/jobService'

function JobFormPage() {
  const navigate = useNavigate()
  const { jobId } = useParams()

  const isEditMode = Boolean(jobId)

  const [job, setJob] = useState(null)

  const [loading, setLoading] = useState(
    isEditMode,
  )
  const [saving, setSaving] = useState(false)

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

  const loadJob = async () => {
    if (!jobId) {
      return
    }

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
          'Unable to load job.',
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJob()
  }, [jobId])

  const handleSubmit = async (formData) => {
    setSaving(true)
    setPageError('')
    setSuccessMessage('')

    try {
      if (isEditMode) {
        await jobService.updateJob(
          jobId,
          formData,
        )

        setSuccessMessage(
          'Job updated successfully.',
        )
      } else {
        await jobService.createJob(formData)

        setSuccessMessage(
          'Job created successfully.',
        )
      }

      setTimeout(() => {
        navigate('/recruiter/jobs')
      }, 700)
    } catch (error) {
      setPageError(
        getErrorMessage(
          error,
          isEditMode
            ? 'Unable to update job.'
            : 'Unable to create job.',
        ),
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-600">
          Loading job...
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
            to="/recruiter/dashboard"
            className="text-2xl font-bold text-blue-600"
          >
            HireFlow
          </Link>

          <Link
            to="/recruiter/jobs"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            My Jobs
          </Link>

        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode
              ? 'Edit Job'
              : 'Create Job'}
          </h1>

          <p className="mt-2 text-gray-600">
            {isEditMode
              ? 'Update your job posting.'
              : 'Create a new job posting.'}
          </p>
        </div>

        {pageError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {pageError}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">

          <JobForm
            job={job}
            onSubmit={handleSubmit}
            loading={saving}
          />

        </div>

      </main>
    </div>
  )
}

export default JobFormPage