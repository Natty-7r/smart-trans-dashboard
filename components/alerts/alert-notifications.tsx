"use client";

import { AlertNotification } from "@/types/alert.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Smartphone,
  Bell,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { formatTimeAgo } from "@/utils/transformer.utils";

interface AlertNotificationsProps {
  notifications: AlertNotification[];
}

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  sms: <Smartphone className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  push: <Bell className="h-4 w-4" />,
};

const STATUS_BADGES: Record<string, string> = {
  sent: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  delivered:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  read: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  sent: <Clock className="h-3.5 w-3.5" />,
  delivered: <CheckCircle className="h-3.5 w-3.5" />,
  read: <CheckCircle className="h-3.5 w-3.5" />,
  pending: <Clock className="h-3.5 w-3.5" />,
  failed: <XCircle className="h-3.5 w-3.5" />,
};

export function AlertNotifications({ notifications }: AlertNotificationsProps) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="text-slate-400">
                  {NOTIFICATION_ICONS[notification.type] || (
                    <Bell className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium capitalize">
                    {notification.type}
                  </p>
                  <p className="text-xs text-slate-400">
                    {notification.recipient}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={STATUS_BADGES[notification.status]}>
                  <span className="flex items-center gap-1">
                    {STATUS_ICONS[notification.status]}
                    {notification.status}
                  </span>
                </Badge>
                <span className="text-xs text-slate-400">
                  {formatTimeAgo(notification.sentAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
