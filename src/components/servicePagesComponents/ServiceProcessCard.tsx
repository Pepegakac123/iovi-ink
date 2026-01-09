// src/components/servicePageComponents/ServiceProcessCard.tsx

import Image from "next/image";
import * as motion from "motion/react-client";
import { cardVariantsProcess, contentVariants } from "@/lib/variants";
import { images } from "@/lib/images";

interface ServiceProcessCardProps {
	number: string;
	title: string;
	description: string;
}

const ServiceProcessCard = ({
	number,
	title,
	description,
}: ServiceProcessCardProps) => {
	return (
		<motion.div
			className="w-full h-full flex flex-col relative bg-background border-2 border-foreground border-b-4 border-r-4 rounded-md overflow-hidden group cursor-default transition-all duration-200 ease-out lg:hover:scale-[1.02] lg:hover:-translate-y-1 lg:hover:shadow-[6px_6px_0px_0px_var(--foreground)] active:scale-98"
			variants={cardVariantsProcess}
		>
			{/* Background Image - jednolity dla wszystkich kart */}
			<div className="absolute inset-0 w-full h-full overflow-hidden">
				<div className="absolute inset-0 transition-transform duration-400 ease-out lg:group-hover:scale-105">
					<Image
						src={images.plain_proces_card.src}
						alt="Tło karty procesu"
						fill
						className="object-cover object-right"
						sizes="(max-width: 1024px) 100vw, 50vw"
					/>
				</div>
			</div>

			{/* Content */}
			<div className="relative z-10 flex flex-col p-4 md:p-8 ">
				{/* Number Badge */}
				<motion.div
					className="w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-6 flex-shrink-0 transition-transform duration-500 lg:group-hover:scale-110 lg:group-hover:rotate-6"
					initial={{ scale: 0.8, rotate: -10 }}
					whileInView={{ scale: 1, rotate: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					<div className="w-full h-full bg-muted border-1 border-foreground rounded-full flex items-center justify-center transition-all duration-200 lg:group-hover:shadow-[4px_4px_0px_0px_var(--foreground)] lg:group-hover:-translate-x-0.5 lg:group-hover:-translate-y-0.5">
						<span className="text-lg md:text-2xl font-primary text-foreground transition-transform duration-200 lg:group-hover:scale-120">
							{number}
						</span>
					</div>
				</motion.div>

				{/* Content */}
				<motion.div variants={contentVariants}>
					{/* Title */}
					<motion.h3
						className="heading-secondary-large mb-3 md:mb-4 leading-tight transition-transform duration-200 lg:group-hover:scale-102"
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2, duration: 0.4 }}
					>
						{title}
					</motion.h3>

					{/* Description */}
					<motion.p
						className="paragraph-process"
						initial={{ opacity: 0, y: 15 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						{description}
					</motion.p>
				</motion.div>
			</div>

			{/* Hover indicator */}
			<div
				className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent origin-left transform scale-x-0 transition-transform duration-300 ease-out lg:group-hover:scale-x-100"
			/>
		</motion.div>
	);
};

export default ServiceProcessCard;
