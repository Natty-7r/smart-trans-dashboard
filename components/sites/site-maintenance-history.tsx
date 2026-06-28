"use client";

import { MaintenanceRecord } from "@/types/site.type";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ClipboardList, Plus } from "lucide-react";
import { formatTimeAgo } from "@/utils/transformer.utils";

interface SiteMaintenanceHistoryProps {
    maintenance: MaintenanceRecord[];
    onAddMaintenance?: () => void;
}

export function SiteMaintenanceHistory({
    maintenance,
    onAddMaintenance,
}: SiteMaintenanceHistoryProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Maintenance History</CardTitle>
                <Button size="sm" onClick={onAddMaintenance}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Record
                </Button>
            </CardHeader>
            <CardContent>
                {maintenance.length === 0 ? (
                    <div className="text-center py-6 text-sm text-slate-400">
                        No maintenance records
                    </div>
                ) : (
                    <div className="space-y-3">
                        {maintenance.map((record) => (
                            <div
                                key={record.id}
                                className="rounded-lg border p-3 space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ClipboardList className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm font-medium">
                                            {record.tasks.length} tasks
                                        </span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {formatTimeAgo(record.date)}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(record.date).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {record.technicianName}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {record.tasks.map((task, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {task}
                                        </Badge>
                                    ))}
                                </div>
                                {record.notes && (
                                    <p className="text-xs text-slate-400">{record.notes}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}