// ============================================================
// DASHBOARD CONFIGURATION
// ============================================================

export const DASHBOARD_CONFIG = {
    // Refresh intervals (in milliseconds)
    refreshIntervals: {
        liveData: 30000, // 30 seconds
        alerts: 10000, // 10 seconds
        stats: 60000, // 1 minute
        map: 30000, // 30 seconds
    },

    // Chart defaults
    charts: {
        timeRange: {
            default: "24h",
            options: ["1h", "6h", "12h", "24h", "7d", "30d"],
        },
        colors: {
            temperature: "#EF4444",
            current: "#F59E0B",
            voltage: "#3B82F6",
            oil: "#8B5CF6",
            gas: "#EC4899",
            vibration: "#14B8A6",
        },
    },

    // Alert thresholds
    alerts: {
        maxDisplay: 50,
        autoAcknowledge: false,
        escalationMinutes: 10,
    },

    // Map configuration
    map: {
        defaultCenter: { lat: 9.03, lng: 38.74 },
        defaultZoom: 12,
        clusterRadius: 30,
    },

    // Pagination
    pagination: {
        defaultPageSize: 10,
        options: [10, 25, 50, 100],
    },
};

// ============================================================
// FEATURE FLAGS
// ============================================================

export const FEATURE_FLAGS = {
    enableRealTime: true,
    enablePredictiveAlerts: true,
    enableAntiTheft: true,
    enableCableCutDetection: true,
    enableGasTrends: true,
    enableVibrationTrends: true,
    enableGpsTracking: true,
    enableSecurityEvents: true,
    enableAutoDispatch: false, // Disabled until approved
};