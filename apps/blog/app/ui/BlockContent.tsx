import type { PortableTextReactComponents } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import { useCallback, useMemo, useState } from "react";
import { getImage } from "~/api/image";
import { ImageModal } from "./ImageModal";

export const BlockContent = ({ blocks }: { blocks: any }) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const images = useMemo(
		() => blocks.filter((block: any) => block._type === "image"),
		[blocks],
	);

	const handleImageClick = useCallback((index: number) => {
		setCurrentImageIndex(index);
		setModalOpen(true);
	}, []);

	const handleNext = useCallback(
		() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)),
		[images.length],
	);

	const handlePrevious = useCallback(
		() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)),
		[images.length],
	);

	const handleClose = useCallback(() => setModalOpen(false), []);

	const components: Partial<PortableTextReactComponents> = useMemo(() => ({
		block: {
			h1: ({ children }) => (
				<h1 className="col-span-2 md:col-span-3 mt-4 mb-2 font-gothic text-5xl">
					{children}
				</h1>
			),
			h2: ({ children }) => (
				<h2 className="col-span-2 md:col-span-3 mt-4 mb-2 font-gothic text-4xl">
					{children}
				</h2>
			),
			h3: ({ children }) => (
				<h3 className="col-span-2 md:col-span-3 mt-4 mb-2 font-gothic text-3xl">
					{children}
				</h3>
			),
			h4: ({ children }) => (
				<h4 className="col-span-2 md:col-span-3 mt-4 mb-2 font-gothic text-2xl">
					{children}
				</h4>
			),
			h5: ({ children }) => (
				<h5 className="col-span-2 md:col-span-3 mt-4 mb-2 font-gothic text-xl">
					{children}
				</h5>
			),
			h6: ({ children }) => (
				<h6 className="col-span-2 md:col-span-3 mt-4 mb-2 font-gothic text-lg">
					{children}
				</h6>
			),
			blockquote: ({ children }) => (
				<blockquote className="col-span-2 md:col-span-3 my-2 p-2 font-montserrat italic">
					"{children}"
				</blockquote>
			),
			normal: ({ children }) => (
				<p className="col-span-2 md:col-span-3 my-2 font-montserrat">
					{children}&nbsp;
				</p>
			),
		},
		list: {
			bullet: ({ children }) => (
				<ul className="col-span-2 md:col-span-3 my-2 ml-4 list-disc font-montserrat">
					{children}
				</ul>
			),
			number: ({ children }) => (
				<ol className="col-span-2 md:col-span-3 my-2 ml-4 list-decimal font-montserrat">
					{children}
				</ol>
			),
		},
		listItem: {
			bullet: ({ children }) => <li className="my-1 font-montserrat">{children}</li>,
			number: ({ children }) => <li className="my-1 font-montserrat">{children}</li>,
		},
		types: {
			image: ({ value }: any) => {
				const imageIndex = images.findIndex(
					(img: any) => img._key === value._key,
				);
				return (
					<img
						className="w-full cursor-pointer transition-transform hover:scale-[1.02]"
						alt={value.alt || "Article image"}
						src={getImage(value).width(260).fit("fill").url()}
						onClick={() => handleImageClick(imageIndex)}
						onKeyDown={(e) => e.key === "Enter" && handleImageClick(imageIndex)}
					/>
				);
			},
		},
		marks: {
			link: ({ children, value }) => (
				<a
					className="font-montserrat underline"
					href={value.href}
					rel="noreferrer noopener"
					target="_blank"
				>
					{children}
				</a>
			),
			em: ({ children }) => <em className="font-montserrat italic">{children}</em>,
			b: ({ children }) => <b className="font-bold font-montserrat">{children}</b>,
			code: ({ children }) => (
				<code className="my-4 block rounded-lg bg-zinc-900 p-4">{children}</code>
			),
		},
	}), [images, handleImageClick]);

	return (
		<>
			<article className="grid grid-cols-2 md:grid-cols-3">
				<PortableText value={blocks} components={components} />
			</article>
			{modalOpen && (
				<ImageModal
					images={images}
					currentIndex={currentImageIndex}
					onClose={handleClose}
					onNext={handleNext}
					onPrevious={handlePrevious}
				/>
			)}
		</>
	);
};
