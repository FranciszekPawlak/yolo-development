import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";

export async function AppShell({
	children,
	activeTab,
}: {
	children: React.ReactNode;
	activeTab: "upload" | "dashboard";
}) {
	const session = await auth();
	if (!session?.user) redirect("/");

	return (
		<div className="flex min-h-screen flex-col bg-zinc-950 pb-16 sm:pb-0">
			{/* Desktop header */}
			<header className="sticky top-0 z-40 hidden border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl sm:block">
				<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
					<div className="flex items-center gap-6">
						<Link href="/upload" className="flex items-center gap-2">
							<span className="text-lg">💰</span>
							<span className="text-sm font-bold tracking-tight text-white">
								Expense Analyzer
							</span>
						</Link>
						<nav className="flex gap-1">
							<NavLink href="/upload" active={activeTab === "upload"}>
								Upload
							</NavLink>
							<NavLink href="/dashboard" active={activeTab === "dashboard"}>
								Dashboard
							</NavLink>
						</nav>
					</div>
					<div className="flex items-center gap-3">
						<span className="hidden text-xs text-zinc-500 md:block">
							{session.user.email}
						</span>
						<form
							action={async () => {
								"use server";
								await signOut({ redirectTo: "/" });
							}}
						>
							<button
								type="submit"
								className="cursor-pointer rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200"
							>
								Wyloguj
							</button>
						</form>
					</div>
				</div>
			</header>

			{/* Mobile top bar */}
			<header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl sm:hidden">
				<div className="flex h-12 items-center justify-between px-4">
					<Link href="/upload" className="flex items-center gap-2">
						<span className="text-base">💰</span>
						<span className="text-xs font-bold tracking-tight text-white">
							Expenses
						</span>
					</Link>
					<form
						action={async () => {
							"use server";
							await signOut({ redirectTo: "/" });
						}}
					>
						<button
							type="submit"
							className="cursor-pointer rounded-lg border border-zinc-800 px-2.5 py-1 text-[11px] text-zinc-400"
						>
							Wyloguj
						</button>
					</form>
				</div>
			</header>

			<main className="flex-1">{children}</main>

			{/* Mobile bottom nav */}
			<nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800/80 bg-zinc-950/95 backdrop-blur-xl sm:hidden">
				<div className="flex h-14">
					<MobileNavLink
						href="/upload"
						active={activeTab === "upload"}
						icon={
							<svg
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={1.5}
								role="img"
								aria-label="Upload"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
								/>
							</svg>
						}
					>
						Upload
					</MobileNavLink>
					<MobileNavLink
						href="/dashboard"
						active={activeTab === "dashboard"}
						icon={
							<svg
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={1.5}
								role="img"
								aria-label="Dashboard"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
								/>
							</svg>
						}
					>
						Dashboard
					</MobileNavLink>
				</div>
			</nav>
		</div>
	);
}

function NavLink({
	href,
	active,
	children,
}: {
	href: string;
	active: boolean;
	children: React.ReactNode;
}) {
	return (
		<Link
			href={href}
			className={`rounded-lg px-3 py-1.5 text-sm transition ${
				active
					? "bg-zinc-800 font-medium text-white"
					: "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
			}`}
		>
			{children}
		</Link>
	);
}

function MobileNavLink({
	href,
	active,
	icon,
	children,
}: {
	href: string;
	active: boolean;
	icon: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<Link
			href={href}
			className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition ${
				active ? "text-blue-400" : "text-zinc-500"
			}`}
		>
			{icon}
			{children}
		</Link>
	);
}
