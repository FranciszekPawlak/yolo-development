import React, {
	type KeyboardEvent,
	type MouseEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { getImage } from "~/api/image";

interface ImageModalProps {
	images: Array<{
		alt?: string;
		[key: string]: unknown;
	}>;
	currentIndex: number;
	onClose: () => void;
	onNext: () => void;
	onPrevious: () => void;
}

export const ImageModal = React.memo(({
	images,
	currentIndex,
	onClose,
	onNext,
	onPrevious,
}: ImageModalProps) => {
	const [isVisible, setIsVisible] = useState(true);
	const [imageLoaded, setImageLoaded] = useState(false);

	const preloadedImagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
	const preloadedIndicesRef = useRef<Set<number>>(new Set([currentIndex]));
	const isPreloadingRef = useRef(false);
	const touchStartRef = useRef({ x: 0, y: 0 });
	const isDraggingRef = useRef(false);

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(false), 5000);
		return () => clearTimeout(timer);
	}, []);

	const imageUrls = useMemo(
		() => images.map((img) => getImage(img).url()),
		[images],
	);

	const currentImageUrl = imageUrls[currentIndex];
	const currentImage = images[currentIndex];

	const handleBackdropClick = useCallback(
		(e: MouseEvent) => e.target === e.currentTarget && onClose(),
		[onClose],
	);

	const handleBackdropKeyDown = useCallback(
		(e: KeyboardEvent<HTMLDialogElement>) =>
			e.key === "Enter" && e.target === e.currentTarget && onClose(),
		[onClose],
	);

	useEffect(() => {
		setImageLoaded(preloadedIndicesRef.current.has(currentIndex));
	}, [currentIndex]);

	useEffect(() => {
		if (isPreloadingRef.current) return;
		isPreloadingRef.current = true;

		const indicesToPreload: number[] = [];

		for (let offset = 1; offset <= 3; offset++) {
			const nextIdx = (currentIndex + offset) % images.length;
			const prevIdx = (currentIndex - offset + images.length) % images.length;

			if (!preloadedIndicesRef.current.has(nextIdx)) indicesToPreload.push(nextIdx);
			if (!preloadedIndicesRef.current.has(prevIdx)) indicesToPreload.push(prevIdx);
		}

		indicesToPreload.forEach((index) => {
			const img = new Image();
			const isImmediate =
				index === (currentIndex + 1) % images.length ||
				index === (currentIndex - 1 + images.length) % images.length;

			if (isImmediate) img.fetchPriority = "high";

			img.onload = () => {
				preloadedImagesRef.current.set(index, img);
				preloadedIndicesRef.current.add(index);
			};

			img.onerror = () => preloadedIndicesRef.current.add(index);
			img.src = imageUrls[index];
		});

		isPreloadingRef.current = false;
	}, [currentIndex, images.length, imageUrls]);

	useEffect(() => {
		const handleKeyPress = (e: globalThis.KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowRight") onNext();
			if (e.key === "ArrowLeft") onPrevious();
		};

		document.addEventListener("keydown", handleKeyPress);
		return () => document.removeEventListener("keydown", handleKeyPress);
	}, [onClose, onNext, onPrevious]);

	useEffect(() => {
		const dialogElement = document.querySelector("dialog[open]");
		if (!dialogElement) return;

		const handleTouchStart = (e: Event) => {
			const touchEvent = e as unknown as globalThis.TouchEvent;
			touchStartRef.current = {
				x: touchEvent.touches[0].clientX,
				y: touchEvent.touches[0].clientY,
			};
		};

		const handleTouchMove = (e: Event) => {
			const touchEvent = e as unknown as globalThis.TouchEvent;
			const deltaX = Math.abs(touchEvent.touches[0].clientX - touchStartRef.current.x);
			const deltaY = Math.abs(touchEvent.touches[0].clientY - touchStartRef.current.y);

			if (deltaX > deltaY && deltaX > 10) e.preventDefault();
		};

		const handleTouchEnd = (e: Event) => {
			const touchEvent = e as unknown as globalThis.TouchEvent;
			const deltaX = touchEvent.changedTouches[0].clientX - touchStartRef.current.x;
			const deltaY = Math.abs(touchEvent.changedTouches[0].clientY - touchStartRef.current.y);
			const absDeltaX = Math.abs(deltaX);

			if (absDeltaX > deltaY && absDeltaX > 50) {
				deltaX > 0 ? onPrevious() : onNext();
			}
		};

		const options = { passive: false } as AddEventListenerOptions;
		dialogElement.addEventListener("touchstart", handleTouchStart, options);
		dialogElement.addEventListener("touchmove", handleTouchMove, options);
		dialogElement.addEventListener("touchend", handleTouchEnd, options);

		return () => {
			dialogElement.removeEventListener("touchstart", handleTouchStart);
			dialogElement.removeEventListener("touchmove", handleTouchMove);
			dialogElement.removeEventListener("touchend", handleTouchEnd);
		};
	}, [onNext, onPrevious]);

	const handleMouseDown = (e: MouseEvent<HTMLDialogElement>) => {
		if (e.button !== 0) return;

		const startX = e.clientX;
		isDraggingRef.current = true;

		const handleMouseMove = (e: globalThis.MouseEvent) => {
			if (Math.abs(e.clientX - startX) > 10) e.preventDefault();
		};

		const handleMouseUp = (e: globalThis.MouseEvent) => {
			const deltaX = e.clientX - startX;
			const absDeltaX = Math.abs(deltaX);

			if (absDeltaX > 50) deltaX > 0 ? onPrevious() : onNext();

			isDraggingRef.current = false;
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	return (
		<dialog
			className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/85"
			onClick={handleBackdropClick}
			onKeyDown={handleBackdropKeyDown}
			onMouseDown={handleMouseDown}
			open
		>
			{isVisible && (
				<div className="absolute top-12 left-1/2 -translate-x-1/2 z-[60] text-white text-xl bg-black/50 p-2 rounded flex lg:hidden">
					swipe <div className="animate-swipe">👆🏼</div>
				</div>
			)}

			<button
				type="button"
				onClick={onClose}
				onKeyDown={(e) => e.key === "Enter" && onClose()}
				className="absolute top-4 right-4 z-[60] text-4xl text-white hover:opacity-75"
				aria-label="Close modal"
			>
				×
			</button>

			<button
				type="button"
				onClick={onPrevious}
				onKeyDown={(e) => e.key === "Enter" && onPrevious()}
				className="absolute left-4 z-[60] text-6xl text-white hover:opacity-75"
				aria-label="Previous image"
			>
				‹
			</button>

			<div className="relative flex h-full w-full items-center justify-center">
				{!imageLoaded && (
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="h-16 w-16 animate-spin rounded-full border-4 border-white border-t-transparent" />
					</div>
				)}
				<img
					key={currentIndex}
					src={currentImageUrl}
					alt={currentImage.alt || "Full size preview"}
					className="max-h-[90vh] max-w-[90vw] object-contain transition-opacity duration-200"
					style={{ opacity: imageLoaded ? 1 : 0 }}
					onLoad={() => setImageLoaded(true)}
				/>
			</div>

			<button
				type="button"
				onClick={onNext}
				onKeyDown={(e) => e.key === "Enter" && onNext()}
				className="absolute right-4 z-[60] text-6xl text-white hover:opacity-75"
				aria-label="Next image"
			>
				›
			</button>
		</dialog>
	);
});

ImageModal.displayName = "ImageModal";
