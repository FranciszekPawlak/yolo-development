import { Slogan } from "~/components/home/Slogan";
import Links from "~/components/home/Links";
import Me from "~/components/home/Me";
import Creator from "~/components/home/Creator";

export default function HomePage() {
	return (
		<div>
			<Me />
			<Creator />
			<Slogan />
			<Links />
		</div>
	);
}
