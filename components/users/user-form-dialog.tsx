"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  UserRole,
  UserFormData,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
} from "@/types/user.type";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { DEMO_SITES } from "@/data/sites.data";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  onSuccess?: (data: any) => void;
  mode: "add" | "edit";
  currentUserRole: UserRole;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
  mode,
  currentUserRole,
}: UserFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    email: user?.email || "",
    name: user?.name || "",
    role: user?.role || "viewer",
    location: user?.location || {
      continent: "Africa",
      country: "Ethiopia",
      region: "",
      district: "",
    },
    phone: user?.phone || "",
    assignedSites: user?.assignedSites || [],
    password: "",
  });

  // Get available sites
  const sites = DEMO_SITES.map((site) => ({
    id: site.id,
    name: site.name,
    code: site.code,
  }));

  // Get available roles based on current user's role
  const getAvailableRoles = (): UserRole[] => {
    const hierarchy: Record<UserRole, number> = {
      admin: 5,
      country_manager: 4,
      regional_manager: 3,
      field_engineer: 2,
      technician: 1,
      viewer: 0,
    };

    const currentLevel = hierarchy[currentUserRole];
    const allRoles: UserRole[] = [
      "admin",
      "country_manager",
      "regional_manager",
      "field_engineer",
      "technician",
      "viewer",
    ];

    if (currentUserRole === "admin") {
      return allRoles;
    }

    return allRoles.filter((role) => hierarchy[role] < currentLevel);
  };

  const availableRoles = getAvailableRoles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate
      if (!formData.name || !formData.email) {
        toast.error("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      if (mode === "add" && !formData.password) {
        toast.error("Please enter a password");
        setIsLoading(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSuccess) {
        onSuccess(formData);
      }
      toast.success(
        `User ${mode === "add" ? "added" : "updated"} successfully`,
      );
      onOpenChange(false);
    } catch (error) {
      toast.error(`Failed to ${mode} user`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSiteToggle = (siteId: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedSites: prev.assignedSites.includes(siteId)
        ? prev.assignedSites.filter((id) => id !== siteId)
        : [...prev.assignedSites, siteId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl md:min-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New User" : "Edit User"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new user account"
              : "Update user information and permissions"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="e.g., John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@company.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          {mode === "add" && (
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as UserRole })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      <div>
                        <div>{ROLE_LABELS[role]}</div>
                        <div className="text-[10px] text-slate-400">
                          {ROLE_DESCRIPTIONS[role]}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+251-911-123-456"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Region *"
                value={formData.location.region}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, region: e.target.value },
                  })
                }
                required
              />
              <Input
                placeholder="District"
                value={formData.location.district}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      district: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Country"
                value={formData.location.country}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, country: e.target.value },
                  })
                }
              />
              <Input
                placeholder="Continent"
                value={formData.location.continent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      continent: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Assigned Sites</Label>
            <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto rounded-lg border p-3">
              {sites.length === 0 ? (
                <p className="text-sm text-slate-400 col-span-2">
                  No sites available
                </p>
              ) : (
                sites.map((site) => (
                  <div
                    key={site.id}
                    className={`
                      flex items-center gap-2 rounded-lg border p-2 cursor-pointer transition-colors
                      ${
                        formData.assignedSites.includes(site.id)
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800"
                      }
                    `}
                    onClick={() => handleSiteToggle(site.id)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.assignedSites.includes(site.id)}
                      onChange={() => handleSiteToggle(site.id)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    <label className="text-sm cursor-pointer">
                      {site.name} ({site.code})
                    </label>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-slate-400">
              {formData.assignedSites.length} sites selected
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "add" ? "Adding..." : "Saving..."}
                </>
              ) : mode === "add" ? (
                "Add User"
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
