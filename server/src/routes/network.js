// routes/network.js  — REST endpoints for network data & AI advice

const express = require("express");
const Groq = require("groq-sdk");
const {
  generateNetworkSnapshot,
  generateHistory,
  detectProblems,
  calculateHealthScore,
} = require("../networkData");

const router = express.Router();

// ──────────────────────────────────────────────
// GET /api/network/status
// Returns current snapshot + health score + problems
// ──────────────────────────────────────────────
router.get("/status", (req, res) => {
  const snapshot = generateNetworkSnapshot();
  const healthScore = calculateHealthScore(snapshot);
  const problems = detectProblems(snapshot);

  res.json({ snapshot, healthScore, problems });
});

// ──────────────────────────────────────────────
// GET /api/network/history
// Returns last 12 snapshots (1 hour of data at 5-min intervals)
// ──────────────────────────────────────────────
router.get("/history", (req, res) => {
  const history = generateHistory(12);
  res.json({ history });
});

// ──────────────────────────────────────────────
// POST /api/network/recommend
// Body: { snapshot, healthScore, problems }
// Calls Groq AI and returns optimization recommendations
// ──────────────────────────────────────────────
router.post("/recommend", async (req, res) => {
  const { snapshot, healthScore, problems } = req.body;

  if (!snapshot) {
    return res.status(400).json({ error: "snapshot is required" });
  }

  // Build a concise prompt the AI can easily understand
  const problemList =
    problems && problems.length > 0
      ? problems.map((p) => `- [${p.severity.toUpperCase()}] ${p.message}`).join("\n")
      : "- No critical problems detected.";

  const prompt = `
You are a 5G network optimization expert AI assistant.

Below are the current real-time metrics of a 5G base station:

NETWORK METRICS:
- Bandwidth:        ${snapshot.bandwidth} Mbps
- Throughput:       ${snapshot.throughput} Mbps
- Latency:          ${snapshot.latency} ms
- Packet Loss:      ${snapshot.packetLoss}%
- Congestion Level: ${snapshot.congestion}%
- Connected Devices:${snapshot.connectedDevices}
- Signal Strength:  ${snapshot.signalStrength} dBm
- Energy Usage:     ${snapshot.energyUsage} W
- Health Score:     ${healthScore}/100

DETECTED PROBLEMS:
${problemList}

Please provide:
1. A brief 1-sentence overall assessment of the network health.
2. Three specific, actionable optimization recommendations to fix the detected problems.
3. One energy-efficiency tip.

Keep the response clear, concise, and beginner-friendly (no heavy jargon).
`.trim();

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 600,
    });

    const recommendation = completion.choices[0]?.message?.content || "No recommendation generated.";
    res.json({ recommendation });
  } catch (err) {
    console.error("Groq API error:", err.message);
    res.status(500).json({ error: "Failed to get AI recommendation. Check your GROQ_API_KEY." });
  }
});

module.exports = router;
