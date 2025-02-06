import { Link } from "@remix-run/react";

interface IProps {
	title: string;
}

export const Header = ({ title }: IProps) => {
	return (
		<div className="flex items-start justify-between">
			<Link
				to="/"
				aria-label="Go back to home"
				className="cursor-pointer rounded-full border-2 p-6 font-gothic duration-500 hover:bg-white"
			/>
			<h1 className="ml-4 text-right font-gothic text-6xl">
				{title.charAt(0).toUpperCase() + title.slice(1)}
			</h1>
		</div>
	);
};
