// src/components/gallery/ImageViewer.tsx
"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";
import { type GalleryImage } from "@/hooks/useGalleryModal";

// ===========================================
// TYPES
// ===========================================

interface ImageViewerProps {
	image: GalleryImage;
	onNext?: () => void;
	onPrev?: () => void;
	className?: string;
}

// ===========================================
// SIMPLIFIED IMAGE VIEWER - NO LOADING LOGIC
// ===========================================

/**
 * ✅ SIMPLIFIED: Next.js Image handles loading automatically
 * ✅ FASTER: No artificial loading states
 * ✅ CLEANER: Minimal state management
 */
const ImageViewer: React.FC<ImageViewerProps> = ({
	image,
	onNext,
	onPrev,
	className = "",
}) => {
	// ===========================================
	// MINIMAL STATE - ONLY WHAT'S NEEDED
	// ===========================================

	const [imageError, setImageError] = useState(false);
	const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
		null,
	);
	const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
		null,
	);

	// ===========================================
	// TOUCH HANDLING
	// ===========================================

	const handleTouchStart = useCallback((e: React.TouchEvent) => {
		const touch = e.touches[0];
		setTouchStart({ x: touch.clientX, y: touch.clientY });
		setTouchEnd(null);
	}, []);

	const handleTouchMove = useCallback((e: React.TouchEvent) => {
		const touch = e.touches[0];
		setTouchEnd({ x: touch.clientX, y: touch.clientY });
	}, []);

	const handleTouchEnd = useCallback(() => {
		if (!touchStart || !touchEnd) return;

		const deltaX = touchStart.x - touchEnd.x;
		const deltaY = Math.abs(touchStart.y - touchEnd.y);
		const minSwipeDistance = 50;

		// Only horizontal swipes
		if (Math.abs(deltaX) > minSwipeDistance && deltaY < 100) {
			if (deltaX > 0 && onNext) {
				onNext(); // Swipe left -> next
			} else if (deltaX < 0 && onPrev) {
				onPrev(); // Swipe right -> prev
			}
		}

		// Clear touch states
		setTouchStart(null);
		setTouchEnd(null);
	}, [touchStart, touchEnd, onNext, onPrev]);

	// ===========================================
	// ERROR HANDLING
	// ===========================================

	const handleImageError = useCallback(() => {
		setImageError(true);
	}, []);

	// ===========================================
	// RENDER LOGIC - SIMPLIFIED
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
			{/* Error State */}
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

			{/* Main Image - Simplified */}
			{!imageError && (
				<motion.div
					className={cn(
						"relative w-full h-full flex items-center justify-center",
						"p-4 md:p-6 lg:p-8",
					)}
					key={image.src} // Force re-animation when image changes
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					transition={{
						duration: 0.4,
						ease: "easeOut",
					}}
				>
					{/* Image wrapper */}
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
							)}
							// ✅ POPUP IMAGES: Always priority for instant display
							priority={true}
							loading="eager"
							quality={90}
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
							onError={handleImageError}
							// ✅ Additional optimizations
							fetchPriority="high"
							decoding="async"
						/>
					</div>
				</motion.div>
			)}

			{/* Touch Indicator */}
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
