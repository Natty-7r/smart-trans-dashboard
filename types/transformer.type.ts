// ============================================================
// TRANSFORMER TYPES
// ============================================================



export interface SiteLocation {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    status: TransformerStatus;
    healthScore: number;
    activeAlerts: number;
}
export interface TransformerReading {
    id: string;
    transformerId: string;
    timestamp: string;
    temperature: {
        oil: number; // °C
        winding: number; // °C
        ambient: number; // °C
    };
    current: {
        phaseA: number; // Amps
        phaseB: number; // Amps
        phaseC: number; // Amps
        loadFactor: number; // Percentage
    };
    voltage: {
        primary: number; // kV
        secondary: number; // V
        deviation: number; // Percentage
    };
    oil: {
        level: number; // Percentage
        pressure: number; // PSI
        moisture: number; // ppm
        dielectricStrength: number; // kV/mm
    };
    gas: {
        hydrogen: number; // ppm
        methane: number; // ppm
        ethane: number; // ppm
        ethylene: number; // ppm
        acetylene: number; // ppm
        totalCombustible: number; // ppm
    };
    vibration: {
        xAxis: number; // mm/s
        yAxis: number; // mm/s
        zAxis: number; // mm/s
    };
    antiTheft: {
        status: "secure" | "tamper_warning" | "intrusion";
        enclosureClosed: boolean;
        gps: { latitude: number; longitude: number };
    };
    healthScore: number;
    status: TransformerStatus;
}

export interface Transformer {
    id: string;
    siteId: string;
    siteName: string;
    siteCode: string;
    type: TransformerType;
    manufacturer: string;
    model: string;
    serialNumber: string;
    capacity: number; // KVA
    installedDate: string;
    expectedLife: number; // years
    remainingLife: number; // years
    status: TransformerStatus;
    healthScore: number;
    location: {
        continent: string;
        country: string;
        region: string;
        district: string;
        latitude: number;
        longitude: number;
    };
    technicians: string[]; // User IDs
    activeAlerts: number;
    lastUpdated: string;
    readings: TransformerReading[];
    maintenance: MaintenanceRecord[];
    activityLog: ActivityLogEntry[];
}


export interface MaintenanceRecord {
    id: string;
    transformerId: string;
    date: string;
    technicianId: string;
    technicianName: string;
    type: "maintenance" | "repair" | "inspection" | "emergency" | "calibration";
    title: string;
    description: string;
    tasks: string[];
    partsUsed: string[];
    duration: number; // minutes
    status: "pending" | "in_progress" | "completed" | "cancelled";
    notes?: string;
    attachments?: string[];
}

export interface ActivityLogEntry {
    id: string;
    transformerId: string;
    type: "reading" | "maintenance" | "alert" | "status_change" | "technician_assigned" | "technician_revoked";
    message: string;
    timestamp: string;
    userId: string;
    userName: string;
    metadata?: Record<string, any>;
}

export interface TransformerFormData {
    siteId: string;
    type: TransformerType;
    manufacturer: string;
    model: string;
    serialNumber: string;
    capacity: number;
    installedDate: string;
    expectedLife: number;
}

export interface ReadingHistoryFilter {
    startDate?: string;
    endDate?: string;
    period?: "today" | "yesterday" | "week" | "month" | "year" | "custom";
}

// ============================================================
// SECURITY EVENT TYPES
// ============================================================

export interface SecurityEvent {
    id: string;
    siteId: string;
    type: "tamper_detected" | "forced_entry" | "cable_cut" | "gps_displacement" | "enclosure_open";
    severity: "info" | "warning" | "high" | "critical";
    timestamp: string;
    description: string;
    resolved: boolean;
    resolvedAt?: string;
    resolvedBy?: string;
}

// ============================================================
// TRANSFORMER TYPES
// ============================================================

export type TransformerStatus = "nominal" | "alarm" | "critical";
export type TransformerType = "25KVA" | "50KVA";

export interface SiteLocation {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    status: TransformerStatus;
    healthScore: number;
    activeAlerts: number;
}

export interface TransformerReading {
    id: string;
    transformerId: string;
    timestamp: string;
    temperature: {
        oil: number; // °C
        winding: number; // °C
        ambient: number; // °C
    };
    current: {
        phaseA: number; // Amps
        phaseB: number; // Amps
        phaseC: number; // Amps
        loadFactor: number; // Percentage
    };
    voltage: {
        primary: number; // kV
        secondary: number; // V
        deviation: number; // Percentage
    };
    oil: {
        level: number; // Percentage
        pressure: number; // PSI
        moisture: number; // ppm
        dielectricStrength: number; // kV/mm
    };
    gas: {
        hydrogen: number; // ppm
        methane: number; // ppm
        ethane: number; // ppm
        ethylene: number; // ppm
        acetylene: number; // ppm
        totalCombustible: number; // ppm
    };
    vibration: {
        xAxis: number; // mm/s
        yAxis: number; // mm/s
        zAxis: number; // mm/s
    };
    antiTheft: {
        status: "secure" | "tamper_warning" | "intrusion";
        enclosureClosed: boolean;
        gps: { latitude: number; longitude: number };
    };
    healthScore: number;
    status: TransformerStatus;
}

export interface Transformer {
    id: string;
    siteId: string;
    siteName: string;
    siteCode: string;
    type: TransformerType;
    manufacturer: string;
    model: string;
    serialNumber: string;
    capacity: number; // KVA
    installedDate: string;
    expectedLife: number; // years
    remainingLife: number; // years
    status: TransformerStatus;
    healthScore: number;
    location: {
        continent: string;
        country: string;
        region: string;
        district: string;
        latitude: number;
        longitude: number;
    };
    technicians: string[]; // User IDs
    activeAlerts: number;
    lastUpdated: string;
    readings: TransformerReading[];
    maintenance: MaintenanceRecord[];
    activityLog: ActivityLogEntry[];
}

export interface MaintenanceRecord {
    id: string;
    transformerId: string;
    date: string;
    technicianId: string;
    technicianName: string;
    type: "maintenance" | "repair" | "inspection" | "emergency" | "calibration";
    title: string;
    description: string;
    tasks: string[];
    partsUsed: string[];
    duration: number; // minutes
    status: "pending" | "in_progress" | "completed" | "cancelled";
    notes?: string;
    attachments?: string[];
}

export interface ActivityLogEntry {
    id: string;
    transformerId: string;
    type: "reading" | "maintenance" | "alert" | "status_change" | "technician_assigned" | "technician_revoked";
    message: string;
    timestamp: string;
    userId: string;
    userName: string;
    metadata?: Record<string, any>;
}

export interface TransformerFormData {
    siteId: string;
    type: TransformerType;
    manufacturer: string;
    model: string;
    serialNumber: string;
    capacity: number;
    installedDate: string;
    expectedLife: number;
}

export interface ReadingHistoryFilter {
    startDate?: string;
    endDate?: string;
    period?: "today" | "yesterday" | "week" | "month" | "year" | "custom";
}

// ============================================================
// SECURITY EVENT TYPES
// ============================================================

export interface SecurityEvent {
    id: string;
    siteId: string;
    type: "tamper_detected" | "forced_entry" | "cable_cut" | "gps_displacement" | "enclosure_open";
    severity: "info" | "warning" | "high" | "critical";
    timestamp: string;
    description: string;
    resolved: boolean;
    resolvedAt?: string;
    resolvedBy?: string;
}

// ============================================================
// ALERT TYPES
// ============================================================

export interface Alert {
    id: string;
    siteId: string;
    siteName: string;
    severity: "info" | "warning" | "high" | "critical";
    type: string;
    message: string;
    timestamp: string;
    acknowledged: boolean;
    acknowledgedAt?: string;
    acknowledgedBy?: string;
    resolved: boolean;
    resolvedAt?: string;
    resolvedBy?: string;
    actionTaken?: string;
    responseTime?: number; // minutes
}

// ============================================================
// DASHBOARD STATS TYPES
// ============================================================

export interface DashboardStats {
    totalSites: number;
    onlineSites: number;
    offlineSites: number;
    healthScore: number;
    activeAlerts: {
        critical: number;
        high: number;
        warning: number;
        info: number;
    };
    averageResponseTime: number; // minutes
    sitesByStatus: {
        nominal: number;
        alarm: number;
        critical: number;
    };
}

// ============================================================
// EVENT LOG TYPES
// ============================================================

export interface EventLogEntry {
    id: string;
    siteId: string;
    siteName: string;
    severity: "info" | "warning" | "high" | "critical";
    eventType: string;
    description: string;
    timestamp: string;
    triggeredBy: string;
    actionTaken: string;
    responseTime: number; // minutes
    status: "pending" | "in_progress" | "resolved";
}
