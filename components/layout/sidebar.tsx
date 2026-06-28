"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    AlertTriangle,
    Activity,
    Map,
    Settings,
    LogOut,
    Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/logo";
import { signOutAction } from "@/lib/actions/auth.action";
import { toast } from "sonner";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Live Monitoring", href: "/live", icon: Activity },
    { name: "Alerts", href: "/alerts", icon: AlertTriangle },
    { name: "Site Map", href: "/map", icon: Map },
    { name: "Analytics", href: "/analytics", icon: Gauge },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

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

    return (
        <aside className="flex h-full w-64 flex-col border-r bg-white dark:bg-slate-950">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-4">
                <Logo size='lg' variant="full" href="/" />
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
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
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950 dark:hover:text-red-400"
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
        </aside>
    );
}