"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Site } from "@/types/site.type";
import { Badge } from "@/components/ui/badge";
import { TrafficLightIndicator } from "@/components/dashboard/traffic-light-indicator";

// Dynamically import Leaflet components (no SSR)
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);
const ZoomControl = dynamic(
    () => import("react-leaflet").then((mod) => mod.ZoomControl),
    { ssr: false }
);

// Import CircleMarker and Popup normally (they work with dynamic)
import { CircleMarker, Popup, useMap } from "react-leaflet";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// ============================================================
// LOCATION BOUNDS
// ============================================================

const LOCATION_BOUNDS: Record<string, { center: [number, number]; zoom: number }> = {
    // Continents
    Africa: { center: [1.0, 20.0], zoom: 3 },
    Asia: { center: [34.0, 100.0], zoom: 3 },
    Europe: { center: [50.0, 10.0], zoom: 4 },
    "North America": { center: [45.0, -100.0], zoom: 3 },
    "South America": { center: [-15.0, -60.0], zoom: 3 },
    Oceania: { center: [-25.0, 135.0], zoom: 3 },

    // Countries - Africa
    Ethiopia: { center: [9.03, 38.74], zoom: 6 },
    Kenya: { center: [-1.29, 36.82], zoom: 6 },
    Tanzania: { center: [-6.37, 34.89], zoom: 6 },
    "South Africa": { center: [-30.56, 22.94], zoom: 5 },
    Egypt: { center: [26.82, 30.80], zoom: 5 },
    Nigeria: { center: [9.08, 8.68], zoom: 5 },
    Ghana: { center: [7.95, -1.02], zoom: 6 },
    Uganda: { center: [1.37, 32.29], zoom: 6 },

    // Regions - Ethiopia
    "Addis Ababa": { center: [9.03, 38.74], zoom: 10 },
    Oromia: { center: [7.54, 39.36], zoom: 7 },
    Amhara: { center: [11.5, 38.0], zoom: 7 },
    Tigray: { center: [13.5, 39.0], zoom: 7 },
    Sidama: { center: [6.7, 38.5], zoom: 7 },
    "Southern Nations": { center: [6.5, 37.5], zoom: 7 },
    Somali: { center: [7.0, 44.0], zoom: 7 },
    "Benishangul-Gumuz": { center: [10.5, 35.0], zoom: 7 },
    Gambela: { center: [8.0, 34.0], zoom: 7 },
    Harari: { center: [9.3, 42.1], zoom: 7 },
    Afar: { center: [11.5, 41.0], zoom: 7 },

    // Regions - Kenya
    Nairobi: { center: [-1.29, 36.82], zoom: 10 },
    Mombasa: { center: [-4.04, 39.66], zoom: 10 },
    Kisumu: { center: [-0.09, 34.76], zoom: 10 },

    // Regions - Tanzania
    "Dar es Salaam": { center: [-6.82, 39.27], zoom: 10 },
    Arusha: { center: [-3.37, 36.69], zoom: 10 },
    Dodoma: { center: [-6.16, 35.74], zoom: 10 },

    // Regions - South Africa
    Gauteng: { center: [-26.27, 28.11], zoom: 8 },
    "Western Cape": { center: [-33.92, 18.42], zoom: 8 },
    "KwaZulu-Natal": { center: [-29.6, 30.4], zoom: 8 },

    // Regions - Egypt
    Cairo: { center: [30.04, 31.24], zoom: 10 },

    // Regions - Nigeria
    Lagos: { center: [6.45, 3.40], zoom: 10 },
    Abuja: { center: [9.08, 7.40], zoom: 10 },

    // Districts - Ethiopia (Addis Ababa)
    Bole: { center: [9.01, 38.77], zoom: 12 },
    Kirkos: { center: [9.03, 38.79], zoom: 12 },
    Lideta: { center: [9.04, 38.80], zoom: 12 },
    Mexico: { center: [9.05, 38.81], zoom: 12 },
    Arada: { center: [9.06, 38.82], zoom: 12 },
    Gulele: { center: [9.07, 38.83], zoom: 12 },
    Yeka: { center: [9.08, 38.84], zoom: 12 },
    "Nifas Silk": { center: [9.02, 38.76], zoom: 12 },

    // Districts - Kenya
    Central: { center: [-1.29, 36.82], zoom: 13 },
    "Industrial Area": { center: [-1.30, 36.85], zoom: 13 },

    // Districts - Tanzania
    Ilala: { center: [-6.82, 39.27], zoom: 13 },
    Kinondoni: { center: [-6.80, 39.25], zoom: 13 },
    Temeke: { center: [-6.85, 39.30], zoom: 13 },

    // Districts - South Africa
    "Cape Town": { center: [-33.90, 18.41], zoom: 12 },
    "Green Point": { center: [-33.90, 18.41], zoom: 13 },
    Johannesburg: { center: [-26.20, 28.04], zoom: 12 },

    // Districts - Egypt
    Downtown: { center: [30.04, 31.24], zoom: 13 },

    // Districts - Nigeria
    "Lagos Island": { center: [6.45, 3.40], zoom: 13 },
};

// ============================================================
// MAP CONTROLLER COMPONENT (uses useMap directly)
// ============================================================

interface MapControllerProps {
    location: {
        continent?: string;
        country?: string;
        region?: string;
        district?: string;
    };
    sites: Site[];
}

function MapController({ location, sites }: MapControllerProps) {
    const map = useMap();

    useEffect(() => {
        const { continent, country, region, district } = location;

        // Priority: district > region > country > continent
        let locationKey = district || region || country || continent;

        if (locationKey) {
            const bounds = LOCATION_BOUNDS[locationKey];
            if (bounds) {
                map.setView(bounds.center, bounds.zoom, { animate: true });
                return;
            }
        }

        // If sites are filtered, fit to their bounds
        if (sites.length > 0) {
            const latLngs = sites.map((site) => ({
                lat: site.location.latitude,
                lng: site.location.longitude,
            }));

            if (latLngs.length === 1) {
                map.setView([latLngs[0].lat, latLngs[0].lng], 12, { animate: true });
            } else {
                const bounds = L.latLngBounds(latLngs);
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14, animate: true });
            }
        }
    }, [location, sites, map]);

    return null;
}

// ============================================================
// MAIN MAP COMPONENT
// ============================================================

interface WorldMapViewProps {
    sites: Site[];
    onViewSite?: (siteId: string) => void;
    center?: [number, number];
    zoom?: number;
    location?: {
        continent?: string;
        country?: string;
        region?: string;
        district?: string;
    };
}

export function WorldMapView({
    sites,
    onViewSite,
    center = [9.03, 38.74],
    zoom = 2,
    location = {},
}: WorldMapViewProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

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

    const handleSiteClick = (site: Site) => {
        if (onViewSite) {
            onViewSite(site.id);
        }
    };

    const locationLabel = [
        location.district,
        location.region,
        location.country,
        location.continent,
    ]
        .filter(Boolean)
        .join(", ");

    if (!isClient) {
        return (
            <div className="flex h-[600px] w-full items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500" />
                    <p className="mt-2 text-sm text-slate-500">Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-[600px] w-full overflow-hidden rounded-lg border shadow-sm">
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl position="bottomright" />

                <MapController location={location} sites={sites} />

                {sites.map((site) => {
                    const color = getStatusColor(site.status);
                    const size = getStatusSize(site.status);

                    return (
                        <CircleMarker
                            key={site.id}
                            center={[site.location.latitude, site.location.longitude]}
                            radius={size}
                            pathOptions={{
                                color: "white",
                                weight: 2,
                                fillColor: color,
                                fillOpacity: 0.9,
                            }}
                            eventHandlers={{
                                click: () => handleSiteClick(site),
                                mouseover: (e) => {
                                    e.target.openPopup();
                                },
                                mouseout: (e) => {
                                    e.target.closePopup();
                                },
                            }}
                        >
                            <Popup closeButton={false} className="min-w-[200px]">
                                <div className="space-y-1.5 p-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold">{site.name}</span>
                                        <TrafficLightIndicator status={site.status} size="sm" showLabel={false} />
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        <p>{site.code}</p>
                                        <p>
                                            {site.location.district}, {site.location.region}
                                        </p>
                                        <p>{site.location.country}</p>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs">
                                        <span>
                                            Health: <strong>{site.healthScore}%</strong>
                                        </span>
                                        <span>
                                            Alerts:{" "}
                                            <Badge
                                                variant={site.activeAlerts > 0 ? "destructive" : "outline"}
                                                className="px-1.5 text-xs"
                                            >
                                                {site.activeAlerts}
                                            </Badge>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-400">
                                        <span>{site.transformers.length} Transformers</span>
                                        <span>{site.technicians.length} Technicians</span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSiteClick(site);
                                        }}
                                        className="mt-1 w-full text-center text-xs text-emerald-600 hover:underline dark:text-emerald-400"
                                    >
                                        View Details →
                                    </button>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>

            {locationLabel && (
                <div className="absolute left-4 top-3 z-[1000] rounded-lg bg-white/90 px-3 py-1.5 text-xs shadow-lg dark:bg-slate-900/90">
                    <span className="font-medium">📍 {locationLabel}</span>
                </div>
            )}

            <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-white/90 px-3 py-2 text-xs shadow-lg dark:bg-slate-900/90">
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

            <div className="absolute right-3 top-3 z-[1000] rounded-lg bg-white/90 px-3 py-1.5 text-xs shadow-lg dark:bg-slate-900/90">
                <span className="font-medium">{sites.length}</span> sites shown
            </div>
        </div>
    );
}