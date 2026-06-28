"use client";

import { ActivityLogEntry } from "@/types/site.type";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Activity,
    AlertTriangle,
    UserPlus,
    UserMinus,
    Settings,
    Zap,
    Wrench,
} from "lucide-react";
import { formatTimeAgo } from "@/utils/transformer.utils";

interface SiteActivityLogProps {
    activities: ActivityLogEntry[];
}

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
    maintenance: <Wrench className="h-4 w-4 text-blue-500" />,
    alert: <AlertTriangle className="h-4 w-4 text-red-500" />,
    technician_assigned: <UserPlus className="h-4 w-4 text-emerald-500" />,
    technician_revoked: <UserMinus className="h-4 w-4 text-red-500" />,
    status_change: <Settings className="h-4 w-4 text-amber-500" />,
    transformer_added: <Zap className="h-4 w-4 text-blue-500" />,
    transformer_removed: <Zap className="h-4 w-4 text-red-500" />,
};

const ACTIVITY_COLORS: Record<string, string> = {
    maintenance: "border-blue-200 dark:border-blue-800",
    alert: "border-red-200 dark:border-red-800",
    technician_assigned: "border-emerald-200 dark:border-emerald-800",
    technician_revoked: "border-red-200 dark:border-red-800",
    status_change: "border-amber-200 dark:border-amber-800",
    transformer_added: "border-blue-200 dark:border-blue-800",
    transformer_removed: "border-red-200 dark:border-red-800",
};

export function SiteActivityLog({ activities }: SiteActivityLogProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
                {activities.length === 0 ? (
                    <div className="text-center py-6 text-sm text-slate-400">
                        No activity logged
                    </div>
                ) : (
                    <div className="space-y-2">
                        {activities.map((activity) => (
                            <div
                                key={activity.id}
                                className={`flex items-start gap-3 rounded-lg border-l-4 p-3 ${ACTIVITY_COLORS[activity.type] || "border-slate-200 dark:border-slate-700"}`}
                            >
                                <div className="mt-0.5">
                                    {ACTIVITY_ICONS[activity.type] || <Activity className="h-4 w-4 text-slate-400" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm">{activity.message}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span>{activity.userName}</span>
                                        <span>•</span>
                                        <span>{formatTimeAgo(activity.timestamp)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}