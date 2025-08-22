"use client";

import { useState, useEffect, useCallback } from "react";

// ===========================================
// TYPES
// ===========================================

export interface GalleryImage {
	src: string;
	alt: string;
}

export interface UseGalleryModalOptions {
	wrapAround?: boolean; // Allow navigation past first/last image
	preloadCount?: number; // Number of images to preload around current
}

export interface UseGalleryModalReturn {
	// Modal state
	isOpen: boolean;
	currentIndex: number;
	images: GalleryImage[];

	// Navigation state
	canGoPrev: boolean;
	canGoNext: boolean;

	// Actions
	openModal: (index: number) => void;
	closeModal: () => void;
	nextImage: () => void;
	prevImage: () => void;
	goToImage: (index: number) => void;

	// Current image info
	currentImage: GalleryImage | null;
	totalCount: number;
}

// ===========================================
// MAIN HOOK
// ===========================================

/**
 * Hook do zarządzania stanem modalnej galerii obrazów
 * Obsługuje keyboard navigation, preloading i edge cases
 */
export function useGalleryModal(
	galleryImages: GalleryImage[] = [],
	options: UseGalleryModalOptions = {},
): UseGalleryModalReturn {
	const { wrapAround = true, preloadCount = 1 } = options;

	// ===========================================
	// STATE MANAGEMENT
	// ===========================================

	const [isOpen, setIsOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [images] = useState<GalleryImage[]>(galleryImages);

	// ===========================================
	// COMPUTED VALUES
	// ===========================================

	const totalCount = images.length;
	const currentImage = images[currentIndex] || null;

	const canGoPrev = wrapAround ? totalCount > 1 : currentIndex > 0;
	const canGoNext = wrapAround ? totalCount > 1 : currentIndex < totalCount - 1;

	// ===========================================
	// NAVIGATION FUNCTIONS
	// ===========================================

	const openModal = useCallback(
		(index: number) => {
			if (index >= 0 && index < totalCount) {
				setCurrentIndex(index);
				setIsOpen(true);
			}
		},
		[totalCount],
	);

	const closeModal = useCallback(() => {
		setIsOpen(false);
	}, []);

	const goToImage = useCallback(
		(index: number) => {
			if (index >= 0 && index < totalCount) {
				setCurrentIndex(index);
			}
		},
		[totalCount],
	);

	const nextImage = useCallback(() => {
		if (!canGoNext) return;

		if (wrapAround) {
			setCurrentIndex((prev) => (prev + 1) % totalCount);
		} else {
			setCurrentIndex((prev) => Math.min(prev + 1, totalCount - 1));
		}
	}, [canGoNext, wrapAround, totalCount]);

	const prevImage = useCallback(() => {
		if (!canGoPrev) return;

		if (wrapAround) {
			setCurrentIndex((prev) => (prev - 1 + totalCount) % totalCount);
		} else {
			setCurrentIndex((prev) => Math.max(prev - 1, 0));
		}
	}, [canGoPrev, wrapAround, totalCount]);

	// ===========================================
	// KEYBOARD NAVIGATION
	// ===========================================

	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			// Prevent default behavior for navigation keys
			if (["Escape", "ArrowLeft", "ArrowRight"].includes(e.key)) {
				e.preventDefault();
			}

			switch (e.key) {
				case "Escape":
					closeModal();
					break;
				case "ArrowLeft":
					prevImage();
					break;
				case "ArrowRight":
					nextImage();
					break;
				default:
					break;
			}
		};

		// Add event listener
		window.addEventListener("keydown", handleKeyDown);

		// Cleanup
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, nextImage, prevImage, closeModal]);

	// ===========================================
	// PRELOADING EFFECT
	// ===========================================

	useEffect(() => {
		if (!isOpen || preloadCount <= 0) return;

		// Preload images around current index
		const imagesToPreload: string[] = [];

		for (let i = 1; i <= preloadCount; i++) {
			// Next images
			const nextIndex = (currentIndex + i) % totalCount;
			if (images[nextIndex]) {
				imagesToPreload.push(images[nextIndex].src);
			}

			// Previous images
			const prevIndex = (currentIndex - i + totalCount) % totalCount;
			if (images[prevIndex]) {
				imagesToPreload.push(images[prevIndex].src);
			}
		}

		// Create Image objects for preloading
		imagesToPreload.forEach((src) => {
			const img = new Image();
			img.src = src;
		});
	}, [isOpen, currentIndex, images, preloadCount, totalCount]);

	// ===========================================
	// BODY SCROLL LOCK
	// ===========================================

	useEffect(() => {
		if (isOpen) {
			// Prevent body scroll when modal is open
			const originalStyle = window.getComputedStyle(document.body).overflow;
			document.body.style.overflow = "hidden";

			return () => {
				document.body.style.overflow = originalStyle;
			};
		}
	}, [isOpen]);

	// ===========================================
	// RETURN OBJECT
	// ===========================================

	return {
		// Modal state
		isOpen,
		currentIndex,
		images,

		// Navigation state
		canGoPrev,
		canGoNext,

		// Actions
		openModal,
		closeModal,
		nextImage,
		prevImage,
		goToImage,

		// Current image info
		currentImage,
		totalCount,
	};
}
