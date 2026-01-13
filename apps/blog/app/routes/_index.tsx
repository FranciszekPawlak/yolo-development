import type { MetaFunction } from "@vercel/remix";
import { Slogan } from "~/components/home/Slogan";
import Links from "../components/home/Links";
import Me from "../components/home/Me";
import Creator from "../components/home/Creator";


export const meta: MetaFunction = () => {
	return [
		{ title: "Franciszek Pawlak" },
		{ name: "description", content: "Franciszek Pawlak IT" },
	];
};

export default function Index() {
	return (
		<div>
			<Me />
			<Creator />
			<Slogan />
			<Links />
		</div>
	);
}
