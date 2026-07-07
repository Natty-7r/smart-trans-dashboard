"use client";

import { AlertAction, Alert } from "@/types/alert.type";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  FileText,
  Eye,
  Check,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTimeAgo } from "@/utils/transformer.utils";

interface AlertTimelineProps {
  actions: AlertAction[];
  alert: Alert;
}

type TimelineEvent = {
  type: string;
  timestamp: string;
  userId: string;
  userName: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  details?: string;
};

const ACTION_ICONS: Record<string, React.ReactNode> = {
  acknowledge: <Check className="h-4 w-4 text-emerald-500" />,
  assign: <User className="h-4 w-4 text-blue-500" />,
  resolve: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  escalate: <AlertTriangle className="h-4 w-4 text-red-500" />,
  note: <FileText className="h-4 w-4 text-amber-500" />,
  view: <Eye className="h-4 w-4 text-slate-400" />,
};

const ACTION_LABELS: Record<string, string> = {
  acknowledge: "Acknowledged",
  assign: "Assigned",
  resolve: "Resolved",
  escalate: "Escalated",
  note: "Note added",
  view: "Viewed",
};

export function AlertTimeline({ actions, alert }: AlertTimelineProps) {
  // Build timeline events
  const events: TimelineEvent[] = [
    {
      type: "created",
      timestamp: alert.timestamp,
      userId: "System",
      userName: "System",
      label: "Alert Created",
      icon: <Zap className="h-4 w-4 text-purple-500" />,
      color: "border-purple-500",
    },
    ...actions.map((action) => ({
      type: action.type,
      timestamp: action.timestamp,
      userId: action.userId,
      userName: action.userName,
      label: ACTION_LABELS[action.type] || action.type,
      icon: ACTION_ICONS[action.type] || (
        <FileText className="h-4 w-4 text-slate-400" />
      ),
      color:
        action.type === "acknowledge"
          ? "border-emerald-500"
          : action.type === "assign"
            ? "border-blue-500"
            : action.type === "resolve"
              ? "border-emerald-500"
              : action.type === "escalate"
                ? "border-red-500"
                : "border-slate-300",
      details: action.details,
    })),
  ];

  // Sort by timestamp (oldest first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <div className="relative pl-6 space-y-4">
      {/* Vertical line */}
      <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

      {sortedEvents.map((event, index) => (
        <div key={index} className="relative">
          {/* Dot */}
          <div
            className={cn(
              "absolute -left-6 mt-1 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-950",
              event.color || "border-slate-300",
            )}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              {event.icon}
              <span className="text-sm font-medium">{event.label}</span>
              <span className="text-xs text-slate-400">
                {formatTimeAgo(event.timestamp)}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              {event.userName}
              {event.details && ` · ${event.details}`}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
