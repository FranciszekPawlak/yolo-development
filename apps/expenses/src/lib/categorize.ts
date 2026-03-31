export type Category =
	| "internal_transfer"
	| "salary"
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
	| "taxes"
	| "leasing"
	| "accounting"
	| "rent"
	| "health"
	| "entertainment"
	| "cash_withdrawal"
	| "cash_deposit"
	| "interest"
	| "revolut_topup"
	| "business"
	| "family"
	| "gifts"
	| "education"
	| "travel"
	| "uncategorized";

export const CATEGORY_LABELS: Record<Category, string> = {
	internal_transfer: "Przelewy wewnętrzne",
	salary: "Wynagrodzenie",
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
	taxes: "Podatki",
	leasing: "Leasing",
	accounting: "Księgowość",
	rent: "Czynsz / Mieszkanie",
	health: "Zdrowie",
	entertainment: "Rozrywka",
	cash_withdrawal: "Wypłata gotówki",
	cash_deposit: "Wpłata gotówki",
	interest: "Odsetki bankowe",
	revolut_topup: "Doładowanie Revolut",
	business: "Wydatki firmowe",
	family: "Rodzina",
	gifts: "Prezenty",
	education: "Edukacja",
	travel: "Podróże",
	uncategorized: "Bez kategorii",
};

/** Categories considered as fixed/recurring costs */
export const FIXED_COST_CATEGORIES: Category[] = [
	"subscriptions",
	"leasing",
	"accounting",
	"taxes",
	"rent",
	"sport",
	"donations",
];

const RULES: Array<{ pattern: RegExp; category: Category }> = [
	// Internal transfers (handled separately, but also caught by regex)
	{ pattern: /przelew\s+w[lł]asny/i, category: "internal_transfer" },

	// Income / Salary
	{
		pattern: /wynagrodzeni|pensj|salary|wyp[lł]ata\s+wynag/i,
		category: "salary",
	},

	// Subscriptions
	{ pattern: /spotify/i, category: "subscriptions" },
	{ pattern: /netflix/i, category: "subscriptions" },
	{ pattern: /google\s*one/i, category: "subscriptions" },
	{ pattern: /hbo\s*max|help\.hbomax/i, category: "subscriptions" },
	{ pattern: /disney\+|disneyplus/i, category: "subscriptions" },
	{ pattern: /youtube\s*premium/i, category: "subscriptions" },
	{ pattern: /apple\s*(music|tv|one)/i, category: "subscriptions" },
	{ pattern: /amazon\s*prime/i, category: "subscriptions" },
	{ pattern: /audible/i, category: "subscriptions" },
	{ pattern: /chatgpt|openai/i, category: "subscriptions" },
	{ pattern: /github/i, category: "subscriptions" },
	{ pattern: /notion/i, category: "subscriptions" },
	{ pattern: /icloud/i, category: "subscriptions" },

	// Transport
	{ pattern: /bolt\.eu|bolt\s/i, category: "transport" },
	{ pattern: /uber(?!\s*eat)/i, category: "transport" },
	{ pattern: /freenow|free\s*now/i, category: "transport" },
	{ pattern: /taxi/i, category: "transport" },
	{ pattern: /pkp|koleje|intercity/i, category: "transport" },
	{ pattern: /flixbus|flix\s*bus/i, category: "transport" },

	// Food delivery
	{ pattern: /glovo/i, category: "food_delivery" },
	{ pattern: /wolt\s/i, category: "food_delivery" },
	{ pattern: /uber\s*eat/i, category: "food_delivery" },
	{ pattern: /pyszne/i, category: "food_delivery" },
	{ pattern: /jush\.pl|jush/i, category: "food_delivery" },

	// Groceries
	{ pattern: /lidl/i, category: "groceries" },
	{ pattern: /biedronka/i, category: "groceries" },
	{ pattern: /carrefour/i, category: "groceries" },
	{ pattern: /kaufland/i, category: "groceries" },
	{ pattern: /auchan/i, category: "groceries" },
	{ pattern: /netto\s/i, category: "groceries" },
	{ pattern: /zabka|[zż]abka/i, category: "groceries" },
	{ pattern: /supermarket|spo[zż]ywcz/i, category: "groceries" },
	{ pattern: /piatka|pi[aą]tka/i, category: "groceries" },
	{ pattern: /PSS\s+SKLEP/i, category: "groceries" },
	{ pattern: /rossmann/i, category: "groceries" },

	// Restaurants / Cafes
	{
		pattern: /restaura|bistro|bar\s|kawiarni|cafe|coffe|coffee|grill/i,
		category: "restaurants",
	},
	{ pattern: /starbucks|sbx/i, category: "restaurants" },
	{ pattern: /mcdonald|kfc|burger\s*king/i, category: "restaurants" },
	{ pattern: /podmiejska/i, category: "restaurants" },
	{ pattern: /white\s*bear/i, category: "restaurants" },
	{ pattern: /indian\s*grill/i, category: "restaurants" },

	// Shopping online
	{ pattern: /allegro/i, category: "shopping_online" },
	{ pattern: /amazon(?!\s*prime)/i, category: "shopping_online" },
	{ pattern: /zalando/i, category: "shopping_online" },
	{ pattern: /shein/i, category: "shopping_online" },
	{ pattern: /aliexpress/i, category: "shopping_online" },
	{ pattern: /gamivo/i, category: "shopping_online" },
	{ pattern: /woblink/i, category: "shopping_online" },

	// Shopping (physical)
	{ pattern: /nike\s/i, category: "shopping" },
	{ pattern: /adidas/i, category: "shopping" },
	{ pattern: /zara\s/i, category: "shopping" },
	{ pattern: /h&m\s|h\s*&\s*m/i, category: "shopping" },
	{ pattern: /ikea/i, category: "shopping" },
	{ pattern: /alerabat/i, category: "shopping" },

	// Sport / Fitness
	{ pattern: /well\s*fitness/i, category: "sport" },
	{ pattern: /gym|si[lł]ownia|fitness|fitssey|moovly/i, category: "sport" },

	// Donations
	{ pattern: /unicef/i, category: "donations" },
	{ pattern: /fundacj|darowizn|charit/i, category: "donations" },

	// Investments
	{ pattern: /tavex/i, category: "investments" },
	{ pattern: /z[lł]oto|gold\s/i, category: "investments" },
	{ pattern: /IKZE/i, category: "investments" },

	// Parking
	{ pattern: /parking|bilet\s*parkingowy/i, category: "parking" },

	// Taxes
	{ pattern: /podatek|PODATEK/i, category: "taxes" },
	{ pattern: /urz[aą]d\s*skarb/i, category: "taxes" },
	{ pattern: /ZUS|sk[lł]adka/i, category: "taxes" },

	// Leasing
	{ pattern: /leasing/i, category: "leasing" },

	// Accounting
	{ pattern: /ksi[eę]gow|rachunkow|accounting/i, category: "accounting" },

	// Rent / Housing
	{ pattern: /czynsz|wspólnota|administracj/i, category: "rent" },

	// Health
	{
		pattern: /apteka|pharma|lekarz|medyc|klinika|szpital|doctor/i,
		category: "health",
	},

	// Entertainment
	{ pattern: /kino|cinema|teatr|theatre|bilety/i, category: "entertainment" },
	{ pattern: /kwiaty|bukiet/i, category: "gifts" },

	// Cash withdrawal
	{
		pattern: /wyp[lł]ata\s*got[oó]wki|bankomat|ATM/i,
		category: "cash_withdrawal",
	},
	// Cash deposit
	{ pattern: /wp[lł]ata\s*got[oó]wki/i, category: "cash_deposit" },

	// Bank interest
	{ pattern: /NALICZONE\s*ODSETKI|odsetki\s*bank/i, category: "interest" },
	{ pattern: /OBC\.PODATEK\s*OD\s*ODSET/i, category: "taxes" },

	// Revolut top-up
	{ pattern: /revolut/i, category: "revolut_topup" },

	// Cashback
	{ pattern: /cashback/i, category: "shopping" },

	// Business (NIP-prefixed transfers)
	{ pattern: /\/NIP\//i, category: "business" },

	// Family
	{ pattern: /arkadiusz\s*pawlak/i, category: "family" },
];

export function categorize(counterparty: string, title: string): Category {
	const text = `${counterparty} ${title}`;
	for (const rule of RULES) {
		if (rule.pattern.test(text)) return rule.category;
	}
	return "uncategorized";
}
