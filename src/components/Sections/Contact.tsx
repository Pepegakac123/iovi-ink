import Subheadline from "../Subheadline";
import ContactForm from "../forms/ContactForm";
import * as motion from "motion/react-client";
import {
	containerVariants,
	formVariants,
	itemVariants,
	stickyContentVariants,
} from "@/lib/variants";
import { ContactProps } from "@/lib/dataTypes";

const Contact = ({ title, subheadline, description }: ContactProps) => {
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
						className="lg:w-1/2 lg:pr-8 lg:sticky lg:top-30 self-start"
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
								<Subheadline title={subheadline} />
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
									className="heading-primary max-w-[600px] capitalize"
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
									{title}
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
									{description}
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
