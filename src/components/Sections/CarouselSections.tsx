import {
	getImageCarouselBySlug,
	mapImagesWithWordPressAlt,
} from "@/lib/jetApi";
import Subheadline from "../Subheadline";
import { CardCarousel } from "@/components/ui/card-carousel";
import CTASection from "./CTASection";
import * as motion from "motion/react-client";
import {
	carouselVariants,
	containerVariantsLong,
	itemVariants,
} from "@/lib/variants";

export default async function CarouselSections() {
	const rawImages = await getImageCarouselBySlug("tatuaze");
	const images = await mapImagesWithWordPressAlt(rawImages.meta.zdjecia);

	return (
		<motion.div
			className="w-full bg-background py-20 md:py-24 flex flex-col gap-12"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={containerVariantsLong}
		>
			<motion.div
				className="flex flex-col gap-4 md:gap-8 max-w-[1240px] mx-auto px-4 md:px-8 items-center justify-center"
				variants={containerVariantsLong}
			>
				<motion.div variants={itemVariants}>
					<Subheadline title="Każdy projekt to unikalna historia" />
				</motion.div>

				<motion.h2
					className="heading-primary-center"
					variants={itemVariants}
					whileHover={{
						scale: 1.02,
						transition: { duration: 0.2 },
					}}
				>
					Portfolio Moich Tatuaży
				</motion.h2>

				<motion.p
					className="paragraph-center-constrained"
					variants={itemVariants}
				>
					W portfolio znajdziesz różnorodność stylów i technik – od delikatnych
					kobiecych wzorów po bardziej wyraziste tatuaże. Specjalizuję się w
					fine line, minimalistycznych kompozycjach i graficznych wzorach.
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
