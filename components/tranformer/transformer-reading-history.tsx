"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { TransformerReading } from "@/types/transformer.type";
import { Calendar, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useMemo, useState } from "react";

interface TransformerReadingHistoryProps {
    readings: TransformerReading[];
    transformerId: string;
}

export function TransformerReadingHistory({
    readings,
    transformerId,
}: TransformerReadingHistoryProps) {
    const isMobile = useIsMobile();
    const [filter, setFilter] = useState<"today" | "week" | "month" | "year" | "all">("month");
    const [page, setPage] = useState(0);
    const pageSize = isMobile ? 10 : 20;

    const filteredReadings = useMemo(() => {
        const now = new Date();
        let filtered = [...readings];

        switch (filter) {
            case "today":
                filtered = filtered.filter(
                    (r) => new Date(r.timestamp).toDateString() === now.toDateString()
                );
                break;
            case "week":
                const weekAgo = new Date(now);
                weekAgo.setDate(now.getDate() - 7);
                filtered = filtered.filter((r) => new Date(r.timestamp) >= weekAgo);
                break;
            case "month":
                const monthAgo = new Date(now);
                monthAgo.setMonth(now.getMonth() - 1);
                filtered = filtered.filter((r) => new Date(r.timestamp) >= monthAgo);
                break;
            case "year":
                const yearAgo = new Date(now);
                yearAgo.setFullYear(now.getFullYear() - 1);
                filtered = filtered.filter((r) => new Date(r.timestamp) >= yearAgo);
                break;
            default:
                break;
        }

        return filtered.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }, [readings, filter]);

    const paginatedReadings = useMemo(() => {
        const start = page * pageSize;
        return filteredReadings.slice(start, start + pageSize);
    }, [filteredReadings, page, pageSize]);

    const totalPages = Math.ceil(filteredReadings.length / pageSize);

    const getStatus = (reading: TransformerReading) => {
        if (reading.status === "critical") return "critical";
        if (reading.status === "alarm") return "alarm";
        return "nominal";
    };

    const statusColors = {
        nominal: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
        alarm: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
        critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-sm font-medium">Reading History</CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <Select
                                value={filter}
                                onValueChange={(v) => {
                                    setFilter(v as any);
                                    setPage(0);
                                }}
                            >
                                <SelectTrigger className="h-8 w-[110px] text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                    <SelectItem value="year">This Year</SelectItem>
                                    <SelectItem value="all">All Time</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline" size="sm" className="h-8">
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <p className="text-xs text-slate-400">
                    Showing {filteredReadings.length} readings
                </p>
            </CardHeader>
            <CardContent>
                {isMobile ? (
                    // Mobile card view
                    <div className="space-y-3">
                        {paginatedReadings.length === 0 ? (
                            <div className="text-center py-8 text-sm text-slate-400">
                                No readings found
                            </div>
                        ) : (
                            paginatedReadings.map((reading) => (
                                <div
                                    key={reading.id}
                                    className="rounded-lg border p-3 space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            {new Date(reading.timestamp).toLocaleString()}
                                        </span>
                                        <Badge className={statusColors[getStatus(reading)]}>
                                            {reading.status}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1 text-xs">
                                        <span className="text-slate-400">Temp:</span>
                                        <span className="font-medium">{reading.temperature.oil.toFixed(1)}°C</span>
                                        <span className="text-slate-400">Load:</span>
                                        <span className="font-medium">{reading.current.loadFactor.toFixed(1)}%</span>
                                        <span className="text-slate-400">Oil Level:</span>
                                        <span className="font-medium">{reading.oil.level.toFixed(1)}%</span>
                                        <span className="text-slate-400">H₂:</span>
                                        <span className="font-medium">{reading.gas.hydrogen.toFixed(1)} ppm</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    // Desktop table view
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs">Timestamp</TableHead>
                                    <TableHead className="text-xs">Temp (°C)</TableHead>
                                    <TableHead className="text-xs">Load (%)</TableHead>
                                    <TableHead className="text-xs">Voltage (kV)</TableHead>
                                    <TableHead className="text-xs">Oil Level (%)</TableHead>
                                    <TableHead className="text-xs">H₂ (ppm)</TableHead>
                                    <TableHead className="text-xs">Health</TableHead>
                                    <TableHead className="text-xs">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedReadings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-slate-400">
                                            No readings found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedReadings.map((reading) => (
                                        <TableRow key={reading.id}>
                                            <TableCell className="text-xs text-slate-400">
                                                {new Date(reading.timestamp).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {reading.temperature.oil.toFixed(1)}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {reading.current.loadFactor.toFixed(1)}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {reading.voltage.primary.toFixed(1)}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {reading.oil.level.toFixed(1)}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {reading.gas.hydrogen.toFixed(1)}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                <div className="flex items-center gap-1.5">
                                                    <span>{reading.healthScore}%</span>
                                                    <div className="h-1.5 w-8 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                                        <div
                                                            className="h-full rounded-full"
                                                            style={{
                                                                width: `${reading.healthScore}%`,
                                                                backgroundColor:
                                                                    reading.healthScore >= 70 ? "#22C55E" :
                                                                        reading.healthScore >= 50 ? "#F59E0B" : "#EF4444",
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={statusColors[getStatus(reading)]}>
                                                    {reading.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                            Page {page + 1} of {totalPages}
                        </span>
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(Math.max(0, page - 1))}
                                disabled={page === 0}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                disabled={page >= totalPages - 1}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}