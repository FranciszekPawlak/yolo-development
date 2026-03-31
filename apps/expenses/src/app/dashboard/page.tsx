import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard-client";
import { auth } from "@/lib/auth";
import { loadMasterFile } from "@/lib/drive";
import type { MasterFile } from "@/lib/parsers/types";

export default async function DashboardPage() {
	const session = await auth();
	if (!session?.accessToken) redirect("/");

	const master: MasterFile | null = await loadMasterFile(session.accessToken);

	if (!master || master.transactions.length === 0) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 sm:px-6 sm:py-20">
				<div className="text-4xl">📊</div>
				<p className="text-center text-sm text-zinc-400">
					Brak danych. Najpierw wrzuć pliki z transakcjami.
				</p>
				<Link
					href="/upload"
					className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
				>
					Przejdź do uploadu
				</Link>
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
			<div className="mb-4 sm:mb-6">
				<h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
					Dashboard
				</h1>
				<p className="mt-0.5 text-[10px] text-zinc-500 sm:mt-1 sm:text-xs">
					Ostatnia aktualizacja:{" "}
					{new Date(master.lastUpdated).toLocaleString("pl-PL")}
					{" · "}
					{master.transactions.length} transakcji
				</p>
			</div>

			<DashboardClient transactions={master.transactions} />
		</div>
	);
}
