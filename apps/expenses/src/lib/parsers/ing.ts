import Papa from "papaparse";
import type { BankParser, Transaction } from "./types";

/**
 * ING Bank CSV format:
 * - Encoding: Windows-1250
 * - Delimiter: semicolon
 * - Lines 1-24: document metadata (skip)
 * - Line 25: column headers
 * - Lines 26+: data rows
 *
 * Columns (0-indexed):
 *  0: Data transakcji
 *  1: Data księgowania
 *  2: Dane kontrahenta
 *  3: Tytuł
 *  4: Nr rachunku
 *  5: Nazwa banku
 *  6: Szczegóły
 *  7: Nr transakcji
 *  8: Kwota transakcji (waluta rachunku)
 *  9: Waluta
 * 14: Konto (subaccount name)
 */

function decodeWindows1250(buffer: Buffer): string {
	const decoder = new TextDecoder("windows-1250");
	return decoder.decode(buffer);
}

function parsePolishNumber(raw: string): number {
	const cleaned = raw.replace(/\s/g, "").replace(",", ".");
	return Number.parseFloat(cleaned);
}

function clean(s: string): string {
	return s
		.replace(/^['"\s]+|['"\s]+$/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

export const ingParser: BankParser = {
	name: "ing",

	detect(_fileName: string, firstLines: string): boolean {
		return firstLines.includes("ING Bank");
	},

	parse(content: Buffer): Transaction[] {
		const text = decodeWindows1250(content);
		const lines = text.split("\n");

		// Find the header row (contains "Data transakcji")
		let headerIdx = -1;
		for (let i = 0; i < Math.min(lines.length, 30); i++) {
			if (lines[i].includes("Data transakcji")) {
				headerIdx = i;
				break;
			}
		}
		if (headerIdx === -1) return [];

		// Data starts right after the header
		const dataText = lines.slice(headerIdx + 1).join("\n");

		const parsed = Papa.parse<string[]>(dataText, {
			delimiter: ";",
			header: false,
			skipEmptyLines: true,
		});

		const transactions: Transaction[] = [];

		for (const row of parsed.data) {
			if (!row[0] || !row[0].match(/^\d{4}-\d{2}-\d{2}$/)) continue;

			const transactionId = clean(row[7] ?? "");
			if (!transactionId) continue;

			const counterparty = clean(row[2] ?? "");
			const title = clean(row[3] ?? "");
			const isInternal = /przelew\s+w[lł]asny/i.test(title);

			transactions.push({
				id: `ing_${transactionId}`,
				date: row[0].trim(),
				bookingDate: (row[1] ?? row[0]).trim(),
				counterparty,
				title,
				amount: parsePolishNumber(row[8] ?? "0"),
				currency: clean(row[9] ?? "PLN"),
				account: clean(row[14] ?? ""),
				category: "",
				source: "ing",
				isInternalTransfer: isInternal,
			});
		}

		return transactions;
	},
};
