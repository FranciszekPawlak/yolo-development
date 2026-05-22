import { NextResponse } from "next/server";
import { sendEmail } from "~/api/mail/sendEmail.server";
import { getBookSummary } from "~/api/openai/bookSummary.server";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const title = url.searchParams.get("title");
	const author = url.searchParams.get("author");

	try {
		await sendEmail({
			to: "box@franciszekpawlak.pl",
			subject: "Book: summary request",
			htmlContent: `<p>${title}:${author}</p>`,
		});
	} catch (error) {
		console.error("Failed to send email:", error);
	}

	if (!title || !author) {
		return NextResponse.json({
			error: "Unable to generate summary at this moment. 😐",
			data: null,
		});
	}

	try {
		const result = await getBookSummary(title, author);
		return NextResponse.json(result);
	} catch {
		return NextResponse.json({
			error: "Unable to generate summary at this moment. 😐",
			data: null,
		});
	}
}
