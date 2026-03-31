export type Category =
	| "internal_transfer"
	// Business categories (strict: only ZUS, Santander, Google Workspace, Mentzen, OVH, Mikrus, hitme)
	| "biz_income"
	| "biz_tax"
	| "biz_zus"
	| "biz_leasing"
	| "biz_accounting"
	| "biz_cloud"
	// Personal categories
	| "subscriptions"
	| "transport"
	| "food_delivery"
	| "groceries"
	| "restaurants"
	| "shopping_online"
	| "shopping"
	| "sport"
	| "donations"
	| "investments"
	| "parking"
	| "rent"
	| "health"
	| "entertainment"
	| "cash_withdrawal"
	| "cash_deposit"
	| "interest"
	| "family"
	| "gifts"
	| "education"
	| "travel"
	| "fuel"
	| "insurance"
	| "car"
	| "uncategorized";

export type Perspective = "business" | "personal" | "neutral";

export const CATEGORY_LABELS: Record<Category, string> = {
	internal_transfer: "Przelewy wewnętrzne",
	// Business
	biz_income: "Przychody z firmy",
	biz_tax: "Podatki (PIT/VAT)",
	biz_zus: "ZUS",
	biz_leasing: "Leasing",
	biz_accounting: "Księgowość",
	biz_cloud: "IT / Cloud",
	// Personal
	subscriptions: "Subskrypcje",
	transport: "Transport",
	food_delivery: "Jedzenie (delivery)",
	groceries: "Zakupy spożywcze",
	restaurants: "Restauracje / Kawiarnie",
	shopping_online: "Zakupy online",
	shopping: "Zakupy",
	sport: "Sport / Fitness",
	donations: "Darowizny",
	investments: "Inwestycje",
	parking: "Parking",
	rent: "Czynsz / Mieszkanie",
	health: "Zdrowie",
	entertainment: "Rozrywka",
	cash_withdrawal: "Wypłata gotówki",
	cash_deposit: "Wpłata gotówki",
	interest: "Odsetki bankowe",
	family: "Rodzina",
	gifts: "Prezenty",
	education: "Edukacja",
	travel: "Podróże",
	fuel: "Paliwo",
	insurance: "Ubezpieczenia",
	car: "Samochód",
	uncategorized: "Bez kategorii",
};

export const CATEGORY_PERSPECTIVE: Record<Category, Perspective> = {
	internal_transfer: "neutral",
	// Business - strict list
	biz_income: "business",
	biz_tax: "business",
	biz_zus: "business",
	biz_leasing: "business",
	biz_accounting: "business",
	biz_cloud: "business",
	// Personal
	subscriptions: "personal",
	transport: "personal",
	food_delivery: "personal",
	groceries: "personal",
	restaurants: "personal",
	shopping_online: "personal",
	shopping: "personal",
	sport: "personal",
	donations: "personal",
	investments: "neutral",
	parking: "personal",
	rent: "personal",
	health: "personal",
	entertainment: "personal",
	cash_withdrawal: "neutral",
	cash_deposit: "neutral",
	interest: "neutral",
	family: "personal",
	gifts: "personal",
	education: "personal",
	travel: "personal",
	fuel: "personal",
	insurance: "personal",
	car: "personal",
	uncategorized: "neutral",
};

export const CATEGORY_COLORS: Record<Category, string> = {
	internal_transfer: "#6b7280",
	biz_income: "#22c55e",
	biz_tax: "#dc2626",
	biz_zus: "#f97316",
	biz_leasing: "#8b5cf6",
	biz_accounting: "#a855f7",
	biz_cloud: "#06b6d4",
	subscriptions: "#ec4899",
	transport: "#3b82f6",
	food_delivery: "#f59e0b",
	groceries: "#84cc16",
	restaurants: "#ef4444",
	shopping_online: "#6366f1",
	shopping: "#a78bfa",
	sport: "#14b8a6",
	donations: "#f472b6",
	investments: "#eab308",
	parking: "#78716c",
	rent: "#d946ef",
	health: "#22d3ee",
	entertainment: "#fb923c",
	cash_withdrawal: "#9ca3af",
	cash_deposit: "#4ade80",
	interest: "#fbbf24",
	family: "#fb7185",
	gifts: "#c084fc",
	education: "#2dd4bf",
	travel: "#38bdf8",
	fuel: "#a3a3a3",
	insurance: "#64748b",
	car: "#94a3b8",
	uncategorized: "#525252",
};

/** Categories considered as fixed/recurring costs */
export const FIXED_COST_CATEGORIES: Category[] = [
	"subscriptions",
	"biz_leasing",
	"biz_accounting",
	"biz_zus",
	"biz_cloud",
	"rent",
	"sport",
	"donations",
	"insurance",
];

export const BUSINESS_CATEGORIES: Category[] = [
	"biz_income",
	"biz_tax",
	"biz_zus",
	"biz_leasing",
	"biz_accounting",
	"biz_cloud",
];

export const PERSONAL_CATEGORIES: Category[] = [
	"subscriptions",
	"transport",
	"food_delivery",
	"groceries",
	"restaurants",
	"shopping_online",
	"shopping",
	"sport",
	"donations",
	"parking",
	"rent",
	"health",
	"entertainment",
	"family",
	"gifts",
	"education",
	"travel",
	"fuel",
	"insurance",
	"car",
];

const RULES: Array<{ pattern: RegExp; category: Category }> = [
	// ──────── Internal transfers (hidden from all charts) ────────
	{ pattern: /przelew\s+w[lł]asny/i, category: "internal_transfer" },
	{
		pattern: /przelew\s+(?:mi[eę]dzy|wewn[eę]trzny)/i,
		category: "internal_transfer",
	},
	{ pattern: /revolut\*\*\d+/i, category: "internal_transfer" },
	{ pattern: /revolut/i, category: "internal_transfer" },
	{ pattern: /depositing\s*savings/i, category: "internal_transfer" },
	{ pattern: /withdrawing\s*savings/i, category: "internal_transfer" },

	// ──────── Business Income (ONLY eRecruitment invoices) ────────
	{ pattern: /erecruitment/i, category: "biz_income" },

	// ──────── Business Tax ────────
	{
		pattern: /urz[aą]d\s*skarb|centrum\s*rozliczeniowe/i,
		category: "biz_tax",
	},
	{ pattern: /\/TI\/N\d+\/OKR\//i, category: "biz_tax" },
	{ pattern: /PIT-5|VAT-?7|PIT-?36|CIT/i, category: "biz_tax" },
	{ pattern: /podatek.*dochodow|podatek.*vat/i, category: "biz_tax" },
	{ pattern: /OBC\.PODATEK\s*OD\s*ODSET/i, category: "biz_tax" },

	// ──────── Business ZUS ────────
	{ pattern: /\bZUS\b/i, category: "biz_zus" },
	{ pattern: /centrala\s*zus/i, category: "biz_zus" },
	{
		pattern:
			/sk[lł]adka\s*(stycze|lut|marz|kwie|maj|czerw|lip|sierp|wrze|pa[zź]dzier|listopad|grudz|za\s)/i,
		category: "biz_zus",
	},

	// ──────── Business Leasing (Santander/Multirent) ────────
	{ pattern: /multirent|santander\s*consumer/i, category: "biz_leasing" },
	{ pattern: /leasing/i, category: "biz_leasing" },
	{ pattern: /105141\/2025/i, category: "biz_leasing" },

	// ──────── Business Accounting (Mentzen) ────────
	{ pattern: /mentzen/i, category: "biz_accounting" },
	{ pattern: /ksi[eę]gow|rachunkow|accounting/i, category: "biz_accounting" },

	// ──────── Business Cloud / IT (Google Workspace, OVH, Mikrus, hitme) ────────
	{ pattern: /google\s*(workspace|gsuite|cloud)/i, category: "biz_cloud" },
	{ pattern: /GSUITE_/i, category: "biz_cloud" },
	{ pattern: /ovhcloud|ovh\s/i, category: "biz_cloud" },
	{ pattern: /mikrus/i, category: "biz_cloud" },
	{ pattern: /hitme/i, category: "biz_cloud" },
	{ pattern: /mrugalski\.pl/i, category: "biz_cloud" },

	// ──────── Subscriptions (personal) ────────
	{ pattern: /spotify/i, category: "subscriptions" },
	{ pattern: /netflix/i, category: "subscriptions" },
	{ pattern: /google\s*one/i, category: "subscriptions" },
	{ pattern: /hbo\s*max|help\.(hbomax|max)\.com/i, category: "subscriptions" },
	{ pattern: /disney\+|disneyplus/i, category: "subscriptions" },
	{ pattern: /youtube\s*premium/i, category: "subscriptions" },
	{ pattern: /apple\s*(music|tv|one)/i, category: "subscriptions" },
	{ pattern: /amazon\s*prime/i, category: "subscriptions" },
	{ pattern: /audible/i, category: "subscriptions" },
	{ pattern: /chatgpt|openai/i, category: "subscriptions" },
	{ pattern: /github/i, category: "subscriptions" },
	{ pattern: /notion/i, category: "subscriptions" },
	{ pattern: /icloud/i, category: "subscriptions" },
	{ pattern: /mobile.traffic.data/i, category: "subscriptions" },
	{ pattern: /tidal/i, category: "subscriptions" },
	{ pattern: /crunchyroll/i, category: "subscriptions" },

	// ──────── Transport ────────
	{ pattern: /bolt\.eu|bolt\s/i, category: "transport" },
	{ pattern: /uber(?!\s*eat)/i, category: "transport" },
	{ pattern: /freenow|free\s*now/i, category: "transport" },
	{ pattern: /taxi/i, category: "transport" },
	{ pattern: /pkp|koleje|intercity/i, category: "transport" },
	{ pattern: /flixbus|flix\s*bus/i, category: "transport" },
	{ pattern: /dott\s*scooter/i, category: "transport" },
	{ pattern: /lime\s*scooter|lime\s*ride/i, category: "transport" },
	{ pattern: /hulajnog/i, category: "transport" },

	// ──────── Food delivery ────────
	{ pattern: /glovo/i, category: "food_delivery" },
	{ pattern: /wolt[\s.]/i, category: "food_delivery" },
	{ pattern: /uber\s*eat/i, category: "food_delivery" },
	{ pattern: /pyszne/i, category: "food_delivery" },
	{ pattern: /jush\.pl|jush\s/i, category: "food_delivery" },

	// ──────── Groceries ────────
	{ pattern: /lidl/i, category: "groceries" },
	{ pattern: /biedronka/i, category: "groceries" },
	{ pattern: /carrefour/i, category: "groceries" },
	{ pattern: /kaufland/i, category: "groceries" },
	{ pattern: /auchan/i, category: "groceries" },
	{ pattern: /netto\s/i, category: "groceries" },
	{ pattern: /[zż]abka|zabka/i, category: "groceries" },
	{ pattern: /supermarket|spo[zż]ywcz/i, category: "groceries" },
	{ pattern: /piatka|pi[aą]tka/i, category: "groceries" },
	{ pattern: /PSS\s+SKLEP/i, category: "groceries" },
	{ pattern: /rossmann/i, category: "groceries" },
	{ pattern: /pepco/i, category: "groceries" },
	{ pattern: /drogeria/i, category: "groceries" },
	{ pattern: /hebe\s/i, category: "groceries" },
	{ pattern: /good\s*lood/i, category: "groceries" },
	{ pattern: /batex/i, category: "groceries" },

	// ──────── Restaurants / Cafes ────────
	{
		pattern: /restaura|bistro|bar\s|kawiarni|cafe|coffe|coffee|grill/i,
		category: "restaurants",
	},
	{ pattern: /starbucks|sbx/i, category: "restaurants" },
	{ pattern: /mcdonald|kfc|burger\s*king/i, category: "restaurants" },
	{ pattern: /white\s*bear/i, category: "restaurants" },
	{ pattern: /kebab/i, category: "restaurants" },
	{ pattern: /pizza|pizzeria/i, category: "restaurants" },
	{ pattern: /sushi/i, category: "restaurants" },

	// ──────── Shopping online ────────
	{ pattern: /allegro/i, category: "shopping_online" },
	{ pattern: /amazon(?!\s*prime)/i, category: "shopping_online" },
	{ pattern: /zalando/i, category: "shopping_online" },
	{ pattern: /shein/i, category: "shopping_online" },
	{ pattern: /aliexpress/i, category: "shopping_online" },
	{ pattern: /gamivo/i, category: "shopping_online" },
	{ pattern: /woblink/i, category: "shopping_online" },
	{ pattern: /lite\s*e-?commerce/i, category: "shopping_online" },

	// ──────── Shopping (physical) ────────
	{ pattern: /nike\s/i, category: "shopping" },
	{ pattern: /adidas/i, category: "shopping" },
	{ pattern: /zara\s/i, category: "shopping" },
	{ pattern: /h&m\s|h\s*&\s*m/i, category: "shopping" },
	{ pattern: /ikea/i, category: "shopping" },
	{ pattern: /alerabat/i, category: "shopping" },
	{ pattern: /empik/i, category: "shopping" },
	{ pattern: /reserved/i, category: "shopping" },
	{ pattern: /decathlon/i, category: "shopping" },
	{ pattern: /leroy\s*merlin/i, category: "shopping" },
	{ pattern: /castorama/i, category: "shopping" },
	{ pattern: /action\s/i, category: "shopping" },
	{ pattern: /tkmaxx|tk\s*maxx/i, category: "shopping" },

	// ──────── Sport / Fitness ────────
	{ pattern: /well\s*fitness/i, category: "sport" },
	{ pattern: /gym|si[lł]ownia|fitness|fitssey|moovly/i, category: "sport" },
	{ pattern: /multisport/i, category: "sport" },

	// ──────── Donations / Charity (personal) ────────
	{ pattern: /unicef/i, category: "donations" },
	{ pattern: /fundacj|darowizn|charit/i, category: "donations" },
	{ pattern: /siepomaga/i, category: "donations" },
	{ pattern: /pajacyk/i, category: "donations" },
	{ pattern: /stowarzyszeni/i, category: "donations" },

	// ──────── Investments ────────
	{ pattern: /z[lł]oto|gold\s/i, category: "investments" },
	{ pattern: /IKZE/i, category: "investments" },

	// ──────── Car (personal) ────────
	{ pattern: /oponeo/i, category: "car" },
	{ pattern: /wagas/i, category: "car" },
	{ pattern: /myjnia|car\s*wash/i, category: "car" },

	// ──────── Fuel ────────
	{ pattern: /orlen|shell\s|bp\s*stacja|lotos|circle\s*k/i, category: "fuel" },
	{ pattern: /stacja\s*(paliw|benzynowa)/i, category: "fuel" },

	// ──────── Parking ────────
	{
		pattern: /parking|bilet\s*parkingowy|strefa\s*p[lł]atn/i,
		category: "parking",
	},
	{ pattern: /biuro\s*obsl.*strefy/i, category: "parking" },
	{ pattern: /automat\s*\d/i, category: "parking" },

	// ──────── Insurance (personal) ────────
	{ pattern: /generali/i, category: "insurance" },
	{ pattern: /ubezpiecz/i, category: "insurance" },
	{ pattern: /polis[ay]/i, category: "insurance" },

	// ──────── Rent / Housing ────────
	{ pattern: /czynsz|wspólnota|administracj/i, category: "rent" },

	// ──────── Health ────────
	{
		pattern: /apteka|pharma|lekarz|medyc|klinika|szpital|doctor/i,
		category: "health",
	},

	// ──────── Entertainment ────────
	{
		pattern: /kino|cinema|teatr|theatre|bilety|koncert/i,
		category: "entertainment",
	},

	// ──────── Gifts ────────
	{ pattern: /kwiaty|bukiet|kwiaciarni/i, category: "gifts" },

	// ──────── Travel ────────
	{
		pattern: /booking\.com|airbnb|hotel|hostel|ryanair|wizzair|lot\s*polish/i,
		category: "travel",
	},
	{ pattern: /tavex/i, category: "travel" },

	// ──────── Education ────────
	{ pattern: /kurs|szkoleni|udemy|coursera/i, category: "education" },

	// ──────── Cash ────────
	{
		pattern: /wyp[lł]ata\s*got[oó]wki|bankomat|ATM/i,
		category: "cash_withdrawal",
	},
	{ pattern: /wp[lł]ata\s*got[oó]wki/i, category: "cash_deposit" },

	// ──────── Bank interest ────────
	{
		pattern: /NALICZONE\s*ODSETKI|odsetki\s*bank|interest\s*earned/i,
		category: "interest",
	},

	// ──────── Cashback ────────
	{ pattern: /cashback/i, category: "shopping" },

	// ──────── Family (personal) ────────
	{ pattern: /arkadiusz\s*pawlak/i, category: "family" },
	{ pattern: /miko[lł]aj\s*pawlak/i, category: "family" },
	{ pattern: /trzeciak\s*paulina|paulina.*trzeciak/i, category: "family" },
	{ pattern: /dawid\s*karcz/i, category: "family" },
];

export function categorize(counterparty: string, title: string): Category {
	const text = `${counterparty} ${title}`;
	for (const rule of RULES) {
		if (rule.pattern.test(text)) return rule.category;
	}
	return "uncategorized";
}

/** Get perspective group for a category */
export function getCategoryPerspective(category: Category): Perspective {
	return CATEGORY_PERSPECTIVE[category] ?? "neutral";
}

/** Get categories that belong to a perspective */
export function getCategoriesForPerspective(
	perspective: Perspective,
): Category[] {
	return (Object.entries(CATEGORY_PERSPECTIVE) as [Category, Perspective][])
		.filter(([, p]) => p === perspective)
		.map(([c]) => c);
}
