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
	// Duplikowanie slajdów jeśli jest ich mało - zabezpieczenie przed bugami loop
	const extendedImages = React.useMemo(() => {
		if (images.length < 8) {
			// Jeśli mamy mniej niż 8 slajdów, duplikujemy je
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
    min-height: 570px;
    position: relative;
  }
  
  .carousel-swiper .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 280px; /* Zmniejszone dla 4 slajdów */
    height: 520px;
    flex-shrink: 0;
    box-sizing: border-box;
    transition: all 0.4s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Active slide scaling */
  .carousel-swiper .swiper-slide-active {
    z-index: 2;
  }
  
  /* Previous and next slides slightly smaller */
  .carousel-swiper .swiper-slide-prev img,
  .carousel-swiper .swiper-slide-next img {
    transform: scale(0.92);
    opacity: 0.85;
  }
  
  /* Other slides even smaller */
  .carousel-swiper .swiper-slide:not(.swiper-slide-active):not(.swiper-slide-prev):not(.swiper-slide-next) img {
    transform: scale(0.88);
    opacity: 0.7;
  }
  
  .carousel-swiper .swiper-slide img {
    display: block;
    width: 100%;
    height: 500px;
    object-fit: cover;
    border-radius: 16px; /* Zwiększone z 12px do 16px */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.4s ease;
  }
  
  .carousel-swiper .swiper-slide:hover img {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  /* Active slide - larger scale */
  .carousel-swiper .swiper-slide-active img {
    transform: scale(1.0);
  }
  
  /* Non-active slides - smaller scale */
  .carousel-swiper .swiper-slide:not(.swiper-slide-active) img {
    transform: scale(0.88);
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
      height: 470px;
    }
    
    .carousel-swiper .swiper-slide img {
      height: 450px;
      border-radius: 16px;
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
      height: 375px;
      border-radius: 16px;
    }
    
    /* Mobile scaling - mniejsze różnice */
    .carousel-swiper .swiper-slide-active img {
      transform: scale(1.0);
    }
    
    .carousel-swiper .swiper-slide:not(.swiper-slide-active) img {
      transform: scale(0.92);
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
						// Coverflow effect settings - dostosowane dla 4 slajdów
						effect="coverflow"
						coverflowEffect={{
							rotate: 0,
							stretch: 0,
							depth: 100, // Zmniejszone dla lepszego efektu z 4 slajdami
							modifier: 2.5, // Dostosowane dla 4 slajdów
							slideShadows: false,
						}}
						// Core settings - 4 slajdy na desktop
						slidesPerView={4}
						centeredSlides={true}
						spaceBetween={32}
						// Loop settings - ulepszone dla stabilności
						loop={extendedImages.length >= 8} // Włączamy loop tylko gdy mamy wystarczająco slajdów
						loopAdditionalSlides={1} // Dodatkowe slajdy dla płynnego loop
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
								slidesPerView: 4, // 4 slajdy na desktop
								spaceBetween: 32,
								coverflowEffect: {
									modifier: 2.5,
									depth: 100,
								},
							},
							2000: {
								slidesPerView: 5, // 4 slajdy na desktop
								spaceBetween: 32,
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
								<div className="w-full h-full">
									<Image
										src={image.src}
										alt={image.alt}
										width={280}
										height={500}
										className="w-full h-full object-cover"
										sizes="(max-width: 640px) 250px, (max-width: 768px) 280px, 280px"
										priority={index < 6} // Load first 6 images with priority
										loading={index < 6 ? "eager" : "lazy"}
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
