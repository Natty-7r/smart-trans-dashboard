"use client";

import { AlertNotes } from "@/components/alerts/alert-notes";
import { AlertNotifications } from "@/components/alerts/alert-notifications";
import { AlertReadings } from "@/components/alerts/alert-readings";
import { AlertTimeline } from "@/components/alerts/alert-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ALERT_TYPE_LABELS,
  getAlertById,
  SEVERITY_COLORS,
  SEVERITY_ICONS,
  SEVERITY_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from "@/data/alerts.data";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertNote } from "@/types/alert.type";
import { formatDateTime, formatTimeAgo } from "@/utils/transformer.utils";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Link2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AlertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();
  const alertId = params.id as string;

  const [alert, setAlert] = useState<Alert | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAlert = async () => {
      setIsLoading(true);
      try {
        const found = getAlertById(alertId);
        if (found) {
          setAlert(found);
        } else {
          toast.error("Alert not found");
          router.push("/alerts");
        }
      } catch (error) {
        toast.error("Failed to load alert details");
      } finally {
        setIsLoading(false);
      }
    };

    loadAlert();
  }, [alertId, router]);

  const handleAcknowledge = () => {
    if (!alert) return;
    setAlert({
      ...alert,
      status: "acknowledged",
      acknowledgedAt: new Date().toISOString(),
      acknowledgedBy: "Current User",
      actions: [
        ...(alert.actions || []),
        {
          id: `act-${Date.now()}`,
          alertId: alert.id,
          type: "acknowledge",
          userId: "user-001",
          userName: "Current User",
          timestamp: new Date().toISOString(),
        },
      ],
    });
    toast.success("Alert acknowledged");
  };

  const handleResolve = () => {
    if (!alert) return;
    setAlert({
      ...alert,
      status: "resolved",
      resolvedAt: new Date().toISOString(),
      resolvedBy: "Current User",
      responseTime: Math.floor(
        (new Date().getTime() - new Date(alert.timestamp).getTime()) / 60000,
      ),
      actions: [
        ...(alert.actions || []),
        {
          id: `act-${Date.now()}`,
          alertId: alert.id,
          type: "resolve",
          userId: "user-001",
          userName: "Current User",
          timestamp: new Date().toISOString(),
          details: "Alert resolved",
        },
      ],
    });
    toast.success("Alert resolved");
  };

  const handleAddNote = (content: string) => {
    if (!alert) return;
    const newNote: AlertNote = {
      id: `note-${Date.now()}`,
      alertId: alert.id,
      content,
      userId: "user-001",
      userName: "Current User",
      timestamp: new Date().toISOString(),
    };
    setAlert({
      ...alert,
      notes: [...(alert.notes || []), newNote],
      actions: [
        ...(alert.actions || []),
        {
          id: `act-${Date.now()}`,
          alertId: alert.id,
          type: "note",
          userId: "user-001",
          userName: "Current User",
          timestamp: new Date().toISOString(),
          details: content,
        },
      ],
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
          <p className="mt-2 text-sm text-slate-500">
            Loading alert details...
          </p>
        </div>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500">Alert not found</p>
          <Button onClick={() => router.push("/alerts")} className="mt-4">
            Back to Alerts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size={isMobile ? "icon-sm" : "icon"}
            onClick={() => router.push("/alerts")}
            className="h-8 w-8 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg">{SEVERITY_ICONS[alert.severity]}</span>
              <h1 className="text-lg font-bold md:text-2xl">{alert.title}</h1>
              <Badge className={SEVERITY_COLORS[alert.severity]}>
                {SEVERITY_LABELS[alert.severity]}
              </Badge>
              <Badge className={STATUS_COLORS[alert.status]}>
                {STATUS_LABELS[alert.status]}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 md:text-sm">
              {alert.id} · {ALERT_TYPE_LABELS[alert.type] || alert.type}
            </p>
            <p className="text-xs text-slate-400">
              {formatTimeAgo(alert.timestamp)} ·{" "}
              {formatDateTime(alert.timestamp)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {alert.status === "active" && (
            <>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={handleAcknowledge}
              >
                <Clock className="mr-2 h-4 w-4" />
                Acknowledge
              </Button>
              <Button
                size={isMobile ? "sm" : "default"}
                onClick={handleResolve}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Resolve
              </Button>
            </>
          )}
          {alert.status === "acknowledged" && (
            <Button
              size={isMobile ? "sm" : "default"}
              onClick={handleResolve}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Resolve
            </Button>
          )}
        </div>
      </div>

      {/* Alert Message & Details */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Message */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alert Message</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{alert.message}</p>
          </CardContent>
        </Card>

        {/* Status Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Status Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <Badge className={STATUS_COLORS[alert.status]}>
                {STATUS_LABELS[alert.status]}
              </Badge>
            </div>
            {alert.acknowledgedAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Acknowledged</span>
                <span>{formatTimeAgo(alert.acknowledgedAt)}</span>
              </div>
            )}
            {alert.acknowledgedBy && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Acknowledged By</span>
                <span>{alert.acknowledgedBy}</span>
              </div>
            )}
            {alert.resolvedAt && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Resolved</span>
                <span>{formatTimeAgo(alert.resolvedAt)}</span>
              </div>
            )}
            {alert.resolvedBy && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Resolved By</span>
                <span>{alert.resolvedBy}</span>
              </div>
            )}
            {alert.responseTime && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Response Time</span>
                <span className="font-medium">
                  {alert.responseTime} minutes
                </span>
              </div>
            )}
            {alert.assignedToName && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Assigned To</span>
                <span className="font-medium">{alert.assignedToName}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Link to Transformer */}
      {alert.transformerId && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Caused By</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => router.push(`/sites/${alert.siteId}/transformer`)}
            >
              <Zap className="h-4 w-4" />
              <span>
                Transformer: {alert.transformerName || alert.transformerId}
              </span>
              <Link2 className="h-3.5 w-3.5 text-slate-400" />
            </Button>
            <span className="ml-2 text-xs text-slate-400">
              at {alert.siteName} ({alert.siteCode})
            </span>
          </CardContent>
        </Card>
      )}

      {/* Sensor Readings */}
      {alert.readings &&
        Object.keys(alert.readings).some(
          (key) =>
            alert.readings?.[key as keyof typeof alert.readings] !== undefined,
        ) && <AlertReadings readings={alert.readings} />}

      {/* Timeline */}
      {alert.actions && alert.actions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertTimeline actions={alert.actions} alert={alert} />
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {alert.notifications && alert.notifications.length > 0 && (
        <AlertNotifications notifications={alert.notifications} />
      )}

      {/* Notes */}
      <AlertNotes
        notes={alert.notes || []}
        alertId={alert.id}
        onAddNote={handleAddNote}
      />

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/sites/${alert.siteId}`)}
        >
          <MapPin className="mr-2 h-4 w-4" />
          View Site
        </Button>
        {alert.transformerId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/sites/${alert.siteId}/transformer`)}
          >
            <Zap className="mr-2 h-4 w-4" />
            View Transformer
          </Button>
        )}
        <Button variant="outline" size="sm">
          <Phone className="mr-2 h-4 w-4" />
          Contact Technician
        </Button>
        <Button variant="outline" size="sm">
          <Mail className="mr-2 h-4 w-4" />
          Email Report
        </Button>
      </div>
    </div>
  );
}
