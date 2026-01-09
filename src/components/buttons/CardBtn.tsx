import Link from "next/link";
import * as motion from "motion/react-client";

const CardBtn = ({ text, slug }: { text: string; slug: string }) => {
	return (
		<motion.div
			className="mt-auto"
			initial={{ opacity: 0, y: 10 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay: 0.4, duration: 0.3 }}
		>
			<Link href={`/uslugi/${slug}`}>
				<motion.button
					type="button"
					className="uppercase cursor-pointer font-primary text-sm md:text-base w-full bg-primary text-primary-foreground py-3 px-4 rounded-md font-medium border-2 border-foreground hover:bg-accent transition-all duration-200 shadow-[2px_2px_0px_0px_theme(colors.foreground)] lg:hover:scale-105 lg:hover:shadow-[4px_4px_0px_0px_var(--foreground)] active:scale-98"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{
						duration: 0.4,
						ease: "easeOut",
					}}
				>
					{text}
				</motion.button>
			</Link>
		</motion.div>
	);
};
export default CardBtn;
