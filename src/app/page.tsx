import Hero from "@/components/Sections/Hero";
import CarouselSections from "@/components/Sections/CarouselSections";
import AboutMe from "@/components/Sections/AboutMe";
import Services from "@/components/Sections/Services";
import TargetAudienceSection from "@/components/Sections/TargetAudienceSection";
import Process from "@/components/Sections/Process";
import WhyMe from "@/components/Sections/WhyMe";
import Faq from "@/components/Sections/Faq";
import Contact from "@/components/Sections/Contact";
import * as motion from "motion/react-client";
import { socialLinks } from "@/Assets";
import { images } from "@/lib/images";

export default async function Home() {
	return (
		<>
			<Hero
				subTitle="Od minimalistycznych lini po złożone kompozycje"
				title="Tatuaże z charakterem i głową"
				description={
					<>
						Każdy projekt tworzę jako autorską kompozycję, nie kopię z
						Pinterest. Moje tatuaże to przemyślane dzieła dostosowane do Twojej
						anatomii, stylu i tego, jak chcesz się czuć ze swoim tatuażem przez
						następne lata. Pracuję w studiu{" "}
						<motion.a
							href={socialLinks.lewus.googleMaps}
							rel="noopener noreferrer"
							target="_blank"
							className=" text-primary hover:text-accent transition-colors duration-300"
							whileHover={{ scale: 1.02 }}
						>
							Lewus Ink
						</motion.a>{" "}
						w Mszanie Dolnej, gdzie mam idealne warunki do precyzyjnej
						realizacji każdego projektu.
					</>
				}
				image={images.bab_z_maszynkom}
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
			<section>
				<Contact />
			</section>
		</>
	);
}
