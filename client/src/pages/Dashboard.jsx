// Dashboard.jsx — main page; fetches data from backend and renders all panels

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import MetricCard from "../components/MetricCard";
import HealthScore from "../components/HealthScore";
import ProblemsPanel from "../components/ProblemsPanel";
import NetworkCharts from "../components/NetworkCharts";
import AIAdvisor from "../components/AIAdvisor";

export default function Dashboard() {
  const [status, setStatus]   = useState(null);   // { snapshot, healthScore, problems }
  const [history, setHistory] = useState([]);      // array of snapshots
  const [aiText, setAiText]   = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError]     = useState("");

  // ── Fetch current network status ──────────────
  const fetchStatus = useCallback(async () => {
    try {
      const res = await axios.get("/api/network/status");
      setStatus(res.data);
      setLastUpdated(new Date().toLocaleTimeString());
      setError("");
    } catch {
      setError("Could not reach backend. Make sure the server is running on port 5000.");
    }
  }, []);

  // ── Fetch history for charts ──────────────────
  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get("/api/network/history");
      setHistory(res.data.history);
    } catch {
      // silent — charts just won't show
    }
  }, []);

  // ── Ask Groq AI ────────────────────────────────
  const fetchAI = async () => {
    if (!status) return;
    setAiLoading(true);
    setAiText("");
    try {
      const res = await axios.post("/api/network/recommend", {
        snapshot: status.snapshot,
        healthScore: status.healthScore,
        problems: status.problems,
      });
      setAiText(res.data.recommendation);
    } catch (err) {
      setAiText("⚠️ " + (err.response?.data?.error || "Failed to get AI recommendation."));
    } finally {
      setAiLoading(false);
    }
  };

  // ── Auto-refresh every 30 seconds ─────────────
  useEffect(() => {
    fetchStatus();
    fetchHistory();
    const interval = setInterval(() => {
      fetchStatus();
      fetchHistory();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchStatus, fetchHistory]);

  const snap = status?.snapshot;
  const score = status?.healthScore ?? 0;
  const problems = status?.problems ?? [];

  // Helper: color based on value thresholds
  const latencyColor = snap?.latency > 30 ? "text-red-400" : snap?.latency > 15 ? "text-yellow-400" : "text-emerald-400";
  const congColor    = snap?.congestion > 75 ? "text-red-400" : snap?.congestion > 50 ? "text-yellow-400" : "text-emerald-400";
  const plColor      = snap?.packetLoss > 1 ? "text-red-400" : "text-emerald-400";
  const bwColor      = snap?.bandwidth < 100 ? "text-yellow-400" : "text-blue-400";

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* ── Header ─────────────────────────────── */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">📶 5G OptiAdvisor</h1>
          <p className="text-xs text-slate-400">AI-Based 5G Network Optimization Advisor</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-slate-500">Last updated: {lastUpdated}</span>
          )}
          <button
            onClick={() => { fetchStatus(); fetchHistory(); }}
            className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-xl transition"
          >
            🔄 Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Error banner */}
        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-300 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* ── Row 1: Health score + KPI cards ─── */}
        {snap ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-4">
            {/* Health score spans 2 cols on large screens */}
            <div className="col-span-2 sm:col-span-4 lg:col-span-2">
              <HealthScore score={score} />
            </div>

            {/* KPI cards */}
            <div className="col-span-2 sm:col-span-4 lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <MetricCard label="Bandwidth"  value={snap.bandwidth}       unit="Mbps"    color={bwColor} />
              <MetricCard label="Throughput" value={snap.throughput}      unit="Mbps"    color="text-purple-400" />
              <MetricCard label="Latency"    value={snap.latency}         unit="ms"      color={latencyColor} />
              <MetricCard label="Packet Loss" value={snap.packetLoss}    unit="%"       color={plColor} />
              <MetricCard label="Congestion" value={snap.congestion}     unit="%"       color={congColor} />
              <MetricCard label="Devices"    value={snap.connectedDevices} unit=""      color="text-sky-400"   sub="connected" />
              <MetricCard label="Signal"     value={snap.signalStrength}  unit="dBm"    color="text-indigo-400" />
              <MetricCard label="Energy"     value={snap.energyUsage}     unit="W"      color="text-emerald-400" sub="per base station" />
            </div>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-slate-500">
            {error ? null : "Loading network data…"}
          </div>
        )}

        {/* ── Row 2: Problems panel ───────────── */}
        <ProblemsPanel problems={problems} />

        {/* ── Row 3: Charts ───────────────────── */}
        <div>
          <h2 className="text-slate-300 font-semibold mb-3">📊 Historical Trends (last 60 min)</h2>
          <NetworkCharts history={history} />
        </div>

        {/* ── Row 4: AI Advisor ───────────────── */}
        <AIAdvisor
          recommendation={aiText}
          loading={aiLoading}
          onFetch={fetchAI}
        />

      </main>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="text-center text-slate-600 text-xs py-6 border-t border-slate-800">
        5G OptiAdvisor — AI-Based 5G Network Optimization Advisor &nbsp;|&nbsp; Powered by Groq AI + React
      </footer>
    </div>
  );
}
