// app/sitemap.ts
import { MetadataRoute } from "next";
import { getAllServices } from "@/lib/jetApi";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = "https://iovi-ink.pl";

	// Static pages - podstawowe strony
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1.0, // Najwyższy priorytet dla strony głównej
		},
		{
			url: `${baseUrl}/uslugi`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.9, // Bardzo wysoki priorytet dla usług
		},
		{
			url: `${baseUrl}/portfolio`,
			lastModified: new Date(),
			changeFrequency: "weekly", // Portfolio może się często aktualizować
			priority: 0.8,
		},
		{
			url: `${baseUrl}/kontakt`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/o-mnie`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.6,
		},
		{
			url: `${baseUrl}/polityka-prywatnosci`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];

	try {
		// Dynamic pages - pobierz wszystkie usługi z CMS
		const services = await getAllServices();

		const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
			url: `${baseUrl}/uslugi/${service.slug}`,
			lastModified: new Date(), // Można dodać pole z CMS jeśli masz
			changeFrequency: "monthly" as const,
			priority: 0.8, // Wysokie priority dla stron usług - to główne landing pages
		}));

		// Combine static + dynamic pages
		return [...staticPages, ...servicePages];
	} catch (error) {
		console.error("Error generating sitemap:", error);

		// Fallback - tylko statyczne strony jeśli API nie działa
		return staticPages;
	}
}
