import Link from "next/link";

export default function Creator() {
	return (
		<div className="h-[75vh] flex flex-col items-center justify-center">
			<span className="font-montserrat"> founder of</span>

			<div className="relative">
				<Link
					target="_blank"
					href="https://cierpienie.club"
					className="relative z-10 my-2 rounded-2xl p-4 text-3xl duration-500 font-googleSansFlex font-black hover:text-green-600 hover:underline"
				>
					cierpienie.club
				</Link>

				<div
					className="absolute -right-2 -top-5 h-16 w-16 animate-orbit rounded-full bg-green-500/60 blur-2xl"
					aria-hidden="true"
				/>
			</div>
		</div>
	);
}
