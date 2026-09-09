import { Navigate, Route, Routes } from 'react-router-dom'
import { ROLES } from '../utils/constants'

import Login from '../pages/Login'
import Register from '../pages/Register'

import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

// Job Seeker
import JobSeekerDashboard from '../pages/jobseeker/JobSeekerDashboard'
import JobSeekerProfile from '../pages/jobseeker/JobSeekerProfile'
import JobSeekerJobs from '../pages/jobseeker/Jobs'
import JobSeekerJobDetails from '../pages/jobseeker/JobDetails'

// Recruiter
import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard'
import RecruiterProfile from '../pages/recruiter/RecruiterProfile'
import Company from '../pages/recruiter/Company'
import RecruiterJobs from '../pages/recruiter/Jobs'
import RecruiterJobFormPage from '../pages/recruiter/JobFormPage'


function Home() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-5xl font-bold text-gray-900">
          HireFlow
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Job Portal Management System
        </p>

        <p className="mt-8 text-gray-500">
          Home page will be completed in the upcoming modules.
        </p>
      </div>
    </div>
  )
}


function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="text-6xl font-bold text-red-500">
          403
        </div>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Access Denied
        </h1>

        <p className="mt-3 text-gray-600">
          You don't have permission to access this page.
        </p>

        <a
          href="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}


function Placeholder({ title, role }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
          {role}
        </p>

        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          {title}
        </h1>

        <p className="mt-3 text-gray-600">
          This page will be implemented in the upcoming
          module.
        </p>
      </div>
    </div>
  )
}


function AppRoutes() {
  return (
    <Routes>

      {/* ==================== PUBLIC ROUTES ==================== */}

      <Route path="/" element={<Home />} />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      <Route element={<PublicRoute />}>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
      </Route>


      {/* ==================== JOB SEEKER ROUTES ==================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[ROLES.JOB_SEEKER]}
          />
        }
      >

        <Route
          path="/jobseeker/dashboard"
          element={<JobSeekerDashboard />}
        />

        <Route
          path="/jobseeker/profile"
          element={<JobSeekerProfile />}
        />

        {/* Module 6 - Job Search */}
        <Route
          path="/jobseeker/jobs"
          element={<JobSeekerJobs />}
        />

        {/* Module 6 - Job Details */}
        <Route
          path="/jobseeker/jobs/:jobId"
          element={<JobSeekerJobDetails />}
        />

        {/* Future Module - Applications */}
        <Route
          path="/jobseeker/applications"
          element={
            <Placeholder
              title="My Applications"
              role="Job Seeker"
            />
          }
        />

      </Route>


      {/* ==================== RECRUITER ROUTES ==================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[ROLES.RECRUITER]}
          />
        }
      >

        <Route
          path="/recruiter/dashboard"
          element={<RecruiterDashboard />}
        />

        <Route
          path="/recruiter/profile"
          element={<RecruiterProfile />}
        />

        <Route
          path="/recruiter/company"
          element={<Company />}
        />

        {/* Module 6 - Manage Jobs */}
        <Route
          path="/recruiter/jobs"
          element={<RecruiterJobs />}
        />

        {/* Module 6 - Create Job */}
        <Route
          path="/recruiter/jobs/create"
          element={<RecruiterJobFormPage />}
        />

        {/* Module 6 - Edit Job */}
        <Route
          path="/recruiter/jobs/edit/:jobId"
          element={<RecruiterJobFormPage />}
        />

        {/* Future Module - Applicants */}
        <Route
          path="/recruiter/applicants"
          element={
            <Placeholder
              title="Applicants"
              role="Recruiter"
            />
          }
        />

      </Route>


      {/* ==================== ADMIN ROUTES ==================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[ROLES.ADMIN]}
          />
        }
      >

        <Route
          path="/admin/dashboard"
          element={
            <Placeholder
              title="Admin Dashboard"
              role="Admin"
            />
          }
        />

        <Route
          path="/admin/users"
          element={
            <Placeholder
              title="User Management"
              role="Admin"
            />
          }
        />

        <Route
          path="/admin/jobs"
          element={
            <Placeholder
              title="Job Management"
              role="Admin"
            />
          }
        />

      </Route>


      {/* ==================== UNKNOWN ROUTES ==================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  )
}

export default AppRoutes