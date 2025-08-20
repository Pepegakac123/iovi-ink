import Image from "next/image";
import Subheadline from "../Subheadline";
import FeatureCard from "../FeatureCard";
import * as motion from "motion/react-client";
import { Variants } from "motion";

interface HeroProps {
	subTitle: string;
	title: string;
	description: React.ReactNode | string; // Zmiana z string na React.ReactNode
	image: string;
}

const Hero = ({ subTitle, title, description, image }: HeroProps) => {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	} as Variants;

	const titleVariants = {
		hidden: { opacity: 0, y: 50, scale: 0.9 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.8,
				ease: "easeOut",
			},
		},
	} as Variants;

	const descriptionVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				delay: 0.3,
			},
		},
	} as Variants;

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
				{/* Content Section */}
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

					<motion.p
						className="text-foreground text-sm lg:text-lg font-text text-center"
						variants={descriptionVariants}
					>
						{description}
					</motion.p>
				</motion.div>

				{/* Feature Cards with staggered animation */}
				<motion.div
					className="hidden lg:flex flex-row gap-5 max-w-4xl justify-center align-stretch z-10"
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.5 }}
				>
					<FeatureCard
						text="Precyzyjne linie i stylizowane formy"
						icon="https://cms.iovi-ink.pl/wp-content/uploads/2025/08/pallete_brush_2.svg"
						delay={0}
					/>
					<FeatureCard
						text="Od szkicu po finalny projekt"
						icon="https://cms.iovi-ink.pl/wp-content/uploads/2025/08/tablet_graficzny.svg"
						delay={0.2}
					/>
					<FeatureCard
						text="Robię to co lubię, i robię to dobrze"
						icon="https://cms.iovi-ink.pl/wp-content/uploads/2025/08/biceps.svg"
						delay={0.4}
					/>
				</motion.div>

				{/* Character Image - No animations */}
				<div className="absolute top-[220px] sm:top-[150px] md:top-[200px] lg:top-[300px] left-0 right-0 bottom-0 overflow-hidden z-0 mt-8 flex align-center justify-center">
					<Image
						width={900}
						height={900}
						src={image}
						alt="Jowita - Tatuaże - Iovi"
						className="block object-cover object-top max-w-[900px]"
					/>
				</div>

				{/* Decorative floating elements */}
				<motion.div
					className="absolute top-8 right-8 w-4 h-4 bg-accent border-2 border-foreground rounded-full"
					animate={{
						x: [0, 10, 0],
						y: [0, -10, 0],
						rotate: [0, 180, 360],
					}}
					transition={{
						duration: 6,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>

				<motion.div
					className="absolute bottom-20 left-8 w-3 h-3 bg-primary border-2 border-foreground transform rotate-45"
					animate={{
						x: [0, -8, 0],
						y: [0, 8, 0],
						rotate: [45, 225, 405],
					}}
					transition={{
						duration: 5,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 1,
					}}
				/>

				<motion.div
					className="absolute top-32 left-12 w-2 h-2 bg-secondary border-2 border-foreground rounded-full"
					animate={{
						scale: [1, 1.5, 1],
						opacity: [0.7, 1, 0.7],
					}}
					transition={{
						duration: 3,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 0.5,
					}}
				/>
			</motion.div>
		</motion.div>
	);
};

export default Hero;
