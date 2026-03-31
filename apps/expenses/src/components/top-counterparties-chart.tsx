"use client";

import { Card } from "@heroui/react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { CounterpartyData } from "@/lib/dashboard-utils";

const fmt = (n: number) =>
	new Intl.NumberFormat("pl-PL", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(n);

const fmtShort = (n: number) => {
	if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(0)}k`;
	return String(n);
};

interface TopCounterpartiesChartProps {
	data: CounterpartyData[];
}

export function TopCounterpartiesChart({ data }: TopCounterpartiesChartProps) {
	const mobileData = data.map((d) => ({
		...d,
		name: d.name.length > 18 ? `${d.name.slice(0, 18)}…` : d.name,
	}));

	return (
		<Card className="border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
			<h3 className="mb-3 text-xs font-semibold text-zinc-200 sm:mb-4 sm:text-sm">
				Top 10 kontrahentów
			</h3>
			<ResponsiveContainer width="100%" height={300} className="sm:!h-[350px]">
				<BarChart
					data={mobileData}
					layout="vertical"
					margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
					<XAxis
						type="number"
						tick={{ fill: "#71717a", fontSize: 9 }}
						tickFormatter={fmtShort}
					/>
					<YAxis
						type="category"
						dataKey="name"
						width={100}
						tick={{ fill: "#71717a", fontSize: 9 }}
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
					<Bar dataKey="amount" fill="#6366f1" radius={[0, 4, 4, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</Card>
	);
}
