import {
    MaintenanceRecord,
    Transformer,
    TransformerReading
} from "@/types/transformer.type";
import { DEMO_SITES } from "./sites.data";

// ============================================================
// GENERATE READING HISTORY (30 days of data)
// ============================================================

const generateReadings = (
    transformerId: string,
    siteId: string,
    baseTemp: number = 70,
    baseCurrent: number = 120,
    days: number = 30
): TransformerReading[] => {
    const readings: TransformerReading[] = [];
    const now = new Date();

    for (let d = days; d >= 0; d--) {
        const date = new Date(now);
        date.setDate(date.getDate() - d);

        // Random variations
        const tempVariation = (Math.random() - 0.5) * 15;
        const currentVariation = (Math.random() - 0.5) * 30;
        const gasVariation = Math.random() * 20;

        readings.push({
            id: `reading-${transformerId}-${d}`,
            transformerId,
            timestamp: date.toISOString(),
            temperature: {
                oil: baseTemp + tempVariation,
                winding: baseTemp + tempVariation + 8,
                ambient: 25 + (Math.random() - 0.5) * 10,
            },
            current: {
                phaseA: baseCurrent + currentVariation,
                phaseB: baseCurrent + currentVariation + (Math.random() - 0.5) * 10,
                phaseC: baseCurrent + currentVariation + (Math.random() - 0.5) * 10,
                loadFactor: 60 + (Math.random() - 0.5) * 30,
            },
            voltage: {
                primary: 11 + (Math.random() - 0.5) * 0.8,
                secondary: 415 + (Math.random() - 0.5) * 15,
                deviation: (Math.random() - 0.5) * 6,
            },
            oil: {
                level: 85 + (Math.random() - 0.5) * 15,
                pressure: 14 + (Math.random() - 0.5) * 2,
                moisture: 10 + Math.random() * 20,
                dielectricStrength: 25 + Math.random() * 10,
            },
            gas: {
                hydrogen: 5 + gasVariation * 1.5,
                methane: 2 + gasVariation * 0.8,
                ethane: 1 + gasVariation * 0.5,
                ethylene: 0.5 + gasVariation * 0.3,
                acetylene: 0 + gasVariation * 0.1,
                totalCombustible: 10 + gasVariation * 2,
            },
            vibration: {
                xAxis: 0.5 + Math.random() * 1.5,
                yAxis: 0.5 + Math.random() * 1.5,
                zAxis: 0.3 + Math.random() * 1.0,
            },
            antiTheft: {
                status: "secure",
                enclosureClosed: true,
                gps: {
                    latitude: 9 + (Math.random() - 0.5) * 0.1,
                    longitude: 38.7 + (Math.random() - 0.5) * 0.1,
                },
            },
            healthScore: 70 + Math.random() * 25,
            status: "nominal",
        });
    }

    return readings;
};

// ============================================================
// MAINTENANCE RECORDS
// ============================================================

const maintenanceRecords: MaintenanceRecord[] = [
    {
        id: "maint-001",
        transformerId: "TR-001",
        date: "2026-05-10T09:00:00Z",
        technicianId: "user-003",
        technicianName: "Mike Field",
        type: "maintenance",
        title: "Oil Filter Replacement",
        description: "Replaced oil filter and performed system check",
        tasks: ["Oil filter replacement", "Cooling system inspection", "Thermal imaging scan"],
        partsUsed: ["Oil filter", "Gasket kit"],
        duration: 90,
        status: "completed",
        notes: "Oil quality good, no signs of degradation",
    },
    {
        id: "maint-002",
        transformerId: "TR-002",
        date: "2026-04-15T14:30:00Z",
        technicianId: "user-003",
        technicianName: "Mike Field",
        type: "inspection",
        title: "Routine Inspection",
        description: "Regular inspection and load balancing",
        tasks: ["Routine inspection", "Load balancing check", "Oil sample collection"],
        partsUsed: [],
        duration: 60,
        status: "completed",
        notes: "Load imbalance detected on Phase B, rebalancing recommended",
    },
    {
        id: "maint-003",
        transformerId: "TR-003",
        date: "2026-06-01T11:00:00Z",
        technicianId: "user-004",
        technicianName: "Lisa Manager",
        type: "emergency",
        title: "Emergency Cooling Fan Replacement",
        description: "Cooling fan failed during operation",
        tasks: ["Emergency response", "Overload mitigation", "Cooling fan replacement"],
        partsUsed: ["Cooling fan", "Fuse"],
        duration: 120,
        status: "completed",
        notes: "Cooling fan failed, replaced with new unit",
    },
    {
        id: "maint-004",
        transformerId: "TR-004",
        date: "2026-03-20T10:00:00Z",
        technicianId: "user-003",
        technicianName: "Mike Field",
        type: "maintenance",
        title: "Oil Top-up & Gasket Replacement",
        description: "Minor oil leak repair",
        tasks: ["Routine maintenance", "Oil top-up", "Gasket replacement"],
        partsUsed: ["Oil 10L", "Gasket kit"],
        duration: 75,
        status: "completed",
        notes: "Minor oil leak detected, gasket replaced",
    },
    {
        id: "maint-005",
        transformerId: "TR-005",
        date: "2026-05-25T08:30:00Z",
        technicianId: "user-002",
        technicianName: "Sarah NOC",
        type: "inspection",
        title: "Diagnostic Test",
        description: "Comprehensive diagnostic testing",
        tasks: ["Diagnostic test", "Insulation resistance test", "Transformer tap check"],
        partsUsed: [],
        duration: 45,
        status: "completed",
        notes: "All readings within normal range",
    },
];

// ============================================================
// DEMO TRANSFORMERS
// ============================================================

export const DEMO_TRANSFORMERS: Transformer[] = DEMO_SITES.map((site) => {
    const transformerId = site.transformers[0] || `TR-${site.id.slice(-3)}`;
    const baseTemp = site.status === "critical" ? 85 : site.status === "alarm" ? 78 : 70;
    const baseCurrent = site.status === "critical" ? 160 : site.status === "alarm" ? 140 : 120;

    return {
        id: transformerId,
        siteId: site.id,
        siteName: site.name,
        siteCode: site.code,
        type: site.transformers.length > 1 ? "50KVA" : "25KVA",
        manufacturer: ["Siemens", "ABB", "Schneider", "Eaton", "GE"][Math.floor(Math.random() * 5)],
        model: `T-${Math.floor(Math.random() * 1000)}`,
        serialNumber: `SN-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000)}`,
        capacity: site.transformers.length > 1 ? 50 : 25,
        installedDate: site.plantedDate,
        expectedLife: 20,
        remainingLife: site.status === "critical" ? 3 : site.status === "alarm" ? 8 : 15,
        status: site.status,
        healthScore: site.healthScore,
        location: {
            continent: site.location.continent,
            country: site.location.country,
            region: site.location.region,
            district: site.location.district,
            latitude: site.location.latitude,
            longitude: site.location.longitude,
        },
        technicians: site.technicians,
        activeAlerts: site.activeAlerts,
        lastUpdated: site.lastUpdated,
        readings: generateReadings(transformerId, site.id, baseTemp, baseCurrent),
        maintenance: maintenanceRecords.filter((m) => m.transformerId === transformerId),
        activityLog: [],
    };
});

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export const getTransformerById = (id: string): Transformer | undefined => {
    return DEMO_TRANSFORMERS.find((t) => t.id === id);
};

export const getTransformerBySiteId = (siteId: string): Transformer | undefined => {
    return DEMO_TRANSFORMERS.find((t) => t.siteId === siteId);
};

export const getTransformersByStatus = (status: Transformer["status"]): Transformer[] => {
    return DEMO_TRANSFORMERS.filter((t) => t.status === status);
};

export const getTransformerReadings = (
    transformerId: string,
    limit: number = 100
): TransformerReading[] => {
    const transformer = getTransformerById(transformerId);
    if (!transformer) return [];
    return transformer.readings.slice(-limit);
};

export const getTransformerMaintenance = (transformerId: string): MaintenanceRecord[] => {
    const transformer = getTransformerById(transformerId);
    if (!transformer) return [];
    return transformer.maintenance;
};

export const updateTransformerStatus = (
    transformerId: string,
    status: Transformer["status"]
): Transformer | undefined => {
    const transformer = getTransformerById(transformerId);
    if (!transformer) return undefined;

    const updated: Transformer = {
        ...transformer,
        status,
        healthScore: status === "critical" ? 30 : status === "alarm" ? 60 : 85,
        lastUpdated: new Date().toISOString(),
    };

    const index = DEMO_TRANSFORMERS.findIndex((t) => t.id === transformerId);
    if (index !== -1) {
        DEMO_TRANSFORMERS[index] = updated;
    }

    return updated;
};

export const addTransformerReading = (
    transformerId: string,
    reading: Omit<TransformerReading, "id" | "transformerId" | "timestamp">
): TransformerReading => {
    const newReading: TransformerReading = {
        ...reading,
        id: `reading-${Date.now()}`,
        transformerId,
        timestamp: new Date().toISOString(),
    };

    const transformer = getTransformerById(transformerId);
    if (transformer) {
        transformer.readings.push(newReading);
        transformer.lastUpdated = newReading.timestamp;
    }

    return newReading;
};



// Add at the bottom of the file

// ============================================================
// DEMO ALERTS
// ============================================================

export const DEMO_ALERTS = [
    {
        id: "ALT-001",
        siteId: "site-002",
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
        siteId: "site-003",
        siteName: "Kirkos Tower",
        severity: "critical",
        type: "temperature",
        message: "Critical oil temperature (97°C) — immediate action required",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        acknowledged: false,
        resolved: false,
    },
];

// ============================================================
// DEMO EVENT LOG
// ============================================================

export const DEMO_EVENT_LOG = [
    {
        id: "EVT-001",
        siteId: "site-003",
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
        siteId: "site-002",
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
];

// ============================================================
// DEMO DASHBOARD STATS
// ============================================================

export const DEMO_DASHBOARD_STATS = {
    totalSites: DEMO_TRANSFORMERS.length,
    onlineSites: DEMO_TRANSFORMERS.filter((s) => s.status !== "critical").length,
    offlineSites: DEMO_TRANSFORMERS.filter((s) => s.status === "critical").length,
    healthScore: Math.round(
        DEMO_TRANSFORMERS.reduce((acc, s) => acc + s.healthScore, 0) / DEMO_TRANSFORMERS.length
    ),
    activeAlerts: {
        critical: DEMO_TRANSFORMERS.filter((s) => s.status === "critical").length,
        high: DEMO_TRANSFORMERS.filter((s) => s.status === "alarm").length,
        warning: 0,
        info: 0,
    },
    averageResponseTime: 4.2,
    sitesByStatus: {
        nominal: DEMO_TRANSFORMERS.filter((s) => s.status === "nominal").length,
        alarm: DEMO_TRANSFORMERS.filter((s) => s.status === "alarm").length,
        critical: DEMO_TRANSFORMERS.filter((s) => s.status === "critical").length,
    },
};

// ============================================================
// DEMO SITE LOCATIONS
// ============================================================

export const DEMO_SITE_LOCATIONS = DEMO_TRANSFORMERS.map((site) => ({
    id: site.id,
    name: site.siteName,
    latitude: site.location.latitude,
    longitude: site.location.longitude,
    status: site.status,
    healthScore: site.healthScore,
    activeAlerts: site.activeAlerts || 0,
}));