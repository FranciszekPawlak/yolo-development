"use client";

import { Card } from "@heroui/react";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { MonthlyData } from "@/lib/dashboard-utils";

const fmt = (n: number) =>
	new Intl.NumberFormat("pl-PL", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(n);

const fmtShort = (n: number) => {
	if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(0)}k`;
	return String(n);
};

interface TrendChartProps {
	data: MonthlyData[];
}

export function TrendChart({ data }: TrendChartProps) {
	return (
		<Card className="border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
			<h3 className="mb-3 text-xs font-semibold text-zinc-200 sm:mb-4 sm:text-sm">
				Trend wydatków
			</h3>
			<ResponsiveContainer width="100%" height={250} className="sm:!h-[300px]">
				<LineChart
					data={data}
					margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
					<XAxis
						dataKey="month"
						tick={{ fill: "#71717a", fontSize: 10 }}
						tickFormatter={(v: string) => v.slice(5)}
					/>
					<YAxis
						tick={{ fill: "#71717a", fontSize: 9 }}
						tickFormatter={fmtShort}
						width={45}
					/>
					<Tooltip
						formatter={(value) => [`${fmt(Number(value))} PLN`, "Wydatki"]}
						contentStyle={{
							backgroundColor: "#18181b",
							border: "1px solid #3f3f46",
							borderRadius: "12px",
							fontSize: "11px",
						}}
					/>
					<Line
						type="monotone"
						dataKey="expenses"
						stroke="#ef4444"
						strokeWidth={2}
						dot={{ r: 3 }}
						activeDot={{ r: 5 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</Card>
	);
}
