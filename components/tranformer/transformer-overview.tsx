"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Transformer } from "@/types/transformer.type";
import {
    AlertTriangle,
    Calendar,
    Clock,
    Gauge,
    Wrench,
    Zap
} from "lucide-react";

interface TransformerOverviewProps {
    transformer: Transformer;
}

export function TransformerOverview({ transformer }: TransformerOverviewProps) {
    const stats = [
        {
            label: "Type",
            value: transformer.type,
            icon: Zap,
            color: "blue",
        },
        {
            label: "Capacity",
            value: `${transformer.capacity} KVA`,
            icon: Gauge,
            color: "emerald",
        },
        {
            label: "Health Score",
            value: `${transformer.healthScore}%`,
            icon: Gauge,
            color: transformer.healthScore >= 70 ? "emerald" : transformer.healthScore >= 50 ? "amber" : "red",
        },
        {
            label: "Installed",
            value: new Date(transformer.installedDate).toLocaleDateString(),
            icon: Calendar,
            color: "slate",
        },
        {
            label: "Expected Life",
            value: `${transformer.expectedLife} years`,
            icon: Clock,
            color: "slate",
        },
        {
            label: "Remaining Life",
            value: `${transformer.remainingLife} years`,
            icon: Clock,
            color: transformer.remainingLife >= 10 ? "emerald" : transformer.remainingLife >= 5 ? "amber" : "red",
        },
        {
            label: "Manufacturer",
            value: transformer.manufacturer,
            icon: Wrench,
            color: "slate",
        },
        {
            label: "Active Alerts",
            value: transformer.activeAlerts,
            icon: AlertTriangle,
            color: transformer.activeAlerts > 0 ? "red" : "emerald",
        },
    ];

    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
        emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
        amber: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
        red: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
        slate: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    };

    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardContent className="p-3 md:p-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-0.5">
                                <p className="text-[8px] font-medium uppercase tracking-wider text-slate-400 md:text-[10px]">
                                    {stat.label}
                                </p>
                                <p className="text-xs font-bold md:text-sm">{stat.value}</p>
                            </div>
                            <div className={cn("rounded-lg p-1", colorClasses[stat.color as keyof typeof colorClasses] || colorClasses.slate)}>
                                <stat.icon className="h-3 w-3" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

