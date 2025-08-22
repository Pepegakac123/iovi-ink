// src/components/gallery/GalleryModal.tsx
"use client";

import React from "react";
import * as motion from "motion/react-client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useGalleryModal, type GalleryImage } from "@/hooks/useGalleryModal";
import { cn } from "@/lib/utils";
import GalleryCounter from "./GalleryCounter";
import ImageViewer from "./ImageViewer";
import GalleryNavigation from "./GalleryNavigation";

// ===========================================
// TYPES
// ===========================================

interface GalleryModalProps {
	images: GalleryImage[];
	children?: React.ReactNode;
	className?: string;
	wrapAround?: boolean;
}

// ===========================================
// MAIN COMPONENT
// ===========================================

/**
 * Główny komponent modalnej galerii
 * Używa ShadCN Dialog jako podstawy i integruje wszystkie części galerii
 */
const GalleryModal: React.FC<GalleryModalProps> = ({
	images,
	children,
	className = "",
	wrapAround = true,
}) => {
	const galleryModal = useGalleryModal(images, { wrapAround });

	const {
		isOpen,
		currentIndex,
		currentImage,
		totalCount,
		canGoPrev,
		canGoNext,
		closeModal,
		nextImage,
		prevImage,
	} = galleryModal;

	// ===========================================
	// RENDER LOGIC
	// ===========================================

	if (!images || images.length === 0) {
		return <>{children}</>;
	}

	return (
		<>
			{/* Trigger - Clone children z dodanym kontekstem */}
			<div className={className}>
				{React.Children.map(children, (child, index) =>
					React.isValidElement(child)
						? React.cloneElement(child as React.ReactElement<any>, {
								onClick: () => galleryModal.openModal(index),
								style: { cursor: "pointer" },
								role: "button",
								tabIndex: 0,
								"aria-label": `Otwórz galerię - zdjęcie ${index + 1}`,
							})
						: child,
				)}
			</div>

			{/* Modal Dialog */}
			<Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
				<DialogContent
					className={cn(
						// Mobile: fullscreen
						"w-full h-full max-w-none max-h-none p-0",
						// Desktop: NARROWER for portrait images
						"md:w-[70vw] md:h-[85vh] md:max-w-[800px] md:max-h-[900px]",
						// Brutalist styling
						"border-2 border-foreground rounded-md",
						"bg-background shadow-[8px_8px_0px_0px_var(--foreground)]",
						// Animations
						"data-[state=open]:animate-in data-[state=closed]:animate-out",
						"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
						"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
						"duration-300",
					)}
					showCloseButton={false} // Własny przycisk zamknięcia
				>
					<DialogTitle className="sr-only">
						Galeria zdjęć - {currentIndex + 1} z {totalCount}
					</DialogTitle>
					<motion.div
						className="relative w-full h-full flex flex-col"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						{/* Header z licznikiem i przyciskiem zamknięcia */}
						<motion.div
							className="flex items-center justify-between p-4 border-b-2 border-foreground bg-primary-foreground"
							initial={{ y: -20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.1, duration: 0.3 }}
						>
							<GalleryCounter current={currentIndex + 1} total={totalCount} />

							<Button
								variant="ghost"
								size="icon"
								onClick={closeModal}
								className={cn(
									"rounded-md border-2 border-foreground",
									"hover:bg-accent hover:shadow-[4px_4px_0px_0px_var(--foreground)]",
									"hover:translate-x-[-2px] hover:translate-y-[-2px]",
									"transition-all duration-200",
								)}
								aria-label="Zamknij galerię"
							>
								<X className="h-4 w-4" />
							</Button>
						</motion.div>

						{/* Główny obszar zdjęcia */}
						<motion.div
							className="flex-1 relative overflow-hidden"
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ delay: 0.2, duration: 0.4 }}
						>
							{currentImage && (
								<ImageViewer
									image={currentImage}
									isLoading={false}
									onNext={canGoNext ? nextImage : undefined}
									onPrev={canGoPrev ? prevImage : undefined}
								/>
							)}
						</motion.div>

						{/* Navigation - tylko na desktop dla lepszego UX */}
						<motion.div
							className="hidden md:block"
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.3, duration: 0.3 }}
						>
							<GalleryNavigation
								canGoPrev={canGoPrev}
								canGoNext={canGoNext}
								onPrev={prevImage}
								onNext={nextImage}
								currentIndex={currentIndex}
								totalCount={totalCount}
							/>
						</motion.div>

						{/* Mobile Navigation - overlay buttons */}
						<div className="md:hidden">
							{/* Previous Button - Left Side */}
							{canGoPrev && (
								<motion.div
									className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
									initial={{ x: -20, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ delay: 0.4, duration: 0.3 }}
								>
									<Button
										variant="outline"
										size="icon"
										onClick={prevImage}
										className={cn(
											"w-12 h-12 rounded-full border-2 border-foreground",
											"bg-background/90 backdrop-blur-sm",
											"hover:bg-accent hover:shadow-[4px_4px_0px_0px_var(--foreground)]",
											"hover:translate-x-[-2px] hover:translate-y-[-2px]",
											"transition-all duration-200",
										)}
										aria-label="Poprzednie zdjęcie"
									>
										<ChevronLeft className="h-6 w-6" />
									</Button>
								</motion.div>
							)}

							{/* Next Button - Right Side */}
							{canGoNext && (
								<motion.div
									className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
									initial={{ x: 20, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ delay: 0.4, duration: 0.3 }}
								>
									<Button
										variant="outline"
										size="icon"
										onClick={nextImage}
										className={cn(
											"w-12 h-12 rounded-full border-2 border-foreground",
											"bg-background/90 backdrop-blur-sm",
											"hover:bg-accent hover:shadow-[4px_4px_0px_0px_var(--foreground)]",
											"hover:translate-x-[-2px] hover:translate-y-[-2px]",
											"transition-all duration-200",
										)}
										aria-label="Następne zdjęcie"
									>
										<ChevronRight className="h-6 w-6" />
									</Button>
								</motion.div>
							)}
						</div>
					</motion.div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default GalleryModal;
