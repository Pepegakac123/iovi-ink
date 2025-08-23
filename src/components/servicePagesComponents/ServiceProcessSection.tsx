// src/components/servicePageComponents/ServiceProcessSection.tsx

import Image from "next/image";
import * as motion from "motion/react-client";
import Subheadline from "../Subheadline";
import ServiceProcessCard from "./ServiceProcessCard";
import { containerVariants, itemVariants, gridVariants } from "@/lib/variants";
import { ServiceProcessSectionProps } from "./servicePage";

const ServiceProcessSection = ({
	title,
	subtitle,
	processSteps,
	image,
}: ServiceProcessSectionProps) => {
	return (
		<motion.section
			className="py-16 md:py-20"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-50px" }}
			variants={containerVariants}
		>
			<div className="container">
				{/* Header Section */}
				<div className="flex flex-col gap-6 md:gap-8 mb-12 md:mb-16 items-start">
					<motion.div variants={itemVariants}>
						<Subheadline title={subtitle} />
					</motion.div>

					<motion.h2
						className="heading-primary"
						variants={itemVariants}
						whileHover={{
							scale: 1.02,
							transition: { duration: 0.2 },
						}}
					>
						{title}
					</motion.h2>
				</div>

				{/* Content Layout - Cards po lewej, sticky obraz po prawej */}
				<div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:items-start">
					{/* Process Cards - lewa strona */}
					<motion.div className="lg:w-1/2 lg:pr-8" variants={containerVariants}>
						<motion.div
							className="grid grid-cols-1 gap-6 md:gap-8"
							variants={gridVariants}
						>
							{processSteps.map((step, index) => (
								<motion.div
									key={`step-${step.number}-${index}`}
									variants={itemVariants}
									whileHover={{
										y: -4,
										transition: { duration: 0.2, ease: "easeOut" },
									}}
								>
									<ServiceProcessCard
										number={step.number}
										title={step.title}
										description={step.description}
									/>
								</motion.div>
							))}
						</motion.div>
					</motion.div>

					{/* Sticky Image - prawa strona */}
					<motion.div
						className="lg:w-1/2 lg:sticky lg:top-[120px] lg:self-start"
						variants={itemVariants}
					>
						<motion.div
							className="relative w-full rounded-md overflow-hidden group max-h-[500px]"
							whileHover={{
								scale: 1.02,
								transition: { duration: 0.4 },
							}}
							style={{ aspectRatio: "3/4", maxHeight: "500px" }}
						>
							<Image
								src={image.src}
								alt={image.alt}
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
								sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 90vw, 600px"
								loading="lazy"
								quality={95}
							/>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</motion.section>
	);
};

export default ServiceProcessSection;
