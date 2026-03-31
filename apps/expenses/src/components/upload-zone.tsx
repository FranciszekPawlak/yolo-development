"use client";

import { Chip } from "@heroui/react";
import { useCallback, useState } from "react";

interface UploadZoneProps {
	files: File[];
	onFilesChange: (files: File[]) => void;
}

function detectBankLabel(name: string): string {
	const lower = name.toLowerCase();
	if (lower.includes("consolidated-statement") || lower.includes("revolut"))
		return "Revolut";
	if (lower.includes("lista_transakcji") || lower.includes("ing")) return "ING";
	return "Auto";
}

export function UploadZone({ files, onFilesChange }: UploadZoneProps) {
	const [dragActive, setDragActive] = useState(false);

	const ACCEPTED = [".csv", ".xlsx", ".xls"];

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setDragActive(false);
			const dropped = Array.from(e.dataTransfer.files).filter((f) =>
				ACCEPTED.some((ext) => f.name.toLowerCase().endsWith(ext)),
			);
			onFilesChange([...files, ...dropped]);
		},
		[files, onFilesChange],
	);

	const handleFileInput = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (!e.target.files) return;
			onFilesChange([...files, ...Array.from(e.target.files)]);
			e.target.value = "";
		},
		[files, onFilesChange],
	);

	const removeFile = useCallback(
		(idx: number) => {
			onFilesChange(files.filter((_, i) => i !== idx));
		},
		[files, onFilesChange],
	);

	return (
		<div className="space-y-3 sm:space-y-4">
			{/* biome-ignore lint/a11y/noStaticElementInteractions: drop target requires div with drag events */}
			<div
				onDragOver={(e) => {
					e.preventDefault();
					setDragActive(true);
				}}
				onDragLeave={() => setDragActive(false)}
				onDrop={handleDrop}
			>
				<label
					htmlFor="file-input"
					className={`group flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 transition-all duration-200 sm:min-h-52 ${
						dragActive
							? "border-blue-500 bg-blue-500/10 scale-[1.01]"
							: "border-zinc-700/60 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900/60"
					}`}
				>
					<div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 transition group-hover:bg-zinc-700 group-hover:text-zinc-300 sm:mb-3 sm:h-12 sm:w-12">
						<svg
							className="h-5 w-5 sm:h-6 sm:w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={1.5}
							role="img"
							aria-label="Upload"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
							/>
						</svg>
					</div>
					<p className="text-center text-xs text-zinc-400 sm:text-sm">
						Przeciągnij pliki lub{" "}
						<span className="font-medium text-blue-400">
							kliknij, aby wybrać
						</span>
					</p>
					<p className="mt-1 text-[10px] text-zinc-600 sm:mt-1.5 sm:text-xs">
						CSV (ING) · XLSX (Revolut)
					</p>
					<input
						id="file-input"
						type="file"
						accept=".csv,.xlsx,.xls"
						multiple
						className="hidden"
						onChange={handleFileInput}
					/>
				</label>
			</div>

			{files.length > 0 && (
				<div className="space-y-2">
					{files.map((file, idx) => (
						<div
							key={`${file.name}-${idx}`}
							className="flex items-center justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 sm:px-4 sm:py-3"
						>
							<div className="flex min-w-0 items-center gap-2 sm:gap-3">
								<Chip
									size="sm"
									variant="secondary"
									className="shrink-0 text-[10px] uppercase"
								>
									{file.name.split(".").pop()}
								</Chip>
								<div className="min-w-0">
									<p className="truncate text-xs font-medium text-zinc-200 sm:text-sm">
										{file.name}
									</p>
									<p className="text-[10px] text-zinc-500 sm:text-[11px]">
										{(file.size / 1024).toFixed(0)} KB
										{" · "}
										<span className="text-blue-400">
											{detectBankLabel(file.name)}
										</span>
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => removeFile(idx)}
								className="shrink-0 cursor-pointer rounded-lg p-1.5 text-zinc-600 transition hover:bg-zinc-800 hover:text-red-400"
							>
								<svg
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
									role="img"
									aria-label="Usuń"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18 18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
