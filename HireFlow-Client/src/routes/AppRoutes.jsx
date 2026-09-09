import { Link, Navigate, Route, Routes } from 'react-router-dom'
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
import Applications from '../pages/jobseeker/Applications'
import ApplicationDetails from '../pages/jobseeker/ApplicationDetails'
import Applicants from '../pages/recruiter/Applicants'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsers from '../pages/admin/Users'
import AdminJobs from '../pages/admin/Jobs'


function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <header className="relative z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="text-2xl font-bold tracking-tight text-blue-600">HireFlow</Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Login</Link>
            <Link to="/register" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Get started</Link>
          </div>
        </div>
      </header>
      <main>
        <section className="relative isolate">
          <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-gradient-to-br from-blue-100 via-slate-50 to-violet-100" />
          <div className="absolute left-1/2 top-20 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-300/30 blur-3xl" />
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">Your next opportunity starts here</p>
              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">Find work you love. Build teams that thrive.</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">HireFlow makes it easy to discover the right career opportunity or connect with exceptional talent—all in one focused workspace.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link to="/register" className="rounded-xl bg-blue-600 px-6 py-3.5 text-center font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">Create your account</Link><Link to="/login" className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">Sign in to HireFlow</Link></div>
              <p className="mt-5 text-sm text-slate-500">Join as a Job Seeker or Recruiter.</p>
            </div>
            <div className="relative mx-auto w-full max-w-lg"><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-300/50 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-500">Career dashboard</p><p className="mt-1 text-2xl font-bold">Your future, in motion.</p></div><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl text-white">H</div></div><div className="mt-8 grid grid-cols-2 gap-4"><div className="rounded-2xl bg-blue-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-blue-700">Opportunities</p><p className="mt-2 text-3xl font-bold text-slate-900">1,240+</p><p className="mt-1 text-sm text-slate-600">open roles</p></div><div className="rounded-2xl bg-emerald-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Progress</p><p className="mt-2 text-3xl font-bold text-slate-900">24/7</p><p className="mt-1 text-sm text-slate-600">career support</p></div></div><div className="mt-4 rounded-2xl border border-slate-100 p-4"><div className="flex items-center justify-between"><div><p className="font-bold text-slate-900">Product Designer</p><p className="mt-1 text-sm text-slate-500">Remote · Full time</p></div><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">New</span></div></div><div className="mt-4 rounded-2xl border border-slate-100 p-4"><div className="flex items-center justify-between"><div><p className="font-bold text-slate-900">Software Engineer</p><p className="mt-1 text-sm text-slate-500">Bengaluru · Hybrid</p></div><span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">Featured</span></div></div></div></div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-wider text-blue-600">Built for momentum</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Everything you need to make the right move.</h2></div><div className="mt-8 grid gap-5 md:grid-cols-3"><article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">01</div><h3 className="mt-5 text-xl font-bold">Discover opportunities</h3><p className="mt-2 leading-6 text-slate-600">Search relevant roles and keep every application organized in one place.</p></article><article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 font-bold text-violet-700">02</div><h3 className="mt-5 text-xl font-bold">Hire with confidence</h3><p className="mt-2 leading-6 text-slate-600">Post openings, review qualified applicants, and manage your hiring flow.</p></article><article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-700">03</div><h3 className="mt-5 text-xl font-bold">Stay in control</h3><p className="mt-2 leading-6 text-slate-600">Track progress clearly from profile setup to your next successful match.</p></article></div></section>
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6"><div className="rounded-3xl bg-slate-900 px-6 py-12 text-center sm:px-12"><h2 className="text-3xl font-bold text-white">Ready to move your career forward?</h2><p className="mx-auto mt-3 max-w-xl text-slate-300">Create a HireFlow account and turn your next career decision into progress.</p><Link to="/register" className="mt-7 inline-block rounded-xl bg-blue-500 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-400">Create your free account</Link></div></section>
      </main>
      <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">© {new Date().getFullYear()} HireFlow. Connecting people with opportunity.</footer>
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
  element={<Applications />}
/>

<Route
  path="/jobseeker/applications/:applicationId"
  element={<ApplicationDetails />}
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
  element={<Applicants />}
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
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

        <Route
          path="/admin/jobs"
          element={<AdminJobs />}
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
