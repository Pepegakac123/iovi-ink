export const dynamicParams = false;

import SectionHero from "@/components/SectionHero";
import TargetAudienceSection from "@/components/Sections/TargetAudienceSection";
import {
	getAllServices,
	getServiceBySlug,
	getServiceImages,
	mapImagesWithWordPressAlt,
} from "@/lib/jetApi";

export async function generateStaticParams() {
	const services = await getAllServices();
	return services.map((service) => ({ slug: service.slug }));
}

async function Page({ params }: { params: { slug: string } }) {
	const { slug } = await params;
	const service = await getServiceBySlug(slug);
	const { id, meta, title } = service;
	const images = await mapImagesWithWordPressAlt(getServiceImages(service));
	console.log(images);
	return (
		<>
			<SectionHero
				subTitle={meta.hero_subheadline}
				title={meta.hero_h1}
				description={meta.hero_intro}
			></SectionHero>
		</>
	);
}

export default Page;
