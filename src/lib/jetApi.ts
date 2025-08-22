// src/lib/jetApi.ts - Przepisany z granularnym cache taggingiem
import { get } from "http";
import {
	Carousel,
	GroupedTattooImages,
	JetEngineUsluga,
	JetEngineUslugiResponse,
	TattooPortfolio,
	TattooTypes,
} from "./jetPostTypes";

// ================================================================
// SETUP & ERROR HANDLING
// ================================================================

const baseUrl = process.env.WORDPRESS_URL;

if (!baseUrl) {
	throw new Error("WORDPRESS_URL environment variable is not defined");
}

class JETEngineAPIError extends Error {
	constructor(
		message: string,
		public status: number,
		public endpoint: string,
	) {
		super(message);
		this.name = "JETEngineAPIError";
	}
}

const REVALIDATE_TIMES = {
	FEATURED_SERVICES: 1800, // 30 minut - często aktualizowane dla marektingu
	MAIN_SERVICES: 3600, // 1 godzina - ważne dla conversji

	// 📋 Standardowe content - średni cache
	ALL_SERVICES: 7200, // 2 godziny - kompletna lista zmienia się rzadko
	SERVICE_BY_SLUG: 10800, // 3 godziny - pojedyncze usługi rzadko edytowane
	SERVICE_BY_ID: 10800, // 3 godziny - jak wyżej

	// 📸 Portfolio/Media - długi cache (zmiany rzadkie ale istotne)
	PORTFOLIO_ALL: 21600, // 6 godzin - portfolio dodawane rzadko
	PORTFOLIO_BY_SLUG: 43200, // 12 godzin - konkretne portfolio bardzo stabilne
	CAROUSEL: 43200, // 12 godzin - karuzele ustawiane raz na długo

	// 🔧 Media/Alt text - bardzo długi cache
	MEDIA_SEARCH: 86400, // 24 godziny - alt texty się nie zmieniają
	IMAGE_WITH_ALT: 86400, // 24 godziny - jak wyżej
} as const;

// ================================================================
// CORE FETCH FUNCTION Z GRANULARNYM CACHE TAGGINGIEM
// ================================================================

async function jetEngineFetch<T>(
	path: string,
	query?: Record<string, any>,
	customTags?: string[],
	revalidateTime?: number, // ✅ Teraz opcjonalny - będzie auto-assigned
): Promise<T> {
	const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
	const url = `${baseUrl}${path}${queryString}`;

	// ✅ Buduj granularne tagi (jak wcześniej)
	const baseTags = ["jet-engine"];

	if (path.includes("/uslugi")) {
		baseTags.push("uslugi");
		if (query?.attributes === "6") baseTags.push("uslugi-featured");
		if (query?.attributes === "6,7") baseTags.push("uslugi-main");
		if (query?.slug) baseTags.push(`service-${query.slug}`);
	}

	if (path.includes("/karuzela")) {
		baseTags.push("carousel");
		if (query?.slug) baseTags.push(`carousel-${query.slug}`);
	}

	if (path.includes("/tatuaze-portfolio")) {
		baseTags.push("portfolio", "tattoo-portfolio");
		if (query?.slug) baseTags.push(`portfolio-${query.slug}`);
	}

	if (path.includes("/media")) {
		baseTags.push("media", "wordpress-media");
		if (query?.search) baseTags.push(`media-search-${query.search}`);
	}

	const finalTags = customTags ? [...baseTags, ...customTags] : baseTags;

	// ✅ Auto-assign revalidate time jeśli nie podano
	let finalRevalidateTime = revalidateTime;

	if (!finalRevalidateTime) {
		// Smart assignment na podstawie endpoint i query
		if (path.includes("/uslugi")) {
			if (query?.attributes === "6") {
				finalRevalidateTime = REVALIDATE_TIMES.FEATURED_SERVICES;
			} else if (query?.attributes === "6,7") {
				finalRevalidateTime = REVALIDATE_TIMES.MAIN_SERVICES;
			} else if (query?.slug) {
				finalRevalidateTime = REVALIDATE_TIMES.SERVICE_BY_SLUG;
			} else {
				finalRevalidateTime = REVALIDATE_TIMES.ALL_SERVICES;
			}
		} else if (path.includes("/karuzela")) {
			finalRevalidateTime = REVALIDATE_TIMES.CAROUSEL;
		} else if (path.includes("/tatuaze-portfolio")) {
			finalRevalidateTime = query?.slug
				? REVALIDATE_TIMES.PORTFOLIO_BY_SLUG
				: REVALIDATE_TIMES.PORTFOLIO_ALL;
		} else if (path.includes("/media")) {
			finalRevalidateTime = REVALIDATE_TIMES.MEDIA_SEARCH;
		} else {
			finalRevalidateTime = 3600; // Default 1h fallback
		}
	}

	const response = await fetch(url, {
		headers: {
			"User-Agent": "Next.js JET Engine Client",
		},
		next: {
			tags: finalTags,
			revalidate: finalRevalidateTime, // ✅ Smart time assignment
		},
	});

	if (!response.ok) {
		throw new JETEngineAPIError(
			`JET Engine API request failed: ${response.statusText}`,
			response.status,
			url,
		);
	}

	return response.json();
}

// ================================================================
// SERVICES API - Z GRANULARNYM TAGGINGIEM
// ================================================================

/**
 * Pobiera wszystkie usługi z podstawowymi polami
 * Cache tags: ["jet-engine", "uslugi", "uslugi-all", "uslugi-basic-fields"]
 */
export async function getAllServices(): Promise<JetEngineUslugiResponse> {
	return jetEngineFetch<JetEngineUslugiResponse>(
		"/wp-json/wp/v2/uslugi",
		{
			_fields: "id,slug,type,title,meta",
		},
		["uslugi-all"], // Specific tag dla wszystkich usług
	);
}

/**
 * Pobiera featured usługi (attributes: "6")
 * Cache tags: ["jet-engine", "uslugi", "uslugi-featured", "uslugi-basic-fields"]
 */
export async function getFeaturedServices(): Promise<JetEngineUslugiResponse> {
	return jetEngineFetch<JetEngineUslugiResponse>(
		"/wp-json/wp/v2/uslugi",
		{
			_fields: "id,slug,type,title,meta,attributes",
			attributes: "6",
		},
		["uslugi-featured"],
	);
}

/**
 * Pobiera main usługi (attributes: "6,7")
 * Cache tags: ["jet-engine", "uslugi", "uslugi-main", "uslugi-basic-fields"]
 */
export async function getMainServices(): Promise<JetEngineUslugiResponse> {
	return jetEngineFetch<JetEngineUslugiResponse>(
		"/wp-json/wp/v2/uslugi",
		{
			_fields: "id,slug,type,title,meta,attributes",
			attributes: "6,7",
		},
		["uslugi-main"],
	);
}

/**
 * Pobiera usługi z alt textami (wrapper dla main/featured)
 * Dziedziczy tagi z getFeaturedServices() lub getMainServices()
 */
export async function getServicesWithAltText(
	type: "main" | "featured",
): Promise<
	Array<JetEngineUsluga & { imageWithAlt: { src: string; alt: string } }>
> {
	const services =
		type === "main" ? await getMainServices() : await getFeaturedServices();

	// Pobierz alt text dla wszystkich obrazów równolegle
	const servicesWithAltText = await Promise.all(
		services.map(async (service) => {
			const imageWithAlt = await getImageWithAltText(service.meta.image_1);
			return {
				...service,
				imageWithAlt,
			};
		}),
	);

	return servicesWithAltText;
}

/**
 * Pobiera pojedynczą usługę po ID
 * Cache tags: ["jet-engine", "uslugi", "uslugi-basic-fields", "service-id-{id}"]
 */
export async function getServiceById(id: number): Promise<JetEngineUsluga> {
	return jetEngineFetch<JetEngineUsluga>(
		`/wp-json/wp/v2/uslugi/${id}`,
		{
			_fields: "id,slug,type,title,meta",
		},
		[`service-id-${id}`],
	);
}

/**
 * Pobiera pojedynczą usługę po slug
 * Cache tags: ["jet-engine", "uslugi", "service-{slug}", "uslugi-basic-fields"]
 */
export async function getServiceBySlug(slug: string): Promise<JetEngineUsluga> {
	const services = await jetEngineFetch<JetEngineUslugiResponse>(
		"/wp-json/wp/v2/uslugi",
		{
			slug: slug,
			_fields: "id,slug,type,title,meta",
		},
		[`service-${slug}`],
	);

	if (services.length === 0) {
		throw new JETEngineAPIError(
			`Service with slug "${slug}" not found`,
			404,
			`/wp-json/wp/v2/uslugi?slug=${slug}`,
		);
	}

	return services[0];
}

// ================================================================
// CAROUSEL & PORTFOLIO API
// ================================================================

/**
 * Pobiera karuzelę obrazów po slug
 * Cache tags: ["jet-engine", "carousel", "carousel-{slug}"]
 */
export async function getImageCarouselBySlug(
	slug: "tatuaze" | "modele-3D",
): Promise<Carousel> {
	const images = await jetEngineFetch<Carousel[]>(
		"/wp-json/wp/v2/karuzela",
		{
			slug: slug,
			_fields: "meta",
		},
		[`carousel-${slug}`],
	);

	if (!images || images.length === 0) {
		throw new JETEngineAPIError(
			`Carousel with slug "${slug}" not found`,
			404,
			`/wp-json/wp/v2/karuzela?slug=${slug}`,
		);
	}

	return images[0];
}

/**
 * Pobiera wszystkie obrazy tatuaży pogrupowane po typach
 * Cache tags: ["jet-engine", "portfolio", "tattoo-portfolio", "tattoo-all"]
 */
export async function getAllTattooImages(): Promise<GroupedTattooImages> {
	const portfolios = await jetEngineFetch<TattooPortfolio[]>(
		"/wp-json/wp/v2/tatuaze-portfolio",
		{
			_fields: "meta,slug,title",
		},
		["tattoo-all"],
	);

	const allImageUrls = portfolios.flatMap(
		(portfolio) => portfolio.meta.zdjecia,
	);

	const groupedUrls = {
		allImages: allImageUrls,
		damskie: [] as string[],
		minimalistyczne: [] as string[],
		kwiatowe: [] as string[],
		graficzne: [] as string[],
	};
	portfolios.forEach((portfolio) => {
		const type = portfolio.meta.tattoo_type;

		groupedUrls[type].push(...portfolio.meta.zdjecia);
	});

	// ✅ Krok 2: Pobierz alt texty dla każdej grupy równolegle
	const [
		allImagesWithAlt,
		kwiatoweWithAlt,
		minimalistyczneWithAlt,
		graficzneWithAlt,
		damskieWithAlt,
	] = await Promise.all([
		mapImagesWithWordPressAlt(groupedUrls.allImages),
		mapImagesWithWordPressAlt(groupedUrls.kwiatowe),
		mapImagesWithWordPressAlt(groupedUrls.minimalistyczne),
		mapImagesWithWordPressAlt(groupedUrls.graficzne),
		mapImagesWithWordPressAlt(groupedUrls.damskie),
	]);

	// ✅ Krok 3: Zwróć zgrupowane obrazy z alt textami
	const result: GroupedTattooImages = {
		allImages: allImagesWithAlt,
		damskie: damskieWithAlt,
		minimalistyczne: minimalistyczneWithAlt,
		kwiatowe: kwiatoweWithAlt,
		graficzne: graficzneWithAlt,
	};
	return result;
}

// Funkcja dla konkretnego typu z alt textami
export async function getTattooImagesByType(
	type: TattooTypes,
): Promise<Array<{ src: string; alt: string }>> {
	const allImages = await getAllTattooImages();
	return allImages[type];
}

/**
 * Pobiera obrazy tatuaży po slug
 * Cache tags: ["jet-engine", "portfolio", "tattoo-portfolio", "portfolio-{slug}"]
 */
export async function getTattooImagesBySlug(
	slug: string,
): Promise<Array<{ src: string; alt: string }>> {
	const portfolio = await jetEngineFetch<TattooPortfolio[]>(
		"/wp-json/wp/v2/tatuaze-portfolio",
		{
			slug: slug,
			_fields: "meta",
		},
		[`portfolio-${slug}`],
	);

	if (!portfolio || portfolio.length === 0) {
		throw new JETEngineAPIError(
			`Portfolio with slug "${slug}" not found`,
			404,
			`/wp-json/wp/v2/tatuaze-portfolio?slug=${slug}`,
		);
	}

	// ✅ Pobierz alt texty dla obrazów z tego portfolio
	const imageUrls = portfolio[0].meta.zdjecia;
	return mapImagesWithWordPressAlt(imageUrls);
}

// ================================================================
// MEDIA & ALT TEXT API
// ================================================================

/**
 * Pobiera alt text dla obrazu z WordPress Media API
 * Cache tags: ["jet-engine", "media", "wordpress-media", "media-search-{fileName}"]
 */
export async function getImageWithAltText(
	imageUrl: string,
): Promise<{ src: string; alt: string }> {
	try {
		// Wyciągnij ID attachmentu z URL (jeśli możliwe)
		const urlParts = imageUrl.split("/");
		const fileName = urlParts.pop()?.split(".")[0];

		if (!fileName) {
			return {
				src: imageUrl,
				alt: "Tatuaż",
			};
		}

		// Szukaj w media library po nazwie pliku
		const mediaResponse = await jetEngineFetch<any[]>(
			"/wp-json/wp/v2/media",
			{
				search: fileName,
				per_page: 1,
			},
			[`media-search-${fileName}`],
		);

		if (mediaResponse && mediaResponse.length > 0) {
			return {
				src: imageUrl,
				alt:
					mediaResponse[0].alt_text ||
					mediaResponse[0].title?.rendered ||
					`Tatuaż ${fileName}`,
			};
		}

		// Fallback do nazwy pliku
		return {
			src: imageUrl,
			alt: fileName?.replace(/-/g, " ") || "Tatuaż",
		};
	} catch (error) {
		console.warn("Failed to fetch alt text for:", imageUrl);
		return {
			src: imageUrl,
			alt: "Tatuaż",
		};
	}
}

/**
 * Mapuje tablicę URL obrazów do obiektów z alt text
 * Dziedziczy tagi z getImageWithAltText()
 */
export async function mapImagesWithWordPressAlt(
	imageUrls: string[],
): Promise<Array<{ src: string; alt: string }>> {
	const promises = imageUrls.map((url) => getImageWithAltText(url));
	return Promise.all(promises);
}

// ================================================================
// UTILITY FUNCTIONS (bez cache - pure functions)
// ================================================================

/**
 * Wyciąga tytuł usługi
 */
export function getServiceTitle(service: JetEngineUsluga): string {
	return service.title.rendered;
}

/**
 * Wyciąga wszystkie obrazy usługi (filtruje puste)
 */
export function getServiceImages(service: JetEngineUsluga): string[] {
	const { meta } = service;
	return [
		meta.image_1,
		meta.image_2,
		meta.image_3,
		meta.image_4,
		meta.image_5,
		meta.image_6,
	].filter(Boolean); // Remove empty strings
}

/**
 * Wyciąga SEO metadane usługi
 */
export function getServiceSEO(service: JetEngineUsluga) {
	const { meta } = service;
	return {
		title: meta.seo_title,
		description: meta.seo_description,
		keyword: meta.seo_keyword,
	};
}

// ================================================================
// CACHE REVALIDATION HELPERS
// ================================================================

/**
 * Helper function do revalidacji konkretnych tagów
 * Używaj w API routes lub server actions
 */
export const CACHE_TAGS = {
	// Wszystkie JET Engine dane
	ALL_JET_ENGINE: "jet-engine",

	// Usługi
	ALL_SERVICES: "uslugi",
	FEATURED_SERVICES: "uslugi-featured",
	MAIN_SERVICES: "uslugi-main",
	SERVICE_BY_SLUG: (slug: string) => `service-${slug}`,
	SERVICE_BY_ID: (id: number) => `service-id-${id}`,

	// Portfolio
	ALL_PORTFOLIO: "portfolio",
	TATTOO_PORTFOLIO: "tattoo-portfolio",
	PORTFOLIO_BY_SLUG: (slug: string) => `portfolio-${slug}`,

	// Carousel
	ALL_CAROUSEL: "carousel",
	CAROUSEL_BY_SLUG: (slug: string) => `carousel-${slug}`,

	// Media
	ALL_MEDIA: "media",
	MEDIA_SEARCH: (fileName: string) => `media-search-${fileName}`,
} as const;
