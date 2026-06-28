"use client";

import { TrafficLightIndicator } from "@/components/dashboard/traffic-light-indicator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteDetail } from "@/types/site.type";
import { formatTimeAgo } from "@/utils/transformer.utils";
import {
    Building2,
    Globe,
    Map,
    MapPin
} from "lucide-react";

interface SiteDetailOverviewProps {
    site: SiteDetail;
}

export function SiteDetailOverview({ site }: SiteDetailOverviewProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Basic Info */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Site Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Status</span>
                        <TrafficLightIndicator status={site.status} size="md" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Health Score</span>
                        <Badge variant="outline" className="text-lg font-bold">
                            {site.healthScore}%
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Code</span>
                        <span className="font-mono text-sm">{site.code}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Planted Date</span>
                        <span className="text-sm">{new Date(site.plantedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Last Updated</span>
                        <span className="text-sm text-slate-400">{formatTimeAgo(site.lastUpdated)}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Location */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                        <Globe className="mt-0.5 h-4 w-4 text-slate-400" />
                        <div>
                            <p className="text-sm font-medium">{site.location.continent}</p>
                            <p className="text-xs text-slate-400">Continent</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <Map className="mt-0.5 h-4 w-4 text-slate-400" />
                        <div>
                            <p className="text-sm font-medium">{site.location.country}</p>
                            <p className="text-xs text-slate-400">Country</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <Building2 className="mt-0.5 h-4 w-4 text-slate-400" />
                        <div>
                            <p className="text-sm font-medium">{site.location.region}</p>
                            <p className="text-xs text-slate-400">Region</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                        <div>
                            <p className="text-sm font-medium">{site.location.district}</p>
                            <p className="text-xs text-slate-400">District</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                        <div>
                            <p className="text-sm font-medium">{site.location.specificLocation}</p>
                            <p className="text-xs text-slate-400">Specific Location</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-sm text-slate-400">
                            {site.location.latitude.toFixed(4)}, {site.location.longitude.toFixed(4)}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Transformers</span>
                        <span className="font-medium">{site.transformers.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Technicians</span>
                        <span className="font-medium">{site.technicians.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Active Alerts</span>
                        <Badge variant={site.activeAlerts > 0 ? "destructive" : "outline"}>
                            {site.activeAlerts}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Maintenance Records</span>
                        <span className="font-medium">{site.maintenance.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Activity Log Entries</span>
                        <span className="font-medium">{site.activityLog?.length || 0}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}