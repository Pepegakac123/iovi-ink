import images from "@/Assets/images";
import Image from "next/image";
import * as motion from "motion/react-client";
import { Variants } from "motion";

const TargetAudienceSection = () => {
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

	const itemVariants = {
		hidden: { opacity: 0, y: 30, scale: 0.95 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	} as Variants;

	const imageVariants = {
		hidden: { opacity: 0, x: 30, scale: 0.95 },
		visible: {
			opacity: 1,
			x: 0,
			scale: 1,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	} as Variants;

	return (
		<motion.div
			className="container flex flex-col lg:flex-row gap-8 md:gap-12 items-start lg:items-center relative"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-50px" }}
			variants={containerVariants}
		>
			<motion.div
				className="flex flex-col gap-8 md:gap-14"
				variants={itemVariants}
			>
				<motion.h2
					className="text-2xl md:text-4xl font-primary text-foreground"
					variants={itemVariants}
					whileHover={{
						scale: 1.02,
						transition: { duration: 0.2 },
					}}
				>
					Dla Kogo Są Moje Tatuaże
				</motion.h2>

				<motion.div
					className="flex flex-col gap-8"
					variants={containerVariants}
				>
					<motion.div
						className="flex flex-col gap-2"
						variants={itemVariants}
						whileHover={{
							scale: 1.02,
							y: -2,
							transition: { duration: 0.2 },
						}}
					>
						<motion.h3 className="text-lg md:text-2xl font-primary text-foreground">
							Osoby ceniące jakość nad ceną
						</motion.h3>
						<motion.p className="text-base font-secondary text-foreground">
							Jeśli szukasz najtańszego tatuażu w okolicy – nie jestem dla
							Ciebie. Jeśli szukasz kogoś, kto zrobi to dobrze i będziesz
							zadowolony za 5 lat – pogadajmy.
						</motion.p>
					</motion.div>

					<motion.div
						className="flex flex-col gap-2"
						variants={itemVariants}
						whileHover={{
							scale: 1.02,
							y: -2,
							transition: { duration: 0.2 },
						}}
					>
						<motion.h3 className="text-lg md:text-2xl font-primary text-foreground">
							Miłośnicy przemyślanego designu
						</motion.h3>
						<motion.p className="text-base font-secondary text-foreground">
							Fine line, minimalizm, geometria – specjalizuję się w stylach
							wymagających precyzji. Jeśli lubisz czyste linie i przemyślane
							proporcje – rozumiemy się.
						</motion.p>
					</motion.div>

					<motion.div
						className="flex flex-col gap-2"
						variants={itemVariants}
						whileHover={{
							scale: 1.02,
							y: -2,
							transition: { duration: 0.2 },
						}}
					>
						<motion.h3 className="text-lg md:text-2xl font-primary text-foreground">
							Klienci którzy wiedzą czego chcą
						</motion.h3>
						<motion.p className="text-base font-secondary text-foreground">
							Nie jestem terapeutą ani doradcą życiowym. Jestem artystką, która
							realizuje konkretne wizje. Jeśli masz pomysł i potrzebujesz
							precyzyjnej realizacji – jesteśmy na tak.
						</motion.p>
					</motion.div>
				</motion.div>
			</motion.div>

			<motion.div
				className="w-full flex lg:justify-end"
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
						src={images.targetAudience}
						alt="Tatuaże - Iovi Ink"
						width={600}
						height={400}
						className="object-cover rounded-md"
					/>
				</motion.div>
			</motion.div>
		</motion.div>
	);
};

export default TargetAudienceSection;
