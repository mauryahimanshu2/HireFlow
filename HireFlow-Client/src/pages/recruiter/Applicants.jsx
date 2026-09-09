import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ApplicantCard from '../../components/recruiter/ApplicantCard'
import ApplicationStatusForm from '../../components/recruiter/ApplicationStatusForm'
import applicationService from '../../services/applicationService'
import jobService from '../../services/jobService'
import recruiterService from '../../services/recruiterService'
import companyService from '../../services/companyService'

function Applicants() {
  const [searchParams, setSearchParams] = useSearchParams()
  const jobIdFromQuery = searchParams.get('jobId')

  const [applicants, setApplicants] = useState([])
  const [myJobs, setMyJobs] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)

  const [hasProfile, setHasProfile] = useState(true)
  const [hasCompany, setHasCompany] = useState(true)

  const [selectedJobId, setSelectedJobId] = useState(jobIdFromQuery || '')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const getErrorMessage = (error, fallback) => {
    return (
      error.response?.data?.message ||
      error.response?.data?.title ||
      fallback
    )
  }

  // Load recruiter's setup status and jobs
  useEffect(() => {
    const initializeData = async () => {
      try {
        const profile = await recruiterService.getProfile()
        setHasProfile(Boolean(profile))

        if (profile?.companyId) {
          setHasCompany(true)
        } else {
          try {
            const company = await companyService.getCompanies()
            setHasCompany(Boolean(company))
          } catch {
            setHasCompany(false)
          }
        }
      } catch {
        setHasProfile(false)
        setHasCompany(false)
      }

      try {
        const jobs = await jobService.getMyJobs()
        setMyJobs(Array.isArray(jobs) ? jobs : [])
      } catch {
        setMyJobs([])
      }
    }

    initializeData()
  }, [])

  // Sync state if query string changes
  useEffect(() => {
    setSelectedJobId(jobIdFromQuery || '')
  }, [jobIdFromQuery])

  // Load applicants
  const loadApplicants = async () => {
    setLoading(true)
    setError('')

    try {
      let data
      if (selectedJobId) {
        data = await applicationService.getApplicants(selectedJobId)
      } else {
        data = await applicationService.getAllRecruiterApplicants()
      }

      setApplicants(Array.isArray(data) ? data : [])
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 400) {
        setApplicants([])
      } else {
        setError(
          getErrorMessage(
            err,
            'Unable to load applicants.',
          ),
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplicants()
  }, [selectedJobId])

  const handleJobFilterChange = (e) => {
    const newJobId = e.target.value
    setSelectedJobId(newJobId)

    if (newJobId) {
      setSearchParams({ jobId: newJobId })
    } else {
      setSearchParams({})
    }
  }

  const handleStatusUpdate = async ({ status, recruiterRemarks }) => {
    if (!selectedApplication) {
      return
    }

    setUpdating(true)
    setError('')
    setSuccessMessage('')

    try {
      await applicationService.updateApplicationStatus(
        selectedApplication.id,
        status,
        recruiterRemarks,
      )

      setSelectedApplication(null)
      setSuccessMessage('Application status updated successfully.')
      await loadApplicants()
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'Unable to update application status.',
        ),
      )
    } finally {
      setUpdating(false)
    }
  }

  // Filter applicants locally by status and search query
  const filteredApplicants = applicants.filter((app) => {
    if (selectedStatus !== 'ALL' && app.status !== selectedStatus) {
      return false
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      const nameMatch = app.jobSeekerName?.toLowerCase().includes(q)
      const emailMatch = app.jobSeekerEmail?.toLowerCase().includes(q)
      const titleMatch = app.jobTitle?.toLowerCase().includes(q)
      const skillsMatch = app.jobSeekerSkills?.toLowerCase().includes(q)

      return nameMatch || emailMatch || titleMatch || skillsMatch
    }

    return true
  })

  const isSetupComplete = hasProfile && hasCompany

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

          <div className="flex items-center gap-4">
            <Link
              to="/recruiter/jobs"
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Manage Jobs
            </Link>

            <Link
              to="/recruiter/dashboard"
              className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Applicants Management
          </h1>
          <p className="mt-2 text-gray-600">
            Review candidate applications, view resumes & profile photos, and update application status.
          </p>
        </div>

        {/* Setup Warning Banner */}
        {!isSetupComplete && !loading && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⚠️</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-900">
                  Profile & Company Setup Required
                </h3>
                <p className="mt-1 text-sm text-amber-800">
                  You must set up your Recruiter Profile and Company Profile before candidates can apply to your jobs.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {!hasProfile && (
                    <Link
                      to="/recruiter/profile"
                      className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                    >
                      1. Create Recruiter Profile
                    </Link>
                  )}

                  {!hasCompany && (
                    <Link
                      to="/recruiter/company"
                      className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                    >
                      {hasProfile ? '1. Create Company Profile' : '2. Create Company Profile'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 grid gap-4 md:grid-cols-3">
          
          {/* Job Filter */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Filter by Job
            </label>
            <select
              value={selectedJobId}
              onChange={handleJobFilterChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium"
            >
              <option value="">All Jobs ({applicants.length})</option>
              {myJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Filter by Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="UnderReview">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>

          {/* Search Bar */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Search Candidate
            </label>
            <input
              type="text"
              placeholder="Search by name, email or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium"
            />
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* Status Update Form Modal / Box */}
        {selectedApplication && (
          <div className="mb-8">
            <ApplicationStatusForm
              application={selectedApplication}
              onSubmit={handleStatusUpdate}
              onCancel={() => setSelectedApplication(null)}
              loading={updating}
            />
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <p className="text-gray-600 font-medium">Loading applicants...</p>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-gray-100">
            <div className="text-5xl">👥</div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No Applicants Found
            </h2>
            <p className="mt-2 text-gray-600">
              {searchQuery || selectedStatus !== 'ALL' || selectedJobId
                ? 'No applicants match your current filter criteria.'
                : 'No candidates have applied to your jobs yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplicants.map((application) => (
              <ApplicantCard
                key={application.id}
                application={application}
                onStatusUpdate={setSelectedApplication}
              />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}

export default Applicants