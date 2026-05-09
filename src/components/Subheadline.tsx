// src/components/Subheadline.tsx - Wersja bez animacji
import React from "react";

interface SubheadlineProps {
	title: string;
	className?: string;
	disableHover?: boolean; // Zachowane dla kompatybilności, ale nieaktywne
}

const Subheadline: React.FC<SubheadlineProps> = ({
	title,
	className = "",
	disableHover = false,
}) => {
	return (
		<div
			className={`
        bg-background border-1 border-accent rounded-md 
        px-2 py-2 sm:px-4 lg:py-4 lg:px-8 
        flex items-center justify-center w-fit
        ${className}
      `}
		>
			<span className="text-base md:text-xl font-primary text-center text-foreground">
				{title}
			</span>
		</div>
	);
};

export default Subheadline;
