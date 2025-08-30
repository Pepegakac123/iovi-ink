// src/components/Sections/Hero.tsx - poprawka mobile overlay
import Image from "next/image";
import Subheadline from "../Subheadline";
import FeatureCard from "../FeatureCard";
import * as motion from "motion/react-client";
import {
	containerVariants,
	descriptionVariants,
	titleVariants,
} from "@/lib/variants";
import { ICONS } from "@/lib/icons";
import FloatingElements from "../FloatingElements";

interface HeroProps {
	subTitle: string;
	title: string;
	description: React.ReactNode | string;
	image: {
		src: string;
		alt: string;
	};
}

const Hero = ({ subTitle, title, description, image }: HeroProps) => {
	return (
		<motion.div
			className="max-w-[1440px] mx-auto flex justify-center px-4 sm:px-8 py-4 pb-20 md:pb-24 lg:py-8"
			initial="hidden"
			animate="visible"
			variants={containerVariants}
		>
			<motion.div
				className="w-full gap-8 flex flex-col items-center bg-gradient-to-b from-[#FFEDEA] to-[#FDDFD0] border-1 border-b-4 border-r-4 border-foreground rounded-md overflow-hidden p-4 md:p-8 relative h-[570px] sm:h-[600px] md:h-[800px] lg:h-[1000px]"
				initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
				animate={{ opacity: 1, scale: 1, rotateX: 0 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
				whileHover={{
					boxShadow: "4px 4px 0px 0px var(--foreground)",
					transition: { duration: 0.3 },
				}}
			>
				{/* Content Section z lepszym positioning na mobile */}
				<motion.div
					className="flex flex-col gap-4 md:gap-8 items-center z-10 relative max-w-4xl"
					variants={containerVariants}
				>
					<Subheadline title={subTitle} />

					<motion.h1
						className="font-primary text-2xl sm:text-4xl lg:text-6xl text-foreground text-center"
						variants={titleVariants}
						whileHover={{
							scale: 1.02,
							transition: { duration: 0.2 },
						}}
					>
						{title}
					</motion.h1>

					{/* Description z lepszym kontrastem na mobile */}
					<motion.div className="relative" variants={descriptionVariants}>
						{/* Opcja 1: Tło pod tekstem na mobile */}
						<div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-md -m-3 sm:hidden" />

						<motion.p className="paragraph-hero text-center relative z-10 px-3 sm:px-0">
							{description}
						</motion.p>
					</motion.div>
				</motion.div>

				{/* Feature Cards with staggered animation */}
				<motion.div
					className="hidden lg:flex flex-row gap-5 max-w-4xl justify-center align-stretch z-10"
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.5 }}
				>
					<FeatureCard
						text="Precyzyjne linie i przemyślane detale"
						icon={ICONS.paletteBrush}
						delay={0}
					/>
					<FeatureCard
						text="Od szkicu po finalny projekt"
						icon={ICONS.tabletGraphic}
						delay={0.2}
					/>
					<FeatureCard
						text="Robię to co lubię, i robię to dobrze"
						icon={ICONS.biceps}
						delay={0.4}
					/>
				</motion.div>

				{/* Character Image - przesunięty niżej na mobile */}
				<div className="absolute top-[250px] sm:top-[200px] md:top-[200px] lg:top-[300px] left-0 right-0 bottom-0 overflow-hidden z-0 mt-8 flex align-center justify-center">
					<Image
						width={900}
						height={900}
						src={image.src}
						alt={image.alt}
						// ✅ KRYTYCZNE: Priority + eager loading dla LCP
						priority={true}
						loading="eager"
						// ✅ Wysokiej jakość dla hero
						quality={90}
						// ✅ Optymalne sizes dla different viewports
						sizes="(max-width: 640px) 700px, (max-width: 1024px) 800px, 900px"
						className="block object-cover object-top max-w-[700px] sm:max-w-[900px]"
						// ✅ Preload hint dla browsera
						style={{
							contentVisibility: "auto", // Browser optimization
							containIntrinsicSize: "900px 900px", // Layout stability
						}}
						// ✅ Fetchpriority dla Chromium browsers
						fetchPriority="high"
					/>
				</div>

				{/* Decorative floating elements */}
				<FloatingElements variant="hero" />
			</motion.div>
		</motion.div>
	);
};

export default Hero;
