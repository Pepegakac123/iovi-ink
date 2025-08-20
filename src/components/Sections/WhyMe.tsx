import React from "react";
import Image from "next/image";
import * as motion from "motion/react-client";
import { Variants } from "motion";
import PrimaryBtn from "../buttons/PrimaryBtn";
import {
	buttonVariants,
	cardVariants,
	containerVariants,
	gridVariants,
	headerVariants,
	iconVariants,
} from "@/lib/variants";
import { ICONS } from "@/lib/icons";

const WhyMe = () => {
	return (
		<div className="container">
			<motion.div
				className="relative"
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: "-100px" }}
			>
				{/* Header */}
				<motion.div className="mb-12 md:mb-16" variants={headerVariants}>
					<motion.h2
						className="heading-primary-inverted"
						whileHover={{
							scale: 1.02,
							transition: { duration: 0.2 },
						}}
					>
						Co wyróżnia moje tatuaże
					</motion.h2>
				</motion.div>

				{/* Unified Grid Layout with animations */}
				<motion.div
					className="grid grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-4 lg:gap-6 lg:h-[500px]"
					variants={gridVariants}
				>
					{/* Autorskie projekty - row-span-2 on desktop */}
					<motion.div
						className="col-span-1 lg:row-span-2 bg-primary-foreground rounded-md p-4 lg:p-8 flex flex-col justify-between hover:bg-muted transition-colors"
						variants={cardVariants}
						whileHover={{
							scale: 1.02,
							y: -2,
							boxShadow: "4px 4px 0px 0px var(--accent)",
							transition: { duration: 0.3, ease: "easeInOut" },
						}}
						whileTap={{ scale: 0.98 }}
					>
						<motion.div
							className="w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-6 flex-shrink-0"
							variants={iconVariants}
							whileHover={{
								scale: 1.1,
								rotate: 5,
								transition: { duration: 0.2 },
							}}
						>
							<motion.div
								className="w-full h-full bg-muted border-1 border-foreground rounded-full flex items-center justify-center"
								whileHover={{
									boxShadow: "4px 4px 0px 0px var(--foreground)",
									translateX: -2,
									translateY: -2,
									transition: { duration: 0.2 },
								}}
							>
								<motion.div
									whileHover={{ scale: 1.2 }}
									transition={{ duration: 0.2 }}
								>
									<Image
										src={ICONS.tabletGraphic}
										alt="Autorskie projekty - ikona"
										width={24}
										height={24}
										className="w-6 h-6 md:w-8 md:h-8"
									/>
								</motion.div>
							</motion.div>
						</motion.div>
						<div>
							<motion.h3
								className="text-sm lg:text-2xl font-primary text-foreground mb-2 lg:mb-4"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.3 }}
							>
								Autorskie projekty bez kopii
							</motion.h3>
							<motion.p
								className="text-foreground font-text text-xs lg:text-base"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.4 }}
							>
								Każdy szkic rysuję od zera. Nie ma "weź z Instagrama", nie ma
								szablonów. Tylko przemyślane, autorskie kompozycje.
							</motion.p>
						</div>
					</motion.div>

					{/* Precyzja na poziomie obsesji */}
					<motion.div
						className="col-span-1 bg-primary-foreground rounded-md p-4 lg:p-6 flex flex-col justify-between hover:bg-muted transition-colors"
						variants={cardVariants}
						whileHover={{
							scale: 1.02,
							y: -2,
							boxShadow: "4px 4px 0px 0px var(--accent)",
							transition: { duration: 0.3, ease: "easeInOut" },
						}}
						whileTap={{ scale: 0.98 }}
					>
						<motion.div
							className="w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-6 flex-shrink-0"
							variants={iconVariants}
							whileHover={{
								scale: 1.1,
								rotate: -5,
								transition: { duration: 0.2 },
							}}
						>
							<motion.div
								className="w-full h-full bg-muted border-1 border-foreground rounded-full flex items-center justify-center"
								whileHover={{
									boxShadow: "4px 4px 0px 0px var(--foreground)",
									translateX: -2,
									translateY: -2,
									transition: { duration: 0.2 },
								}}
							>
								<motion.div
									whileHover={{ scale: 1.2 }}
									transition={{ duration: 0.2 }}
								>
									<Image
										src={ICONS.diamond}
										alt="Precyzja - ikona"
										width={24}
										height={24}
										className="w-6 h-6 md:w-8 md:h-8"
									/>
								</motion.div>
							</motion.div>
						</motion.div>
						<div>
							<motion.h3
								className="heading-secondary mb-2 lg:mb-3"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.3 }}
							>
								Precyzja na poziomie obsesji
							</motion.h3>
							<motion.p
								className="paragraph-small"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.4 }}
							>
								Artystyczne wykształcenie plus codzienną praktyka. Każda linia
								musi być dokładnie tam, gdzie zaplanowałam. Nie ma "w
								przybliżeniu".
							</motion.p>
						</div>
					</motion.div>

					{/* Pewność i stabilność */}
					<motion.div
						className="col-span-1 lg:row-span-2 bg-primary-foreground rounded-md p-4 lg:p-6 flex flex-col justify-between hover:bg-muted transition-colors"
						variants={cardVariants}
						whileHover={{
							scale: 1.02,
							y: -2,
							boxShadow: "4px 4px 0px 0px var(--accent)",
							transition: { duration: 0.3, ease: "easeInOut" },
						}}
						whileTap={{ scale: 0.98 }}
					>
						<motion.div
							className="w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-6 flex-shrink-0"
							variants={iconVariants}
							whileHover={{
								scale: 1.1,
								rotate: 10,
								transition: { duration: 0.2 },
							}}
						>
							<motion.div
								className="w-full h-full bg-muted border-1 border-foreground rounded-full flex items-center justify-center"
								whileHover={{
									boxShadow: "4px 4px 0px 0px var(--foreground)",
									translateX: -2,
									translateY: -2,
									transition: { duration: 0.2 },
								}}
							>
								<motion.div
									whileHover={{ scale: 1.2 }}
									transition={{ duration: 0.2 }}
								>
									<Image
										src={ICONS.tattooMachine}
										alt="Studio Lewus Ink - ikona"
										width={24}
										height={24}
										className="w-6 h-6 md:w-8 md:h-8"
									/>
								</motion.div>
							</motion.div>
						</motion.div>
						<div>
							<motion.h3
								className="heading-secondary mb-2 lg:mb-3"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.3 }}
							>
								Studio Lewus Ink jako gwarancja
							</motion.h3>
							<motion.p
								className="paragraph-small"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.4 }}
							>
								Jeden z najlepszych adresów w regionie. Najwyższe standardy
								higieny, profesjonalny sprzęt.
							</motion.p>
						</div>
					</motion.div>
					<motion.div
						className="col-span-1 bg-primary-foreground rounded-md p-4 lg:p-6 flex flex-col justify-between hover:bg-muted transition-colors"
						variants={cardVariants}
						whileHover={{
							scale: 1.02,
							y: -2,
							boxShadow: "4px 4px 0px 0px var(--accent)",
							transition: { duration: 0.3, ease: "easeInOut" },
						}}
						whileTap={{ scale: 0.98 }}
					>
						<motion.div
							className="w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-6 flex-shrink-0"
							variants={iconVariants}
							whileHover={{
								scale: 1.1,
								rotate: -10,
								transition: { duration: 0.2 },
							}}
						>
							<motion.div
								className="w-full h-full bg-muted border-1 border-foreground rounded-full flex items-center justify-center"
								whileHover={{
									boxShadow: "4px 4px 0px 0px var(--foreground)",
									translateX: -2,
									translateY: -2,
									transition: { duration: 0.2 },
								}}
							>
								<motion.div
									whileHover={{ scale: 1.2 }}
									transition={{ duration: 0.2 }}
								>
									<Image
										src={ICONS.careForDetails}
										alt="Dbałość o detale - ikona"
										width={24}
										height={24}
										className="w-6 h-6 md:w-8 md:h-8"
									/>
								</motion.div>
							</motion.div>
						</motion.div>
						<div>
							<motion.h3
								className="heading-secondary mb-2 lg:mb-3"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.3 }}
							>
								Artystyczny fundament
							</motion.h3>
							<motion.p
								className="paragraph-small"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.4 }}
							>
								Pasja do rysowania od dziecka dała mi oko do tego co współgra ze
								sobą wizualnie. Po prostu wiem co zrobić aby tatauż prezentował
								się dobrze na skórze
							</motion.p>
						</div>
					</motion.div>
				</motion.div>

				<motion.div
					className="mt-12 md:mt-12 flex justify-center items-center"
					variants={buttonVariants}
				>
					<PrimaryBtn />
				</motion.div>
			</motion.div>
		</div>
	);
};

export default WhyMe;
