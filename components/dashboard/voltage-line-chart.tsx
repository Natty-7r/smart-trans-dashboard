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
    ResponsiveContainer,
    ReferenceArea,
    ReferenceLine,
} from "recharts";

interface VoltageLineChartProps {
    data: Array<{
        timestamp: string;
        primary: number;
        secondary: number;
    }>;
    showCard?: boolean;
    className?: string;
}

export function VoltageLineChart({
    data,
    showCard = true,
    className,
}: VoltageLineChartProps) {
    // Generate mock data if none provided
    const chartData =
        data.length > 0
            ? data
            : Array.from({ length: 24 }, (_, i) => ({
                timestamp: new Date(Date.now() - (23 - i) * 3600000).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                ),
                primary: 10.8 + Math.random() * 0.8,
                secondary: 400 + Math.random() * 20,
            }));

    const chartConfig = {
        primary: { label: "Primary (kV)", color: "#3B82F6" },
        secondary: { label: "Secondary (V)", color: "#8B5CF6" },
    };

    const primaryNominal = 11.0;
    const primaryAlarmLow = 10.45;
    const primaryAlarmHigh = 11.55;
    const primaryCriticalLow = 9.9;
    const primaryCriticalHigh = 12.1;

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
                            yAxisId="left"
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                            domain={[9, 13]}
                            label={{
                                value: "kV",
                                angle: -90,
                                position: "insideLeft",
                                style: { fill: "hsl(var(--muted-foreground))", fontSize: 10 },
                            }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />

                        {/* Nominal zone */}
                        <ReferenceArea
                            y1={primaryAlarmLow}
                            y2={primaryAlarmHigh}
                            fill="#22C55E"
                            fillOpacity={0.05}
                            yAxisId="left"
                        />
                        {/* Alarm zone */}
                        <ReferenceArea
                            y1={primaryCriticalLow}
                            y2={primaryAlarmLow}
                            fill="#F59E0B"
                            fillOpacity={0.05}
                            yAxisId="left"
                        />
                        <ReferenceArea
                            y1={primaryAlarmHigh}
                            y2={primaryCriticalHigh}
                            fill="#F59E0B"
                            fillOpacity={0.05}
                            yAxisId="left"
                        />
                        {/* Critical zone */}
                        <ReferenceArea
                            y1={0}
                            y2={primaryCriticalLow}
                            fill="#EF4444"
                            fillOpacity={0.05}
                            yAxisId="left"
                        />
                        <ReferenceArea
                            y1={primaryCriticalHigh}
                            y2={20}
                            fill="#EF4444"
                            fillOpacity={0.05}
                            yAxisId="left"
                        />

                        {/* Nominal line */}
                        <ReferenceLine
                            y={primaryNominal}
                            stroke="#22C55E"
                            strokeDasharray="3 3"
                            yAxisId="left"
                            label={{
                                value: "Nominal",
                                position: "insideBottomRight",
                                fill: "#22C55E",
                                fontSize: 8,
                            }}
                        />

                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="primary"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
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
                <CardTitle className="text-sm font-medium">Voltage Levels</CardTitle>
            </CardHeader>
            <CardContent>{content}</CardContent>
        </Card>
    );
}