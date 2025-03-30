import {
	type KeyboardEvent,
	type MouseEvent,
	useEffect,
	useState,
} from "react";
import { getImage } from "~/api/image";

interface ImageModalProps {
	images: any[];
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
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowRight") onNext();
			if (e.key === "ArrowLeft") onPrevious();
		};

		document.addEventListener("keydown", handleKeyPress as any);
		return () => document.removeEventListener("keydown", handleKeyPress as any);
	}, [onClose, onNext, onPrevious]);

	const currentImage = images[currentIndex];

	const handleSwipe = (startX: number, endX: number) => {
		if (endX - startX > 50) {
			onPrevious();
		} else if (startX - endX > 50) {
			onNext();
		}
	};

	let startX: number;

	const handleTouchStart = (e: TouchEvent) => {
		startX = e.touches[0].clientX;
	};

	const handleTouchMove = (e: TouchEvent) => {
		const endX = e.touches[0].clientX;
		handleSwipe(startX, endX);
	};

	const handleMouseDown = (e: MouseEvent) => {
		startX = e.clientX;
		const handleMouseMove = (e: MouseEvent) => {
			handleSwipe(startX, e.clientX);
		};
		const handleMouseUp = () => {
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
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
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

			<div
				className="relative flex h-full w-full items-center justify-center"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.key === "Enter" && e.stopPropagation()}
			>
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
