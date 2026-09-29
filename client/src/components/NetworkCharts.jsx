// NetworkCharts.jsx — Recharts line + bar charts for historical data

import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

// Format ISO timestamp to "HH:MM"
function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function NetworkCharts({ history }) {
  if (!history || history.length === 0) {
    return <p className="text-slate-500 text-sm">Loading chart data…</p>;
  }

  const data = history.map((h) => ({
    time: fmtTime(h.timestamp),
    Bandwidth: h.bandwidth,
    Latency: h.latency,
    Congestion: h.congestion,
    Throughput: h.throughput,
    Energy: h.energyUsage,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

      {/* Bandwidth & Throughput */}
      <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
        <h3 className="text-slate-300 text-sm font-semibold mb-3">📡 Bandwidth & Throughput (Mbps)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "#1e293b", border: "none", color: "#e2e8f0" }} />
            <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11 }} />
            <Line type="monotone" dataKey="Bandwidth" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Throughput" stroke="#a78bfa" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Latency */}
      <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
        <h3 className="text-slate-300 text-sm font-semibold mb-3">⏱️ Latency (ms)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "#1e293b", border: "none", color: "#e2e8f0" }} />
            <Line type="monotone" dataKey="Latency" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Congestion */}
      <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
        <h3 className="text-slate-300 text-sm font-semibold mb-3">🔴 Congestion Level (%)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "#1e293b", border: "none", color: "#e2e8f0" }} />
            <Bar dataKey="Congestion" fill="#ef4444" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Energy Usage */}
      <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
        <h3 className="text-slate-300 text-sm font-semibold mb-3">⚡ Energy Usage (W)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "#1e293b", border: "none", color: "#e2e8f0" }} />
            <Bar dataKey="Energy" fill="#10b981" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
