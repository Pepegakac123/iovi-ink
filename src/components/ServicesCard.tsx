import { JetEngineUsluga } from "@/lib/jetPostTypes";
import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import { Variants } from "motion";
import CardBtn from "./buttons/CardBtn";

const cardVariants = {
	hidden: { opacity: 0, y: 40, scale: 0.9 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.5,
			ease: "easeOut",
		},
	},
} as Variants;
const ServicesCard = ({
	service,
}: {
	service: JetEngineUsluga & {
		imageWithAlt: {
			src: string;
			alt: string;
		};
	};
}) => {
	return (
		<motion.div
			key={service.id}
			className="w-full sm:w-[calc(50%-12px)] md:flex-1 md:min-w-[280px] md:max-w-[350px] bg-background border-2 border-foreground rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
			variants={cardVariants}
			whileHover={{
				scale: 1.02,
				y: -4,
				boxShadow: "6px 6px 0px 0px var(--foreground)",
				transition: { duration: 0.2 },
			}}
			whileTap={{ scale: 0.98 }}
		>
			<div className="w-full h-[200px] relative overflow-hidden group">
				<Image
					src={service.imageWithAlt.src}
					alt={service.imageWithAlt.alt}
					fill
					className="object-cover transition-transform duration-300 group-hover:scale-105"
				/>
			</div>

			{/* Content container */}
			<motion.div
				className="p-4 flex flex-col gap-4 h-[calc(100%-200px)] min-h-[250px]"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ delay: 0.1, duration: 0.4 }}
			>
				<motion.h3
					className="tex-lg sm:text-xl font-primary text-foreground"
					initial={{ opacity: 0, x: -10 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.2, duration: 0.3 }}
				>
					{service.title.rendered}
				</motion.h3>

				<motion.p
					className="text-sm text-muted-foreground flex-grow leading-relaxed"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.3, duration: 0.4 }}
				>
					{service.meta.hero_intro ||
						"Profesjonalne wykonanie tatuaży w najwyższej jakości. Każdy projekt to unikalna realizacja dostosowana do Twoich potrzeb."}
				</motion.p>
				<CardBtn text="Zobacz Więcej" slug={service.slug} />
			</motion.div>
		</motion.div>
	);
};
export default ServicesCard;
