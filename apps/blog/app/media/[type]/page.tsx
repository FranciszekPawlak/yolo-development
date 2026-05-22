import type { SanityDocument } from "@sanity/client";
import { notFound } from "next/navigation";
import { getBooks } from "~/api/media/books";
import { getGames } from "~/api/media/games";
import { getMovies } from "~/api/media/movies";
import { getSeries } from "~/api/media/series";
import { Books } from "~/components/media/Books";
import { Categories } from "~/components/media/Categories";
import { Header } from "~/ui/Header";
import { NothingToShow } from "~/ui/NothingToShow";

async function getMediaData(type: string): Promise<SanityDocument[] | null> {
	switch (type.toLowerCase()) {
		case "books":
			return getBooks();
		case "movies":
			return getMovies();
		case "series":
			return getSeries();
		case "games":
			return getGames();
		default:
			return null;
	}
}

export default async function MediaPage({
	params,
}: {
	params: Promise<{ type: string }>;
}) {
	const { type } = await params;
	const data = await getMediaData(type);

	if (!data) {
		notFound();
	}

	const normalizedType = type.toLowerCase();

	const getContentByType = () => {
		if (data.length === 0) {
			return <NothingToShow />;
		}
		if (normalizedType === "books") {
			return <Books data={data} />;
		}
		return null;
	};

	return (
		<div>
			<Header title={normalizedType} />
			<Categories type={normalizedType} />
			{getContentByType()}
		</div>
	);
}
