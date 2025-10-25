import { defaultErrorMessage } from "~/const/messages";
import type { AiResult } from "~/types";

export async function getBookSummary(
	title: string,
	author: string,
): Promise<AiResult> {
	try {
		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-4o-mini",
				messages: [
					{
						role: "system",
						content:
							"You are a cynical, sarcastic book critic with a dark sense of humor. Your reviews are sharp, edgy, and brutally honest. You use irony, dark comedy, and existential observations. Your humor is contemporary - think Gen Z/Millennial sarcasm, not safe corporate jokes. Be clever and cutting, not wholesome.",
					},
					{
						role: "user",
						content: `Write a darkly funny, sarcastic review of "${title}" by ${author}. Be cynical and sharp - point out the absurdities, ironies, or dark themes. Use contemporary humor with an edge. Imagine you're ranting about this book to your friend at 2 AM after too much coffee. Be brutally honest but entertaining. Keep it spoiler-free. Write EXACTLY 5 sentences maximum - be concise and punchy. One paragraph only.`,
					},
				],
				max_tokens: 200,
				temperature: 0.95,
			}),
		});

		const data = await response.json();
		return {
			error: null,
			data: data.choices[0].message.content,
		};
	} catch (error) {
		console.error("Error fetching book summary:", error);
		return {
			error: defaultErrorMessage,
			data: null,
		};
	}
}
