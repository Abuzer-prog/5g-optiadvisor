// MetricCard.jsx — shows a single KPI metric in a card

export default function MetricCard({ label, value, unit, color = "text-white", sub }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-4 flex flex-col gap-1 border border-slate-700">
      <p className="text-slate-400 text-xs uppercase tracking-widest">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>
        {value}
        <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>
      </p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  );
}
