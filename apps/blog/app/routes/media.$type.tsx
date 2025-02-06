import { useLoaderData } from "@remix-run/react";
import type { SanityDocument } from "@sanity/client";
import type { LoaderFunctionArgs } from "@vercel/remix";
import { getBooks } from "~/api/media/books";
import { getGames } from "~/api/media/games";
import { getMovies } from "~/api/media/movies";
import { getSeries } from "~/api/media/series";
import { Books } from "~/components/media/Books";
import { Categories } from "~/components/media/Categories";
import { Header } from "~/ui/Header";
import { NothingToShow } from "~/ui/NothingToShow";

export async function loader({ params }: LoaderFunctionArgs) {
	let result: SanityDocument[] | null = null;
	switch (params?.type?.toLowerCase()) {
		case "books":
			result = await getBooks();
			break;
		case "movies":
			result = await getMovies();
			break;
		case "series":
			result = await getSeries();
			break;
		case "games":
			result = await getGames();
			break;
		default:
			break;
	}
	if (!result) {
		throw new Response("Not Found", { status: 404 });
	}
	return {
		type: params.type?.toLowerCase() as string,
		data: result,
	};
}

export default function Media() {
	const { type, data } = useLoaderData<typeof loader>();

	const getContentByType = () => {
		if (data.length === 0) {
			return <NothingToShow />;
		}
		if (type === "books") {
			return <Books data={data} />;
		}
		return null;
	};

	return (
		<div>
			<Header title={type} />
			<Categories />
			{getContentByType()}
		</div>
	);
}
