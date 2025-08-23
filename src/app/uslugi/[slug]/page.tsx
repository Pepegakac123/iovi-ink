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
				image={images[3] || images[0]}
			/>
			<ServiceDistinguishingSection
				title={meta.wyroznienie_h2}
				subtitle={meta.wyroznienie_subheadline}
				distinguishingItems={meta.wyroznienie}
			/>
		</>
	);
}

export default Page;
