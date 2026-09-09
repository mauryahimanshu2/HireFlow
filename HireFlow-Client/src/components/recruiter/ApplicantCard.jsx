import ApplicationStatus from '../jobseeker/ApplicationStatus'

function ApplicantCard({ application, onStatusUpdate }) {
  const hasResume = Boolean(application.jobSeekerResumeUrl)
  const skillsList = application.jobSeekerSkills
    ? application.jobSeekerSkills.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
      
      {/* Top Header: Candidate Avatar + Basic Info + Status */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        
        <div className="flex items-center gap-4">
          {/* Candidate Profile Photo */}
          {application.jobSeekerProfileImageUrl ? (
            <img
              src={application.jobSeekerProfileImageUrl}
              alt={application.jobSeekerName}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-100 shadow-sm"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-600 font-bold">
              {application.jobSeekerName ? application.jobSeekerName.charAt(0).toUpperCase() : '👤'}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {application.jobSeekerName}
            </h2>

            <p className="text-sm text-gray-600">
              Applied for <span className="font-semibold text-blue-600">{application.jobTitle}</span>
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Applied on {new Date(application.appliedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div>
          <ApplicationStatus status={application.status} />
        </div>

      </div>

      {/* Candidate Contact & Professional Overview */}
      <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">

        {/* Contact Info */}
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Contact</p>
          
          <div className="mt-2 space-y-1.5 text-gray-700">
            {application.jobSeekerEmail && (
              <p className="flex items-center gap-2 text-sm">
                <span>📧</span>
                <a href={`mailto:${application.jobSeekerEmail}`} className="text-blue-600 hover:underline truncate">
                  {application.jobSeekerEmail}
                </a>
              </p>
            )}

            {application.jobSeekerPhone ? (
              <p className="flex items-center gap-2 text-sm">
                <span>📞</span>
                <span>{application.jobSeekerPhone}</span>
              </p>
            ) : (
              <p className="text-xs text-gray-400">Phone not provided</p>
            )}

            {application.jobSeekerLocation && (
              <p className="flex items-center gap-2 text-sm">
                <span>📍</span>
                <span>{application.jobSeekerLocation}</span>
              </p>
            )}
          </div>
        </div>

        {/* Experience & Education */}
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Experience & Education</p>
          
          <div className="mt-2 space-y-1.5">
            <div>
              <span className="text-xs font-medium text-gray-500">Experience: </span>
              <span className="text-sm font-medium text-gray-800">
                {application.jobSeekerExperience || 'Not specified'}
              </span>
            </div>

            <div>
              <span className="text-xs font-medium text-gray-500">Education: </span>
              <span className="text-sm font-medium text-gray-800">
                {application.jobSeekerEducation || 'Not specified'}
              </span>
            </div>
          </div>
        </div>

        {/* Resume & Actions */}
        <div className="rounded-xl bg-gray-50 p-4 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Resume / CV</p>

            <div className="mt-2">
              {hasResume ? (
                <a
                  href={application.jobSeekerResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 shadow-sm"
                >
                  <span>📄</span>
                  <span>View Candidate Resume</span>
                </a>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600">
                  <span>🚫</span>
                  <span>No Resume Uploaded</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t flex justify-end">
            <button
              type="button"
              onClick={() => onStatusUpdate(application)}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-sm"
            >
              Update Status & Remarks
            </button>
          </div>
        </div>

      </div>

      {/* Skills Badges */}
      {skillsList.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Skills</p>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recruiter Remarks */}
      {application.recruiterRemarks && (
        <div className="mt-4 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Recruiter Remarks
          </p>
          <p className="mt-1 text-sm text-amber-900 font-medium">
            "{application.recruiterRemarks}"
          </p>
        </div>
      )}

    </div>
  )
}

export default ApplicantCard