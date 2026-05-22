import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "~/globals.css";
import MainLayout from "~/ui/Layout";

export const metadata: Metadata = {
	title: "Franciszek Pawlak",
	description: "Franciszek Pawlak IT",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.cdnfonts.com/css/chomsky" />
				<link
					rel="preload"
					href="https://fonts.cdnfonts.com/css/chomsky"
					as="style"
				/>
				<link rel="stylesheet" href="https://fonts.cdnfonts.com/css/chomsky" />
				<link
					rel="preconnect"
					href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400&display=swap"
				/>
				<link
					rel="preload"
					href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400&display=swap"
					as="style"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400&display=swap"
				/>
			</head>
			<body className="bg-black">
				<MainLayout>{children}</MainLayout>
				<Analytics />
			</body>
		</html>
	);
}
