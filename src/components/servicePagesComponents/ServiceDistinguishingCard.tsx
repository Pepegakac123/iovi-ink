// src/components/servicePageComponents/ServiceDistinguishingCard.tsx

import * as motion from "motion/react-client";
import { cardVariantsFast } from "@/lib/variants";

interface ServiceDistinguishingCardProps {
	title: string;
	content: string;
}

const ServiceDistinguishingCard = ({
	title,
	content,
}: ServiceDistinguishingCardProps) => {
	return (
		<motion.div
			className="w-full h-full bg-background border-2 border-accent rounded-md p-6 md:p-8 group cursor-default"
			variants={cardVariantsFast}
			whileHover={{
				scale: 1.02,
				boxShadow: "6px 6px 0px 0px var(--accent)",
				transition: { duration: 0.2 },
			}}
			whileTap={{ scale: 0.98 }}
		>
			<motion.h3
				className="heading-secondary mb-4"
				initial={{ opacity: 0, y: 10 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ delay: 0.1, duration: 0.4 }}
			>
				{title}
			</motion.h3>

			<motion.p
				className="paragraph-secondary leading-relaxed"
				initial={{ opacity: 0, y: 15 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ delay: 0.2, duration: 0.5 }}
			>
				{content}
			</motion.p>
		</motion.div>
	);
};

export default ServiceDistinguishingCard;
