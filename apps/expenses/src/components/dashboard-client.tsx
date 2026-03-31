"use client";

import { useMemo, useState } from "react";
import { CategoryChart } from "@/components/category-chart";
import { DashboardFilters, type Filters } from "@/components/dashboard-filters";
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
	filterTransactions,
	getUniqueValues,
} from "@/lib/dashboard-utils";
import type { Transaction } from "@/lib/parsers/types";

interface DashboardClientProps {
	transactions: Transaction[];
}

export function DashboardClient({ transactions }: DashboardClientProps) {
	const [filters, setFilters] = useState<Filters>({
		dateFrom: "",
		dateTo: "",
		currency: "",
		account: "",
	});

	const currencies = useMemo(
		() => getUniqueValues(transactions, "currency"),
		[transactions],
	);
	const accounts = useMemo(
		() => getUniqueValues(transactions, "account"),
		[transactions],
	);

	const filtered = useMemo(
		() => filterTransactions(transactions, filters),
		[transactions, filters],
	);

	const summary = useMemo(() => computeSummary(filtered), [filtered]);
	const categoryData = useMemo(
		() => computeCategoryBreakdown(filtered),
		[filtered],
	);
	const monthlyData = useMemo(() => computeMonthlyData(filtered), [filtered]);
	const topCounterparties = useMemo(
		() => computeTopCounterparties(filtered),
		[filtered],
	);
	const fixedCosts = useMemo(() => computeFixedCosts(filtered), [filtered]);

	return (
		<div className="space-y-4 sm:space-y-6">
			<DashboardFilters
				filters={filters}
				onChange={setFilters}
				currencies={currencies}
				accounts={accounts}
			/>

			<SummaryCards data={summary} />

			<div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
				<CategoryChart data={categoryData} />
				<MonthlyChart data={monthlyData} />
			</div>

			<div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
				<TrendChart data={monthlyData} />
				<TopCounterpartiesChart data={topCounterparties} />
			</div>

			<FixedCostsTable data={fixedCosts} />
		</div>
	);
}
