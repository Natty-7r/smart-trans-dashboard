"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

// Routes where we DON'T want sidebar + header
const AUTH_ROUTES = [
    "/auth/signin",
    "/auth/forgot-password",
    "/auth/forgot-password-otp",
    "/auth/update-password",
];

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Check if current route is an auth route
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);
    // OR: check if pathname starts with /auth
    const isAuthPath = pathname?.startsWith("/auth") ?? false;

    // If auth route → render WITHOUT sidebar + header
    if (isAuthPath) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
                {children}
            </div>
        );
    }

    // Otherwise → render WITH sidebar + header
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
                    {children}
                </main>
            </div>
        </div>
    );
}