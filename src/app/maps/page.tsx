"use client";
import { useState } from "react";
import { MAPS } from "@/data/mockData";
import { cn, getStatusColor, getProgressBarColor } from "@/lib/utils";
import { MAP, MAPStatus } from "@/types";

const STATUS_FILTERS: { label: string; value: MAPStatus | "all" }[] = [
  { label: "All (34)", value: "all" },
  { label: "⏳ Pending", value: "pending" },
  { label: "🔄 In Progress", value: "in-progress" },
  { label: "✅ Validated", value: "validated" },
  { label: "❌ Failed", value: "failed" },
];

const STATUS_CHECK: Record<string, { bg: string; icon: string }> = {
  validated: { bg: "bg-emerald-500/20 text-emerald-400", icon: "✓" },
  "in-progress": { bg: "bg-blue-500/20 text-blue-400", icon: "↻" },
  pending: { bg: "bg-yellow-500/20 text-yellow-400", icon: "⏳" },
  failed: { bg: "bg-red-500/20 text-red-400", icon: "✕" },
  overdue: { bg: "bg-red-600/20 text-red-500", icon: "!" },
};

export default function MAPsPage() {
  const [filter, setFilter] = useState<MAPStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === "all" ? MAPS : MAPS.filter(m => m.status === filter);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Measurable Action Points</h1>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm px-3 py-1.5">📥 Export CSV</button>
          <button className="btn-primary text-sm px-3 py-1.5">✨ AI Generate MAP</button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Total", value: 34, color: "text-white" },
          { label: "Pending", value: 12, color: "text-yellow-400" },
          { label: "In Progress", value: 9, color: "text-blue-400" },
          { label: "Validated", value: 11, color: "text-emerald-400" },
          { label: "Failed / Overdue", value: 2, color: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <div className={cn("text-2xl font-black", s.color)}>{s.value}</div>
            <div className="text-[11px] text-white/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
              filter === f.value ? "bg-[#00d4aa]/10 text-[#00d4aa] border-[#00d4aa]/40" : "border-white/10 text-white/40 hover:text-white bg-white/[0.03]")}>
            {f.label}
          </button>
        ))}
      </div>

      {/* MAPs List */}
      <div className="flex flex-col gap-3">
        {filtered.map(map => {
          const check = STATUS_CHECK[map.status] || STATUS_CHECK.pending;
          const isExpanded = expandedId === map.id;
          const isFailed = map.status === "failed";
          return (
            <div key={map.id}
              onClick={() => setExpandedId(isExpanded ? null : map.id)}
              className={cn("card card-hover p-4 cursor-pointer transition-all",
                map.status === "validated" && "border-emerald-500/20 bg-emerald-500/[0.02]",
                map.status === "in-progress" && "border-blue-500/20 bg-blue-500/[0.02]",
                isFailed && "border-red-500/25 bg-red-500/[0.02]",
              )}>
              <div className="flex items-start gap-4">
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5", check.bg)}>
                  {check.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-white/30 font-mono mb-1">{map.id} · {map.regulationRef}</div>
                  <div className="text-sm font-semibold mb-2 leading-snug">{map.action}</div>
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className="tag tag-dept">{map.department}</span>
                    {map.assignee && <span className="text-[11px] text-white/40">👤 {map.assignee}</span>}
                    <span className={cn("text-[11px] font-mono", isFailed ? "text-red-400 font-semibold" : "text-white/30")}>
                      {isFailed ? "🚨 OVERDUE" : `Due: ${map.deadline}`}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-white/40 mb-1">
                      <span className="truncate mr-2">{map.metric}</span>
                      <span className="font-mono flex-shrink-0">{map.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-700", getProgressBarColor(map.status))}
                        style={{ width: `${map.progress}%` }} />
                    </div>
                  </div>

                  {map.evidence && (
                    <div className="mt-2 text-[11px] text-white/30 font-mono truncate">{map.evidence}</div>
                  )}

                  {isExpanded && map.validatedAt && (
                    <div className="mt-3 pt-3 border-t border-white/[0.07] text-[11px] text-emerald-400 font-mono">
                      ✅ Validated {map.validatedAt} by {map.validatedBy}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0 text-white/20 text-xs mt-1">{isExpanded ? "▲" : "▼"}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
