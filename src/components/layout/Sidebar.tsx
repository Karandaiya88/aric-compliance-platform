"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/regulations", label: "Regulations", icon: "🌐", badge: 3, badgeType: "danger" },
  { href: "/maps", label: "MAPs Engine", icon: "📋", badge: 18, badgeType: "warning" },
  { href: "/departments", label: "Departments", icon: "🏢" },
  { href: "/validation", label: "Validation", icon: "✅" },
  { href: "/audit", label: "Audit Log", icon: "📑" },
];

const SOURCES = [
  { label: "Basel Committee", badge: 1, badgeType: "warning" },
  { label: "Federal Reserve", badge: 2, badgeType: "danger" },
  { label: "FinCEN / AML", badge: 0, badgeType: "" },
  { label: "EBA / ECB", badge: 0, badgeType: "" },
  { label: "DORA / GDPR", badge: 0, badgeType: "" },
];

const BADGE_COLORS: Record<string, string> = {
  danger: "bg-red-500/20 text-red-400",
  warning: "bg-yellow-500/20 text-yellow-400",
  info: "bg-blue-500/20 text-blue-400",
  success: "bg-emerald-500/20 text-emerald-400",
};

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 min-w-[256px] border-r border-white/[0.07] flex flex-col overflow-y-auto bg-[#0a0c10]">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.07]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4aa] to-[#0096ff] flex items-center justify-center text-black font-bold text-sm">A</div>
        <div>
          <span className="font-bold text-sm text-white">ARIC </span>
          <span className="text-[#00d4aa] font-bold text-sm">Intelligence</span>
        </div>
      </div>
      <nav className="px-3 py-4 flex flex-col gap-0.5">
        <p className="text-[10px] font-semibold tracking-widest text-white/25 uppercase px-2 mb-2">Navigation</p>
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}
              className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                active ? "bg-[#00d4aa]/10 text-[#00d4aa]" : "text-white/50 hover:text-white hover:bg-white/[0.05]")}>
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono", BADGE_COLORS[item.badgeType || ""])}>{item.badge}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-2 flex flex-col gap-0.5">
        <p className="text-[10px] font-semibold tracking-widest text-white/25 uppercase px-2 mb-2">Regulatory Sources</p>
        {SOURCES.map((s) => (
          <button key={s.label} className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-white/40 hover:text-white hover:bg-white/[0.05] transition-all w-full text-left">
            <span className="flex-1">{s.label}</span>
            {s.badge > 0 && <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full font-mono", BADGE_COLORS[s.badgeType])}>{s.badge}</span>}
          </button>
        ))}
      </div>
      <div className="mt-auto px-4 py-4 border-t border-white/[0.07] m-3">
        <p className="text-[10px] font-semibold tracking-widest text-white/25 uppercase mb-3">Quick Stats</p>
        <div className="flex flex-col gap-2">
          {[
            { label: "Open MAPs", value: "34" },
            { label: "Overdue", value: "7", color: "text-red-400" },
            { label: "Validated", value: "89%", color: "text-emerald-400" },
            { label: "Avg Resolution", value: "14.2d" },
          ].map((stat) => (
            <div key={stat.label} className="flex justify-between text-xs">
              <span className="text-white/40">{stat.label}</span>
              <span className={cn("font-bold font-mono", stat.color || "text-white")}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
