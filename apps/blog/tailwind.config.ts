import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				gothic: ["Chomsky"],
				montserrat: ["Montserrat"],
				googleSansFlex: ["Google Sans Flex"],
			},
			animation: {
				swipe: "swipeAnimation 1s ease-in-out infinite",
				"orbit": "orbit 8s ease-in-out infinite",
			},
			keyframes: {
				swipeAnimation: {
					"0%": { transform: "rotate(0deg)" },
					"50%": { transform: "rotate(10deg)" },
					"100%": { transform: "rotate(0deg)" },
				},
				orbit: {
					"0%": { transform: "translate(0px, 0px)" },
					"15%": { transform: "translate(25px, -15px)" },
					"30%": { transform: "translate(-10px, -25px)" },
					"45%": { transform: "translate(-30px, 5px)" },
					"60%": { transform: "translate(-15px, 20px)" },
					"75%": { transform: "translate(20px, 10px)" },
					"90%": { transform: "translate(15px, -10px)" },
					"100%": { transform: "translate(0px, 0px)" },
				},
			},
		},
	},
	plugins: [],
} satisfies Config;
