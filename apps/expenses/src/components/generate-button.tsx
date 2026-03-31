"use client";

import { Button, Spinner } from "@heroui/react";
import { useState } from "react";
import { type GenerateResult, generateAction } from "@/lib/generate";

interface GenerateButtonProps {
	readonly files: File[];
	readonly onComplete: (result: GenerateResult) => void;
}

export function GenerateButton({ files, onComplete }: GenerateButtonProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleGenerate() {
		setLoading(true);
		setError(null);

		try {
			const formData = new FormData();
			for (const file of files) {
				formData.append("files", file);
			}
			const result = await generateAction(formData);
			onComplete(result);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Wystąpił błąd");
		} finally {
			setLoading(false);
		}
	}

	const hasLocalFiles = files.length > 0;

	return (
		<div className="space-y-3">
			<Button fullWidth size="lg" isPending={loading} onPress={handleGenerate}>
				{({ isPending }) => (
					<>
						{isPending ? <Spinner color="current" size="sm" /> : null}
						{isPending
							? hasLocalFiles
								? "Upload i generowanie..."
								: "Generowanie..."
							: hasLocalFiles
								? `Generuj (+${files.length} ${files.length === 1 ? "nowy plik" : "nowych plików"})`
								: "Generuj"}
					</>
				)}
			</Button>

			{error && (
				<div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
					{error}
				</div>
			)}
		</div>
	);
}
