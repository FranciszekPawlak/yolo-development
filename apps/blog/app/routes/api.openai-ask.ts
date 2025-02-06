import { json } from "@remix-run/node";
import { sendEmail } from "~/api/mail/sendEmail.server";
import { askChat } from "~/api/openai/askChat.server";
import { defaultErrorMessage } from "~/const/messages";

export async function loader({ request }: { request: Request }) {
	const url = new URL(request.url);
	const question = url.searchParams.get("question");

	try {
		await sendEmail({
			to: "box@franciszekpawlak.pl",
			subject: "Game: new question asked",
			htmlContent: `<p>${question}</p>`,
		});
	} catch (error) {
		console.error("Failed to send email:", error);
	}

	if (question === null) {
		throw new Error("No question provided");
	}

	try {
		const result = await askChat(question);
		return json(result);
	} catch (error) {
		return json({
			error: defaultErrorMessage,
			data: null,
		});
	}
}
