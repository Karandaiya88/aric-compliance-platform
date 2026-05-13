import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Severity, MAPStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSeverityColor(severity: Severity): string {
  const map = {
    critical: "text-red-400 bg-red-500/15",
    high: "text-yellow-400 bg-yellow-500/15",
    medium: "text-blue-400 bg-blue-500/15",
    low: "text-gray-400 bg-gray-500/15",
  };
  return map[severity];
}

export function getStatusColor(status: MAPStatus): string {
  const map = {
    validated: "text-emerald-400 bg-emerald-500/15",
    "in-progress": "text-blue-400 bg-blue-500/15",
    pending: "text-yellow-400 bg-yellow-500/15",
    failed: "text-red-400 bg-red-500/15",
    overdue: "text-red-500 bg-red-500/20",
  };
  return map[status] || "text-gray-400 bg-gray-500/15";
}

export function getStatusIcon(status: MAPStatus): string {
  const map = {
    validated: "✅",
    "in-progress": "🔄",
    pending: "⏳",
    failed: "❌",
    overdue: "🚨",
  };
  return map[status] || "⏳";
}

export function getProgressBarColor(status: MAPStatus): string {
  const map = {
    validated: "bg-emerald-500",
    "in-progress": "bg-blue-500",
    pending: "bg-yellow-500",
    failed: "bg-red-500",
    overdue: "bg-red-600",
  };
  return map[status] || "bg-yellow-500";
}

export function getDeadlineColor(daysLeft: number): string {
  if (daysLeft < 0) return "text-red-500";
  if (daysLeft < 90) return "text-red-400";
  if (daysLeft < 180) return "text-yellow-400";
  return "text-emerald-400";
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
