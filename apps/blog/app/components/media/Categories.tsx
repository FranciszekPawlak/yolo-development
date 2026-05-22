"use client";

import Link from "next/link";
import type { PropsWithChildren } from "react";

export const CategoryLink = ({
	href,
	children,
	active,
	target,
}: PropsWithChildren<{
	href: string;
	active: boolean;
	target?: string;
}>) => {
	return (
		<Link
			href={href}
			target={target}
			className={`ml-8 font-gothic text-lg ${active ? "hidden" : "block"}`}
		>
			{children}
		</Link>
	);
};

export const Categories = ({ type }: { type: string }) => {
	return (
		<div className="my-4">
			<nav className="flex justify-end">
				<CategoryLink href="/media/books" active={type === "books"}>
					books
				</CategoryLink>
				<CategoryLink href="/media/games" active={type === "games"}>
					games
				</CategoryLink>
				<CategoryLink
					href="https://open.spotify.com/user/franekdzbanekk?si=c03db31e80c44445"
					target="_blank"
					active={false}
				>
					spotify
				</CategoryLink>
			</nav>
		</div>
	);
};
