import * as motion from "motion/react-client";
import React from "react";

const Subheadline = ({ title }: { title: string }) => {
	return (
		<motion.div
			className="bg-background border-1 border-accent rounded-md px-2 py-2 sm:px-4 lg:py-4 lg:px-8 te flex items-center justify-center w-fit"
			initial={{ opacity: 0, scale: 0.98, y: -6 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			transition={{
				duration: 0.6,
				ease: "easeOut",
			}}
			whileHover={{
				y: -6,
				scale: 1.02,
				rotate: -0.25,
				transition: { duration: 0.22, ease: "easeOut" },
			}}
			whileFocus={{
				// podobne zachowanie dla dostępności (klawiatury)
				y: -4,
				scale: 1.01,
				transition: { duration: 0.18 },
			}}
			style={{ willChange: "transform, box-shadow, background-color" }}
		>
			<motion.h3
				className="text-base md:text-xl font-primary text-center text-foreground"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3, duration: 0.4 }}
				whileHover={{
					// delikatna animacja tekstu na hover (nie button-like)
					letterSpacing: "0.02em",
					color: "var(--foreground)", // możesz zmienić na np. slightly lighter color
					transition: { duration: 0.22, ease: "easeOut" },
				}}
			>
				{title}
			</motion.h3>
		</motion.div>
	);
};
export default Subheadline;
