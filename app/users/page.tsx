"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEMO_USERS, getUserStats } from "@/data/users.data";
import { UserFilters, UserRole } from "@/types/user.type";
import { UserFiltersComponent } from "@/components/users/user-filters";
import { UserStatsCards } from "@/components/users/user-stats";
import { UserTable } from "@/components/users/user-table";
import { UserFormDialog } from "@/components/users/user-form-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useRoleBasedData } from "@/hooks/use-role-based-data";

export default function UsersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { filterUsers } = useRoleBasedData();
  const [filters, setFilters] = useState<UserFilters>({
    role: "all",
    status: "all",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Get stats from all users (for admin view)
  const stats = getUserStats();

  // Filter users based on role and filters
  const filteredUsers = useMemo(() => {
    // First apply role-based filtering
    let roleFiltered = filterUsers(DEMO_USERS);

    // Then apply search and filter
    return roleFiltered.filter((user) => {
      // Search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const match =
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.location.region.toLowerCase().includes(searchLower) ||
          user.location.country.toLowerCase().includes(searchLower);
        if (!match) return false;
      }

      // Role
      if (filters.role && filters.role !== "all") {
        if (user.role !== filters.role) return false;
      }

      // Status
      if (filters.status && filters.status !== "all") {
        if (user.status !== filters.status) return false;
      }

      // Country
      if (filters.country) {
        if (user.location.country !== filters.country) return false;
      }

      // Region
      if (filters.region) {
        if (user.location.region !== filters.region) return false;
      }

      // District
      if (filters.district) {
        if (user.location.district !== filters.district) return false;
      }

      return true;
    });
  }, [filters, filterUsers]);

  // Check if user can add users (only admin and country/regional managers)
  const canAddUsers =
    user?.role === "admin" ||
    user?.role === "country_manager" ||
    user?.role === "regional_manager";

  const handleViewUser = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  const handleEditUser = (userId: string) => {
    router.push(`/users/${userId}/edit`);
  };

  const handleSuspendUser = (userId: string) => {
    // Implementation
    console.log("Suspend user:", userId);
  };

  const handleActivateUser = (userId: string) => {
    // Implementation
    console.log("Activate user:", userId);
  };

  const handleClearFilters = () => {
    setFilters({ role: "all", status: "all" });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold md:text-2xl">Users</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 md:text-sm">
            Manage users and their permissions across the platform
          </p>
        </div>
        {canAddUsers && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </div>

      {/* Stats - only show full stats for admin */}
      {user?.role === "admin" || user?.role === "country_manager" ? (
        <UserStatsCards stats={stats} />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg border p-4 text-center">
            <p className="text-2xl font-bold">{filteredUsers.length}</p>
            <p className="text-xs text-slate-400">Users in your view</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <UserFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Results count */}
      <div className="text-sm text-slate-500">
        Showing {filteredUsers.length} of {DEMO_USERS.length} users
        {filters.role && filters.role !== "all" && ` (${filters.role})`}
        {filters.status && filters.status !== "all" && ` • ${filters.status}`}
      </div>

      {/* Table */}
      <UserTable
        users={filteredUsers}
        onViewUser={handleViewUser}
        onEditUser={handleEditUser}
        onSuspendUser={handleSuspendUser}
        onActivateUser={handleActivateUser}
      />

      {/* Add User Dialog */}
      {canAddUsers && (
        <UserFormDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          mode="add"
          currentUserRole={user?.role || "admin"}
          onSuccess={() => {
            setIsAddDialogOpen(false);
            // Refresh data
          }}
        />
      )}
    </div>
  );
}
