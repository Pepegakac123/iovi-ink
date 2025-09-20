import Hero from "@/components/Sections/Hero";
import AboutMe from "@/components/Sections/AboutMe";
import Services from "@/components/Sections/Services";
import TargetAudienceSection from "@/components/Sections/TargetAudienceSection";
import Process from "@/components/Sections/Process";
import WhyMe from "@/components/Sections/WhyMe";
import Faq from "@/components/Sections/Faq";
import Contact from "@/components/Sections/Contact";
import * as motion from "motion/react-client";
import { images } from "@/lib/images";
import { lazy, Suspense } from "react";
import {
	aboutMeHome,
	blogHome,
	contactHome,
	faqHome,
	procesHome,
	servicesHome,
	socialLinks,
	targetAudienceHome,
	whyMeHome,
} from "@/lib/data";
import { BreadcrumbJsonLd, FAQPageJsonLd, SocialProfileJsonLd } from "next-seo";
import FeaturedBlogs from "@/components/FeaturedBlogs";
import CarouselSkeleton from "@/components/skeletons/CarouselSkeleton";
const CarouselSections = lazy(
	() => import("@/components/Sections/CarouselSections"),
);

export default async function Home() {
	return (
		<>
			<SocialProfileJsonLd
				useAppDir={true}
				type="Person"
				name="Jowita Potaczek"
				url="https://www.iovi-ink.pl"
				sameAs={[socialLinks.iovi.instagram]}
			/>
			<BreadcrumbJsonLd
				useAppDir={true}
				itemListElements={[
					{
						position: 1,
						name: "Strona główna",
						item: "https://iovi-ink.pl",
					},
				]}
			/>
			<FAQPageJsonLd
				useAppDir={true}
				mainEntity={faqHome.questions.map(({ question, answer }) => ({
					questionName: question,
					acceptedAnswerText: answer,
				}))}
			/>
			<Hero
				subTitle="Od minimalistycznych lini po złożone kompozycje"
				title="Tatuaże z charakterem i głową"
				description={
					<>
						Każdy projekt tworzę jako autorską kompozycję. Moje tatuaże to
						przemyślane dzieła dostosowane do Twojej anatomii, stylu i tego, jak
						chcesz się czuć ze swoim tatuażem przez następne lata. Pracuję w
						studiu{" "}
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
			<Suspense fallback={<CarouselSkeleton />}>
				<CarouselSections />
			</Suspense>
			<section className="visibility-auto">
				<AboutMe {...aboutMeHome} />
			</section>
			<section className="bg-foreground mt-16 visibility-auto">
				<Services {...servicesHome} />
			</section>
			<section className="bg-primary-foreground visibility-auto">
				<TargetAudienceSection {...targetAudienceHome} />
			</section>
			<section className="visibility-auto">
				<Process {...procesHome} />
			</section>
			<section className="bg-foreground mt-16 visibility-auto">
				<WhyMe {...whyMeHome} />
			</section>
			<section className="bg-primary-foreground visibility-auto">
				<FeaturedBlogs {...blogHome} />
			</section>
			<section className="visibility-auto">
				<Faq {...faqHome} />
			</section>

			<section className="visibility-auto">
				<Contact {...contactHome} />
			</section>
		</>
	);
}
