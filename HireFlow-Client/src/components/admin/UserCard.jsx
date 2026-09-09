function UserCard({ user, onToggleStatus, actionLoading, isCurrentUser }) {
  const formatDate = (value) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value)) : '—'
  const roleStyles = { JobSeeker: 'bg-sky-100 text-sky-800', Recruiter: 'bg-violet-100 text-violet-800', Admin: 'bg-slate-200 text-slate-800' }
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-lg font-bold text-slate-900">{user.name}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${roleStyles[user.role] || roleStyles.Admin}`}>{user.role}</span></div><p className="mt-1 break-all text-sm text-slate-600">{user.email}</p></div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${user.isBlocked ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>{user.isBlocked ? 'Blocked' : 'Active'}</span>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-sm sm:grid-cols-3">
        <div><dt className="font-medium text-slate-500">User ID</dt><dd className="mt-1 font-semibold text-slate-900">#{user.id}</dd></div>
        <div><dt className="font-medium text-slate-500">Created</dt><dd className="mt-1 font-semibold text-slate-900">{formatDate(user.createdAt)}</dd></div>
        <div className="col-span-2 sm:col-span-1"><dt className="font-medium text-slate-500">Action</dt>{isCurrentUser ? <dd className="mt-1 text-sm font-medium text-slate-500">Your account</dd> : user.role === 'Admin' ? <dd className="mt-1 text-sm font-medium text-slate-500">Admin protected</dd> : <dd className="mt-2"><button type="button" disabled={actionLoading} onClick={() => onToggleStatus(user)} className={`rounded-lg px-3 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${user.isBlocked ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}>{actionLoading ? 'Updating...' : user.isBlocked ? 'Unblock User' : 'Block User'}</button></dd>}</div>
      </dl>
    </article>
  )
}

export default UserCard
