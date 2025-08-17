import { Carousel, GroupedTattooImages, JetEngineUsluga, JetEngineUslugiResponse, TattooPortfolio } from "./jetPostTypes";

// API Functions for JET Engine Services
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

async function jetEngineFetch<T>(
  path: string,
  query?: Record<string, any>,
): Promise<T> {
  const queryString = query 
    ? `?${new URLSearchParams(query).toString()}` 
    : "";
  const url = `${baseUrl}${path}${queryString}`;
  
  // console.log("🔍 Fetching URL:", url); // DODANE DEBUGOWANIE
  // console.log("🔍 Query params:", query); // DODANE DEBUGOWANIE
  
  const userAgent = "Next.js JET Engine Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
    next: {
      tags: ["jet-engine", "uslugi"],
      revalidate: 3600, // 1 hour cache
    },
  });

  // console.log("🔍 Response status:", response.status); // DODANE DEBUGOWANIE
  // console.log("🔍 Response OK:", response.ok); // DODANE DEBUGOWANIE

  if (!response.ok) {
    throw new JETEngineAPIError(
      `JET Engine API request failed: ${response.statusText}`,
      response.status,
      url,
    );
  }

  const data = await response.json();
  // console.log("🔍 Response data:", data); // DODANE DEBUGOWANIE
  return data;
}

// Get all services with limited fields
export async function getAllServices(): Promise<JetEngineUslugiResponse> {
  return jetEngineFetch<JetEngineUslugiResponse>("/wp-json/wp/v2/uslugi", {
    _fields: "id,slug,type,title,meta"
  });
}

// Get single service by ID with limited fields
export async function getServiceById(id: number): Promise<JetEngineUsluga> {
  return jetEngineFetch<JetEngineUsluga>(`/wp-json/wp/v2/uslugi/${id}`, {
    _fields: "id,slug,type,title,meta"
  });
}

// Optional: Get service by slug (might be useful)
export async function getServiceBySlug(slug: string): Promise<JetEngineUsluga> {
  const services = await jetEngineFetch<JetEngineUslugiResponse>("/wp-json/wp/v2/uslugi", {
    slug: slug,
    _fields: "id,slug,type,title,meta"
  });
  
  if (services.length === 0) {
    throw new JETEngineAPIError(`Service with slug "${slug}" not found`, 404, `/wp-json/wp/v2/uslugi?slug=${slug}`);
  }
  
  return services[0];
}



// Utility functions
export function getServiceTitle(service: JetEngineUsluga): string {
  return service.title.rendered;
}

export function getServiceImages(service: JetEngineUsluga): string[] {
  const { meta } = service;
  return [
    meta.image_1,
    meta.image_2,
    meta.image_3,
    meta.image_4,
    meta.image_5,
    meta.image_6
  ].filter(Boolean); // Remove empty strings
}

export function getServiceSEO(service: JetEngineUsluga) {
  const { meta } = service;
  return {
    title: meta.seo_title,
    description: meta.seo_description,
    keyword: meta.seo_keyword
  };
}

export async function getImageCarouselBySlug(slug: "tatuaze" | "modele-3D"): Promise<Carousel> {
  const images = await jetEngineFetch<Carousel[]>(`wp-json/wp/v2/karuzela`, {
    slug: slug,
    _fields: "meta"
  });

  // Dodaj sprawdzenie czy tablica nie jest pusta
  if (!images || images.length === 0) {
    throw new JETEngineAPIError(`Carousel with slug "${slug}" not found`, 404, `/wp-json/wp/v2/karuzela?slug=${slug}`);
  }

  return images[0]; // Zwróć pierwszy element tablicy
}

export async function getAllTattooImages(): Promise<GroupedTattooImages> {
  const portfolios = await jetEngineFetch<TattooPortfolio[]>(`/wp-json/wp/v2/tatuaze-portfolio`, {
    _fields: "meta,slug,title"
  });

  const allImages = portfolios.flatMap(portfolio => portfolio.meta.zdjecia);
  
  const result: GroupedTattooImages = {
    allImages,
    geometryczne: [],
    minimalistyczne: []
  };

  portfolios.forEach(portfolio => {
    const type = portfolio.meta.tattoo_type;
    result[type].push(...portfolio.meta.zdjecia);
  });

  return result;
}

export async function getTattooImagesBySlug(slug: string): Promise<string[]> {
  const portfolio = await jetEngineFetch<TattooPortfolio[]>(`/wp-json/wp/v2/tatuaze-portfolio`, {
    slug: slug,
    _fields: "meta"
  });

  return portfolio[0].meta.zdjecia;
}

// Funkcja do pobierania alt text z WordPress Media API
export async function getImageWithAltText(imageUrl: string): Promise<{src: string, alt: string}> {
  try {
    // Wyciągnij ID attachmentu z URL (jeśli możliwe)
    const urlParts = imageUrl.split('/');
    const fileName = urlParts.pop()?.split('.')[0];
    
    // Szukaj w media library po nazwie pliku
    const mediaResponse = await jetEngineFetch<any[]>('/wp-json/wp/v2/media', {
      search: fileName,
      per_page: 1
    });
    
    if (mediaResponse && mediaResponse.length > 0) {
      return {
        src: imageUrl,
        alt: mediaResponse[0].alt_text || mediaResponse[0].title?.rendered || `Tatuaż ${fileName}`
      };
    }
    
    // Fallback do nazwy pliku
    return {
      src: imageUrl,
      alt: fileName?.replace(/-/g, ' ') || 'Tatuaż'
    };
  } catch (error) {
    console.warn('Failed to fetch alt text for:', imageUrl);
    return {
      src: imageUrl,
      alt: 'Tatuaż'
    };
  }
}

// Funkcja do mapowania wszystkich obrazów z alt text
export async function mapImagesWithWordPressAlt(imageUrls: string[]): Promise<Array<{src: string, alt: string}>> {
  const promises = imageUrls.map(url => getImageWithAltText(url));
  return Promise.all(promises);
}