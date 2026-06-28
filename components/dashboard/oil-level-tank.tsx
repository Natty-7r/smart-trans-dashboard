"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OilLevelTankProps {
    level: number; // Percentage
    pressure?: number;
    moisture?: number;
    threshold?: {
        alarm: number;
        critical: number;
    };
    showCard?: boolean;
    className?: string;
}

export function OilLevelTank({
    level,
    pressure,
    moisture,
    threshold = { alarm: 70, critical: 50 },
    showCard = true,
    className,
}: OilLevelTankProps) {
    const getStatus = (value: number) => {
        if (value < threshold.critical) return "critical";
        if (value < threshold.alarm) return "alarm";
        return "nominal";
    };

    const status = getStatus(level);

    const statusColors = {
        nominal: "text-emerald-600 dark:text-emerald-400",
        alarm: "text-amber-600 dark:text-amber-400",
        critical: "text-red-600 dark:text-red-400",
    };

    const tankColors = {
        nominal: "bg-emerald-500",
        alarm: "bg-amber-500",
        critical: "bg-red-500",
    };

    const fillHeight = Math.max(0, Math.min(100, level));

    const content = (
        <div className={cn("space-y-3", className)}>
            {/* Tank visualization */}
            <div className="relative mx-auto h-48 w-32 overflow-hidden rounded-b-lg rounded-t-lg border-2 border-slate-200 dark:border-slate-700">
                {/* Tank background */}
                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800" />

                {/* Oil fill */}
                <div
                    className={cn(
                        "absolute bottom-0 w-full transition-all duration-1000",
                        tankColors[status as keyof typeof tankColors]
                    )}
                    style={{
                        height: `${fillHeight}%`,
                    }}
                >
                    {/* Wave animation */}
                    <div className="absolute -top-1 h-2 w-full animate-wave overflow-hidden">
                        <div
                            className="h-full w-[200%] -translate-x-1/2"
                            style={{
                                background: `radial-gradient(ellipse at 50% 100%, ${status === "critical" ? "rgba(239,68,68,0.3)" : status === "alarm" ? "rgba(245,158,11,0.3)" : "rgba(34,197,94,0.3)"} 0%, transparent 70%)`,
                            }}
                        />
                    </div>
                </div>

                {/* Level label */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span
                        className={cn(
                            "text-2xl font-bold drop-shadow-lg",
                            level < 30 ? "text-white" : "text-slate-800 dark:text-white"
                        )}
                    >
                        {Math.round(level)}%
                    </span>
                </div>

                {/* Threshold markers */}
                <div
                    className="absolute left-0 right-0 border-t border-dashed border-amber-500 opacity-50"
                    style={{ bottom: `${threshold.alarm}%` }}
                >
                    <span className="absolute -right-12 -top-2.5 text-[8px] text-amber-500">
                        Alarm
                    </span>
                </div>
                <div
                    className="absolute left-0 right-0 border-t border-dashed border-red-500 opacity-50"
                    style={{ bottom: `${threshold.critical}%` }}
                >
                    <span className="absolute -right-12 -top-2.5 text-[8px] text-red-500">
                        Critical
                    </span>
                </div>
            </div>

            {/* Details */}
            <div className="flex justify-between text-sm">
                <div>
                    <span className="text-slate-400">Level</span>
                    <p className={cn("font-bold", statusColors[status])}>{level}%</p>
                </div>
                {pressure !== undefined && (
                    <div>
                        <span className="text-slate-400">Pressure</span>
                        <p className="font-bold">{pressure.toFixed(1)} PSI</p>
                    </div>
                )}
                {moisture !== undefined && (
                    <div>
                        <span className="text-slate-400">Moisture</span>
                        <p className="font-bold">{moisture} ppm</p>
                    </div>
                )}
            </div>

            {/* Status badge */}
            <div className="flex justify-end">
                <span
                    className={cn(
                        "text-xs font-medium",
                        statusColors[status as keyof typeof statusColors]
                    )}
                >
                    {status === "nominal" && "✅ Normal Level"}
                    {status === "alarm" && "⚠️ Low Oil"}
                    {status === "critical" && "🚨 Critical Low"}
                </span>
            </div>
        </div>
    );

    if (!showCard) return content;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Oil Level</CardTitle>
            </CardHeader>
            <CardContent>{content}</CardContent>
        </Card>
    );
}

// Add this to globals.css for wave animation:
// @keyframes wave {
//   0% { transform: translateX(0); }
//   100% { transform: translateX(-50%); }
// }
// .animate-wave {
//   animation: wave 3s ease-in-out infinite;
// }