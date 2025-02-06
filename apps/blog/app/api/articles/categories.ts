import type { SanityDocument } from "@sanity/client";
import { client } from "../client";

const QUERY = `*[_type == "categories"]`;

export async function getCategories() {
	return await client.fetch<SanityDocument[]>(QUERY);
}
