import React from "react";
import * as motion from "motion/react-client";
import { Variants } from "motion";

// Variants dla głównego kontenera
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: 0.6,
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
} as Variants;

// Variants dla nagłówka
const headerVariants = {
	hidden: {
		opacity: 0,
		y: 30,
		scale: 0.95,
	},
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

// Variants dla grida
const gridVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: 0.4,
			staggerChildren: 0.15,
			delayChildren: 0.3,
		},
	},
} as Variants;

// Variants dla kart
const cardVariants = {
	hidden: {
		opacity: 0,
		y: 50,
		scale: 0.9,
	},
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

// Variants dla ikon
const iconVariants = {
	hidden: {
		opacity: 0,
		scale: 0.5,
		rotate: -180,
	},
	visible: {
		opacity: 1,
		scale: 1,
		rotate: 0,
		transition: {
			duration: 0.5,
			ease: "easeOut",
			delay: 0.2,
		},
	},
} as Variants;

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
						className="text-2xl md:text-4xl font-primary text-background"
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
						className="col-span-1 lg:row-span-2 bg-primary-foreground  rounded-lg p-4 lg:p-8 flex flex-col justify-between hover:bg-muted transition-colors"
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
							className="w-10 h-10 lg:w-16 lg:h-16 bg-muted border-1 border-foreground rounded-full flex items-center justify-center mb-3 lg:mb-6 aspect-square hover:bg-accent/30 transition-colors"
							variants={iconVariants}
							whileHover={{
								rotate: 10,
								scale: 1.1,
								transition: { duration: 0.3, ease: "easeInOut" },
							}}
						>
							<img
								src="https://cms.iovi-ink.pl/wp-content/uploads/2025/08/Tablet-Graficzny.svg"
								alt="Ikonka"
								className="w-5 h-5 lg:w-8 lg:h-8"
							/>
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
						className="col-span-1 bg-primary-foreground  rounded-lg p-4 lg:p-6  flex flex-col justify-between hover:bg-muted transition-colors"
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
							className="w-10 h-10 lg:w-14 lg:h-14 bg-muted border-1 border-foreground rounded-full flex items-center justify-center mb-3 lg:mb-4 aspect-square hover:bg-accent/30 transition-colors"
							variants={iconVariants}
							whileHover={{
								rotate: -10,
								scale: 1.1,
								transition: { duration: 0.2 },
							}}
						>
							<img
								src="https://cms.iovi-ink.pl/wp-content/uploads/2025/08/diamond.svg"
								alt="Icon"
								className="w-5 h-5 lg:w-7 lg:h-7"
							/>
						</motion.div>
						<div>
							<motion.h3
								className="text-sm lg:text-xl font-primary text-foreground mb-2 lg:mb-3"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.3 }}
							>
								Precyzja na poziomie obsesji
							</motion.h3>
							<motion.p
								className="text-foreground font-text text-xs lg:text-sm"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.4 }}
							>
								Artystyczne wykształcenie plus codzienna praktyka. Każda linia
								musi być dokładnie tam, gdzie zaplanowałem.
							</motion.p>
						</div>
					</motion.div>

					{/* Artystyczny fundament - row-span-2 on desktop */}
					<motion.div
						className="col-span-1 lg:row-span-2 bg-primary-foreground  rounded-lg p-4 lg:p-8  flex flex-col justify-between hover:bg-muted transition-colors "
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
							className="w-10 h-10 lg:w-16 lg:h-16 bg-muted border-1 border-foreground rounded-full flex items-center justify-center mb-3 lg:mb-6 aspect-square hover:bg-accent/30"
							variants={iconVariants}
							whileHover={{
								rotate: 15,
								scale: 1.1,
								transition: { duration: 0.2 },
							}}
						>
							<img
								src="https://cms.iovi-ink.pl/wp-content/uploads/2025/08/pallete_brusj.svg"
								alt="Ikonka"
								className="w-5 h-5 lg:w-8 lg:h-8"
							/>
						</motion.div>
						<div>
							<motion.h3
								className="text-sm lg:text-2xl font-primary text-foreground mb-2 lg:mb-4"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.3 }}
							>
								Artystyczny fundament
							</motion.h3>
							<motion.p
								className="text-foreground font-text text-xs lg:text-base"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.4 }}
							>
								Pasja do rysowania od dziecka dała mi oko do tego co współgra ze
								sobą i wygląda. Po prostu wiem co zrobić aby tatuaż prezentował
								się dobrze na skórze.
							</motion.p>
						</div>
					</motion.div>

					{/* Studio Lewus Ink */}
					<motion.div
						className="col-span-1 bg-primary-foreground rounded-lg p-4 lg:p-6  flex flex-col justify-between hover:bg-muted transition-colors"
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
							className="w-10 h-10 lg:w-14 lg:h-14 bg-muted border-1 border-foreground rounded-full flex items-center justify-center mb-3 lg:mb-4 aspect-square hover:bg-accent/30"
							variants={iconVariants}
							whileHover={{
								rotate: -15,
								scale: 1.1,
								transition: { duration: 0.2 },
							}}
						>
							<img
								src="https://cms.iovi-ink.pl/wp-content/uploads/2025/08/tattoo_machine.svg"
								alt="Ikonka"
								className="w-5 h-5 lg:w-7 lg:h-7"
							/>
						</motion.div>
						<div>
							<motion.h3
								className="text-sm lg:text-xl font-primary text-foreground mb-2 lg:mb-3"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.3 }}
							>
								Studio Lewus Ink jako gwarancja
							</motion.h3>
							<motion.p
								className="text-foreground font-text text-xs lg:text-sm"
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
				</motion.div>
			</motion.div>
		</div>
	);
};

export default WhyMe;
