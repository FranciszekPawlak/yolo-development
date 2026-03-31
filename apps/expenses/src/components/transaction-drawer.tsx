"use client";

import { Card } from "@heroui/react";
import {
	CATEGORY_COLORS,
	CATEGORY_LABELS,
	type Category,
} from "@/lib/categorize";
import type { Transaction } from "@/lib/parsers/types";

const fmtCurrency = (n: number, currency = "PLN") =>
	new Intl.NumberFormat("pl-PL", {
		style: "currency",
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(n);

const fmtDate = (dateStr: string) => {
	const d = new Date(dateStr);
	return d.toLocaleDateString("pl-PL", {
		day: "numeric",
		month: "short",
		year: undefined,
	});
};

interface TransactionDrawerProps {
	category: Category | null;
	transactions: Transaction[];
	onClose: () => void;
}

export function TransactionDrawer({
	category,
	transactions,
	onClose,
}: TransactionDrawerProps) {
	if (!category) return null;

	const filtered = transactions
		.filter((t) => t.category === category)
		.sort((a, b) => b.date.localeCompare(a.date));

	const color = CATEGORY_COLORS[category] ?? "#525252";
	const label = CATEGORY_LABELS[category] ?? category;
	const total = filtered.reduce((sum, t) => sum + t.amount, 0);

	return (
		<Card className="border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
			<div className="mb-4 flex items-start justify-between gap-3">
				<div className="flex items-center gap-2.5">
					<span
						className="inline-block h-3 w-3 shrink-0 rounded-full"
						style={{ backgroundColor: color }}
					/>
					<div>
						<h3 className="text-sm font-semibold text-zinc-100 sm:text-base">
							{label}
						</h3>
						<p className="mt-0.5 text-xs text-zinc-500">
							{filtered.length} transakcji &middot;{" "}
							<span className={total < 0 ? "text-red-400" : "text-emerald-400"}>
								{fmtCurrency(total)}
							</span>
						</p>
					</div>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="shrink-0 cursor-pointer rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
					aria-label="Zamknij"
				>
					<svg
						className="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						role="img"
						aria-label="Zamknij"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<div className="max-h-[400px] space-y-0.5 overflow-y-auto sm:max-h-[500px]">
				{filtered.map((tx) => (
					<div
						key={tx.id}
						className="flex items-start justify-between gap-3 rounded-lg px-2 py-2 transition hover:bg-zinc-800/50 sm:px-3"
					>
						<div className="min-w-0 flex-1">
							<p className="truncate text-xs font-medium text-zinc-200 sm:text-sm">
								{cleanCounterparty(tx.counterparty)}
							</p>
							<p className="mt-0.5 truncate text-[11px] text-zinc-500">
								{tx.title !== tx.counterparty ? cleanTitle(tx.title) : ""}
							</p>
						</div>
						<div className="shrink-0 text-right">
							<p
								className={`text-xs font-semibold tabular-nums sm:text-sm ${
									tx.amount < 0 ? "text-red-400" : "text-emerald-400"
								}`}
							>
								{fmtCurrency(tx.amount, tx.currency)}
							</p>
							<p className="mt-0.5 text-[10px] text-zinc-600 tabular-nums">
								{fmtDate(tx.date)}
							</p>
						</div>
					</div>
				))}
			</div>
		</Card>
	);
}

/** Strip leading/trailing whitespace and truncate very long counterparty names */
function cleanCounterparty(name: string): string {
	const clean = name.trim();
	return clean.length > 50 ? `${clean.slice(0, 50)}...` : clean;
}

/** Clean up transaction title for display */
function cleanTitle(title: string): string {
	const clean = title.trim().replace(/\s+/g, " ");
	return clean.length > 80 ? `${clean.slice(0, 80)}...` : clean;
}
