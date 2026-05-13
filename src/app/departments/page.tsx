"use client";
import { DEPARTMENTS, MAPS } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Department } from "@/types";

function getOnTrackColor(pct: number) {
  if (pct >= 90) return "text-emerald-400";
  if (pct >= 75) return "text-yellow-400";
  return "text-red-400";
}

export default function DepartmentsPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Department Workloads</h1>
        <button className="btn-primary text-sm px-3 py-1.5">🤖 Auto-Reassign</button>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
        {DEPARTMENTS.map(dept => (
          <div key={dept.name} className="card card-hover p-5 cursor-pointer">
            <div className="text-2xl mb-3">{dept.icon}</div>
            <div className="text-sm font-bold mb-1">{dept.name}</div>
            <div className="text-xs text-white/40 mb-4">Head: {dept.head} · {dept.members} members</div>
            <div className="flex gap-4">
              <div>
                <div className={cn("text-xl font-black", dept.overdueMAPs > 0 ? "text-yellow-400" : "text-white")}>
                  {dept.openMAPs}
                </div>
                <div className="text-[10px] text-white/30">Open MAPs</div>
              </div>
              <div>
                <div className={cn("text-xl font-black", getOnTrackColor(dept.onTrackPercent))}>
                  {dept.onTrackPercent}%
                </div>
                <div className="text-[10px] text-white/30">On track</div>
              </div>
              <div>
                <div className={cn("text-xl font-black", dept.overdueMAPs > 0 ? "text-red-400" : "text-white/30")}>
                  {dept.overdueMAPs}
                </div>
                <div className="text-[10px] text-white/30">Overdue</div>
              </div>
            </div>
            {/* Mini progress bar */}
            <div className="mt-4">
              <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", getOnTrackColor(dept.onTrackPercent).replace("text-", "bg-")
                  .replace("emerald-400", "emerald-500").replace("yellow-400", "yellow-500").replace("red-400", "red-500"))}
                  style={{ width: `${dept.onTrackPercent}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MAPs by Dept Table */}
      <div className="card p-5">
        <h2 className="text-sm font-bold mb-4">Active MAPs by Department</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {["MAP ID", "Action", "Department", "Assignee", "Progress", "Status", "Deadline"].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-white/30 font-semibold uppercase tracking-wide text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MAPS.map(map => (
                <tr key={map.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-mono text-white/40">{map.id}</td>
                  <td className="py-3 px-3 max-w-[240px]">
                    <span className="line-clamp-2 leading-relaxed">{map.action}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="tag tag-dept">{map.department}</span>
                  </td>
                  <td className="py-3 px-3 text-white/40">{map.assignee || "—"}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 bg-white/[0.05] rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full",
                          map.status === "validated" ? "bg-emerald-500" :
                          map.status === "in-progress" ? "bg-blue-500" :
                          map.status === "failed" ? "bg-red-500" : "bg-yellow-500")}
                          style={{ width: `${map.progress}%` }} />
                      </div>
                      <span className="font-mono text-white/40">{map.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={cn("tag",
                      map.status === "validated" ? "bg-emerald-500/15 text-emerald-400" :
                      map.status === "in-progress" ? "bg-blue-500/15 text-blue-400" :
                      map.status === "failed" ? "bg-red-500/15 text-red-400" : "bg-yellow-500/15 text-yellow-400")}>
                      {map.status}
                    </span>
                  </td>
                  <td className={cn("py-3 px-3 font-mono",
                    map.status === "failed" ? "text-red-400" : "text-white/30")}>
                    {map.deadline}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
