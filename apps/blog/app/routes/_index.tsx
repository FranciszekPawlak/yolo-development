import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, MetaFunction } from "@vercel/remix";
import { getWarFact } from "~/api/openai/warFact.server";
import { Fact } from "~/components/home/Fact";
import { Game } from "~/components/home/Game";
import { Slogan } from "~/components/home/Slogan";
import type { AiResult } from "~/types";
import Links from "../components/home/Links";
import Me from "../components/home/Me";

const CACHE_KEY = "war-fact-cache";

interface CacheData {
	date: string;
	fact: AiResult;
}

function getTodayDate() {
	return new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
}

export async function loader({ request }: LoaderFunctionArgs) {
	const cookieHeader = request.headers.get("Cookie");
	const cookies =
		cookieHeader?.split("; ").reduce(
			(acc, cookie) => {
				const [key, value] = cookie.split("=");
				try {
					acc[key] = JSON.parse(decodeURIComponent(value));
				} catch {
					acc[key] = decodeURIComponent(value);
				}
				return acc;
			},
			{} as Record<string, any>,
		) || {};

	const cachedData = cookies[CACHE_KEY] as CacheData | undefined;
	if (cachedData?.date === getTodayDate() && cachedData?.fact?.data) {
		return json(cachedData.fact, {
			headers: {
				"Cache-Control": "private, max-age=43200", //12h
			},
		});
	}

	const fact = await getWarFact();

	if (fact.data) {
		const cacheData: CacheData = {
			date: getTodayDate(),
			fact,
		};

		return json(fact, {
			headers: {
				"Set-Cookie": `${CACHE_KEY}=${encodeURIComponent(JSON.stringify(cacheData))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
				"Cache-Control": "private, max-age=86400",
			},
		});
	}

	return json(fact);
}

export const meta: MetaFunction = () => {
	return [
		{ title: "Franciszek Pawlak" },
		{ name: "description", content: "Franciszek Pawlak IT" },
	];
};

export default function Index() {
	const result = useLoaderData<AiResult>();
	return (
		<div>
			<Me />
			<Slogan />
			<Links />
			<Fact result={result} />
			<Game />
		</div>
	);
}
