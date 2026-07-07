"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DEMO_ALERTS, getAlertStats } from "@/data/alerts.data";
import { AlertFilters } from "@/types/alert.type";
import { AlertFiltersComponent } from "@/components/alerts/alert-filters";
import { AlertStatsCards } from "@/components/alerts/alert-stats";
import { AlertTable } from "@/components/alerts/alert-table";

export default function AlertsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<AlertFilters>({
    severity: "all",
    status: "all",
    type: "all",
  });

  const stats = getAlertStats();

  const filteredAlerts = useMemo(() => {
    return DEMO_ALERTS.filter((alert) => {
      // Search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const match =
          alert.title.toLowerCase().includes(searchLower) ||
          alert.message.toLowerCase().includes(searchLower) ||
          alert.siteName.toLowerCase().includes(searchLower) ||
          alert.siteCode.toLowerCase().includes(searchLower);
        if (!match) return false;
      }

      // Severity
      if (filters.severity && filters.severity !== "all") {
        if (alert.severity !== filters.severity) return false;
      }

      // Status
      if (filters.status && filters.status !== "all") {
        if (alert.status !== filters.status) return false;
      }

      // Type
      if (filters.type && filters.type !== "all") {
        if (alert.type !== filters.type) return false;
      }

      // Date range
      if (filters.dateFrom) {
        if (new Date(alert.timestamp) < new Date(filters.dateFrom))
          return false;
      }
      if (filters.dateTo) {
        const endDate = new Date(filters.dateTo);
        endDate.setHours(23, 59, 59);
        if (new Date(alert.timestamp) > endDate) return false;
      }

      return true;
    });
  }, [filters]);

  const handleViewAlert = (alertId: string) => {
    router.push(`/alerts/${alertId}`);
  };

  const handleClearFilters = () => {
    setFilters({ severity: "all", status: "all", type: "all" });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold md:text-2xl">Alerts</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 md:text-sm">
          Manage and monitor all alerts across your transformer network
        </p>
      </div>

      {/* Stats */}
      <AlertStatsCards stats={stats} />

      {/* Filters */}
      <AlertFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Results count */}
      <div className="text-sm text-slate-500">
        Showing {filteredAlerts.length} of {DEMO_ALERTS.length} alerts
        {filters.severity &&
          filters.severity !== "all" &&
          ` (${filters.severity})`}
        {filters.status && filters.status !== "all" && ` • ${filters.status}`}
      </div>

      {/* Table */}
      <AlertTable alerts={filteredAlerts} onViewAlert={handleViewAlert} />
    </div>
  );
}
