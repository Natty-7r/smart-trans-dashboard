"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Home, RefreshCw, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    const router = useRouter();

    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
            <div className="w-full max-w-md text-center ">
                <div className="space-y-2">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="rounded-full bg-red-50 p-4 dark:bg-red-950">
                                <AlertTriangle className="h-12 w-12 text-red-500" />
                            </div>
                            <div className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
                                500
                            </div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Something Went Wrong</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        We're sorry, but an unexpected error occurred. Our team has been notified.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Error details (only in development) */}
                    {process.env.NODE_ENV === "development" && (
                        <div className="rounded-lg bg-red-50 p-4 text-left dark:bg-red-950/30">
                            <p className="text-xs font-medium text-red-600 dark:text-red-400">
                                Error Details (Development Only)
                            </p>
                            <p className="mt-1 text-xs text-red-500 dark:text-red-300">
                                {error.message || "Unknown error"}
                            </p>
                            {error.digest && (
                                <p className="mt-1 text-xs text-red-400 dark:text-red-400">
                                    Error ID: {error.digest}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Helpful tips */}
                    <div className="rounded-lg bg-slate-50 p-4 text-left dark:bg-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            You can try:
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex items-center gap-2">
                                <span className="text-red-500">•</span>
                                Refreshing the page
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-red-500">•</span>
                                Checking your internet connection
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-red-500">•</span>
                                Trying again later
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="w-full sm:w-auto"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                    <Button
                        onClick={reset}
                        className="w-full bg-red-600 hover:bg-red-700 sm:w-auto"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="w-full sm:w-auto"
                    >
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>
                </div>

                <div className="mt-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
                        <Zap className="h-3 w-3" />
                        <span>Smart</span>
                        <span className="font-semibold text-emerald-600">Trans</span>
                        <span>•</span>
                        <span>Error ID: {error.digest || "unknown"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}