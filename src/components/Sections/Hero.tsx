// src/components/Sections/Hero.tsx - RENDER DELAY FIX
import Image from "next/image";
import { Suspense, lazy } from "react";
import Subheadline from "../Subheadline";
import { ICONS } from "@/lib/icons";

interface HeroProps {
	subTitle: string;
	title: string;
	description: React.ReactNode | string;
	image: {
		src: string;
		alt: string;
	};
}

// ✅ CRITICAL: Lazy load non-critical components dla reduce render blocking
const FeatureCard = lazy(() => import("../FeatureCard"));
const FloatingElements = lazy(() => import("../FloatingElements"));

const Hero = ({ subTitle, title, description, image }: HeroProps) => {
	return (
		<div className="max-w-[1440px] mx-auto flex justify-center px-4 sm:px-8 py-4 pb-20 md:pb-24 lg:py-8">
			<div className="w-full gap-8 flex flex-col items-center bg-gradient-to-b from-[#FFEDEA] to-[#FDDFD0] border-1 border-b-4 border-r-4 border-foreground rounded-md overflow-hidden p-4 md:p-8 relative h-[570px] sm:h-[600px] md:h-[800px] lg:h-[1000px] hover:shadow-[4px_4px_0px_0px_var(--foreground)] transition-shadow duration-300">
				{/* ✅ CRITICAL: Critical content - immediate render */}
				<div className="flex flex-col gap-4 md:gap-8 items-center z-10 relative max-w-4xl">
					<Subheadline title={subTitle} />

					<h1 className="font-primary text-2xl sm:text-4xl lg:text-6xl text-foreground text-center">
						{title}
					</h1>

					<div className="relative">
						{/* Mobile backdrop */}
						<div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-md -m-3 sm:hidden" />

						{/* ✅ CRITICAL: LCP Element - immediate render, no delays */}
						<p className="paragraph-hero text-center relative z-10 px-3 sm:px-0">
							{description}
						</p>
					</div>
				</div>

				{/* ✅ CRITICAL: Hero Image - Fixed positioning, no render blocking */}
				<div
					className="absolute left-0 right-0 bottom-0 overflow-hidden flex align-center justify-center"
					style={{
						// ✅ Fixed desktop positioning - więcej miejsca nad obrazkiem
						top: "clamp(280px, 35vh, 420px)",
						containIntrinsicSize: "600px 600px",
					}}
				>
					<Image
						width={600}
						height={600}
						src={image.src}
						alt={image.alt}
						// ✅ CRITICAL: Maximum priority
						priority={true}
						loading="eager"
						quality={80} // Zwiększone z 70 - Load Time wzrósł, więc size może być za mały
						sizes="(max-width: 640px) 320px, (max-width: 768px) 400px, (max-width: 1024px) 500px, 600px"
						className="block object-cover object-top w-full h-auto max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]"
						style={{
							aspectRatio: "1 / 1",
							contentVisibility: "auto",
							backfaceVisibility: "hidden",
							transform: "translateZ(0)",
						}}
						fetchPriority="high"
						decoding="sync"
						referrerPolicy="no-referrer"
					/>
				</div>

				{/* ✅ NON-CRITICAL: Lazy loaded components */}
				<Suspense fallback={null}>
					<div className="hidden lg:flex flex-row gap-5 max-w-4xl justify-center align-stretch z-10">
						<FeatureCard
							text="Precyzyjne linie i przemyślane detale"
							icon={ICONS.paletteBrush}
							delay={0}
						/>
						<FeatureCard
							text="Od szkicu po finalny projekt"
							icon={ICONS.tabletGraphic}
							delay={0}
						/>
						<FeatureCard
							text="Robię to co lubię, i robię to dobrze"
							icon={ICONS.biceps}
							delay={0}
						/>
					</div>

					<FloatingElements variant="hero" />
				</Suspense>
			</div>
		</div>
	);
};

export default Hero;
