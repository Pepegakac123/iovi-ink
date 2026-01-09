import Image from "next/image";
import * as motion from "motion/react-client";
import {
	cardVariantsProcess,
	contentVariants,
	iconVariantsSimple,
} from "@/lib/variants";

interface ProcessCardProps {
	id: number;
	icon: string;
	bg_image: {
		mobile: string;
		desktop: string;
		alt: string;
	};
	title: string;
	description: string;
}

const ProcessCard = ({
	id,
	icon,
	bg_image,
	title,
	description,
}: ProcessCardProps) => {
	return (
		<motion.div
			className="w-full h-full flex flex-col relative bg-background border-2 border-foreground border-b-4 border-r-4 rounded-md overflow-hidden group cursor-default transition-all duration-200 ease-out lg:hover:scale-[1.02] lg:hover:-translate-y-1 lg:hover:shadow-[6px_6px_0px_0px_var(--foreground)] active:scale-98"
			variants={cardVariantsProcess}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-50px" }}
		>
			{/* Background Image */}
			<div className="absolute inset-0 w-full h-full overflow-hidden">
				{/* Mobile Background */}
				<div className="absolute inset-0 lg:hidden transition-transform duration-400 ease-out group-hover:scale-105">
					<Image
						src={bg_image.mobile}
						alt={bg_image.alt}
						fill
						className="object-cover object-right"
						sizes="(max-width: 1024px) 100vw, 50vw"
					/>
				</div>

				{/* Desktop Background */}
				<div className="absolute inset-0 hidden lg:block transition-transform duration-400 ease-out lg:group-hover:scale-105">
					<Image
						src={bg_image.desktop}
						alt={bg_image.alt}
						fill
						className="object-cover object-right"
						sizes="(max-width: 1024px) 100vw, 50vw"
					/>
				</div>
			</div>

			{/* Animated overlay for text readability */}
			<div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent opacity-80 transition-opacity duration-300 lg:group-hover:opacity-90" />

			{/* Content */}
			<div className="relative z-10 flex flex-col p-4 md:p-8 max-w-[65%]">
				{/* Animated Icon */}
				<motion.div
					className="w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-6 flex-shrink-0 transition-transform duration-200 lg:group-hover:scale-110 lg:group-hover:rotate-6"
					variants={iconVariantsSimple}
				>
					<div className="w-full h-full bg-muted border-1 border-foreground rounded-full flex items-center justify-center transition-all duration-200 lg:group-hover:shadow-[4px_4px_0px_0px_var(--foreground)] lg:group-hover:-translate-x-0.5 lg:group-hover:-translate-y-0.5">
						<div className="transition-transform duration-200 lg:group-hover:scale-120">
							<Image
								src={icon}
								alt={`${title} - ikona`}
								width={24}
								height={24}
								className="w-6 h-6 md:w-8 md:h-8"
							/>
						</div>
					</div>
				</motion.div>

				{/* Animated Content */}
				<motion.div variants={contentVariants}>
					{/* Animated Title */}
					<motion.h3
						className="heading-secondary-large mb-3 md:mb-4 leading-tight transition-transform duration-200 lg:group-hover:scale-102"
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2, duration: 0.4 }}
					>
						{title}
					</motion.h3>

					{/* Animated Description */}
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

			{/* Subtle hover indicator */}
			<div
				className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent origin-left transform scale-x-0 transition-transform duration-300 ease-out lg:group-hover:scale-x-100"
			/>
		</motion.div>
	);
};

export default ProcessCard;
