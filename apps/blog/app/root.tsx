import type { LinksFunction } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import stylesheet from "~/global.css?url";
import MainLayout from "./ui/Layout";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
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
				<Meta />
				<Links />
			</head>
			<body className="bg-black">
				<MainLayout>{children}</MainLayout>
				<ScrollRestoration />
				<Scripts />
				<Analytics />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
