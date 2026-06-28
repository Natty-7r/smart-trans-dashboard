"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Line,
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    ReferenceArea,
} from "recharts";

interface VibrationTrendGraphProps {
    data: Array<{
        timestamp: string;
        xAxis: number;
        yAxis: number;
        zAxis: number;
    }>;
    showCard?: boolean;
    className?: string;
}

const VIBRATION_COLORS = {
    xAxis: "#3B82F6",
    yAxis: "#8B5CF6",
    zAxis: "#14B8A6",
};

export function VibrationTrendGraph({
    data,
    showCard = true,
    className,
}: VibrationTrendGraphProps) {
    // Generate mock data if none provided
    const chartData =
        data.length > 0
            ? data
            : Array.from({ length: 24 }, (_, i) => ({
                timestamp: new Date(Date.now() - (23 - i) * 3600000).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                ),
                xAxis: 0.5 + Math.random() * 3.5,
                yAxis: 0.5 + Math.random() * 3.5,
                zAxis: 0.5 + Math.random() * 3.5,
            }));

    const chartConfig = {
        xAxis: { label: "X-Axis", color: VIBRATION_COLORS.xAxis },
        yAxis: { label: "Y-Axis", color: VIBRATION_COLORS.yAxis },
        zAxis: { label: "Z-Axis", color: VIBRATION_COLORS.zAxis },
    };

    const content = (
        <div className={className}>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="timestamp"
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                            label={{
                                value: "mm/s",
                                angle: -90,
                                position: "insideLeft",
                                style: { fill: "hsl(var(--muted-foreground))", fontSize: 10 },
                            }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend verticalAlign="top" height={36} />

                        {/* Normal vibration band */}
                        <ReferenceArea
                            y1={0}
                            y2={2}
                            fill="#22C55E"
                            fillOpacity={0.05}
                            label={{
                                value: "Normal",
                                position: "insideLeft",
                                fill: "#22C55E",
                                fontSize: 8,
                            }}
                        />
                        <ReferenceArea
                            y1={2}
                            y2={5}
                            fill="#F59E0B"
                            fillOpacity={0.05}
                            label={{
                                value: "Warning",
                                position: "insideLeft",
                                fill: "#F59E0B",
                                fontSize: 8,
                            }}
                        />
                        <ReferenceArea
                            y1={5}
                            y2={20}
                            fill="#EF4444"
                            fillOpacity={0.05}
                            label={{
                                value: "Critical",
                                position: "insideLeft",
                                fill: "#EF4444",
                                fontSize: 8,
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="xAxis"
                            stroke={VIBRATION_COLORS.xAxis}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="yAxis"
                            stroke={VIBRATION_COLORS.yAxis}
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="zAxis"
                            stroke={VIBRATION_COLORS.zAxis}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );

    if (!showCard) return content;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Vibration Trend</CardTitle>
            </CardHeader>
            <CardContent>{content}</CardContent>
        </Card>
    );
}