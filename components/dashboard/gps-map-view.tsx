"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SiteLocation } from "@/types/transformer.type";
import { useEffect, useRef, useState } from "react";

interface GPSMapViewProps {
    locations: SiteLocation[];
    center?: { lat: number; lng: number };
    zoom?: number;
    showCard?: boolean;
    className?: string;
}

// Simple SVG-based map for demo (no external dependencies)
export function GPSMapView({
    locations,
    center = { lat: 9.03, lng: 38.74 },
    zoom = 11,
    showCard = true,
    className,
}: GPSMapViewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setDimensions({ width: rect.width, height: rect.height });
        }

        const handleResize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setDimensions({ width: rect.width, height: rect.height });
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Simple projection (Ethiopia centered)
    const projectPoint = (lat: number, lng: number) => {
        const centerLat = 9.03;
        const centerLng = 38.74;
        const scale = 0.8;

        const x = (lng - centerLng) * 8 * scale + dimensions.width / 2;
        const y = (centerLat - lat) * 8 * scale + dimensions.height / 2;

        return { x, y };
    };

    const getStatusDotColor = (status: SiteLocation["status"]) => {
        const colors = {
            nominal: "bg-emerald-500",
            alarm: "bg-amber-500",
            critical: "bg-red-500 animate-pulse",
        };
        return colors[status];
    };

    const getStatusSize = (status: SiteLocation["status"]) => {
        const sizes = {
            nominal: 8,
            alarm: 10,
            critical: 12,
        };
        return sizes[status];
    };

    const content = (
        <div
            ref={containerRef}
            className={cn("relative h-[300px] w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800", className)}
        >
            {/* Grid pattern for map background */}
            <svg
                className="absolute inset-0 h-full w-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern
                        id="grid"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke="hsl(var(--muted))"
                            strokeWidth="0.5"
                            opacity="0.3"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Map points */}
            {dimensions.width > 0 &&
                locations.map((location) => {
                    const { x, y } = projectPoint(location.latitude, location.longitude);
                    const dotSize = getStatusSize(location.status);
                    const dotColor = getStatusDotColor(location.status);

                    // Skip if point is outside visible area
                    if (
                        x < -50 ||
                        x > dimensions.width + 50 ||
                        y < -50 ||
                        y > dimensions.height + 50
                    ) {
                        return null;
                    }

                    return (
                        <div
                            key={location.id}
                            className="absolute group"
                            style={{
                                left: x - dotSize / 2,
                                top: y - dotSize / 2,
                                transform: "translate(0, 0)",
                            }}
                        >
                            {/* Pulse ring for critical */}
                            {location.status === "critical" && (
                                <div className="absolute inset-0 -m-2 rounded-full border-2 border-red-500 animate-ping" />
                            )}

                            {/* Dot */}
                            <div
                                className={cn(
                                    "relative rounded-full border-2 border-white shadow-lg transition-all duration-200 group-hover:scale-150",
                                    dotColor
                                )}
                                style={{
                                    width: dotSize,
                                    height: dotSize,
                                }}
                            />

                            {/* Tooltip on hover */}
                            <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100 dark:bg-white dark:text-slate-900">
                                <div className="font-medium">{location.name}</div>
                                <div className="text-[10px] opacity-75">
                                    Health: {location.healthScore}% · Alerts: {location.activeAlerts}
                                </div>
                            </div>
                        </div>
                    );
                })}

            {/* Map legend */}
            <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-2 text-xs shadow-lg dark:bg-slate-900/90">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-slate-600 dark:text-slate-300">Nominal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="text-slate-600 dark:text-slate-300">Alarm</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-slate-600 dark:text-slate-300">Critical</span>
                    </div>
                </div>
            </div>

            {/* Zoom controls */}
            <div className="absolute right-3 top-3 flex flex-col gap-0.5 rounded-lg bg-white shadow-lg dark:bg-slate-900">
                <button className="h-7 w-7 rounded-t-lg border-b border-slate-200 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                    +
                </button>
                <button className="h-7 w-7 rounded-b-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                    −
                </button>
            </div>

            {/* "For demo" watermark */}
            <div className="absolute bottom-3 right-3 text-[8px] text-slate-400">
                Demo Map
            </div>
        </div>
    );

    if (!showCard) return content;

    return (
        <Card className={className}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">📍 Site Map</CardTitle>
            </CardHeader>
            <CardContent className="p-0">{content}</CardContent>
        </Card>
    );
}