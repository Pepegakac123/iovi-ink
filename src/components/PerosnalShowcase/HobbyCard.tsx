// src/components/PersonalShowcase/HobbyCard.tsx
import Image from "next/image";
import * as motion from "motion/react-client";
import { cardVariants, itemVariants } from "@/lib/variants";
import { HobbyCardProps } from "@/lib/dataTypes";

// ===========================================
// HOBBY CARD COMPONENT
// ===========================================

const HobbyCard = ({ hobby, index }: HobbyCardProps) => (
	<motion.div
		className="flex flex-col items-center text-center group transition-transform duration-200 lg:hover:scale-105"
		variants={cardVariants}
		custom={index}
	>
		{/* Ikona - z osobnym hover bez variants */}
		<div className="w-16 h-16 md:w-20 md:h-20 mb-3 flex items-center justify-center bg-background border-2 border-foreground rounded-full transition-all duration-200 lg:group-hover:shadow-[4px_4px_0px_0px_var(--foreground)] lg:group-hover:-translate-x-0.5 lg:group-hover:-translate-y-0.5 lg:group-hover:scale-110">
			<div className="transition-transform duration-200 lg:group-hover:scale-120">
				<Image
					src={hobby.icon}
					alt={`${hobby.name} icon`}
					width={32}
					height={32}
					className="w-8 h-8"
				/>
			</div>
		</div>

		<motion.p
			className="font-primary text-sm md:text-base text-foreground"
			variants={itemVariants}
		>
			{hobby.name}
		</motion.p>
	</motion.div>
);

export default HobbyCard;
