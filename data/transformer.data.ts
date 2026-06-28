import {
    TransformerSite,
    DashboardStats,
    Alert,
    EventLogEntry,
    SiteLocation,
    ThresholdConfig,
    SensorThresholds,
} from "@/types/transformer.type";

// ============================================================
// THRESHOLD CONFIGURATIONS
// ============================================================

export const THRESHOLDS: SensorThresholds = {
    temperature: {
        nominal: { min: 0, max: 80 },
        alarm: { min: 80, max: 95 },
        critical: { min: 95, max: 200 },
    },
    current: {
        nominal: { min: 0, max: 80 },
        alarm: { min: 80, max: 110 },
        critical: { min: 110, max: 200 },
    },
    voltage: {
        nominal: { min: -5, max: 5 },
        alarm: { min: -10, max: 10 },
        critical: { min: -20, max: 20 },
    },
    oilLevel: {
        nominal: { min: 90, max: 100 },
        alarm: { min: 70, max: 89 },
        critical: { min: 0, max: 69 },
    },
    gas: {
        nominal: { min: 0, max: 50 },
        alarm: { min: 50, max: 150 },
        critical: { min: 150, max: 1000 },
    },
    vibration: {
        nominal: { min: 0, max: 2 },
        alarm: { min: 2, max: 5 },
        critical: { min: 5, max: 20 },
    },
};

// ============================================================
// DEMO TRANSFORMER SITES
// ============================================================

export const DEMO_TRANSFORMERS: TransformerSite[] = [
    {
        id: "ADD-001",
        name: "Bole Site A",
        type: "25KVA",
        location: {
            latitude: 9.0056,
            longitude: 38.7636,
            region: "Addis Ababa",
            district: "Bole",
        },
        status: "nominal",
        healthScore: 94,
        lastUpdated: new Date().toISOString(),

        temperature: {
            oilTemp: 72,
            windingTemp: 78,
            ambientTemp: 28,
        },
        current: {
            phaseA: 120,
            phaseB: 118,
            phaseC: 122,
            ratedCurrent: 150,
            loadFactor: 72,
        },
        voltage: {
            primary: 11.2,
            secondary: 415,
            deviation: 1.5,
        },
        oil: {
            level: 92,
            pressure: 14.5,
            moisture: 12,
            dielectricStrength: 28,
        },
        gas: {
            hydrogen: 8,
            methane: 3,
            ethane: 2,
            ethylene: 1,
            acetylene: 0,
            carbonMonoxide: 15,
            carbonDioxide: 120,
            totalCombustible: 25,
        },
        vibration: {
            xAxis: 0.8,
            yAxis: 0.6,
            zAxis: 0.4,
            frequency: 50,
        },
        antiTheft: {
            status: "secure",
            vibration: { xAxis: 0.8, yAxis: 0.6, zAxis: 0.4, frequency: 50 },
            enclosureClosed: true,
            gps: { latitude: 9.0056, longitude: 38.7636, altitude: 2350 },
            lastMovement: new Date(Date.now() - 3600000).toISOString(),
        },
        activeAlerts: [],
        alertCount: { critical: 0, high: 0, warning: 0, info: 0 },
        installedDate: "2023-01-15T00:00:00Z",
        lastMaintenance: "2026-05-10T00:00:00Z",
        expectedLife: 20,
        remainingLife: 16.5,
    },
    {
        id: "ADD-042",
        name: "Bole District B",
        type: "25KVA",
        location: {
            latitude: 9.0156,
            longitude: 38.7736,
            region: "Addis Ababa",
            district: "Bole",
        },
        status: "alarm",
        healthScore: 67,
        lastUpdated: new Date().toISOString(),

        temperature: {
            oilTemp: 87,
            windingTemp: 92,
            ambientTemp: 30,
        },
        current: {
            phaseA: 142,
            phaseB: 138,
            phaseC: 145,
            ratedCurrent: 150,
            loadFactor: 92,
        },
        voltage: {
            primary: 10.8,
            secondary: 408,
            deviation: -4.5,
        },
        oil: {
            level: 72,
            pressure: 13.2,
            moisture: 35,
            dielectricStrength: 18,
        },
        gas: {
            hydrogen: 22,
            methane: 8,
            ethane: 5,
            ethylene: 3,
            acetylene: 1,
            carbonMonoxide: 45,
            carbonDioxide: 280,
            totalCombustible: 80,
        },
        vibration: {
            xAxis: 1.8,
            yAxis: 1.2,
            zAxis: 0.8,
            frequency: 48,
        },
        antiTheft: {
            status: "secure",
            vibration: { xAxis: 1.8, yAxis: 1.2, zAxis: 0.8, frequency: 48 },
            enclosureClosed: true,
            gps: { latitude: 9.0156, longitude: 38.7736, altitude: 2350 },
            lastMovement: new Date(Date.now() - 7200000).toISOString(),
        },
        activeAlerts: [
            {
                id: "ALT-001",
                siteId: "ADD-042",
                siteName: "Bole District B",
                severity: "high",
                type: "temperature",
                message: "Oil temperature exceeding normal range (87°C)",
                timestamp: new Date(Date.now() - 1800000).toISOString(),
                acknowledged: false,
                resolved: false,
            },
            {
                id: "ALT-002",
                siteId: "ADD-042",
                siteName: "Bole District B",
                severity: "warning",
                type: "gas",
                message: "Hydrogen levels rising (22ppm)",
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                acknowledged: false,
                resolved: false,
            },
        ],
        alertCount: { critical: 0, high: 1, warning: 1, info: 0 },
        installedDate: "2023-03-20T00:00:00Z",
        lastMaintenance: "2026-04-15T00:00:00Z",
        expectedLife: 20,
        remainingLife: 12.5,
    },
    {
        id: "ADD-087",
        name: "Kirkos Tower",
        type: "50KVA",
        location: {
            latitude: 9.0256,
            longitude: 38.7936,
            region: "Addis Ababa",
            district: "Kirkos",
        },
        status: "critical",
        healthScore: 34,
        lastUpdated: new Date().toISOString(),

        temperature: {
            oilTemp: 97,
            windingTemp: 105,
            ambientTemp: 32,
        },
        current: {
            phaseA: 185,
            phaseB: 178,
            phaseC: 190,
            ratedCurrent: 200,
            loadFactor: 115,
        },
        voltage: {
            primary: 10.2,
            secondary: 395,
            deviation: -8.5,
        },
        oil: {
            level: 52,
            pressure: 11.5,
            moisture: 65,
            dielectricStrength: 8,
        },
        gas: {
            hydrogen: 95,
            methane: 42,
            ethane: 28,
            ethylene: 35,
            acetylene: 18,
            carbonMonoxide: 120,
            carbonDioxide: 560,
            totalCombustible: 350,
        },
        vibration: {
            xAxis: 4.2,
            yAxis: 3.8,
            zAxis: 2.5,
            frequency: 45,
        },
        antiTheft: {
            status: "tamper_warning",
            vibration: { xAxis: 4.2, yAxis: 3.8, zAxis: 2.5, frequency: 45 },
            enclosureClosed: true,
            gps: { latitude: 9.0256, longitude: 38.7936, altitude: 2350 },
            lastMovement: new Date(Date.now() - 300000).toISOString(),
        },
        activeAlerts: [
            {
                id: "ALT-003",
                siteId: "ADD-087",
                siteName: "Kirkos Tower",
                severity: "critical",
                type: "temperature",
                message: "Critical oil temperature (97°C) — immediate action required",
                timestamp: new Date(Date.now() - 600000).toISOString(),
                acknowledged: false,
                resolved: false,
            },
            {
                id: "ALT-004",
                siteId: "ADD-087",
                siteName: "Kirkos Tower",
                severity: "critical",
                type: "gas",
                message: "Critical gas levels — acetylene detected (18ppm)",
                timestamp: new Date(Date.now() - 1800000).toISOString(),
                acknowledged: true,
                acknowledgedAt: new Date(Date.now() - 1200000).toISOString(),
                acknowledgedBy: "John Admin",
                resolved: false,
            },
            {
                id: "ALT-005",
                siteId: "ADD-087",
                siteName: "Kirkos Tower",
                severity: "high",
                type: "voltage",
                message: "Voltage deviation exceeds -10% (10.2kV)",
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                acknowledged: false,
                resolved: false,
            },
        ],
        alertCount: { critical: 2, high: 1, warning: 0, info: 0 },
        installedDate: "2022-06-01T00:00:00Z",
        lastMaintenance: "2026-02-20T00:00:00Z",
        expectedLife: 20,
        remainingLife: 4.5,
    },
    {
        id: "ADD-103",
        name: "Lideta Substation",
        type: "50KVA",
        location: {
            latitude: 9.0356,
            longitude: 38.8036,
            region: "Addis Ababa",
            district: "Lideta",
        },
        status: "nominal",
        healthScore: 91,
        lastUpdated: new Date().toISOString(),

        temperature: {
            oilTemp: 68,
            windingTemp: 74,
            ambientTemp: 26,
        },
        current: {
            phaseA: 110,
            phaseB: 108,
            phaseC: 112,
            ratedCurrent: 200,
            loadFactor: 55,
        },
        voltage: {
            primary: 11.0,
            secondary: 410,
            deviation: -0.5,
        },
        oil: {
            level: 95,
            pressure: 14.8,
            moisture: 8,
            dielectricStrength: 30,
        },
        gas: {
            hydrogen: 4,
            methane: 2,
            ethane: 1,
            ethylene: 0,
            acetylene: 0,
            carbonMonoxide: 10,
            carbonDioxide: 80,
            totalCombustible: 15,
        },
        vibration: {
            xAxis: 0.5,
            yAxis: 0.4,
            zAxis: 0.3,
            frequency: 50,
        },
        antiTheft: {
            status: "secure",
            vibration: { xAxis: 0.5, yAxis: 0.4, zAxis: 0.3, frequency: 50 },
            enclosureClosed: true,
            gps: { latitude: 9.0356, longitude: 38.8036, altitude: 2350 },
            lastMovement: new Date(Date.now() - 86400000).toISOString(),
        },
        activeAlerts: [],
        alertCount: { critical: 0, high: 0, warning: 0, info: 0 },
        installedDate: "2024-01-10T00:00:00Z",
        lastMaintenance: "2026-06-01T00:00:00Z",
        expectedLife: 20,
        remainingLife: 18.5,
    },
    {
        id: "ADD-056",
        name: "Mexico Roundabout",
        type: "25KVA",
        location: {
            latitude: 9.0456,
            longitude: 38.8136,
            region: "Addis Ababa",
            district: "Mexico",
        },
        status: "alarm",
        healthScore: 58,
        lastUpdated: new Date().toISOString(),

        temperature: {
            oilTemp: 82,
            windingTemp: 88,
            ambientTemp: 29,
        },
        current: {
            phaseA: 135,
            phaseB: 130,
            phaseC: 140,
            ratedCurrent: 150,
            loadFactor: 88,
        },
        voltage: {
            primary: 10.6,
            secondary: 402,
            deviation: -6.5,
        },
        oil: {
            level: 62,
            pressure: 12.8,
            moisture: 45,
            dielectricStrength: 12,
        },
        gas: {
            hydrogen: 45,
            methane: 18,
            ethane: 12,
            ethylene: 8,
            acetylene: 3,
            carbonMonoxide: 85,
            carbonDioxide: 420,
            totalCombustible: 160,
        },
        vibration: {
            xAxis: 2.5,
            yAxis: 2.0,
            zAxis: 1.2,
            frequency: 47,
        },
        antiTheft: {
            status: "intrusion",
            vibration: { xAxis: 2.5, yAxis: 2.0, zAxis: 1.2, frequency: 47 },
            enclosureClosed: false,
            gps: { latitude: 9.0456, longitude: 38.8136, altitude: 2350 },
            lastMovement: new Date(Date.now() - 900000).toISOString(),
        },
        activeAlerts: [
            {
                id: "ALT-006",
                siteId: "ADD-056",
                siteName: "Mexico Roundabout",
                severity: "critical",
                type: "anti_theft",
                message: "⚠️ INTRUSION DETECTED — Enclosure open, GPS displacement detected",
                timestamp: new Date(Date.now() - 900000).toISOString(),
                acknowledged: false,
                resolved: false,
            },
            {
                id: "ALT-007",
                siteId: "ADD-056",
                siteName: "Mexico Roundabout",
                severity: "high",
                type: "oil",
                message: "Oil level critical (62%) — immediate inspection required",
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                acknowledged: false,
                resolved: false,
            },
        ],
        alertCount: { critical: 1, high: 1, warning: 0, info: 0 },
        installedDate: "2023-08-15T00:00:00Z",
        lastMaintenance: "2026-03-10T00:00:00Z",
        expectedLife: 20,
        remainingLife: 8.5,
    },
];

// ============================================================
// DEMO ALERTS
// ============================================================

export const DEMO_ALERTS: Alert[] = [
    {
        id: "ALT-001",
        siteId: "ADD-042",
        siteName: "Bole District B",
        severity: "high",
        type: "temperature",
        message: "Oil temperature exceeding normal range (87°C)",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        acknowledged: false,
        resolved: false,
    },
    {
        id: "ALT-002",
        siteId: "ADD-042",
        siteName: "Bole District B",
        severity: "warning",
        type: "gas",
        message: "Hydrogen levels rising (22ppm)",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        acknowledged: false,
        resolved: false,
    },
    {
        id: "ALT-003",
        siteId: "ADD-087",
        siteName: "Kirkos Tower",
        severity: "critical",
        type: "temperature",
        message: "Critical oil temperature (97°C) — immediate action required",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        acknowledged: false,
        resolved: false,
    },
    {
        id: "ALT-004",
        siteId: "ADD-087",
        siteName: "Kirkos Tower",
        severity: "critical",
        type: "gas",
        message: "Critical gas levels — acetylene detected (18ppm)",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        acknowledged: true,
        acknowledgedAt: new Date(Date.now() - 1200000).toISOString(),
        acknowledgedBy: "John Admin",
        resolved: false,
    },
    {
        id: "ALT-005",
        siteId: "ADD-087",
        siteName: "Kirkos Tower",
        severity: "high",
        type: "voltage",
        message: "Voltage deviation exceeds -10% (10.2kV)",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        acknowledged: false,
        resolved: false,
    },
    {
        id: "ALT-006",
        siteId: "ADD-056",
        siteName: "Mexico Roundabout",
        severity: "critical",
        type: "anti_theft",
        message: "⚠️ INTRUSION DETECTED — Enclosure open, GPS displacement detected",
        timestamp: new Date(Date.now() - 900000).toISOString(),
        acknowledged: false,
        resolved: false,
    },
    {
        id: "ALT-007",
        siteId: "ADD-056",
        siteName: "Mexico Roundabout",
        severity: "high",
        type: "oil",
        message: "Oil level critical (62%) — immediate inspection required",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        acknowledged: false,
        resolved: false,
    },
];

// ============================================================
// DEMO EVENT LOG
// ============================================================

export const DEMO_EVENT_LOG: EventLogEntry[] = [
    {
        id: "EVT-001",
        siteId: "ADD-087",
        siteName: "Kirkos Tower",
        severity: "critical",
        eventType: "temperature_alert",
        description: "Oil temperature exceeded critical threshold (97°C)",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        triggeredBy: "ML Anomaly Detection",
        actionTaken: "Auto-dispatch field team",
        responseTime: 2,
        status: "in_progress",
    },
    {
        id: "EVT-002",
        siteId: "ADD-087",
        siteName: "Kirkos Tower",
        severity: "critical",
        eventType: "gas_alert",
        description: "Acetylene detected — internal arcing suspected",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        triggeredBy: "ML Prediction Engine",
        actionTaken: "Emergency shutdown initiated",
        responseTime: 1,
        status: "resolved",
    },
    {
        id: "EVT-003",
        siteId: "ADD-056",
        siteName: "Mexico Roundabout",
        severity: "critical",
        eventType: "anti_theft",
        description: "Intrusion detected — enclosure opened, GPS displaced",
        timestamp: new Date(Date.now() - 900000).toISOString(),
        triggeredBy: "Anti-Theft Sensor",
        actionTaken: "Security team dispatched",
        responseTime: 3,
        status: "in_progress",
    },
    {
        id: "EVT-004",
        siteId: "ADD-042",
        siteName: "Bole District B",
        severity: "high",
        eventType: "temperature_alert",
        description: "Oil temperature above normal (87°C)",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        triggeredBy: "ML Anomaly Detection",
        actionTaken: "Cooling system check scheduled",
        responseTime: 5,
        status: "pending",
    },
    {
        id: "EVT-005",
        siteId: "ADD-042",
        siteName: "Bole District B",
        severity: "warning",
        eventType: "gas_alert",
        description: "Hydrogen levels trending up (22ppm)",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        triggeredBy: "ML Pattern Recognition",
        actionTaken: "Monitoring — no action required",
        responseTime: 0,
        status: "resolved",
    },
];

// ============================================================
// DEMO SITE LOCATIONS (for map)
// ============================================================

export const DEMO_SITE_LOCATIONS: SiteLocation[] = DEMO_TRANSFORMERS.map((site) => ({
    id: site.id,
    name: site.name,
    latitude: site.location.latitude,
    longitude: site.location.longitude,
    status: site.status,
    healthScore: site.healthScore,
    activeAlerts: site.activeAlerts.length,
}));

// ============================================================
// DEMO DASHBOARD STATS
// ============================================================

export const DEMO_DASHBOARD_STATS: DashboardStats = {
    totalSites: DEMO_TRANSFORMERS.length,
    onlineSites: DEMO_TRANSFORMERS.length - 1, // 1 offline
    offlineSites: 1,
    healthScore: Math.round(
        DEMO_TRANSFORMERS.reduce((acc, site) => acc + site.healthScore, 0) /
        DEMO_TRANSFORMERS.length
    ),
    activeAlerts: {
        critical: DEMO_ALERTS.filter((a) => a.severity === "critical" && !a.resolved)
            .length,
        high: DEMO_ALERTS.filter((a) => a.severity === "high" && !a.resolved).length,
        warning: DEMO_ALERTS.filter((a) => a.severity === "warning" && !a.resolved)
            .length,
        info: DEMO_ALERTS.filter((a) => a.severity === "info" && !a.resolved).length,
    },
    averageResponseTime: Math.round(
        DEMO_EVENT_LOG.reduce((acc, e) => acc + e.responseTime, 0) /
        DEMO_EVENT_LOG.length
    ),
    sitesByStatus: {
        nominal: DEMO_TRANSFORMERS.filter((s) => s.status === "nominal").length,
        alarm: DEMO_TRANSFORMERS.filter((s) => s.status === "alarm").length,
        critical: DEMO_TRANSFORMERS.filter((s) => s.status === "critical").length,
    },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export const getTransformerById = (id: string): TransformerSite | undefined => {
    return DEMO_TRANSFORMERS.find((site) => site.id === id);
};

export const getTransformersByStatus = (
    status: "nominal" | "alarm" | "critical"
): TransformerSite[] => {
    return DEMO_TRANSFORMERS.filter((site) => site.status === status);
};

export const getAlertsBySeverity = (
    severity: "info" | "warning" | "high" | "critical"
): Alert[] => {
    return DEMO_ALERTS.filter((alert) => alert.severity === severity && !alert.resolved);
};

export const getEventsByStatus = (
    status: "pending" | "in_progress" | "resolved"
): EventLogEntry[] => {
    return DEMO_EVENT_LOG.filter((event) => event.status === status);
};

export const getThresholdStatus = (
    value: number,
    threshold: ThresholdConfig
): "nominal" | "alarm" | "critical" => {
    if (threshold.nominal.min !== undefined && value < threshold.nominal.min) {
        if (threshold.alarm.min !== undefined && value < threshold.alarm.min) {
            return "critical";
        }
        return "alarm";
    }
    if (threshold.nominal.max !== undefined && value > threshold.nominal.max) {
        if (threshold.critical.max !== undefined && value > threshold.critical.max) {
            return "critical";
        }
        if (threshold.alarm.max !== undefined && value > threshold.alarm.max) {
            return "alarm";
        }
    }
    return "nominal";
};