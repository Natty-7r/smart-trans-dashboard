"use client";

import { TransformerStatus } from "@/types/transformer.type";
import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/constants/transformer.contants";

interface TrafficLightIndicatorProps {
    status: TransformerStatus;
    label?: string;
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
    className?: string;
}

export function TrafficLightIndicator({
    status,
    label,
    size = "md",
    showLabel = true,
    className,
}: TrafficLightIndicatorProps) {
    const colors = STATUS_COLORS[status];
    const statusLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

    const sizeMap = {
        sm: {
            dot: "h-3 w-3",
            text: "text-xs",
            gap: "gap-1.5",
        },
        md: {
            dot: "h-4 w-4",
            text: "text-sm",
            gap: "gap-2",
        },
        lg: {
            dot: "h-5 w-5",
            text: "text-base",
            gap: "gap-2.5",
        },
    };

    const sizes = sizeMap[size];

    return (
        <div className={cn("inline-flex items-center", sizes.gap, className)}>
            <div
                className={cn(
                    "rounded-full",
                    sizes.dot,
                    status === "nominal" && "bg-emerald-500 animate-pulse",
                    status === "alarm" && "bg-amber-500",
                    status === "critical" && "bg-red-500 animate-pulse"
                )}
            />
            {showLabel && (
                <span
                    className={cn(
                        "font-medium",
                        sizes.text,
                        status === "nominal" && "text-emerald-700 dark:text-emerald-400",
                        status === "alarm" && "text-amber-700 dark:text-amber-400",
                        status === "critical" && "text-red-700 dark:text-red-400"
                    )}
                >
                    {statusLabel}
                </span>
            )}
        </div>
    );
}