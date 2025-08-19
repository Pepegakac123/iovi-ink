"use client";
import Subheadline from "../Subheadline";
import ContactForm from "../Form/ContactForm";
import * as motion from "motion/react-client";
import { Variants } from "motion";

const Contact = () => {
	// Motion variants matching the project style
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.1,
			},
		},
	} as Variants;

	const itemVariants = {
		hidden: {
			opacity: 0,
			y: 40,
			scale: 0.95,
		},
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.8,
				ease: "easeOut",
			},
		},
	} as Variants;

	const stickyContentVariants = {
		hidden: {
			opacity: 0,
			x: -50,
		},
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.8,
				ease: "easeOut",
				delay: 0.2,
			},
		},
	} as Variants;

	const formVariants = {
		hidden: {
			opacity: 0,
			x: 50,
		},
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.8,
				ease: "easeOut",
				delay: 0.4,
			},
		},
	} as Variants;

	return (
		<motion.div
			className="container"
			initial="hidden"
			animate="visible"
			variants={containerVariants}
		>
			<motion.div
				className="bg-transparent border-1 border-foreground rounded-md px-4 py-8 lg:py-8 lg:px-8 w-full relative transition-shadow duration-300"
				variants={itemVariants}
				whileHover={{
					boxShadow: "6px 6px 0px 0px var(--foreground)",
					scale: 1.01,
					transition: { duration: 0.2 },
				}}
			>
				{/* Flex layout z items-start */}
				<div className="flex flex-col lg:flex-row gap-8 lg:items-start">
					{/* Content Column - sticky content */}
					<motion.div
						className="lg:w-1/2 lg:pr-8 lg:sticky top-8 self-start"
						variants={stickyContentVariants}
					>
						<div className="gap-4 flex flex-col">
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{
									opacity: 1,
									scale: 1,
									transition: {
										duration: 0.6,
										delay: 0.3,
										ease: "easeOut",
									},
								}}
							>
								<Subheadline title="Napisz – pogadamy o szczegółach" />
							</motion.div>

							<motion.div
								className="flex flex-col gap-4 transition-transform duration-200"
								whileHover={{
									scale: 1.05,
									transition: { duration: 0.2 },
								}}
								initial={{ opacity: 0, y: 20 }}
								animate={{
									opacity: 1,
									y: 0,
									transition: {
										duration: 0.6,
										delay: 0.5,
										ease: "easeOut",
									},
								}}
							>
								<motion.h2
									className="text-2xl md:text-4xl text-foreground font-primary capitalize max-w-[600px]"
									initial={{ opacity: 0, y: 30 }}
									animate={{
										opacity: 1,
										y: 0,
										transition: {
											duration: 0.8,
											delay: 0.6,
											ease: "easeOut",
										},
									}}
								>
									Gotowy na Rozmowę o Twoim Projekcie?
								</motion.h2>

								<motion.p
									className="text-base text-foreground max-w-[600px]"
									initial={{ opacity: 0, y: 20 }}
									animate={{
										opacity: 1,
										y: 0,
										transition: {
											duration: 0.8,
											delay: 0.8,
											ease: "easeOut",
										},
									}}
								>
									Marzysz o unikalnym tatuażu? Jestem tutaj, żeby tchnąć życie w
									Twoje pomysły. Pierwsza rozmowa jest zawsze bezpłatna.
									Opowiesz mi o swojej wizji, ja pokażę swoje prace i ustalimy,
									czy to ma sens.
								</motion.p>
							</motion.div>
						</div>
					</motion.div>

					{/* Form Section */}
					<motion.div
						className="lg:w-1/2 lg:flex-shrink-0"
						variants={formVariants}
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{
								opacity: 1,
								scale: 1,
								transition: {
									duration: 0.8,
									delay: 0.6,
									ease: "easeOut",
								},
							}}
						>
							<ContactForm />
						</motion.div>
					</motion.div>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default Contact;
