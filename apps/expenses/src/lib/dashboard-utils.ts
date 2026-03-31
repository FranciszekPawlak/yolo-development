import type { Category, Perspective } from "@/lib/categorize";
import {
	CATEGORY_COLORS,
	CATEGORY_LABELS,
	CATEGORY_PERSPECTIVE,
	FIXED_COST_CATEGORIES,
} from "@/lib/categorize";
import type { Transaction } from "@/lib/parsers/types";

// ─── Date helpers ───

const MONTH_NAMES_SHORT = [
	"Sty",
	"Lut",
	"Mar",
	"Kwi",
	"Maj",
	"Cze",
	"Lip",
	"Sie",
	"Wrz",
	"Paź",
	"Lis",
	"Gru",
];

const MONTH_NAMES_FULL = [
	"Styczeń",
	"Luty",
	"Marzec",
	"Kwiecień",
	"Maj",
	"Czerwiec",
	"Lipiec",
	"Sierpień",
	"Wrzesień",
	"Październik",
	"Listopad",
	"Grudzień",
];

export function getMonthShortName(monthIndex: number): string {
	return MONTH_NAMES_SHORT[monthIndex] ?? "";
}

export function getMonthFullName(monthIndex: number): string {
	return MONTH_NAMES_FULL[monthIndex] ?? "";
}

export function getCurrentYearMonth(): { year: number; month: number } {
	const now = new Date();
	return { year: now.getFullYear(), month: now.getMonth() };
}

/** Get all years that have transactions */
export function getAvailableYears(txs: Transaction[]): number[] {
	const years = new Set<number>();
	for (const t of txs) {
		const y = Number.parseInt(t.date.slice(0, 4), 10);
		if (!Number.isNaN(y)) years.add(y);
	}
	return [...years].sort();
}

/** Get months (0-11) that have transactions for a given year */
export function getAvailableMonths(txs: Transaction[], year: number): number[] {
	const months = new Set<number>();
	for (const t of txs) {
		if (t.date.startsWith(`${year}-`)) {
			const m = Number.parseInt(t.date.slice(5, 7), 10) - 1;
			if (!Number.isNaN(m)) months.add(m);
		}
	}
	return [...months].sort((a, b) => a - b);
}

// ─── Filtering ───

export function externalOnly(txs: Transaction[]): Transaction[] {
	return txs.filter(
		(t) => !t.isInternalTransfer && t.category !== "internal_transfer",
	);
}

export interface DashboardFilters {
	year: number;
	/** null = entire year */
	month: number | null;
	perspective: Perspective | "all";
	selectedCategories: Category[];
	currency: string;
	account: string;
}

export function filterTransactions(
	txs: Transaction[],
	filters: DashboardFilters,
): Transaction[] {
	return txs.filter((t) => {
		const txYear = Number.parseInt(t.date.slice(0, 4), 10);
		if (txYear !== filters.year) return false;

		if (filters.month !== null) {
			const txMonth = Number.parseInt(t.date.slice(5, 7), 10) - 1;
			if (txMonth !== filters.month) return false;
		}

		if (filters.perspective !== "all") {
			const catPerspective =
				CATEGORY_PERSPECTIVE[t.category as Category] ?? "neutral";
			if (
				catPerspective !== filters.perspective &&
				catPerspective !== "neutral"
			) {
				return false;
			}
		}

		if (
			filters.selectedCategories.length > 0 &&
			!filters.selectedCategories.includes(t.category as Category)
		) {
			return false;
		}

		if (filters.currency && t.currency !== filters.currency) return false;
		if (filters.account && t.account !== filters.account) return false;

		return true;
	});
}

// ─── Summary computation ───

export interface SummaryData {
	totalIncome: number;
	totalExpenses: number;
	netBalance: number;
	fixedCosts: number;
	businessCosts: number;
	businessTaxes: number;
	personalExpenses: number;
	transactionCount: number;
}

export function computeSummary(txs: Transaction[]): SummaryData {
	const ext = externalOnly(txs);
	// Only eRecruitment invoices count as real income
	const totalIncome = ext
		.filter((t) => t.amount > 0 && t.category === "biz_income")
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

	const businessCosts = ext
		.filter(
			(t) =>
				t.amount < 0 &&
				CATEGORY_PERSPECTIVE[t.category as Category] === "business",
		)
		.reduce((sum, t) => sum + Math.abs(t.amount), 0);

	const businessTaxes = ext
		.filter(
			(t) =>
				t.amount < 0 && (t.category === "biz_tax" || t.category === "biz_zus"),
		)
		.reduce((sum, t) => sum + Math.abs(t.amount), 0);

	const personalExpenses = ext
		.filter(
			(t) =>
				t.amount < 0 &&
				CATEGORY_PERSPECTIVE[t.category as Category] === "personal",
		)
		.reduce((sum, t) => sum + Math.abs(t.amount), 0);

	return {
		totalIncome,
		totalExpenses,
		netBalance: totalIncome - totalExpenses,
		fixedCosts,
		businessCosts,
		businessTaxes,
		personalExpenses,
		transactionCount: ext.length,
	};
}

// ─── Category breakdown ───

export interface CategoryBreakdown {
	category: string;
	label: string;
	amount: number;
	color: string;
	perspective: Perspective;
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
			color: CATEGORY_COLORS[category as Category] ?? "#525252",
			perspective: CATEGORY_PERSPECTIVE[category as Category] ?? "neutral",
		}))
		.sort((a, b) => b.amount - a.amount);
}

// ─── Monthly data ───

export interface MonthlyData {
	month: string;
	monthLabel: string;
	income: number;
	expenses: number;
	businessCosts: number;
	personalExpenses: number;
	taxes: number;
}

export function computeMonthlyData(txs: Transaction[]): MonthlyData[] {
	const ext = externalOnly(txs);
	const map = new Map<
		string,
		{
			income: number;
			expenses: number;
			businessCosts: number;
			personalExpenses: number;
			taxes: number;
		}
	>();

	for (const t of ext) {
		const month = t.date.slice(0, 7);
		const entry = map.get(month) ?? {
			income: 0,
			expenses: 0,
			businessCosts: 0,
			personalExpenses: 0,
			taxes: 0,
		};
		const perspective = CATEGORY_PERSPECTIVE[t.category as Category];

		if (t.amount > 0 && t.category === "biz_income") {
			entry.income += t.amount;
		} else if (t.amount < 0) {
			const abs = Math.abs(t.amount);
			entry.expenses += abs;
			if (perspective === "business") entry.businessCosts += abs;
			if (perspective === "personal") entry.personalExpenses += abs;
			if (t.category === "biz_tax" || t.category === "biz_zus")
				entry.taxes += abs;
		}
		map.set(month, entry);
	}

	return Array.from(map.entries())
		.map(([month, data]) => {
			const monthIdx = Number.parseInt(month.slice(5, 7), 10) - 1;
			return {
				month,
				monthLabel: getMonthShortName(monthIdx),
				income: Math.round(data.income),
				expenses: Math.round(data.expenses),
				businessCosts: Math.round(data.businessCosts),
				personalExpenses: Math.round(data.personalExpenses),
				taxes: Math.round(data.taxes),
			};
		})
		.sort((a, b) => a.month.localeCompare(b.month));
}

// ─── Top counterparties ───

export interface CounterpartyData {
	name: string;
	amount: number;
	category: string;
	color: string;
}

export function computeTopCounterparties(
	txs: Transaction[],
	limit = 10,
): CounterpartyData[] {
	const ext = externalOnly(txs).filter((t) => t.amount < 0);
	const map = new Map<string, { amount: number; category: string }>();

	for (const t of ext) {
		const name = t.counterparty || "Nieznany";
		const existing = map.get(name);
		if (existing) {
			existing.amount += Math.abs(t.amount);
		} else {
			map.set(name, { amount: Math.abs(t.amount), category: t.category });
		}
	}

	return Array.from(map.entries())
		.map(([name, data]) => ({
			name: name.length > 30 ? `${name.slice(0, 30)}...` : name,
			amount: Math.round(data.amount),
			category: data.category,
			color: CATEGORY_COLORS[data.category as Category] ?? "#525252",
		}))
		.sort((a, b) => b.amount - a.amount)
		.slice(0, limit);
}

// ─── Fixed costs ───

export interface FixedCostRow {
	category: string;
	label: string;
	total: number;
	monthlyAvg: number;
	count: number;
	color: string;
}

export function computeFixedCosts(txs: Transaction[]): FixedCostRow[] {
	const ext = externalOnly(txs).filter(
		(t) =>
			t.amount < 0 && FIXED_COST_CATEGORIES.includes(t.category as Category),
	);

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
			color: CATEGORY_COLORS[category as Category] ?? "#525252",
		}))
		.sort((a, b) => b.total - a.total);
}

// ─── Unique values ───

export function getUniqueValues(
	txs: Transaction[],
	key: "currency" | "account",
): string[] {
	return [...new Set(txs.map((t) => t[key]).filter(Boolean))].sort();
}

/** Get categories present in the current transaction set */
export function getActiveCategories(txs: Transaction[]): {
	category: Category;
	label: string;
	perspective: Perspective;
	count: number;
}[] {
	const map = new Map<string, number>();
	for (const t of externalOnly(txs)) {
		const cat = t.category || "uncategorized";
		map.set(cat, (map.get(cat) ?? 0) + 1);
	}

	return Array.from(map.entries())
		.map(([category, count]) => ({
			category: category as Category,
			label: CATEGORY_LABELS[category as Category] ?? category,
			perspective: CATEGORY_PERSPECTIVE[category as Category] ?? "neutral",
			count,
		}))
		.sort((a, b) => b.count - a.count);
}
