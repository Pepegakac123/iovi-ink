// src/components/ui/card-carousel.tsx - FIXED: Lepsze zdjęcia w karuzeli

"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";

interface CarouselProps {
	images: { src: string; alt: string }[];
	autoplayDelay?: number;
	showPagination?: boolean;
}

export const CardCarousel: React.FC<CarouselProps> = ({
	images,
	autoplayDelay = 3000,
	showPagination = true,
}) => {
	// Duplikowanie slajdów jeśli jest ich mało
	const extendedImages = React.useMemo(() => {
		if (images.length < 8) {
			const duplicated = [...images, ...images, ...images];
			return duplicated.slice(0, Math.max(8, images.length * 2));
		}
		return images;
	}, [images]);

	const css = `
  .full-width-carousel {
    width: 100vw;
    max-width: 100%;
    overflow: hidden;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
  }
  
  .carousel-swiper {
    width: 100%;
    height: auto;
    overflow: hidden;
    padding-bottom: 60px;
    padding-left: 50px;
    padding-right: 50px;
    min-height: 600px; /* ✅ Zwiększone z 570px */
    position: relative;
  }
  
  .carousel-swiper .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 320px; /* ✅ Zwiększone z 280px dla lepszej jakości */
    height: 560px; /* ✅ Zwiększone z 520px */
    flex-shrink: 0;
    box-sizing: border-box;
    transition: all 0.4s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* ✅ FIXED: Zmniejszone skalowanie dla mniej agresywnych transformacji */
  .carousel-swiper .swiper-slide-active {
    z-index: 2;
  }
  
  .carousel-swiper .swiper-slide-prev img,
  .carousel-swiper .swiper-slide-next img {
    transform: scale(0.96); /* ✅ Zwiększone z 0.92 */
    opacity: 0.9; /* ✅ Zwiększone z 0.85 */
  }
  
  .carousel-swiper .swiper-slide:not(.swiper-slide-active):not(.swiper-slide-prev):not(.swiper-slide-next) img {
    transform: scale(0.92); /* ✅ Zwiększone z 0.88 */
    opacity: 0.8; /* ✅ Zwiększone z 0.7 */
  }
  
  .carousel-swiper .swiper-slide img {
    display: block;
    width: 100%;
    /* ✅ FIXED: Zachowaj proporcje zamiast force height */
    height: auto; /* ✅ CHANGED z height: 500px */
    max-height: 540px; /* ✅ Maksymalna wysokość */
    object-fit: contain; /* ✅ CHANGED z cover na contain */
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.4s ease;
  }
  
  .carousel-swiper .swiper-slide:hover img {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  /* ✅ Active slide - no scaling to preserve quality */
  .carousel-swiper .swiper-slide-active img {
    transform: scale(1.0);
  }
  
  /* ✅ Non-active slides - minimal scaling */
  .carousel-swiper .swiper-slide:not(.swiper-slide-active) img {
    transform: scale(0.94); /* ✅ Mniejsze skalowanie */
  }
  
  .carousel-swiper .swiper-pagination {
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    width: auto;
    z-index: 10;
    position: absolute;
  }
  
  .carousel-swiper .swiper-pagination-bullet {
    width: 12px;
    height: 12px;
    background: var(--muted);
    border-radius: 50%;
    opacity: 1;
    transition: all 0.3s ease;
    margin: 0 4px;
  }
  
  .carousel-swiper .swiper-pagination-bullet-active {
    background: var(--primary);
    transform: scale(1.2);
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .carousel-swiper {
      padding-left: 30px;
      padding-right: 30px;
      min-height: 520px;
      padding-bottom: 50px;
    }
    
    .carousel-swiper .swiper-slide {
      width: 280px;
      height: 480px; /* ✅ Zwiększone */
    }
    
    .carousel-swiper .swiper-slide img {
      max-height: 460px; /* ✅ Dostosowane */
    }
    
    .carousel-swiper .swiper-pagination {
      bottom: 10px;
    }
  }
  
  @media (max-width: 480px) {
    .carousel-swiper {
      padding-left: 20px;
      padding-right: 20px;
      min-height: 445px;
      padding-bottom: 45px;
    }
    
    .carousel-swiper .swiper-slide {
      width: 250px;
      height: 395px;
    }
    
    .carousel-swiper .swiper-slide img {
      max-height: 375px;
    }
    
    /* ✅ Mobile - jeszcze mniejsze skalowanie */
    .carousel-swiper .swiper-slide-active img {
      transform: scale(1.0);
    }
    
    .carousel-swiper .swiper-slide:not(.swiper-slide-active) img {
      transform: scale(0.96); /* ✅ Mniejsze skalowanie na mobile */
    }
    
    .carousel-swiper .swiper-pagination {
      bottom: 8px;
    }
    
    .carousel-swiper .swiper-pagination-bullet {
      width: 10px;
      height: 10px;
      margin: 0 3px;
    }
  }
  
  /* Remove shadows from coverflow effect */
  .swiper-3d .swiper-slide-shadow-left,
  .swiper-3d .swiper-slide-shadow-right {
    background-image: none !important;
  }
  `;

	return (
		<>
			<style>{css}</style>
			<div className="w-full">
				<div className="full-width-carousel">
					<Swiper
						className="carousel-swiper"
						modules={[Autoplay, EffectCoverflow, Pagination]}
						// Coverflow effect settings
						effect="coverflow"
						coverflowEffect={{
							rotate: 0,
							stretch: 0,
							depth: 100,
							modifier: 2.5,
							slideShadows: false,
						}}
						// Core settings
						slidesPerView={4}
						centeredSlides={true}
						spaceBetween={36} // ✅ Zwiększone z 32px
						// Loop settings
						loop={extendedImages.length >= 8}
						loopAdditionalSlides={1}
						grabCursor={true}
						// Responsive breakpoints
						breakpoints={{
							320: {
								slidesPerView: 1.5,
								spaceBetween: 20,
								coverflowEffect: {
									modifier: 1.2,
									depth: 60,
								},
							},
							768: {
								slidesPerView: 2.5,
								spaceBetween: 25,
								coverflowEffect: {
									modifier: 1.8,
									depth: 80,
								},
							},
							1024: {
								slidesPerView: 2.5,
								spaceBetween: 28,
								coverflowEffect: {
									modifier: 1.2,
									depth: 70,
								},
							},
							1400: {
								slidesPerView: 4,
								spaceBetween: 36,
								coverflowEffect: {
									modifier: 2.5,
									depth: 100,
								},
							},
							2000: {
								slidesPerView: 5,
								spaceBetween: 36,
								coverflowEffect: {
									modifier: 2.5,
									depth: 100,
								},
							},
						}}
						// Autoplay settings
						autoplay={
							autoplayDelay > 0
								? {
										delay: autoplayDelay,
										disableOnInteraction: false,
										pauseOnMouseEnter: true,
										reverseDirection: false,
									}
								: false
						}
						// Navigation and pagination
						navigation={false}
						pagination={
							showPagination
								? {
										clickable: true,
										dynamicBullets: false,
									}
								: false
						}
						// Performance optimizations
						watchSlidesProgress={true}
						watchOverflow={true}
						// Smooth transitions
						speed={600}
						// Events
						onSlideChange={(swiper) => {
							// Optional: track slide changes
						}}
						onSwiper={(swiper) => {
							// Force autoplay start
							if (autoplayDelay > 0 && swiper.autoplay) {
								swiper.autoplay.start();
							}
						}}
					>
						{extendedImages.map((image, index) => (
							<SwiperSlide key={`${image.src}-${index}`}>
								<div className="w-full h-full flex items-center justify-center">
									<Image
										src={image.src}
										alt={image.alt}
										// ✅ FIXED: Większe wymiary dla lepszej jakości
										width={400} // ✅ Zwiększone z 280px
										height={500} // ✅ Zachowaj wysokość ale lepszą szerokość
										className="w-full h-auto" // ✅ FIXED: Usuń object-cover
										// ✅ FIXED: Lepsze sizes dla karuzeli
										sizes="(max-width: 640px) 250px, (max-width: 768px) 300px, 400px"
										priority={index < 6}
										loading={index < 6 ? "eager" : "lazy"}
										// ✅ CRITICAL: Dodaj wysoką jakość
										quality={92} // ✅ ADDED: Wysoka jakość dla karuzeli
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</>
	);
};
