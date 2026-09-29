// server/src/index.js  — Express entry point

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const networkRoutes = require("./routes/network");

const app = express();
const PORT = process.env.PORT || 5000;
 
// ── Middleware ────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────
app.use("/api/network", networkRoutes);

// ── Health check ──────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "5G OptiAdvisor server is running" });
});

// ── Start ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  5G OptiAdvisor server running on http://localhost:${PORT}`);
});
