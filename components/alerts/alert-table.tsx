"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertSeverity, AlertStatus } from "@/types/alert.type";
import {
  SEVERITY_COLORS,
  SEVERITY_ICONS,
  SEVERITY_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  ALERT_TYPE_LABELS,
} from "@/data/alerts.data";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTimeAgo } from "@/utils/transformer.utils";

interface AlertTableProps {
  alerts: Alert[];
  onViewAlert?: (alertId: string) => void;
}

export function AlertTable({ alerts, onViewAlert }: AlertTableProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<Alert>[] = [
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => {
        const severity = row.getValue("severity") as AlertSeverity;
        return (
          <div className="flex items-center gap-1.5">
            <span>{SEVERITY_ICONS[severity]}</span>
            <Badge className={SEVERITY_COLORS[severity]}>
              {SEVERITY_LABELS[severity]}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "siteName",
      header: "Site",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium">{row.getValue("siteName")}</p>
          <p className="text-xs text-slate-400">{row.original.siteCode}</p>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="text-sm">
          {ALERT_TYPE_LABELS[
            row.getValue("type") as keyof typeof ALERT_TYPE_LABELS
          ] || row.getValue("type")}
        </span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium">{row.getValue("title")}</p>
          <p className="text-xs text-slate-400 truncate max-w-[200px]">
            {row.original.message}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as AlertStatus;
        return (
          <Badge className={STATUS_COLORS[status]}>
            {STATUS_LABELS[status]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "timestamp",
      header: "Time",
      cell: ({ row }) => (
        <span className="text-xs text-slate-500">
          {formatTimeAgo(row.getValue("timestamp"))}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size={isMobile ? "icon-sm" : "sm"}
          onClick={(e) => {
            e.stopPropagation();
            if (onViewAlert) {
              onViewAlert(row.original.id);
            } else {
              router.push(`/alerts/${row.original.id}`);
            }
          }}
        >
          <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </Button>
      ),
    },
  ];

  // Mobile card columns (shorter list)
  const mobileColumns: ColumnDef<Alert>[] = [
    {
      accessorKey: "severity",
      header: "",
      cell: ({ row }) => {
        const severity = row.getValue("severity") as AlertSeverity;
        return (
          <div className="flex items-center gap-1.5">
            <span>{SEVERITY_ICONS[severity]}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Alert",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium">{row.getValue("title")}</p>
          <p className="text-xs text-slate-400">{row.original.siteName}</p>
          <p className="text-xs text-slate-400">
            {formatTimeAgo(row.original.timestamp)}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "",
      cell: ({ row }) => {
        const status = row.getValue("status") as AlertStatus;
        return (
          <Badge className={STATUS_COLORS[status]}>
            {STATUS_LABELS[status]}
          </Badge>
        );
      },
    },
  ];

  const table = useReactTable({
    data: alerts,
    columns: isMobile ? mobileColumns : columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          {table.getRowModel().rows.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-400">
              No alerts found
            </div>
          ) : (
            table.getRowModel().rows.map((row) => (
              <Card
                key={row.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  if (onViewAlert) {
                    onViewAlert(row.original.id);
                  } else {
                    router.push(`/alerts/${row.original.id}`);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span>{SEVERITY_ICONS[row.original.severity]}</span>
                        <p className="font-bold">{row.original.title}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {row.original.message}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span>{row.original.siteName}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(row.original.timestamp)}</span>
                        <Badge
                          className={SEVERITY_COLORS[row.original.severity]}
                        >
                          {SEVERITY_LABELS[row.original.severity]}
                        </Badge>
                        <Badge className={STATUS_COLORS[row.original.status]}>
                          {STATUS_LABELS[row.original.status]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-xs text-slate-500">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
            -
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getRowCount(),
            )}{" "}
            of {table.getRowCount()}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs">
              {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-slate-400"
                >
                  No alerts found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  onClick={() => {
                    if (onViewAlert) {
                      onViewAlert(row.original.id);
                    } else {
                      router.push(`/alerts/${row.original.id}`);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-500">
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getRowCount(),
          )}{" "}
          of {table.getRowCount()} alerts
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
