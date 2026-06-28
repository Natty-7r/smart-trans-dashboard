"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TemperatureGaugeProps {
    temperature: number;
    threshold?: {
        alarm: number;
        critical: number;
    };
    label?: string;
    unit?: string;
    showCard?: boolean;
    className?: string;
}

export function TemperatureGauge({
    temperature,
    threshold = { alarm: 80, critical: 95 },
    label = "Oil Temperature",
    unit = "°C",
    showCard = true,
    className,
}: TemperatureGaugeProps) {
    const maxValue = 120;
    const percentage = Math.min((temperature / maxValue) * 100, 100);

    const getStatus = (temp: number) => {
        if (temp >= threshold.critical) return "critical";
        if (temp >= threshold.alarm) return "alarm";
        return "nominal";
    };

    const status = getStatus(temperature);

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

    const gaugeContent = (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {label}
                </span>
                <span
                    className={cn(
                        "text-2xl font-bold",
                        statusColors[status as keyof typeof statusColors]
                    )}
                >
                    {temperature}
                    <span className="text-sm font-normal text-slate-400">{unit}</span>
                </span>
            </div>

            {/* Gauge bar */}
            <div className="relative">
                <Progress
                    value={percentage}
                    className="h-3 w-full"
                // indicatorClassName={progressColors[status as keyof typeof progressColors]}
                />

                {/* Threshold markers */}
                <div className="relative h-0">
                    <div
                        className="absolute -top-3 h-4 w-px bg-amber-500"
                        style={{ left: `${(threshold.alarm / maxValue) * 100}%` }}
                    >
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-amber-500">
                            Alarm
                        </span>
                    </div>
                    <div
                        className="absolute -top-3 h-4 w-px bg-red-500"
                        style={{ left: `${(threshold.critical / maxValue) * 100}%` }}
                    >
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-red-500">
                            Critical
                        </span>
                    </div>
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
                    {status === "nominal" && "✅ Nominal"}
                    {status === "alarm" && "⚠️ Alarm"}
                    {status === "critical" && "🚨 Critical"}
                </span>
            </div>
        </div>
    );

    if (!showCard) return gaugeContent;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Temperature Monitor</CardTitle>
            </CardHeader>
            <CardContent>{gaugeContent}</CardContent>
        </Card>
    );
}