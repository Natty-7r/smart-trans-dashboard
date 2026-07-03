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
import { MaintenanceRecord } from "@/types/transformer.type";
import { ChevronLeft, ChevronRight, Clock, Plus, User, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface TransformerActionLogProps {
    maintenance: MaintenanceRecord[];
    transformerId: string;
}

const actionTypeLabels: Record<MaintenanceRecord["type"], string> = {
    maintenance: "Maintenance",
    repair: "Repair",
    inspection: "Inspection",
    emergency: "Emergency",
    calibration: "Calibration",
};

const statusLabels: Record<MaintenanceRecord["status"], string> = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
};

const statusColors: Record<MaintenanceRecord["status"], string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export function TransformerActionLog({
    maintenance,
    transformerId,
}: TransformerActionLogProps) {
    const isMobile = useIsMobile();
    const [filter, setFilter] = useState<MaintenanceRecord["type"] | "all">("all");
    const [statusFilter, setStatusFilter] = useState<MaintenanceRecord["status"] | "all">("all");
    const [page, setPage] = useState(0);
    const pageSize = isMobile ? 5 : 10;

    const filteredLogs = useMemo(() => {
        let filtered = [...maintenance];

        if (filter !== "all") {
            filtered = filtered.filter((m) => m.type === filter);
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((m) => m.status === statusFilter);
        }

        return filtered.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }, [maintenance, filter, statusFilter]);

    const paginatedLogs = useMemo(() => {
        const start = page * pageSize;
        return filteredLogs.slice(start, start + pageSize);
    }, [filteredLogs, page, pageSize]);

    const totalPages = Math.ceil(filteredLogs.length / pageSize);

    const handleAddAction = () => {
        toast.info("Add action feature coming soon");
    };

    if (maintenance.length === 0) {
        return (
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Action Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-sm text-slate-400">
                        No actions recorded
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-sm font-medium">Action Log</CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                        <Select value={filter} onValueChange={(v) => { setFilter(v as any); setPage(0); }}>
                            <SelectTrigger className="h-8 w-[120px] text-xs">
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                <SelectItem value="repair">Repair</SelectItem>
                                <SelectItem value="inspection">Inspection</SelectItem>
                                <SelectItem value="emergency">Emergency</SelectItem>
                                <SelectItem value="calibration">Calibration</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as any); setPage(0); }}>
                            <SelectTrigger className="h-8 w-[120px] text-xs">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button size="sm" className="h-8" onClick={handleAddAction}>
                            <Plus className="mr-1 h-4 w-4" />
                            Add
                        </Button>
                    </div>
                </div>
                <p className="text-xs text-slate-400">
                    Showing {filteredLogs.length} actions
                </p>
            </CardHeader>
            <CardContent>
                {isMobile ? (
                    // Mobile card view
                    <div className="space-y-3">
                        {paginatedLogs.map((log) => (
                            <div key={log.id} className="rounded-lg border p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Wrench className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm font-medium">{log.title}</span>
                                    </div>
                                    <Badge className={statusColors[log.status]}>
                                        {statusLabels[log.status]}
                                    </Badge>
                                </div>
                                <div className="text-xs text-slate-400">{log.description}</div>
                                <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(log.date).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {log.technicianName}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                        {actionTypeLabels[log.type]}
                                    </Badge>
                                </div>
                                {log.tasks.length > 0 && (
                                    <div className="text-xs">
                                        <span className="text-slate-400">Tasks: </span>
                                        {log.tasks.join(", ")}
                                    </div>
                                )}
                                {log.notes && (
                                    <div className="text-xs text-slate-400">📝 {log.notes}</div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    // Desktop table view
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs">Date</TableHead>
                                    <TableHead className="text-xs">Type</TableHead>
                                    <TableHead className="text-xs">Title</TableHead>
                                    <TableHead className="text-xs">Technician</TableHead>
                                    <TableHead className="text-xs">Duration</TableHead>
                                    <TableHead className="text-xs">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-xs text-slate-400">
                                            {new Date(log.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-xs">
                                                {actionTypeLabels[log.type]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">{log.title}</TableCell>
                                        <TableCell className="text-sm">{log.technicianName}</TableCell>
                                        <TableCell className="text-sm">{log.duration}m</TableCell>
                                        <TableCell>
                                            <Badge className={statusColors[log.status]}>
                                                {statusLabels[log.status]}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
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