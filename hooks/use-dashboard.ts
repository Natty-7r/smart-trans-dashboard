"use client";

import { DASHBOARD_CONFIG } from "@/config/dashbaord.config";
import {
    DEMO_TRANSFORMERS,
} from "@/data/transformer.data";
import {
    Alert,
    DashboardStats,
    EventLogEntry,
    SiteLocation,
    Transformer
} from "@/types/transformer.type";
import { useCallback, useEffect, useState } from "react";

// ============================================================
// TYPES
// ============================================================

export interface UseDashboardDataReturn {
    sites: Transformer[];
    stats: DashboardStats;
    alerts: Alert[];
    eventLog: EventLogEntry[];
    locations: SiteLocation[];
    isLoading: boolean;
    error: string | null;
    refresh: () => void;
    getSiteById: (id: string) => Transformer | undefined;
}

// ============================================================
// HELPERS TO DERIVE DATA FROM TRANSFORMERS
// ============================================================

const deriveDashboardStats = (sites: Transformer[]): DashboardStats => {
    const totalSites = sites.length;
    const onlineSites = sites.filter((s) => s.status !== "critical").length;
    const offlineSites = sites.filter((s) => s.status === "critical").length;
    const healthScore = Math.round(
        sites.reduce((acc, s) => acc + s.healthScore, 0) / sites.length
    );

    const activeAlerts = {
        critical: sites.filter((s) => s.status === "critical").length,
        high: sites.filter((s) => s.status === "alarm").length,
        warning: 0,
        info: 0,
    };

    const sitesByStatus = {
        nominal: sites.filter((s) => s.status === "nominal").length,
        alarm: sites.filter((s) => s.status === "alarm").length,
        critical: sites.filter((s) => s.status === "critical").length,
    };

    return {
        totalSites,
        onlineSites,
        offlineSites,
        healthScore,
        activeAlerts,
        averageResponseTime: 4.2,
        sitesByStatus,
    };
};

const deriveSiteLocations = (sites: Transformer[]): SiteLocation[] => {
    return sites.map((site) => ({
        id: site.id,
        name: site.siteName,
        latitude: site.location.latitude,
        longitude: site.location.longitude,
        status: site.status,
        healthScore: site.healthScore,
        activeAlerts: site.activeAlerts || 0,
    }));
};

// ============================================================
// MOCK ALERTS
// ============================================================

const MOCK_ALERTS: Alert[] = [
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
    {
        id: "ALT-003",
        siteId: "site-005",
        siteName: "Mexico Roundabout",
        severity: "critical",
        type: "anti_theft",
        message: "Intrusion detected — enclosure opened",
        timestamp: new Date(Date.now() - 900000).toISOString(),
        acknowledged: false,
        resolved: false,
    },
];

// ============================================================
// MOCK EVENT LOG
// ============================================================

const MOCK_EVENT_LOG: EventLogEntry[] = [
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
    {
        id: "EVT-003",
        siteId: "site-005",
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
];

// ============================================================
// HOOK
// ============================================================

export function useDashboardData(): UseDashboardDataReturn {
    const [sites, setSites] = useState<Transformer[]>(DEMO_TRANSFORMERS);
    const [stats, setStats] = useState<DashboardStats>(deriveDashboardStats(DEMO_TRANSFORMERS));
    const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
    const [eventLog, setEventLog] = useState<EventLogEntry[]>(MOCK_EVENT_LOG);
    const [locations, setLocations] = useState<SiteLocation[]>(deriveSiteLocations(DEMO_TRANSFORMERS));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(() => {
        setIsLoading(true);
        setError(null);

        // Simulate API call
        setTimeout(() => {
            const updatedSites = DEMO_TRANSFORMERS.map((site) => ({
                ...site,
                lastUpdated: new Date().toISOString(),
            }));

            setSites(updatedSites);
            setStats(deriveDashboardStats(updatedSites));
            setLocations(deriveSiteLocations(updatedSites));
            setIsLoading(false);
        }, 500);
    }, []);

    const getSiteById = useCallback(
        (id: string) => {
            return sites.find((site) => site.id === id);
        },
        [sites]
    );

    // Auto-refresh based on config
    useEffect(() => {
        refresh();
        const interval = setInterval(refresh, DASHBOARD_CONFIG.refreshIntervals.stats);
        return () => clearInterval(interval);
    }, [refresh]);

    return {
        sites,
        stats,
        alerts,
        eventLog,
        locations,
        isLoading,
        error,
        refresh,
        getSiteById,
    };
}