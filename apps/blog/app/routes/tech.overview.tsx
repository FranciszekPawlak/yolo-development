import { Link, useLoaderData } from "@remix-run/react";
import { getTech } from "~/api/articles/articles";
import { getImage } from "~/api/image";
import { Header } from "~/ui/Header";
import { NothingToShow } from "~/ui/NothingToShow";

export async function loader() {
    return getTech();
}
export default function Overview() {
    const posts = useLoaderData<typeof loader>();

    return (
        <div className="mx-auto max-w-[800px]">
            <Header title="Tech" />
            <span className="block text-xs text-center w-full">My texts are not written by AI 😮</span>
            <div className="mt-8 flex flex-col">
                {posts.length > 0 ? (
                    posts.map((article) => (
                        <div
                            key={article.slug}
                            className="mb-2 flex items-center justify-between rounded-lg p-4 hover:bg-zinc-900/40"
                        >
                            <div className="flex items-center">
                                <img
                                    alt={"Article cover"}
                                    src={getImage(article.image)
                                        .height(60)
                                        .width(60)
                                        .fit("fill")
                                        .quality(70)
                                        .url()}
                                />
                                <div className="flex flex-col px-4 md:px-8">
                                    <span className="mb-1 font-bold font-montserrat text-sm">
                                        {article.title}
                                    </span>
                                    <div className="flex flex-wrap">
                                        <span className="mr-2 font-montserrat text-xs italic ">
                                            {new Date(article._createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex font-bold font-montserrat text-xs">
                                            {article.categories
                                                .map((category: string) => `#${category}`)
                                                .join(", ")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Link
                                className="font-montserrat text-white hover:underline"
                                to={`/tech/${article.slug}`}
                            >
                                <svg
                                    className="size-6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <title>Read more icon</title>
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            </Link>
                        </div>
                    ))
                ) : (
                    <NothingToShow />
                )}
            </div>
        </div>
    );
} 