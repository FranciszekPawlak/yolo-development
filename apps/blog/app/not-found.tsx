import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex h-[60vh] flex-col items-center justify-center font-montserrat text-sm">
			<p>nothing to show at the moment {";_"}</p>
			<Link href="/" className="mt-4 underline">
				Go home
			</Link>
		</div>
	);
}
