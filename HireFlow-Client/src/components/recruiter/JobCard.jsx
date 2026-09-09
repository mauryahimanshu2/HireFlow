function JobCard({
  job,
  onEdit,
  onToggleStatus,
  onDelete,
  actionLoading,
}) {
  const formatSalary = () => {
    if (
      job.salaryMin == null &&
      job.salaryMax == null
    ) {
      return 'Salary not specified'
    }

    if (
      job.salaryMin != null &&
      job.salaryMax != null
    ) {
      return `₹${Number(
        job.salaryMin,
      ).toLocaleString()} - ₹${Number(
        job.salaryMax,
      ).toLocaleString()}`
    }

    if (job.salaryMin != null) {
      return `From ₹${Number(
        job.salaryMin,
      ).toLocaleString()}`
    }

    return `Up to ₹${Number(
      job.salaryMax,
    ).toLocaleString()}`
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">

      <div className="flex flex-col justify-between gap-4 sm:flex-row">

        <div>
          <div className="flex items-center gap-3">

            <h3 className="text-xl font-bold text-gray-900">
              {job.title}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                job.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {job.isActive
                ? 'Active'
                : 'Inactive'}
            </span>

          </div>

          <p className="mt-2 text-sm text-gray-500">
            {job.location ||
              'Location not specified'}
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {job.employmentType ||
            'Employment type not specified'}
        </div>

      </div>

      <div className="mt-5 grid gap-3 text-sm text-gray-600 md:grid-cols-3">

        <div>
          <span className="font-semibold text-gray-800">
            Experience:
          </span>{' '}
          {job.experienceRequired ||
            'Not specified'}
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Salary:
          </span>{' '}
          {formatSalary()}
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Created:
          </span>{' '}
          {job.createdAt
            ? new Date(
                job.createdAt,
              ).toLocaleDateString()
            : '-'}
        </div>

      </div>

      {job.skills && (
        <div className="mt-4">
          <span className="font-semibold text-gray-800">
            Skills:
          </span>

          <p className="mt-1 text-sm text-gray-600">
            {job.skills}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3 border-t pt-5">

        <button
          type="button"
          onClick={() => onEdit(job)}
          disabled={actionLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() =>
            onToggleStatus(job)
          }
          disabled={actionLoading}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          {job.isActive
            ? 'Deactivate'
            : 'Activate'}
        </button>

        <button
          type="button"
          onClick={() => onDelete(job)}
          disabled={actionLoading}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
        >
          Delete
        </button>

      </div>
    </div>
  )
}

export default JobCard