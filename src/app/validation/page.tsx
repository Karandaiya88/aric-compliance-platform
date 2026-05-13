"use client";
import { VALIDATION_EVENTS } from "@/data/mockData";
import { cn } from "@/lib/utils";

const METHODS = [
  { icon: "📄", title: "Document Verification", desc: "Checks evidence uploads for correct type, hash integrity, signatory authority, and deadline compliance" },
  { icon: "💻", title: "System Integration Check", desc: "Queries internal APIs to verify software deployments, model versions in production, and config changes" },
  { icon: "📊", title: "Quantitative Validation", desc: "Calculates whether reported numbers satisfy regulatory thresholds using submitted data and ledger records" },
  { icon: "🏛️", title: "Regulatory Portal Cross-check", desc: "Confirms submissions visible in Fed, EBA, or FinCEN portals and matches submission IDs to MAP records" },
];

export default function ValidationPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Autonomous Validation Engine</h1>
        <button className="btn-primary text-sm px-3 py-1.5">🤖 Run Validation Sweep</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Auto-Validated", value: "31", sub: "65% of total MAPs", color: "#10b981" },
          { label: "Needs Human Review", value: "11", sub: "23% of total MAPs", color: "#f59e0b" },
          { label: "Validation Failed", value: "6", sub: "12% of total MAPs", color: "#ef4444" },
        ].map(s => (
          <div key={s.label} className="card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: s.color }} />
            <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-2">{s.label}</div>
            <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-white/30">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Timeline */}
        <div>
          <h2 className="text-sm font-bold mb-4">Recent Validation Activity</h2>
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-white/[0.07]" />
            <div className="flex flex-col gap-4">
              {VALIDATION_EVENTS.map(ev => (
                <div key={ev.id} className="relative">
                  <div className={cn("absolute -left-4 top-1.5 w-3 h-3 rounded-full border-2",
                    ev.status === "success" ? "border-emerald-400 bg-emerald-500/20" :
                    ev.status === "failed" ? "border-red-400 bg-red-500/20" : "border-yellow-400 bg-yellow-500/20")} />
                  <div className="bg-[#181c22] border border-white/[0.07] rounded-lg p-3">
                    <div className="text-xs font-semibold mb-1">{ev.mapId} — {ev.mapTitle}</div>
                    <div className="text-[11px] text-white/40 font-mono leading-relaxed">{ev.detail}</div>
                    <div className="text-[10px] text-white/20 font-mono mt-2">{ev.timestamp} · {ev.agentName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Methods */}
        <div>
          <h2 className="text-sm font-bold mb-4">Validation Methods</h2>
          <div className="flex flex-col gap-3">
            {METHODS.map(m => (
              <div key={m.title} className="card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">{m.icon}</span>
                  <span className="text-xs font-bold">{m.title}</span>
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
