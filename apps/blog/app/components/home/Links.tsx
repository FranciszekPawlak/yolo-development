import Link from "next/link";

const StyledLink = ({
	href,
	children,
	target,
}: React.PropsWithChildren<{ href: string; target?: string }>) => (
	<Link
		target={target}
		href={href}
		className="my-2 rounded-2xl p-4 font-gothic text-3xl duration-500 hover:bg-white hover:text-black hover:underline"
	>
		{children}
	</Link>
);

export default function Links() {
	return (
		<div className="h-screen flex flex-col items-center justify-center">
			<StyledLink href="/media/books">Stalking Zone</StyledLink>
			<StyledLink href="/photos/overview">Photos</StyledLink>
			<StyledLink href="/tech/overview">Tech</StyledLink>
			<StyledLink target="_blank" href="https://github.com/FranciszekPawlak">
				Github
			</StyledLink>
			<StyledLink
				target="_blank"
				href="https://www.linkedin.com/in/franciszekpawlak"
			>
				LinkedIn
			</StyledLink>
		</div>
	);
}
