import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ApplicationStatus from '../../components/jobseeker/ApplicationStatus'
import applicationService from '../../services/applicationService'

function ApplicationDetails() {
  const { applicationId } = useParams()

  const [application, setApplication] = useState(null)
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

  useEffect(() => {
    const loadApplication = async () => {
      setLoading(true)
      setError('')

      try {
        const data =
          await applicationService.getMyApplication(
            applicationId,
          )

        setApplication(data)
      } catch (error) {
        setError(
          getErrorMessage(
            error,
            'Unable to load application details.',
          ),
        )
      } finally {
        setLoading(false)
      }
    }

    loadApplication()
  }, [applicationId])

  const handleWithdraw = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to withdraw this application?',
    )

    if (!confirmed) {
      return
    }

    setError('')
    setSuccessMessage('')

    try {
      const response =
        await applicationService.withdrawApplication(
          applicationId,
        )

      setApplication(response)

      setSuccessMessage(
        'Application withdrawn successfully.',
      )
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
          Loading application...
        </p>
      </div>
    )
  }

  if (error && !application) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">

        <div className="mx-auto max-w-3xl">

          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>

          <Link
            to="/jobseeker/applications"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
          >
            Back to Applications
          </Link>

        </div>

      </div>
    )
  }

  const canWithdraw =
    application.status !== 'Withdrawn' &&
    application.status !== 'Rejected' &&
    application.status !== 'Selected'

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
            to="/jobseeker/applications"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            My Applications
          </Link>

        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-10">

        <Link
          to="/jobseeker/applications"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Applications
        </Link>

        <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm">

          <div className="flex flex-col justify-between gap-4 sm:flex-row">

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {application.jobTitle}
              </h1>

              <p className="mt-2 text-lg text-gray-600">
                {application.companyName}
              </p>
            </div>

            <ApplicationStatus
              status={application.status}
            />

          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          <div className="mt-8 grid gap-6 border-t pt-8 sm:grid-cols-2">

            <div>
              <p className="text-sm text-gray-500">
                Application ID
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                #{application.id}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Applied On
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {new Date(
                  application.appliedAt,
                ).toLocaleDateString()}
              </p>
            </div>

            {application.withdrawnAt && (
              <div>
                <p className="text-sm text-gray-500">
                  Withdrawn On
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {new Date(
                    application.withdrawnAt,
                  ).toLocaleDateString()}
                </p>
              </div>
            )}

            {application.updatedAt && (
              <div>
                <p className="text-sm text-gray-500">
                  Last Updated
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {new Date(
                    application.updatedAt,
                  ).toLocaleDateString()}
                </p>
              </div>
            )}

          </div>

          {application.recruiterRemarks && (
            <div className="mt-8 rounded-xl bg-gray-50 p-5">

              <h2 className="font-bold text-gray-900">
                Recruiter Remarks
              </h2>

              <p className="mt-2 text-gray-600">
                {application.recruiterRemarks}
              </p>

            </div>
          )}

          {canWithdraw && (
            <button
              type="button"
              onClick={handleWithdraw}
              className="mt-8 rounded-lg border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50"
            >
              Withdraw Application
            </button>
          )}

        </div>

      </main>

    </div>
  )
}

export default ApplicationDetails