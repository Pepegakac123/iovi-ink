import {
	getImageCarouselBySlug,
	mapImagesWithWordPressAlt,
} from "@/lib/jetApi";
import Subheadline from "../Subheadline";
import { CardCarousel } from "@/components/ui/card-carousel";
import CTASection from "./CTASection";

export default async function CarouselSections() {
	const rawImages = await getImageCarouselBySlug("tatuaze");
	const images = await mapImagesWithWordPressAlt(rawImages.meta.zdjecia);

	return (
		<div className="w-full bg-background py-20 md:py-24 flex flex-col gap-12">
			<div className="flex flex-col gap-4 md:gap-8 max-w-[1240px] mx-auto px-4 md:px-8 items-center justify-center">
				<Subheadline title="Każdy projekt to unikalna historia" />
				<h2 className="text-2xl md:text-4xl text-foreground font-primary text-center">
					Portfolio Moich Tatuaży
				</h2>
				<p className="text-base text-foreground text-center max-w-[800px]">
					W portfolio znajdziesz różnorodność stylów i technik – od delikatnej
					ważki na ramieniu po bardziej wyraziste projekty jak patchwork kobiety
					z motylem. Specjalizuję się w fine line, minimalistycznych
					kompozycjach i graficznych wzorach.
				</p>
			</div>
			<CardCarousel
				images={images}
				autoplayDelay={2000}
				showPagination={true}
			/>
			<CTASection />
		</div>
	);
}
