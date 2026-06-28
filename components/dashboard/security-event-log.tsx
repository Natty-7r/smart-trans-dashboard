"use client";

import { SecurityEvent } from "@/types/transformer.type";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/utils/transformer.utils";
import { SEVERITY_COLORS } from "@/constants/transformer.contants";

interface SecurityEventLogProps {
    events: SecurityEvent[];
    maxRows?: number;
    showCard?: boolean;
}

const SECURITY_EVENT_ICONS: Record<string, string> = {
    tamper_detected: "🔧",
    forced_entry: "🔨",
    cable_cut: "✂️",
    gps_displacement: "📍",
    enclosure_open: "🚪",
};

const SECURITY_EVENT_LABELS: Record<string, string> = {
    tamper_detected: "Tamper Detected",
    forced_entry: "Forced Entry",
    cable_cut: "Cable Cut",
    gps_displacement: "GPS Displacement",
    enclosure_open: "Enclosure Open",
};

export function SecurityEventLog({
    events,
    maxRows = 10,
    showCard = true,
}: SecurityEventLogProps) {
    const displayEvents = events.slice(0, maxRows);

    // Generate mock security events if none provided
    const mockEvents: SecurityEvent[] = [
        {
            id: "SEC-001",
            siteId: "ADD-056",
            type: "cable_cut",
            severity: "critical",
            timestamp: new Date(Date.now() - 900000).toISOString(),
            description: "Cable cut detected on Site ADD-056",
            resolved: false,
        },
        {
            id: "SEC-002",
            siteId: "ADD-087",
            type: "tamper_detected",
            severity: "high",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            description: "Unusual vibration pattern detected",
            resolved: false,
        },
        {
            id: "SEC-003",
            siteId: "ADD-042",
            type: "enclosure_open",
            severity: "warning",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            description: "Enclosure door opened at 8:32 AM",
            resolved: true,
            resolvedAt: new Date(Date.now() - 3600000).toISOString(),
            resolvedBy: "Mike Field",
        },
        {
            id: "SEC-004",
            siteId: "ADD-001",
            type: "gps_displacement",
            severity: "warning",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            description: "GPS location moved 5m from expected position",
            resolved: true,
            resolvedAt: new Date(Date.now() - 72000000).toISOString(),
            resolvedBy: "Sarah NOC",
        },
    ];

    const displayData = events.length > 0 ? displayEvents : mockEvents;

    const getSeverityBadge = (severity: SecurityEvent["severity"]) => {
        const colors = SEVERITY_COLORS[severity];
        return `bg-${colors.bg} text-${colors.text} border-${colors.border}`;
    };

    const getStatusBadge = (resolved: boolean) => {
        return resolved
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
            : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 animate-pulse";
    };

    const content = (
        <div className="overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Time</TableHead>
                        <TableHead>Site</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {displayData.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-slate-400">
                                No security events found
                            </TableCell>
                        </TableRow>
                    ) : (
                        displayData.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell className="text-xs text-slate-500">
                                    {formatTimeAgo(event.timestamp)}
                                </TableCell>
                                <TableCell className="font-medium">{event.siteId}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-lg">
                                            {SECURITY_EVENT_ICONS[event.type] || "🔔"}
                                        </span>
                                        <span className="text-sm">
                                            {SECURITY_EVENT_LABELS[event.type] || event.type}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${getSeverityBadge(event.severity)}`}
                                        >
                                            {event.severity}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-slate-500">
                                    {event.description}
                                </TableCell>
                                <TableCell>
                                    <Badge className={`text-xs ${getStatusBadge(event.resolved)}`}>
                                        {event.resolved ? "✅ Resolved" : "🚨 Active"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );

    if (!showCard) return content;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">🔐 Security Event Log</CardTitle>
            </CardHeader>
            <CardContent className="p-0">{content}</CardContent>
        </Card>
    );
}