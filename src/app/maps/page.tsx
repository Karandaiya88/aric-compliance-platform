"use client";
import { useState, useEffect } from "react";
import { getMAPs } from "@/lib/api";
import { cn, getProgressBarColor, getStatusColor } from "@/lib/utils";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
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
  const [maps, setMaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMaps();
  }, []);

  async function fetchMaps() {
    setLoading(true);
    try {
      const data = await getMAPs();
      setMaps(data);
    } catch (e) {
      showToast("❌ Backend connect nahi ho raha");
    }
    setLoading(false);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  async function handleValidate(mapId: string) {
    setUpdatingId(mapId);
    try {
      const res = await fetch(`http://localhost:8000/api/maps/${mapId}/validate`, {
        method: "POST",
      });
      const data = await res.json();
      showToast(`✅ MAP ${mapId} validated!`);
      await fetchMaps();
    } catch (e) {
      showToast("❌ Validation failed");
    }
    setUpdatingId(null);
  }

  async function handleUpdateProgress(mapId: string, progress: number) {
    setUpdatingId(mapId);
    try {
      await fetch(`http://localhost:8000/api/maps/${mapId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress, status: progress >= 100 ? "validated" : "in-progress" }),
      });
      await fetchMaps();
    } catch (e) {
      showToast("❌ Update failed");
    }
    setUpdatingId(null);
  }

  const filtered = filter === "all" ? maps : maps.filter((m) => m.status === filter);

  // Stats
  const stats = {
    total: maps.length,
    pending: maps.filter((m) => m.status === "pending").length,
    inProgress: maps.filter((m) => m.status === "in-progress").length,
    validated: maps.filter((m) => m.status === "validated").length,
    failed: maps.filter((m) => m.status === "failed").length,
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#181c22] border border-white/10 rounded-xl px-5 py-3 text-sm shadow-2xl animate-slide-up">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">Measurable Action Points</h1>
          <p className="text-xs text-white/30 mt-1 font-mono">
            {maps.length} MAPs tracked · Live from API
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchMaps} className="btn-secondary text-sm px-3 py-1.5">
            🔄 Refresh
          </button>
          <button className="btn-secondary text-sm px-3 py-1.5">
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-white" },
          { label: "Pending", value: stats.pending, color: "text-yellow-400" },
          { label: "In Progress", value: stats.inProgress, color: "text-blue-400" },
          { label: "Validated", value: stats.validated, color: "text-emerald-400" },
          { label: "Failed", value: stats.failed, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className={cn("text-2xl font-black", s.color)}>{s.value}</div>
            <div className="text-[11px] text-white/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
              filter === f.value
                ? "bg-[#00d4aa]/10 text-[#00d4aa] border-[#00d4aa]/40"
                : "border-white/10 text-white/40 hover:text-white bg-white/[0.03]")}>
            {f.label}
          </button>
        ))}
      </div>

      {/* MAPs List */}
      {loading ? (
        <div className="card p-12 text-center text-white/30">
          <div className="text-3xl mb-3">⏳</div>
          <div className="text-sm">Loading MAPs from API...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-white/30">
          <div className="text-3xl mb-3">📭</div>
          <div className="text-sm">No MAPs found for this filter</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((map) => {
            const check = STATUS_CHECK[map.status] || STATUS_CHECK.pending;
            const isExpanded = expandedId === map.id;
            const isFailed = map.status === "failed";

            return (
              <div key={map.id}
                className={cn("card p-4 transition-all",
                  map.status === "validated" && "border-emerald-500/20 bg-emerald-500/[0.02]",
                  map.status === "in-progress" && "border-blue-500/20 bg-blue-500/[0.02]",
                  isFailed && "border-red-500/25 bg-red-500/[0.02]")}>
                <div className="flex items-start gap-4">
                  {/* Status icon */}
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5", check.bg)}>
                    {check.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-white/30 font-mono mb-1">
                      {map.id} · {map.regulation_ref}
                    </div>
                    <div className="text-sm font-semibold mb-2 leading-snug">{map.action}</div>
                    <div className="flex gap-2 flex-wrap items-center mb-3">
                      <span className="tag tag-dept">{map.department}</span>
                      {map.assignee && (
                        <span className="text-[11px] text-white/40">👤 {map.assignee}</span>
                      )}
                      <span className={cn("text-[11px] font-mono",
                        isFailed ? "text-red-400 font-semibold" : "text-white/30")}>
                        {isFailed ? "🚨 OVERDUE" : `Due: ${map.deadline}`}
                      </span>
                      <span className={cn("tag",
                        map.priority === "critical" ? "tag-critical" :
                        map.priority === "high" ? "tag-high" : "tag-medium")}>
                        {map.priority}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-white/40 mb-1">
                        <span className="truncate mr-2">{map.metric}</span>
                        <span className="font-mono flex-shrink-0">{map.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all duration-700",
                          getProgressBarColor(map.status))}
                          style={{ width: `${map.progress}%` }} />
                      </div>
                    </div>

                    {/* Evidence */}
                    {map.evidence && (
                      <div className="mt-2 text-[11px] text-white/30 font-mono truncate">
                        📎 {map.evidence}
                      </div>
                    )}

                    {/* Validated info */}
                    {map.validated_at && (
                      <div className="mt-2 text-[11px] text-emerald-400 font-mono">
                        ✅ Validated {map.validated_at} by {map.validated_by}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      {map.status !== "validated" && map.status !== "failed" && (
                        <>
                          <button
                            onClick={() => handleValidate(map.id)}
                            disabled={updatingId === map.id}
                            className="btn-primary text-[11px] px-3 py-1 disabled:opacity-50">
                            {updatingId === map.id ? "⏳..." : "✅ Mark Validated"}
                          </button>
                          {map.progress < 100 && (
                            <button
                              onClick={() => handleUpdateProgress(map.id, Math.min(map.progress + 25, 100))}
                              disabled={updatingId === map.id}
                              className="btn-secondary text-[11px] px-3 py-1 disabled:opacity-50">
                              +25% Progress
                            </button>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : map.id)}
                        className="btn-secondary text-[11px] px-3 py-1">
                        {isExpanded ? "▲ Less" : "▼ Details"}
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-white/[0.07] grid grid-cols-2 gap-3">
                        <div className="bg-[#181c22] rounded-lg p-3">
                          <div className="text-[10px] text-white/30 mb-1">Regulation</div>
                          <div className="text-xs font-mono text-[#00d4aa]">{map.regulation_ref}</div>
                        </div>
                        <div className="bg-[#181c22] rounded-lg p-3">
                          <div className="text-[10px] text-white/30 mb-1">Priority</div>
                          <div className="text-xs font-semibold capitalize">{map.priority}</div>
                        </div>
                        <div className="bg-[#181c22] rounded-lg p-3 col-span-2">
                          <div className="text-[10px] text-white/30 mb-1">Success Metric</div>
                          <div className="text-xs text-white/60">{map.metric}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}