"use client";

import { AntiTheftStatus } from "@/types/transformer.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ANTITHEFT_COLORS } from "@/constants/transformer.contants";

interface AntiTheftWidgetProps {
    status: AntiTheftStatus;
    enclosureClosed: boolean;
    gps: { latitude: number; longitude: number };
    lastMovement: string;
    showCard?: boolean;
    className?: string;
}

export function AntiTheftWidget({
    status,
    enclosureClosed,
    gps,
    lastMovement,
    showCard = true,
    className,
}: AntiTheftWidgetProps) {
    const colors = ANTITHEFT_COLORS[status];
    const timeAgo = new Date(lastMovement).toLocaleString();

    const content = (
        <div className={cn("space-y-3", className)}>
            {/* Status header */}
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full text-2xl",
                        colors.bg
                    )}
                >
                    {colors.icon}
                </div>
                <div>
                    <p className={cn("text-lg font-bold", colors.text)}>{colors.label}</p>
                    <p className="text-xs text-slate-400">
                        Last movement: {timeAgo}
                    </p>
                </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <div>
                    <p className="text-xs text-slate-400">Enclosure</p>
                    <p className="text-sm font-medium">
                        {enclosureClosed ? "🔒 Closed" : "🚪 Open"}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-400">GPS Location</p>
                    <p className="text-sm font-medium">
                        {gps.latitude.toFixed(4)}, {gps.longitude.toFixed(4)}
                    </p>
                </div>
            </div>

            {/* Status indicators */}
            <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                    <span
                        className={cn(
                            "h-2 w-2 rounded-full",
                            status === "secure" && "bg-emerald-500",
                            status === "tamper_warning" && "bg-amber-500 animate-pulse",
                            status === "intrusion" && "bg-red-500 animate-pulse"
                        )}
                    />
                    <span className="text-xs text-slate-500">Live</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-500">GPS Locked</span>
                </div>
            </div>
        </div>
    );

    if (!showCard) return content;

    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">🔐 Anti-Theft Status</CardTitle>
            </CardHeader>
            <CardContent>{content}</CardContent>
        </Card>
    );
}