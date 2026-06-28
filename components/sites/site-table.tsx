"use client";

import { TrafficLightIndicator } from "@/components/dashboard/traffic-light-indicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Site } from "@/types/site.type";
import { formatTimeAgo } from "@/utils/transformer.utils";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SiteTableProps {
    sites: Site[];
    onViewSite?: (siteId: string) => void;
}

export function SiteTable({ sites, onViewSite }: SiteTableProps) {
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const columns: ColumnDef<Site>[] = [
        {
            accessorKey: "code",
            header: "Site Code",
            cell: ({ row }) => (
                <span className="font-mono text-sm font-medium">{row.getValue("code")}</span>
            ),
        },
        {
            accessorKey: "name",
            header: "Site Name",
            cell: ({ row }) => (
                <div>
                    <p className="font-medium">{row.getValue("name")}</p>
                    <p className="text-xs text-slate-400">
                        {row.original.location.district}, {row.original.location.region}
                    </p>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <TrafficLightIndicator
                    status={row.getValue("status")}
                    size="sm"
                    showLabel={true}
                />
            ),
        },
        {
            accessorKey: "healthScore",
            header: "Health",
            cell: ({ row }) => {
                const score = row.getValue("healthScore") as number;
                return (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{score}%</span>
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${score}%`,
                                    backgroundColor:
                                        score >= 70 ? "#22C55E" : score >= 50 ? "#F59E0B" : "#EF4444",
                                }}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "activeAlerts",
            header: "Alerts",
            cell: ({ row }) => {
                const count = row.getValue("activeAlerts") as number;
                return count > 0 ? (
                    <Badge variant="destructive">{count}</Badge>
                ) : (
                    <Badge variant="outline" className="text-emerald-500">
                        0
                    </Badge>
                );
            },
        },
        {
            accessorKey: "technicians",
            header: "Technicians",
            cell: ({ row }) => (
                <span className="text-sm">{row.original.technicians.length}</span>
            ),
        },
        {
            accessorKey: "transformers",
            header: "Transformers",
            cell: ({ row }) => (
                <span className="text-sm">{row.original.transformers.length}</span>
            ),
        },
        {
            accessorKey: "lastUpdated",
            header: "Last Updated",
            cell: ({ row }) => (
                <span className="text-sm text-slate-500">
                    {formatTimeAgo(row.getValue("lastUpdated"))}
                </span>
            ),
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        if (onViewSite) {
                            onViewSite(row.original.id);
                        } else {
                            router.push(`/sites/${row.original.id}`);
                        }
                    }}
                >
                    <Eye className="h-4 w-4" />
                </Button>
            ),
        },
    ];

    const table = useReactTable({
        data: sites,
        columns,
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

    return (
        <div className="space-y-4">
            <div className="rounded-lg border">
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
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-8 text-slate-400">
                                    No sites found
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    onClick={() => {
                                        if (onViewSite) {
                                            onViewSite(row.original.id);
                                        } else {
                                            router.push(`/sites/${row.original.id}`);
                                        }
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getRowCount()
                    )}{" "}
                    of {table.getRowCount()} sites
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