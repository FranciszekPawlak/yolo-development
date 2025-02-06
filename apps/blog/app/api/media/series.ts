import type { SanityDocument } from "@sanity/client";
import { client } from "../client";

const QUERY = `*[_type == "series"]`;

export async function getSeries() {
	return await client.fetch<SanityDocument[]>(QUERY);
}
