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
import {
  User,
  UserRole,
  UserStatus,
  ROLE_LABELS,
  ROLE_COLORS,
  ROLE_ICONS,
} from "@/types/user.type";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  UserCheck,
  UserMinus,
  UserX,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/utils/transformer.utils";

interface UserTableProps {
  users: User[];
  onViewUser?: (userId: string) => void;
  onEditUser?: (userId: string) => void;
  onSuspendUser?: (userId: string) => void;
  onActivateUser?: (userId: string) => void;
}

export function UserTable({
  users,
  onViewUser,
  onEditUser,
  onSuspendUser,
  onActivateUser,
}: UserTableProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const statusBadges: Record<UserStatus, string> = {
    active:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    suspended:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    inactive: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  };

  const statusIcons: Record<UserStatus, string> = {
    active: "✅",
    suspended: "⛔",
    inactive: "❌",
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              {row.original.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{row.original.name}</p>
            <p className="text-xs text-slate-400">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as UserRole;
        return (
          <Badge className={ROLE_COLORS[role]}>
            <span className="mr-1">{ROLE_ICONS[role]}</span>
            {ROLE_LABELS[role]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as UserStatus;
        return (
          <Badge className={statusBadges[status]}>
            {statusIcons[status]}{" "}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div>
          <p className="text-sm">{row.original.location.region}</p>
          <p className="text-xs text-slate-400">
            {row.original.location.country}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "assignedSites",
      header: "Sites",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.assignedSites.length}</span>
      ),
    },
    {
      accessorKey: "lastActive",
      header: "Last Active",
      cell: ({ row }) => (
        <span className="text-xs text-slate-500">
          {row.original.lastActive
            ? formatTimeAgo(row.original.lastActive)
            : "Never"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                if (onViewUser) onViewUser(row.original.id);
                else router.push(`/users/${row.original.id}`);
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditUser?.(row.original.id)}>
              <UserCheck className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {row.original.status === "active" && (
              <DropdownMenuItem
                onClick={() => onSuspendUser?.(row.original.id)}
                className="text-amber-600"
              >
                <UserMinus className="mr-2 h-4 w-4" />
                Suspend
              </DropdownMenuItem>
            )}
            {row.original.status === "suspended" && (
              <DropdownMenuItem
                onClick={() => onActivateUser?.(row.original.id)}
                className="text-emerald-600"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Activate
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <UserX className="mr-2 h-4 w-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Mobile card columns
  const mobileColumns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              {row.original.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-slate-400">{row.original.email}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge className={ROLE_COLORS[row.original.role]}>
                {ROLE_ICONS[row.original.role]} {ROLE_LABELS[row.original.role]}
              </Badge>
              <Badge className={statusBadges[row.original.status]}>
                {statusIcons[row.original.status]}
              </Badge>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "",
      cell: ({ row }) => (
        <div className="text-xs text-slate-400">
          {row.original.location.region}, {row.original.location.country}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            if (onViewUser) onViewUser(row.original.id);
            else router.push(`/users/${row.original.id}`);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
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
              No users found
            </div>
          ) : (
            table.getRowModel().rows.map((row) => (
              <Card
                key={row.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  if (onViewUser) onViewUser(row.original.id);
                  else router.push(`/users/${row.original.id}`);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                          {row.original.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{row.original.name}</p>
                        <p className="text-xs text-slate-400">
                          {row.original.email}
                        </p>
                      </div>
                    </div>
                    <Badge className={statusBadges[row.original.status]}>
                      {statusIcons[row.original.status]}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge className={ROLE_COLORS[row.original.role]}>
                      {ROLE_ICONS[row.original.role]}{" "}
                      {ROLE_LABELS[row.original.role]}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {row.original.location.region},{" "}
                      {row.original.location.country}
                    </span>
                    <span className="text-xs text-slate-400">
                      • {row.original.assignedSites.length} sites
                    </span>
                    <span className="text-xs text-slate-400">
                      • Last:{" "}
                      {row.original.lastActive
                        ? formatTimeAgo(row.original.lastActive)
                        : "Never"}
                    </span>
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
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
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
          of {table.getRowCount()} users
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
