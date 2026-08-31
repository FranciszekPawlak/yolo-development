import { Slogan } from "~/components/home/Slogan";
import Links from "~/components/home/Links";
import Me from "~/components/home/Me";
import Creator from "~/components/home/Creator";

const SHOW_CIERPIENIE_SECTION = false;

export default function HomePage() {
	return (
		<div>
			<Me />
			{SHOW_CIERPIENIE_SECTION && <Creator />}
			<Slogan />
			<Links />
		</div>
	);
}
