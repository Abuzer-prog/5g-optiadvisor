# 📶 5G OptiAdvisor

**AI-Based 5G Network Optimization Advisor**

A simple, beginner-friendly web dashboard that analyzes 5G network performance data, detects problems, calculates a health score, and uses Groq AI to generate optimization recommendations.

---

## 🗂️ Project Structure

```
5g-optiadvisor/
├── server/                  ← Node.js + Express backend
│   ├── src/
│   │   ├── index.js         ← Entry point
│   │   ├── networkData.js   ← Network data + health scoring logic
│   │   └── routes/
│   │       └── network.js   ← API routes (/status, /history, /recommend)
│   ├── .env                 ← YOUR GROQ_API_KEY goes here (create this)
│   ├── .env.example
│   └── package.json
│
├── client/                  ← React + Vite frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── pages/
│   │   │   └── Dashboard.jsx  ← Main dashboard page
│   │   └── components/
│   │       ├── MetricCard.jsx
│   │       ├── HealthScore.jsx
│   │       ├── ProblemsPanel.jsx
│   │       ├── NetworkCharts.jsx
│   │       └── AIAdvisor.jsx
│   └── package.json
│
└── package.json             ← Root (runs both together)
```

---

## ⚙️ Setup Instructions

### Step 1 — Get a free Groq API key

1. Go to https://console.groq.com
2. Sign up (free) → API Keys → Create Key
3. Copy the key

### Step 2 — Create the `.env` file

Inside the `server/` folder, create a file called `.env`:

```
GROQ_API_KEY=your_actual_groq_api_key_here
PORT=5000
```

> ⚠️ Never commit this file. It is already in `.gitignore`.

### Step 3 — Install dependencies

```bash
# From the project root (5g-optiadvisor/)
cd server && npm install
cd ../client && npm install
```

If you see an esbuild script warning, run:
```bash
cd client && npm install-scripts approve esbuild@0.21.5
```

### Step 4 — Run the app

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
→ Server starts at http://localhost:5000

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
→ App opens at http://localhost:3000

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 📡 Live Metrics | Bandwidth, Throughput, Latency, Packet Loss, Congestion, Devices, Signal, Energy |
| 🏥 Health Score | 0–100 score calculated from weighted KPIs |
| ⚠️ Problem Detection | Auto-detects high latency, congestion, packet loss, weak signal |
| 📊 Charts | Recharts line & bar charts for historical trends |
| 🤖 Groq AI | Click "Get AI Advice" for plain-English optimization tips |
| 🔄 Auto-refresh | Dashboard refreshes every 30 seconds |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/network/status` | Current snapshot + health score + problems |
| GET | `/api/network/history` | Last 12 snapshots (1 hour of data) |
| POST | `/api/network/recommend` | AI recommendations from Groq |

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Recharts, Axios
- **Backend:** Node.js, Express, Groq SDK, dotenv
