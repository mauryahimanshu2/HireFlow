import { useState } from 'react'
import { APPLICATION_STATUS } from '../../utils/constants'

function ApplicationStatusForm({
  application,
  onSubmit,
  onCancel,
  loading,
}) {
  const [status, setStatus] = useState(
    application?.status || APPLICATION_STATUS.APPLIED,
  )

  const [remarks, setRemarks] = useState(
    application?.recruiterRemarks || '',
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    onSubmit({
      status,
      recruiterRemarks: remarks,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
    >

      <h2 className="text-xl font-bold text-gray-900">
        Update Application
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Applicant: {application?.jobSeekerName}
      </p>

      <div className="mt-6">

        <label
          htmlFor="status"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Application Status
        </label>

        <select
          id="status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value={APPLICATION_STATUS.APPLIED}>
            Applied
          </option>

          <option value={APPLICATION_STATUS.UNDER_REVIEW}>
            Under Review
          </option>

          <option value={APPLICATION_STATUS.SHORTLISTED}>
            Shortlisted
          </option>

          <option value={APPLICATION_STATUS.INTERVIEW}>
            Interview
          </option>

          <option value={APPLICATION_STATUS.SELECTED}>
            Selected
          </option>

          <option value={APPLICATION_STATUS.REJECTED}>
            Rejected
          </option>

          <option value={APPLICATION_STATUS.WITHDRAWN}>
            Withdrawn
          </option>
        </select>

      </div>

      <div className="mt-5">

        <label
          htmlFor="remarks"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Recruiter Remarks
        </label>

        <textarea
          id="remarks"
          value={remarks}
          onChange={(event) =>
            setRemarks(event.target.value)
          }
          rows={4}
          placeholder="Add remarks for the applicant..."
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

      </div>

      <div className="mt-6 flex gap-3">

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? 'Updating...'
            : 'Update Status'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

      </div>

    </form>
  )
}

export default ApplicationStatusForm