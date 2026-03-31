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
import type { Perspective } from "@/lib/categorize";
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
	perspective: Perspective | "all";
}

const LABEL_MAP: Record<string, string> = {
	expenses: "Wydatki",
	businessCosts: "Koszty firmy",
	personalExpenses: "Wydatki prywatne",
	taxes: "Podatki + ZUS",
};

export function TrendChart({ data, perspective }: TrendChartProps) {
	const lines =
		perspective === "business"
			? [
					{ key: "businessCosts", stroke: "#8b5cf6", label: "Koszty firmy" },
					{ key: "taxes", stroke: "#ef4444", label: "Podatki + ZUS" },
				]
			: perspective === "personal"
				? [
						{
							key: "personalExpenses",
							stroke: "#f59e0b",
							label: "Wydatki prywatne",
						},
					]
				: [{ key: "expenses", stroke: "#ef4444", label: "Wydatki" }];

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
						dataKey="monthLabel"
						tick={{ fill: "#71717a", fontSize: 10 }}
					/>
					<YAxis
						tick={{ fill: "#71717a", fontSize: 9 }}
						tickFormatter={fmtShort}
						width={45}
					/>
					<Tooltip
						formatter={(value, name) => [
							`${fmt(Number(value))} PLN`,
							LABEL_MAP[name as string] ?? name,
						]}
						contentStyle={{
							backgroundColor: "#18181b",
							border: "1px solid #3f3f46",
							borderRadius: "12px",
							fontSize: "11px",
						}}
					/>
					{lines.map((l) => (
						<Line
							key={l.key}
							type="monotone"
							dataKey={l.key}
							stroke={l.stroke}
							strokeWidth={2}
							dot={{ r: 3 }}
							activeDot={{ r: 5 }}
						/>
					))}
				</LineChart>
			</ResponsiveContainer>
		</Card>
	);
}
