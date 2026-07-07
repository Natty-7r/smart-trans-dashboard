// ============================================================
// ALERT TYPES
// ============================================================

export type AlertSeverity = "info" | "warning" | "high" | "critical";
export type AlertStatus = "active" | "acknowledged" | "resolved";
export type AlertType =
  | "temperature"
  | "current"
  | "voltage"
  | "oil"
  | "gas"
  | "vibration"
  | "anti_theft"
  | "cable_cut"
  | "gps"
  | "enclosure"
  | "unknown";

export interface AlertNote {
  id: string;
  alertId: string;
  content: string;
  userId: string;
  userName: string;
  timestamp: string;
  attachments?: string[];
}

export interface AlertNotification {
  id: string;
  alertId: string;
  type: "sms" | "email" | "push";
  recipient: string;
  sentAt: string;
  status: "sent" | "delivered" | "read" | "pending" | "failed";
}

export interface AlertAction {
  id: string;
  alertId: string;
  type: "acknowledge" | "assign" | "resolve" | "escalate" | "note" | "view";
  userId: string;
  userName: string;
  timestamp: string;
  details?: string;
}

export interface Alert {
  id: string;
  siteId: string;
  siteName: string;
  siteCode: string;
  transformerId?: string; // Added: link to transformer
  transformerName?: string; // Added: transformer name
  severity: AlertSeverity;
  type: AlertType;
  title: string;
  message: string;
  timestamp: string;
  status: AlertStatus;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  assignedTo?: string;
  assignedToName?: string;
  assignedAt?: string;
  responseTime?: number; // minutes
  actionTaken?: string;
  metadata?: Record<string, any>;
  notes?: AlertNote[];
  notifications?: AlertNotification[];
  actions?: AlertAction[];
  // Sensor readings at time of alert
  readings?: {
    temperature?: number;
    current?: number;
    voltage?: number;
    oilLevel?: number;
    hydrogen?: number;
    vibration?: number;
  };
}

export interface AlertFilters {
  search?: string;
  severity?: AlertSeverity | "all";
  status?: AlertStatus | "all";
  type?: AlertType | "all";
  siteId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AlertStats {
  total: number;
  active: number;
  acknowledged: number;
  resolved: number;
  bySeverity: Record<AlertSeverity, number>;
  byType: Record<AlertType, number>;
  averageResponseTime: number;
}
