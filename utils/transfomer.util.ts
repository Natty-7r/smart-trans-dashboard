import {
    TransformerSite,
    TransformerStatus,
    ThresholdStatus,
    ThresholdResult,
    SensorThresholds,
    ThresholdConfig,
} from "@/types/transformer.type";
import { THRESHOLDS } from "@/data/transformer.data";
import { STATUS_COLORS } from "@/constants/transformer.contants";

// ============================================================
// THRESHOLD UTILITIES
// ============================================================

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

export const getThresholdResult = (
    value: number,
    thresholdKey: keyof SensorThresholds,
    thresholds: SensorThresholds = THRESHOLDS
): ThresholdResult => {
    const threshold = thresholds[thresholdKey];
    const status = getThresholdStatus(value, threshold);
    return {
        status,
        value,
        threshold,
    };
};

// ============================================================
// STATUS UTILITIES
// ============================================================

export const getOverallStatus = (site: TransformerSite): TransformerStatus => {
    // Check if any critical alerts
    if (site.activeAlerts.some((a) => a.severity === "critical")) {
        return "critical";
    }
    // Check if any high alerts
    if (site.activeAlerts.some((a) => a.severity === "high")) {
        return "alarm";
    }
    // Check sensor thresholds
    const tempStatus = getThresholdStatus(
        site.temperature.oilTemp,
        THRESHOLDS.temperature
    );
    if (tempStatus === "critical") return "critical";
    if (tempStatus === "alarm") return "alarm";

    const currentStatus = getThresholdStatus(
        site.current.loadFactor,
        THRESHOLDS.current
    );
    if (currentStatus === "critical") return "critical";
    if (currentStatus === "alarm") return "alarm";

    const oilStatus = getThresholdStatus(
        site.oil.level,
        THRESHOLDS.oilLevel
    );
    if (oilStatus === "critical") return "critical";
    if (oilStatus === "alarm") return "alarm";

    // Check anti-theft
    if (site.antiTheft.status === "intrusion") return "critical";
    if (site.antiTheft.status === "tamper_warning") return "alarm";

    return "nominal";
};

export const getStatusColor = (status: TransformerStatus) => {
    return STATUS_COLORS[status];
};

export const getStatusLabel = (status: TransformerStatus): string => {
    const labels = {
        nominal: "Nominal",
        alarm: "Alarm",
        critical: "Critical",
    };
    return labels[status];
};

// ============================================================
// HEALTH SCORE UTILITIES
// ============================================================

export const calculateHealthScore = (site: TransformerSite): number => {
    let score = 100;

    // Temperature penalty
    const tempStatus = getThresholdStatus(
        site.temperature.oilTemp,
        THRESHOLDS.temperature
    );
    if (tempStatus === "critical") score -= 30;
    else if (tempStatus === "alarm") score -= 15;

    // Current penalty
    const currentStatus = getThresholdStatus(
        site.current.loadFactor,
        THRESHOLDS.current
    );
    if (currentStatus === "critical") score -= 20;
    else if (currentStatus === "alarm") score -= 10;

    // Oil level penalty
    const oilStatus = getThresholdStatus(
        site.oil.level,
        THRESHOLDS.oilLevel
    );
    if (oilStatus === "critical") score -= 25;
    else if (oilStatus === "alarm") score -= 12;

    // Gas penalty
    if (site.gas.totalCombustible > 150) score -= 25;
    else if (site.gas.totalCombustible > 50) score -= 10;

    // Anti-theft penalty
    if (site.antiTheft.status === "intrusion") score -= 30;
    else if (site.antiTheft.status === "tamper_warning") score -= 15;

    // Ensure score stays between 0 and 100
    return Math.max(0, Math.min(100, score));
};

// ============================================================
// AGGREGATION UTILITIES
// ============================================================

export const aggregateAlerts = (sites: TransformerSite[]) => {
    return sites.reduce(
        (acc, site) => {
            site.activeAlerts.forEach((alert) => {
                acc[alert.severity] = (acc[alert.severity] || 0) + 1;
            });
            return acc;
        },
        {} as Record<string, number>
    );
};

export const aggregateStatus = (sites: TransformerSite[]) => {
    return sites.reduce(
        (acc, site) => {
            acc[site.status] = (acc[site.status] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );
};

// ============================================================
// FORMATTING UTILITIES
// ============================================================

export const formatTemperature = (temp: number): string => {
    return `${Math.round(temp)}°C`;
};

export const formatCurrent = (current: number): string => {
    return `${Math.round(current)}A`;
};

export const formatVoltage = (voltage: number): string => {
    return `${voltage.toFixed(1)}kV`;
};

export const formatPercent = (value: number): string => {
    return `${Math.round(value)}%`;
};

export const formatPpm = (value: number): string => {
    return `${Math.round(value)} ppm`;
};

export const formatHealthScore = (score: number): string => {
    return `${Math.round(score)}/100`;
};

export const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
};