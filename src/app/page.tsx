import Hero from "@/components/Hero";
import images from "@/Assets/images";
import CarouselSections from "@/components/CarouselSections";
export default async function Home() {
	return (
		<>
		<Hero
			subTitle="Od minimalistycznych lini po złożone kompozycje"
			title="Tatuaże z charakterem i głową"
			description="W studio Lewus Ink każdy projekt to autorska kompozycja, nie kopia z Pinterest. Moje tatuaże to przemyślane dzieła dostosowane do Twojej anatomii, stylu i tego, jak chcesz się czuć ze swoim tatuażem przez następne lata."
			image={images.hero}
		/>
		<CarouselSections />
		</>
	);
}
