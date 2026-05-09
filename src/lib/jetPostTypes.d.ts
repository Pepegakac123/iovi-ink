// Base content section interface - used in multiple meta fields
/**
 * Typ dla surowych danych z API (przed transformacją) - STARY SYSTEM
 */
export interface RawUslugiMeta {
  type: string;
  name: string;
  seo_title: string;
  seo_description: string;
  seo_keyword: string;
  hero_subheadline: string;
  hero_h1: string;
  hero_intro: string;

  // Sekcje jako obiekty z kluczami 'item-0', 'item-1', etc.
  dla_kogo_subheadline: string;
  dla_kogo_h2: string;
  dla_kogo: Record<string, { h3: string; content: string }>;

  rola_uslugi_subheadline: string;
  rola_uslugi_h2: string;
  rola_uslugi: Record<string, { h3: string; content: string }>;

  korzysci_subheadline: string;
  korzysci_h2: string;
  korzysci: Record<string, { h3: string; description: string; ikona: string }>;

  punkt_wyrozniajacy_subheadline?: string; // może być wyroznienie_subheadline
  punkt_wyrozniajacy_h2?: string;
  wyroznienie_subheadline?: string;
  wyroznienie_h2?: string;
  wyroznienie: Record<string, { h3: string; content: string }>;

  specjalizacja_subheadline: string;
  specjalizacja_h2: string;
  specjalizacja: Record<string, { h3: string; content: string }>;

  proces_subheadline: string;
  proces_h2: string;
  proces: Record<
    string,
    { number: string; title: string; description: string }
  >;

  dlaczego_ja_subheadline: string;
  dlaczego_ja_h2: string;
  dlaczego_ja: Record<string, { h3: string; content: string }>;

  cta_subheadline: string;
  cta_h2: string;
  cta: Record<string, { h3: string; content: string }>;

  // Obrazy pozostają bez zmian
  image_1: string;
  image_2: string;
  image_3: string;
  image_4: string;
  image_5: string;
  image_6: string;
}

/**
 * Nowy System - Surowe dane z API (Płaska struktura)
 */
export interface RawNewUslugiMeta {
  // SEO (RankMath fields if present, else fallback)
  rank_math_title?: string;
  rank_math_description?: string;
  rank_math_focus_keyword?: string;

  // Pola podstawowe
  usluga: string;
  miasto: string;
  seo_line: string;
  seo_description: string;

  // Sekcja 1 (Hero)
  "1_naglowek": string;
  "1_akapit_1": string;

  // Sekcja 2 (Dla kogo)
  "2_naglowek": string;
  "2_tytul_akapitu_1": string;
  "2_akapit_1": string;
  "2_tytul_akapitu_2": string;
  "2_akapit_2": string;
  "2_tytul_akapitu_3": string;
  "2_akapit_3": string;

  // Sekcja 3 (Zakres / Rola)
  "3_naglowek": string;
  "3_tytul_akapitu_1": string;
  "3_akapit_1": string;
  "3_tytul_akapitu_2": string;
  "3_akapit_2": string;

  // Sekcja 4 (Zalety - Repeater)
  "4_naglowek": string;
  "4_repeater": Array<{ title: string; icon: string; akapit: string }>;

  // Sekcja 5 (Problemy / Wyróżnienie)
  "5_naglowek": string;
  "5_tytul_akapitu_1": string;
  "5_akapit_1": string;
  "5_tytul_akapitu_2": string;
  "5_akapit_2": string;

  // Sekcja 6 (Etapy - Repeater)
  "6_naglowek": string;
  "6_repeater": Array<{ title: string; number: string | number; akapit: string }>;

  // Sekcja 7 (Efekty / Specjalizacja)
  "7_naglowek": string;
  "7_tytul_akapitu_1": string;
  "7_akapit_1": string;
  "7_tytul_akapitu_2": string;
  "7_akapit_2": string;

  // Sekcja 8 (Doświadczenie / Dlaczego ja)
  "8_naglowek": string;
  "8_tytul_akapitu_1": string;
  "8_akapit_1": string;
  "8_tytul_akapitu_2": string;
  "8_akapit_2": string;
  "8_tytul_akapitu_3": string;
  "8_akapit_3": string;

  // Sekcja 9 (CTA)
  "9_naglowek": string;
  "9_tytul_akapitu_1": string;
  "9_akapit_1": string;
  "9_tytul_akapitu_2": string;
  "9_akapit_2": string;

  // Zdjęcia (Max 5)
  "1_zdjecie": string;
  "2_zdjecie": string;
  "3_zdjecie": string;
  "4_zdjecie": string;
  "5_zdjecie": string;
}

/**
 * Nowy System - Surowe dane dla Keyword Homepage (tatuazysta-home, tatuaze-home)
 */
export interface RawNewKeywordHomeMeta {
  rank_math_title?: string;
  rank_math_description?: string;
  rank_math_focus_keyword?: string;

  "1_akapit": string;
  "2_akapit": string;
  "3_akapit": string;
  "4_akapit": string;
}

/**
 * Surowa odpowiedź z API (przed transformacją)
 */
export type RawJetEngineResponse<T> = {
  id: number;
  slug: string;
  type: string;
  title: RenderedTitle;
  meta: T;
  attributes?: number;
};

export type RawJetEngineUsluga = RawJetEngineResponse<RawUslugiMeta | RawNewUslugiMeta>;
export type RawJetEngineKeywordHome = RawJetEngineResponse<RawNewKeywordHomeMeta>;

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
  attributes?: number;
}

// API Response type (array of services)
export type JetEngineUslugiResponse = JetEngineUsluga[];

// Utility types for easier access to common meta fields
export type ServiceType = UslugiMeta["type"]; // "tatuaze" | "3d" etc.
export type ServiceImages = Pick<
  UslugiMeta,
  "image_1" | "image_2" | "image_3" | "image_4" | "image_5" | "image_6"
>;

// Helper type for content sections (most common structure)
export type ServiceContentSections =
  | "dla_kogo"
  | "rola_uslugi"
  | "wyroznienie"
  | "specjalizacja_1"
  | "dlaczego_ja"
  | "cta";

export type TattooTypes =
  | "damskie"
  | "minimalistyczne"
  | "kwiatowe"
  | "graficzne";

export interface Carousel {
  meta: {
    zdjecia: string[];
  };
}
export interface TattooPortfolio {
  slug: string;
  title: RenderedTitle;
  meta: {
    zdjecia: string[];
    tattoo_type: TattooTypes;
  };
}

export interface GroupedTattooImages {
  allImages: Array<{ src: string; alt: string }>;
  damskie: Array<{ src: string; alt: string }>;
  minimalistyczne: Array<{ src: string; alt: string }>;
  kwiatowe: Array<{ src: string; alt: string }>;
  graficzne: Array<{ src: string; alt: string }>;
}
export interface TattooImageWithAlt {
  src: string;
  alt: string;
}

interface BlogFAQItem {
  pytanie: string;
  odpowiedz: string;
}

// Interfejs dla sekcji FAQ (obiekt z kluczami item-0, item-1, etc.)
interface BlogFAQSection {
  [key: string]: BlogFAQItem; // klucze jak "item-0", "item-1"
}

// Interfejs dla metadanych bloga
interface BlogMeta {
  data_bloga: string;
  wstep: string;
  miniaturka_bloga: string;
  tekst_glowny: string;
  blog_faq: BlogFAQSection; // zmienione z 'korzysci' na 'blog_faq'
  seo_title: string;
  seo_description: string;
  keyword_1: string;
  keyword_2: string;
  keyword_3: string;
  keyword_4: string;
  original_title: string;
}

// Interfejs dla tytułu bloga
interface BlogTitle {
  rendered: string;
  raw?: string;
}

// Główny interfejs dla pojedynczego posta z WordPress API
interface WordPressBlogPost {
  slug: string;
  title: BlogTitle;
  meta: BlogMeta;
}

// Typ dla odpowiedzi z WordPress API (tablica postów)
type WordPressBlogResponse = WordPressBlogPost[];

// Interfejs dla przetworzonego bloga z FAQ jako tablicą
interface ProcessedBlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  thumbnail: string;
  content: string;
  faq: BlogFAQItem[];
  seo_title: string;
  seo_description: string;
  keywords: string[];
}

export type JetHomepage = {
  slug: string;
  title: {
    rendered: string;
  };
  meta: {
    seo_title: string;
    seo_description: string;
    seo_keyword: string;
    hero_subtitle: string;
    hero_title: string;
    hero_description: string;
    about_me_title: string;
    about_me_subheadline: string;
    about_me_description_1: string;
    about_me_description_2: string;
    about_me_description_3: string;
    services_title: string;
    services_subheadline: string;
    services_description: string;
    target_audience_title: string;
    target_audience_item_1_title: string;
    target_audience_item_1_description: string;
    target_audience_item_2_title: string;
    target_audience_item_2_description: string;
    target_audience_item_3_title: string;
    target_audience_item_3_description: string;
    blog_title: string;
    blog_subheadline: string;
    blog_description: string;
    contact_subheadline: string;
    contact_title: string;
    contact_description: string;
  };
};
export interface JetHomepageProps {
  params: Promise<{
    slug: string;
  }>;
}

export interface JetEngineZagojone {
  slug: string;
  title: RenderedTitle;
  meta: {
    swiezy: string;
    zagojony: string;
    nazwa?: string;
  };
}

export type OpiniePlatform = "facebook" | "google" | "instagram";

export interface JetEngineOpinie {
  id: number;
  slug: string;
  title: RenderedTitle;
  meta: {
    gwiazdki: string;
    opis: string;
    miniaturka: string;
    z_jakiej_platformy: OpiniePlatform;
  };
}
