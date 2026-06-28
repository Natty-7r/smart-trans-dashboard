// ============================================================
// TRANSFORMER TYPES
// ============================================================

export type TransformerStatus = "nominal" | "alarm" | "critical";
export type TransformerType = "25KVA" | "50KVA";
export type AlertSeverity = "info" | "warning" | "high" | "critical";
export type SensorType = "temperature" | "current" | "voltage" | "oil" | "gas" | "vibration";

// ============================================================
// THRESHOLD CONFIGURATIONS
// ============================================================

export interface ThresholdConfig {
    nominal: {
        min?: number;
        max?: number;
    };
    alarm: {
        min?: number;
        max?: number;
    };
    critical: {
        min?: number;
        max?: number;
    };
}

export interface SensorThresholds {
    temperature: ThresholdConfig;
    current: ThresholdConfig;
    voltage: ThresholdConfig;
    oilLevel: ThresholdConfig;
    gas: ThresholdConfig;
    vibration: ThresholdConfig;
}

// ============================================================
// SENSOR READINGS
// ============================================================

export interface TemperatureReading {
    oilTemp: number; // °C
    windingTemp: number; // °C
    ambientTemp: number; // °C
}

export interface CurrentReading {
    phaseA: number; // Amps
    phaseB: number; // Amps
    phaseC: number; // Amps
    ratedCurrent: number; // Amps
    loadFactor: number; // Percentage
}

export interface VoltageReading {
    primary: number; // kV
    secondary: number; // V
    deviation: number; // Percentage
}

export interface OilReading {
    level: number; // Percentage
    pressure: number; // PSI
    moisture: number; // ppm
    dielectricStrength: number; // kV/mm
}

export interface GasReading {
    hydrogen: number; // ppm
    methane: number; // ppm
    ethane: number; // ppm
    ethylene: number; // ppm
    acetylene: number; // ppm
    carbonMonoxide: number; // ppm
    carbonDioxide: number; // ppm
    totalCombustible: number; // ppm
}

export interface VibrationReading {
    xAxis: number; // mm/s
    yAxis: number; // mm/s
    zAxis: number; // mm/s
    frequency: number; // Hz
}

// ============================================================
// ANTI-THEFT & SECURITY
// ============================================================

export type AntiTheftStatus = "secure" | "tamper_warning" | "intrusion";
export type SecurityEventType = "tamper_detected" | "forced_entry" | "cable_cut" | "gps_displacement" | "enclosure_open";

export interface AntiTheftReading {
    status: AntiTheftStatus;
    vibration: VibrationReading;
    enclosureClosed: boolean;
    gps: {
        latitude: number;
        longitude: number;
        altitude: number;
    };
    lastMovement: string; // ISO timestamp
}

export interface SecurityEvent {
    id: string;
    siteId: string;
    type: SecurityEventType;
    severity: AlertSeverity;
    timestamp: string;
    description: string;
    resolved: boolean;
    resolvedAt?: string;
    resolvedBy?: string;
}

// ============================================================
// TRANSFORMER COMPLETE
// ============================================================

export interface TransformerSite {
    id: string;
    name: string;
    type: TransformerType;
    location: {
        latitude: number;
        longitude: number;
        region: string;
        district: string;
    };
    status: TransformerStatus;
    healthScore: number; // 0-100
    lastUpdated: string; // ISO timestamp

    // Readings
    temperature: TemperatureReading;
    current: CurrentReading;
    voltage: VoltageReading;
    oil: OilReading;
    gas: GasReading;
    vibration: VibrationReading;
    antiTheft: AntiTheftReading;

    // Alerts
    activeAlerts: Alert[];
    alertCount: {
        critical: number;
        high: number;
        warning: number;
        info: number;
    };

    // Metadata
    installedDate: string;
    lastMaintenance: string;
    expectedLife: number; // years
    remainingLife: number; // years
}

// ============================================================
// ALERTS
// ============================================================

export interface Alert {
    id: string;
    siteId: string;
    siteName: string;
    severity: AlertSeverity;
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
// GPS & MAP
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

// ============================================================
// EVENT LOG
// ============================================================

export interface EventLogEntry {
    id: string;
    siteId: string;
    siteName: string;
    severity: AlertSeverity;
    eventType: string;
    description: string;
    timestamp: string;
    triggeredBy: string;
    actionTaken: string;
    responseTime: number; // minutes
    status: "pending" | "in_progress" | "resolved";
}

// ============================================================
// DASHBOARD STATS
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
// HELPER TYPES
// ============================================================

export type ThresholdStatus = "nominal" | "alarm" | "critical";

export interface ThresholdResult {
    status: ThresholdStatus;
    value: number;
    threshold: {
        nominal: { min?: number; max?: number };
        alarm: { min?: number; max?: number };
        critical: { min?: number; max?: number };
    };
}