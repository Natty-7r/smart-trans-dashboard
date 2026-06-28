"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Home, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
            <div className="w-full max-w-md text-center ">
                <div className="space-y-2">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="rounded-full bg-amber-50 p-4 dark:bg-amber-950">
                                <AlertCircle className="h-12 w-12 text-amber-500" />
                            </div>
                            <div className="absolute -right-2 -top-2 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white">
                                404
                            </div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div>
                    <div className="rounded-lg bg-slate-50 p-4 text-left dark:bg-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            You might have:
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex items-center gap-2">
                                <span className="text-amber-500">•</span>
                                Typed the wrong URL
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-amber-500">•</span>
                                Followed a broken link
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-amber-500">•</span>
                                Accessed a page that was removed
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
                        asChild
                        className="w-full bg-emerald-600 hover:bg-emerald-700 sm:w-auto"
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
                        <span>Need help? Contact support</span>
                    </div>
                </div>
            </div>
        </div>
    );
}