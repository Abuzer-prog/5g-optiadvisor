// networkData.js
// Simulates real-world 5G network metrics inspired by publicly available
// 5G benchmark datasets (Opensignal, GSMA, Ookla 5G Map reports).
// Values are in realistic ranges for a mid-tier urban 5G deployment.

/**
 * Returns a random number between min and max (inclusive).
 */ 
function rand(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

/**
 * Generates a single snapshot of 5G network metrics.
 */
function generateNetworkSnapshot() {
  const bandwidth = rand(50, 1200);      // Mbps  (5G range: 50–1200 Mbps)
  const latency   = rand(1, 60);         // ms    (5G range: 1–60 ms)
  const packetLoss = rand(0, 5);         // %     (acceptable < 1%)
  const congestion = rand(0, 100);       // %     (load on the cell)
  const connectedDevices = rand(50, 500); // devices per cell
  const signalStrength = rand(-120, -50); // dBm  (good > -80 dBm)
  const energyUsage = rand(100, 900);    // Watts per base station
  const throughput = rand(30, 950);      // Mbps actual throughput

  return {
    bandwidth,
    latency,
    packetLoss,
    congestion,
    connectedDevices,
    signalStrength,
    energyUsage,
    throughput,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generates the last N minutes of historical snapshots.
 */
function generateHistory(points = 12) {
  const history = [];
  const now = Date.now();
  for (let i = points - 1; i >= 0; i--) {
    const snap = generateNetworkSnapshot();
    snap.timestamp = new Date(now - i * 5 * 60 * 1000).toISOString(); // every 5 min
    history.push(snap);
  }
  return history;
}

/**
 * Detects problems in the current network snapshot.
 * Returns an array of problem objects { severity, message }.
 */
function detectProblems(snap) {
  const problems = [];

  if (snap.latency > 30) {
    problems.push({ severity: "high", message: `High latency detected: ${snap.latency} ms (threshold: 30 ms)` });
  }
  if (snap.packetLoss > 1) {
    problems.push({ severity: "high", message: `Elevated packet loss: ${snap.packetLoss}% (threshold: 1%)` });
  }
  if (snap.congestion > 75) {
    problems.push({ severity: "high", message: `Cell congestion critical: ${snap.congestion}% load` });
  } else if (snap.congestion > 50) {
    problems.push({ severity: "medium", message: `Moderate congestion: ${snap.congestion}% load` });
  }
  if (snap.bandwidth < 100) {
    problems.push({ severity: "medium", message: `Low bandwidth: ${snap.bandwidth} Mbps (expected > 100 Mbps)` });
  }
  if (snap.signalStrength < -90) {
    problems.push({ severity: "medium", message: `Weak signal strength: ${snap.signalStrength} dBm` });
  }
  if (snap.energyUsage > 700) {
    problems.push({ severity: "low", message: `High energy usage: ${snap.energyUsage} W — consider power scaling` });
  }
  if (snap.connectedDevices > 400) {
    problems.push({ severity: "low", message: `High device density: ${snap.connectedDevices} devices on cell` });
  }

  return problems;
}

/**
 * Calculates a 0–100 network health score based on key metrics.
 * Higher is better.
 */
function calculateHealthScore(snap) {
  let score = 100;

  // Latency penalty: -2 per ms above 10 ms, capped at -40
  score -= Math.min(40, Math.max(0, (snap.latency - 10) * 2));

  // Packet loss penalty: -15 per % above 0
  score -= Math.min(30, snap.packetLoss * 15);

  // Congestion penalty: -0.3 per % above 30
  score -= Math.min(20, Math.max(0, (snap.congestion - 30) * 0.3));

  // Bandwidth bonus: +5 if > 500 Mbps; penalty: -5 if < 100 Mbps
  if (snap.bandwidth > 500) score += 5;
  else if (snap.bandwidth < 100) score -= 5;

  // Signal penalty
  if (snap.signalStrength < -90) score -= 10;
  else if (snap.signalStrength < -80) score -= 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

module.exports = { generateNetworkSnapshot, generateHistory, detectProblems, calculateHealthScore };
