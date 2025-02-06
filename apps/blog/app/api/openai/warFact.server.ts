import { defaultErrorMessage } from "~/const/messages";
import type { AiResult } from "~/types";

export async function getWarFact(): Promise<AiResult> {
	try {
		const prompt =
			"Provide one of the most brutal and shocking historical facts about warfare from any period in history, focusing on an event that highlights the extreme cruelty or inhumanity experienced by soldiers or civilians. Keep the fact concise, emphasizing the brutality of war across all historical epochs.";

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
				max_tokens: 150,
				temperature: 0.7,
			}),
		});

		const data = await response.json();
		return {
			error: null,
			data: data.choices[0].message.content,
		};
	} catch (error) {
		console.error("Error fetching war fact:", error);
		return {
			error: defaultErrorMessage,
			data: null,
		};
	}
}
