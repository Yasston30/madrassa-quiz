export default function StatPill({ label, value }) {
  return (
    <div className="flex-1 rounded-xl bg-madrassa-900/60 border border-madrassa-700/50 py-3 px-2 text-center">
      <p className="font-display text-xl font-bold text-gold-300">{value}</p>
      <p className="text-madrassa-300 text-[11px] uppercase tracking-wide mt-0.5">{label}</p>
    </div>
  )
}
