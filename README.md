<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=00d4aa&height=200&section=header&text=ARIC&fontSize=80&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Agentic%20Regulatory%20Intelligence%20%26%20Compliance&descAlignY=60&descAlign=50" width="100%"/>

<br/>

[![Next.js](https://img.shields.io/badge/Next.js%2014-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python%203.10-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)
[![Groq](https://img.shields.io/badge/Groq-FF6B35?style=for-the-badge&logo=meta&logoColor=white)](https://groq.com/)

<br/>

[![GitHub stars](https://img.shields.io/github/stars/Karandaiya88/aric-compliance-platform?style=social)](https://github.com/Karandaiya88/aric-compliance-platform/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Karandaiya88/aric-compliance-platform?style=social)](https://github.com/Karandaiya88/aric-compliance-platform/network/members)
[![GitHub issues](https://img.shields.io/github/issues/Karandaiya88/aric-compliance-platform)](https://github.com/Karandaiya88/aric-compliance-platform/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built in 7 Days](https://img.shields.io/badge/Built%20in-7%20Days-00d4aa?style=flat-square)](https://github.com/Karandaiya88/aric-compliance-platform)

<br/>

> **AI-powered system that monitors regulatory changes, translates them into Measurable Action Points (MAPs), assigns them to the correct bank departments, and autonomously validates completion — with zero human intervention.**

<br/>

[🚀 Quick Start](#-quick-start) · [🤖 How It Works](#-how-it-works) · [📡 API Docs](#-api-reference) · [🐛 Report Bug](https://github.com/Karandaiya88/aric-compliance-platform/issues) · [⭐ Star this repo](https://github.com/Karandaiya88/aric-compliance-platform)

</div>

---

## 🎯 The Problem

> Banks worldwide lose **billions annually** to regulatory non-compliance.

Every year, compliance teams spend thousands of man-hours:

- 📄 **Manually reading** Basel, Fed, EBA, DORA, FinCEN circulars
- 📧 **Emailing departments** with action items and chasing for updates
- 📊 **Tracking completion** in Excel sheets
- ✅ **Physically verifying** whether compliance tasks were actually done

**ARIC eliminates all of this with 4 specialized AI agents.**

---

## 🤖 How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARIC AGENTIC PIPELINE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📡 Regulation Published (Basel / Fed / EBA / DORA / FinCEN)   │
│                          │                                      │
│                          ▼                                      │
│  🔍 MONITOR AGENT   →  Detects new regulations from 14+ feeds  │
│                          │                                      │
│                          ▼                                      │
│  🧠 PARSER AGENT    →  Reads regulation → Generates MAPs       │
│                          │        (Groq / Llama-3.3-70b)       │
│                          ▼                                      │
│  📋 ASSIGNER AGENT  →  Routes each MAP to correct department   │
│                          │  (Risk / Compliance / IT / Legal)   │
│                          ▼                                      │
│  ✅ VALIDATOR AGENT →  Autonomously verifies completion        │
│                          │                                      │
│                          ▼                                      │
│         📊 Compliance Score Updated — ZERO Human Intervention  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🔍 Monitor Agent
Watches **14+ regulatory feeds** in real-time — Basel Committee, Federal Reserve, EBA, FinCEN, DORA, SEC, OCC, FSOC. Automatically detects new regulations and triggers the pipeline.

</td>
<td width="50%">

### 🧠 Parser Agent
Reads regulation text and uses **Groq/Llama-3.3-70b** to extract compliance obligations and generate specific, measurable action points with deadlines and success metrics.

</td>
</tr>
<tr>
<td width="50%">

### 📋 Assigner Agent
Intelligently routes each MAP to the correct department — **Risk Management, Compliance, IT & Security, Legal, Treasury, or Operations** — based on the nature of the obligation.

</td>
<td width="50%">

### ✅ Validator Agent
Autonomously validates MAP completion through **document hash verification, system API checks, quantitative threshold validation, and regulatory portal cross-checks.** Auto-escalates breaches.

</td>
</tr>
<tr>
<td width="50%">

### 📊 Live Dashboard
Real-time compliance metrics, MAP status tracking, department workload distribution, compliance score trend charts, and one-click pipeline trigger.

</td>
<td width="50%">

### 🤖 AI Compliance Report
Generates **board-level executive compliance summaries** — covering posture assessment, key risks, overdue items, and recommended actions in seconds.

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<table>
<tr>
<th>Layer</th>
<th>Technology</th>
<th>Purpose</th>
</tr>
<tr>
<td><b>🖥️ Frontend</b></td>
<td>Next.js 14, TypeScript, Tailwind CSS, Recharts</td>
<td>Dark-themed dashboard UI with real-time data</td>
</tr>
<tr>
<td><b>⚙️ Backend</b></td>
<td>FastAPI, SQLAlchemy, Pydantic, Uvicorn</td>
<td>High-performance REST APIs with auto-docs</td>
</tr>
<tr>
<td><b>🤖 AI Agents</b></td>
<td>Groq API, Llama-3.3-70b</td>
<td>Ultra-fast LLM inference for all 4 agents</td>
</tr>
<tr>
<td><b>🗄️ Database</b></td>
<td>SQLite (dev) / PostgreSQL-ready</td>
<td>Regulations, MAPs, validation records</td>
</tr>
<tr>
<td><b>🐳 DevOps</b></td>
<td>Docker, Docker Compose</td>
<td>One-command deployment</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | [nodejs.org](https://nodejs.org) |
| Python | 3.10+ | [python.org](https://python.org) |
| Docker | Latest | [docker.com](https://docker.com) |
| Groq API Key | Free | [console.groq.com](https://console.groq.com) |

---

### 🐳 Option A — Docker (Recommended)

```bash
# 1. Clone the repo
git clone https://github.com/Karandaiya88/aric-compliance-platform.git
cd aric-compliance-platform

# 2. Add your Groq API key
# Create backend/.env file and add:
# GROQ_API_KEY=your_key_here
# DATABASE_URL=sqlite:///./aric.db

# 3. Run everything with one command
docker-compose up --build

# 4. Open in browser
# Frontend  →  http://localhost:3000
# Backend   →  http://localhost:8000
# API Docs  →  http://localhost:8000/docs
```

---

### 💻 Option B — Manual Setup

**Frontend:**
```bash
git clone https://github.com/Karandaiya88/aric-compliance-platform.git
cd aric-compliance-platform
npm install
npm run dev
# Opens at http://localhost:3000
```

**Backend:**
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Environment Variables:**
```bash
# backend/.env
DATABASE_URL=sqlite:///./aric.db
GROQ_API_KEY=your_groq_api_key_here
APP_ENV=development
APP_PORT=8000
```

**Seed & Run:**
```bash
python seed.py              # Load sample compliance data
uvicorn main:app --reload   # Start API server
# Opens at http://localhost:8000/docs
```

---

## 📡 API Reference

### 🤖 AI Agents
```http
POST   /api/agents/pipeline/run       Run full 4-agent pipeline
POST   /api/agents/monitor            Trigger Monitor Agent
POST   /api/agents/parse/{id}         Parse regulation → Generate MAPs
POST   /api/agents/validate           Run autonomous validation sweep
GET    /api/agents/report             Generate AI compliance report
```

### 📋 Regulations
```http
GET    /api/regulations/              Get all regulations
POST   /api/regulations/              Add new regulation
PATCH  /api/regulations/{id}          Update status
GET    /api/regulations/stats/summary Summary statistics
```

### 📌 MAPs (Measurable Action Points)
```http
GET    /api/maps/                     Get all MAPs
POST   /api/maps/                     Create MAP
PATCH  /api/maps/{id}                 Update progress/status
POST   /api/maps/{id}/validate        Mark as validated
GET    /api/maps/stats/summary        Status breakdown
GET    /api/maps/stats/by-department  Department workload
```

### 🏢 Departments & Validation
```http
GET    /api/departments/              All departments + workloads
GET    /api/departments/{name}/maps   Department-specific MAPs
POST   /api/validation/sweep          Autonomous validation sweep
GET    /api/validation/events         Recent validation events
```

---

## 📁 Project Structure

```
aric-compliance-platform/
│
├── 📁 src/                           # Next.js Frontend
│   ├── 📁 app/
│   │   ├── 📄 dashboard/page.tsx     # Command Center
│   │   ├── 📄 regulations/page.tsx   # Regulatory Feed
│   │   ├── 📄 maps/page.tsx          # MAP Engine
│   │   ├── 📄 departments/page.tsx   # Department Workloads
│   │   ├── 📄 validation/page.tsx    # Validation Engine
│   │   └── 📄 audit/page.tsx         # Audit Log
│   ├── 📁 components/layout/         # Sidebar, Header
│   ├── 📁 lib/
│   │   ├── api.ts                    # API client functions
│   │   └── utils.ts                  # Helper utilities
│   └── 📁 types/index.ts             # TypeScript definitions
│
├── 📁 backend/                       # FastAPI Backend
│   ├── 📄 main.py                    # App entry point
│   ├── 📄 database.py                # DB connection
│   ├── 📄 seed.py                    # Sample data loader
│   ├── 📁 agents/                    # 🤖 AI Agent Logic
│   │   ├── monitor_agent.py          # Regulation detection
│   │   ├── parser_agent.py           # MAP generation (Groq)
│   │   ├── assigner_agent.py         # Department routing (Groq)
│   │   └── validator_agent.py        # Completion validation (Groq)
│   ├── 📁 routers/                   # API Route Handlers
│   │   ├── regulations.py
│   │   ├── maps.py
│   │   ├── departments.py
│   │   ├── validation.py
│   │   └── agents.py                 # Agent trigger endpoints
│   ├── 📁 models/                    # SQLAlchemy Models
│   └── 📁 schemas/                   # Pydantic Schemas
│
├── 🐳 Dockerfile.frontend
├── 🐳 Dockerfile.backend
├── 🐳 docker-compose.yml
└── 📄 README.md
```

---

## 🗓️ Built in 7 Days — #BuildInPublic

| Day | What Was Built | Status |
|-----|----------------|--------|
| **Day 1** | Next.js 14 frontend — 6 complete dashboard pages | ✅ Done |
| **Day 2** | FastAPI backend — 15+ REST APIs with SQLite | ✅ Done |
| **Day 3** | 4 AI Agents powered by Groq/Llama-3.3-70b | ✅ Done |
| **Day 4** | Frontend-Backend connected — Live dashboard data | ✅ Done |
| **Day 5** | Docker containerization — One-command deployment | ✅ Done |
| **Day 6** | All pages live — Real API data throughout | ✅ Done |
| **Day 7** | Demo video + Final polish | ✅ Done |

---

## 🌐 Regulatory Sources Covered

| Source | Area |
|--------|------|
| 🏛️ Basel Committee (BCBS) | Capital adequacy, operational risk |
| 🏦 Federal Reserve | Stress testing, BHC prudential standards |
| 🇪🇺 European Banking Authority (EBA) | DORA, ICT third-party risk |
| 💰 FinCEN | AML, transaction monitoring |
| 📊 SEC / CFTC | Securities & derivatives compliance |
| 🏢 OCC | National bank standards |
| 🌍 FSOC | Systemic risk oversight |

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

<div align="center">

**Karan Daiya**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/karan-d88/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Karandaiya88)

*Built with 🔥 in 7 days | #BuildInPublic*

**If this project helped you, please give it a ⭐ — it means a lot!**

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=00d4aa&height=100&section=footer" width="100%"/>

</div>