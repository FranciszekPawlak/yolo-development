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
import type { Category } from "@/lib/categorize";
import type { CategoryBreakdown } from "@/lib/dashboard-utils";

const fmt = (n: number) =>
	new Intl.NumberFormat("pl-PL", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(n);

interface CategoryChartProps {
	data: CategoryBreakdown[];
	activeCategory?: string | null;
	onCategoryClick?: (category: Category) => void;
}

export function CategoryChart({
	data,
	activeCategory,
	onCategoryClick,
}: CategoryChartProps) {
	const top = data.slice(0, 10);
	const restAmount = data.slice(10).reduce((sum, d) => sum + d.amount, 0);
	const chartData =
		restAmount > 0
			? [
					...top,
					{
						category: "other",
						label: "Pozostałe",
						amount: restAmount,
						color: "#525252",
						perspective: "neutral" as const,
					},
				]
			: top;

	if (chartData.length === 0) {
		return (
			<Card className="flex min-h-[300px] items-center justify-center border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
				<p className="text-sm text-zinc-500">
					Brak danych dla wybranych filtrów
				</p>
			</Card>
		);
	}

	return (
		<Card className="border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
			<h3 className="mb-3 text-xs font-semibold text-zinc-200 sm:mb-4 sm:text-sm">
				Wydatki wg kategorii
				{onCategoryClick && (
					<span className="ml-2 font-normal text-zinc-500">
						(kliknij, aby zobaczyć)
					</span>
				)}
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
						onClick={(_, index) => {
							const entry = chartData[index];
							if (entry && onCategoryClick && entry.category !== "other") {
								onCategoryClick(entry.category as Category);
							}
						}}
						style={{ cursor: onCategoryClick ? "pointer" : undefined }}
					>
						{chartData.map((entry) => (
							<Cell
								key={entry.category}
								fill={entry.color}
								opacity={
									activeCategory && entry.category !== activeCategory ? 0.25 : 1
								}
								strokeWidth={activeCategory === entry.category ? 2 : 0}
								stroke={activeCategory === entry.category ? "#ffffff" : "none"}
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
