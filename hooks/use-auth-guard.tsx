"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { isAuthenticated } from "@/lib/actions/auth.action";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Skip auth check for auth pages
            if (pathname.startsWith("/auth")) {
                setIsLoading(false);
                return;
            }

            try {
                const authenticated = await isAuthenticated();
                if (!authenticated) {
                    router.replace("/auth/signin");
                }
            } catch (error) {
                console.error("Auth check error:", error);
                router.replace("/auth/signin");
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

    // Show loading while checking auth (only for non-auth pages)
    if (isLoading && !pathname.startsWith("/auth")) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
                    <p className="mt-2 text-sm text-slate-500">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}