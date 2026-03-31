"use server";

import { auth } from "@/lib/auth";
import { categorize } from "@/lib/categorize";
import {
	type DriveFileInfo,
	downloadFile,
	listRawFiles,
	saveMasterFile,
	uploadRawFile,
} from "@/lib/drive";
import { parseFile } from "@/lib/parsers";
import type { MasterFile, Transaction } from "@/lib/parsers/types";

export interface GenerateResult {
	uploaded: number;
	skippedFiles: number;
	total: number;
	duplicatesSkipped: number;
	errors: string[];
}

async function getTokenOrThrow() {
	const session = await auth();
	if (!session?.accessToken) throw new Error("Nie zalogowano");
	return session.accessToken;
}

/**
 * Single entry point for the generate flow:
 * 1. Upload any new local files to Drive raw/
 * 2. Fetch ALL files from raw/
 * 3. Parse everything, deduplicate, categorize
 * 4. Build master.json from scratch and save to Drive
 */
export async function generateAction(
	formData: FormData,
): Promise<GenerateResult> {
	const token = await getTokenOrThrow();

	// --- Step 1: upload new local files to raw/ (skip duplicates by MD5) ---
	const localFiles = formData.getAll("files") as File[];
	let uploaded = 0;
	let skippedFiles = 0;

	for (const file of localFiles) {
		const buffer = Buffer.from(await file.arrayBuffer());
		const wasUploaded = await uploadRawFile(token, file.name, buffer);
		if (wasUploaded) {
			uploaded++;
		} else {
			skippedFiles++;
		}
	}

	// --- Step 2: list ALL raw files on Drive ---
	const rawFiles = await listRawFiles(token);
	if (rawFiles.length === 0) {
		throw new Error("Brak plików w katalogu raw na Drive");
	}

	// --- Step 3: parse everything from scratch ---
	const seenIds = new Set<string>();
	const allTransactions: Transaction[] = [];
	let duplicatesSkipped = 0;
	const errors: string[] = [];

	for (const rawFile of rawFiles) {
		try {
			const { name, buffer } = await downloadFile(token, rawFile.id);
			const { transactions } = parseFile(name, buffer);

			for (const tx of transactions) {
				if (seenIds.has(tx.id)) {
					duplicatesSkipped++;
					continue;
				}
				tx.category = categorize(tx.counterparty, tx.title);
				if (tx.category === "internal_transfer") {
					tx.isInternalTransfer = true;
				}
				allTransactions.push(tx);
				seenIds.add(tx.id);
			}
		} catch (err) {
			const msg = `${rawFile.name}: ${err instanceof Error ? err.message : err}`;
			console.warn(`Pominięto plik ${msg}`);
			errors.push(msg);
		}
	}

	// --- Step 4: save master.json ---
	allTransactions.sort((a, b) => b.date.localeCompare(a.date));
	const master: MasterFile = {
		lastUpdated: new Date().toISOString(),
		transactions: allTransactions,
	};
	await saveMasterFile(token, master);

	return {
		uploaded,
		skippedFiles,
		total: allTransactions.length,
		duplicatesSkipped,
		errors,
	};
}

/** List raw files from Drive for the file browser table. */
export async function listDriveFilesAction(): Promise<DriveFileInfo[]> {
	const token = await getTokenOrThrow();
	return listRawFiles(token);
}
