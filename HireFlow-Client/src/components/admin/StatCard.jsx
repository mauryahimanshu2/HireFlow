function StatCard({ label, value, accent = 'blue' }) {
  const accentStyles = {
    blue: 'border-blue-100 bg-blue-50 text-blue-700', emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700', violet: 'border-violet-100 bg-violet-50 text-violet-700', amber: 'border-amber-100 bg-amber-50 text-amber-700', rose: 'border-rose-100 bg-rose-50 text-rose-700', slate: 'border-slate-200 bg-slate-50 text-slate-700',
  }
  return (
    <article className={`rounded-2xl border p-5 shadow-sm ${accentStyles[accent]}`}>
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight">{Number(value ?? 0).toLocaleString()}</p>
    </article>
  )
}

export default StatCard
