import { ICONS } from "@/lib/icons";
import * as motion from "motion/react-client";
import Image from "next/image";

interface InstagramBtnProps {
	text: string;
	link: string;
	className?: string;
}

const InstagramBtn = ({ text, link, className = "" }: InstagramBtnProps) => {
	return (
		<motion.div
			className={`w-full${className}`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.4,
				ease: "easeOut",
			}}
		>
			<motion.a
				href={link}
				target="_blank"
				rel="noopener noreferrer"
				className="inline-block w-full"
			>
				<motion.button
					type="button"
					className="bg-secondary hover:bg-muted cursor-pointer text-foreground font-primary text-base md:text-lg w-full px-4 md:px-8 py-4 uppercase border-2 border-foreground rounded-md flex items-center justify-center gap-3 group transition-all duration-200 lg:hover:scale-105 lg:hover:shadow-[4px_4px_0px_0px_var(--foreground)] active:scale-98"
				>
					<span>{text}</span>
					<div className="flex items-center justify-center transition-transform duration-200 lg:group-hover:rotate-12 lg:group-hover:scale-110">
						<Image
							src={ICONS.instagram}
							alt="Instagram"
							width={32}
							height={32}
							className="group-hover:filter group-hover:brightness-110"
						/>
					</div>
				</motion.button>
			</motion.a>
		</motion.div>
	);
};

export default InstagramBtn;
