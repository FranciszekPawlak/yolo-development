import React, {
	type KeyboardEvent,
	type MouseEvent,
	useEffect,
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

export const ImageModal = ({
	images,
	currentIndex,
	onClose,
	onNext,
	onPrevious,
}: ImageModalProps) => {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
		}, 5000);

		return () => clearTimeout(timer);
	}, []);

	const handleBackdropClick = (e: MouseEvent) => {
		if (e.target === e.currentTarget) onClose();
	};

	const handleBackdropKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
		if (e.key === "Enter" && e.target === e.currentTarget) onClose();
	};

	useEffect(() => {
		const preloadImages = () => {
			const nextIndex =
				currentIndex === images.length - 1 ? 0 : currentIndex + 1;
			const prevIndex =
				currentIndex === 0 ? images.length - 1 : currentIndex - 1;

			[nextIndex, prevIndex].forEach((index) => {
				const img = new Image();
				img.src = getImage(images[index]).url();
			});
		};

		preloadImages();
	}, [currentIndex, images]);

	useEffect(() => {
		const handleKeyPress = (e: globalThis.KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowRight") onNext();
			if (e.key === "ArrowLeft") onPrevious();
		};

		document.addEventListener("keydown", handleKeyPress);
		return () => document.removeEventListener("keydown", handleKeyPress);
	}, [onClose, onNext, onPrevious]);

	const currentImage = images[currentIndex];

	const touchStartRef = React.useRef({ x: 0, y: 0 });
	const isDraggingRef = React.useRef(false);

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
			const currentX = touchEvent.touches[0].clientX;
			const currentY = touchEvent.touches[0].clientY;
			const deltaX = Math.abs(currentX - touchStartRef.current.x);
			const deltaY = Math.abs(currentY - touchStartRef.current.y);

			if (deltaX > deltaY && deltaX > 10) {
				e.preventDefault();
			}
		};

		const handleTouchEnd = (e: Event) => {
			const touchEvent = e as unknown as globalThis.TouchEvent;
			const endX = touchEvent.changedTouches[0].clientX;
			const deltaX = endX - touchStartRef.current.x;
			const deltaY = Math.abs(
				touchEvent.changedTouches[0].clientY - touchStartRef.current.y,
			);
			const absDeltaX = Math.abs(deltaX);

			if (absDeltaX > deltaY && absDeltaX > 50) {
				if (deltaX > 0) {
					onPrevious();
				} else {
					onNext();
				}
			}
		};

		dialogElement.addEventListener("touchstart", handleTouchStart, {
			passive: false,
		} as AddEventListenerOptions);
		dialogElement.addEventListener("touchmove", handleTouchMove, {
			passive: false,
		} as AddEventListenerOptions);
		dialogElement.addEventListener("touchend", handleTouchEnd, {
			passive: false,
		} as AddEventListenerOptions);

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
			const deltaX = Math.abs(e.clientX - startX);
			if (deltaX > 10) {
				e.preventDefault();
			}
		};

		const handleMouseUp = (e: globalThis.MouseEvent) => {
			const deltaX = e.clientX - startX;
			const absDeltaX = Math.abs(deltaX);

			if (absDeltaX > 50) {
				if (deltaX > 0) {
					onPrevious();
				} else {
					onNext();
				}
			}

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
				<div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-[60] text-white text-xl bg-black/50 p-2 rounded flex lg:hidden">
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
				<img
					src={getImage(currentImage).url()}
					alt={currentImage.alt || "Full size preview"}
					className="max-h-[90vh] max-w-[90vw] object-contain transition-opacity duration-300"
					style={{ opacity: 1 }}
					onLoad={(e) => {
						(e.target as HTMLImageElement).style.opacity = "1";
					}}
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
};
