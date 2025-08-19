import Image from "next/image";
import Subheadline from "../Subheadline";
import images from "@/Assets/images";
import * as motion from "motion/react-client";
import { Variants } from "motion";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { homeFAQ } from "@/Assets/index.js";

const Faq = () => {
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

	return (
		<motion.div
			className="container"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={containerVariants}
		>
			<motion.div
				className="bg-transparent border-1 border-foreground rounded-md px-4 py-4 lg:py-8 lg:px-8 flex flex-col lg:flex-row gap-6 lg:gap-8 w-full relative overflow-hidden"
				whileHover={{
					boxShadow: "6px 6px 0px 0px var(--foreground)",
					transition: { duration: 0.3 },
				}}
				variants={contentVariants}
			>
				{/* ✅ FAQ SEKCJA - 50% szerokości */}
				<motion.div
					className="flex flex-col gap-4 lg:gap-6 lg:flex-1"
					variants={contentVariants}
				>
					<Subheadline title="FAQ" />
					<Accordion type="single" collapsible className="w-full">
						{homeFAQ.map((item) => {
							return (
								<AccordionItem value={item.question} key={item.id}>
									<AccordionTrigger>{item.question}</AccordionTrigger>
									<AccordionContent>{item.answer}</AccordionContent>
								</AccordionItem>
							);
						})}
					</Accordion>
				</motion.div>

				{/* ✅ KONTENER ZDJĘCIA - 50% szerokości, zdjęcie wyrównane do prawej */}
				<motion.div
					className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end"
					variants={imageVariants}
				>
					<motion.div
						whileHover={{
							scale: 1.03,
							transition: { duration: 0.4 },
						}}
						whileTap={{ scale: 0.98 }}
						className="relative"
					>
						<Image
							src={images.faq}
							alt="Jowita - Artystka Tatuażu"
							width={380}
							height={380}
							className="object-cover rounded-md max-w-[380px] h-auto"
							sizes="(min-width: 1024px) 380px, 0px"
						/>
					</motion.div>
				</motion.div>

				{/* Decorative floating elements */}
				<motion.div
					className="absolute top-4 right-4 w-3 h-3 bg-accent border-2 border-foreground rounded-full"
					animate={{
						x: [0, 8, 0],
						y: [0, -8, 0],
						rotate: [0, 180, 360],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>

				<motion.div
					className="absolute bottom-4 left-4 w-2 h-2 bg-primary border-2 border-foreground transform rotate-45"
					animate={{
						x: [0, -6, 0],
						y: [0, 6, 0],
						rotate: [45, 225, 405],
					}}
					transition={{
						duration: 6,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 1.5,
					}}
				/>
			</motion.div>
		</motion.div>
	);
};

export default Faq;
