import type { SanityDocument } from "@sanity/client";
import { client } from "../client";

export async function getPhotos() {
    const QUERY = `*[_type == "articles" && type == "photos"]{
        title,
        'slug': slug.current,
        'categories': categories[]->title,
        image,
        type,
        _createdAt,
    } | order(_createdAt desc)`;
    return await client.fetch<SanityDocument[]>(QUERY);
}

export async function getTech() {
    const QUERY = `*[_type == "articles" && type == "tech"]{
        title,
        'slug': slug.current,
        'categories': categories[]->title,
        image,
        type,
        _createdAt,
    } | order(_createdAt desc)`;
    return await client.fetch<SanityDocument[]>(QUERY);
}

export async function getArticle(slug: string, type: "photos" | "tech") {
    const QUERY = (slug: string, type: string) =>
        `*[_type == "articles" && slug.current == "${slug}" && type == "${type}"]{
            title,
            content,
            alt,
            description,
            'categories': categories[]->title,
            image,
            type,
            _updatedAt,
    }`;
    return await client.fetch<SanityDocument[]>(QUERY(slug, type));
}
