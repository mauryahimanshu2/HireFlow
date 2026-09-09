import { Navigate, Route, Routes } from 'react-router-dom'
import { ROLES } from '../utils/constants'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import JobSeekerDashboard from '../pages/jobseeker/JobSeekerDashboard'
import JobSeekerProfile from '../pages/jobseeker/JobSeekerProfile'
 

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
      {/* Public Routes */}

      <Route path="/" element={<Home />} />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />
      <Route element={<PublicRoute />}>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Route>

      {/* Job Seeker Routes */}

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

      {/* Recruiter Routes */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[ROLES.RECRUITER]}
          />
        }
      >
        <Route
          path="/recruiter/dashboard"
          element={
            <Placeholder
              title="Recruiter Dashboard"
              role="Recruiter"
            />
          }
        />

        <Route
          path="/recruiter/profile"
          element={
            <Placeholder
              title="Recruiter Profile"
              role="Recruiter"
            />
          }
        />

        <Route
          path="/recruiter/company"
          element={
            <Placeholder
              title="Company Management"
              role="Recruiter"
            />
          }
        />

        <Route
          path="/recruiter/jobs"
          element={
            <Placeholder
              title="Manage Jobs"
              role="Recruiter"
            />
          }
        />

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

      {/* Admin Routes */}

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

      {/* Unknown Routes */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}

export default AppRoutes