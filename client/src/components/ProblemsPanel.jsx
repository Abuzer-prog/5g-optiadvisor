// ProblemsPanel.jsx — lists detected network issues

const SEVERITY_STYLES = {
  high:   "bg-red-900/40 border-red-500 text-red-300",
  medium: "bg-yellow-900/40 border-yellow-500 text-yellow-300",
  low:    "bg-blue-900/40 border-blue-500 text-blue-300",
};

const SEVERITY_BADGE = {
  high:   "bg-red-500 text-white",
  medium: "bg-yellow-500 text-black",
  low:    "bg-blue-500 text-white",
};

export default function ProblemsPanel({ problems }) {
  if (!problems || problems.length === 0) {
    return (
      <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
        <h2 className="text-slate-300 font-semibold mb-3">⚠️ Detected Problems</h2>
        <p className="text-emerald-400 text-sm">✅ No problems detected — network looks healthy!</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
      <h2 className="text-slate-300 font-semibold mb-3">
        ⚠️ Detected Problems
        <span className="ml-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">{problems.length}</span>
      </h2>
      <ul className="flex flex-col gap-2">
        {problems.map((p, i) => (
          <li
            key={i}
            className={`flex items-start gap-3 border rounded-lg px-3 py-2 text-sm ${SEVERITY_STYLES[p.severity]}`}
          >
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize mt-0.5 shrink-0 ${SEVERITY_BADGE[p.severity]}`}>
              {p.severity}
            </span>
            <span>{p.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
