import { Link } from 'react-router-dom'
import ApplicationStatus from './ApplicationStatus'

function ApplicationCard({ application, onWithdraw }) {
  const canWithdraw =
    application.status !== 'Withdrawn' &&
    application.status !== 'Rejected' &&
    application.status !== 'Selected'

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">

      <div className="flex flex-col justify-between gap-4 sm:flex-row">

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {application.jobTitle}
          </h2>

          <p className="mt-1 text-gray-600">
            {application.companyName}
          </p>
        </div>

        <div>
          <ApplicationStatus
            status={application.status}
          />
        </div>

      </div>

      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">

        <div>
          <p className="text-gray-500">
            Applied On
          </p>

          <p className="mt-1 font-medium text-gray-900">
            {new Date(
              application.appliedAt,
            ).toLocaleDateString()}
          </p>
        </div>

        {application.updatedAt && (
          <div>
            <p className="text-gray-500">
              Last Updated
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {new Date(
                application.updatedAt,
              ).toLocaleDateString()}
            </p>
          </div>
        )}

      </div>

      {application.recruiterRemarks && (
        <div className="mt-5 rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">
            Recruiter Remarks
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {application.recruiterRemarks}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">

        <Link
          to={`/jobseeker/applications/${application.id}`}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          View Details
        </Link>

        {canWithdraw && (
          <button
            type="button"
            onClick={() => onWithdraw(application.id)}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Withdraw
          </button>
        )}

      </div>

    </div>
  )
}

export default ApplicationCard