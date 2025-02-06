import { Link, useParams } from "@remix-run/react";
import type { PropsWithChildren } from "react";

export const CategoryLink = ({
	to,
	children,
	active,
	target,
}: PropsWithChildren<{ to: string; active: boolean; target?: string }>) => {
	return (
		<Link
			to={to}
			target={target}
			className={`ml-8 font-gothic text-lg ${active ? "hidden" : "block"}`}
		>
			{children}
		</Link>
	);
};

export const Categories = () => {
	const { type } = useParams();
	return (
		<div className="my-4">
			<nav className="flex justify-end">
				<CategoryLink to="/media/books" active={type === "books"}>
					books
				</CategoryLink>
				<CategoryLink to="/media/games" active={type === "games"}>
					games
				</CategoryLink>
				<CategoryLink
					to="https://open.spotify.com/user/franekdzbanekk?si=c03db31e80c44445"
					target="_blank"
					active={false}
				>
					spotify
				</CategoryLink>
			</nav>
		</div>
	);
};
