"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

// Routes where we DON'T want sidebar + header
const AUTH_ROUTES = [
    "/auth/signin",
    "/auth/forgot-password",
    "/auth/forgot-password-otp",
    "/auth/update-password",
];

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isMobile = useIsMobile();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    // Close sidebar on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isSidebarOpen]);

    // Lock body scroll when sidebar is open (mobile)
    useEffect(() => {
        if (isMobile && isSidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobile, isSidebarOpen]);

    // Check if current route is an auth route
    const isAuthPath = pathname?.startsWith("/auth") ?? false;

    // If auth route → render WITHOUT sidebar + header
    if (isAuthPath) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
                {children}
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Mobile overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out dark:bg-slate-950",
                    isMobile ? (isSidebarOpen ? "translate-x-0" : "-translate-x-full") : "relative translate-x-0",
                    "border-r border-slate-200 dark:border-slate-800"
                )}
            >
                <Sidebar isMobile={isMobile} onClose={() => setIsSidebarOpen(false)} />
            </aside>

            {/* Main content */}
            <div
                className={cn(
                    "flex flex-1 flex-col overflow-hidden transition-all duration-300",
                    !isMobile && "ml-0"
                )}
            >
                {/* Header with mobile menu button */}
                <Header
                    isMobile={isMobile}
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    isSidebarOpen={isSidebarOpen}
                />

                {/* Main content */}
                <main className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}