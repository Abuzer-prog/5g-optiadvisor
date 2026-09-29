// AIAdvisor.jsx — Groq AI recommendations panel

export default function AIAdvisor({ recommendation, loading, onFetch }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-slate-300 font-semibold">🤖 AI Optimization Recommendations</h2>
        <button
          onClick={onFetch}
          disabled={loading}
          className="text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl font-medium transition"
        >
          {loading ? "Analyzing…" : "Get AI Advice"}
        </button>
      </div>

      {!recommendation && !loading && (
        <p className="text-slate-500 text-sm">
          Click <strong className="text-slate-300">Get AI Advice</strong> to ask Groq AI for optimization recommendations based on current network data.
        </p>
      )}

      {loading && (
        <div className="flex items-center gap-3 text-blue-400 text-sm">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Groq AI is analyzing network data…
        </div>
      )}

      {recommendation && !loading && (
        <div className="ai-scroll overflow-y-auto max-h-64 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-900 rounded-xl p-4 border border-slate-700">
          {recommendation}
        </div>
      )}
    </div>
  );
}
