import type { SanityDocument } from "@sanity/client";
import { client } from "../client";

const QUERY = `*[_type == "books"] | order(_createdAt desc)`;

export async function getBooks() {
	return await client.fetch<SanityDocument[]>(QUERY);
}
