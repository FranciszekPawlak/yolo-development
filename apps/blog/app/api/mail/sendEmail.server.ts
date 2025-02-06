import Brevo from "@getbrevo/brevo";

const apiKey = process.env.BREVO_API_KEY ?? "";

export async function sendEmail({
	to,
	subject,
	htmlContent,
}: { to: string; subject: string; htmlContent: string }) {
	try {
		const apiInstance = new Brevo.TransactionalEmailsApi();
		apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

		const sendSmtpEmail = {
			to: [{ email: to }],
			sender: {
				email: "box@franciszekpawlak.pl",
				name: "Franciszek Pawlak YOLO",
			},
			subject: subject,
			htmlContent: htmlContent,
		};

		const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
		return response;
	} catch (error) {
		console.error("Failed to send email:", error);
		throw error;
	}
}
