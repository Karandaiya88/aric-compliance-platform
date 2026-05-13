import type {
  Regulation, MAP, DepartmentStats, Agent,
  AgentLog, ValidationResult, DashboardMetrics, Notification
} from '@/types'

// ─── Dashboard Metrics ────────────────────────────────────────────
export const dashboardMetrics: DashboardMetrics = {
  criticalAlerts: 3,
  pendingMAPs: 18,
  validatedThisMonth: 47,
  complianceScore: 94,
  overdueMAPs: 7,
  agentsActive: 4,
  regulationsMonitored: 14,
  avgResolutionDays: 14.2,
}

// ─── Regulations ──────────────────────────────────────────────────
export const regulations: Regulation[] = [
  {
    id: 'reg-001',
    refCode: 'BCBS-SEP-2025-044',
    source: 'Basel Committee',
    title: 'Basel IV Final Rule: Revised Capital Adequacy Requirements for Operational Risk',
    excerpt: 'Banks must implement the Standardised Approach for Operational Risk (SA-OR) by Q1 2026. Internal models approach is no longer permitted for capital calculation. Minimum capital floors apply at 72.5% of standardised outputs.',
    severity: 'critical',
    score: 9.2,
    departments: ['Risk Management', 'Finance', 'IT & Security'],
    publishedAt: '2025-09-18',
    deadline: '2026-03-31',
    daysLeft: 143,
    status: 'maps_generated',
    mapsCount: 6,
    tags: ['Capital', 'Basel IV', 'SA-OR', 'RWA'],
  },
  {
    id: 'reg-002',
    refCode: 'FED-SR-2025-6',
    source: 'Federal Reserve',
    title: 'Enhanced Prudential Standards: Stress Testing & Recovery Planning for Large BHCs',
    excerpt: 'Large bank holding companies with >$100B in assets must expand stress testing scenarios to include climate risk, cyber shocks, and geopolitical tail events. Annual submission to Fed required with remediation plans.',
    severity: 'high',
    score: 7.8,
    departments: ['Risk Management', 'Legal'],
    publishedAt: '2025-10-02',
    deadline: '2026-06-30',
    daysLeft: 233,
    status: 'maps_generated',
    mapsCount: 4,
    tags: ['Stress Testing', 'Climate Risk', 'BHC', 'Recovery Planning'],
  },
  {
    id: 'reg-003',
    refCode: 'DORA-2025-ITS-03',
    source: 'DORA',
    title: 'DORA ICT Third-Party Risk Management: Contractual Arrangements & Register Requirements',
    excerpt: 'All EU financial entities must maintain a complete register of ICT third-party service providers. Critical providers must be notified to regulators. Contractual arrangements must include exit clauses, SLAs, and audit rights.',
    severity: 'high',
    score: 7.1,
    departments: ['IT & Security', 'Legal', 'Operations'],
    publishedAt: '2025-10-11',
    deadline: '2027-01-17',
    daysLeft: 614,
    status: 'analyzed',
    mapsCount: 5,
    tags: ['DORA', 'ICT', 'Third-Party', 'EU'],
  },
  {
    id: 'reg-004',
    refCode: 'FINCEN-2025-AML-12',
    source: 'FinCEN',
    title: 'AML Transaction Monitoring: Enhanced ML Scoring Requirements',
    excerpt: 'Financial institutions must upgrade transaction monitoring systems to include ML-based behavioral scoring. False positive rate must be maintained below 8%. SAR filing timelines tightened to 25 days.',
    severity: 'high',
    score: 7.5,
    departments: ['Compliance', 'IT & Security', 'Operations'],
    publishedAt: '2025-10-25',
    deadline: '2026-04-30',
    daysLeft: 169,
    status: 'analyzing',
    tags: ['AML', 'SAR', 'ML', 'Transaction Monitoring'],
  },
]

// ─── MAPs ────────────────────────────────────────────────────────
export const maps: MAP[] = [
  {
    id: 'map-001',
    regulationId: 'reg-001',
    regulationRef: 'BCBS-SEP-2025-044',
    action: 'Implement SA-OR capital calculation model replacing all internal model outputs',
    department: 'Risk Management',
    owner: 'James T.',
    metric: 'SA-OR model v2.1 in prod + 3-quarter backtest report',
    evidence: 'SA-OR model v2.1 deployed 2025-10-14 | Backtested 3 quarters | CFO validated',
    deadline: '2026-03-31',
    daysLeft: 143,
    status: 'validated',
    progress: 100,
    priority: 'critical',
    createdAt: '2025-09-20',
    updatedAt: '2025-10-14',
    validatedAt: '2025-10-14',
    validatedBy: 'agent',
  },
  {
    id: 'map-002',
    regulationId: 'reg-001',
    regulationRef: 'BCBS-SEP-2025-044',
    action: 'Update capital floor calculation to enforce 72.5% minimum of standardised outputs across all portfolios',
    department: 'Risk Management',
    owner: 'Sarah K.',
    metric: 'Floor enforced in systems + CFO attestation letter',
    evidence: 'Capital floor logic in UAT · Go-live Nov 30',
    deadline: '2026-03-31',
    daysLeft: 143,
    status: 'in-progress',
    progress: 65,
    priority: 'critical',
    createdAt: '2025-09-20',
    updatedAt: '2025-11-08',
  },
  {
    id: 'map-003',
    regulationId: 'reg-001',
    regulationRef: 'BCBS-SEP-2025-044',
    action: 'Recalibrate RWA reporting to exclude disallowed internal model adjustments and restate Q3 2025 figures',
    department: 'Finance',
    owner: 'Michael R.',
    metric: 'Restated Q3 report filed + external auditor sign-off',
    evidence: 'Pending — owner assigned, scope being defined',
    deadline: '2026-02-15',
    daysLeft: 97,
    status: 'pending',
    progress: 22,
    priority: 'critical',
    createdAt: '2025-09-20',
    updatedAt: '2025-11-01',
  },
  {
    id: 'map-004',
    regulationId: 'reg-002',
    regulationRef: 'FED-SR-2025-6',
    action: 'Design and back-test climate risk stress scenario with 3°C warming trajectory and 30% asset value shock',
    department: 'Risk Management',
    owner: 'Priya M.',
    metric: 'Scenario model approved + 3-year back-test results',
    evidence: 'None submitted yet · Escalation triggered 2025-11-05',
    deadline: '2026-04-30',
    daysLeft: 169,
    status: 'pending',
    progress: 8,
    priority: 'high',
    createdAt: '2025-10-05',
    updatedAt: '2025-11-05',
  },
  {
    id: 'map-005',
    regulationId: 'reg-002',
    regulationRef: 'FED-SR-2025-6',
    action: 'Submit cyber shock stress test scenario to Federal Reserve by Oct 31, 2025 interim deadline',
    department: 'IT & Security',
    owner: 'David N.',
    metric: 'Fed portal submission ID confirmed',
    evidence: 'None · Breach reported to Board Risk Committee 2025-11-01',
    deadline: '2025-10-31',
    daysLeft: -11,
    status: 'failed',
    progress: 0,
    priority: 'critical',
    createdAt: '2025-10-05',
    updatedAt: '2025-11-01',
  },
  {
    id: 'map-006',
    regulationId: 'reg-003',
    regulationRef: 'DORA-2025-ITS-03',
    action: 'Compile complete ICT third-party register with contractual details, risk tier, and substitutability assessment',
    department: 'IT & Security',
    owner: 'Anita B.',
    metric: 'Register v3.0 with 100% providers logged + Legal sign-off',
    evidence: 'Register v3.0 uploaded 2025-11-02 | 247 providers | Legal approved',
    deadline: '2026-01-17',
    daysLeft: 68,
    status: 'validated',
    progress: 100,
    priority: 'high',
    createdAt: '2025-10-15',
    updatedAt: '2025-11-02',
    validatedAt: '2025-11-02',
    validatedBy: 'agent',
  },
]

// ─── Departments ──────────────────────────────────────────────────
export const departments: DepartmentStats[] = [
  { name: 'Risk Management', icon: '🛡️', head: 'James T.', members: 12, openMAPs: 9, onTrackPct: 82, overdueCount: 2, validatedCount: 14, complianceScore: 88 },
  { name: 'Compliance', icon: '⚖️', head: 'Maria L.', members: 8, openMAPs: 14, onTrackPct: 71, overdueCount: 4, validatedCount: 8, complianceScore: 76 },
  { name: 'IT & Security', icon: '💻', head: 'Priya N.', members: 20, openMAPs: 6, onTrackPct: 90, overdueCount: 1, validatedCount: 18, complianceScore: 93 },
  { name: 'Legal', icon: '📜', head: 'David C.', members: 6, openMAPs: 5, onTrackPct: 95, overdueCount: 0, validatedCount: 12, complianceScore: 97 },
  { name: 'Treasury', icon: '🏦', head: 'Chen W.', members: 9, openMAPs: 4, onTrackPct: 100, overdueCount: 0, validatedCount: 9, complianceScore: 99 },
  { name: 'Operations', icon: '⚙️', head: 'Anna B.', members: 15, openMAPs: 7, onTrackPct: 78, overdueCount: 0, validatedCount: 11, complianceScore: 85 },
]

// ─── Agents ───────────────────────────────────────────────────────
export const agents: Agent[] = [
  { id: 'agent-monitor', type: 'monitor', name: 'Monitor Agent', description: 'Watches 14 regulatory feeds 24/7 for new publications', status: 'active', lastRun: '4m ago', nextRun: 'continuous', tasksCompleted: 1842, icon: '🔍' },
  { id: 'agent-parser', type: 'parser', name: 'Parser Agent', description: 'Extracts obligations from regulation text and generates MAPs', status: 'active', lastRun: '4m ago', nextRun: 'on trigger', tasksCompleted: 312, icon: '🧠' },
  { id: 'agent-assigner', type: 'assigner', name: 'Assigner Agent', description: 'Routes MAPs to departments based on expertise matrix', status: 'active', lastRun: '6m ago', nextRun: 'on trigger', tasksCompleted: 289, icon: '📋' },
  { id: 'agent-validator', type: 'validator', name: 'Validator Agent', description: 'Autonomously verifies MAP completion evidence', status: 'idle', lastRun: '1h ago', nextRun: 'in 30m', tasksCompleted: 203, icon: '✅' },
  { id: 'agent-escalation', type: 'escalation', name: 'Escalation Agent', description: 'Auto-escalates overdue MAPs to department heads and CRO', status: 'idle', lastRun: '6h ago', nextRun: 'tomorrow', tasksCompleted: 47, icon: '🚨' },
  { id: 'agent-audit', type: 'audit', name: 'Audit Agent', description: 'Maintains immutable audit trail of all compliance actions', status: 'active', lastRun: 'continuous', nextRun: 'continuous', tasksCompleted: 9821, icon: '📔' },
]

// ─── Agent Logs ───────────────────────────────────────────────────
export const agentLogs: AgentLog[] = [
  { id: 'log-001', agentType: 'monitor', agentName: 'Monitor Agent', message: 'ARIC system initialized — monitoring 14 regulatory feeds', level: 'success', timestamp: '09:00:01' },
  { id: 'log-002', agentType: 'monitor', agentName: 'Monitor Agent', message: 'Basel IV update detected — BCBS-SEP-2025-044', level: 'info', timestamp: '09:00:14' },
  { id: 'log-003', agentType: 'parser', agentName: 'Parser Agent', message: 'Parsing full 82-page Basel IV document…', level: 'info', timestamp: '09:00:16' },
  { id: 'log-004', agentType: 'parser', agentName: 'Parser Agent', message: '4 primary obligations extracted', level: 'success', timestamp: '09:00:44' },
  { id: 'log-005', agentType: 'assigner', agentName: 'Assigner Agent', message: 'MAPs assigned to Risk, Finance, Compliance, IT', level: 'success', timestamp: '09:00:52' },
  { id: 'log-006', agentType: 'validator', agentName: 'Validator Agent', message: 'Validation checkpoints scheduled for 6 MAPs', level: 'success', timestamp: '09:01:10' },
  { id: 'log-007', agentType: 'escalation', agentName: 'Escalation Agent', message: 'MAP-005 overdue — escalating to CRO David N.', level: 'warning', timestamp: '09:01:45' },
  { id: 'log-008', agentType: 'audit', agentName: 'Audit Agent', message: 'All agent actions logged to immutable ledger', level: 'info', timestamp: '09:02:00' },
]

// ─── Validations ──────────────────────────────────────────────────
export const validations: ValidationResult[] = [
  { id: 'val-001', mapId: 'map-001', mapTitle: 'SA-OR model deployment', method: 'system', status: 'passed', detail: 'Code verified in prod, backtests passed, CFO sign-off hash matches', validatedAt: '2025-10-14 09:42 UTC', validatedBy: 'agent', evidence: 'Deploy log hash: a3f9c2...' },
  { id: 'val-002', mapId: 'map-006', mapTitle: 'ICT third-party register', method: 'document', status: 'passed', detail: '247 providers logged, critical providers notified to EBA portal', validatedAt: '2025-11-02 14:17 UTC', validatedBy: 'agent', evidence: 'Doc hash: b7e1d4...' },
  { id: 'val-003', mapId: 'map-002', mapTitle: 'Capital floor (72.5%)', method: 'system', status: 'pending', detail: 'UAT evidence submitted. Awaiting go-live confirmation and parallel run data', validatedAt: '2025-11-08 11:05 UTC', validatedBy: 'agent' },
  { id: 'val-004', mapId: 'map-005', mapTitle: 'Cyber shock stress test', method: 'portal', status: 'failed', detail: 'Deadline passed. No submission found in Fed portal. Auto-escalated to CRO', validatedAt: '2025-11-01 00:00 UTC', validatedBy: 'agent' },
]

// ─── Notifications ────────────────────────────────────────────────
export const notifications: Notification[] = [
  { id: 'notif-001', type: 'alert', title: 'MAP Overdue — BCBS-044', message: 'MAP-005 cyber shock test is 11 days overdue. CRO notified.', createdAt: '2 hours ago', read: false, link: '/maps' },
  { id: 'notif-002', type: 'success', title: 'Validation Complete', message: 'MAP-006 ICT register auto-validated successfully.', createdAt: '4 hours ago', read: false, link: '/validation' },
  { id: 'notif-003', type: 'info', title: 'New Regulation Detected', message: 'FinCEN AML update detected. 4 MAPs being generated.', createdAt: '1 day ago', read: true, link: '/regulations' },
  { id: 'notif-004', type: 'warning', title: 'MAP Due in 7 Days', message: 'MAP-003 RWA reporting restatement due Feb 15. 22% complete.', createdAt: '1 day ago', read: true, link: '/maps' },
]

// ─── Chart Data ───────────────────────────────────────────────────
export const complianceTimelineData = [
  { month: 'Jun', score: 78, validated: 28, overdue: 12 },
  { month: 'Jul', score: 81, validated: 32, overdue: 10 },
  { month: 'Aug', score: 83, validated: 38, overdue: 9 },
  { month: 'Sep', score: 87, validated: 41, overdue: 8 },
  { month: 'Oct', score: 91, validated: 44, overdue: 7 },
  { month: 'Nov', score: 94, validated: 47, overdue: 7 },
]

export const mapsByDeptData = [
  { dept: 'Risk', open: 9, validated: 14, overdue: 2 },
  { dept: 'Compliance', open: 14, validated: 8, overdue: 4 },
  { dept: 'IT', open: 6, validated: 18, overdue: 1 },
  { dept: 'Legal', open: 5, validated: 12, overdue: 0 },
  { dept: 'Treasury', open: 4, validated: 9, overdue: 0 },
  { dept: 'Ops', open: 7, validated: 11, overdue: 0 },
]
