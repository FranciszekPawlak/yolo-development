"use client";

import { Button } from "@heroui/react";
import { CATEGORY_COLORS, type Category } from "@/lib/categorize";
import type { DashboardFilters } from "@/lib/dashboard-utils";
import {
	getActiveCategories,
	getAvailableMonths,
	getAvailableYears,
	getMonthFullName,
	getMonthShortName,
} from "@/lib/dashboard-utils";
import type { Transaction } from "@/lib/parsers/types";

interface DashboardFilterBarProps {
	filters: DashboardFilters;
	onChange: (filters: DashboardFilters) => void;
	transactions: Transaction[];
}

const PERSPECTIVES: {
	value: DashboardFilters["perspective"];
	label: string;
	icon: string;
}[] = [
	{ value: "all", label: "Wszystko", icon: "📊" },
	{ value: "business", label: "Firma", icon: "🏢" },
	{ value: "personal", label: "Prywatne", icon: "🏠" },
];

export function DashboardFilterBar({
	filters,
	onChange,
	transactions,
}: DashboardFilterBarProps) {
	const years = getAvailableYears(transactions);
	const months = getAvailableMonths(transactions, filters.year);
	const activeCategories = getActiveCategories(transactions);

	const filteredCategories = activeCategories.filter((c) => {
		if (filters.perspective === "all")
			return c.category !== "internal_transfer";
		if (filters.perspective === "neutral") return true;
		return c.perspective === filters.perspective || c.perspective === "neutral";
	});

	const businessCats = filteredCategories.filter(
		(c) => c.perspective === "business",
	);
	const personalCats = filteredCategories.filter(
		(c) => c.perspective === "personal",
	);
	const neutralCats = filteredCategories.filter(
		(c) => c.perspective === "neutral",
	);

	const toggleCategory = (cat: Category) => {
		const current = filters.selectedCategories;
		const next = current.includes(cat)
			? current.filter((c) => c !== cat)
			: [...current, cat];
		onChange({ ...filters, selectedCategories: next });
	};

	const currentMonthLabel =
		filters.month !== null
			? `${getMonthFullName(filters.month)} ${filters.year}`
			: `Cały ${filters.year}`;

	return (
		<div className="space-y-3">
			{/* Period header */}
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-bold text-white sm:text-xl">
					{currentMonthLabel}
				</h2>
				{(filters.selectedCategories.length > 0 ||
					filters.perspective !== "all" ||
					filters.month !== null) && (
					<Button
						size="sm"
						variant="ghost"
						className="text-xs text-zinc-400"
						onPress={() =>
							onChange({
								...filters,
								month: null,
								perspective: "all",
								selectedCategories: [],
							})
						}
					>
						Resetuj filtry
					</Button>
				)}
			</div>

			{/* Year pills */}
			{years.length > 1 && (
				<div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
					{years.map((y) => (
						<button
							key={y}
							type="button"
							onClick={() =>
								onChange({
									...filters,
									year: y,
									month: null,
									selectedCategories: [],
								})
							}
							className={`shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
								filters.year === y
									? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
									: "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
							}`}
						>
							{y}
						</button>
					))}
				</div>
			)}

			{/* Month pills */}
			<div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide sm:gap-1.5">
				<button
					type="button"
					onClick={() =>
						onChange({ ...filters, month: null, selectedCategories: [] })
					}
					className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[11px] font-medium transition-all sm:px-4 sm:text-xs ${
						filters.month === null
							? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
							: "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
					}`}
				>
					Rok
				</button>
				{Array.from({ length: 12 }, (_, i) => i).map((m) => {
					const hasData = months.includes(m);
					return (
						<button
							key={m}
							type="button"
							disabled={!hasData}
							onClick={() =>
								onChange({
									...filters,
									month: m,
									selectedCategories: [],
								})
							}
							className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[11px] font-medium transition-all disabled:cursor-not-allowed disabled:opacity-25 sm:px-4 sm:text-xs ${
								filters.month === m
									? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
									: "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
							}`}
						>
							{getMonthShortName(m)}
						</button>
					);
				})}
			</div>

			{/* Perspective toggle */}
			<div className="flex gap-1.5">
				{PERSPECTIVES.map((p) => (
					<button
						key={p.value}
						type="button"
						onClick={() =>
							onChange({
								...filters,
								perspective: p.value,
								selectedCategories: [],
							})
						}
						className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
							filters.perspective === p.value
								? p.value === "business"
									? "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/40"
									: p.value === "personal"
										? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40"
										: "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40"
								: "bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700/80 hover:text-zinc-300"
						}`}
					>
						<span className="text-sm">{p.icon}</span>
						{p.label}
					</button>
				))}
			</div>

			{/* Category pills */}
			<CategoryPillGroup
				title="Firma"
				categories={businessCats}
				selectedCategories={filters.selectedCategories}
				onToggle={toggleCategory}
				show={
					filters.perspective === "all" || filters.perspective === "business"
				}
			/>
			<CategoryPillGroup
				title="Prywatne"
				categories={personalCats}
				selectedCategories={filters.selectedCategories}
				onToggle={toggleCategory}
				show={
					filters.perspective === "all" || filters.perspective === "personal"
				}
			/>
			<CategoryPillGroup
				title="Inne"
				categories={neutralCats}
				selectedCategories={filters.selectedCategories}
				onToggle={toggleCategory}
				show={neutralCats.length > 0}
			/>
		</div>
	);
}

function CategoryPillGroup({
	title,
	categories,
	selectedCategories,
	onToggle,
	show,
}: {
	title: string;
	categories: { category: Category; label: string; count: number }[];
	selectedCategories: Category[];
	onToggle: (cat: Category) => void;
	show: boolean;
}) {
	if (!show || categories.length === 0) return null;

	return (
		<div>
			<span className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-zinc-500">
				{title}
			</span>
			<div className="flex flex-wrap gap-1.5">
				{categories.map((c) => {
					const isSelected = selectedCategories.includes(c.category);
					const color = CATEGORY_COLORS[c.category] ?? "#525252";
					return (
						<button
							key={c.category}
							type="button"
							onClick={() => onToggle(c.category)}
							className="group flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-xs"
							style={{
								backgroundColor: isSelected ? `${color}22` : undefined,
								color: isSelected ? color : undefined,
								border: isSelected
									? `1px solid ${color}44`
									: "1px solid transparent",
							}}
						>
							<span
								className="inline-block h-2 w-2 shrink-0 rounded-full transition-transform group-hover:scale-125"
								style={{ backgroundColor: color }}
							/>
							<span
								className={
									isSelected ? "" : "text-zinc-400 group-hover:text-zinc-200"
								}
							>
								{c.label}
							</span>
							<span
								className={`tabular-nums ${isSelected ? "opacity-60" : "text-zinc-600"}`}
							>
								{c.count}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
