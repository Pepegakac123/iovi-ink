export const dynamicParams = false;

import { getAllServices, getServiceBySlug } from "@/lib/jetApi";

export async function generateStaticParams() {
	const services = await getAllServices();
	return services.map((service) => ({ slug: service.slug }));
}

async function Page({ params }: { params: { slug: string } }) {
	const { slug } = await params;

	// const service = await getServiceBySlug(slug);
	return <p>{slug}</p>;
}

export default Page;
