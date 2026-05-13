"use client";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { REGULATIONS, MAPS, DEPARTMENTS, COMPLIANCE_TREND } from "@/data/mockData";
import { cn, getSeverityColor, getStatusColor, getDeadlineColor } from "@/lib/utils";

const METRICS = [
  { label: "Critical Alerts", value: "3", change: "+2 this week", changeType: "down", color: "#ef4444", icon: "🚨" },
  { label: "Pending MAPs", value: "18", change: "No change", changeType: "neutral", color: "#f59e0b", icon: "📋" },
  { label: "Validated This Month", value: "47", change: "+12 vs last", changeType: "up", color: "#10b981", icon: "✅" },
  { label: "Compliance Score", value: "94%", change: "+2.1% vs last", changeType: "up", color: "#00d4aa", icon: "🛡️" },
];

const PIPELINE = [
  { icon: "🔍", name: "Monitor Agent", desc: "Watching 14 regulatory feeds", activity: "Basel IV detected", active: true },
  { icon: "🧠", name: "Parser Agent", desc: "Extracts obligations → MAPs", activity: "7 MAPs generated", active: true },
  { icon: "📋", name: "Assigner Agent", desc: "Routes to departments", activity: "3 depts assigned", active: true },
  { icon: "✅", name: "Validator Agent", desc: "Verifies completion evidence", activity: "Awaiting evidence…", active: false },
];

export default function DashboardPage() {
  const [hoveredReg, setHoveredReg] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        {METRICS.map((m) => (
          <div key={m.label} className="card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: m.color }} />
            <div className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">{m.label}</div>
            <div className="text-3xl font-black mb-2" style={{ color: m.color }}>{m.value}</div>
            <div className={cn("text-xs flex items-center gap-1",
              m.changeType === "up" ? "text-emerald-400" : m.changeType === "down" ? "text-red-400" : "text-white/40")}>
              {m.changeType === "up" ? "↑" : m.changeType === "down" ? "↑" : "—"} {m.change}
            </div>
            <div className="absolute top-4 right-4 text-2xl opacity-10">{m.icon}</div>
          </div>
        ))}
      </div>

      {/* Agent Pipeline */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white">Agentic Pipeline</h2>
          <span className="text-xs text-white/30 font-mono">Last run: 4m ago</span>
        </div>
        <div className="flex gap-0">
          {PIPELINE.map((stage, i) => (
            <div key={stage.name} className={cn("flex-1 border p-4 relative",
              i === 0 ? "rounded-l-xl" : "",
              i === PIPELINE.length - 1 ? "rounded-r-xl border-l-0" : "border-r-0",
              stage.active ? "bg-[#00d4aa]/[0.03] border-[#00d4aa]/25" : "bg-[#111418] border-white/[0.07]")}>
              <div className="text-xl mb-2">{stage.icon}</div>
              <div className={cn("text-xs font-bold mb-1", stage.active ? "text-[#00d4aa]" : "text-white")}>{stage.name}</div>
              <div className="text-[11px] text-white/40 mb-3 leading-relaxed">{stage.desc}</div>
              <div className={cn("text-[10px] font-mono px-2 py-1 rounded",
                stage.active ? "text-[#00d4aa] bg-[#00d4aa]/10" : "text-white/30 bg-white/[0.04]")}>
                {stage.activity}
              </div>
              {i < PIPELINE.length - 1 && (
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0a0c10] border border-white/[0.07] flex items-center justify-center text-[10px] text-white/30 z-10">›</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Charts + Regulations */}
      <div className="grid grid-cols-5 gap-4">
        {/* Compliance Trend Chart */}
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

        {/* MAP Status Distribution */}
        <div className="card p-5 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold">MAP Status</h3>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: "Validated", count: 11, pct: 32, color: "#10b981" },
              { label: "In Progress", count: 9, pct: 26, color: "#3b82f6" },
              { label: "Pending", count: 12, pct: 35, color: "#f59e0b" },
              { label: "Failed", count: 2, pct: 7, color: "#ef4444" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">{s.label}</span>
                  <span className="font-mono font-semibold" style={{ color: s.color }}>{s.count}</span>
                </div>
                <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.07]">
            <div className="text-[11px] text-white/40 mb-1">Total MAPs</div>
            <div className="text-2xl font-black text-white">34</div>
          </div>
        </div>
      </div>

      {/* Recent Regulations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold">Recent Regulatory Activity</h2>
          <a href="/regulations" className="text-xs text-[#00d4aa] hover:underline">View all →</a>
        </div>
        <div className="flex flex-col gap-3">
          {REGULATIONS.map((reg) => (
            <div key={reg.id}
              className={cn("card card-hover p-4 cursor-pointer transition-all", hoveredReg === reg.id && "border-[#00d4aa]/40")}
              onMouseEnter={() => setHoveredReg(reg.id)}
              onMouseLeave={() => setHoveredReg(null)}>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="text-[11px] text-white/30 font-mono mb-1">{reg.refId} · {reg.source}</div>
                  <div className="text-sm font-semibold mb-2 leading-snug">{reg.title}</div>
                  <div className="flex gap-2 flex-wrap">
                    <span className={cn("tag", getSeverityColor(reg.severity))}>{reg.severity.toUpperCase()}</span>
                    <span className="tag tag-source">{reg.source}</span>
                    {reg.departments.slice(0, 2).map(d => <span key={d} className="tag tag-dept">{d}</span>)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={cn("w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs font-bold font-mono",
                    reg.severity === "critical" ? "border-red-400 text-red-400 bg-red-500/10" : "border-yellow-400 text-yellow-400 bg-yellow-500/10")}>
                    {reg.score}
                  </div>
                  <div className={cn("text-[11px] font-mono", getDeadlineColor(reg.daysLeft))}>
                    {reg.daysLeft}d left
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
