import type { SanityDocument } from "@sanity/client";
import { client } from "../client";

const QUERY = `*[_type == "movies"]`;

export async function getMovies() {
	return await client.fetch<SanityDocument[]>(QUERY);
}
