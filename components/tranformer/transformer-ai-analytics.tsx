"use client";

import { Transformer, TransformerReading } from "@/types/transformer.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Activity,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Zap,
    Shield,
    Clock,
    Brain,
    Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TransformerAIAnalyticsProps {
    transformer: Transformer;
    readings: TransformerReading[];
}

export function TransformerAIAnalytics({
    transformer,
    readings,
}: TransformerAIAnalyticsProps) {
    // Calculate trends
    const recentReadings = readings.slice(-10);
    const avgHealth = recentReadings.reduce((acc, r) => acc + r.healthScore, 0) / recentReadings.length;
    const healthTrend = recentReadings.length > 1
        ? recentReadings[recentReadings.length - 1].healthScore - recentReadings[0].healthScore
        : 0;

    // Simulate AI insights
    const insights = generateAIInsights(transformer, readings);

    return (
        <div className="space-y-4">
            {/* Health Overview */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Brain className="h-4 w-4 text-purple-500" />
                        AI Health Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <p className="text-sm text-slate-400">Current Health</p>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-bold">{transformer.healthScore}%</span>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "h-6",
                                        transformer.healthScore >= 70 && "border-emerald-200 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400",
                                        transformer.healthScore >= 50 && transformer.healthScore < 70 && "border-amber-200 text-amber-600 dark:border-amber-800 dark:text-amber-400",
                                        transformer.healthScore < 50 && "border-red-200 text-red-600 dark:border-red-800 dark:text-red-400"
                                    )}
                                >
                                    {transformer.healthScore >= 70 ? "Good" : transformer.healthScore >= 50 ? "Fair" : "Poor"}
                                </Badge>
                            </div>
                            <Progress
                                value={transformer.healthScore}
                                className="mt-1 h-2"
                            />
                            {/* FIX: Use a wrapper div for custom styling */}
                            <div className="relative">
                                <div
                                    className={cn(
                                        "absolute -mt-1 h-2 rounded-full transition-all",
                                        transformer.healthScore >= 70 ? "bg-emerald-500" :
                                            transformer.healthScore >= 50 ? "bg-amber-500" : "bg-red-500"
                                    )}
                                    style={{ width: `${transformer.healthScore}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">7-Day Trend</p>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold">
                                    {healthTrend > 0 ? "+" : ""}{healthTrend.toFixed(1)}%
                                </span>
                                {healthTrend > 0 ? (
                                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                                ) : healthTrend < 0 ? (
                                    <TrendingDown className="h-5 w-5 text-red-500" />
                                ) : (
                                    <Activity className="h-5 w-5 text-slate-400" />
                                )}
                            </div>
                            <p className="text-xs text-slate-400">
                                {healthTrend > 0 ? "Improving" : healthTrend < 0 ? "Declining" : "Stable"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Risk Level</p>
                            <div className="flex items-center gap-2">
                                <Shield
                                    className={cn(
                                        "h-6 w-6",
                                        transformer.status === "critical" ? "text-red-500" :
                                            transformer.status === "alarm" ? "text-amber-500" : "text-emerald-500"
                                    )}
                                />
                                <span className="text-2xl font-bold">
                                    {transformer.status === "critical" ? "High" :
                                        transformer.status === "alarm" ? "Medium" : "Low"}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">
                                {transformer.status === "critical" ? "Immediate action required" :
                                    transformer.status === "alarm" ? "Monitor closely" : "Normal operation"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Brain className="h-4 w-4 text-purple-500" />
                        AI Insights & Recommendations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {insights.map((insight, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex items-start gap-3 rounded-lg border p-3",
                                    insight.severity === "critical" && "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20",
                                    insight.severity === "high" && "border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20",
                                    insight.severity === "warning" && "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20",
                                    insight.severity === "info" && "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20"
                                )}
                            >
                                <div className="mt-0.5">
                                    {insight.severity === "critical" && "🔴"}
                                    {insight.severity === "high" && "🟠"}
                                    {insight.severity === "warning" && "🟡"}
                                    {insight.severity === "info" && "🔵"}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">{insight.title}</p>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-xs",
                                                insight.severity === "critical" && "border-red-200 text-red-600 dark:border-red-800 dark:text-red-400",
                                                insight.severity === "high" && "border-orange-200 text-orange-600 dark:border-orange-800 dark:text-orange-400",
                                                insight.severity === "warning" && "border-amber-200 text-amber-600 dark:border-amber-800 dark:text-amber-400",
                                                insight.severity === "info" && "border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400"
                                            )}
                                        >
                                            {insight.severity.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {insight.description}
                                    </p>
                                    {insight.recommendation && (
                                        <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                                            💡 {insight.recommendation}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Prediction */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Failure Prediction
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <p className="text-sm text-slate-400">Estimated Time to Failure</p>
                            <p className="text-3xl font-bold text-red-500">
                                {transformer.status === "critical" ? "24-48" :
                                    transformer.status === "alarm" ? "7-14" : "365+"}
                            </p>
                            <p className="text-xs text-slate-400">days</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Confidence</p>
                            <p className="text-3xl font-bold">
                                {transformer.status === "critical" ? 92 :
                                    transformer.status === "alarm" ? 78 : 45}%
                            </p>
                            <Progress
                                value={transformer.status === "critical" ? 92 : transformer.status === "alarm" ? 78 : 45}
                                className="mt-1 h-2"
                            />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Primary Risk Factor</p>
                            <div className="flex items-center gap-2">
                                <Gauge className="h-5 w-5 text-slate-400" />
                                <span className="text-lg font-medium">
                                    {transformer.status === "critical" ? "Oil Temperature" :
                                        transformer.status === "alarm" ? "Load Factor" : "None"}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">
                                {transformer.status === "critical" ? "Exceeding critical threshold" :
                                    transformer.status === "alarm" ? "Approaching limit" : "All parameters normal"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function generateAIInsights(transformer: Transformer, readings: TransformerReading[]) {
    const insights = [];

    // Check for critical issues
    if (transformer.status === "critical") {
        insights.push({
            severity: "critical",
            title: "Critical Condition Detected",
            description: "Transformer health is critically low (34%). Immediate intervention required.",
            recommendation: "Dispatch field team immediately. Perform full diagnostic and oil testing.",
        });
    }

    // Check for temperature issues
    const lastReading = readings[readings.length - 1];
    if (lastReading && lastReading.temperature.oil > 85) {
        insights.push({
            severity: "high",
            title: "High Oil Temperature",
            description: `Oil temperature is ${lastReading.temperature.oil.toFixed(1)}°C, exceeding the 80°C alarm threshold.`,
            recommendation: "Schedule cooling system inspection and reduce load if possible.",
        });
    }

    // Check for gas issues
    if (lastReading && lastReading.gas.hydrogen > 20) {
        insights.push({
            severity: "warning",
            title: "Elevated Hydrogen Levels",
            description: `Hydrogen levels at ${lastReading.gas.hydrogen.toFixed(1)}ppm, indicating possible insulation degradation.`,
            recommendation: "Monitor closely. Schedule oil sampling for DGA analysis within 7 days.",
        });
    }

    // Check for load issues
    if (lastReading && lastReading.current.loadFactor > 85) {
        insights.push({
            severity: "warning",
            title: "High Load Factor",
            description: `Load factor at ${lastReading.current.loadFactor.toFixed(1)}%, approaching the 90% threshold.`,
            recommendation: "Consider load balancing or upgrading capacity if sustained.",
        });
    }

    // Check for oil level
    if (lastReading && lastReading.oil.level < 70) {
        insights.push({
            severity: "high",
            title: "Low Oil Level",
            description: `Oil level at ${lastReading.oil.level.toFixed(1)}%, below the 70% alarm threshold.`,
            recommendation: "Inspect for leaks and top up oil immediately.",
        });
    }

    // General info if no issues
    if (insights.length === 0) {
        insights.push({
            severity: "info",
            title: "All Systems Normal",
            description: "All parameters are within nominal ranges. Continue regular monitoring.",
            recommendation: "Next scheduled maintenance in 90 days.",
        });
    }

    return insights;
}