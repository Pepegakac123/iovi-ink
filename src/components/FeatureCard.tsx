import Image from "next/image";
import * as motion from "motion/react-client";
import { iconVariantsSimple } from "@/lib/variants";

interface FeatureProps {
	icon: string;
	text: string;
	delay?: number;
}

const FeatureCard = ({ icon, text, delay = 0 }: FeatureProps) => {
	return (
		<motion.div
			className="p-4 flex flex-row gap-4 bg-background border-foreground border-1 border-b-4 border-r-4 rounded-md cursor-pointer items-center"
			initial={{ opacity: 0, y: 30, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{
				duration: 0.3,
				ease: "easeOut",
			}}
			whileHover={{
				scale: 1.02,
				y: -2,
				backgroundColor: "var(--muted)",
				boxShadow: "6px 6px 0px 0px var(--foreground)",
				transition: { duration: 0.15 },
			}}
			whileTap={{ scale: 0.98 }}
		>
			{/* Ikona w stylu ProcessCard, ale mniejsza */}
			<motion.div
				className="w-10 h-10 md:w-14 md:h-14 flex-shrink-0"
				variants={iconVariantsSimple}
				initial="hidden"
				animate="visible"
				whileHover={{
					scale: 1.1,
					rotate: 5,
					transition: { duration: 0.2 },
				}}
			>
				<motion.div
					className="w-full h-full bg-transparent border-1 border-foreground rounded-full flex items-center justify-center"
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
							src={icon}
							alt={`${text} - ikona`}
							width={24}
							height={24}
							className="w-5 h-5 md:w-6 md:h-6"
						/>
					</motion.div>
				</motion.div>
			</motion.div>

			{/* Tekst */}
			<motion.div
				className="paragraph-base font-text"
				initial={{ opacity: 0, x: -10 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{
					duration: 0.4,
					delay: delay + 0.1,
				}}
			>
				{text}
			</motion.div>
		</motion.div>
	);
};

export default FeatureCard;
