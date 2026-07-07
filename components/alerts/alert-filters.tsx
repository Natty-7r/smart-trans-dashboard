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
import { Search, X, Filter, Calendar } from "lucide-react";
import {
  AlertFilters,
  AlertSeverity,
  AlertStatus,
  AlertType,
} from "@/types/alert.type";
import {
  SEVERITY_LABELS,
  STATUS_LABELS,
  ALERT_TYPE_LABELS,
} from "@/data/alerts.data";
import { cn } from "@/lib/utils";

interface AlertFiltersProps {
  filters: AlertFilters;
  onFiltersChange: (filters: AlertFilters) => void;
  onClearFilters: () => void;
}

export function AlertFiltersComponent({
  filters,
  onFiltersChange,
  onClearFilters,
}: AlertFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    filters.search ||
    filters.severity !== "all" ||
    filters.status !== "all" ||
    filters.type !== "all";

  const handleFilterChange = (key: keyof AlertFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const severityOptions: AlertSeverity[] = [
    "critical",
    "high",
    "warning",
    "info",
  ];
  const statusOptions: AlertStatus[] = ["active", "acknowledged", "resolved"];
  const typeOptions: AlertType[] = [
    "temperature",
    "current",
    "voltage",
    "oil",
    "gas",
    "vibration",
    "anti_theft",
    "cable_cut",
    "gps",
    "enclosure",
  ];

  return (
    <div className="space-y-3">
      {/* Search + quick filters */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <div className="relative flex-1 min-w-[120px]">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 md:h-4 md:w-4" />
          <Input
            placeholder="Search alerts..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="h-8 pl-8 text-sm md:h-11 md:pl-9"
          />
        </div>

        <Select
          value={filters.severity || "all"}
          onValueChange={(value) => handleFilterChange("severity", value)}
        >
          <SelectTrigger className="h-8 w-[100px] text-xs md:h-11 md:w-[140px] md:text-sm">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            {severityOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {SEVERITY_LABELS[s]}
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
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
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
          <Filter className="h-3.5 w-3.5 md:h-4 md:w-4" />
          <span className="hidden xs:inline">Filters</span>
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

      {/* Expanded filters */}
      {isExpanded && (
        <div className="grid gap-3 rounded-lg border bg-slate-50 p-3 dark:bg-slate-900/50 sm:grid-cols-2 md:grid-cols-3 md:p-4">
          {/* Type */}
          <div>
            <label className="text-xs font-medium text-slate-500">
              Alert Type
            </label>
            <Select
              value={filters.type || "all"}
              onValueChange={(value) =>
                handleFilterChange("type", value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="mt-1 h-8 text-xs md:h-11">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {typeOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {ALERT_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-xs font-medium text-slate-500">
              Date From
            </label>
            <Input
              type="date"
              value={filters.dateFrom || ""}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              className="mt-1 h-8 text-xs md:h-11"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500">
              Date To
            </label>
            <Input
              type="date"
              value={filters.dateTo || ""}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              className="mt-1 h-8 text-xs md:h-11"
            />
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
          {filters.severity && filters.severity !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Severity: {SEVERITY_LABELS[filters.severity]}
              <button
                onClick={() => handleFilterChange("severity", "all")}
                className="ml-1 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.status && filters.status !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {STATUS_LABELS[filters.status]}
              <button
                onClick={() => handleFilterChange("status", "all")}
                className="ml-1 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.type && filters.type !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Type: {ALERT_TYPE_LABELS[filters.type]}
              <button
                onClick={() => handleFilterChange("type", "all")}
                className="ml-1 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.dateFrom && (
            <Badge variant="secondary" className="gap-1">
              From: {new Date(filters.dateFrom).toLocaleDateString()}
              <button
                onClick={() => handleFilterChange("dateFrom", "")}
                className="ml-1 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.dateTo && (
            <Badge variant="secondary" className="gap-1">
              To: {new Date(filters.dateTo).toLocaleDateString()}
              <button
                onClick={() => handleFilterChange("dateTo", "")}
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
