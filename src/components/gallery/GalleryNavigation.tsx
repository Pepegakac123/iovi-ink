// src/components/gallery/GalleryNavigation.tsx
"use client";

import React from "react";
import * as motion from "motion/react-client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ===========================================
// TYPES
// ===========================================

interface GalleryNavigationProps {
	canGoPrev: boolean;
	canGoNext: boolean;
	onPrev: () => void;
	onNext: () => void;
	currentIndex: number;
	totalCount: number;
	className?: string;
}

// ===========================================
// MAIN COMPONENT
// ===========================================

/**
 * Komponent nawigacji dla galerii
 * Wyświetla przyciski prev/next z brutalist styling
 */
const GalleryNavigation: React.FC<GalleryNavigationProps> = ({
	canGoPrev,
	canGoNext,
	onPrev,
	onNext,
	currentIndex,
	totalCount,
	className = "",
}) => {
	return (
		<motion.div
			className={cn(
				"flex items-center justify-between p-4 border-t-2 border-foreground bg-primary-foreground",
				className,
			)}
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			exit={{ y: 20, opacity: 0 }}
			transition={{ duration: 0.3 }}
		>
			{/* Previous Button */}
			<motion.div
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				transition={{ duration: 0.2 }}
			>
				<Button
					variant="outline"
					onClick={onPrev}
					disabled={!canGoPrev}
					className={cn(
						"flex items-center gap-2 px-4 py-2 border-2 border-foreground rounded-md",
						"font-primary text-sm md:text-base",
						"transition-all duration-200",
						// Enabled state
						canGoPrev && [
							"bg-background text-foreground",
							"hover:bg-accent hover:shadow-[4px_4px_0px_0px_var(--foreground)]",
							"hover:translate-x-[-2px] hover:translate-y-[-2px]",
						],
						// Disabled state
						!canGoPrev && [
							"bg-muted text-muted-foreground border-muted-foreground",
							"cursor-not-allowed opacity-50",
						],
					)}
					aria-label="Poprzednie zdjęcie"
				>
					<ChevronLeft className="w-4 h-4" />
					<span className="hidden sm:inline">Poprzednie</span>
				</Button>
			</motion.div>

			{/* Center Info - aktualne pozycja */}
			<motion.div
				className="flex items-center gap-2 text-center"
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 0.1, duration: 0.3 }}
			>
				<span className="text-sm text-muted-foreground font-text">Zdjęcie</span>
				<span className="font-primary text-base md:text-lg text-foreground">
					{currentIndex + 1}
				</span>
				<span className="text-sm text-muted-foreground font-text">
					z {totalCount}
				</span>
			</motion.div>

			{/* Next Button */}
			<motion.div
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				transition={{ duration: 0.2 }}
			>
				<Button
					variant="outline"
					onClick={onNext}
					disabled={!canGoNext}
					className={cn(
						"flex items-center gap-2 px-4 py-2 border-2 border-foreground rounded-md",
						"font-primary text-sm md:text-base",
						"transition-all duration-200",
						// Enabled state
						canGoNext && [
							"bg-background text-foreground",
							"hover:bg-accent hover:shadow-[4px_4px_0px_0px_var(--foreground)]",
							"hover:translate-x-[-2px] hover:translate-y-[-2px]",
						],
						// Disabled state
						!canGoNext && [
							"bg-muted text-muted-foreground border-muted-foreground",
							"cursor-not-allowed opacity-50",
						],
					)}
					aria-label="Następne zdjęcie"
				>
					<span className="hidden sm:inline">Następne</span>
					<ChevronRight className="w-4 h-4" />
				</Button>
			</motion.div>
		</motion.div>
	);
};

export default GalleryNavigation;
