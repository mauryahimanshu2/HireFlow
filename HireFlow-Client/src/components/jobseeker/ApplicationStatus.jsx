import { APPLICATION_STATUS } from '../../utils/constants'

function ApplicationStatus({ status }) {
  const statusClasses = {
    [APPLICATION_STATUS.APPLIED]:
      'bg-blue-100 text-blue-700',

    [APPLICATION_STATUS.UNDER_REVIEW]:
      'bg-yellow-100 text-yellow-700',

    [APPLICATION_STATUS.SHORTLISTED]:
      'bg-purple-100 text-purple-700',

    [APPLICATION_STATUS.INTERVIEW]:
      'bg-indigo-100 text-indigo-700',

    [APPLICATION_STATUS.SELECTED]:
      'bg-green-100 text-green-700',

    [APPLICATION_STATUS.REJECTED]:
      'bg-red-100 text-red-700',

    [APPLICATION_STATUS.WITHDRAWN]:
      'bg-gray-100 text-gray-700',
  }

  const className =
    statusClasses[status] ||
    'bg-gray-100 text-gray-700'

  const displayStatus = status
    ? status.replace(/([a-z])([A-Z])/g, '$1 $2')
    : 'Unknown'

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {displayStatus}
    </span>
  )
}

export default ApplicationStatus