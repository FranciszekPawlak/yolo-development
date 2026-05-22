import { BrevoClient } from "@getbrevo/brevo";

const apiKey = process.env.BREVO_API_KEY ?? "";

export async function sendEmail({
	to,
	subject,
	htmlContent,
}: { to: string; subject: string; htmlContent: string }) {
	try {
		const brevo = new BrevoClient({ apiKey });

		const response = await brevo.transactionalEmails.sendTransacEmail({
			to: [{ email: to }],
			sender: {
				email: "box@franciszekpawlak.pl",
				name: "Franciszek Pawlak YOLO",
			},
			subject,
			htmlContent,
		});

		return response;
	} catch (error) {
		console.error("Failed to send email:", error);
		throw error;
	}
}
