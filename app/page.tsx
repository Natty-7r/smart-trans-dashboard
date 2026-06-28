"use client";

import { useState } from "react";

import { TrafficLightIndicator } from "@/components/dashboard/traffic-light-indicator";
import { TemperatureGauge } from "@/components/dashboard/temperature-gauge";
import { LoadCurrentBar } from "@/components/dashboard/load-current-bar";
import { OilLevelTank } from "@/components/dashboard/oil-level-tank";
import { GasTrendChart } from "@/components/dashboard/gas-trend-chart";
import { EventLogTable } from "@/components/dashboard/event-log-table";
import { AntiTheftWidget } from "@/components/dashboard/anti-theft-widget";
import { VibrationTrendGraph } from "@/components/dashboard/vibration-trend-graph";
import { VoltageLineChart } from "@/components/dashboard/voltage-line-chart";
import { GPSMapView } from "@/components/dashboard/gps-map-view";
import { SecurityEventLog } from "@/components/dashboard/security-event-log";
import { CableCutInstantAlert } from "@/components/dashboard/cable-cut-alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Bell,
  BellOff,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTimeAgo } from "@/utils/transfomer.util";
import { useDashboardData } from "@/hooks/use-dashboard";
import { useSocket } from "@/hooks/use-hook";
import { StatsCards } from "@/components/dashboard/stats-card";

export default function DashboardPage() {
  const {
    sites,
    stats,
    alerts,
    eventLog,
    locations,
    isLoading,
    error,
    refresh,
  } = useDashboardData();

  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(
    sites.length > 0 ? sites[0].id : null
  );
  const [showCableCutAlert, setShowCableCutAlert] = useState(true);

  // WebSocket for real-time updates
  const { isConnected } = useSocket({
    onMessage: (data) => {
      console.log("WebSocket message:", data);
      // In real app, update data here
    },
  });

  // Get selected site
  const selectedSite = sites.find((s) => s.id === selectedSiteId);

  // Critical alerts count
  const criticalAlerts = alerts.filter((a) => a.severity === "critical" && !a.resolved);
  const highAlerts = alerts.filter((a) => a.severity === "high" && !a.resolved);

  // Handle cable cut dismiss
  const handleCableCutDismiss = () => {
    setShowCableCutAlert(false);
  };

  // Handle cable cut dispatch
  const handleCableCutDispatch = () => {
    console.log("Dispatching team to cable cut site");
    // In real app, trigger dispatch API
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
          <p className="mt-2 text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-red-500" />
          <p className="mt-2 text-sm text-red-500">Error loading data: {error}</p>
          <Button onClick={refresh} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cable Cut Instant Alert */}
      {showCableCutAlert && (
        <CableCutInstantAlert
          siteId="ADD-056"
          siteName="Mexico Roundabout"
          location="Mexico, Addis Ababa"
          timestamp={new Date(Date.now() - 900000).toISOString()}
          onDismiss={handleCableCutDismiss}
          onDispatch={handleCableCutDispatch}
          autoDispatch={false}
        />
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time transformer monitoring overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={cn(
              "gap-1.5",
              isConnected
                ? "border-emerald-500 text-emerald-600"
                : "border-red-500 text-red-600"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              )}
            />
            {isConnected ? "Live" : "Disconnected"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} isLoading={isLoading} />

      {/* Alerts Summary */}
      {(criticalAlerts.length > 0 || highAlerts.length > 0) && (
        <div className="flex flex-wrap gap-3">
          {criticalAlerts.length > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 dark:bg-red-950/30">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
          {highAlerts.length > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-2 dark:bg-orange-950/30">
              <Bell className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                {highAlerts.length} High Alert{highAlerts.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/* TAB 1: OVERVIEW */}
        {/* ============================================================ */}
        <TabsContent value="overview" className="space-y-4">
          {/* Site Selection */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Selected Site:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sites.slice(0, 8).map((site) => (
                <Button
                  key={site.id}
                  variant={selectedSiteId === site.id ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "gap-1.5 text-xs",
                    selectedSiteId === site.id && "bg-emerald-600 hover:bg-emerald-700"
                  )}
                  onClick={() => setSelectedSiteId(site.id)}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      site.status === "nominal" && "bg-emerald-500",
                      site.status === "alarm" && "bg-amber-500",
                      site.status === "critical" && "bg-red-500 animate-pulse"
                    )}
                  />
                  {site.name}
                </Button>
              ))}
              {sites.length > 8 && (
                <Button variant="outline" size="sm" className="text-xs">
                  +{sites.length - 8} more
                </Button>
              )}
            </div>
          </div>

          {/* Selected Site Details */}
          {selectedSite && (
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Left Column: Status + Gauges */}
              <div className="space-y-4 lg:col-span-2">
                {/* Status Header */}
                <Card>
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
                    <div className="flex items-center gap-4">
                      <TrafficLightIndicator
                        status={selectedSite.status}
                        size="lg"
                      />
                      <div>
                        <h2 className="text-lg font-bold">{selectedSite.name}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {selectedSite.type} · {selectedSite.location.district}, {selectedSite.location.region}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Health Score</p>
                        <p className="text-2xl font-bold">{selectedSite.healthScore}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Last Updated</p>
                        <p className="text-sm font-medium">
                          {formatTimeAgo(selectedSite.lastUpdated)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Gauges Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                  <TemperatureGauge
                    temperature={selectedSite.temperature.oilTemp}
                    threshold={{ alarm: 80, critical: 95 }}
                    label="Oil Temperature"
                    showCard={true}
                  />
                  <LoadCurrentBar
                    loadFactor={selectedSite.current.loadFactor}
                    ratedCurrent={selectedSite.current.ratedCurrent}
                    phaseA={selectedSite.current.phaseA}
                    phaseB={selectedSite.current.phaseB}
                    phaseC={selectedSite.current.phaseC}
                    threshold={{ alarm: 80, critical: 110 }}
                    showCard={true}
                  />
                </div>

                {/* Oil Level + Voltage */}
                <div className="grid gap-4 md:grid-cols-2">
                  <OilLevelTank
                    level={selectedSite.oil.level}
                    pressure={selectedSite.oil.pressure}
                    moisture={selectedSite.oil.moisture}
                    threshold={{ alarm: 70, critical: 50 }}
                    showCard={true}
                  />
                  <VoltageLineChart
                    data={Array.from({ length: 24 }, (_, i) => ({
                      timestamp: new Date(Date.now() - (23 - i) * 3600000).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      ),
                      primary: selectedSite.voltage.primary + (Math.random() - 0.5) * 0.6,
                      secondary: selectedSite.voltage.secondary + (Math.random() - 0.5) * 10,
                    }))}
                    showCard={true}
                  />
                </div>

                {/* Gas + Vibration Trends */}
                <div className="grid gap-4 md:grid-cols-2">
                  <GasTrendChart
                    data={Array.from({ length: 24 }, (_, i) => ({
                      timestamp: new Date(Date.now() - (23 - i) * 3600000).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      ),
                      hydrogen: selectedSite.gas.hydrogen * (0.5 + Math.random()),
                      methane: selectedSite.gas.methane * (0.5 + Math.random()),
                      ethane: selectedSite.gas.ethane * (0.5 + Math.random()),
                      ethylene: selectedSite.gas.ethylene * (0.5 + Math.random()),
                      acetylene: selectedSite.gas.acetylene * (0.5 + Math.random()),
                    }))}
                    showCard={true}
                  />
                  <VibrationTrendGraph
                    data={Array.from({ length: 24 }, (_, i) => ({
                      timestamp: new Date(Date.now() - (23 - i) * 3600000).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      ),
                      xAxis: selectedSite.vibration.xAxis * (0.5 + Math.random()),
                      yAxis: selectedSite.vibration.yAxis * (0.5 + Math.random()),
                      zAxis: selectedSite.vibration.zAxis * (0.5 + Math.random()),
                    }))}
                    showCard={true}
                  />
                </div>
              </div>

              {/* Right Column: Security + Alerts */}
              <div className="space-y-4">
                {/* Anti-Theft */}
                <AntiTheftWidget
                  status={selectedSite.antiTheft.status}
                  enclosureClosed={selectedSite.antiTheft.enclosureClosed}
                  gps={selectedSite.antiTheft.gps}
                  lastMovement={selectedSite.antiTheft.lastMovement}
                  showCard={true}
                />

                {/* Active Alerts for this site */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <Bell className="h-4 w-4" />
                      Active Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedSite.activeAlerts.length === 0 ? (
                      <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="h-4 w-4" />
                        No active alerts
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedSite.activeAlerts.map((alert) => (
                          <div
                            key={alert.id}
                            className={cn(
                              "flex items-start gap-2 rounded-lg p-2 text-sm",
                              alert.severity === "critical" && "bg-red-50 dark:bg-red-950/30",
                              alert.severity === "high" && "bg-orange-50 dark:bg-orange-950/30",
                              alert.severity === "warning" && "bg-amber-50 dark:bg-amber-950/30"
                            )}
                          >
                            <span className="mt-0.5">
                              {alert.severity === "critical" && "🔴"}
                              {alert.severity === "high" && "🟠"}
                              {alert.severity === "warning" && "🟡"}
                            </span>
                            <div className="flex-1">
                              <p className="font-medium">{alert.message}</p>
                              <p className="text-xs text-slate-500">
                                {formatTimeAgo(alert.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick actions */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      📊 View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      📋 Report Issue
                    </Button>
                    <Button variant="outline" size="sm">
                      📱 Contact Team
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Event Log */}
          <EventLogTable events={eventLog} maxRows={10} showCard={true} />
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 2: SITES */}
        {/* ============================================================ */}
        <TabsContent value="sites" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Map View */}
            <div className="lg:col-span-2">
              <GPSMapView locations={locations} showCard={true} />
            </div>

            {/* Site List */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">All Sites</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[400px] overflow-y-auto space-y-2">
                {sites.map((site) => (
                  <div
                    key={site.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800",
                      selectedSiteId === site.id && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                    )}
                    onClick={() => setSelectedSiteId(site.id)}
                  >
                    <div className="flex items-center gap-3">
                      <TrafficLightIndicator status={site.status} size="sm" showLabel={false} />
                      <div>
                        <p className="font-medium">{site.name}</p>
                        <p className="text-xs text-slate-500">
                          {site.type} · {site.location.district}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{site.healthScore}%</p>
                      <p className="text-xs text-slate-500">
                        {site.activeAlerts.length} alert{site.activeAlerts.length !== 1 && "s"}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Site details table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Site Details</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="pb-2 font-medium">Site</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Health</th>
                    <th className="pb-2 font-medium">Temp</th>
                    <th className="pb-2 font-medium">Load</th>
                    <th className="pb-2 font-medium">Oil</th>
                    <th className="pb-2 font-medium">Alerts</th>
                  </tr>
                </thead>
                <tbody>
                  {sites.map((site) => (
                    <tr key={site.id} className="border-b last:border-0">
                      <td className="py-2 font-medium">{site.name}</td>
                      <td className="py-2">{site.type}</td>
                      <td className="py-2">
                        <TrafficLightIndicator status={site.status} size="sm" showLabel={false} />
                      </td>
                      <td className="py-2">{site.healthScore}%</td>
                      <td className="py-2">{site.temperature.oilTemp}°C</td>
                      <td className="py-2">{site.current.loadFactor}%</td>
                      <td className="py-2">{site.oil.level}%</td>
                      <td className="py-2">{site.activeAlerts.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 3: ANALYTICS */}
        {/* ============================================================ */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <GasTrendChart
              data={Array.from({ length: 48 }, (_, i) => ({
                timestamp: new Date(Date.now() - (47 - i) * 3600000).toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit" }
                ),
                hydrogen: 5 + Math.random() * 40,
                methane: 2 + Math.random() * 20,
                ethane: 1 + Math.random() * 15,
                ethylene: 0.5 + Math.random() * 10,
                acetylene: 0 + Math.random() * 5,
              }))}
              showCard={true}
            />
            <VibrationTrendGraph
              data={Array.from({ length: 48 }, (_, i) => ({
                timestamp: new Date(Date.now() - (47 - i) * 3600000).toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit" }
                ),
                xAxis: 0.5 + Math.random() * 3.5,
                yAxis: 0.5 + Math.random() * 3.5,
                zAxis: 0.5 + Math.random() * 3.5,
              }))}
              showCard={true}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <VoltageLineChart
              data={Array.from({ length: 48 }, (_, i) => ({
                timestamp: new Date(Date.now() - (47 - i) * 3600000).toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit" }
                ),
                primary: 10.8 + Math.random() * 0.8,
                secondary: 400 + Math.random() * 20,
              }))}
              showCard={true}
            />
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Health Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-600">Nominal</span>
                      <span className="font-medium">{stats.sitesByStatus.nominal}</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{
                          width: `${(stats.sitesByStatus.nominal / stats.totalSites) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-600">Alarm</span>
                      <span className="font-medium">{stats.sitesByStatus.alarm}</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{
                          width: `${(stats.sitesByStatus.alarm / stats.totalSites) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">Critical</span>
                      <span className="font-medium">{stats.sitesByStatus.critical}</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full bg-red-500"
                        style={{
                          width: `${(stats.sitesByStatus.critical / stats.totalSites) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 4: SECURITY */}
        {/* ============================================================ */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <AntiTheftWidget
              status="secure"
              enclosureClosed={true}
              gps={{ latitude: 9.0056, longitude: 38.7636 }}
              lastMovement={new Date(Date.now() - 3600000).toISOString()}
              showCard={true}
            />
            <AntiTheftWidget
              status="tamper_warning"
              enclosureClosed={true}
              gps={{ latitude: 9.0156, longitude: 38.7736 }}
              lastMovement={new Date(Date.now() - 300000).toISOString()}
              showCard={true}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <AntiTheftWidget
              status="intrusion"
              enclosureClosed={false}
              gps={{ latitude: 9.0456, longitude: 38.8136 }}
              lastMovement={new Date(Date.now() - 900000).toISOString()}
              showCard={true}
            />
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Security Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Secure Sites</span>
                  <span className="font-medium text-emerald-600">3</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Tamper Warning</span>
                  <span className="font-medium text-amber-600">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Intrusion</span>
                  <span className="font-medium text-red-600">1</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <SecurityEventLog events={[]} maxRows={10} showCard={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}