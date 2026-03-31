"use client";

import { Card } from "@heroui/react";
import type { SummaryData } from "@/lib/dashboard-utils";

const fmt = (n: number) =>
	new Intl.NumberFormat("pl-PL", {
		style: "currency",
		currency: "PLN",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(n);

interface SummaryCardsProps {
	data: SummaryData;
}

const CARDS = [
	{
		key: "income",
		label: "Przychody",
		icon: "📈",
		color: "text-emerald-400",
		border: "border-emerald-500/20",
	},
	{
		key: "expenses",
		label: "Wydatki",
		icon: "📉",
		color: "text-red-400",
		border: "border-red-500/20",
	},
	{ key: "balance", label: "Bilans", icon: "⚖️", color: "", border: "" },
	{
		key: "fixed",
		label: "Koszty stałe",
		icon: "📌",
		color: "text-amber-400",
		border: "border-amber-500/20",
	},
] as const;

export function SummaryCards({ data }: SummaryCardsProps) {
	const values: Record<string, number> = {
		income: data.totalIncome,
		expenses: data.totalExpenses,
		balance: data.netBalance,
		fixed: data.fixedCosts,
	};

	return (
		<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
			{CARDS.map((card) => {
				const value = values[card.key];
				const color =
					card.key === "balance"
						? value >= 0
							? "text-emerald-400"
							: "text-red-400"
						: card.color;
				const border =
					card.key === "balance"
						? value >= 0
							? "border-emerald-500/20"
							: "border-red-500/20"
						: card.border;

				return (
					<Card
						key={card.key}
						className={`border bg-zinc-900/60 p-3.5 sm:p-5 ${border}`}
					>
						<div className="flex items-center gap-1.5 sm:gap-2">
							<span className="text-sm sm:text-base">{card.icon}</span>
							<span className="text-[9px] font-medium text-zinc-500 uppercase tracking-wider sm:text-[11px]">
								{card.label}
							</span>
						</div>
						<p
							className={`mt-2 text-lg font-bold tabular-nums sm:mt-3 sm:text-2xl ${color}`}
						>
							{fmt(value)}
						</p>
					</Card>
				);
			})}
		</div>
	);
}
