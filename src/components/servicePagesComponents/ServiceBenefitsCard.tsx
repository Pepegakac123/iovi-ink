// src/components/servicePageComponents/ServiceBenefitsCard.tsx

import Image from "next/image";
import * as motion from "motion/react-client";
import { cardVariantsProcess, contentVariants } from "@/lib/variants";
import { ICONS } from "@/lib/icons";

interface ServiceBenefitsCardProps {
	title: string;
	description: string;
	ikona: string;
}

const ServiceBenefitsCard = ({
	title,
	description,
	ikona,
}: ServiceBenefitsCardProps) => {
	return (
		<motion.div
			className="w-full h-full flex flex-col relative bg-gradient-to-r from-background/20 to-accent/20 border-2 border-foreground border-b-4 border-r-4 rounded-md overflow-hidden group cursor-default transition-all duration-200 ease-out lg:hover:scale-[1.02] lg:hover:-translate-y-1 lg:hover:shadow-[6px_6px_0px_0px_var(--foreground)] active:scale-98"
			variants={cardVariantsProcess}
		>
			{/* Content */}
			<div className="relative z-10 flex flex-col p-4 md:p-8">
				{/* Icon Badge */}
				<motion.div
					className="w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-6 flex-shrink-0 transition-transform duration-200 lg:group-hover:scale-110 lg:group-hover:rotate-6"
					initial={{ scale: 0.8, rotate: -10 }}
					whileInView={{ scale: 1, rotate: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					<div className="w-full h-full bg-background border-1 border-foreground rounded-full flex items-center justify-center transition-all duration-200 lg:group-hover:shadow-[4px_4px_0px_0px_var(--foreground)] lg:group-hover:-translate-x-0.5 lg:group-hover:-translate-y-0.5">
						<div className="transition-transform duration-200 lg:group-hover:scale-120">
							<Image
								src={ikona || ICONS.heart}
								alt={`${title} - ikona`}
								width={24}
								height={24}
								className="w-6 h-6 md:w-8 md:h-8"
							/>
						</div>
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

export default ServiceBenefitsCard;
