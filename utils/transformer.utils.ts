import {
    MaintenanceRecord,
    Transformer,
    TransformerReading,
    TransformerStatus,
    TransformerType,
} from "@/types/transformer.type";
import { DEMO_TRANSFORMERS } from "@/data/transformer.data";

// ============================================================
// STATUS UTILITIES
// ============================================================

export const getStatusColor = (status: TransformerStatus): string => {
    const colors = {
        nominal: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
        alarm: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
        critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
    };
    return colors[status] || colors.nominal;
};

export const getStatusDotColor = (status: TransformerStatus): string => {
    const colors = {
        nominal: "bg-emerald-500",
        alarm: "bg-amber-500",
        critical: "bg-red-500",
    };
    return colors[status] || colors.nominal;
};

export const getStatusLabel = (status: TransformerStatus): string => {
    const labels = {
        nominal: "Nominal",
        alarm: "Alarm",
        critical: "Critical",
    };
    return labels[status] || "Unknown";
};

// ============================================================
// TRANSFORMER UTILITIES
// ============================================================

export const getTransformerById = (id: string): Transformer | undefined => {
    return DEMO_TRANSFORMERS.find((t) => t.id === id);
};

export const getTransformerBySiteId = (siteId: string): Transformer | undefined => {
    return DEMO_TRANSFORMERS.find((t) => t.siteId === siteId);
};

export const getTransformersByStatus = (status: TransformerStatus): Transformer[] => {
    return DEMO_TRANSFORMERS.filter((t) => t.status === status);
};

export const getTransformersByType = (type: TransformerType): Transformer[] => {
    return DEMO_TRANSFORMERS.filter((t) => t.type === type);
};

// ============================================================
// READING UTILITIES
// ============================================================

export const getLatestReading = (transformer: Transformer): TransformerReading | null => {
    if (!transformer.readings || transformer.readings.length === 0) return null;
    return transformer.readings[transformer.readings.length - 1];
};

export const getReadingsByDateRange = (
    transformer: Transformer,
    startDate: Date,
    endDate: Date
): TransformerReading[] => {
    return transformer.readings.filter((reading) => {
        const date = new Date(reading.timestamp);
        return date >= startDate && date <= endDate;
    });
};

export const getReadingHistory = (
    transformer: Transformer,
    period: "today" | "week" | "month" | "year" | "all" = "month"
): TransformerReading[] => {
    const now = new Date();
    let filtered = [...transformer.readings];

    switch (period) {
        case "today":
            filtered = filtered.filter(
                (r) => new Date(r.timestamp).toDateString() === now.toDateString()
            );
            break;
        case "week": {
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            filtered = filtered.filter((r) => new Date(r.timestamp) >= weekAgo);
            break;
        }
        case "month": {
            const monthAgo = new Date(now);
            monthAgo.setMonth(now.getMonth() - 1);
            filtered = filtered.filter((r) => new Date(r.timestamp) >= monthAgo);
            break;
        }
        case "year": {
            const yearAgo = new Date(now);
            yearAgo.setFullYear(now.getFullYear() - 1);
            filtered = filtered.filter((r) => new Date(r.timestamp) >= yearAgo);
            break;
        }
        default:
            break;
    }

    return filtered.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
};

// ============================================================
// MAINTENANCE UTILITIES
// ============================================================

export const getMaintenanceByStatus = (
    transformer: Transformer,
    status: MaintenanceRecord["status"]
): MaintenanceRecord[] => {
    return transformer.maintenance.filter((m) => m.status === status);
};

export const getMaintenanceByType = (
    transformer: Transformer,
    type: MaintenanceRecord["type"]
): MaintenanceRecord[] => {
    return transformer.maintenance.filter((m) => m.type === type);
};

// ============================================================
// TECHNICIAN UTILITIES
// ============================================================

export const getTechnicianCount = (transformer: Transformer): number => {
    return transformer.technicians.length;
};

export const isTechnicianAssigned = (transformer: Transformer, userId: string): boolean => {
    return transformer.technicians.includes(userId);
};

// ============================================================
// HEALTH SCORE UTILITIES
// ============================================================

export const getHealthStatus = (healthScore: number): "good" | "fair" | "poor" => {
    if (healthScore >= 70) return "good";
    if (healthScore >= 50) return "fair";
    return "poor";
};

export const getHealthStatusColor = (healthScore: number): string => {
    const status = getHealthStatus(healthScore);
    const colors = {
        good: "text-emerald-600 dark:text-emerald-400",
        fair: "text-amber-600 dark:text-amber-400",
        poor: "text-red-600 dark:text-red-400",
    };
    return colors[status];
};

export const getHealthStatusBadge = (healthScore: number): string => {
    const status = getHealthStatus(healthScore);
    const badges = {
        good: "border-emerald-200 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400",
        fair: "border-amber-200 text-amber-600 dark:border-amber-800 dark:text-amber-400",
        poor: "border-red-200 text-red-600 dark:border-red-800 dark:text-red-400",
    };
    return badges[status];
};

// ============================================================
// AGGREGATION UTILITIES
// ============================================================

export const aggregateTransformerStatus = (transformers: Transformer[]) => {
    return transformers.reduce(
        (acc, t) => {
            acc[t.status] = (acc[t.status] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );
};

export const aggregateTransformerTypes = (transformers: Transformer[]) => {
    return transformers.reduce(
        (acc, t) => {
            acc[t.type] = (acc[t.type] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );
};

export const aggregateHealthScores = (transformers: Transformer[]) => {
    return transformers.reduce(
        (acc, t) => {
            const status = getHealthStatus(t.healthScore);
            acc[status] = (acc[status] || 0) + 1;
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

export const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const formatDateTime = (date: string): string => {
    return new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// ============================================================
// THRESHOLD UTILITIES
// ============================================================

export interface ThresholdConfig {
    nominal: { min?: number; max?: number };
    alarm: { min?: number; max?: number };
    critical: { min?: number; max?: number };
}

export const getThresholdStatus = (
    value: number,
    threshold: ThresholdConfig,
    reverse: boolean = false
): "nominal" | "alarm" | "critical" => {
    if (reverse) {
        // For values where lower is worse (e.g., oil level)
        if (threshold.critical.min !== undefined && value < threshold.critical.min) {
            return "critical";
        }
        if (threshold.alarm.min !== undefined && value < threshold.alarm.min) {
            return "alarm";
        }
        return "nominal";
    }

    // For values where higher is worse (e.g., temperature)
    if (threshold.critical.max !== undefined && value > threshold.critical.max) {
        return "critical";
    }
    if (threshold.alarm.max !== undefined && value > threshold.alarm.max) {
        return "alarm";
    }
    return "nominal";
};

export const getThresholdColor = (status: "nominal" | "alarm" | "critical"): string => {
    const colors = {
        nominal: "text-emerald-600 dark:text-emerald-400",
        alarm: "text-amber-600 dark:text-amber-400",
        critical: "text-red-600 dark:text-red-400",
    };
    return colors[status];
};

export const getThresholdBadge = (status: "nominal" | "alarm" | "critical"): string => {
    const badges = {
        nominal: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
        alarm: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
        critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
    };
    return badges[status];
};

// ============================================================
// ALERT UTILITIES
// ============================================================

export const getAlertSeverityColor = (severity: string): string => {
    const colors = {
        critical: "text-red-600 dark:text-red-400",
        high: "text-orange-600 dark:text-orange-400",
        warning: "text-amber-600 dark:text-amber-400",
        info: "text-blue-600 dark:text-blue-400",
    };
    return colors[severity as keyof typeof colors] || colors.info;
};

export const getAlertSeverityBadge = (severity: string): string => {
    const badges = {
        critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
        high: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
        warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
        info: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    };
    return badges[severity as keyof typeof badges] || badges.info;
};

// ============================================================
// ANTI-THEFT UTILITIES
// ============================================================

export const getAntiTheftStatusColor = (
    status: "secure" | "tamper_warning" | "intrusion"
): string => {
    const colors = {
        secure: "text-emerald-600 dark:text-emerald-400",
        tamper_warning: "text-amber-600 dark:text-amber-400",
        intrusion: "text-red-600 dark:text-red-400",
    };
    return colors[status];
};

export const getAntiTheftStatusBadge = (
    status: "secure" | "tamper_warning" | "intrusion"
): string => {
    const badges = {
        secure: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
        tamper_warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
        intrusion: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
    };
    return badges[status];
};

export const getAntiTheftStatusLabel = (
    status: "secure" | "tamper_warning" | "intrusion"
): string => {
    const labels = {
        secure: "Secure",
        tamper_warning: "Tamper Warning",
        intrusion: "Intrusion",
    };
    return labels[status];
};