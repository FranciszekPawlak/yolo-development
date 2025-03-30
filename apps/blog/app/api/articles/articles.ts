import type { SanityDocument } from "@sanity/client";
import { client } from "../client";

export async function getArticles() {
	const QUERY = `*[_type == "articles"]{
        title,
        'slug': slug.current,
        'categories': categories[]->title,
        image,
        _createdAt,
    } | order(_createdAt desc)`;
	return await client.fetch<SanityDocument[]>(QUERY);
}

export async function getArticle(slug: string) {
	const QUERY = (slug: string) =>
		`*[_type == "articles" && slug.current == "${slug}"]{
            title,
            content,
            alt,
            description,
            'categories': categories[]->title,
            image,
            _updatedAt,
    }`;
	return await client.fetch<SanityDocument[]>(QUERY(slug));
}
