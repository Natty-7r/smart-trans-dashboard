"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Gauge,
  Thermometer,
  Droplets,
  Wind,
  Zap,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertReadingsProps {
  readings: {
    temperature?: number;
    current?: number;
    voltage?: number;
    oilLevel?: number;
    hydrogen?: number;
    vibration?: number;
  };
}

interface ReadingItem {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  threshold: { normal: string; alarm: string; critical: string };
  status: "normal" | "alarm" | "critical";
}

export function AlertReadings({ readings }: AlertReadingsProps) {
  const getStatus = (
    value: number,
    normalMax: number,
    alarmMax: number,
  ): "normal" | "alarm" | "critical" => {
    if (value > alarmMax) return "critical";
    if (value > normalMax) return "alarm";
    return "normal";
  };

  const readingItems: ReadingItem[] = [
    {
      label: "Temperature",
      value: readings.temperature || 0,
      unit: "°C",
      icon: <Thermometer className="h-4 w-4" />,
      threshold: { normal: "≤80", alarm: "80-95", critical: ">95" },
      status: getStatus(readings.temperature || 0, 80, 95),
    },
    {
      label: "Current",
      value: readings.current || 0,
      unit: "A",
      icon: <Zap className="h-4 w-4" />,
      threshold: { normal: "≤130", alarm: "130-160", critical: ">160" },
      status: getStatus(readings.current || 0, 130, 160),
    },
    {
      label: "Voltage",
      value: readings.voltage || 0,
      unit: "kV",
      icon: <Gauge className="h-4 w-4" />,
      threshold: { normal: "10.8-11.2", alarm: "10.2-10.8", critical: "<10.2" },
      status: getStatus(readings.voltage || 0, 11.2, 10.2),
    },
    {
      label: "Oil Level",
      value: readings.oilLevel || 0,
      unit: "%",
      icon: <Droplets className="h-4 w-4" />,
      threshold: { normal: "≥85", alarm: "70-84", critical: "<70" },
      status:
        readings.oilLevel && readings.oilLevel < 70
          ? "critical"
          : readings.oilLevel && readings.oilLevel < 85
            ? "alarm"
            : "normal",
    },
    {
      label: "Hydrogen",
      value: readings.hydrogen || 0,
      unit: "ppm",
      icon: <Wind className="h-4 w-4" />,
      threshold: { normal: "≤10", alarm: "10-20", critical: ">20" },
      status: getStatus(readings.hydrogen || 0, 10, 20),
    },
    {
      label: "Vibration",
      value: readings.vibration || 0,
      unit: "mm/s",
      icon: <Activity className="h-4 w-4" />,
      threshold: { normal: "≤2", alarm: "2-5", critical: ">5" },
      status: getStatus(readings.vibration || 0, 2, 5),
    },
  ];

  const statusColors = {
    normal: "border-emerald-200 dark:border-emerald-800",
    alarm: "border-amber-200 dark:border-amber-800",
    critical: "border-red-200 dark:border-red-800",
  };

  const statusBadges = {
    normal:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    alarm: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Sensor Readings at Time of Alert
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {readingItems.map((item, index) => (
            <div
              key={index}
              className={cn(
                "rounded-lg border p-3 text-center",
                statusColors[item.status],
              )}
            >
              <div className="flex items-center justify-center gap-1 text-slate-400">
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </div>
              <p className="text-lg font-bold">{item.value}</p>
              <p className="text-xs text-slate-400">{item.unit}</p>
              <Badge className={cn("mt-1 text-xs", statusBadges[item.status])}>
                {item.status === "normal"
                  ? "✅ Normal"
                  : item.status === "alarm"
                    ? "⚠️ Alarm"
                    : "🚨 Critical"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
