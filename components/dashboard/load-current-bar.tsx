"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LoadCurrentBarProps {
    loadFactor: number; // Percentage
    ratedCurrent: number;
    phaseA: number;
    phaseB: number;
    phaseC: number;
    threshold?: {
        alarm: number;
        critical: number;
    };
    showCard?: boolean;
    className?: string;
}

export function LoadCurrentBar({
    loadFactor,
    ratedCurrent,
    phaseA,
    phaseB,
    phaseC,
    threshold = { alarm: 80, critical: 110 },
    showCard = true,
    className,
}: LoadCurrentBarProps) {
    const getStatus = (load: number) => {
        if (load >= threshold.critical) return "critical";
        if (load >= threshold.alarm) return "alarm";
        return "nominal";
    };

    const status = getStatus(loadFactor);

    const statusColors = {
        nominal: "text-emerald-600 dark:text-emerald-400",
        alarm: "text-amber-600 dark:text-amber-400",
        critical: "text-red-600 dark:text-red-400",
    };

    const progressColors = {
        nominal: "bg-emerald-500",
        alarm: "bg-amber-500",
        critical: "bg-red-500",
    };

    const getPhaseColor = (value: number) => {
        const phaseLoad = (value / ratedCurrent) * 100;
        if (phaseLoad >= threshold.critical) return "text-red-500";
        if (phaseLoad >= threshold.alarm) return "text-amber-500";
        return "text-emerald-500";
    };

    const content = (
        <div className={cn("space-y-3", className)}>
            {/* Overall Load */}
            <div>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        Total Load
                    </span>
                    <span
                        className={cn(
                            "text-2xl font-bold",
                            statusColors[status as keyof typeof statusColors]
                        )}
                    >
                        {Math.round(loadFactor)}%
                    </span>
                </div>
                <Progress
                    value={loadFactor}
                    className="h-3 w-full"
                // indicatorClassName={progressColors[status as keyof typeof progressColors]}
                />
                <div className="mt-1 flex justify-between text-xs text-slate-400">
                    <span>0%</span>
                    <span>Alarm: {threshold.alarm}%</span>
                    <span>Critical: {threshold.critical}%</span>
                </div>
            </div>

            {/* Phase details */}
            <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800">
                    <span className="text-xs text-slate-400">Phase A</span>
                    <p className={cn("text-sm font-bold", getPhaseColor(phaseA))}>
                        {Math.round((phaseA / ratedCurrent) * 100)}%
                    </p>
                    <span className="text-xs text-slate-400">{Math.round(phaseA)}A</span>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800">
                    <span className="text-xs text-slate-400">Phase B</span>
                    <p className={cn("text-sm font-bold", getPhaseColor(phaseB))}>
                        {Math.round((phaseB / ratedCurrent) * 100)}%
                    </p>
                    <span className="text-xs text-slate-400">{Math.round(phaseB)}A</span>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800">
                    <span className="text-xs text-slate-400">Phase C</span>
                    <p className={cn("text-sm font-bold", getPhaseColor(phaseC))}>
                        {Math.round((phaseC / ratedCurrent) * 100)}%
                    </p>
                    <span className="text-xs text-slate-400">{Math.round(phaseC)}A</span>
                </div>
            </div>

            {/* Status badge */}
            <div className="flex justify-end">
                <span
                    className={cn(
                        "text-xs font-medium",
                        statusColors[status as keyof typeof statusColors]
                    )}
                >
                    {status === "nominal" && "✅ Normal Load"}
                    {status === "alarm" && "⚠️ High Load"}
                    {status === "critical" && "🚨 Overload"}
                </span>
            </div>
        </div>
    );

    if (!showCard) return content;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Load Current</CardTitle>
            </CardHeader>
            <CardContent>{content}</CardContent>
        </Card>
    );
}