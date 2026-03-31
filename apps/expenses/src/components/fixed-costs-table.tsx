"use client";

import { Card } from "@heroui/react";
import type { FixedCostRow } from "@/lib/dashboard-utils";

const fmt = (n: number) =>
	new Intl.NumberFormat("pl-PL", {
		style: "currency",
		currency: "PLN",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(n);

interface FixedCostsTableProps {
	data: FixedCostRow[];
}

export function FixedCostsTable({ data }: FixedCostsTableProps) {
	if (data.length === 0) return null;

	const total = data.reduce((sum, r) => sum + r.total, 0);
	const totalMonthly = data.reduce((sum, r) => sum + r.monthlyAvg, 0);

	return (
		<Card className="border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
			<h3 className="mb-3 text-xs font-semibold text-zinc-200 sm:mb-4 sm:text-sm">
				Koszty stałe / cykliczne
			</h3>
			<div className="-mx-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5">
				<table className="w-full min-w-[360px] text-xs sm:text-sm">
					<thead>
						<tr className="border-b border-zinc-800 text-left text-[10px] text-zinc-500 uppercase tracking-wider sm:text-[11px]">
							<th className="pb-2.5 pr-3 sm:pb-3 sm:pr-4">Kategoria</th>
							<th className="pb-2.5 pr-3 text-right sm:pb-3 sm:pr-4">Suma</th>
							<th className="hidden pb-3 pr-4 text-right sm:table-cell">
								Śr. / mies.
							</th>
							<th className="pb-2.5 text-right sm:pb-3">Ilość</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-zinc-800/60">
						{data.map((row) => (
							<tr key={row.category}>
								<td className="py-2 pr-3 sm:py-2.5 sm:pr-4">
									<div className="flex items-center gap-2">
										<span
											className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
											style={{ backgroundColor: row.color }}
										/>
										<span className="text-zinc-200">{row.label}</span>
									</div>
								</td>
								<td className="py-2 pr-3 text-right font-medium text-zinc-200 tabular-nums sm:py-2.5 sm:pr-4">
									{fmt(row.total)}
								</td>
								<td className="hidden py-2.5 pr-4 text-right text-zinc-400 tabular-nums sm:table-cell">
									{fmt(row.monthlyAvg)}
								</td>
								<td className="py-2 text-right text-zinc-500 tabular-nums sm:py-2.5">
									{row.count}
								</td>
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr className="border-t border-zinc-700 font-semibold">
							<td className="pt-2.5 pr-3 text-zinc-200 sm:pt-3 sm:pr-4">
								Razem
							</td>
							<td className="pt-2.5 pr-3 text-right text-zinc-200 tabular-nums sm:pt-3 sm:pr-4">
								{fmt(total)}
							</td>
							<td className="hidden pt-3 pr-4 text-right text-zinc-400 tabular-nums sm:table-cell">
								{fmt(totalMonthly)}
							</td>
							<td className="pt-2.5 text-right text-zinc-500 tabular-nums sm:pt-3">
								{data.reduce((s, r) => s + r.count, 0)}
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</Card>
	);
}
