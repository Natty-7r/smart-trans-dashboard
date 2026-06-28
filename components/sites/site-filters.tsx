"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter, Globe } from "lucide-react";
import { SiteFilters, SiteStatus } from "@/types/site.type";
import {
    getUniqueContinents,
    getUniqueCountries,
    getUniqueRegions,
    getUniqueDistricts,
    getCountriesByContinent,
    getRegionsByCountry,
} from "@/data/sites.data";
import { cn } from "@/lib/utils";

interface SiteFiltersProps {
    filters: SiteFilters;
    onFiltersChange: (filters: SiteFilters) => void;
    onClearFilters: () => void;
}

export function SiteFiltersComponent({
    filters,
    onFiltersChange,
    onClearFilters,
}: SiteFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const continents = getUniqueContinents();
    const countries = getUniqueCountries();
    const regions = getUniqueRegions();
    const districts = getUniqueDistricts();

    // Dynamic filters based on selection
    const [availableCountries, setAvailableCountries] = useState<string[]>(countries);
    const [availableRegions, setAvailableRegions] = useState<string[]>(regions);
    const [availableDistricts, setAvailableDistricts] = useState<string[]>(districts);

    // Update available options when continent/country changes
    useEffect(() => {
        if (filters.continent) {
            const filteredCountries = getCountriesByContinent(filters.continent);
            setAvailableCountries(filteredCountries);
            // If selected country is not in the filtered list, clear it
            if (filters.country && !filteredCountries.includes(filters.country)) {
                onFiltersChange({ ...filters, country: undefined });
            }
        } else {
            setAvailableCountries(countries);
        }
    }, [filters.continent]);

    useEffect(() => {
        if (filters.country) {
            const filteredRegions = getRegionsByCountry(filters.country);
            setAvailableRegions(filteredRegions);
            if (filters.region && !filteredRegions.includes(filters.region)) {
                onFiltersChange({ ...filters, region: undefined });
            }
        } else {
            setAvailableRegions(regions);
        }
    }, [filters.country]);

    const hasActiveFilters =
        filters.search ||
        filters.status !== "all" ||
        filters.continent ||
        filters.country ||
        filters.region ||
        filters.district;

    const handleFilterChange = (key: keyof SiteFilters, value: any) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    return (
        <div className="space-y-3">
            {/* Search + quick filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search sites by name, code, or location..."
                        value={filters.search || ""}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Select
                    value={filters.status || "all"}
                    onValueChange={(value) => handleFilterChange("status", value)}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="nominal">🟢 Nominal</SelectItem>
                        <SelectItem value="alarm">🟡 Alarm</SelectItem>
                        <SelectItem value="critical">🔴 Critical</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant={isExpanded ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn("gap-1.5", isExpanded && "bg-emerald-600 hover:bg-emerald-700")}
                >
                    <Globe className="h-4 w-4" />
                    Filters
                </Button>

                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={onClearFilters}>
                        <X className="mr-1 h-3 w-3" />
                        Clear All
                    </Button>
                )}
            </div>

            {/* Expanded filters */}
            {isExpanded && (
                <div className="grid gap-3 rounded-lg border bg-slate-50 p-4 dark:bg-slate-900/50 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Continent */}
                    <div>
                        <label className="text-xs font-medium text-slate-500">Continent</label>
                        <Select
                            value={filters.continent || "all"}
                            onValueChange={(value) => handleFilterChange("continent", value === "all" ? undefined : value)}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="All Continents" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Continents</SelectItem>
                                {continents.map((continent) => (
                                    <SelectItem key={continent} value={continent}>
                                        {continent}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Country */}
                    <div>
                        <label className="text-xs font-medium text-slate-500">Country</label>
                        <Select
                            value={filters.country || "all"}
                            onValueChange={(value) => handleFilterChange("country", value === "all" ? undefined : value)}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="All Countries" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Countries</SelectItem>
                                {availableCountries.map((country) => (
                                    <SelectItem key={country} value={country}>
                                        {country}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Region */}
                    <div>
                        <label className="text-xs font-medium text-slate-500">Region</label>
                        <Select
                            value={filters.region || "all"}
                            onValueChange={(value) => handleFilterChange("region", value === "all" ? undefined : value)}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="All Regions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Regions</SelectItem>
                                {availableRegions.map((region) => (
                                    <SelectItem key={region} value={region}>
                                        {region}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* District */}
                    <div>
                        <label className="text-xs font-medium text-slate-500">District</label>
                        <Select
                            value={filters.district || "all"}
                            onValueChange={(value) => handleFilterChange("district", value === "all" ? undefined : value)}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="All Districts" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Districts</SelectItem>
                                {districts.map((district) => (
                                    <SelectItem key={district} value={district}>
                                        {district}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Active filter badges */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-1.5">
                    {filters.search && (
                        <Badge variant="secondary" className="gap-1">
                            Search: {filters.search}
                            <button
                                onClick={() => handleFilterChange("search", "")}
                                className="ml-1 hover:text-slate-700"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {filters.status && filters.status !== "all" && (
                        <Badge variant="secondary" className="gap-1">
                            Status: {filters.status}
                            <button
                                onClick={() => handleFilterChange("status", "all")}
                                className="ml-1 hover:text-slate-700"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {filters.continent && (
                        <Badge variant="secondary" className="gap-1">
                            🌍 {filters.continent}
                            <button
                                onClick={() => handleFilterChange("continent", undefined)}
                                className="ml-1 hover:text-slate-700"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {filters.country && (
                        <Badge variant="secondary" className="gap-1">
                            📍 {filters.country}
                            <button
                                onClick={() => handleFilterChange("country", undefined)}
                                className="ml-1 hover:text-slate-700"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {filters.region && (
                        <Badge variant="secondary" className="gap-1">
                            🏙️ {filters.region}
                            <button
                                onClick={() => handleFilterChange("region", undefined)}
                                className="ml-1 hover:text-slate-700"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {filters.district && (
                        <Badge variant="secondary" className="gap-1">
                            📌 {filters.district}
                            <button
                                onClick={() => handleFilterChange("district", undefined)}
                                className="ml-1 hover:text-slate-700"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}