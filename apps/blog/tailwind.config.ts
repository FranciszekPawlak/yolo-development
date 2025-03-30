import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				gothic: ["Chomsky"],
				montserrat: ["Montserrat"],
			},
			animation: {
				swipe: "swipeAnimation 1s ease-in-out infinite",
			},
			keyframes: {
				swipeAnimation: {
					"0%": { transform: "rotate(0deg)" },
					"50%": { transform: "rotate(10deg)" },
					"100%": { transform: "rotate(0deg)" },
				},
			},
		},
	},
	plugins: [],
} satisfies Config;
