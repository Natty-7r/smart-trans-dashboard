"use client";

import { DashboardStats } from "@/types/transformer.type";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    Zap,
    Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
    stats: DashboardStats;
    isLoading?: boolean;
}

const StatCardSkeleton = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            <div className="h-4 w-4 animate-pulse rounded bg-slate-200" />
        </CardHeader>
        <CardContent>
            <div className="h-8 w-20 animate-pulse rounded bg-slate-200" />
        </CardContent>
    </Card>
);

export function StatsCards({ stats, isLoading = false }: StatsCardsProps) {
    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    const totalAlerts =
        stats.activeAlerts.critical +
        stats.activeAlerts.high +
        stats.activeAlerts.warning +
        stats.activeAlerts.info;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Total Sites */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
                    <Zap className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSites}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {stats.onlineSites} online · {stats.offlineSites} offline
                    </p>
                </CardContent>
            </Card>

            {/* Health Score */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fleet Health</CardTitle>
                    <Gauge className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold">{stats.healthScore}</span>
                        <span className="text-sm text-slate-500">/100</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all",
                                stats.healthScore >= 70
                                    ? "bg-emerald-500"
                                    : stats.healthScore >= 50
                                        ? "bg-amber-500"
                                        : "bg-red-500"
                            )}
                            style={{ width: `${stats.healthScore}%` }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Active Alerts */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalAlerts}</div>
                    <div className="flex gap-2 text-xs">
                        {stats.activeAlerts.critical > 0 && (
                            <span className="text-red-600 dark:text-red-400">
                                🔴 {stats.activeAlerts.critical}
                            </span>
                        )}
                        {stats.activeAlerts.high > 0 && (
                            <span className="text-orange-600 dark:text-orange-400">
                                🟠 {stats.activeAlerts.high}
                            </span>
                        )}
                        {stats.activeAlerts.warning > 0 && (
                            <span className="text-amber-600 dark:text-amber-400">
                                🟡 {stats.activeAlerts.warning}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Sites by Status */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Site Status</CardTitle>
                    <Activity className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {stats.sitesByStatus.nominal}
                        </span>
                        <span className="text-sm text-slate-500">Nominal</span>
                    </div>
                    <div className="flex gap-3 text-xs">
                        <span className="text-amber-600 dark:text-amber-400">
                            🟡 {stats.sitesByStatus.alarm}
                        </span>
                        <span className="text-red-600 dark:text-red-400">
                            🔴 {stats.sitesByStatus.critical}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Avg Response Time */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
                    <Clock className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.averageResponseTime}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">minutes</p>
                </CardContent>
            </Card>
        </div>
    );
}