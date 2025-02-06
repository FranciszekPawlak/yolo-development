import type { SanityDocument } from "@sanity/client";
import { useEffect, useState } from "react";

interface BookDetailsProps {
	post: SanityDocument | null;
	close: () => void;
}

export const BookDetails = ({ post, close }: BookDetailsProps) => {
	const [summary, setSummary] = useState<string>("");
	const [error, setError] = useState<string | null>("");
	const [loading, setLoading] = useState(false);
	const [summaryCache, setSummaryCache] = useState<Record<string, string>>({});

	useEffect(() => {
		const fetchSummary = async () => {
			if (!post) return;

			setError(null);

			const cacheKey = `${post.title}-${post.author}`;
			if (summaryCache[cacheKey]) {
				setSummary(summaryCache[cacheKey]);
				return;
			}

			setLoading(true);

			const params = new URLSearchParams({
				title: post.title,
				author: post.author,
			});

			const response = await fetch(`/api/book-summary?${params}`);
			const result = await response.json();

			if (result.error === null) {
				setSummary(result.data);
				setSummaryCache((prev) => ({
					...prev,
					[cacheKey]: result.data,
				}));
			} else {
				setError(result.error);
			}

			setLoading(false);
		};

		fetchSummary();
	}, [post]);

	if (post === null) return null;

	return (
		<div
			id="book-summary"
			className="fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-black/95 text-white"
		>
			<button
				type="button"
				className="absolute top-4 right-4 font-montserrat text-5xl hover:opacity-75"
				onClick={close}
			>
				×
			</button>
			<div className="max-w-2xl overflow-y-scroll p-8 text-center">
				<span className="ml-2 inline-block text-2xl mix-blend-plus-lighter grayscale">
					✨
				</span>
				{loading ? (
					<div className="mt-4 font-montserrat">Generating summary...</div>
				) : (
					<article
						className="mt-4 font-montserrat text-lg"
						dangerouslySetInnerHTML={{ __html: error ?? summary }}
					/>
				)}
			</div>
		</div>
	);
};
