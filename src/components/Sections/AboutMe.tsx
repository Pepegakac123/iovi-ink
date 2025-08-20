import Image from "next/image";
import Subheadline from "../Subheadline";
import images from "@/Assets/images";
import * as motion from "motion/react-client";
import { Variants } from "motion";
import {
	containerVariantsLong,
	contentVariants,
	imageVariants,
	paragraphVariants,
} from "@/lib/variants";
import FloatingElements from "../FloatingElements";

const AboutMe = () => {
	return (
		<motion.div
			className="container"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={containerVariantsLong}
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
						className="heading-primary"
						variants={paragraphVariants}
						whileHover={{
							scale: 1.02,
							transition: { duration: 0.2 },
						}}
					>
						Moje Doświadczenie w Tworzeniu Tatuaży
					</motion.h2>

					<motion.p className="paragraph-base" variants={paragraphVariants}>
						Artystyczne wykształcenie to fundament, ale prawdziwa nauka zaczęła
						się w studio. Każdy dzień to nowe wyzwania – różne typy skóry, różne
						oczekiwania klientów, różne techniki
					</motion.p>

					<motion.p className="paragraph-base" variants={paragraphVariants}>
						Studio Lewus Ink pozwala mi oferować tatuaże na najwyższym poziomie.
						Sterylne środowisko, profesjonalny sprzęt, komfortowe warunki. Mogę
						skupić się na sztuce, bo wszystko inne jest dopięte
					</motion.p>

					<motion.p className="paragraph-base" variants={paragraphVariants}>
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
				<FloatingElements variant="card" />
			</motion.div>
		</motion.div>
	);
};

export default AboutMe;
