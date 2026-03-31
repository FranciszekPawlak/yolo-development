"use client";

import { Button, Card } from "@heroui/react";

export interface Filters {
	dateFrom: string;
	dateTo: string;
	currency: string;
	account: string;
}

interface DashboardFiltersProps {
	filters: Filters;
	onChange: (filters: Filters) => void;
	currencies: string[];
	accounts: string[];
}

export function DashboardFilters({
	filters,
	onChange,
	currencies,
	accounts,
}: DashboardFiltersProps) {
	const hasFilters =
		filters.dateFrom || filters.dateTo || filters.currency || filters.account;

	return (
		<Card className="border border-zinc-800 bg-zinc-900/60 p-3 sm:p-4">
			<div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end sm:gap-4">
				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="filter-from"
						className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider sm:text-[11px]"
					>
						Od
					</label>
					<input
						id="filter-from"
						type="date"
						value={filters.dateFrom}
						onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
						className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 outline-none transition focus:border-blue-500 sm:h-10 sm:rounded-xl sm:px-3 sm:text-sm"
					/>
				</div>
				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="filter-to"
						className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider sm:text-[11px]"
					>
						Do
					</label>
					<input
						id="filter-to"
						type="date"
						value={filters.dateTo}
						onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
						className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 outline-none transition focus:border-blue-500 sm:h-10 sm:rounded-xl sm:px-3 sm:text-sm"
					/>
				</div>
				{currencies.length > 1 && (
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="filter-currency"
							className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider sm:text-[11px]"
						>
							Waluta
						</label>
						<select
							id="filter-currency"
							value={filters.currency}
							onChange={(e) =>
								onChange({ ...filters, currency: e.target.value })
							}
							className="h-9 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 outline-none transition focus:border-blue-500 sm:h-10 sm:rounded-xl sm:px-3 sm:text-sm"
						>
							<option value="">Wszystkie</option>
							{currencies.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
					</div>
				)}
				{accounts.length > 1 && (
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="filter-account"
							className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider sm:text-[11px]"
						>
							Konto
						</label>
						<select
							id="filter-account"
							value={filters.account}
							onChange={(e) =>
								onChange({ ...filters, account: e.target.value })
							}
							className="h-9 w-full min-w-0 rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 outline-none transition focus:border-blue-500 sm:h-10 sm:min-w-40 sm:rounded-xl sm:px-3 sm:text-sm"
						>
							<option value="">Wszystkie</option>
							{accounts.map((a) => (
								<option key={a} value={a}>
									{a}
								</option>
							))}
						</select>
					</div>
				)}
				{hasFilters && (
					<div className="col-span-2 sm:col-span-1">
						<Button
							size="sm"
							variant="ghost"
							fullWidth
							onPress={() =>
								onChange({
									dateFrom: "",
									dateTo: "",
									currency: "",
									account: "",
								})
							}
						>
							Wyczyść filtry
						</Button>
					</div>
				)}
			</div>
		</Card>
	);
}
