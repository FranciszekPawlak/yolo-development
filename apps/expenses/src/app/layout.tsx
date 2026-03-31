import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Expense Analyzer",
	description: "Personal expense tracking and analysis",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	themeColor: "#09090b",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="pl"
			className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
		>
			<body className="flex min-h-full flex-col bg-zinc-950 text-zinc-100">
				{children}
			</body>
		</html>
	);
}
