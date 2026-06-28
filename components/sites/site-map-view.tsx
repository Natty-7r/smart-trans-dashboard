"use client";

import { Site } from "@/types/site.type";
import { useEffect, useRef, useState } from "react";
import { SiteMapPreview } from "./site-map-preview";

interface SiteMapViewProps {
    sites: Site[];
    onViewSite?: (siteId: string) => void;
    center?: { lat: number; lng: number };
    zoom?: number;
}

export function SiteMapView({
    sites,
    onViewSite,
    center = { lat: 9.03, lng: 38.74 },
    zoom = 11,
}: SiteMapViewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);
    const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);

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

    // Simple projection with better spread
    const projectPoint = (lat: number, lng: number) => {
        const centerLat = center.lat || 9.03;
        const centerLng = center.lng || 38.74;
        const scale = 1.2; // Increased for more spread

        const x = (lng - centerLng) * 14 * scale + dimensions.width / 2;
        const y = (centerLat - lat) * 14 * scale + dimensions.height / 2;

        return { x, y };
    };

    const getStatusColor = (status: Site["status"]) => {
        const colors = {
            nominal: "#22C55E",
            alarm: "#F59E0B",
            critical: "#EF4444",
        };
        return colors[status];
    };

    const getStatusSize = (status: Site["status"]) => {
        const sizes = {
            nominal: 10,
            alarm: 14,
            critical: 18,
        };
        return sizes[status];
    };

    const handleSiteClick = (site: Site, event: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;

            // Keep preview inside bounds
            x = Math.min(Math.max(x, 20), dimensions.width - 300);
            y = Math.min(Math.max(y, 20), dimensions.height - 250);

            setPreviewPosition({ x, y });
        }
        setSelectedSite(site);
    };

    const handleClosePreview = () => {
        setSelectedSite(null);
        setPreviewPosition(null);
    };

    // Debug: Log site coordinates
    console.log("Sites on map:", sites.map(s => ({
        name: s.name,
        lat: s.location.latitude,
        lng: s.location.longitude
    })));

    if (dimensions.width === 0) {
        return (
            <div ref={containerRef} className="relative h-[500px] w-full rounded-lg bg-slate-100 dark:bg-slate-800">
                <div className="flex h-full items-center justify-center">
                    <p className="text-slate-400">Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative" ref={containerRef}>
            <div
                className="relative h-[500px] w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800"
            >
                {/* Grid pattern */}
                <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="site-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(var(--muted))" strokeWidth="0.5" opacity="0.3" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#site-grid)" />
                </svg>

                {/* Sites on map */}
                {sites.map((site) => {
                    const { x, y } = projectPoint(site.location.latitude, site.location.longitude);
                    const size = getStatusSize(site.status);
                    const color = getStatusColor(site.status);

                    // Skip if point is outside visible area (with margin)
                    if (x < -50 || x > dimensions.width + 50 || y < -50 || y > dimensions.height + 50) {
                        return null;
                    }

                    const isSelected = selectedSite?.id === site.id;

                    return (
                        <div
                            key={site.id}
                            className="absolute group cursor-pointer transition-transform hover:scale-110"
                            style={{
                                left: x - size / 2,
                                top: y - size / 2,
                                transform: isSelected ? "scale(1.2)" : "scale(1)",
                                zIndex: isSelected ? 10 : 1,
                            }}
                            onClick={(e) => handleSiteClick(site, e)}
                        >
                            {/* Pulse ring for critical */}
                            {site.status === "critical" && (
                                <div className="absolute inset-0 -m-3 rounded-full border-2 border-red-500 animate-ping" />
                            )}

                            {/* Dot */}
                            <div
                                className="rounded-full border-2 border-white shadow-lg transition-all group-hover:shadow-xl"
                                style={{
                                    width: size,
                                    height: size,
                                    backgroundColor: color,
                                    boxShadow: isSelected ? `0 0 20px ${color}` : "0 2px 8px rgba(0,0,0,0.15)",
                                }}
                            />

                            {/* Site code label */}
                            <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[8px] font-medium text-slate-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-300">
                                {site.code}
                            </div>
                        </div>
                    );
                })}

                {/* Map controls */}
                <div className="absolute right-3 top-3 flex flex-col gap-0.5 rounded-lg bg-white shadow-lg dark:bg-slate-900">
                    <button className="h-7 w-7 rounded-t-lg border-b border-slate-200 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                        +
                    </button>
                    <button className="h-7 w-7 rounded-b-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                        −
                    </button>
                </div>

                {/* Legend */}
                <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-2 text-xs shadow-lg dark:bg-slate-900/90">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            <span className="text-slate-600 dark:text-slate-300">Nominal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                            <span className="text-slate-600 dark:text-slate-300">Alarm</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-slate-600 dark:text-slate-300">Critical</span>
                        </div>
                    </div>
                </div>

                {/* Preview card */}
                {selectedSite && previewPosition && (
                    <div
                        className="absolute z-20"
                        style={{
                            left: Math.min(previewPosition.x, dimensions.width - 280),
                            top: Math.min(previewPosition.y, dimensions.height - 220),
                        }}
                    >
                        <div className="relative">
                            <button
                                onClick={handleClosePreview}
                                className="absolute -right-2 -top-2 z-30 rounded-full bg-slate-800 p-0.5 text-white hover:bg-slate-700"
                            >
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <SiteMapPreview
                                site={{
                                    id: selectedSite.id,
                                    name: selectedSite.name,
                                    code: selectedSite.code,
                                    status: selectedSite.status,
                                    healthScore: selectedSite.healthScore,
                                    activeAlerts: selectedSite.activeAlerts,
                                    location: {
                                        latitude: selectedSite.location.latitude,
                                        longitude: selectedSite.location.longitude,
                                        district: selectedSite.location.district,
                                        region: selectedSite.location.region,
                                    },
                                    transformerCount: selectedSite.transformers.length,
                                    technicianCount: selectedSite.technicians.length,
                                }}
                                onViewDetails={() => {
                                    handleClosePreview();
                                    if (onViewSite) onViewSite(selectedSite.id);
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Count */}
                <div className="absolute bottom-3 right-3 text-[8px] text-slate-400">
                    {sites.length} sites · {center.lat.toFixed(2)}, {center.lng.toFixed(2)}
                </div>
            </div>
        </div>
    );
}