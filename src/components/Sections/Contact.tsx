import Image from "next/image";
import Subheadline from "../Subheadline";
import images from "@/Assets/images";
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

	const imageVariants = {
		hidden: { opacity: 0, scale: 0.9, x: 20 },
		visible: {
			opacity: 1,
			scale: 1,
			x: 0,
			transition: {
				duration: 0.8,
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
				className="bg-transparent border-1 border-foreground rounded-md px-4 pt-4 lg:py-8 lg:px-8 flex flex-col lg:flex-row gap-4 w-full lg:items-center relative overflow-hidden"
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

					<motion.h2
						className="text-2xl md:text-4xl text-foreground font-primary capitalize"
						variants={paragraphVariants}
						whileHover={{
							scale: 1.02,
							transition: { duration: 0.2 },
						}}
					>
						Gotowy na Rozmowę o Twoim Projekcie?
					</motion.h2>

					<motion.p
						className="text-base text-foreground max-w-[600px]"
						variants={paragraphVariants}
					>
						Marzysz o unikalnym tatuażu? Jestem tutaj, żeby tchnąć życie w Twoje
						pomysły. Pierwsza rozmowa jest zawsze bezpłatna. Opowiesz mi o
						swojej wizji, ja pokażę swoje prace i ustalimy, czy to ma sens.
					</motion.p>

					{/* Mobile Image - positioned at bottom right */}
					<motion.div
						className="flex justify-end lg:hidden"
						variants={imageVariants}
					>
						<motion.div
							whileHover={{
								scale: 1.05,
								rotate: 1,
								transition: { duration: 0.3 },
							}}
							whileTap={{ scale: 0.98 }}
						>
							<Image
								src={images.about}
								alt="Jowita - Artystka Tatuażu"
								width={189}
								height={189}
								className="object-cover rounded-md"
							/>
						</motion.div>
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
