"use client";

import { EventLogEntry } from "@/types/transformer.type";
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
import { SEVERITY_COLORS } from "@/constants/transformer.contants";
import { formatTimeAgo } from "@/utils/transformer.utils";

interface EventLogTableProps {
    events: EventLogEntry[];
    maxRows?: number;
    showCard?: boolean;
}

export function EventLogTable({
    events,
    maxRows = 10,
    showCard = true,
}: EventLogTableProps) {
    const displayEvents = events.slice(0, maxRows);

    const getStatusBadge = (status: EventLogEntry["status"]) => {
        const variants = {
            pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
            in_progress:
                "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
            resolved:
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
        };
        return variants[status] || variants.pending;
    };

    const getSeverityBadge = (severity: EventLogEntry["severity"]) => {
        const colors = SEVERITY_COLORS[severity];
        return `bg-${colors.bg} text-${colors.text} border-${colors.border}`;
    };

    const content = (
        <div className="overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Time</TableHead>
                        <TableHead>Site</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Triggered By</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Response</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {displayEvents.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-slate-400">
                                No events found
                            </TableCell>
                        </TableRow>
                    ) : (
                        displayEvents.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell className="text-xs text-slate-500">
                                    {formatTimeAgo(event.timestamp)}
                                </TableCell>
                                <TableCell className="font-medium">{event.siteName}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${getSeverityBadge(event.severity)}`}
                                        >
                                            {event.severity}
                                        </Badge>
                                        <span className="text-sm">{event.eventType.replace("_", " ")}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-slate-500">
                                    {event.triggeredBy}
                                </TableCell>
                                <TableCell className="text-sm text-slate-500">
                                    {event.actionTaken}
                                </TableCell>
                                <TableCell className="text-sm">
                                    {event.responseTime > 0 ? `${event.responseTime}m` : "N/A"}
                                </TableCell>
                                <TableCell>
                                    <Badge className={`text-xs ${getStatusBadge(event.status)}`}>
                                        {event.status.replace("_", " ")}
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
                <CardTitle className="text-sm font-medium">Event Log</CardTitle>
            </CardHeader>
            <CardContent className="p-0">{content}</CardContent>
        </Card>
    );
}