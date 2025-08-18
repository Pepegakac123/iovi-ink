import * as motion from "motion/react-client";
import PrimaryBtn from "../buttons/PrimaryBtn";
import SecondaryBtn from "../buttons/SecondaryBtn";
import { Variants } from "motion";

const CTASection = () => {
	const containerVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
				staggerChildren: 0.2,
				delayChildren: 0.1,
			},
		},
	} as Variants;

	const itemVariants = {
		hidden: { opacity: 0, y: 20, scale: 0.95 },
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

	return (
		<motion.div
			className="flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-center px-4 md:px-8"
			initial="hidden"
			animate="visible"
			variants={containerVariants}
		>
			<motion.div variants={itemVariants} className="w-full md:w-fit">
				<SecondaryBtn text="Zobacz Portfolio" link="/portfolio" />
			</motion.div>
			<motion.div variants={itemVariants} className="w-full md:w-fit">
				<PrimaryBtn />
			</motion.div>
		</motion.div>
	);
};

export default CTASection;
