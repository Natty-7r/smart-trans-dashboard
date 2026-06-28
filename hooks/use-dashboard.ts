"use client";

import { useState, useEffect, useCallback } from "react";
import {
    DEMO_TRANSFORMERS,
    DEMO_ALERTS,
    DEMO_EVENT_LOG,
    DEMO_DASHBOARD_STATS,
    DEMO_SITE_LOCATIONS,
} from "@/data/transformer.data";
import {
    TransformerSite,
    DashboardStats,
    Alert,
    EventLogEntry,
    SiteLocation,
} from "@/types/transformer.type";
import { DASHBOARD_CONFIG } from "@/config/dashbaord.config";

interface UseDashboardDataReturn {
    sites: TransformerSite[];
    stats: DashboardStats;
    alerts: Alert[];
    eventLog: EventLogEntry[];
    locations: SiteLocation[];
    isLoading: boolean;
    error: string | null;
    refresh: () => void;
    getSiteById: (id: string) => TransformerSite | undefined;
}

export function useDashboardData(): UseDashboardDataReturn {
    const [sites, setSites] = useState<TransformerSite[]>(DEMO_TRANSFORMERS);
    const [stats, setStats] = useState<DashboardStats>(DEMO_DASHBOARD_STATS);
    const [alerts, setAlerts] = useState<Alert[]>(DEMO_ALERTS);
    const [eventLog, setEventLog] = useState<EventLogEntry[]>(DEMO_EVENT_LOG);
    const [locations, setLocations] = useState<SiteLocation[]>(DEMO_SITE_LOCATIONS);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(() => {
        setIsLoading(true);
        setError(null);

        // Simulate API call
        setTimeout(() => {
            // In real app, fetch from API
            // For demo, use static data with updated timestamps
            const updatedSites = DEMO_TRANSFORMERS.map((site) => ({
                ...site,
                lastUpdated: new Date().toISOString(),
            }));

            setSites(updatedSites);
            setStats(DEMO_DASHBOARD_STATS);
            setAlerts(DEMO_ALERTS);
            setEventLog(DEMO_EVENT_LOG);
            setLocations(DEMO_SITE_LOCATIONS);
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