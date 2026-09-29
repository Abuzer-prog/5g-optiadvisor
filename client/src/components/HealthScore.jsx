// HealthScore.jsx — circular-style health score badge

export default function HealthScore({ score }) {
  // Color thresholds
  const color =
    score >= 75 ? "text-emerald-400" :
    score >= 50 ? "text-yellow-400" :
    "text-red-400";

  const ring =
    score >= 75 ? "border-emerald-400" :
    score >= 50 ? "border-yellow-400" :
    "border-red-400";

  const label =
    score >= 75 ? "Good" :
    score >= 50 ? "Fair" :
    "Poor";

  return (
    <div className="bg-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-700">
      <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">Network Health</p>
      <div className={`w-28 h-28 rounded-full border-8 ${ring} flex items-center justify-center`}>
        <span className={`text-3xl font-extrabold ${color}`}>{score}</span>
      </div>
      <p className={`mt-3 text-sm font-semibold ${color}`}>{label}</p>
      <p className="text-slate-500 text-xs mt-1">out of 100</p>
    </div>
  );
}
