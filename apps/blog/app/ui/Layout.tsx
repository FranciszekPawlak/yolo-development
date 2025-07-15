import { useLocation } from "@remix-run/react";
import { useEffect, useState, useRef } from "react";

const VIDEO_LOADING_TIMEOUT = 3000;

export default function Layout({ children }: { children: React.ReactNode }) {
	const { pathname } = useLocation();
	const backgroundVideo = pathname === "/photos/overview" || pathname === "/tech/overview";
	const [showScrollTop, setShowScrollTop] = useState(false);
	const [videoLoaded, setVideoLoaded] = useState(false);
	const [isLoading, setIsLoading] = useState(backgroundVideo);
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

	const handleVideoLoad = () => {
		setVideoLoaded(true);
		setTimeout(() => {
			setIsLoading(false);
		}, 100);
	};

	const handleVideoError = () => {
		setIsLoading(false);
		setVideoLoaded(false);
	};

	const handleVideoLoadedData = () => {
		if (!videoLoaded) {
			handleVideoLoad();
		}
	};

	const checkVideoReadiness = (video: HTMLVideoElement) => {
		if (video.readyState >= 3) {
			handleVideoLoad();
		}
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	useEffect(() => {
		if (backgroundVideo) {
			setIsLoading(true);
			setVideoLoaded(false);
		} else {
			setIsLoading(false);
			setVideoLoaded(false);
		}
	}, [pathname, backgroundVideo]);

	useEffect(() => {
		if (isLoading && backgroundVideo) {
			const timeout = setTimeout(() => {
				setIsLoading(false);
				setVideoLoaded(false);
			}, VIDEO_LOADING_TIMEOUT);

			return () => clearTimeout(timeout);
		}
	}, [isLoading, backgroundVideo]);

	useEffect(() => {
		if (videoRef.current && backgroundVideo && isLoading) {
			const checkTimeout = setTimeout(() => {
				if (videoRef.current) {
					checkVideoReadiness(videoRef.current);
				}
			}, 50);

			return () => clearTimeout(checkTimeout);
		}
	}, [backgroundVideo, isLoading]);

	useEffect(() => {
		const handleScroll = () => {
			const show = window.scrollY > window.innerHeight;
			setShowScrollTop(show);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	if (isLoading && backgroundVideo) {
		return (
			<div className="relative mx-4 my-4 min-h-[95vh] max-w-[1000px] rounded-3xl border-2 border-white bg-black p-4 text-white lg:mx-auto lg:p-8">
				<div className="flex h-full min-h-[87vh] items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
						<p className="text-sm opacity-70">Loading...</p>
					</div>
				</div>
				<video
					ref={videoRef}
					muted
					loop
					autoPlay
					playsInline
					preload="auto"
					onCanPlayThrough={handleVideoLoad}
					onLoadedData={handleVideoLoadedData}
					onError={handleVideoError}
					className="absolute inset-0 h-full w-full rounded-3xl object-cover opacity-0"
				>
					<source src={getBackgroundVideo()} type="video/mp4" />
				</video>
			</div>
		);
	}

	return (
		<div className="relative mx-4 my-4 min-h-[95vh] max-w-[1000px] rounded-3xl border-2 border-white bg-black p-4 text-white lg:mx-auto lg:p-8">
			{backgroundVideo && videoLoaded && (
				<video
					muted
					loop
					autoPlay
					playsInline
					id="background video"
					className="absolute inset-0 h-full w-full rounded-3xl object-cover opacity-30"
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
