"use client";
import { useState, useEffect } from "react";
import { getRegulations, runPipeline } from "@/lib/api";
import { cn, getSeverityColor, getDeadlineColor } from "@/lib/utils";

const FILTERS = ["All", "Critical", "High", "Medium"];

export default function RegulationsPage() {
  const [regulations, setRegulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<any | null>(null);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  useEffect(() => {
    fetchRegs();
  }, []);

  async function fetchRegs() {
    setLoading(true);
    try {
      const data = await getRegulations();
      setRegulations(data);
    } catch (e) {
      showToast("❌ Backend connect nahi ho raha");
    }
    setLoading(false);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  async function handleFetchNew() {
    setPipelineRunning(true);
    showToast("🔍 Monitor Agent scanning regulatory feeds...");
    try {
      const result = await runPipeline();
      if (result.success) {
        showToast(`✅ New regulation detected: ${result.regulation?.ref_id}`);
        await fetchRegs();
      }
    } catch (e) {
      showToast("❌ Pipeline error");
    }
    setPipelineRunning(false);
  }

  async function handleAnalyze(reg: any) {
    setAnalyzing(reg.id);
    setSelected(reg);
    try {
      const res = await fetch(`http://localhost:8000/api/agents/parse/${reg.id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.maps_created) {
        showToast(`✅ ${data.maps_created.length} MAPs generated for ${reg.ref_id}`);
        await fetchRegs();
        // Refresh selected reg
        const updated = await getRegulations();
        const updatedReg = updated.find((r: any) => r.id === reg.id);
        if (updatedReg) setSelected(updatedReg);
      }
    } catch (e) {
      showToast("❌ Analysis failed");
    }
    setAnalyzing(null);
  }

  const filtered = regulations.filter((r) => {
    if (filter === "All") return true;
    return r.severity === filter.toLowerCase();
  });

  const counts = {
    All: regulations.length,
    Critical: regulations.filter((r) => r.severity === "critical").length,
    High: regulations.filter((r) => r.severity === "high").length,
    Medium: regulations.filter((r) => r.severity === "medium").length,
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
          <h1 className="text-xl font-black">Regulatory Intelligence Feed</h1>
          <p className="text-xs text-white/30 mt-1 font-mono">
            {regulations.length} regulations tracked · Live from API
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchRegs}
            className="btn-secondary text-sm px-3 py-1.5">
            🔄 Refresh
          </button>
          <button onClick={handleFetchNew} disabled={pipelineRunning}
            className="btn-secondary text-sm px-3 py-1.5 disabled:opacity-50">
            {pipelineRunning ? "⏳ Scanning..." : "🔍 Fetch New"}
          </button>
          <button onClick={handleFetchNew} disabled={pipelineRunning}
            className="btn-primary text-sm px-3 py-1.5 disabled:opacity-50">
            {pipelineRunning ? "⏳ Running..." : "🤖 Auto-Analyze All"}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: regulations.length, color: "text-white" },
          { label: "Critical", value: counts.Critical, color: "text-red-400" },
          { label: "High", value: counts.High, color: "text-yellow-400" },
          { label: "Medium", value: counts.Medium, color: "text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className={cn("text-2xl font-black", s.color)}>{s.value}</div>
            <div className="text-[11px] text-white/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
              filter === f
                ? "bg-[#00d4aa]/10 text-[#00d4aa] border-[#00d4aa]/40"
                : "border-white/10 text-white/40 hover:text-white bg-white/[0.03]")}>
            {f} ({counts[f as keyof typeof counts] ?? 0})
          </button>
        ))}
      </div>

      {/* Regulations List */}
      {loading ? (
        <div className="card p-12 text-center text-white/30">
          <div className="text-3xl mb-3">⏳</div>
          <div className="text-sm">Loading from API...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-white/30">
          <div className="text-3xl mb-3">📭</div>
          <div className="text-sm">No regulations found</div>
          <button onClick={handleFetchNew} className="btn-primary mt-4 text-sm px-4 py-2">
            🤖 Run Monitor Agent
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((reg) => (
            <div key={reg.id}
              onClick={() => setSelected(selected?.id === reg.id ? null : reg)}
              className={cn("card card-hover p-5 cursor-pointer transition-all",
                selected?.id === reg.id && "border-[#00d4aa]/50 bg-[#00d4aa]/[0.02]")}>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="text-[11px] text-white/30 font-mono mb-1.5">
                    {reg.ref_id} · {reg.source}
                  </div>
                  <div className="text-sm font-bold mb-2 leading-snug">{reg.title}</div>
                  <div className="text-xs text-white/40 leading-relaxed mb-3">{reg.excerpt}</div>
                  <div className="flex gap-2 flex-wrap">
                    <span className={cn("tag", getSeverityColor(reg.severity))}>
                      {reg.severity?.toUpperCase()}
                    </span>
                    <span className="tag tag-source">{reg.source}</span>
                    {reg.departments?.split(",").map((d: string) => (
                      <span key={d} className="tag tag-dept">{d.trim()}</span>
                    ))}
                    {reg.maps_generated > 0 && (
                      <span className="tag bg-emerald-500/15 text-emerald-400">
                        ✅ {reg.maps_generated} MAPs
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 min-w-[90px]">
                  <div className={cn("w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs font-bold font-mono",
                    reg.severity === "critical"
                      ? "border-red-400 text-red-400 bg-red-500/10"
                      : "border-yellow-400 text-yellow-400 bg-yellow-500/10")}>
                    {reg.score}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAnalyze(reg); }}
                    disabled={analyzing === reg.id}
                    className="btn-secondary text-[11px] px-2 py-1 disabled:opacity-50 w-full text-center">
                    {analyzing === reg.id ? "⏳..." : "🧠 Analyze"}
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.05]">
                <span className="text-[11px] text-white/30 font-mono">
                  Published: {reg.published_at}
                </span>
                <span className={cn("text-[11px] font-mono", getDeadlineColor(reg.days_left))}>
                  🕐 Deadline: {reg.deadline} · {reg.days_left} days
                </span>
              </div>

              {/* Status */}
              <div className="mt-2">
                <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded",
                  reg.status === "mapped" ? "bg-emerald-500/10 text-emerald-400" :
                  reg.status === "in-progress" ? "bg-blue-500/10 text-blue-400" :
                  reg.status === "new" ? "bg-yellow-500/10 text-yellow-400" :
                  "bg-white/5 text-white/30")}>
                  {reg.status?.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Panel */}
      {selected && (
        <div className="card p-6 border-[#00d4aa]/20 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-black">{selected.ref_id}</h2>
              <p className="text-xs text-white/30 mt-0.5">{selected.title}</p>
            </div>
            <button onClick={() => setSelected(null)}
              className="text-white/30 hover:text-white text-lg">✕</button>
          </div>

          {selected.maps_generated > 0 ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-sm text-emerald-400">
              ✅ {selected.maps_generated} MAPs already generated for this regulation.
              <a href="/maps" className="ml-2 underline text-[#00d4aa]">View MAPs →</a>
            </div>
          ) : (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-xs text-yellow-400 mb-3">
                ⚠️ No MAPs generated yet. Click Analyze to generate MAPs using AI.
              </p>
              <button onClick={() => handleAnalyze(selected)}
                disabled={analyzing === selected.id}
                className="btn-primary text-sm px-4 py-2 disabled:opacity-50">
                {analyzing === selected.id ? "⏳ Generating MAPs..." : "🧠 Generate MAPs with AI"}
              </button>
            </div>
          )}

          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div className="bg-[#181c22] rounded-lg p-3">
              <div className="text-white/30 mb-1">Severity Score</div>
              <div className="font-black text-xl" style={{
                color: selected.severity === "critical" ? "#ef4444" : "#f59e0b"
              }}>{selected.score}</div>
            </div>
            <div className="bg-[#181c22] rounded-lg p-3">
              <div className="text-white/30 mb-1">Days Left</div>
              <div className={cn("font-black text-xl", getDeadlineColor(selected.days_left))}>
                {selected.days_left}
              </div>
            </div>
            <div className="bg-[#181c22] rounded-lg p-3">
              <div className="text-white/30 mb-1">MAPs Generated</div>
              <div className="font-black text-xl text-emerald-400">{selected.maps_generated}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}