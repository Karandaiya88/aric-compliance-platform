"use client";
import { cn } from "@/lib/utils";

const AUDIT_LOGS = [
  { time: "2025-11-09 14:32", agent: "Monitor", action: "Regulation detected", detail: "BCBS-SEP-2025-044 fetched from Basel Committee feed", type: "info" },
  { time: "2025-11-09 14:33", agent: "Parser", action: "Obligations extracted", detail: "4 primary obligations identified in Basel IV document (82 pages)", type: "success" },
  { time: "2025-11-09 14:33", agent: "Assigner", action: "MAPs assigned", detail: "4 MAPs created and assigned to Risk Management, Compliance, IT & Security", type: "success" },
  { time: "2025-11-09 14:35", agent: "Validator", action: "Validation scheduled", detail: "Checkpoint validation scheduled for MAP-2025-0441 through 0444", type: "info" },
  { time: "2025-11-08 09:00", agent: "Validator", action: "MAP validated", detail: "MAP-2025-0455 auto-validated: ICT register v3.0 confirmed in EBA portal", type: "success" },
  { time: "2025-11-01 00:00", agent: "Validator", action: "Breach escalated", detail: "MAP-2025-0449 overdue — cyber shock stress test not submitted to Fed portal", type: "error" },
  { time: "2025-11-01 00:01", agent: "Assigner", action: "Auto-escalation", detail: "CRO and Board Risk Committee notified of MAP-2025-0449 breach", type: "warn" },
  { time: "2025-10-14 09:42", agent: "Validator", action: "MAP validated", detail: "MAP-2025-0441 auto-validated: SA-OR model v2.1 confirmed in production", type: "success" },
];

const AGENT_COLOR: Record<string, string> = {
  Monitor: "text-blue-400",
  Parser: "text-[#00d4aa]",
  Assigner: "text-purple-400",
  Validator: "text-yellow-400",
};

const TYPE_COLOR: Record<string, string> = {
  success: "text-emerald-400",
  info: "text-white/50",
  warn: "text-yellow-400",
  error: "text-red-400",
};

export default function AuditPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Audit Log</h1>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm px-3 py-1.5">📥 Export</button>
          <button className="btn-secondary text-sm px-3 py-1.5">🔍 Filter</button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-white/[0.07] flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono text-white/40">Live agent activity log</span>
        </div>
        <div className="font-mono text-xs">
          {AUDIT_LOGS.map((log, i) => (
            <div key={i} className="flex gap-4 px-5 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
              <span className="text-white/20 flex-shrink-0 w-36">{log.time}</span>
              <span className={cn("flex-shrink-0 w-20", AGENT_COLOR[log.agent])}>[{log.agent}]</span>
              <span className="text-white/60 flex-shrink-0 w-40">{log.action}</span>
              <span className={cn(TYPE_COLOR[log.type])}>{log.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
