"use client";

import { useState } from "react";
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
import {
  UserFilters,
  UserRole,
  UserStatus,
  ROLE_LABELS,
} from "@/types/user.type";
import {
  getUniqueCountries,
  getUniqueRegions,
  getUniqueDistricts,
} from "@/data/users.data";
import { cn } from "@/lib/utils";

interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  onClearFilters: () => void;
}

export function UserFiltersComponent({
  filters,
  onFiltersChange,
  onClearFilters,
}: UserFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const countries = getUniqueCountries();
  const regions = getUniqueRegions();
  const districts = getUniqueDistricts();

  const hasActiveFilters =
    filters.search ||
    filters.role !== "all" ||
    filters.status !== "all" ||
    filters.country ||
    filters.region ||
    filters.district;

  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const roleOptions: UserRole[] = [
    "admin",
    "country_manager",
    "regional_manager",
    "field_engineer",
    "technician",
    "viewer",
  ];
  const statusOptions: UserStatus[] = ["active", "suspended", "inactive"];

  return (
    <div className="space-y-3">
      {/* Search + quick filters */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <div className="relative flex-1 min-w-[120px]">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 md:h-4 md:w-4" />
          <Input
            placeholder="Search users by name, email, or location..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="h-8 pl-8 text-sm md:h-11 md:pl-9"
          />
        </div>

        <Select
          value={filters.role || "all"}
          onValueChange={(value) => handleFilterChange("role", value)}
        >
          <SelectTrigger className="h-8 w-[100px] text-xs md:h-11 md:w-[140px] md:text-sm">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roleOptions.map((role) => (
              <SelectItem key={role} value={role}>
                {ROLE_LABELS[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status || "all"}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="h-8 w-[100px] text-xs md:h-11 md:w-[140px] md:text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={isExpanded ? "default" : "outline"}
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "gap-1.5 h-8 md:h-11",
            isExpanded && "bg-emerald-600 hover:bg-emerald-700",
          )}
        >
          <Globe className="h-3.5 w-3.5 md:h-4 md:w-4" />
          <span className="hidden xs:inline">Location</span>
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 text-xs md:h-11 md:px-3 md:text-sm"
          >
            <X className="mr-1 h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden xs:inline">Clear</span>
          </Button>
        )}
      </div>

      {/* Expanded location filters */}
      {isExpanded && (
        <div className="grid gap-3 rounded-lg border bg-slate-50 p-3 dark:bg-slate-900/50 sm:grid-cols-2 md:grid-cols-3 md:p-4">
          <div>
            <label className="text-xs font-medium text-slate-500">
              Country
            </label>
            <Select
              value={filters.country || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "country",
                  value === "all" ? undefined : value,
                )
              }
            >
              <SelectTrigger className="mt-1 h-8 text-xs md:h-11">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">Region</label>
            <Select
              value={filters.region || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "region",
                  value === "all" ? undefined : value,
                )
              }
            >
              <SelectTrigger className="mt-1 h-8 text-xs md:h-11">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">
              District
            </label>
            <Select
              value={filters.district || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "district",
                  value === "all" ? undefined : value,
                )
              }
            >
              <SelectTrigger className="mt-1 h-8 text-xs md:h-11">
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
          {filters.role && filters.role !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Role: {ROLE_LABELS[filters.role]}
              <button
                onClick={() => handleFilterChange("role", "all")}
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
          {filters.country && (
            <Badge variant="secondary" className="gap-1">
              🌍 {filters.country}
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
              📍 {filters.region}
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
