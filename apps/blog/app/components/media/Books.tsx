import { Link } from "@remix-run/react";
import type { SanityDocument } from "@sanity/client";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getImage } from "~/api/image";
import { BookDetails } from "./BookDetails";

const INFINITE_SCROLL_LIMIT = 10;
const FROM_YEAR = 2022;

export const Books = ({ data }: { data: SanityDocument[] }) => {
	const [post, setPost] = useState<SanityDocument | null>(null);
	const [items, setItems] = useState<SanityDocument[]>(
		data.slice(0, INFINITE_SCROLL_LIMIT),
	);
	const [filteredData, setFilteredData] = useState<SanityDocument[]>(data);

	const getNextElements = () => {
		setItems(filteredData.slice(0, items.length + INFINITE_SCROLL_LIMIT));
	};

	const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const year = event.target.value;
		if (year === "") {
			filterItemsByRating(""); // Reset rating filter when changing year to "All years"
			setFilteredData(data);
			setItems(data.slice(0, INFINITE_SCROLL_LIMIT));
		} else {
			filterItemsByYear(year);
		}
	};

	const handleRatingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const rating = event.target.value;
		if (rating === "") {
			filterItemsByYear(""); // Reset year filter when changing rating to "All ratings"
			setFilteredData(data);
			setItems(data.slice(0, INFINITE_SCROLL_LIMIT));
		} else {
			filterItemsByRating(rating);
		}
	};

	const filterItemsByYear = (year: string) => {
		let filteredItems: SanityDocument[] = [];
		if (year.toLowerCase().includes("before")) {
			filteredItems = data.filter(
				(item) => new Date(item.statisticsDate).getFullYear() < FROM_YEAR,
			);
		} else {
			filteredItems = data.filter(
				(item) => new Date(item.statisticsDate).getFullYear() === Number(year),
			);
		}
		setFilteredData(filteredItems);
		setItems(filteredItems.slice(0, INFINITE_SCROLL_LIMIT));
	};

	const filterItemsByRating = (rating: string) => {
		let filteredItems: SanityDocument[] = [];
		if (rating === "") {
			filteredItems = data;
		} else {
			filteredItems = data.filter(
				(item) => Math.floor(item.rate) === Number(rating),
			);
		}
		setFilteredData(filteredItems);
		setItems(filteredItems.slice(0, INFINITE_SCROLL_LIMIT));
	};

	const generateYearOptions = () => {
		const currentYear = new Date().getFullYear();
		const years = ["Before"];
		for (let i = FROM_YEAR; i <= currentYear; i++) {
			years.push(String(i));
		}
		return years.reverse();
	};

	return (
		<InfiniteScroll
			hasMore={items.length < filteredData.length}
			dataLength={items.length}
			next={getNextElements}
			loader={<h4 className="text-center font-gothic">loading...</h4>}
		>
			<span className="mb-2 flex animate-pulse items-center justify-center text-center font-montserrat text-sm">
				Bruh click the book cover to show short summary with AI bruh.. !!!111
				<span className="ml-2 inline-block text-xl mix-blend-plus-lighter grayscale">
					✨
				</span>
			</span>
			<div className="mb-3 flex items-end justify-between">
				<div className="flex space-x-2">
					<select
						className="border-none bg-black text-white outline-none"
						onChange={handleYearChange}
					>
						<option value="">All years</option>
						{generateYearOptions().map((year) => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</select>
					<select
						className="border-none bg-black text-white outline-none"
						onChange={handleRatingChange}
					>
						<option value="">All ratings</option>
						{[...Array(10)].map((_, i) => (
							<option key={i + 1} value={i + 1}>
								{i + 1}
							</option>
						))}
					</select>
				</div>
				<span className="mr-2 block text-right font-montserrat text-sm ">
					{filteredData.length} elements
				</span>
			</div>
			<div className="flex flex-col">
				{items.map((item) => (
					<div
						key={item._id}
						className="mb-2 flex justify-between rounded-sm bg-zinc-950 grayscale duration-500 hover:bg-zinc-900 hover:grayscale-0"
					>
						<div className="flex flex-col justify-between p-2">
							<span className="cursor-pointer text-left font-bold font-montserrat text-md text-white hover:underline lg:text-xl">
								<Link to={item.url} target="_blank">
									{item.title}
								</Link>
							</span>
							<span className="text-left text-xs italic">{item.author}</span>
							<div className="flex justify-start text-xs lg:text-sm">
								<span className="mr-4 font-bold text-white">{`${item.rate}/10`}</span>
								<span className="mr-4 cursor-pointer text-white hover:underline">
									#{item.genre}
								</span>
								{item.favorite && (
									<span className="ml-4 text-white duration-500 hover:scale-150">
										🤍
									</span>
								)}
							</div>
						</div>
						{item.poster && (
							<img
								onClick={() => setPost(item)}
								onKeyDown={(e) => e.key === "Enter" && setPost(item)}
								className="h-[90px] w-[60px] cursor-pointer rounded-l-sm"
								alt="media poster"
								src={getImage(item?.poster).fit("scale").quality(1).url()}
							/>
						)}
					</div>
				))}
				<BookDetails post={post} close={() => setPost(null)} />
			</div>
		</InfiniteScroll>
	);
};
