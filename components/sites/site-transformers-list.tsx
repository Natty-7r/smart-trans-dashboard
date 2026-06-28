"use client";

import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight } from "lucide-react";

interface TransformerSummary {
    id: string;
    type: string;
    status: "nominal" | "alarm" | "critical";
    healthScore: number;
}

interface SiteTransformersListProps {
    transformers: TransformerSummary[];
}

export function SiteTransformersList({ transformers }: SiteTransformersListProps) {
    const router = useRouter();

    const getStatusColor = (status: TransformerSummary["status"]) => {
        const colors = {
            nominal: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
            alarm: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
            critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
        };
        return colors[status];
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Transformers</CardTitle>
            </CardHeader>
            <CardContent>
                {transformers.length === 0 ? (
                    <div className="text-center py-6 text-sm text-slate-400">
                        No transformers assigned
                    </div>
                ) : (
                    <div className="space-y-2">
                        {transformers.map((transformer) => (
                            <div
                                key={transformer.id}
                                className="flex items-center justify-between rounded-lg border p-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                        <Zap className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{transformer.id}</p>
                                        <p className="text-xs text-slate-400">{transformer.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className={getStatusColor(transformer.status)}>
                                        {transformer.status}
                                    </Badge>
                                    <span className="text-xs text-slate-400">
                                        Health: {transformer.healthScore}%
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        className="h-7 w-7"
                                        onClick={() =>
                                            router.push(`/transformers/${transformer.id}`)
                                        }
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}