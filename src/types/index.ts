// ─── Core Types ───────────────────────────────────────────────

export type Severity = "critical" | "high" | "medium" | "low";
export type MAPStatus = "pending" | "in-progress" | "validated" | "failed" | "overdue";
export type Department =
  | "Risk Management"
  | "Compliance"
  | "IT & Security"
  | "Legal"
  | "Treasury"
  | "Operations";

export interface Regulation {
  id: string;
  refId: string;
  source: string;
  title: string;
  excerpt: string;
  fullText?: string;
  severity: Severity;
  score: number;
  departments: Department[];
  publishedAt: string;
  deadline: string;
  daysLeft: number;
  mapsGenerated: number;
  status: "new" | "analyzing" | "mapped" | "in-progress" | "closed";
  tags?: string[];
}

export interface MAP {
  id: string;
  regulationId: string;
  regulationRef: string;
  action: string;
  description?: string;
  department: Department;
  assignee?: string;
  metric: string;
  deadline: string;
  status: MAPStatus;
  progress: number;
  evidence?: string;
  validatedAt?: string;
  validatedBy?: string;
  createdAt: string;
  priority: "critical" | "high" | "medium" | "low";
  comments?: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface DepartmentStats {
  name: Department;
  head: string;
  members: number;
  openMAPs: number;
  onTrackPercent: number;
  overdueMAPs: number;
  validatedMAPs: number;
  icon: string;
}

export interface ValidationEvent {
  id: string;
  mapId: string;
  mapTitle: string;
  status: "success" | "pending" | "failed";
  method: "document" | "system" | "quantitative" | "portal";
  detail: string;
  timestamp: string;
  agentName: string;
}

export interface AgentLog {
  time: string;
  agent: "Monitor" | "Parser" | "Assigner" | "Validator";
  message: string;
  type: "info" | "success" | "warn" | "error";
}

export interface MetricCard {
  label: string;
  value: string | number;
  change: string;
  changeType: "up" | "down" | "neutral";
  color: string;
  icon: string;
}
