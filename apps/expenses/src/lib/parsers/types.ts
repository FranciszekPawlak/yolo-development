export interface Transaction {
	/** Unique ID per bank (ING: Nr transakcji). Used for deduplication. */
	id: string;
	date: string;
	bookingDate: string;
	counterparty: string;
	title: string;
	/** Negative = expense, positive = income */
	amount: number;
	currency: string;
	/** Subaccount name (e.g. "KONTO Direct", "Melina") */
	account: string;
	category: string;
	/** Source bank identifier */
	source: string;
	isInternalTransfer: boolean;
}

export interface MasterFile {
	lastUpdated: string;
	transactions: Transaction[];
}

export interface BankParser {
	name: string;
	detect(fileName: string, firstLines: string): boolean;
	parse(content: Buffer): Transaction[];
}
