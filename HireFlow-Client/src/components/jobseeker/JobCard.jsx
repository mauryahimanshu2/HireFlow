import { Link } from 'react-router-dom'

function JobCard({ job }) {
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
    <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      <div className="flex items-start justify-between gap-4">

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {job.title}
          </h2>

          <p className="mt-1 font-medium text-blue-600">
            {job.companyName ||
              'Company'}
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {job.employmentType ||
            'Job'}
        </span>

      </div>

      <div className="mt-5 space-y-2 text-sm text-gray-600">

        <p>
          📍{' '}
          {job.location ||
            'Location not specified'}
        </p>

        <p>
          💰 {formatSalary()}
        </p>

        <p>
          🎓{' '}
          {job.experienceRequired ||
            'Experience not specified'}
        </p>

      </div>

      {job.skills && (
        <p className="mt-4 line-clamp-2 text-sm text-gray-600">
          <span className="font-semibold">
            Skills:
          </span>{' '}
          {job.skills}
        </p>
      )}

      <div className="mt-6 border-t pt-5">

        <Link
          to={`/jobseeker/jobs/${job.id}`}
          className="block rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
        >
          View Details
        </Link>

      </div>

    </div>
  )
}

export default JobCard