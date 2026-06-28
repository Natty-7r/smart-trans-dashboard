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

interface GasTrendChartProps {
    data: Array<{
        timestamp: string;
        hydrogen: number;
        methane: number;
        ethane: number;
        ethylene: number;
        acetylene: number;
    }>;
    showCard?: boolean;
    className?: string;
}

const GAS_COLORS = {
    hydrogen: "#EF4444",
    methane: "#F59E0B",
    ethane: "#3B82F6",
    ethylene: "#8B5CF6",
    acetylene: "#EC4899",
};

const GAS_LABELS = {
    hydrogen: "H₂",
    methane: "CH₄",
    ethane: "C₂H₆",
    ethylene: "C₂H₄",
    acetylene: "C₂H₂",
};

export function GasTrendChart({
    data,
    showCard = true,
    className,
}: GasTrendChartProps) {
    // Generate mock historical data if none provided
    const chartData =
        data.length > 0
            ? data
            : Array.from({ length: 24 }, (_, i) => ({
                timestamp: new Date(Date.now() - (23 - i) * 3600000).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                ),
                hydrogen: 5 + Math.random() * 40,
                methane: 2 + Math.random() * 20,
                ethane: 1 + Math.random() * 15,
                ethylene: 0.5 + Math.random() * 10,
                acetylene: 0 + Math.random() * 5,
            }));

    const chartConfig = {
        hydrogen: { label: "H₂", color: GAS_COLORS.hydrogen },
        methane: { label: "CH₄", color: GAS_COLORS.methane },
        ethane: { label: "C₂H₆", color: GAS_COLORS.ethane },
        ethylene: { label: "C₂H₄", color: GAS_COLORS.ethylene },
        acetylene: { label: "C₂H₂", color: GAS_COLORS.acetylene },
    };

    const content = (
        <div className={className}>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
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
                                value: "ppm",
                                angle: -90,
                                position: "insideLeft",
                                style: { fill: "hsl(var(--muted-foreground))", fontSize: 10 },
                            }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend
                            verticalAlign="top"
                            height={36}
                            formatter={(value) => GAS_LABELS[value as keyof typeof GAS_LABELS] || value}
                        />

                        {/* Alarm bands */}
                        <ReferenceArea
                            y1={50}
                            y2={150}
                            fill="#F59E0B"
                            fillOpacity={0.1}
                            label={{
                                value: "Alarm Zone",
                                position: "insideRight",
                                fill: "#F59E0B",
                                fontSize: 8,
                            }}
                        />
                        <ReferenceArea
                            y1={150}
                            y2={1000}
                            fill="#EF4444"
                            fillOpacity={0.1}
                            label={{
                                value: "Critical Zone",
                                position: "insideRight",
                                fill: "#EF4444",
                                fontSize: 8,
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="hydrogen"
                            stroke={GAS_COLORS.hydrogen}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="methane"
                            stroke={GAS_COLORS.methane}
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="ethane"
                            stroke={GAS_COLORS.ethane}
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="ethylene"
                            stroke={GAS_COLORS.ethylene}
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="acetylene"
                            stroke={GAS_COLORS.acetylene}
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
                <CardTitle className="text-sm font-medium">Gas Trend</CardTitle>
            </CardHeader>
            <CardContent>{content}</CardContent>
        </Card>
    );
}