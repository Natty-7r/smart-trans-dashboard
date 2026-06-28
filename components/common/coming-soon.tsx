"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Construction, ArrowLeft, Home, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ComingSoonProps {
    title?: string;
    description?: string;
    estimatedDate?: string;
    features?: string[];
    showBackButton?: boolean;
    showHomeButton?: boolean;
    backHref?: string;
    className?: string;
    children?: ReactNode;
}

export function ComingSoon({
    title = "Coming Soon",
    description = "We're working on something amazing. This feature is under development.",
    estimatedDate,
    features = [],
    showBackButton = true,
    showHomeButton = true,
    backHref = "/",
    className,
    children,
}: ComingSoonProps) {
    const defaultFeatures = [
        "Real-time data streaming",
        "Advanced analytics dashboard",
        "Predictive maintenance alerts",
        "Mobile app integration",
    ];

    const displayFeatures = features.length > 0 ? features : defaultFeatures;

    return (
        <div
            className={cn(
                "flex min-h-[60vh] items-center justify-center p-4",
                className
            )}
        >
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader className="space-y-4 text-center">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="rounded-full bg-amber-50 p-4 dark:bg-amber-950">
                                <Construction className="h-12 w-12 text-amber-500" />
                            </div>
                            <Badge
                                variant="outline"
                                className="absolute -right-2 -top-2 border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-700 dark:bg-amber-900 dark:text-amber-300"
                            >
                                In Progress
                            </Badge>
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                        <div className="mt-1 flex items-center justify-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Estimated date */}
                    {estimatedDate && (
                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800">
                            <span className="font-medium">Estimated release:</span>
                            <span className="text-emerald-600 dark:text-emerald-400">
                                {estimatedDate}
                            </span>
                        </div>
                    )}
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Features list */}
                    <div>
                        <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                            What's coming:
                        </h3>
                        <ul className="grid gap-2 sm:grid-cols-2">
                            {displayFeatures.map((feature, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2 text-sm dark:border-slate-800"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-slate-600 dark:text-slate-300">
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Custom children */}
                    {children && (
                        <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                            {children}
                        </div>
                    )}

                    {/* Progress indicator */}
                    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 dark:text-slate-400">
                                Development Progress
                            </span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                {Math.floor(Math.random() * 30 + 40)}%
                            </span>
                        </div>
                        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-1000"
                                style={{ width: `${Math.floor(Math.random() * 30 + 40)}%` }}
                            />
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    {showBackButton && (
                        <Button
                            variant="outline"
                            asChild
                            className="w-full sm:w-auto"
                        >
                            <Link href={backHref}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Go Back
                            </Link>
                        </Button>
                    )}

                    {showHomeButton && (
                        <Button
                            asChild
                            className="w-full bg-emerald-600 hover:bg-emerald-700 sm:w-auto"
                        >
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Go Home
                            </Link>
                        </Button>
                    )}

                    {/* Notify button */}
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => {
                            // Show toast notification
                            import("sonner").then(({ toast }) => {
                                toast.success("We'll notify you when this feature is ready!");
                            });
                        }}
                    >
                        <Zap className="mr-2 h-4 w-4" />
                        Notify Me
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}