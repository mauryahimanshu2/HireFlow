function AdminJobCard({ job, onToggleStatus, actionLoading }) {
  const formatDate = (value) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value)) : '—'
  const formatSalary = () => {
    if (job.salaryMin == null && job.salaryMax == null) return 'Not specified'
    const formatAmount = (amount) => Number(amount).toLocaleString()
    return job.salaryMin != null && job.salaryMax != null ? `${formatAmount(job.salaryMin)} – ${formatAmount(job.salaryMax)}` : formatAmount(job.salaryMin ?? job.salaryMax)
  }
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-bold text-slate-900">{job.title}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${job.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>{job.isActive ? 'Active' : 'Inactive'}</span></div><p className="mt-1 text-sm font-medium text-slate-600">{job.companyName}</p></div><button type="button" disabled={actionLoading} onClick={() => onToggleStatus(job)} className={`w-fit rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${job.isActive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>{actionLoading ? 'Updating...' : job.isActive ? 'Deactivate' : 'Activate'}</button></div>
      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-sm sm:grid-cols-4"><div><dt className="font-medium text-slate-500">Job ID</dt><dd className="mt-1 font-semibold text-slate-900">#{job.id}</dd></div><div><dt className="font-medium text-slate-500">Location</dt><dd className="mt-1 font-semibold text-slate-900">{job.location || 'Not specified'}</dd></div><div><dt className="font-medium text-slate-500">Employment type</dt><dd className="mt-1 font-semibold text-slate-900">{job.employmentType || 'Not specified'}</dd></div><div><dt className="font-medium text-slate-500">Salary</dt><dd className="mt-1 font-semibold text-slate-900">{formatSalary()}</dd></div><div><dt className="font-medium text-slate-500">Recruiter</dt><dd className="mt-1 font-semibold text-slate-900">{job.recruiterName || 'Not specified'}</dd></div><div><dt className="font-medium text-slate-500">Created</dt><dd className="mt-1 font-semibold text-slate-900">{formatDate(job.createdAt)}</dd></div></dl>
    </article>
  )
}

export default AdminJobCard
