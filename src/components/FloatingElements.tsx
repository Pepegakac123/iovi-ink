import * as motion from "motion/react-client";
type FloatingElementsProps = {
	variant: "hero" | "card";
};
const heroVariant = () => {
	return (
		<>
			<motion.div
				className="absolute top-8 right-8 w-4 h-4 bg-accent border-2 border-foreground rounded-full"
				animate={{
					x: [0, 10, 0],
					y: [0, -10, 0],
					rotate: [0, 180, 360],
				}}
				transition={{
					duration: 6,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			<motion.div
				className="absolute bottom-20 left-8 w-3 h-3 bg-primary border-2 border-foreground transform rotate-45"
				animate={{
					x: [0, -8, 0],
					y: [0, 8, 0],
					rotate: [45, 225, 405],
				}}
				transition={{
					duration: 5,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 1,
				}}
			/>

			<motion.div
				className="absolute top-32 left-12 w-2 h-2 bg-secondary border-2 border-foreground rounded-full"
				animate={{
					scale: [1, 1.5, 1],
					opacity: [0.7, 1, 0.7],
				}}
				transition={{
					duration: 3,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 0.5,
				}}
			/>
		</>
	);
};
const cardVariant = () => {
	return (
		<>
			<motion.div
				className="absolute top-4 right-4 w-3 h-3 bg-accent border-2 border-foreground rounded-full"
				animate={{
					x: [0, 8, 0],
					y: [0, -8, 0],
					rotate: [0, 180, 360],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			<motion.div
				className="absolute bottom-4 left-4 w-2 h-2 bg-primary border-2 border-foreground transform rotate-45"
				animate={{
					x: [0, -6, 0],
					y: [0, 6, 0],
					rotate: [45, 225, 405],
				}}
				transition={{
					duration: 6,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 1.5,
				}}
			/>
		</>
	);
};

const FloatingElements = ({ variant }: FloatingElementsProps) => {
	return <>{variant === "hero" ? heroVariant() : cardVariant()}</>;
};
export default FloatingElements;
