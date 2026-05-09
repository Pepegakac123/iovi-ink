import SectionHero from "@/components/SectionHero";
import ServiceProcessSection from "@/components/servicePagesComponents/ServiceProcessSection";
import ServiceDistinguishingSection from "@/components/servicePagesComponents/ServiceDistinguishingSection";
import ServiceRoleSection from "@/components/servicePagesComponents/ServiceRoleSelection";
import TargetAudience from "@/components/servicePagesComponents/TargetAudience";
import {
	getAllServices,
	getServiceBySlug,
	getServiceImages,
	JETEngineAPIError,
	mapImagesWithWordPressAlt,
} from "@/lib/jetApi";
import ServiceBenefitsSection from "@/components/servicePagesComponents/ServiceBenefitsSection";
import ServiceWhyMeSection from "@/components/servicePagesComponents/ServiceWhyMeSection";
import ServiceCta from "@/components/servicePagesComponents/serviceCta";
import * as motion from "motion/react-client";
import { containerVariants } from "@/lib/variants";
import Services from "@/components/Sections/Services";
import { servicesHome } from "@/lib/data";
import CarouselSections from "@/components/Sections/CarouselSections";
import ServiceHero from "@/components/servicePagesComponents/ServiceHero";
import { ServicePageProps } from "@/components/servicePagesComponents/servicePage";
import { Metadata } from "next";
import { images } from "@/lib/images";
import { BreadcrumbJsonLd, ImageJsonLd, JsonLdScript } from "next-seo";
import { notFound } from "next/navigation"; // 🔥 Import notFound

export async function generateMetadata({
	params,
}: ServicePageProps): Promise<Metadata> {
	try {
		const { slug } = await params;
		const service = await getServiceBySlug(slug);

		// jeśli jednak zwracasz null w getServiceBySlug
		if (!service) {
			return {
				title: "Usługa nie została znaleziona - iovi-ink",
				description: "Przepraszamy, nie można znaleźć tej usługi tatuażu.",
				robots: "noindex, nofollow",
			};
		}

		const { meta } = service;
		const serviceTitle = service.title.rendered;

		const seoTitle =
			serviceTitle || `${serviceTitle} - Jowita Tatuażystka | IOVI INK`;
		const seoDescription =
			meta.seo_description ||
			`${serviceTitle} - profesjonalne usługi tatuażu. Minimalistyczne i graficzne wzory dostosowane do anatomii.`;

		const keywords = [meta.seo_keyword, "tatuażysta", "tatuaże"];

		return {
			title: seoTitle,
			description: seoDescription,
			keywords: keywords,
			openGraph: {
				title: seoTitle,
				description: seoDescription,
				url: `https://iovi-ink.pl/uslugi/${slug}`,
				type: "website",
				images: [
					{
						url: images.seoBaner.src,
						width: 1200,
						height: 630,
						alt: `${serviceTitle} - ${seoDescription}`,
					},
				],
				siteName: "Iovi-Ink",
			},
			twitter: {
				card: "summary_large_image",
				title: seoTitle,
				description: seoDescription,
				images: images.seoBaner.src,
			},
			alternates: {
				canonical: `https://iovi-ink.pl/uslugi/${slug}`,
			},
			other: {
				"og:locale": "pl_PL",
				"article:author": "Jowita Potaczek",
				"article:section": "Tatuaże",
			},
		};
	} catch (error) {
		if (error instanceof JETEngineAPIError && error.status === 404) {
			return {
				title: "Usługa nie została znaleziona - iovi-ink",
				description: "Przepraszamy, nie można znaleźć tej usługi tatuażu.",
				robots: "noindex, nofollow",
			};
		}
		return {
			title: "Błąd ładowania usługi - iovi-ink",
			description: "Wystąpił problem z załadowaniem tej usługi tatuażu.",
			robots: "noindex, nofollow",
		};
	}
}

export async function generateStaticParams() {
	try {
		const services = await getAllServices();
		return services.map((service) => ({ slug: service.slug }));
	} catch (error) {
		console.error("Error in generateStaticParams:", error);
		return []; // Zwróć pustą tablicę przy błędzie
	}
}

async function Page({ params }: { params: Promise<{ slug: string }> }) {
	try {
		const { slug } = await params;
		const service = await getServiceBySlug(slug);
		const { id, meta, title } = service;
		const cmsImages = await mapImagesWithWordPressAlt(getServiceImages(service));

		// Globalny fallback dla obrazów
		const fallbackImage = {
			src: images.seoBaner.src,
			alt: title.rendered,
		};

		// Upewnij się, że mamy przynajmniej jeden obraz, nawet jeśli CMS jest pusty
		const safeImages =
			cmsImages.length > 0 ? cmsImages : [fallbackImage, fallbackImage];

		return (
			<>
				<BreadcrumbJsonLd
					items={[
						{
							name: "Strona główna",
							item: "https://iovi-ink.pl",
						},
						{
							name: "Usługi",
							item: "https://iovi-ink.pl/uslugi",
						},
						{
							name: title.rendered,
							item: `https://iovi-ink.pl/uslugi/${slug}`,
						},
					]}
				/>
				<ImageJsonLd
					images={safeImages.map((img) => ({
						contentUrl: img.src,
						creator: {
							"@type": "Person",
							name: "Jowita Potaczek",
						},
						creditText: "Jowita Potaczek - IOVI INK",
						copyrightNotice: "© Jowita Potaczek",
					}))}
				/>
				<JsonLdScript
					scriptKey="service-schema"
					data={{
						"@context": "https://schema.org",
						"@type": "Service",
						name: title.rendered,
						description: meta.seo_description,
						serviceType: "Tattoo Services",
						image: safeImages[0]?.src,
						provider: {
							"@type": "Person",
							name: "Jowita Potaczek",
							url: "https://www.iovi-ink.pl",
						},
						areaServed: [
							// ✅ Najbliższe okolice (10-20 km)
							{ "@type": "City", name: "Mszana Dolna" },
							{ "@type": "City", name: "Limanowa" },
							{ "@type": "City", name: "Dobra" },
							{ "@type": "City", name: "Kamienica" },

							// ✅ Średnia odległość (20-40 km)
							{ "@type": "City", name: "Nowy Targ" },
							{ "@type": "City", name: "Rabka-Zdrój" },
							{ "@type": "City", name: "Jordanów" },
							{ "@type": "City", name: "Myślenice" },

							// ✅ Większe miasta (40-100 km) - jeśli faktycznie stamtąd przyjeżdżają
							{ "@type": "City", name: "Nowy Sącz" },
							{ "@type": "City", name: "Kraków" },

							// ✅ Cały region
							{ "@type": "State", name: "Małopolskie" },

							// Polska
							{ "@type": "Country", name: "Polska" },
						],
						availableChannel: {
							"@type": "ServiceChannel",
							serviceUrl: "https://www.iovi-ink.pl/kontakt",
						},
						serviceLocation: {
							"@type": "Place",
							name: "Lewus INK Tattoo&Piercing Mszana Dolna",
							address: {
								"@type": "PostalAddress",
								streetAddress: "Piłsudskiego 8",
								addressLocality: "Mszana Dolna",
								addressRegion: "Małopolskie",
								addressCountry: "PL",
							},
						},
					}}
				/>
				<ServiceHero
					subTitle={meta.hero_subheadline || meta.name}
					title={meta.hero_h1}
					description={meta.hero_intro}
					image={safeImages[0]}
				></ServiceHero>
				<TargetAudience
					title={meta.dla_kogo_h2}
					subtitle={meta.dla_kogo_subheadline || "Dla kogo"}
					targetAudienceDsc={meta.dla_kogo}
					image={safeImages[1] || safeImages[0]}
				/>
				<ServiceRoleSection
					title={meta.rola_uslugi_h2}
					subtitle={meta.rola_uslugi_subheadline || "O usłudze"}
					roleItems={meta.rola_uslugi}
					images={[
						safeImages[2] || safeImages[0], // Trzeci obraz lub fallback
						safeImages[3] || safeImages[1] || safeImages[0], // Czwarty obraz lub fallback
					]}
				/>
				<ServiceBenefitsSection
					title={meta.korzysci_h2}
					subtitle={meta.korzysci_subheadline || "Twoje korzyści"}
					benefits={meta.korzysci}
					image={safeImages[4] || safeImages[0]}
				/>
				<ServiceDistinguishingSection
					title={meta.wyroznienie_h2}
					subtitle={meta.wyroznienie_subheadline || "Nasze wyróżnienie"}
					distinguishingItems={meta.wyroznienie}
					bgVariant="dark"
				/>
				<ServiceProcessSection
					title={meta.proces_h2}
					subtitle={meta.proces_subheadline || "Etapy współpracy"}
					processSteps={meta.proces}
				/>
				<ServiceDistinguishingSection
					title={meta.specjalizacja_h2}
					subtitle={meta.specjalizacja_subheadline || "Specjalizacja"}
					distinguishingItems={meta.specjalizacja_1}
					bgVariant="light"
				/>
				<ServiceWhyMeSection
					title={meta.dlaczego_ja_h2}
					subtitle={meta.dlaczego_ja_subheadline || "Dlaczego ja"}
					whyMeItems={meta.dlaczego_ja}
					image={safeImages[5] || safeImages[0]}
				/>
				<ServiceCta
					title={meta.cta_h2}
					subtitle={meta.cta_subheadline || "Umów się"}
					ctaItems={meta.cta}
				/>
				<motion.section
					className="bg-foreground"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-50px" }}
					variants={containerVariants}
				>
					<Services {...servicesHome} />
				</motion.section>
				<CarouselSections />
			</>
		);
	} catch (error) {
		if (error instanceof JETEngineAPIError && error.status === 404) {
			notFound(); // ładnie przełączy na 404
		}
		throw error; // inne błędy -> faktyczny 500
	}
}

export default Page;
