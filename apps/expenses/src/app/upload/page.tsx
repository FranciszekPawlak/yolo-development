"use client";

import { useState } from "react";
import { DriveFilesTable } from "@/components/drive-files-table";
import { GenerateButton } from "@/components/generate-button";
import { UploadZone } from "@/components/upload-zone";
import type { GenerateResult } from "@/lib/generate";

export default function UploadPage() {
	const [files, setFiles] = useState<File[]>([]);
	const [result, setResult] = useState<GenerateResult | null>(null);
	const [tableKey, setTableKey] = useState(0);

	function handleComplete(res: GenerateResult) {
		setResult(res);
		setFiles([]);
		setTableKey((k) => k + 1);
	}

	return (
		<div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
			<div className="mb-6 sm:mb-8">
				<h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
					Upload transakcji
				</h1>
				<p className="mt-1 text-xs text-zinc-400 sm:mt-1.5 sm:text-sm">
					Wrzuć pliki z banku. CSV (ING) · XLSX (Revolut).
				</p>
			</div>

			<UploadZone files={files} onFilesChange={setFiles} />

			<div className="mt-5 sm:mt-6">
				<GenerateButton files={files} onComplete={handleComplete} />
			</div>

			{result && (
				<div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 sm:mt-6 sm:p-5">
					<h3 className="mb-1.5 text-sm font-semibold text-emerald-300">
						Gotowe!
					</h3>
					<p className="text-xs text-emerald-200 sm:text-sm">
						{result.uploaded > 0 && (
							<>
								Wrzucono <strong>{result.uploaded}</strong>{" "}
								{result.uploaded === 1 ? "plik" : "plików"} na Drive.{" "}
							</>
						)}
						{result.skippedFiles > 0 && (
							<>
								Pominięto <strong>{result.skippedFiles}</strong>{" "}
								{result.skippedFiles === 1
									? "duplikat pliku"
									: "duplikatów plików"}
								.{" "}
							</>
						)}
						Łącznie <strong>{result.total}</strong> transakcji
						{result.duplicatesSkipped > 0 && (
							<>
								{" "}
								(pominięto <strong>{result.duplicatesSkipped}</strong>{" "}
								zduplikowanych transakcji między plikami)
							</>
						)}
						.
					</p>
					{result.errors.length > 0 && (
						<div className="mt-2 text-xs text-amber-300">
							<p className="font-medium">Pominięte pliki:</p>
							<ul className="mt-1 list-inside list-disc text-amber-200/80">
								{result.errors.map((e) => (
									<li key={e}>{e}</li>
								))}
							</ul>
						</div>
					)}
				</div>
			)}

			{/* Drive files section */}
			<div className="mt-10 border-t border-zinc-800 pt-8 sm:mt-12 sm:pt-10">
				<div className="mb-5">
					<h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
						Pliki na Drive
					</h2>
					<p className="mt-0.5 text-xs text-zinc-400 sm:text-sm">
						Pliki w katalogu{" "}
						<code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
							Wydatki/raw
						</code>{" "}
						na Google Drive.
					</p>
				</div>

				<DriveFilesTable key={tableKey} />
			</div>
		</div>
	);
}
