import Hero from "@/components/Sections/Hero";
import images from "@/Assets/images";
import CarouselSections from "@/components/Sections/CarouselSections";
import AboutMe from "@/components/Sections/AboutMe";
import Services from "@/components/Sections/Services";
import TargetAudienceSection from "@/components/Sections/TargetAudienceSection";
import Process from "@/components/Sections/Process";
import WhyMe from "@/components/Sections/WhyMe";
import Faq from "@/components/Sections/Faq";
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
			<section>
				<AboutMe />
			</section>
			<section className="bg-foreground mt-16">
				<Services />
			</section>
			<section className="bg-primary-foreground">
				<TargetAudienceSection />
			</section>
			<section>
				<Process />
			</section>
			<section className="bg-foreground mt-16">
				<WhyMe />
			</section>
			<section>
				<Faq />
			</section>
		</>
	);
}
