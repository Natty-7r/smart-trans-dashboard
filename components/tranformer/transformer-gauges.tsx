"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Transformer, TransformerReading } from "@/types/transformer.type";

interface TransformerGaugesProps {
    readings: TransformerReading;
    transformer: Transformer;
}

export function TransformerGauges({ readings, transformer }: TransformerGaugesProps) {
    const gauges = [
        {
            label: "Oil Temperature",
            value: readings.temperature.oil,
            unit: "°C",
            max: 120,
            threshold: { alarm: 80, critical: 95 },
            status: getThresholdStatus(readings.temperature.oil, 80, 95),
            icon: "🌡️",
        },
        {
            label: "Load Current",
            value: readings.current.loadFactor,
            unit: "%",
            max: 150,
            threshold: { alarm: 80, critical: 110 },
            status: getThresholdStatus(readings.current.loadFactor, 80, 110),
            icon: "⚡",
        },
        {
            label: "Oil Level",
            value: readings.oil.level,
            unit: "%",
            max: 100,
            threshold: { alarm: 70, critical: 50 },
            status: getThresholdStatus(readings.oil.level, 70, 50, true),
            icon: "🛢️",
        },
        {
            label: "Hydrogen Gas",
            value: readings.gas.hydrogen,
            unit: "ppm",
            max: 100,
            threshold: { alarm: 15, critical: 30 },
            status: getThresholdStatus(readings.gas.hydrogen, 15, 30),
            icon: "💨",
        },
    ];

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

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gauges.map((gauge) => (
                <Card key={gauge.label}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{gauge.icon}</span>
                                <span className="text-sm font-medium">{gauge.label}</span>
                            </div>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "text-xs",
                                    gauge.status === "nominal" && "border-emerald-200 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400",
                                    gauge.status === "alarm" && "border-amber-200 text-amber-600 dark:border-amber-800 dark:text-amber-400",
                                    gauge.status === "critical" && "border-red-200 text-red-600 dark:border-red-800 dark:text-red-400"
                                )}
                            >
                                {gauge.status}
                            </Badge>
                        </div>

                        <div className="mt-2">
                            <div className="flex items-end justify-between">
                                <span className={cn("text-2xl font-bold", statusColors[gauge.status])}>
                                    {gauge.value.toFixed(1)}
                                    <span className="text-sm font-normal text-slate-400">{gauge.unit}</span>
                                </span>
                                <span className="text-xs text-slate-400">
                                    {gauge.status === "nominal" ? "✅ Normal" : gauge.status === "alarm" ? "⚠️ Alarm" : "🚨 Critical"}
                                </span>
                            </div>

                            <div className="mt-2">
                                <Progress
                                    value={(gauge.value / gauge.max) * 100}
                                    className="h-2"
                                // indicatorClassName={progressColors[gauge.status]}
                                />
                                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                                    <span>0</span>
                                    <span>Alarm: {gauge.threshold.alarm}</span>
                                    <span>Critical: {gauge.threshold.critical}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function getThresholdStatus(
    value: number,
    alarm: number,
    critical: number,
    reverse: boolean = false
): "nominal" | "alarm" | "critical" {
    if (reverse) {
        if (value < critical) return "critical";
        if (value < alarm) return "alarm";
        return "nominal";
    }
    if (value > critical) return "critical";
    if (value > alarm) return "alarm";
    return "nominal";
}