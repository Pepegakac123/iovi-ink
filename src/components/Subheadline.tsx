import * as motion from "motion/react-client";
import React from "react";

interface SubheadlineProps {
	title: string;
	className?: string;
	disableHover?: boolean; // ✅ Opcja wyłączenia hover dla parent containers
}

const Subheadline: React.FC<SubheadlineProps> = ({
	title,
	className = "",
	disableHover = false,
}) => {
	return (
		<motion.div
			className={`
        bg-background border-1 border-accent rounded-md 
        px-2 py-2 sm:px-4 lg:py-4 lg:px-8 
        flex items-center justify-center w-fit
        ${className}
      `}
			initial={{ opacity: 0, scale: 0.98, y: -6 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			transition={{
				duration: 0.6,
				ease: "easeOut",
			}}
			// ✅ Conditional hover - nie nakładaj jeśli parent ma hover
			whileHover={
				disableHover
					? undefined
					: {
							y: -6,
							scale: 1.02,
							rotate: -0.25,
							transition: { duration: 0.22, ease: "easeOut" },
						}
			}
			whileFocus={
				disableHover
					? undefined
					: {
							y: -4,
							scale: 1.01,
							transition: { duration: 0.18 },
						}
			}
			// ✅ Optymalizacja dla production build
			style={{
				willChange: disableHover ? "auto" : "transform",
				transformOrigin: "center center",
			}}
		>
			<motion.h3
				className="text-base md:text-xl font-primary text-center text-foreground"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.3, duration: 0.4 }}
				// ✅ Uproszczona animacja tekstu - bez konfliktów
				whileHover={
					disableHover
						? undefined
						: {
								letterSpacing: "0.01em", // Zmniejszone z 0.02em
								transition: { duration: 0.22, ease: "easeOut" },
							}
				}
			>
				{title}
			</motion.h3>
		</motion.div>
	);
};

export default Subheadline;
