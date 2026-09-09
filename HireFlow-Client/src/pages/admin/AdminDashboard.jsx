import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminNavigation from '../../components/admin/AdminNavigation'
import StatCard from '../../components/admin/StatCard'
import { useAuth } from '../../context/AuthContext'
import adminService from '../../services/adminService'

function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  useEffect(() => { const loadStats = async () => { setLoading(true); setPageError(''); try { setStats(await adminService.getStats()) } catch (error) { setPageError(error.response?.data?.message || error.response?.data?.title || 'Unable to load dashboard statistics.') } finally { setLoading(false) } }; loadStats() }, [])
  const cards = [{ label: 'Total Users', value: stats?.totalUsers, accent: 'blue' }, { label: 'Job Seekers', value: stats?.totalJobSeekers, accent: 'violet' }, { label: 'Recruiters', value: stats?.totalRecruiters, accent: 'amber' }, { label: 'Total Jobs', value: stats?.totalJobs, accent: 'slate' }, { label: 'Active Jobs', value: stats?.activeJobs, accent: 'emerald' }, { label: 'Inactive Jobs', value: stats?.inactiveJobs, accent: 'rose' }, { label: 'Applications', value: stats?.totalApplications, accent: 'blue' }]
  return <div className="min-h-screen bg-slate-50"><AdminNavigation /><main className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-wider text-blue-600">Administration</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Welcome, {user?.name || 'Admin'}</h1><p className="mt-2 text-slate-600">Monitor HireFlow activity and manage the platform.</p></div><div className="flex flex-wrap gap-3"><Link to="/admin/users" className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50">Manage Users</Link><Link to="/admin/jobs" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">Manage Jobs</Link></div></div>{pageError && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">{pageError}</div>}{loading ? <div className="rounded-2xl bg-white p-10 text-center shadow-sm"><p className="text-slate-600">Loading dashboard statistics...</p></div> : !pageError && <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Platform statistics">{cards.map((card) => <StatCard key={card.label} {...card} />)}</section>}</main></div>
}

export default AdminDashboard
