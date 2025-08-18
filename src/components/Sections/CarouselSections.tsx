import {
	getImageCarouselBySlug,
	mapImagesWithWordPressAlt,
} from "@/lib/jetApi";
import Subheadline from "../Subheadline";
import { CardCarousel } from "@/components/ui/card-carousel";
import CTASection from "./CTASection";
import * as motion from "motion/react-client";
import { Variants } from "motion";

export default async function CarouselSections() {
	const rawImages = await getImageCarouselBySlug("tatuaze");
	const images = await mapImagesWithWordPressAlt(rawImages.meta.zdjecia);

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

	const itemVariants = {
		hidden: { opacity: 0, y: 30, scale: 0.95 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	} as Variants;

	const carouselVariants = {
		hidden: { opacity: 0, y: 40 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
				ease: "easeOut",
			},
		},
	} as Variants;

	return (
		<motion.div
			className="w-full bg-background py-20 md:py-24 flex flex-col gap-12"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={containerVariants}
		>
			<motion.div
				className="flex flex-col gap-4 md:gap-8 max-w-[1240px] mx-auto px-4 md:px-8 items-center justify-center"
				variants={containerVariants}
			>
				<motion.div variants={itemVariants}>
					<Subheadline title="Każdy projekt to unikalna historia" />
				</motion.div>

				<motion.h2
					className="text-2xl md:text-4xl text-foreground font-primary text-center"
					variants={itemVariants}
					whileHover={{
						scale: 1.02,
						transition: { duration: 0.2 },
					}}
				>
					Portfolio Moich Tatuaży
				</motion.h2>

				<motion.p
					className="text-base text-foreground text-center max-w-[800px]"
					variants={itemVariants}
				>
					W portfolio znajdziesz różnorodność stylów i technik – od delikatnej
					ważki na ramieniu po bardziej wyraziste projekty jak patchwork kobiety
					z motylem. Specjalizuję się w fine line, minimalistycznych
					kompozycjach i graficznych wzorach.
				</motion.p>
			</motion.div>

			<motion.div
				variants={carouselVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: "-50px" }}
			>
				<CardCarousel
					images={images}
					autoplayDelay={2000}
					showPagination={true}
				/>
			</motion.div>

			<motion.div
				variants={itemVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: "-50px" }}
			>
				<CTASection />
			</motion.div>
		</motion.div>
	);
}
