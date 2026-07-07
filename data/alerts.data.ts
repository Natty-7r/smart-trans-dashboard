import {
  Alert,
  AlertSeverity,
  AlertType,
  AlertStatus,
  AlertNote,
  AlertNotification,
  AlertAction,
  AlertStats,
} from "@/types/alert.type";

// ============================================================
// SEVERITY COLORS
// ============================================================

export const SEVERITY_COLORS: Record<AlertSeverity, string> = {
  info: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export const SEVERITY_ICONS: Record<AlertSeverity, string> = {
  info: "🔵",
  warning: "🟡",
  high: "🟠",
  critical: "🔴",
};

export const SEVERITY_LABELS: Record<AlertSeverity, string> = {
  info: "Info",
  warning: "Warning",
  high: "High",
  critical: "Critical",
};

export const STATUS_COLORS: Record<AlertStatus, string> = {
  active: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  acknowledged:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  resolved:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
};

export const STATUS_LABELS: Record<AlertStatus, string> = {
  active: "Active",
  acknowledged: "Acknowledged",
  resolved: "Resolved",
};

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  temperature: "Temperature",
  current: "Current",
  voltage: "Voltage",
  oil: "Oil Level",
  gas: "Gas",
  vibration: "Vibration",
  anti_theft: "Anti-Theft",
  cable_cut: "Cable Cut",
  gps: "GPS Displacement",
  enclosure: "Enclosure Tamper",
  unknown: "Unknown",
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

const createNote = (
  id: string,
  alertId: string,
  content: string,
  userId: string,
  userName: string,
  minutesAgo: number,
): AlertNote => ({
  id,
  alertId,
  content,
  userId,
  userName,
  timestamp: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
});

const createNotification = (
  id: string,
  alertId: string,
  type: "sms" | "email" | "push",
  recipient: string,
  status: "sent" | "delivered" | "read" | "pending" | "failed",
  minutesAgo: number,
): AlertNotification => ({
  id,
  alertId,
  type,
  recipient,
  sentAt: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
  status,
});

const createAction = (
  id: string,
  alertId: string,
  type: "acknowledge" | "assign" | "resolve" | "escalate" | "note" | "view",
  userId: string,
  userName: string,
  minutesAgo: number,
  details?: string,
): AlertAction => ({
  id,
  alertId,
  type,
  userId,
  userName,
  timestamp: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
  details,
});

const createAlert = (
  id: string,
  siteId: string,
  siteName: string,
  siteCode: string,
  transformerId: string | undefined,
  transformerName: string | undefined,
  severity: AlertSeverity,
  type: AlertType,
  title: string,
  message: string,
  minutesAgo: number,
  status: AlertStatus = "active",
  assignedTo?: string,
  assignedToName?: string,
  actionTaken?: string,
  readings?: any,
): Alert => ({
  id,
  siteId,
  siteName,
  siteCode,
  transformerId,
  transformerName,
  severity,
  type,
  title,
  message,
  timestamp: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
  status,
  assignedTo,
  assignedToName,
  assignedAt: assignedTo
    ? new Date(Date.now() - minutesAgo * 30 * 60 * 1000).toISOString()
    : undefined,
  actionTaken,
  responseTime:
    status === "resolved" ? Math.floor(Math.random() * 30) + 5 : undefined,
  notes: [],
  notifications: [],
  actions: [],
  readings,
});

// ============================================================
// DEMO ALERTS
// ============================================================

const now = new Date();

export const DEMO_ALERTS: Alert[] = [
  // ========== CRITICAL ALERTS ==========
  {
    id: "ALT-001",
    siteId: "site-003",
    siteName: "Kirkos Tower",
    siteCode: "ADD-087",
    transformerId: "TR-004",
    transformerName: "TR-004",
    severity: "critical",
    type: "temperature",
    title: "Critical Oil Temperature",
    message:
      "Oil temperature has reached 97°C, exceeding the critical threshold of 95°C. Immediate action required.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: "active",
    assignedTo: "user-003",
    assignedToName: "Mike Field",
    assignedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    readings: {
      temperature: 97,
      current: 145,
      voltage: 10.2,
      oilLevel: 72,
      hydrogen: 22,
      vibration: 1.2,
    },
    notes: [
      createNote(
        "note-001",
        "ALT-001",
        "Cooling fan is running at 100% capacity. Investigate possible blockage.",
        "user-002",
        "Sarah NOC",
        3,
      ),
    ],
    notifications: [
      createNotification(
        "notif-001",
        "ALT-001",
        "sms",
        "Mike Field",
        "delivered",
        5,
      ),
      createNotification(
        "notif-002",
        "ALT-001",
        "push",
        "Mike Field",
        "read",
        5,
      ),
      createNotification(
        "notif-003",
        "ALT-001",
        "email",
        "NOC Team",
        "sent",
        5,
      ),
    ],
    actions: [
      createAction("act-001", "ALT-001", "view", "user-002", "Sarah NOC", 4),
      createAction(
        "act-002",
        "ALT-001",
        "assign",
        "user-002",
        "Sarah NOC",
        2,
        "Assigned to Mike Field",
      ),
    ],
  },
  {
    id: "ALT-002",
    siteId: "site-003",
    siteName: "Kirkos Tower",
    siteCode: "ADD-087",
    transformerId: "TR-004",
    transformerName: "TR-004",
    severity: "critical",
    type: "gas",
    title: "Acetylene Detected",
    message:
      "Acetylene gas detected at 18ppm. This indicates internal arcing in the transformer.",
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    status: "acknowledged",
    assignedTo: "user-002",
    assignedToName: "Sarah NOC",
    assignedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    actionTaken: "Emergency shutdown initiated",
    acknowledgedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    acknowledgedBy: "Sarah NOC",
    readings: {
      temperature: 82,
      current: 138,
      voltage: 10.8,
      oilLevel: 78,
      hydrogen: 18,
      vibration: 0.8,
    },
    notes: [
      createNote(
        "note-002",
        "ALT-002",
        "Acetylene presence confirmed. Scheduling DGA analysis.",
        "user-002",
        "Sarah NOC",
        25,
      ),
    ],
    notifications: [
      createNotification(
        "notif-004",
        "ALT-002",
        "sms",
        "Sarah NOC",
        "delivered",
        35,
      ),
      createNotification(
        "notif-005",
        "ALT-002",
        "push",
        "Sarah NOC",
        "read",
        35,
      ),
    ],
    actions: [
      createAction("act-003", "ALT-002", "view", "user-003", "Mike Field", 30),
      createAction(
        "act-004",
        "ALT-002",
        "acknowledge",
        "user-002",
        "Sarah NOC",
        20,
      ),
    ],
  },
  {
    id: "ALT-003",
    siteId: "site-005",
    siteName: "Mexico Roundabout",
    siteCode: "ADD-056",
    transformerId: "TR-007",
    transformerName: "TR-007",
    severity: "critical",
    type: "anti_theft",
    title: "Intrusion Detected",
    message:
      "⚠️ Enclosure opened and GPS displacement detected. Possible theft attempt.",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: "active",
    assignedTo: "user-005",
    assignedToName: "David Tech",
    assignedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    readings: {
      temperature: 71,
      current: 125,
      voltage: 11.0,
      oilLevel: 85,
      hydrogen: 8,
      vibration: 4.2,
    },
    notes: [
      createNote(
        "note-003",
        "ALT-003",
        "Security team dispatched. GPS shows device moved 50m from original position.",
        "user-001",
        "John Admin",
        8,
      ),
    ],
    notifications: [
      createNotification(
        "notif-006",
        "ALT-003",
        "sms",
        "David Tech",
        "delivered",
        15,
      ),
      createNotification(
        "notif-007",
        "ALT-003",
        "push",
        "David Tech",
        "read",
        15,
      ),
      createNotification(
        "notif-008",
        "ALT-003",
        "sms",
        "Security Team",
        "sent",
        12,
      ),
    ],
    actions: [
      createAction("act-005", "ALT-003", "view", "user-001", "John Admin", 14),
      createAction(
        "act-006",
        "ALT-003",
        "assign",
        "user-001",
        "John Admin",
        10,
        "Assigned to David Tech",
      ),
    ],
  },
  {
    id: "ALT-004",
    siteId: "site-015",
    siteName: "Lagos Island",
    siteCode: "LOS-001",
    transformerId: "TR-023",
    transformerName: "TR-023",
    severity: "critical",
    type: "current",
    title: "Severe Overload",
    message:
      "Load current at 115% of rated capacity. Immediate load reduction required.",
    timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    status: "resolved",
    assignedTo: "user-015",
    assignedToName: "Leo Manager",
    assignedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    actionTaken: "Load rebalanced successfully",
    acknowledgedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    acknowledgedBy: "Leo Manager",
    resolvedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    resolvedBy: "Leo Manager",
    responseTime: 25,
    readings: {
      temperature: 78,
      current: 230,
      voltage: 10.5,
      oilLevel: 82,
      hydrogen: 12,
      vibration: 0.5,
    },
    notes: [
      createNote(
        "note-004",
        "ALT-004",
        "Load balanced across phases. Current now at 92% capacity.",
        "user-015",
        "Leo Manager",
        35,
      ),
    ],
    notifications: [
      createNotification(
        "notif-009",
        "ALT-004",
        "sms",
        "Leo Manager",
        "delivered",
        55,
      ),
      createNotification(
        "notif-010",
        "ALT-004",
        "push",
        "Leo Manager",
        "read",
        55,
      ),
    ],
    actions: [
      createAction("act-007", "ALT-004", "view", "user-015", "Leo Manager", 50),
      createAction(
        "act-008",
        "ALT-004",
        "acknowledge",
        "user-015",
        "Leo Manager",
        45,
      ),
      createAction(
        "act-009",
        "ALT-004",
        "resolve",
        "user-015",
        "Leo Manager",
        30,
        "Load rebalanced",
      ),
    ],
  },
  {
    id: "ALT-005",
    siteId: "site-011",
    siteName: "Arusha Substation",
    siteCode: "ARU-003",
    transformerId: "TR-017",
    transformerName: "TR-017",
    severity: "critical",
    type: "oil",
    title: "Critical Oil Level",
    message: "Oil level has dropped to 38%, well below the critical threshold.",
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    status: "active",
    assignedTo: "user-010",
    assignedToName: "Grace Tech",
    assignedAt: new Date(Date.now() - 100 * 60 * 1000).toISOString(),
    readings: {
      temperature: 76,
      current: 132,
      voltage: 11.1,
      oilLevel: 38,
      hydrogen: 9,
      vibration: 0.6,
    },
    notes: [
      createNote(
        "note-005",
        "ALT-005",
        "Suspected oil leak. Schedule site visit for inspection.",
        "user-010",
        "Grace Tech",
        90,
      ),
    ],
    notifications: [
      createNotification(
        "notif-011",
        "ALT-005",
        "sms",
        "Grace Tech",
        "delivered",
        120,
      ),
      createNotification(
        "notif-012",
        "ALT-005",
        "push",
        "Grace Tech",
        "read",
        120,
      ),
    ],
    actions: [
      createAction("act-010", "ALT-005", "view", "user-010", "Grace Tech", 110),
      createAction(
        "act-011",
        "ALT-005",
        "assign",
        "user-002",
        "Sarah NOC",
        100,
        "Assigned to Grace Tech",
      ),
    ],
  },

  // ========== HIGH ALERTS ==========
  {
    id: "ALT-006",
    siteId: "site-002",
    siteName: "Bole District B",
    siteCode: "ADD-042",
    transformerId: "TR-003",
    transformerName: "TR-003",
    severity: "high",
    type: "temperature",
    title: "High Oil Temperature",
    message: "Oil temperature is 87°C, exceeding the 80°C alarm threshold.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: "active",
    assignedTo: "user-003",
    assignedToName: "Mike Field",
    assignedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    readings: {
      temperature: 87,
      current: 142,
      voltage: 10.8,
      oilLevel: 72,
      hydrogen: 12,
      vibration: 0.4,
    },
    notes: [],
    notifications: [
      createNotification(
        "notif-013",
        "ALT-006",
        "sms",
        "Mike Field",
        "delivered",
        30,
      ),
    ],
    actions: [
      createAction("act-012", "ALT-006", "view", "user-002", "Sarah NOC", 25),
      createAction(
        "act-013",
        "ALT-006",
        "assign",
        "user-002",
        "Sarah NOC",
        20,
        "Assigned to Mike Field",
      ),
    ],
  },
  {
    id: "ALT-007",
    siteId: "site-002",
    siteName: "Bole District B",
    siteCode: "ADD-042",
    transformerId: "TR-003",
    transformerName: "TR-003",
    severity: "high",
    type: "gas",
    title: "Elevated Hydrogen Levels",
    message:
      "Hydrogen levels at 22ppm, indicating possible insulation degradation.",
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    status: "acknowledged",
    assignedTo: "user-002",
    assignedToName: "Sarah NOC",
    assignedAt: new Date(Date.now() - 100 * 60 * 1000).toISOString(),
    actionTaken: "Monitoring - oil sample scheduled",
    acknowledgedAt: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
    acknowledgedBy: "Sarah NOC",
    readings: {
      temperature: 76,
      current: 125,
      voltage: 11.0,
      oilLevel: 82,
      hydrogen: 22,
      vibration: 0.3,
    },
    notes: [],
    notifications: [
      createNotification(
        "notif-014",
        "ALT-007",
        "sms",
        "Sarah NOC",
        "delivered",
        120,
      ),
    ],
    actions: [
      createAction("act-014", "ALT-007", "view", "user-003", "Mike Field", 110),
      createAction(
        "act-015",
        "ALT-007",
        "acknowledge",
        "user-002",
        "Sarah NOC",
        80,
      ),
    ],
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export const getAlertById = (id: string): Alert | undefined => {
  return DEMO_ALERTS.find((alert) => alert.id === id);
};

export const getAlertsBySite = (siteId: string): Alert[] => {
  return DEMO_ALERTS.filter((alert) => alert.siteId === siteId);
};

export const getAlertsBySeverity = (severity: AlertSeverity): Alert[] => {
  return DEMO_ALERTS.filter((alert) => alert.severity === severity);
};

export const getAlertsByStatus = (status: AlertStatus): Alert[] => {
  return DEMO_ALERTS.filter((alert) => alert.status === status);
};

export const getActiveAlerts = (): Alert[] => {
  return DEMO_ALERTS.filter((alert) => alert.status === "active");
};

export const getAlertsByTransformer = (transformerId: string): Alert[] => {
  return DEMO_ALERTS.filter((alert) => alert.transformerId === transformerId);
};

export const getAlertStats = (): AlertStats => {
  const total = DEMO_ALERTS.length;
  const active = DEMO_ALERTS.filter((a) => a.status === "active").length;
  const acknowledged = DEMO_ALERTS.filter(
    (a) => a.status === "acknowledged",
  ).length;
  const resolved = DEMO_ALERTS.filter((a) => a.status === "resolved").length;

  const bySeverity: Record<AlertSeverity, number> = {
    info: 0,
    warning: 0,
    high: 0,
    critical: 0,
  };
  const byType: Record<AlertType, number> = {
    temperature: 0,
    current: 0,
    voltage: 0,
    oil: 0,
    gas: 0,
    vibration: 0,
    anti_theft: 0,
    cable_cut: 0,
    gps: 0,
    enclosure: 0,
    unknown: 0,
  };

  DEMO_ALERTS.forEach((alert) => {
    bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1;
    byType[alert.type] = (byType[alert.type] || 0) + 1;
  });

  const resolvedAlerts = DEMO_ALERTS.filter((a) => a.status === "resolved");
  const avgResponseTime =
    resolvedAlerts.length > 0
      ? Math.round(
          resolvedAlerts.reduce((acc, a) => acc + (a.responseTime || 0), 0) /
            resolvedAlerts.length,
        )
      : 0;

  return {
    total,
    active,
    acknowledged,
    resolved,
    bySeverity,
    byType,
    averageResponseTime: avgResponseTime,
  };
};
