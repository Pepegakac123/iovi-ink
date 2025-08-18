import ProcessCard from "../ProcessCard";
import Subheadline from "../Subheadline";
import { proces } from "@/Assets/index.js";
import * as motion from "motion/react-client";
import { Variants } from "motion";

// Variants dla kontenera
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

// Variants dla elementów nagłówka
const headerVariants = {
	hidden: {
		opacity: 0,
		y: 30,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: "easeOut",
		},
	},
} as Variants;

// Variants dla tytułu
const titleVariants = {
	hidden: {
		opacity: 0,
		y: 40,
		scale: 0.95,
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.7,
			ease: "easeOut",
		},
	},
} as Variants;

// Variants dla opisu
const descriptionVariants = {
	hidden: {
		opacity: 0,
		y: 20,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: "easeOut",
		},
	},
} as Variants;

// Variants dla grida kart
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

// Variants dla pojedynczych kart w gridzie
const cardItemVariants = {
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

const Process = () => {
	return (
		<motion.div
			className="container flex flex-col gap-12 md:gap-14"
			variants={containerVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
		>
			{/* Header Section */}
			<motion.div
				className="flex flex-col gap-6 md:gap-8"
				variants={headerVariants}
			>
				{/* Animated Subheadline */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					<Subheadline title="Od pierwszego szkicu do gojenia" />
				</motion.div>

				{/* Content */}
				<div className="flex flex-col gap-2 md:gap-4">
					{/* Animated Title */}
					<motion.h2
						className="text-foreground text-2xl md:text-4xl font-primary"
						variants={titleVariants}
						whileHover={{
							scale: 1.02,
							transition: { duration: 0.2 },
						}}
					>
						Tatuaże - Proces Tworzenia
					</motion.h2>

					{/* Animated Description */}
					<motion.p
						className="text-foreground text-base max-w-[600px]"
						variants={descriptionVariants}
					>
						Jestem z Tobą na każdym etapie współpracy. Tylko przejrzysty proces
						i regularne update'y.
					</motion.p>
				</div>
			</motion.div>

			{/* Animated Grid */}
			<motion.div
				className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch"
				variants={gridVariants}
			>
				{proces.map((item, index) => (
					<motion.div
						key={item.id}
						variants={cardItemVariants}
						whileHover={{
							y: -8,
							transition: { duration: 0.2, ease: "easeOut" },
						}}
						style={
							{
								// Dodatkowy delay dla różnorodności
								"--motion-delay": `${index * 0.1}s`,
							} as React.CSSProperties
						}
					>
						<ProcessCard {...item} />
					</motion.div>
				))}
			</motion.div>
		</motion.div>
	);
};

export default Process;
