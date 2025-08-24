// src/components/gallery/ImageViewer.tsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";
import { type GalleryImage } from "@/hooks/useGalleryModal";

// ===========================================
// TYPES
// ===========================================

interface ImageViewerProps {
	image: GalleryImage;
	isLoading?: boolean;
	onNext?: () => void;
	onPrev?: () => void;
	className?: string;
}

// ===========================================
// 🔧 SIMPLE FIX COMPONENT
// ===========================================

/**
 * ✅ SIMPLE FIX: Komponent do wyświetlania pojedynczego zdjęcia w galerii
 * 🔧 Fixed: Reset loading state when image changes (without infinite loops)
 * ✅ Preserved: All existing working functionality
 */
const ImageViewer: React.FC<ImageViewerProps> = ({
	image,
	isLoading = false,
	onNext,
	onPrev,
	className = "",
}) => {
	// ===========================================
	// STATE MANAGEMENT
	// ===========================================

	const [imageLoading, setImageLoading] = useState(true);
	const [imageError, setImageError] = useState(false);
	const [imageDimensions, setImageDimensions] = useState({
		width: 0,
		height: 0,
	});
	const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
		null,
	);
	const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
		null,
	);

	// ===========================================
	// 🆕 SIMPLE FIX: Reset loading state when image src changes
	// ===========================================

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// Simple reset: When image source changes, reset loading and error states
		setImageLoading(true);
		setImageError(false);
	}, [image.src]); // Only dependency on image.src - no infinite loops possible

	// ===========================================
	// TOUCH HANDLING (unchanged)
	// ===========================================

	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		const touch = e.targetTouches[0];
		setTouchStart({ x: touch.clientX, y: touch.clientY });
		setTouchEnd(null);
	}, []);

	const handleTouchMove = useCallback((e: React.TouchEvent) => {
		const touch = e.targetTouches[0];
		setTouchEnd({ x: touch.clientX, y: touch.clientY });
	}, []);

	const handleTouchEnd = useCallback(() => {
		if (!touchStart || !touchEnd) return;

		const deltaX = touchStart.x - touchEnd.x;
		const deltaY = touchStart.y - touchEnd.y;
		const minSwipeDistance = 50;

		// Only handle horizontal swipes (ignore vertical scrolling)
		if (
			Math.abs(deltaX) > Math.abs(deltaY) &&
			Math.abs(deltaX) > minSwipeDistance
		) {
			if (deltaX > 0 && onNext) {
				// Swipe left - next image
				onNext();
			} else if (deltaX < 0 && onPrev) {
				// Swipe right - previous image
				onPrev();
			}
		}

		setTouchStart(null);
		setTouchEnd(null);
	}, [touchStart, touchEnd, onNext, onPrev]);

	// ===========================================
	// IMAGE HANDLERS (unchanged - working logic)
	// ===========================================

	const handleImageLoad = useCallback(
		(e: React.SyntheticEvent<HTMLImageElement>) => {
			const img = e.currentTarget;
			setImageDimensions({
				width: img.naturalWidth,
				height: img.naturalHeight,
			});
			setImageLoading(false);
			setImageError(false);
		},
		[],
	);

	const handleImageError = useCallback(() => {
		setImageLoading(false);
		setImageError(true);
	}, []);

	// ===========================================
	// RENDER LOGIC (improved animations)
	// ===========================================

	return (
		<motion.div
			className={cn(
				"relative w-full h-full flex items-center justify-center overflow-hidden",
				"bg-background",
				className,
			)}
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
		>
			{/* 🆕 IMPROVED Loading State */}
			{(isLoading || imageLoading) && (
				<motion.div
					className="absolute inset-0 flex items-center justify-center bg-muted/60 backdrop-blur-sm z-10"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
				>
					<motion.div
						className="flex flex-col items-center gap-3"
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.1, duration: 0.3 }}
					>
						{/* Improved spinner */}
						<motion.div
							className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full"
							animate={{ rotate: 360 }}
							transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
						/>

						{/* Optional loading text - only show after delay to avoid flicker */}
						<motion.p
							className="paragraph-small-muted font-primary"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5, duration: 0.3 }} // Show only for slower images
						>
							Ładowanie...
						</motion.p>
					</motion.div>
				</motion.div>
			)}

			{/* Error State (unchanged - working) */}
			{imageError && (
				<motion.div
					className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					<div className="text-center p-4">
						<div className="w-16 h-16 mx-auto mb-4 bg-destructive/20 rounded-full flex items-center justify-center">
							<span className="text-2xl text-destructive">⚠</span>
						</div>
						<h3 className="heading-secondary-large mb-2 text-destructive">
							Błąd ładowania
						</h3>
						<p className="paragraph-small-muted">
							Nie udało się załadować zdjęcia
						</p>
					</div>
				</motion.div>
			)}

			{/* Main Image - 🆕 IMPROVED with consistent animations */}
			{!imageError && (
				<motion.div
					className={cn(
						"relative w-full h-full flex items-center justify-center",
						"p-4 md:p-6 lg:p-8",
					)}
					key={image.src} // 🔑 Force re-animation when image changes
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					transition={{
						duration: 0.4,
						ease: "easeOut",
						// 🆕 Slight delay ensures smooth transition even for cached images
						delay: imageLoading ? 0 : 0.1,
					}}
				>
					{/* Image wrapper with proper constraints */}
					<div
						className={cn(
							"relative flex items-center justify-center",
							"w-full h-full max-w-full max-h-full",
						)}
					>
						<Image
							src={image.src}
							alt={image.alt}
							fill
							className={cn(
								"object-contain",
								"rounded-md border-2 border-foreground",
								"shadow-[4px_4px_0px_0px_var(--foreground)]",
								"transition-opacity duration-300",
								imageLoading ? "opacity-0" : "opacity-100",
							)}
							priority={true}
							quality={90}
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
							onLoad={handleImageLoad}
							onError={handleImageError}
						/>
					</div>
				</motion.div>
			)}

			{/* Touch Indicator (unchanged - working) */}
			{touchStart && touchEnd && (
				<motion.div
					className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 0.6 }}
					exit={{ scale: 0, opacity: 0 }}
				>
					<div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
						<span className="text-2xl text-primary">
							{touchStart.x > touchEnd.x ? "→" : "←"}
						</span>
					</div>
				</motion.div>
			)}
		</motion.div>
	);
};

export default ImageViewer;
