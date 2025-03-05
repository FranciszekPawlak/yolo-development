import { Link } from "@remix-run/react";

const StyledLink = ({
	to,
	children,
	target,
}: React.PropsWithChildren<{ to: string; target?: string }>) => (
	<Link
		target={target}
		to={to}
		className="my-2 rounded-2xl p-4 font-gothic text-3xl duration-500 hover:bg-white hover:text-black hover:underline"
	>
		{children}
	</Link>
);

export default function Links() {
	return (
		<div className="h-screen flex flex-col items-center justify-center">
			<StyledLink to="/media/books">What I like</StyledLink>
			<StyledLink to="/articles/overview">Articles</StyledLink>
			<StyledLink target="_blank" to="https://github.com/FranciszekPawlak">
				Github
			</StyledLink>
			<StyledLink
				target="_blank"
				to="https://www.linkedin.com/in/franciszekpawlak"
			>
				LinkedIn
			</StyledLink>
			<StyledLink target="_blank" to="https://x.com/FranekPawlak">
				Twitter
			</StyledLink>
		</div>
	);
}
