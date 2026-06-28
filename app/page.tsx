"use client";

import { TrafficLightIndicator } from "@/components/dashboard/traffic-light-indicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEMO_SITES } from "@/data/sites.data";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatTimeAgo } from "@/utils/transformer.utils";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  Bell,
  Clock,
  Gauge,
  MapPin,
  RefreshCw,
  TrendingUp,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Chart imports
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";

// ============================================================
// MOCK DATA FOR CHARTS
// ============================================================

const generateTrendData = (days: number = 7) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: 65 + Math.random() * 30,
      alerts: Math.floor(Math.random() * 5),
    };
  });
};

const healthDistribution = [
  { name: "Nominal", value: 6, color: "#22C55E" },
  { name: "Alarm", value: 3, color: "#F59E0B" },
  { name: "Critical", value: 2, color: "#EF4444" },
];

const statusData = [
  { name: "Online", value: 10, color: "#22C55E" },
  { name: "Offline", value: 1, color: "#94A3B8" },
];

const alertTrendData = generateTrendData(7);
const temperatureData = generateTrendData(7);

// ============================================================
// DASHBOARD STATS
// ============================================================

const DASHBOARD_STATS = {
  totalSites: DEMO_SITES.length,
  onlineSites: DEMO_SITES.filter((s) => s.status !== "critical").length,
  offlineSites: DEMO_SITES.filter((s) => s.status === "critical").length,
  averageHealth: Math.round(
    DEMO_SITES.reduce((acc, s) => acc + s.healthScore, 0) / DEMO_SITES.length
  ),
  totalAlerts: DEMO_SITES.reduce((acc, s) => acc + s.activeAlerts, 0),
  criticalAlerts: DEMO_SITES.filter((s) => s.status === "critical").length,
  technicians: 8,
  averageResponseTime: 4.2,
};

// ============================================================
// MAIN DASHBOARD COMPONENT
// ============================================================

export default function DashboardPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d">("7d");

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  // Recent alerts from sites
  const recentAlerts = DEMO_SITES
    .filter((s) => s.activeAlerts > 0)
    .slice(0, 5)
    .map((s) => ({
      id: `alert-${s.id}`,
      siteId: s.id,
      siteName: s.name,
      severity: s.status === "critical" ? "critical" : s.status === "alarm" ? "high" : "warning",
      message: `${s.status === "critical" ? "Critical" : s.status === "alarm" ? "High" : "Warning"}: ${s.name} has ${s.activeAlerts} active alert(s)`,
      timestamp: s.lastUpdated,
    }));

  // Recent activity from sites
  const recentActivity = DEMO_SITES
    .filter((s) => s.maintenance.length > 0)
    .slice(0, 5)
    .map((s) => ({
      id: `activity-${s.id}`,
      siteId: s.id,
      siteName: s.name,
      severity: s.status === "critical" ? "critical" : s.status === "alarm" ? "high" : "info",
      description: s.maintenance[s.maintenance.length - 1]?.tasks.join(", ") || "Maintenance performed",
      timestamp: s.maintenance[s.maintenance.length - 1]?.date || s.lastUpdated,
    }));

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold md:text-2xl">Dashboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 md:text-sm">
            Real-time overview of your transformer network
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </Badge>
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={cn("h-4 w-4", isLoading && "animate-spin")}
            />
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        <StatCard
          title="Total Sites"
          value={DASHBOARD_STATS.totalSites}
          subtitle={`${DASHBOARD_STATS.onlineSites} online, ${DASHBOARD_STATS.offlineSites} offline`}
          icon={MapPin}
          color="blue"
        />
        <StatCard
          title="Fleet Health"
          value={`${DASHBOARD_STATS.averageHealth}%`}
          subtitle="Average across all sites"
          icon={Gauge}
          color="emerald"
        />
        <StatCard
          title="Active Alerts"
          value={DASHBOARD_STATS.totalAlerts}
          subtitle={`${DASHBOARD_STATS.criticalAlerts} critical`}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Technicians"
          value={DASHBOARD_STATS.technicians}
          subtitle="Field engineers"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Avg Response"
          value={`${DASHBOARD_STATS.averageResponseTime}m`}
          subtitle="Time to action"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Uptime"
          value="99.2%"
          subtitle="Last 30 days"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 space-y-4">
          {/* Health Trend Chart */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Fleet Health Trend
                </CardTitle>
                <div className="flex items-center gap-1">
                  {["7d", "30d", "90d"].map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? "default" : "ghost"}
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => setSelectedPeriod(period as any)}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: { label: "Health Score", color: "#22C55E" },
                }}
                className="h-[200px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#22C55E"
                      fill="#22C55E"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Alert Trend + Distribution */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Alert Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    alerts: { label: "Alerts", color: "#EF4444" },
                  }}
                  className="h-[150px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={alertTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 8 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 8 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="alerts" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Health Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="flex w-full items-center justify-around">
                  <div className="relative h-[120px] w-[120px]">
                    <ChartContainer
                      config={{
                        nominal: { label: "Nominal", color: "#22C55E" },
                        alarm: { label: "Alarm", color: "#F59E0B" },
                        critical: { label: "Critical", color: "#EF4444" },
                      }}
                      className="h-full w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={healthDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {healthDistribution.map((entry, index) => (
                              <Cell key={index} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  <div className="space-y-1.5">
                    {healthDistribution.map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-500">{item.name}</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Alerts & Activity */}
        <div className="space-y-4">
          {/* Recent Alerts */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  <span className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Recent Alerts
                  </span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => router.push("/alerts")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentAlerts.length === 0 ? (
                <div className="text-center py-4 text-sm text-slate-400">
                  No recent alerts
                </div>
              ) : (
                recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      "flex items-start gap-2 rounded-lg p-2 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800",
                      alert.severity === "critical" && "border-l-2 border-red-500 bg-red-50/50 dark:bg-red-950/20",
                      alert.severity === "high" && "border-l-2 border-orange-500 bg-orange-50/50 dark:bg-orange-950/20",
                      alert.severity === "warning" && "border-l-2 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
                    )}
                    onClick={() => router.push(`/sites/${alert.siteId}`)}
                  >
                    <span className="mt-0.5">
                      {alert.severity === "critical" && "🔴"}
                      {alert.severity === "high" && "🟠"}
                      {alert.severity === "warning" && "🟡"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{alert.message}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{alert.siteName}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(alert.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  <span className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Recent Activity
                  </span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentActivity.length === 0 ? (
                <div className="text-center py-4 text-sm text-slate-400">
                  No recent activity
                </div>
              ) : (
                recentActivity.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-2 rounded-lg p-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={() => router.push(`/sites/${event.siteId}`)}
                  >
                    <span className="mt-0.5">
                      {event.severity === "critical" && "🔴"}
                      {event.severity === "high" && "🟠"}
                      {event.severity === "warning" && "🟡"}
                      {event.severity === "info" && "🔵"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{event.description}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{event.siteName}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(event.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Site Status Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Site Status</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => router.push("/sites")}
            >
              View All Sites →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Site</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Health</TableHead>
                  <TableHead className="text-xs">Alerts</TableHead>
                  <TableHead className="text-xs">Transformers</TableHead>
                  <TableHead className="text-xs">Technicians</TableHead>
                  <TableHead className="text-xs">Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DEMO_SITES.slice(0, isMobile ? 5 : 8).map((site) => (
                  <TableRow
                    key={site.id}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    onClick={() => router.push(`/sites/${site.id}`)}
                  >
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{site.name}</p>
                        <p className="text-xs text-slate-400">{site.code}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TrafficLightIndicator status={site.status} size="sm" showLabel={false} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{site.healthScore}%</span>
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${site.healthScore}%`,
                              backgroundColor:
                                site.healthScore >= 70 ? "#22C55E" : site.healthScore >= 50 ? "#F59E0B" : "#EF4444",
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {site.activeAlerts > 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {site.activeAlerts}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-emerald-500 text-xs">
                          0
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{site.transformers.length}</TableCell>
                    <TableCell className="text-sm">{site.technicians.length}</TableCell>
                    <TableCell className="text-xs text-slate-400">
                      {formatTimeAgo(site.lastUpdated)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// STAT CARD COMPONENT
// ============================================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: "blue" | "emerald" | "red" | "purple" | "amber" | "slate";
}

function StatCard({ title, value, subtitle, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
    red: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    slate: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <Card>
      <CardContent className="p-3 md:p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 md:text-xs">
              {title}
            </p>
            <p className="text-lg font-bold md:text-2xl">{value}</p>
            {subtitle && (
              <p className="text-[10px] text-slate-400 md:text-xs">{subtitle}</p>
            )}
          </div>
          <div className={cn("rounded-lg p-1.5 md:p-2", colorClasses[color])}>
            <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}