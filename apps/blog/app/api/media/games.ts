import type { SanityDocument } from "@sanity/client";
import { client } from "../client";

const QUERY = `*[_type == "games"]`;

export async function getGames() {
	return await client.fetch<SanityDocument[]>(QUERY);
}
