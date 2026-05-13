"use client";
import { useState } from "react";
import { REGULATIONS } from "@/data/mockData";
import { cn, getSeverityColor, getDeadlineColor } from "@/lib/utils";
import { Regulation } from "@/types";

const FILTERS = ["All", "Critical", "High", "Medium", "Analyzed"];

export default function RegulationsPage() {
  const [selected, setSelected] = useState<Regulation | null>(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const filtered = REGULATIONS.filter(r => {
    if (filter === "All") return true;
    if (filter === "Critical") return r.severity === "critical";
    if (filter === "High") return r.severity === "high";
    if (filter === "Medium") return r.severity === "medium";
    return true;
  });

  async function analyzeReg(reg: Regulation) {
    setSelected(reg);
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Regulatory Intelligence Feed</h1>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm px-3 py-1.5">🔄 Fetch New</button>
          <button className="btn-primary text-sm px-3 py-1.5">🤖 Auto-Analyze All</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
              filter === f ? "bg-[#00d4aa]/10 text-[#00d4aa] border-[#00d4aa]/40" : "border-white/10 text-white/40 hover:text-white bg-white/[0.03]")}>
            {f}
          </button>
        ))}
      </div>

      {/* Regulation Cards */}
      <div className="flex flex-col gap-4">
        {filtered.map(reg => (
          <div key={reg.id} onClick={() => setSelected(reg)}
            className={cn("card card-hover p-5 cursor-pointer transition-all",
              selected?.id === reg.id && "border-[#00d4aa]/50 bg-[#00d4aa]/[0.02]")}>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="text-[11px] text-white/30 font-mono mb-1.5">{reg.refId} · {reg.source}</div>
                <div className="text-sm font-bold mb-2 leading-snug">{reg.title}</div>
                <div className="text-xs text-white/40 leading-relaxed mb-3">{reg.excerpt}</div>
                <div className="flex gap-2 flex-wrap">
                  <span className={cn("tag", getSeverityColor(reg.severity))}>{reg.severity.toUpperCase()}</span>
                  <span className="tag tag-source">{reg.source}</span>
                  {reg.departments.map(d => <span key={d} className="tag tag-dept">{d}</span>)}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 min-w-[80px]">
                <div className={cn("w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs font-bold font-mono",
                  reg.severity === "critical" ? "border-red-400 text-red-400 bg-red-500/10" : "border-yellow-400 text-yellow-400 bg-yellow-500/10")}>
                  {reg.score}
                </div>
                <button onClick={(e) => { e.stopPropagation(); analyzeReg(reg); }}
                  className="btn-secondary text-[11px] px-2 py-1">
                  Analyze
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.05]">
              <span className="text-[11px] text-white/30 font-mono">Published: {reg.publishedAt}</span>
              <span className={cn("text-[11px] font-mono", getDeadlineColor(reg.daysLeft))}>
                🕐 Deadline: {reg.deadline} · {reg.daysLeft} days
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="card p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black">Generated MAPs — {selected.refId}</h2>
            <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white text-lg">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: `${selected.id}-A`, action: "Implement revised capital calculation framework replacing internal model outputs", dept: "Risk Management", metric: "Model in prod + 3Q backtest", deadline: selected.deadline, progress: 65, status: "in-progress" },
              { id: `${selected.id}-B`, action: "Update regulatory reporting templates to reflect new standardised approach thresholds", dept: "Compliance", metric: "Reports filed + auditor sign-off", deadline: selected.deadline, progress: 22, status: "pending" },
              { id: `${selected.id}-C`, action: "Train all relevant staff on updated methodology with documented competency assessments", dept: "Operations", metric: "100% staff trained, 90% pass rate", deadline: selected.deadline, progress: 8, status: "pending" },
              { id: `${selected.id}-D`, action: "Update IT systems and data pipelines to support new calculation and reporting requirements", dept: "IT & Security", metric: "System deployed + UAT passed", deadline: selected.deadline, progress: 40, status: "in-progress" },
            ].map(m => (
              <div key={m.id} className="bg-[#181c22] border border-white/[0.07] rounded-lg p-4">
                <div className="text-[10px] text-white/30 font-mono mb-1">{m.id}</div>
                <div className="text-xs font-semibold mb-2 leading-relaxed">{m.action}</div>
                <div className="flex gap-2 mb-3">
                  <span className="tag tag-dept">{m.dept}</span>
                  <span className={cn("tag", m.status === "in-progress" ? "bg-blue-500/15 text-blue-400" : "bg-yellow-500/15 text-yellow-400")}>
                    {m.status}
                  </span>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-white/40 mb-1">
                    <span>{m.metric}</span><span>{m.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", m.status === "in-progress" ? "bg-blue-500" : "bg-yellow-500")}
                      style={{ width: `${m.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
