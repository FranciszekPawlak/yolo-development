import * as XLSX from "xlsx";
import type { BankParser, Transaction } from "./types";

/**
 * Revolut Consolidated Statement format (XLSX):
 * - Sheet: "Sheet1"
 * - Contains multiple sections (Savings, Main account, etc.)
 * - Each section has:
 *   - Summary block (first rows)
 *   - Transaction header row: Date | Description | Money out | Money in | Balance
 *   - Transaction data rows
 * - Dates: Polish locale ("1 sty 2026") or datetime objects
 * - Amounts: Polish format with non-breaking spaces as thousands separator
 *   and comma as decimal separator, suffixed with currency ("300 PLN")
 */

const POLISH_MONTHS: Record<string, string> = {
	sty: "01",
	lut: "02",
	mar: "03",
	kwi: "04",
	maj: "05",
	cze: "06",
	lip: "07",
	sie: "08",
	wrz: "09",
	paź: "10",
	paz: "10",
	lis: "11",
	gru: "12",
};

function parseRevolutDate(raw: unknown): string | null {
	if (!raw) return null;

	// Handle JS Date objects from xlsx
	if (raw instanceof Date) {
		return raw.toISOString().slice(0, 10);
	}

	const str = String(raw).trim();

	// Try ISO date
	if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

	// Polish format: "1 sty 2026"
	const match = str.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/);
	if (match) {
		const [, day, monthStr, year] = match;
		const month = POLISH_MONTHS[monthStr.toLowerCase().slice(0, 3)];
		if (month) {
			return `${year}-${month}-${day.padStart(2, "0")}`;
		}
	}

	return null;
}

function parseRevolutAmount(raw: string | null | undefined): {
	amount: number;
	currency: string;
} {
	if (!raw) return { amount: 0, currency: "PLN" };

	const str = String(raw).trim();

	// Extract currency (last word)
	const parts = str.split(/\s+/);
	const currency = parts[parts.length - 1] || "PLN";

	// Extract numeric part: remove non-breaking spaces (\xa0, Â), regular spaces, currency
	const numericStr = str
		.replace(/\s*\w{3}$/, "") // remove currency suffix
		.replace(/[\s\u00a0Â]+/g, "") // remove all spaces/NBSP
		.replace(",", "."); // decimal comma to dot

	return { amount: Number.parseFloat(numericStr) || 0, currency };
}

export const revolutParser: BankParser = {
	name: "revolut",

	detect(fileName: string, _firstLines: string): boolean {
		// XLSX files with "consolidated-statement" or "revolut" in name
		const lower = fileName.toLowerCase();
		return (
			(lower.endsWith(".xlsx") || lower.endsWith(".xls")) &&
			(lower.includes("consolidated-statement") || lower.includes("revolut"))
		);
	},

	parse(content: Buffer): Transaction[] {
		const workbook = XLSX.read(content, { type: "buffer" });
		const transactions: Transaction[] = [];

		for (const sheetName of workbook.SheetNames) {
			const sheet = workbook.Sheets[sheetName];
			const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
				header: 1,
				defval: null,
			});

			let inTransactionBlock = false;
			let sectionName = "";

			for (let i = 0; i < rows.length; i++) {
				const row = rows[i];
				if (!row || row.length === 0) continue;

				const firstCell = String(row[0] ?? "").trim();

				// Detect section name (e.g. "Transactions for Savings Accounts - PLN")
				if (firstCell.startsWith("Transactions for")) {
					sectionName = firstCell;
					inTransactionBlock = false;
					continue;
				}

				// Detect transaction header row
				if (firstCell === "Date" && String(row[1] ?? "") === "Description") {
					inTransactionBlock = true;
					continue;
				}

				// Detect section summary (ends transaction block)
				if (firstCell.startsWith("Summary for")) {
					inTransactionBlock = false;
					sectionName = "";
					continue;
				}

				if (!inTransactionBlock) continue;

				// Parse transaction row: Date | Description | Money out | Money in | Balance
				const date = parseRevolutDate(row[0]);
				if (!date) continue;

				const description = String(row[1] ?? "").trim();
				if (!description) continue;

				const moneyOutRaw = row[2] ? String(row[2]) : null;
				const moneyInRaw = row[3] ? String(row[3]) : null;

				const moneyOut = parseRevolutAmount(moneyOutRaw);
				const moneyIn = parseRevolutAmount(moneyInRaw);

				const amount = moneyIn.amount > 0 ? moneyIn.amount : -moneyOut.amount;
				const currency =
					moneyIn.amount > 0 ? moneyIn.currency : moneyOut.currency || "PLN";

				// Generate unique ID from date + description + amount (Revolut has no transaction ID)
				const id = `rev_${date}_${description.replace(/\s+/g, "_").slice(0, 40)}_${amount.toFixed(2)}`;

				const isInternal = /withdrawing savings|depositing savings/i.test(
					description,
				);

				transactions.push({
					id,
					date,
					bookingDate: date,
					counterparty: "Revolut",
					title: description,
					amount,
					currency,
					account: sectionName || "Revolut",
					category: "",
					source: "revolut",
					isInternalTransfer: isInternal,
				});
			}
		}

		return transactions;
	},
};
