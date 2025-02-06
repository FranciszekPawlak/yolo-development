import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				gothic: ["Chomsky"],
				montserrat: ["Montserrat"],
			},
		},
	},
	plugins: [],
} satisfies Config;
