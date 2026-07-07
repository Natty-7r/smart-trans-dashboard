// ============================================================
// USER TYPES
// ============================================================

export type UserRole =
  | "admin"
  | "country_manager"
  | "regional_manager"
  | "field_engineer"
  | "technician"
  | "viewer";

export type UserStatus = "active" | "suspended" | "inactive";

export interface UserLocation {
  continent: string;
  country: string;
  region: string;
  district: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  location: UserLocation;
  phone?: string;
  avatar?: string;
  assignedSites: string[]; // Site IDs
  createdAt: string;
  lastActive?: string;
  updatedAt: string;
  suspendedAt?: string;
  suspendedReason?: string;
  createdBy?: string;
}

export interface UserFormData {
  email: string;
  name: string;
  role: UserRole;
  location: UserLocation;
  phone?: string;
  assignedSites: string[];
  password?: string;
}

export interface UserFilters {
  search?: string;
  role?: UserRole | "all";
  status?: UserStatus | "all";
  country?: string;
  region?: string;
  district?: string;
}

export interface UserStats {
  total: number;
  byRole: Record<UserRole, number>;
  byStatus: Record<UserStatus, number>;
  active: number;
  suspended: number;
  inactive: number;
}

// ============================================================
// ROLE HIERARCHY
// ============================================================

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 5,
  country_manager: 4,
  regional_manager: 3,
  field_engineer: 2,
  technician: 1,
  viewer: 0,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  country_manager: "Country Manager",
  regional_manager: "Regional Manager",
  field_engineer: "Field Engineer",
  technician: "Technician",
  viewer: "Viewer",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: "Full system access, can manage all users and settings",
  country_manager: "Can manage all sites and users within their country",
  regional_manager: "Can manage sites and users within their region",
  field_engineer: "Can view and manage assigned sites, acknowledge alerts",
  technician: "Can view assigned sites and perform maintenance tasks",
  viewer: "Read-only access to assigned sites",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  country_manager:
    "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  regional_manager:
    "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  field_engineer:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  technician:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  viewer: "bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-400",
};

export const ROLE_ICONS: Record<UserRole, string> = {
  admin: "👑",
  country_manager: "🌍",
  regional_manager: "📍",
  field_engineer: "🔧",
  technician: "🛠️",
  viewer: "👀",
};

// ============================================================
// PERMISSIONS
// ============================================================

export interface Permissions {
  canManageUsers: boolean;
  canManageSites: boolean;
  canManageAlerts: boolean;
  canViewAnalytics: boolean;
  canAssignTechnicians: boolean;
  canAcknowledgeAlerts: boolean;
  canResolveAlerts: boolean;
  canViewSensitiveData: boolean;
  canManageSystem: boolean;
}

export const getPermissions = (role: UserRole): Permissions => {
  const basePermissions: Permissions = {
    canManageUsers: false,
    canManageSites: false,
    canManageAlerts: false,
    canViewAnalytics: false,
    canAssignTechnicians: false,
    canAcknowledgeAlerts: false,
    canResolveAlerts: false,
    canViewSensitiveData: false,
    canManageSystem: false,
  };

  switch (role) {
    case "admin":
      return {
        canManageUsers: true,
        canManageSites: true,
        canManageAlerts: true,
        canViewAnalytics: true,
        canAssignTechnicians: true,
        canAcknowledgeAlerts: true,
        canResolveAlerts: true,
        canViewSensitiveData: true,
        canManageSystem: true,
      };
    case "country_manager":
      return {
        ...basePermissions,
        canManageUsers: true,
        canManageSites: true,
        canManageAlerts: true,
        canViewAnalytics: true,
        canAssignTechnicians: true,
        canAcknowledgeAlerts: true,
        canResolveAlerts: true,
        canViewSensitiveData: true,
      };
    case "regional_manager":
      return {
        ...basePermissions,
        canManageSites: true,
        canManageAlerts: true,
        canViewAnalytics: true,
        canAssignTechnicians: true,
        canAcknowledgeAlerts: true,
        canResolveAlerts: true,
        canViewSensitiveData: true,
      };
    case "field_engineer":
      return {
        ...basePermissions,
        canManageSites: true,
        canManageAlerts: true,
        canAssignTechnicians: true,
        canAcknowledgeAlerts: true,
        canResolveAlerts: true,
      };
    case "technician":
      return {
        ...basePermissions,
        canAcknowledgeAlerts: true,
        canResolveAlerts: true,
      };
    case "viewer":
      return basePermissions;
    default:
      return basePermissions;
  }
};

// ============================================================
// ROLE HIERARCHY HELPERS
// ============================================================

export const canManageRole = (
  currentRole: UserRole,
  targetRole: UserRole,
): boolean => {
  return ROLE_HIERARCHY[currentRole] > ROLE_HIERARCHY[targetRole];
};

export const getAvailableRoles = (currentRole: UserRole): UserRole[] => {
  const allRoles: UserRole[] = [
    "admin",
    "country_manager",
    "regional_manager",
    "field_engineer",
    "technician",
    "viewer",
  ];
  const currentLevel = ROLE_HIERARCHY[currentRole];
  return allRoles.filter((role) => ROLE_HIERARCHY[role] < currentLevel);
};

export const canViewUser = (
  currentRole: UserRole,
  targetRole: UserRole,
): boolean => {
  return ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[targetRole];
};

export const canEditUser = (
  currentRole: UserRole,
  targetRole: UserRole,
): boolean => {
  return (
    ROLE_HIERARCHY[currentRole] > ROLE_HIERARCHY[targetRole] ||
    currentRole === "admin"
  );
};
