import Image from "next/image";
import * as motion from "motion/react-client";
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
				transition: { duration: 0.15 }, // Szybki transition
			}}
			whileTap={{ scale: 0.98 }}
		>
			<motion.div
				initial={{ rotate: -10, scale: 0.8 }}
				animate={{ rotate: 0, scale: 1 }}
				transition={{
					duration: 0.5,
					delay: delay + 0.2,
					ease: "easeOut",
				}}
				whileHover={{ rotate: 5 }}
			>
				<Image
					src={icon}
					alt="Ikonka"
					width={64}
					height={64}
					className="text-foreground"
				/>
			</motion.div>
			<motion.div
				className="text-foreground text-base font-text"
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
