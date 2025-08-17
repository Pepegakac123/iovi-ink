
// Base content section interface - used in multiple meta fields
interface ContentSection {
  h3: string;
  content: string;
}

// Benefits section with additional fields
interface BenefitSection {
  h3: string;
  description: string;
  ikona: string;
}

// Process section with numbering
interface ProcessSection {
  number: string; // "1", "2", "3", "4"
  title: string;
  description: string;
}

// Title object structure
interface RenderedTitle {
  rendered: string;
}

// Meta object structure - all the JET Engine custom fields
interface UslugiMeta {
  type: string; // "tatuaze", "3d", etc.
  name: string; // Service display name
  seo_title: string;
  seo_description: string;
  seo_keyword: string;
  hero_subheadline: string;
  hero_h1: string;
  hero_intro: string;
  
  // Dla kogo section
  dla_kogo_subheadline: string;
  dla_kogo_h2: string;
  dla_kogo: ContentSection[]; // Target audience sections
  
  // Rola usługi section
  rola_uslugi_subheadline: string;
  rola_uslugi_h2: string;
  rola_uslugi: ContentSection[]; // Service role sections
  
  // Korzyści section
  korzysci_subheadline: string;
  korzysci_h2: string;
  korzysci: BenefitSection[]; // Benefits with icons
  
  // Wyróżnienie section
  wyroznienie_subheadline: string;
  wyroznienie_h2: string;
  wyroznienie: ContentSection[]; // Distinguishing features
  
  // Specjalizacja section
  specjalizacja_subheadline: string;
  specjalizacja_h2: string;
  specjalizacja_1: ContentSection[]; // Specialization sections
  
  // Proces section
  proces_subheadline: string;
  proces_h2: string;
  proces: ProcessSection[]; // Process steps with numbering
  
  // Dlaczego ja section
  dlaczego_ja_subheadline: string;
  dlaczego_ja_h2: string;
  dlaczego_ja: ContentSection[]; // Why me sections
  
  // CTA section
  cta_subheadline: string;
  cta_h2: string;
  cta: ContentSection[]; // Call to action sections
  
  // Images
  image_1: string; // Image URL
  image_2: string;
  image_3: string;
  image_4: string;
  image_5: string;
  image_6: string;
}

// Main service interface - only the fields you need
export interface JetEngineUsluga {
  id: number;
  slug: string;
  type: string; // Custom post type name ("uslugi")
  title: RenderedTitle;
  meta: UslugiMeta;
}

// API Response type (array of services)
export type JetEngineUslugiResponse = JetEngineUsluga[];

// Utility types for easier access to common meta fields
export type ServiceType = UslugiMeta['type']; // "tatuaze" | "3d" etc.
export type ServiceImages = Pick<UslugiMeta, 'image_1' | 'image_2' | 'image_3' | 'image_4' | 'image_5' | 'image_6'>;

// Helper type for content sections (most common structure)
export type ServiceContentSections = 
  | 'dla_kogo' 
  | 'rola_uslugi' 
  | 'wyroznienie' 
  | 'specjalizacja_1' 
  | 'dlaczego_ja' 
  | 'cta';


export type TattooTypes = "geometryczne" | "minimalistyczne";

export interface Carousel {
  meta: {
    zdjecia: string[];
  };
  
}
export interface TattooPortfolio{
  slug:string,
  title:RenderedTitle,
  meta: {
    zdjecia: string[];
    tattoo_type: TattooTypes
  };
}

export interface GroupedTattooImages {
  allImages: string[];
  geometryczne: string[];
  minimalistyczne: string[];
}