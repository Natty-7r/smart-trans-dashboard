"use client";

import { useMemo } from "react";
import { useAuth } from "./use-auth";
import { UserRole } from "@/types/user.type";
import { Site } from "@/types/site.type";
import { Alert } from "@/types/alert.type";
import { Transformer } from "@/types/transformer.type";

export function useRoleBasedData() {
  const { user } = useAuth();

  // Filter sites based on user role and assigned sites
  const filterSites = (sites: Site[]): Site[] => {
    if (!user) return [];

    // Admin and country managers see all sites
    if (user.role === "admin" || user.role === "country_manager") {
      return sites;
    }

    // Regional managers see sites in their region
    if (user.role === "regional_manager") {
      return sites.filter(
        (site) => site.location.region === user.location.region,
      );
    }

    // Field engineers and technicians see only assigned sites
    if (
      user.role === "field_engineer" ||
      user.role === "technician" ||
      user.role === "viewer"
    ) {
      return sites.filter((site) => user.assignedSites.includes(site.id));
    }

    return sites;
  };

  // Filter alerts based on user role and assigned sites
  const filterAlerts = (alerts: Alert[]): Alert[] => {
    if (!user) return [];

    // Admin and country managers see all alerts
    if (user.role === "admin" || user.role === "country_manager") {
      return alerts;
    }

    // Regional managers see alerts from their region
    if (user.role === "regional_manager") {
      // This would need site region mapping
      return alerts.filter((alert) => {
        // Check if the alert's site is in the user's region
        // This requires site data to be passed or a mapping
        return true; // Placeholder
      });
    }

    // Field engineers see alerts from assigned sites
    if (user.role === "field_engineer" || user.role === "technician") {
      return alerts.filter((alert) =>
        user.assignedSites.includes(alert.siteId),
      );
    }

    // Viewers see limited alerts
    if (user.role === "viewer") {
      return alerts.filter(
        (alert) =>
          user.assignedSites.includes(alert.siteId) &&
          alert.severity === "critical",
      );
    }

    return alerts;
  };

  // Filter transformers based on user role
  const filterTransformers = (transformers: Transformer[]): Transformer[] => {
    if (!user) return [];

    if (user.role === "admin" || user.role === "country_manager") {
      return transformers;
    }

    if (user.role === "regional_manager") {
      return transformers.filter((t) => {
        // Check if transformer's site is in user's region
        return true; // Placeholder
      });
    }

    if (
      user.role === "field_engineer" ||
      user.role === "technician" ||
      user.role === "viewer"
    ) {
      return transformers.filter((t) => user.assignedSites.includes(t.siteId));
    }

    return transformers;
  };

  // Filter users based on user role (for user management)
  const filterUsers = (users: any[]): any[] => {
    if (!user) return [];

    // Admin sees all users
    if (user.role === "admin") {
      return users;
    }

    // Country managers see users in their country
    if (user.role === "country_manager") {
      return users.filter((u) => u.location.country === user.location.country);
    }

    // Regional managers see users in their region
    if (user.role === "regional_manager") {
      return users.filter((u) => u.location.region === user.location.region);
    }

    // Others see only themselves
    if (
      user.role === "field_engineer" ||
      user.role === "technician" ||
      user.role === "viewer"
    ) {
      return users.filter((u) => u.id === user.id);
    }

    return users;
  };

  // Get user's accessible site IDs
  const accessibleSiteIds = useMemo(() => {
    if (!user) return [];

    if (user.role === "admin" || user.role === "country_manager") {
      return []; // All sites (use empty array to indicate "all")
    }

    return user.assignedSites;
  }, [user]);

  // Check if user can access a specific site
  const canAccessSite = (siteId: string): boolean => {
    if (!user) return false;

    if (user.role === "admin" || user.role === "country_manager") {
      return true;
    }

    if (user.role === "regional_manager") {
      // Check if site is in user's region (requires site data)
      return true; // Placeholder
    }

    return user.assignedSites.includes(siteId);
  };

  // Check if user can access a specific alert
  const canAccessAlert = (alert: Alert): boolean => {
    if (!user) return false;

    if (user.role === "admin" || user.role === "country_manager") {
      return true;
    }

    if (user.role === "regional_manager") {
      return true; // Placeholder
    }

    return user.assignedSites.includes(alert.siteId);
  };

  return {
    user,
    accessibleSiteIds,
    filterSites,
    filterAlerts,
    filterTransformers,
    filterUsers,
    canAccessSite,
    canAccessAlert,
  };
}
