"use client";

import { UserStats } from "@/types/user.type";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, UserMinus, Shield } from "lucide-react";

interface UserStatsProps {
  stats: UserStats;
}

export function UserStatsCards({ stats }: UserStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 md:text-xs">
                Total Users
              </p>
              <p className="text-lg font-bold md:text-2xl">{stats.total}</p>
            </div>
            <div className="rounded-lg bg-slate-100 p-1.5 md:p-2 dark:bg-slate-800">
              <Users className="h-3.5 w-3.5 text-slate-500 md:h-4 md:w-4" />
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
              <p className="text-lg font-bold text-emerald-600 md:text-2xl">
                {stats.active}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-100 p-1.5 md:p-2 dark:bg-emerald-950">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600 md:h-4 md:w-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 md:text-xs">
                Suspended
              </p>
              <p className="text-lg font-bold text-amber-600 md:text-2xl">
                {stats.suspended}
              </p>
            </div>
            <div className="rounded-lg bg-amber-100 p-1.5 md:p-2 dark:bg-amber-950">
              <UserMinus className="h-3.5 w-3.5 text-amber-600 md:h-4 md:w-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 md:text-xs">
                Inactive
              </p>
              <p className="text-lg font-bold text-red-600 md:text-2xl">
                {stats.inactive}
              </p>
            </div>
            <div className="rounded-lg bg-red-100 p-1.5 md:p-2 dark:bg-red-950">
              <UserX className="h-3.5 w-3.5 text-red-600 md:h-4 md:w-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
