"use client";

import { useState, useEffect } from "react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, Phone, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CableCutAlertProps {
    siteId: string;
    siteName: string;
    location: string;
    timestamp: string;
    onDismiss?: () => void;
    onDispatch?: () => void;
    autoDispatch?: boolean;
    className?: string;
}

export function CableCutInstantAlert({
    siteId,
    siteName,
    location,
    timestamp,
    onDismiss,
    onDispatch,
    autoDispatch = false,
    className,
}: CableCutAlertProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isDispatching, setIsDispatching] = useState(false);

    // Auto-dispatch after 5 seconds if enabled
    useEffect(() => {
        if (autoDispatch) {
            const timer = setTimeout(() => {
                handleDispatch();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [autoDispatch]);

    const handleDismiss = () => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
    };

    const handleDispatch = () => {
        setIsDispatching(true);
        if (onDispatch) onDispatch();
        // Simulate dispatch
        setTimeout(() => {
            setIsDispatching(false);
        }, 2000);
    };

    if (!isVisible) return null;

    return (
        <Alert
            className={cn(
                "relative border-red-500 bg-red-50 dark:bg-red-950/30",
                "animate-in slide-in-from-top-4 duration-500",
                className
            )}
        >
            <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>

                <div className="flex-1 space-y-1">
                    <AlertTitle className="text-red-700 dark:text-red-400">
                        🚨 CABLE CUT DETECTED
                    </AlertTitle>
                    <AlertDescription className="text-red-600 dark:text-red-300">
                        <div className="space-y-1 text-sm">
                            <p className="font-medium">{siteName}</p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-red-500 dark:text-red-400">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(timestamp).toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                    Live
                                </span>
                            </div>
                        </div>
                    </AlertDescription>
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                    <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1.5"
                        onClick={handleDispatch}
                        disabled={isDispatching}
                    >
                        <Phone className="h-3.5 w-3.5" />
                        {isDispatching ? "Dispatching..." : "Dispatch Team"}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50"
                        onClick={handleDismiss}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Auto-dispatch countdown indicator */}
            {autoDispatch && !isDispatching && (
                <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-red-200 dark:bg-red-800">
                    <div
                        className="h-full animate-[progress_5s_linear] rounded-full bg-red-500"
                        style={{
                            animation: "progress 5s linear forwards",
                            width: "100%",
                        }}
                    />
                </div>
            )}

            <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
        </Alert>
    );
}