import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "~/api/articles/articles";
import { Avatar } from "~/ui/Avatar";
import { BlockContent } from "~/ui/BlockContent";
import { calculateReadingTime, formatReadingTime } from "~/lib/readingTime";

export default async function PhotosArticlePage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const article = (await getArticle(slug, "photos"))[0];

	if (!article) {
		notFound();
	}

	const readingTime = calculateReadingTime(article.content);

	return (
		<div className="mx-auto max-w-[800px]">
			<Link
				href="/photos/overview"
				className="inline-block cursor-pointer p-4 font-mono text-5xl duration-200 hover:scale-125"
			>
				{"<"}
			</Link>
			<article className="mt-4 mb-8 ">
				<div className="mb-4 flex items-center justify-between">
					<div className="mr-2">
						<h1 className="font-gothic text-3xl lg:text-5xl">{article.title}</h1>
						<span className="flex flex-wrap">
							<span className="mr-4 font-bold">
								{article.categories
									.map((category: string) => `#${category}`)
									.join(", ")}
							</span>
							{article._updatedAt && (
								<span className="mr-4 italic">
									updated at {new Date(article._updatedAt).toLocaleDateString()}
								</span>
							)}
							<span className="italic">{formatReadingTime(readingTime)}</span>
						</span>
					</div>
					<div>
						<Avatar className="w-[60px]" />
					</div>
				</div>
				<BlockContent blocks={article.content} />
				<div
					style={{
						backgroundImage:
							"url(https://wykop.pl/cdn/c3201142/c792131f9e01eee0fa4fac4620ce1b1a8ac1c578a406424bd876bee5119fed21,w400.jpg)",
						backgroundRepeat: "repeat-x",
						backgroundSize: "auto 100%",
						backgroundPosition: "center",
					}}
					className="mt-8 h-24 w-full"
				/>
			</article>
		</div>
	);
}
