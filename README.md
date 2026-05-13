# 🏦 ARIC — Agentic Regulatory Intelligence & Compliance Platform

> AI-powered system that monitors regulatory changes, translates them into Measurable Action Points (MAPs), assigns them to the correct bank departments, and autonomously validates completion.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
http://localhost:3000
```

## 📋 Features

- **🔍 Monitor Agent** — Watches 14+ regulatory feeds in real-time (Basel, Fed, EBA, FinCEN, DORA)
- **🧠 Parser Agent** — Extracts obligations from regulation PDFs and generates MAPs
- **📋 Assigner Agent** — Routes MAPs to the correct bank departments with smart load-balancing
- **✅ Validator Agent** — Autonomously verifies completion via document hash, system API, and portal cross-check

## 🗂️ Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/dashboard` | Overview metrics + pipeline status |
| Regulations | `/regulations` | Live feed of regulatory changes |
| MAPs Engine | `/maps` | All Measurable Action Points |
| Departments | `/departments` | Workload per department |
| Validation | `/validation` | Autonomous validation engine |
| Audit Log | `/audit` | Complete agent activity log |

## 🏗️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Charts:** Recharts
- **AI:** Claude API (Anthropic) — coming Day 3
- **Backend:** FastAPI (Python) — coming Day 3
- **Database:** PostgreSQL + Redis — coming Day 4

## 📅 7-Day Build Plan

- ✅ **Day 1** — Next.js frontend + all dashboard pages
- 🔄 **Day 2** — Backend FastAPI + database setup
- 📋 **Day 3** — AI agents (LangGraph + Claude API)
- 📋 **Day 4** — Regulation ingestion pipeline
- 📋 **Day 5** — Validation engine + evidence upload
- 📋 **Day 6** — Docker + deployment
- 📋 **Day 7** — Polish + demo data + final push

## 🔑 Environment Variables

```bash
cp .env.example .env.local
# Add your keys
ANTHROPIC_API_KEY=your_key_here
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```
