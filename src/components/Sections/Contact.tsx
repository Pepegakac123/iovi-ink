import Subheadline from "../Subheadline";
import * as motion from "motion/react-client";
import { Variants } from "motion";
import ContactForm from "../Form/ContactForm";

const Contact = () => {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
				delayChildren: 0.2,
			},
		},
	} as Variants;

	const contentVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	} as Variants;

	const paragraphVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: "easeOut",
			},
		},
	} as Variants;

	return (
		<motion.div
			className="container"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={containerVariants}
		>
			<motion.div
				className="bg-transparent border-1 border-foreground rounded-md px-4 py-8 lg:py-8 lg:px-8 flex flex-col lg:flex-row gap-8 w-full lg:items-center relative overflow-hidden"
				whileHover={{
					boxShadow: "6px 6px 0px 0px var(--foreground)",
					transition: { duration: 0.3 },
				}}
				variants={contentVariants}
			>
				{/* Content Section */}
				<motion.div
					className="gap-4 flex flex-col lg:flex-1"
					variants={contentVariants}
				>
					<motion.div variants={paragraphVariants}>
						<Subheadline title="Napisz – pogadamy o szczegółach" />
					</motion.div>
					<motion.div
						className="flex flex-col gap-4"
						variants={paragraphVariants}
						whileHover={{
							scale: 1.02,
							transition: { duration: 0.2 },
						}}
					>
						<motion.h2 className="text-2xl md:text-4xl text-foreground font-primary capitalize max-w-[600px]">
							Gotowy na Rozmowę o Twoim Projekcie?
						</motion.h2>
						<motion.p className="text-base text-foreground max-w-[600px]">
							Marzysz o unikalnym tatuażu? Jestem tutaj, żeby tchnąć życie w
							Twoje pomysły. Pierwsza rozmowa jest zawsze bezpłatna. Opowiesz mi
							o swojej wizji, ja pokażę swoje prace i ustalimy, czy to ma sens.
						</motion.p>
					</motion.div>
				</motion.div>

				<div className="lg:flex lg:flex-1">
					<ContactForm />
				</div>
			</motion.div>
		</motion.div>
	);
};

export default Contact;
