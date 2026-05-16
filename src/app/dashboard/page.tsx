"use client";
import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import { getRegulations, getMAPs, getDepartments, runPipeline, runValidation, getComplianceReport } from "@/lib/api";
import { cn, getSeverityColor, getDeadlineColor } from "@/lib/utils";

const COMPLIANCE_TREND = [
  { month: "Jun", score: 78 },
  { month: "Jul", score: 81 },
  { month: "Aug", score: 83 },
  { month: "Sep", score: 86 },
  { month: "Oct", score: 90 },
  { month: "Nov", score: 94 },
];

const PIPELINE_STAGES = [
  { icon: "🔍", name: "Monitor Agent", desc: "Watches 14+ regulatory feeds", active: true },
  { icon: "🧠", name: "Parser Agent", desc: "Extracts obligations → MAPs", active: true },
  { icon: "📋", name: "Assigner Agent", desc: "Routes to departments", active: true },
  { icon: "✅", name: "Validator Agent", desc: "Verifies completion", active: false },
];

export default function DashboardPage() {
  const [regulations, setRegulations] = useState<any[]>([]);
  const [maps, setMaps] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [validating, setValidating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [pipelineLog, setPipelineLog] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const [regs, mapsData, depts] = await Promise.all([
        getRegulations(),
        getMAPs(),
        getDepartments(),
      ]);
      setRegulations(regs);
      setMaps(mapsData);
      setDepartments(depts);
    } catch (e) {
      showToast("❌ Backend connect nahi ho raha — check karo localhost:8000");
    }
    setLoading(false);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  async function handleRunPipeline() {
    setPipelineRunning(true);
    setPipelineLog(["🔍 Monitor Agent scanning regulatory feeds..."]);
    try {
      const result = await runPipeline();
      if (result.success) {
        setPipelineLog(result.log || []);
        showToast(`✅ Pipeline complete! ${result.maps_created} MAPs generated`);
        await fetchAll();
      } else {
        showToast("❌ Pipeline failed — check backend logs");
      }
    } catch (e) {
      showToast("❌ Backend error");
    }
    setPipelineRunning(false);
  }

  async function handleValidation() {
    setValidating(true);
    try {
      const result = await runValidation();
      showToast(`✅ Validation complete! ${result.auto_validated || 0} MAPs validated`);
      await fetchAll();
    } catch (e) {
      showToast("❌ Validation error");
    }
    setValidating(false);
  }

  async function handleReport() {
    setReportLoading(true);
    try {
      const result = await getComplianceReport();
      setReport(result.report);
    } catch (e) {
      showToast("❌ Report generation failed");
    }
    setReportLoading(false);
  }

  // Compute metrics from real data
  const criticalRegs = regulations.filter(r => r.severity === "critical").length;
  const pendingMAPs = maps.filter(m => m.status === "pending").length;
  const validatedMAPs = maps.filter(m => m.status === "validated").length;
  const totalMAPs = maps.length;
  const complianceScore = totalMAPs > 0 ? Math.round((validatedMAPs / totalMAPs) * 100) : 94;

  const METRICS = [
    { label: "Critical Alerts", value: criticalRegs || "3", color: "#ef4444", icon: "🚨" },
    { label: "Pending MAPs", value: pendingMAPs || "0", color: "#f59e0b", icon: "📋" },
    { label: "Validated MAPs", value: validatedMAPs || "0", color: "#10b981", icon: "✅" },
    { label: "Compliance Score", value: `${complianceScore}%`, color: "#00d4aa", icon: "🛡️" },
  ];

  // MAP status breakdown
  const mapStatus = [
    { label: "Validated", count: maps.filter(m => m.status === "validated").length, color: "#10b981" },
    { label: "In Progress", count: maps.filter(m => m.status === "in-progress").length, color: "#3b82f6" },
    { label: "Pending", count: maps.filter(m => m.status === "pending").length, color: "#f59e0b" },
    { label: "Failed", count: maps.filter(m => m.status === "failed").length, color: "#ef4444" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#181c22] border border-white/10 rounded-xl px-5 py-3 text-sm shadow-2xl animate-slide-up">
          {toast}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Command Center</h1>
        <div className="flex gap-2">
          <button onClick={handleReport} disabled={reportLoading}
            className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-50">
            {reportLoading ? "⏳ Generating..." : "📊 AI Report"}
          </button>
          <button onClick={handleValidation} disabled={validating}
            className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-50">
            {validating ? "⏳ Validating..." : "✅ Run Validation"}
          </button>
          <button onClick={handleRunPipeline} disabled={pipelineRunning}
            className="btn-primary text-sm px-3 py-1.5 disabled:opacity-50">
            {pipelineRunning ? "⏳ Running..." : "🤖 Run Pipeline"}
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        {METRICS.map((m) => (
          <div key={m.label} className="card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: m.color }} />
            <div className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">{m.label}</div>
            <div className="text-3xl font-black mb-2" style={{ color: m.color }}>
              {loading ? "..." : m.value}
            </div>
            <div className="absolute top-4 right-4 text-2xl opacity-10">{m.icon}</div>
          </div>
        ))}
      </div>

      {/* Pipeline + Log */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold">Agentic Pipeline</h2>
          <span className={cn("text-xs font-mono", pipelineRunning ? "text-[#00d4aa]" : "text-white/30")}>
            {pipelineRunning ? "🟢 Running..." : "⚪ Idle"}
          </span>
        </div>
        <div className="flex gap-0 mb-3">
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.name} className={cn("flex-1 border p-4 relative",
              i === 0 ? "rounded-l-xl" : "",
              i === PIPELINE_STAGES.length - 1 ? "rounded-r-xl border-l-0" : "border-r-0",
              pipelineRunning || stage.active
                ? "bg-[#00d4aa]/[0.03] border-[#00d4aa]/25"
                : "bg-[#111418] border-white/[0.07]")}>
              <div className="text-xl mb-2">{stage.icon}</div>
              <div className={cn("text-xs font-bold mb-1",
                pipelineRunning || stage.active ? "text-[#00d4aa]" : "text-white")}>
                {stage.name}
              </div>
              <div className="text-[11px] text-white/40">{stage.desc}</div>
              {i < PIPELINE_STAGES.length - 1 && (
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0a0c10] border border-white/[0.07] flex items-center justify-center text-[10px] text-white/30 z-10">›</div>
              )}
            </div>
          ))}
        </div>

        {/* Pipeline Log */}
        {pipelineLog.length > 0 && (
          <div className="bg-[#0a0c10] border border-white/[0.07] rounded-xl p-4 font-mono text-xs">
            {pipelineLog.map((line, i) => (
              <div key={i} className="text-[#00d4aa] mb-1">{line}</div>
            ))}
          </div>
        )}
      </div>

      {/* AI Report */}
      {report && (
        <div className="card p-5 border-[#00d4aa]/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#00d4aa]">🤖 AI Compliance Report</h3>
            <button onClick={() => setReport(null)} className="text-white/30 hover:text-white text-sm">✕</button>
          </div>
          <p className="text-xs text-white/60 leading-relaxed whitespace-pre-wrap">{report}</p>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-5 gap-4">
        <div className="card p-5 col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold">Compliance Score Trend</h3>
            <span className="text-xs text-white/30">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={COMPLIANCE_TREND}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[70, 100]} />
              <Tooltip contentStyle={{ background: "#181c22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e8edf5" }} />
              <Area type="monotone" dataKey="score" stroke="#00d4aa" strokeWidth={2} fill="url(#scoreGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* MAP Status */}
        <div className="card p-5 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold">MAP Status</h3>
            <span className="text-xs text-white/30 font-mono">{totalMAPs} total</span>
          </div>
          <div className="flex flex-col gap-3">
            {mapStatus.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">{s.label}</span>
                  <span className="font-mono font-semibold" style={{ color: s.color }}>{s.count}</span>
                </div>
                <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: totalMAPs > 0 ? `${Math.round(s.count / totalMAPs * 100)}%` : "0%", background: s.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.07]">
            <div className="text-[11px] text-white/40 mb-1">Compliance Rate</div>
            <div className="text-2xl font-black" style={{ color: "#00d4aa" }}>{complianceScore}%</div>
          </div>
        </div>
      </div>

      {/* Live Regulations from API */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold">
            Live Regulations
            <span className="ml-2 text-xs text-white/30 font-normal font-mono">from API</span>
          </h2>
          <button onClick={fetchAll} className="text-xs text-[#00d4aa] hover:underline">
            🔄 Refresh
          </button>
        </div>
        {loading ? (
          <div className="card p-8 text-center text-white/30 text-sm">Loading from API...</div>
        ) : (
          <div className="flex flex-col gap-3">
            {regulations.slice(0, 3).map((reg: any) => (
              <div key={reg.id} className="card card-hover p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="text-[11px] text-white/30 font-mono mb-1">{reg.ref_id} · {reg.source}</div>
                    <div className="text-sm font-semibold mb-2 leading-snug">{reg.title}</div>
                    <div className="flex gap-2 flex-wrap">
                      <span className={cn("tag", getSeverityColor(reg.severity))}>{reg.severity?.toUpperCase()}</span>
                      <span className="tag tag-source">{reg.source}</span>
                      {reg.departments?.split(",").slice(0, 2).map((d: string) => (
                        <span key={d} className="tag tag-dept">{d.trim()}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={cn("w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs font-bold font-mono",
                      reg.severity === "critical" ? "border-red-400 text-red-400 bg-red-500/10" : "border-yellow-400 text-yellow-400 bg-yellow-500/10")}>
                      {reg.score}
                    </div>
                    <div className={cn("text-[11px] font-mono", getDeadlineColor(reg.days_left))}>
                      {reg.days_left}d left
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}