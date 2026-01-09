import * as motion from "motion/react-client";
import Link from "next/link";

const SecondaryBtn = ({ text, link }: { text: string; link: string }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.4,
				ease: "easeOut",
			}}
		>
			<Link href={link}>
				<motion.button
					className="bg-secondary hover:bg-muted cursor-pointer text-foreground font-primary text-base md:text-lg w-full md:w-fit px-4 md:px-8 py-3 md:py-4 uppercase border-1 border-foreground rounded-md transition-all duration-200 lg:hover:scale-105 lg:hover:shadow-[4px_4px_0px_0px_var(--foreground)] active:scale-98"
				>
					{text}
				</motion.button>
			</Link>
		</motion.div>
	);
};

export default SecondaryBtn;
