"use client";

import { Card } from "@heroui/react";
import type { Perspective } from "@/lib/categorize";
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
	perspective: Perspective | "all";
}

interface CardConfig {
	key: string;
	label: string;
	getValue: (d: SummaryData) => number;
	color: string;
	border: string;
	/** If set, the color is dynamic based on the value */
	dynamicColor?: boolean;
}

const ALL_CARDS: CardConfig[] = [
	{
		key: "income",
		label: "Przychód (faktury)",
		getValue: (d) => d.totalIncome,
		color: "text-emerald-400",
		border: "border-emerald-500/20",
	},
	{
		key: "expenses",
		label: "Wydatki",
		getValue: (d) => d.totalExpenses,
		color: "text-red-400",
		border: "border-red-500/20",
	},
	{
		key: "balance",
		label: "Bilans",
		getValue: (d) => d.netBalance,
		color: "",
		border: "",
		dynamicColor: true,
	},
	{
		key: "transactions",
		label: "Transakcje",
		getValue: (d) => d.transactionCount,
		color: "text-zinc-300",
		border: "border-zinc-700/40",
	},
];

const BUSINESS_CARDS: CardConfig[] = [
	{
		key: "biz_income",
		label: "Przychód (faktury)",
		getValue: (d) => d.totalIncome,
		color: "text-emerald-400",
		border: "border-emerald-500/20",
	},
	{
		key: "biz_costs",
		label: "Koszty firmy",
		getValue: (d) => d.businessCosts,
		color: "text-violet-400",
		border: "border-violet-500/20",
	},
	{
		key: "biz_taxes",
		label: "Podatki + ZUS",
		getValue: (d) => d.businessTaxes,
		color: "text-red-400",
		border: "border-red-500/20",
	},
	{
		key: "balance",
		label: "Bilans",
		getValue: (d) => d.netBalance,
		color: "",
		border: "",
		dynamicColor: true,
	},
];

const PERSONAL_CARDS: CardConfig[] = [
	{
		key: "personal_expenses",
		label: "Wydatki prywatne",
		getValue: (d) => d.personalExpenses,
		color: "text-amber-400",
		border: "border-amber-500/20",
	},
	{
		key: "fixed",
		label: "Koszty stałe",
		getValue: (d) => d.fixedCosts,
		color: "text-orange-400",
		border: "border-orange-500/20",
	},
	{
		key: "balance",
		label: "Bilans",
		getValue: (d) => d.netBalance,
		color: "",
		border: "",
		dynamicColor: true,
	},
	{
		key: "transactions",
		label: "Transakcje",
		getValue: (d) => d.transactionCount,
		color: "text-zinc-300",
		border: "border-zinc-700/40",
	},
];

export function SummaryCards({ data, perspective }: SummaryCardsProps) {
	const cards =
		perspective === "business"
			? BUSINESS_CARDS
			: perspective === "personal"
				? PERSONAL_CARDS
				: ALL_CARDS;

	return (
		<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
			{cards.map((card) => {
				const value = card.getValue(data);
				const isCount = card.key === "transactions";
				const color = card.dynamicColor
					? value >= 0
						? "text-emerald-400"
						: "text-red-400"
					: card.color;
				const border = card.dynamicColor
					? value >= 0
						? "border-emerald-500/20"
						: "border-red-500/20"
					: card.border;

				return (
					<Card
						key={card.key}
						className={`border bg-zinc-900/60 p-3.5 sm:p-5 ${border}`}
					>
						<span className="text-[9px] font-medium text-zinc-500 uppercase tracking-wider sm:text-[11px]">
							{card.label}
						</span>
						<p
							className={`mt-1.5 text-lg font-bold tabular-nums sm:mt-2 sm:text-2xl ${color}`}
						>
							{isCount ? value.toLocaleString("pl-PL") : fmt(value)}
						</p>
					</Card>
				);
			})}
		</div>
	);
}
