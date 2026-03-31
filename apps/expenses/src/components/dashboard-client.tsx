"use client";

import { useMemo, useState } from "react";
import { CategoryChart } from "@/components/category-chart";
import { DashboardFilterBar } from "@/components/dashboard-filters";
import { FixedCostsTable } from "@/components/fixed-costs-table";
import { MonthlyChart } from "@/components/monthly-chart";
import { SummaryCards } from "@/components/summary-cards";
import { TopCounterpartiesChart } from "@/components/top-counterparties-chart";
import { TrendChart } from "@/components/trend-chart";
import {
	computeCategoryBreakdown,
	computeFixedCosts,
	computeMonthlyData,
	computeSummary,
	computeTopCounterparties,
	type DashboardFilters,
	filterTransactions,
	getAvailableYears,
	getCurrentYearMonth,
} from "@/lib/dashboard-utils";
import type { Transaction } from "@/lib/parsers/types";

interface DashboardClientProps {
	transactions: Transaction[];
}

export function DashboardClient({ transactions }: DashboardClientProps) {
	const { year: currentYear, month: currentMonth } = getCurrentYearMonth();
	const availableYears = useMemo(
		() => getAvailableYears(transactions),
		[transactions],
	);

	const initialYear = availableYears.includes(currentYear)
		? currentYear
		: (availableYears[availableYears.length - 1] ?? currentYear);

	const [filters, setFilters] = useState<DashboardFilters>({
		year: initialYear,
		month: initialYear === currentYear ? currentMonth : null,
		perspective: "all",
		selectedCategories: [],
		currency: "",
		account: "",
	});

	const filtered = useMemo(
		() => filterTransactions(transactions, filters),
		[transactions, filters],
	);

	const summary = useMemo(() => computeSummary(filtered), [filtered]);
	const categoryData = useMemo(
		() => computeCategoryBreakdown(filtered),
		[filtered],
	);

	const yearTransactions = useMemo(
		() =>
			filterTransactions(transactions, {
				...filters,
				month: null,
				selectedCategories: [],
			}),
		[transactions, filters],
	);
	const monthlyData = useMemo(
		() => computeMonthlyData(yearTransactions),
		[yearTransactions],
	);

	const topCounterparties = useMemo(
		() => computeTopCounterparties(filtered),
		[filtered],
	);
	const fixedCosts = useMemo(() => computeFixedCosts(filtered), [filtered]);

	const isYearView = filters.month === null;

	return (
		<div className="space-y-4 sm:space-y-6">
			<DashboardFilterBar
				filters={filters}
				onChange={setFilters}
				transactions={transactions}
			/>

			<SummaryCards data={summary} perspective={filters.perspective} />

			<div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
				<CategoryChart data={categoryData} />
				{isYearView ? (
					<MonthlyChart data={monthlyData} perspective={filters.perspective} />
				) : (
					<TopCounterpartiesChart data={topCounterparties} />
				)}
			</div>

			{isYearView && (
				<div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
					<TrendChart data={monthlyData} perspective={filters.perspective} />
					<TopCounterpartiesChart data={topCounterparties} />
				</div>
			)}

			<FixedCostsTable data={fixedCosts} />
		</div>
	);
}
