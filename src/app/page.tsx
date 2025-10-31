import Hero from "@/components/Sections/Hero";

import * as motion from "motion/react-client";
import { images } from "@/lib/images";
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
import {
	BreadcrumbJsonLd,
	FAQJsonLd,
	JsonLdScript,
	processors,
	ProfilePageJsonLd,
} from "next-seo";
import FeaturedBlogs from "@/components/FeaturedBlogs";
import CarouselSkeleton from "@/components/skeletons/CarouselSkeleton";
import dynamic from "next/dynamic";

// Załóżmy, że masz też prosty szkielet dla bloku
const SectionSkeleton = () => <div className="h-96 w-full bg-muted/50" />;

const DynamicCarousel = dynamic(
	() => import("@/components/Sections/CarouselSections"),
	{
		// Użyj swojego szkieletu karuzeli
		loading: () => <CarouselSkeleton />,
		// Opcjonalnie: nie ładuj na serwerze, jeśli to tylko klient
		// ssr: false,
	},
);

const DynamicFaq = dynamic(() => import("@/components/Sections/Faq"), {
	loading: () => <SectionSkeleton />,
});

const DynamicFeaturedBlogs = dynamic(
	() => import("@/components/FeaturedBlogs"),
	{
		loading: () => <SectionSkeleton />,
	},
);

const DynamicContact = dynamic(() => import("@/components/Sections/Contact"), {
	loading: () => <SectionSkeleton />,
});

const DynamicAboutMe = dynamic(() => import("@/components/Sections/AboutMe"), {
	loading: () => <SectionSkeleton />,
});
const DynamicServices = dynamic(
	() => import("@/components/Sections/Services"),
	{ loading: () => <SectionSkeleton /> },
);
const DynamicTargetAudience = dynamic(
	() => import("@/components/Sections/TargetAudienceSection"),
	{ loading: () => <SectionSkeleton /> },
);
const DynamicProcess = dynamic(() => import("@/components/Sections/Process"), {
	loading: () => <SectionSkeleton />,
});
const DynamicWhyMe = dynamic(() => import("@/components/Sections/WhyMe"), {
	loading: () => <SectionSkeleton />,
});

export default async function Home() {
	return (
		<>
			<ProfilePageJsonLd
				mainEntity={{
					"@type": "Person",
					name: "Jowita Potaczek",
					url: "https://www.iovi-ink.pl",
					sameAs: [socialLinks.iovi.instagram],
				}}
			/>
			<JsonLdScript
				scriptKey="person-detailed-schema"
				data={{
					"@context": "https://schema.org",
					"@type": "Person",
					name: "Jowita Potaczek",
					alternateName: "Jowita - iovi.ink",
					jobTitle: "Tatuażystka",
					description:
						"Tatuażystka specjalizująca się w delikatnych tatuażach damskich, minimalistycznych i graficznych wzorach.",
					url: "https://www.iovi-ink.pl",
					image: images.zblizenie_na_twarz_patrzy_na_wprost.src,
					sameAs: [socialLinks.iovi.instagram, "https://www.iovi-ink.pl"],
					worksFor: {
						"@type": "LocalBusiness",
						name: "Lewus INK Tattoo&Piercing Mszana Dolna",
						url: socialLinks.lewus.googleMaps,
						address: processors.processAddress({
							"@type": "PostalAddress",
							streetAddress: "Piłsudskiego 8",
							addressLocality: "Mszana Dolna",
							addressRegion: "Małopolskie",
							addressCountry: "PL",
						}),
					},
					knowsAbout: [
						"Tatuaże minimalistyczne",
						"Fine line tattoo",
						"Delikatne tatuaże damskie",
					],
				}}
			/>
			<BreadcrumbJsonLd
				items={[
					{
						name: "Strona główna",
						item: "https://iovi-ink.pl",
					},
				]}
			/>
			<FAQJsonLd
				questions={faqHome.questions.map(({ question, answer }) => ({
					question: question,
					answer: answer,
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
			<DynamicCarousel />
			<section className="visibility-auto">
				<DynamicAboutMe {...aboutMeHome} />
			</section>
			<section className="bg-foreground mt-16 visibility-auto">
				<DynamicServices {...servicesHome} />
			</section>
			<section className="bg-primary-foreground visibility-auto">
				<DynamicTargetAudience {...targetAudienceHome} />
			</section>
			<section className="visibility-auto">
				<DynamicProcess {...procesHome} />
			</section>
			<section className="bg-foreground mt-16 visibility-auto">
				<DynamicWhyMe {...whyMeHome} />
			</section>
			<section className="bg-primary-foreground visibility-auto">
				<DynamicFeaturedBlogs {...blogHome} />
			</section>
			<section className="visibility-auto">
				<DynamicFaq {...faqHome} />
			</section>

			<section className="visibility-auto">
				<DynamicContact {...contactHome} />
			</section>
		</>
	);
}
