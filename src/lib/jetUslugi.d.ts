
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
  dla_kogo: ContentSection[]; // Target audience sections
  rola_uslugi: ContentSection[]; // Service role sections
  korzysci: BenefitSection[]; // Benefits with icons
  wyroznienie: ContentSection[]; // Distinguishing features
  specjalizacja_1: ContentSection[]; // Specialization sections
  proces: ProcessSection[]; // Process steps with numbering
  dlaczego_ja: ContentSection[]; // Why me sections
  cta: ContentSection[]; // Call to action sections
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

