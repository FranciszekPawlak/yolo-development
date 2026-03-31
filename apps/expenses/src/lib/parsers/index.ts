import { ingParser } from "./ing";
import { revolutParser } from "./revolut";
import type { BankParser, Transaction } from "./types";

const parsers: BankParser[] = [revolutParser, ingParser];

/** Auto-detect bank from file content and parse transactions. */
export function parseFile(
	fileName: string,
	content: Buffer,
): { transactions: Transaction[]; bankName: string } {
	const peek = content.subarray(0, 2048).toString("latin1");

	for (const parser of parsers) {
		if (parser.detect(fileName, peek)) {
			return {
				transactions: parser.parse(content),
				bankName: parser.name,
			};
		}
	}

	throw new Error(
		`Nierozpoznany format pliku: ${fileName}. Obsługiwane banki: ${parsers.map((p) => p.name).join(", ")}`,
	);
}

/** Detect bank name from file content without full parsing. */
export function detectBank(fileName: string, content: Buffer): string | null {
	const peek = content.subarray(0, 2048).toString("latin1");
	for (const parser of parsers) {
		if (parser.detect(fileName, peek)) return parser.name;
	}
	return null;
}
