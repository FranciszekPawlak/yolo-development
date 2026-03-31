import type { Category } from "@/lib/categorize";
import { CATEGORY_LABELS, FIXED_COST_CATEGORIES } from "@/lib/categorize";
import type { Transaction } from "@/lib/parsers/types";

/** Filter out internal transfers for analysis */
export function externalOnly(txs: Transaction[]): Transaction[] {
	return txs.filter(
		(t) => !t.isInternalTransfer && t.category !== "internal_transfer",
	);
}

export function filterTransactions(
	txs: Transaction[],
	filters: {
		dateFrom?: string;
		dateTo?: string;
		currency?: string;
		account?: string;
		categories?: string[];
	},
): Transaction[] {
	return txs.filter((t) => {
		if (filters.dateFrom && t.date < filters.dateFrom) return false;
		if (filters.dateTo && t.date > filters.dateTo) return false;
		if (filters.currency && t.currency !== filters.currency) return false;
		if (filters.account && t.account !== filters.account) return false;
		if (filters.categories?.length && !filters.categories.includes(t.category))
			return false;
		return true;
	});
}

export interface SummaryData {
	totalIncome: number;
	totalExpenses: number;
	netBalance: number;
	fixedCosts: number;
}

export function computeSummary(txs: Transaction[]): SummaryData {
	const ext = externalOnly(txs);
	const totalIncome = ext
		.filter((t) => t.amount > 0)
		.reduce((sum, t) => sum + t.amount, 0);
	const totalExpenses = ext
		.filter((t) => t.amount < 0)
		.reduce((sum, t) => sum + Math.abs(t.amount), 0);
	const fixedCosts = ext
		.filter(
			(t) =>
				t.amount < 0 && FIXED_COST_CATEGORIES.includes(t.category as Category),
		)
		.reduce((sum, t) => sum + Math.abs(t.amount), 0);

	return {
		totalIncome,
		totalExpenses,
		netBalance: totalIncome - totalExpenses,
		fixedCosts,
	};
}

export interface CategoryBreakdown {
	category: string;
	label: string;
	amount: number;
}

export function computeCategoryBreakdown(
	txs: Transaction[],
): CategoryBreakdown[] {
	const ext = externalOnly(txs).filter((t) => t.amount < 0);
	const map = new Map<string, number>();

	for (const t of ext) {
		const cat = t.category || "uncategorized";
		map.set(cat, (map.get(cat) ?? 0) + Math.abs(t.amount));
	}

	return Array.from(map.entries())
		.map(([category, amount]) => ({
			category,
			label: CATEGORY_LABELS[category as Category] ?? category,
			amount: Math.round(amount * 100) / 100,
		}))
		.sort((a, b) => b.amount - a.amount);
}

export interface MonthlyData {
	month: string;
	income: number;
	expenses: number;
}

export function computeMonthlyData(txs: Transaction[]): MonthlyData[] {
	const ext = externalOnly(txs);
	const map = new Map<string, { income: number; expenses: number }>();

	for (const t of ext) {
		const month = t.date.slice(0, 7);
		const entry = map.get(month) ?? { income: 0, expenses: 0 };
		if (t.amount > 0) {
			entry.income += t.amount;
		} else {
			entry.expenses += Math.abs(t.amount);
		}
		map.set(month, entry);
	}

	return Array.from(map.entries())
		.map(([month, data]) => ({
			month,
			income: Math.round(data.income),
			expenses: Math.round(data.expenses),
		}))
		.sort((a, b) => a.month.localeCompare(b.month));
}

export interface CounterpartyData {
	name: string;
	amount: number;
}

export function computeTopCounterparties(
	txs: Transaction[],
	limit = 10,
): CounterpartyData[] {
	const ext = externalOnly(txs).filter((t) => t.amount < 0);
	const map = new Map<string, number>();

	for (const t of ext) {
		const name = t.counterparty || "Nieznany";
		map.set(name, (map.get(name) ?? 0) + Math.abs(t.amount));
	}

	return Array.from(map.entries())
		.map(([name, amount]) => ({
			name: name.length > 30 ? `${name.slice(0, 30)}...` : name,
			amount: Math.round(amount),
		}))
		.sort((a, b) => b.amount - a.amount)
		.slice(0, limit);
}

export interface FixedCostRow {
	category: string;
	label: string;
	total: number;
	monthlyAvg: number;
	count: number;
}

export function computeFixedCosts(txs: Transaction[]): FixedCostRow[] {
	const ext = externalOnly(txs).filter(
		(t) =>
			t.amount < 0 && FIXED_COST_CATEGORIES.includes(t.category as Category),
	);

	// Determine month range for averaging
	const months = new Set(ext.map((t) => t.date.slice(0, 7)));
	const monthCount = Math.max(months.size, 1);

	const map = new Map<string, { total: number; count: number }>();
	for (const t of ext) {
		const entry = map.get(t.category) ?? { total: 0, count: 0 };
		entry.total += Math.abs(t.amount);
		entry.count++;
		map.set(t.category, entry);
	}

	return Array.from(map.entries())
		.map(([category, data]) => ({
			category,
			label: CATEGORY_LABELS[category as Category] ?? category,
			total: Math.round(data.total * 100) / 100,
			monthlyAvg: Math.round((data.total / monthCount) * 100) / 100,
			count: data.count,
		}))
		.sort((a, b) => b.total - a.total);
}

export function getUniqueValues(
	txs: Transaction[],
	key: "currency" | "account",
): string[] {
	return [...new Set(txs.map((t) => t[key]).filter(Boolean))].sort();
}
