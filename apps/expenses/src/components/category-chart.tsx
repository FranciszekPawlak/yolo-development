"use client";

import { Card } from "@heroui/react";
import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import type { CategoryBreakdown } from "@/lib/dashboard-utils";

const COLORS = [
	"#3b82f6",
	"#ef4444",
	"#f59e0b",
	"#10b981",
	"#8b5cf6",
	"#ec4899",
	"#06b6d4",
	"#f97316",
	"#14b8a6",
	"#a855f7",
	"#6366f1",
];

const fmt = (n: number) =>
	new Intl.NumberFormat("pl-PL", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(n);

interface CategoryChartProps {
	data: CategoryBreakdown[];
}

export function CategoryChart({ data }: CategoryChartProps) {
	const top = data.slice(0, 10);
	const restAmount = data.slice(10).reduce((sum, d) => sum + d.amount, 0);
	const chartData =
		restAmount > 0
			? [...top, { category: "other", label: "Pozostałe", amount: restAmount }]
			: top;

	return (
		<Card className="border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
			<h3 className="mb-3 text-xs font-semibold text-zinc-200 sm:mb-4 sm:text-sm">
				Wydatki wg kategorii
			</h3>
			<ResponsiveContainer width="100%" height={280} className="sm:!h-[350px]">
				<PieChart>
					<Pie
						data={chartData}
						cx="50%"
						cy="50%"
						innerRadius="40%"
						outerRadius="70%"
						paddingAngle={2}
						dataKey="amount"
						nameKey="label"
					>
						{chartData.map((_, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
							/>
						))}
					</Pie>
					<Tooltip
						formatter={(value) => [`${fmt(Number(value))} PLN`, ""]}
						contentStyle={{
							backgroundColor: "#18181b",
							border: "1px solid #3f3f46",
							borderRadius: "12px",
							fontSize: "11px",
						}}
					/>
					<Legend
						wrapperStyle={{ fontSize: "10px", color: "#a1a1aa" }}
						iconSize={8}
					/>
				</PieChart>
			</ResponsiveContainer>
		</Card>
	);
}
