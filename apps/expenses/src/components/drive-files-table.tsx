"use client";

import { Button, Chip, Spinner } from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { DriveFileInfo } from "@/lib/drive";
import { listDriveFilesAction } from "@/lib/generate";

const PAGE_SIZE = 10;

function formatBytes(bytes: string): string {
	const num = Number.parseInt(bytes, 10);
	if (num < 1024) return `${num} B`;
	if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
	return `${(num / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("pl-PL", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function getMonthKey(iso: string): string {
	const d = new Date(iso);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(key: string): string {
	const [year, month] = key.split("-");
	const date = new Date(Number(year), Number(month) - 1);
	return date.toLocaleDateString("pl-PL", { year: "numeric", month: "long" });
}

function detectBankFromName(name: string): string {
	const lower = name.toLowerCase();
	if (lower.includes("consolidated-statement") || lower.includes("revolut"))
		return "Revolut";
	if (lower.includes("lista_transakcji") || lower.includes("ing")) return "ING";
	return "—";
}

export function DriveFilesTable() {
	const [files, setFiles] = useState<DriveFileInfo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
	const [page, setPage] = useState(0);

	const fetchFiles = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await listDriveFilesAction();
			setFiles(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Błąd ładowania plików");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchFiles();
	}, [fetchFiles]);

	const months = useMemo(() => {
		const set = new Set<string>();
		for (const f of files) {
			set.add(getMonthKey(f.createdTime));
		}
		return Array.from(set).sort((a, b) => b.localeCompare(a));
	}, [files]);

	const filteredFiles = useMemo(() => {
		if (!selectedMonth) return files;
		return files.filter((f) => getMonthKey(f.createdTime) === selectedMonth);
	}, [files, selectedMonth]);

	const totalPages = Math.max(1, Math.ceil(filteredFiles.length / PAGE_SIZE));
	const pagedFiles = filteredFiles.slice(
		page * PAGE_SIZE,
		(page + 1) * PAGE_SIZE,
	);

	useEffect(() => {
		setPage(0);
	}, [selectedMonth]);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Spinner size="lg" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
				{error}
			</div>
		);
	}

	if (files.length === 0) {
		return (
			<div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-8 text-center text-sm text-zinc-500">
				Brak plików w katalogu raw na Drive.
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{/* Month filter pills */}
			<div className="flex flex-wrap gap-1.5">
				<button
					type="button"
					onClick={() => setSelectedMonth(null)}
					className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition ${
						selectedMonth === null
							? "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30"
							: "bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
					}`}
				>
					Wszystkie ({files.length})
				</button>
				{months.map((m) => {
					const count = files.filter(
						(f) => getMonthKey(f.createdTime) === m,
					).length;
					return (
						<button
							type="button"
							key={m}
							onClick={() => setSelectedMonth(m)}
							className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition ${
								selectedMonth === m
									? "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30"
									: "bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
							}`}
						>
							{formatMonthLabel(m)} ({count})
						</button>
					);
				})}
			</div>

			{/* Table */}
			<div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
				<table className="w-full text-left text-xs sm:text-sm">
					<thead>
						<tr className="border-b border-zinc-800 text-zinc-500">
							<th className="px-3 py-2.5 font-medium sm:px-4">Plik</th>
							<th className="hidden px-3 py-2.5 font-medium sm:table-cell sm:px-4">
								Bank
							</th>
							<th className="hidden px-3 py-2.5 font-medium sm:table-cell sm:px-4">
								Rozmiar
							</th>
							<th className="px-3 py-2.5 font-medium sm:px-4">Data dodania</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-zinc-800/60">
						{pagedFiles.map((file) => (
							<tr
								key={file.id}
								className="text-zinc-300 transition hover:bg-zinc-800/30"
							>
								<td className="px-3 py-2.5 sm:px-4">
									<div className="flex items-center gap-2">
										<Chip
											size="sm"
											className="hidden shrink-0 text-[10px] uppercase sm:inline-flex"
										>
											{file.name.split(".").pop()}
										</Chip>
										<span
											className="truncate max-w-[180px] sm:max-w-xs"
											title={file.name}
										>
											{file.name}
										</span>
									</div>
								</td>
								<td className="hidden px-3 py-2.5 sm:table-cell sm:px-4">
									<span className="text-zinc-400">
										{detectBankFromName(file.name)}
									</span>
								</td>
								<td className="hidden px-3 py-2.5 text-zinc-400 sm:table-cell sm:px-4">
									{formatBytes(file.size)}
								</td>
								<td className="px-3 py-2.5 text-zinc-400 sm:px-4">
									{formatDate(file.createdTime)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between px-1">
					<span className="text-[11px] text-zinc-500">
						{page * PAGE_SIZE + 1}–
						{Math.min((page + 1) * PAGE_SIZE, filteredFiles.length)} z{" "}
						{filteredFiles.length}
					</span>
					<div className="flex gap-1">
						<Button
							size="sm"
							variant="ghost"
							isDisabled={page === 0}
							onPress={() => setPage((p) => p - 1)}
						>
							Wstecz
						</Button>
						<Button
							size="sm"
							variant="ghost"
							isDisabled={page >= totalPages - 1}
							onPress={() => setPage((p) => p + 1)}
						>
							Dalej
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
