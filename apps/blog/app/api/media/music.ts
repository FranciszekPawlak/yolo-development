import type { SanityDocument } from "@sanity/client";
import { client } from "../client";

const QUERY = `*[_type == "music"]`;

export async function getMusic() {
	return await client.fetch<SanityDocument[]>(QUERY);
}
