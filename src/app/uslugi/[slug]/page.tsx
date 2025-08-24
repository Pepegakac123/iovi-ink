export const dynamicParams = false;

import SectionHero from "@/components/SectionHero";
import ServiceProcessSection from "@/components/servicePagesComponents/ServiceProcessSection";
import ServiceDistinguishingSection from "@/components/servicePagesComponents/ServiceDistinguishingSection";
import ServiceRoleSection from "@/components/servicePagesComponents/ServiceRoleSelection";
import TargetAudience from "@/components/servicePagesComponents/TargetAudience";
import {
	getAllServices,
	getServiceBySlug,
	getServiceImages,
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

export async function generateStaticParams() {
	const services = await getAllServices();
	return services.map((service) => ({ slug: service.slug }));
}

async function Page({ params }: { params: { slug: string } }) {
	const { slug } = await params;
	const service = await getServiceBySlug(slug);
	const { id, meta, title } = service;
	const images = await mapImagesWithWordPressAlt(getServiceImages(service));
	return (
		<>
			<SectionHero
				subTitle={meta.hero_subheadline}
				title={meta.hero_h1}
				description={meta.hero_intro}
			></SectionHero>
			<TargetAudience
				title={meta.dla_kogo_h2}
				subtitle={meta.dla_kogo_subheadline}
				targetAudienceDsc={meta.dla_kogo}
				image={images[1]}
			/>
			<ServiceRoleSection
				title={meta.rola_uslugi_h2}
				subtitle={meta.rola_uslugi_subheadline}
				roleItems={meta.rola_uslugi}
				images={[
					images[2] || images[0], // Trzeci obraz lub fallback
					images[3] || images[1], // Czwarty obraz lub fallback
				]}
			/>
			<ServiceBenefitsSection
				title={meta.korzysci_h2}
				subtitle={meta.korzysci_subheadline}
				benefits={meta.korzysci}
				image={images[4] || images[0]}
			/>
			<ServiceDistinguishingSection
				title={meta.wyroznienie_h2}
				subtitle={meta.wyroznienie_subheadline}
				distinguishingItems={meta.wyroznienie}
				bgVariant="dark"
			/>
			<ServiceProcessSection
				title={meta.proces_h2}
				subtitle={meta.proces_subheadline}
				processSteps={meta.proces}
			/>
			<ServiceDistinguishingSection
				title={meta.specjalizacja_h2}
				subtitle={meta.specjalizacja_subheadline}
				distinguishingItems={meta.specjalizacja_1}
				bgVariant="light"
			/>
			<ServiceWhyMeSection
				title={meta.dlaczego_ja_h2}
				subtitle={meta.dlaczego_ja_subheadline}
				whyMeItems={meta.dlaczego_ja}
				image={images[5] || images[0]}
			/>
			<ServiceCta
				title={meta.cta_h2}
				subtitle={meta.cta_subheadline}
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
}

export default Page;
