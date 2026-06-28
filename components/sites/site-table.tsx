"use client";

import { TrafficLightIndicator } from "@/components/dashboard/traffic-light-indicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { ChevronLeft, ChevronRight, Eye, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SiteTableProps {
    sites: Site[];
    onViewSite?: (siteId: string) => void;
}

export function SiteTable({ sites, onViewSite }: SiteTableProps) {
    const router = useRouter();
    const isMobile = useIsMobile();
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
                <span className="font-mono text-xs font-medium md:text-sm">{row.getValue("code")}</span>
            ),
        },
        {
            accessorKey: "name",
            header: "Site Name",
            cell: ({ row }) => (
                <div>
                    <p className="text-sm font-medium md:text-base">{row.getValue("name")}</p>
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
                    size={isMobile ? "sm" : "sm"}
                    showLabel={!isMobile}
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
                        {!isMobile && (
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
                        )}
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
                    <Badge variant="destructive" className="text-xs">{count}</Badge>
                ) : (
                    <Badge variant="outline" className="text-emerald-500 text-xs">
                        0
                    </Badge>
                );
            },
        },
        {
            accessorKey: "technicians",
            header: "Techs",
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
            header: "Updated",
            cell: ({ row }) => (
                <span className="text-xs text-slate-500 md:text-sm">
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
                    size={isMobile ? "icon-sm" : "sm"}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onViewSite) {
                            onViewSite(row.original.id);
                        } else {
                            router.push(`/sites/${row.original.id}`);
                        }
                    }}
                >
                    <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </Button>
            ),
        },
    ];

    // Mobile card view columns (shorter list)
    const mobileColumns: ColumnDef<Site>[] = [
        {
            accessorKey: "code",
            header: "Site",
            cell: ({ row }) => (
                <div>
                    <p className="font-mono text-xs font-medium">{row.getValue("code")}</p>
                    <p className="text-sm font-medium">{row.getValue("name")}</p>
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
                    showLabel={false}
                />
            ),
        },
        {
            accessorKey: "healthScore",
            header: "Health",
            cell: ({ row }) => {
                const score = row.getValue("healthScore") as number;
                return <span className="text-sm font-bold">{score}%</span>;
            },
        },
        {
            accessorKey: "activeAlerts",
            header: "Alerts",
            cell: ({ row }) => {
                const count = row.getValue("activeAlerts") as number;
                return count > 0 ? (
                    <Badge variant="destructive" className="text-xs">{count}</Badge>
                ) : (
                    <Badge variant="outline" className="text-emerald-500 text-xs">0</Badge>
                );
            },
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onViewSite) {
                            onViewSite(row.original.id);
                        } else {
                            router.push(`/sites/${row.original.id}`);
                        }
                    }}
                >
                    <Eye className="h-3.5 w-3.5" />
                </Button>
            ),
        },
    ];

    const table = useReactTable({
        data: sites,
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
        // Mobile card view
        return (
            <div className="space-y-4">
                <div className="space-y-3">
                    {table.getRowModel().rows.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">No sites found</div>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <Card
                                key={row.id}
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => {
                                    if (onViewSite) {
                                        onViewSite(row.original.id);
                                    } else {
                                        router.push(`/sites/${row.original.id}`);
                                    }
                                }}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-mono text-xs text-slate-400">{row.original.code}</p>
                                            <p className="font-bold">{row.original.name}</p>
                                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                                <MapPin className="h-3 w-3" />
                                                {row.original.location.district}, {row.original.location.region}
                                            </div>
                                        </div>
                                        <TrafficLightIndicator
                                            status={row.original.status}
                                            size="sm"
                                            showLabel={false}
                                        />
                                    </div>
                                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                                        <span className="font-bold">{row.original.healthScore}%</span>
                                        <span className="text-slate-300">|</span>
                                        <span>Techs: {row.original.technicians.length}</span>
                                        <span className="text-slate-300">|</span>
                                        <span>Transformers: {row.original.transformers.length}</span>
                                        <span className="text-slate-300">|</span>
                                        {row.original.activeAlerts > 0 ? (
                                            <Badge variant="destructive" className="text-xs">
                                                {row.original.activeAlerts} alerts
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-emerald-500 text-xs">
                                                No alerts
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="mt-2 text-xs text-slate-400">
                                        Updated: {formatTimeAgo(row.original.lastUpdated)}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-xs text-slate-500">
                        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                            table.getRowCount()
                        )} of {table.getRowCount()}
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
                            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
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

    // Desktop table view
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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