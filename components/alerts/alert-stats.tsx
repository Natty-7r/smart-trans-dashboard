"use client";

import { AlertStats } from "@/types/alert.type";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, Activity } from "lucide-react";

interface AlertStatsProps {
  stats: AlertStats;
}

export function AlertStatsCards({ stats }: AlertStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 md:text-xs">
                Total Alerts
              </p>
              <p className="text-lg font-bold md:text-2xl">{stats.total}</p>
            </div>
            <div className="rounded-lg bg-slate-100 p-1.5 md:p-2 dark:bg-slate-800">
              <Activity className="h-3.5 w-3.5 text-slate-500 md:h-4 md:w-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 md:text-xs">
                Active
              </p>
              <p className="text-lg font-bold text-red-600 md:text-2xl">
                {stats.active}
              </p>
            </div>
            <div className="rounded-lg bg-red-100 p-1.5 md:p-2 dark:bg-red-950">
              <AlertTriangle className="h-3.5 w-3.5 text-red-600 md:h-4 md:w-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 md:text-xs">
                Acknowledged
              </p>
              <p className="text-lg font-bold text-amber-600 md:text-2xl">
                {stats.acknowledged}
              </p>
            </div>
            <div className="rounded-lg bg-amber-100 p-1.5 md:p-2 dark:bg-amber-950">
              <Clock className="h-3.5 w-3.5 text-amber-600 md:h-4 md:w-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 md:text-xs">
                Resolved
              </p>
              <p className="text-lg font-bold text-emerald-600 md:text-2xl">
                {stats.resolved}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-100 p-1.5 md:p-2 dark:bg-emerald-950">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600 md:h-4 md:w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
