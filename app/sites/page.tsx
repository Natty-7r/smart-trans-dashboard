"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, LayoutGrid, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SiteTable } from "@/components/sites/site-table";
import { WorldMapView } from "@/components/sites/world-map-view";
import { SiteFiltersComponent } from "@/components/sites/site-filters";
import { AddSiteDialog } from "@/components/sites/add-site-dialog";
import { DEMO_SITES } from "@/data/sites.data";
import { SiteFilters } from "@/types/site.type";
import { useIsMobile } from "@/hooks/use-mobile";

type ViewMode = "table" | "map";

export default function SitesPage() {
    const router = useRouter();
    const isMobile = useIsMobile();
    const [viewMode, setViewMode] = useState<ViewMode>(isMobile ? "table" : "table");
    const [filters, setFilters] = useState<SiteFilters>({
        status: "all",
    });
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Filter sites
    const filteredSites = useMemo(() => {
        return DEMO_SITES.filter((site) => {
            // Search
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const match =
                    site.name.toLowerCase().includes(searchLower) ||
                    site.code.toLowerCase().includes(searchLower) ||
                    site.location.district.toLowerCase().includes(searchLower) ||
                    site.location.region.toLowerCase().includes(searchLower) ||
                    site.location.country.toLowerCase().includes(searchLower) ||
                    site.location.continent.toLowerCase().includes(searchLower);
                if (!match) return false;
            }

            // Status
            if (filters.status && filters.status !== "all") {
                if (site.status !== filters.status) return false;
            }

            // Continent
            if (filters.continent) {
                if (site.location.continent !== filters.continent) return false;
            }

            // Country
            if (filters.country) {
                if (site.location.country !== filters.country) return false;
            }

            // Region
            if (filters.region) {
                if (site.location.region !== filters.region) return false;
            }

            // District
            if (filters.district) {
                if (site.location.district !== filters.district) return false;
            }

            return true;
        });
    }, [filters]);

    const handleViewSite = (siteId: string) => {
        router.push(`/sites/${siteId}`);
    };

    const handleClearFilters = () => {
        setFilters({ status: "all" });
    };

    // Calculate map center based on filtered sites
    const mapCenter = useMemo(() => {
        if (filteredSites.length === 0) return [9.03, 38.74] as [number, number];
        const avgLat = filteredSites.reduce((acc, s) => acc + s.location.latitude, 0) / filteredSites.length;
        const avgLng = filteredSites.reduce((acc, s) => acc + s.location.longitude, 0) / filteredSites.length;
        return [avgLat, avgLng] as [number, number];
    }, [filteredSites]);

    // Build location object for map zoom
    const mapLocation = useMemo(() => ({
        continent: filters.continent,
        country: filters.country,
        region: filters.region,
        district: filters.district,
    }), [filters]);

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold md:text-2xl">Sites</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 md:text-sm">
                        Manage all transformer sites across your network
                    </p>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                    <ToggleGroup
                        type="single"
                        value={viewMode}
                        onValueChange={(value) => value && setViewMode(value as ViewMode)}
                        className="overflow-hidden rounded-md border"
                    >
                        <ToggleGroupItem value="table" aria-label="Table view" className="px-2 py-1 md:px-3 md:py-1.5">
                            <LayoutGrid className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="map" aria-label="Map view" className="px-2 py-1 md:px-3 md:py-1.5">
                            <MapIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <Button size={isMobile ? "sm" : "default"} onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="mr-1 h-3.5 w-3.5 md:mr-2 md:h-4 md:w-4" />
                        <span className="hidden xs:inline">Add</span>
                        <span className="xs:hidden">+</span>
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <SiteFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
            />

            {/* Results count */}
            <div className="text-xs text-slate-500 md:text-sm">
                Showing {filteredSites.length} of {DEMO_SITES.length} sites
                {filters.continent && ` in ${filters.continent}`}
                {filters.country && `, ${filters.country}`}
                {filters.region && `, ${filters.region}`}
                {filters.district && `, ${filters.district}`}
            </div>

            {/* View */}
            {viewMode === "table" ? (
                <SiteTable sites={filteredSites} onViewSite={handleViewSite} />
            ) : (
                <WorldMapView
                    sites={filteredSites}
                    onViewSite={handleViewSite}
                    center={mapCenter}
                    location={mapLocation}
                />
            )}

            {/* Add Site Dialog */}
            <AddSiteDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSuccess={() => {
                    setIsAddDialogOpen(false);
                }}
            />
        </div>
    );
}