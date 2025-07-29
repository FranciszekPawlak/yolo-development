import { useLocation } from "@remix-run/react";
import { useEffect, useState, useRef } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	const { pathname } = useLocation();
	const backgroundVideo = pathname === "/photos/overview" || pathname === "/tech/overview";
	const [showScrollTop, setShowScrollTop] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	const getBackgroundVideo = () => {
		if (pathname === "/photos/overview") {
			return "/background/photo.mp4"
		}
		if (pathname === "/tech/overview") {
			return "/background/tech.mp4"
		}
		return ""
	}

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	useEffect(() => {
		const handleScroll = () => {
			const show = window.scrollY > window.innerHeight;
			setShowScrollTop(show);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="relative mx-4 my-4 min-h-[95vh] max-w-[1000px] rounded-3xl border-2 border-white bg-black p-4 text-white lg:mx-auto lg:p-8">
			{backgroundVideo && (
				<video
					ref={videoRef}
					muted
					loop
					autoPlay
					playsInline
					preload="auto"
					id="background video"
					className="absolute inset-0 h-full w-full rounded-3xl object-cover opacity-40"
				>
					<source src={getBackgroundVideo()} type="video/mp4" />
				</video>
			)}

			<div className="relative z-10">{children}</div>

			{showScrollTop && (
				<button
					type="button"
					onClick={scrollToTop}
					className="fixed right-8 bottom-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black text-3xl text-white opacity-50 transition-opacity hover:opacity-100"
					aria-label="Scroll to top"
				>
					↑
				</button>
			)}
		</div>
	);
}
