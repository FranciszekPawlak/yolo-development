import { defaultErrorMessage } from "~/const/messages";
import type { AiResult } from "~/types";

export async function getBookSummary(
	title: string,
	author: string,
): Promise<AiResult> {
	try {
		const prompt = `Provide information about the book "${title}" by ${author}.
		Please format the response in the following structure:
		<p><b>Date:</b> [original publication date]</p>
		<p><b>Category:</b> [main genre/category]</p>
		<p><b>Pages:</b> [number of pages]</p>
		<p><b>Brief Summary:</b> [Give me a short summary of the book in English]</p>
		<p><b>Criticism:</b> [In one concise sentence, describe the general critical reception and highlight one key strength or weakness of the book.]</p>
		
		If you're not certain about any information, respond with "N/A" for that field. Keep the summary concise and spoiler-free.`;

		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				messages: [
					{
						role: "user",
						content: prompt,
					},
				],
				max_tokens: 250,
				temperature: 0.7,
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
