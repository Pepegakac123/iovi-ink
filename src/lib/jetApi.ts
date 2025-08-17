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

  if (!response.ok) {
    throw new JETEngineAPIError(
      `JET Engine API request failed: ${response.statusText}`,
      response.status,
      url,
    );
  }

  return response.json();
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

export async function getImageCarouselBySlug(slug:"tatuaze" | "modele-3D"): Promise<Carousel>{
   const images = await jetEngineFetch<Carousel>(`/wp-json/wp/v2/karuzela`, {
    slug: slug,
    _fields: "meta"
  });

  return images;
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