import Image from "next/image";
import Subheadline from "../Subheadline";
import images from "@/Assets/images";
import * as motion from "motion/react-client";
import { Variants } from "motion";

const AboutMe = () => {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
				delayChildren: 0.2,
			},
		},
	} as Variants;

	const contentVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	} as Variants;

	const imageVariants = {
		hidden: { opacity: 0, scale: 0.9, x: 20 },
		visible: {
			opacity: 1,
			scale: 1,
			x: 0,
			transition: {
				duration: 0.8,
				ease: "easeOut",
			},
		},
	} as Variants;

	const paragraphVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: "easeOut",
			},
		},
	} as Variants;

	return (
		<motion.div
			className="container"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={containerVariants}
		>
			<motion.div
				className="bg-transparent border-1 border-foreground rounded-md px-4 pt-4 lg:py-8 lg:px-8 flex flex-col lg:flex-row gap-4 w-full lg:items-center relative overflow-hidden"
				whileHover={{
					boxShadow: "6px 6px 0px 0px var(--foreground)",
					transition: { duration: 0.3 },
				}}
				variants={contentVariants}
			>
				{/* Content Section */}
				<motion.div
					className="gap-4 flex flex-col lg:flex-1"
					variants={contentVariants}
				>
					<motion.div variants={paragraphVariants}>
						<Subheadline title="2 lata intensywnej nauki" />
					</motion.div>

					<motion.h2
						className="text-2xl md:text-4xl text-foreground font-primary"
						variants={paragraphVariants}
						whileHover={{
							scale: 1.02,
							transition: { duration: 0.2 },
						}}
					>
						Moje Doświadczenie w Tworzeniu Tatuaży
					</motion.h2>

					<motion.p
						className="text-base text-foreground"
						variants={paragraphVariants}
					>
						Artystyczne wykształcenie to fundament, ale prawdziwa nauka zaczęła
						się w studio. Każdy dzień to nowe wyzwania – różne typy skóry, różne
						oczekiwania klientów, różne techniki
					</motion.p>

					<motion.p
						className="text-base text-foreground"
						variants={paragraphVariants}
					>
						Studio Lewus Ink pozwala mi oferować tatuaże na najwyższym poziomie.
						Sterylne środowisko, profesjonalny sprzęt, komfortowe warunki. Mogę
						skupić się na sztuce, bo wszystko inne jest dopięte
					</motion.p>

					<motion.p
						className="text-base text-foreground"
						variants={paragraphVariants}
					>
						Każdy tatuaż traktuję jak wyzwanie artystyczne. Nie ma rutyny – jest
						ciągłe doskonalenie techniki i poszukiwanie najlepszych rozwiązań.
					</motion.p>

					{/* Mobile Image - positioned at bottom right */}
					<motion.div
						className="flex justify-end lg:hidden"
						variants={imageVariants}
					>
						<motion.div
							whileHover={{
								scale: 1.05,
								rotate: 1,
								transition: { duration: 0.3 },
							}}
							whileTap={{ scale: 0.98 }}
						>
							<Image
								src={images.about}
								alt="Jowita - Artystka Tatuażu"
								width={189}
								height={189}
								className="object-cover rounded-md"
							/>
						</motion.div>
					</motion.div>
				</motion.div>

				{/* Desktop Image - positioned on the right side */}
				<motion.div
					className="hidden lg:flex lg:flex-1 lg:items-start lg:justify-end"
					variants={imageVariants}
				>
					<motion.div
						whileHover={{
							scale: 1.03,
							rotate: -1,
							transition: { duration: 0.4 },
						}}
						whileTap={{ scale: 0.98 }}
					>
						<Image
							src={images.about}
							alt="Jowita - Artystka Tatuażu"
							width={440}
							height={428}
							className="object-cover rounded-md"
						/>
					</motion.div>
				</motion.div>

				{/* Decorative floating elements - podobne do Hero */}
				<motion.div
					className="absolute top-4 right-4 w-3 h-3 bg-accent border-2 border-foreground rounded-full"
					animate={{
						x: [0, 8, 0],
						y: [0, -8, 0],
						rotate: [0, 180, 360],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>

				<motion.div
					className="absolute bottom-4 left-4 w-2 h-2 bg-primary border-2 border-foreground transform rotate-45"
					animate={{
						x: [0, -6, 0],
						y: [0, 6, 0],
						rotate: [45, 225, 405],
					}}
					transition={{
						duration: 6,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 1.5,
					}}
				/>

				<motion.div
					className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-secondary border-2 border-foreground rounded-full"
					animate={{
						scale: [1, 1.4, 1],
						opacity: [0.6, 1, 0.6],
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 0.8,
					}}
				/>
			</motion.div>
		</motion.div>
	);
};

export default AboutMe;
