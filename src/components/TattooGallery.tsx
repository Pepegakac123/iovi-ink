// src/components/TattooGallery.tsx - Animowana galeria tatuaży z modalem

"use client";

import React from "react";
import Image from "next/image";
import { BlurFade } from "@/components/magicui/blur-fade";
import { GalleryModal } from "@/components/gallery";

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
			<GalleryModal images={images} wrapAround={true}>
				{/* ✅ Masonry grid dla lepszego układu zdjęć */}
				<div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
					{images.map((image, index) => (
						<BlurFade
							key={`${image.src}-${index}`}
							delay={0.05 * index} // ✅ Staggered animation
							duration={0.6}
							direction="up"
							offset={20}
							blur="8px"
							className="break-inside-avoid mb-4"
						>
							<div className="group relative overflow-hidden rounded-md border-2 border-foreground bg-primary-foreground transition-all duration-300 cursor-pointer hover:border-primary hover:shadow-[4px_4px_0px_0px_var(--primary)] hover:translate-x-[-2px] hover:translate-y-[-2px]">
								{/* ✅ Mniejsze zdjęcia ~300px wysokości, bez box-shadow */}
								<div className="relative w-full">
									<Image
										src={image.src}
										alt={image.alt}
										width={300}
										height={300}
										className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 max-h-[300px]"
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
										{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
										<svg
											className="w-4 h-4 text-foreground"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
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

			{/* ✅ Counter zdjęć - mniejszy na mobile */}
			<div className="mt-6 md:mt-8 text-center">
				<p className="text-xs md:text-sm text-muted-foreground font-primary">
					{images.length} {images.length === 1 ? "zdjęcie" : "zdjęć"}
				</p>
			</div>
		</div>
	);
};

export default TattooGallery;
