"use client";

import { Logo } from "@/components/common/logo";
import { useAuth } from "@/hooks/use-auth";
import { signOutAction } from "@/lib/actions/auth.action";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/user.type";
import {
  Activity,
  AlertTriangle,
  Gauge,
  Layers,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

// Define what each role can see
const getNavigationForRole = (role: UserRole) => {
  // Base navigation for all users
  const baseNav = [{ name: "Dashboard", href: "/", icon: LayoutDashboard }];

  // Role-specific navigation
  const roleNav: Record<
    UserRole,
    Array<{ name: string; href: string; icon: any }>
  > = {
    admin: [
      { name: "Sites", href: "/sites", icon: Layers },
      { name: "Live Monitoring", href: "/live", icon: Activity },
      { name: "Alerts", href: "/alerts", icon: AlertTriangle },
      { name: "Users", href: "/users", icon: Users },
      { name: "Analytics", href: "/analytics", icon: Gauge },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
    country_manager: [
      { name: "Sites", href: "/sites", icon: Layers },
      { name: "Live Monitoring", href: "/live", icon: Activity },
      { name: "Alerts", href: "/alerts", icon: AlertTriangle },
      { name: "Users", href: "/users", icon: Users },
      { name: "Analytics", href: "/analytics", icon: Gauge },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
    regional_manager: [
      { name: "Sites", href: "/sites", icon: Layers },
      { name: "Live Monitoring", href: "/live", icon: Activity },
      { name: "Alerts", href: "/alerts", icon: AlertTriangle },
      { name: "Users", href: "/users", icon: Users },
      { name: "Analytics", href: "/analytics", icon: Gauge },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
    field_engineer: [
      { name: "My Sites", href: "/sites", icon: Layers },
      { name: "My Alerts", href: "/alerts", icon: AlertTriangle },
      { name: "Live Monitoring", href: "/live", icon: Activity },
    ],
    technician: [
      { name: "My Sites", href: "/sites", icon: Layers },
      { name: "My Alerts", href: "/alerts", icon: AlertTriangle },
    ],
    viewer: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Sites", href: "/sites", icon: Layers },
    ],
  };

  return [...baseNav, ...(roleNav[role] || [])];
};

export function Sidebar({ isMobile = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOutAction();
      toast.success("Logged out successfully");
      router.push("/auth/signin");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  // Get navigation based on user role
  const navigation = user ? getNavigationForRole(user.role) : [];

  // Check if current path matches the nav item (including nested routes)
  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href) ?? false;
  };

  // Get user display info
  const getUserDisplay = () => {
    if (!user) return { name: "Guest", role: "guest", initials: "G" };
    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("");
    const roleLabels: Record<UserRole, string> = {
      admin: "Admin",
      country_manager: "Country Manager",
      regional_manager: "Regional Manager",
      field_engineer: "Field Engineer",
      technician: "Technician",
      viewer: "Viewer",
    };
    return {
      name: user.name,
      role: roleLabels[user.role] || user.role,
      initials,
    };
  };

  const userDisplay = getUserDisplay();

  return (
    <div className="flex h-full w-full flex-col">
      {/* Logo + Close button (mobile) */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Logo size="lg" variant="full" href="/" />
        {isMobile && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
        )}
      </div>

      {/* User info */}
      {user && (
        <div className="border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <span className="text-sm font-medium">
                {userDisplay.initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userDisplay.name}</p>
              <p className="text-xs text-slate-400 truncate">
                {userDisplay.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item) => {
          const isActive = isActiveRoute(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950 dark:hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
        <div className="mt-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Live
          </span>
          <span className="ml-4">Connected</span>
        </div>
      </div>
    </div>
  );
}
