"use client";

import { TrafficLightIndicator } from "@/components/dashboard/traffic-light-indicator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SitePreview } from "@/types/site.type";
import { MapPin } from "lucide-react";

interface SiteMapPreviewProps {
    site: SitePreview;
    onViewDetails?: () => void;
}

export function SiteMapPreview({ site, onViewDetails }: SiteMapPreviewProps) {
    return (
        <Card className="w-64 overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow" onClick={onViewDetails}>
            <CardHeader className="pb-2 space-y-1">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{site.name}</CardTitle>
                    <TrafficLightIndicator status={site.status} size="sm" showLabel={false} />
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="h-3 w-3" />
                    {site.code}
                </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-slate-500">Health</span>
                    <span className="font-medium">{site.healthScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-500">Alerts</span>
                    <Badge variant={site.activeAlerts > 0 ? "destructive" : "outline"}>
                        {site.activeAlerts}
                    </Badge>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-500">Transformers</span>
                    <span className="font-medium">{site.transformerCount}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-500">Technicians</span>
                    <span className="font-medium">{site.technicianCount}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                    <MapPin className="h-3 w-3" />
                    {site.location.district}, {site.location.region}
                </div>
            </CardContent>
        </Card>
    );
}