// src/components/TattooGallery.tsx - FIXED: Zmiana z masonry na grid dla poprawnego indeksowania

"use client";

import React, { lazy, Suspense } from "react";
import Image from "next/image";
import { BlurFade } from "@/components/magicui/blur-fade";
const GalleryModal = lazy(() => import("@/components/gallery/GalleryModal"));
interface TattooGalleryProps {
	images: Array<{ src: string; alt: string }>;
	className?: string;
}

const TattooGallery: React.FC<TattooGalleryProps> = ({
	images,
	className = "",
}) => {
	if (!images || images.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="paragraph-secondary text-muted-foreground">
					Brak zdjęć w tej kategorii
				</p>
			</div>
		);
	}

	return (
		<div className={`w-full ${className}`}>
			{/* ✅ Gallery Modal - wraps całą galerię */}
			<Suspense
				fallback={<div className="h-96 bg-muted animate-pulse rounded-md" />}
			>
				<GalleryModal images={images} wrapAround={true}>
					{/* ✅ FIXED: Zwykły responsive grid zamiast masonry dla poprawnego indeksowania */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
						{images.map((image, index) => (
							<BlurFade
								key={`${image.src}-${index}`}
								delay={0.05 * index}
								duration={0.6}
								direction="up"
								offset={20}
								blur="8px"
								className="w-full"
							>
								{/* ✅ FIXED: data-gallery-index dla prawidłowej identyfikacji */}
								<div
									data-gallery-index={index}
									className="group relative overflow-hidden rounded-md border-2 border-foreground bg-primary-foreground transition-all duration-300 cursor-pointer hover:border-primary hover:shadow-[4px_4px_0px_0px_var(--primary)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
								>
									{/* ✅ FIXED: Proporcje 4:5 (320px x 400px) */}
									<div
										className="relative w-full"
										style={{ aspectRatio: "4/5" }}
									>
										<Image
											src={image.src}
											alt={image.alt}
											fill
											className="object-cover transition-transform duration-500 group-hover:scale-105"
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
											loading="lazy"
										/>

										{/* ✅ Overlay z alt text na hover */}
										<div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-end opacity-0 group-hover:opacity-100">
											<div className="p-3 md:p-4 text-white">
												<p className="text-xs md:text-sm font-text leading-relaxed mb-2">
													{image.alt}
												</p>
												<p className="text-xs text-white/80 font-primary">
													Kliknij aby powiększyć
												</p>
											</div>
										</div>

										{/* ✅ Zoom indicator - subtle icon */}
										<div className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full border border-foreground/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
											<svg
												className="w-4 h-4 text-foreground"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
												role="graphics-symbol"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
												/>
											</svg>
										</div>
									</div>
								</div>
							</BlurFade>
						))}
					</div>
				</GalleryModal>
			</Suspense>

			{/* ✅ Counter zdjęć */}
			<div className="mt-6 md:mt-8 text-center">
				<p className="text-xs md:text-sm text-muted-foreground font-primary">
					{images.length} {images.length === 1 ? "zdjęcie" : "zdjęć"}
				</p>
			</div>
		</div>
	);
};

export default TattooGallery;
