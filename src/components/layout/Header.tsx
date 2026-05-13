"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [agentsActive] = useState(4);

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-white/[0.07] bg-[#0a0c10]/95 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-white/60">
          Agentic Regulatory Intelligence & Compliance
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Agent Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs text-white/50 font-mono">{agentsActive}/4 agents active</span>
        </div>
        {/* Date */}
        <span className="text-xs text-white/30 font-mono">
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
        </span>
        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#0096ff] flex items-center justify-center text-xs font-bold text-black">
          CRO
        </div>
      </div>
    </header>
  );
}
