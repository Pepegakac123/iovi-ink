import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
	JetEngineUsluga,
	RawJetEngineUsluga,
	UslugiMeta,
	RawNewUslugiMeta,
	RawNewKeywordHomeMeta,
	JetHomepage,
	RawJetEngineKeywordHome,
	RawUslugiMeta,
} from "./jetPostTypes";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatPhoneNumber = (value: string) => {
	// Usuń wszystko co nie jest cyfrą
	const numbers = value.replace(/\D/g, "");

	// Ogranicz do 9 cyfr
	const limited = numbers.slice(0, 9);

	// Formatuj z spacjami: XXX XXX XXX
	if (limited.length >= 7) {
		return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
	} else if (limited.length >= 4) {
		return `${limited.slice(0, 3)} ${limited.slice(3)}`;
	} else {
		return limited;
	}
};

export const formatDate = (dateString: string) => {
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString("pl-PL", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	} catch {
		return dateString;
	}
};

export function objectToSortedArray<T>(obj: Record<string, T>): T[] {
	if (!obj || typeof obj !== "object") {
		return [];
	}
	if (Array.isArray(obj)) {
		return obj;
	}
	return Object.keys(obj)
		.filter((key) => key.startsWith("item-"))
		.sort((a, b) => {
			const numA = parseInt(a.split("-")[1], 10);
			const numB = parseInt(b.split("-")[1], 10);
			return numA - numB;
		})
		.map((key) => obj[key])
		.filter(Boolean); // Usuń null/undefined
}
export function transformServiceData(
	rawData: RawJetEngineUsluga,
): JetEngineUsluga {
	const rawMeta = rawData.meta;

	// Funkcja pomocnicza do sprawdzania czy to nowy system
	const isNewSystem = "1_naglowek" in rawMeta;

	let transformedMeta: UslugiMeta;

	if (isNewSystem) {
		const newMeta = rawMeta as RawNewUslugiMeta;
		transformedMeta = {
			type: rawData.type, // Fallback do typu postu
			name: newMeta.usluga || rawData.title.rendered,
			seo_title:
				newMeta.rank_math_title || newMeta.usluga || rawData.title.rendered,
			seo_description: newMeta.rank_math_description || newMeta.seo_description,
			seo_keyword: newMeta.rank_math_focus_keyword || "",
			hero_subheadline: newMeta.seo_line || "",
			hero_h1: newMeta["1_naglowek"],
			hero_intro: newMeta["1_akapit_1"],

			// Sekcja 2 -> Dla kogo
			dla_kogo_subheadline: "",
			dla_kogo_h2: newMeta["2_naglowek"],
			dla_kogo: [
				{ h3: newMeta["2_tytul_akapitu_1"], content: newMeta["2_akapit_1"] },
				{ h3: newMeta["2_tytul_akapitu_2"], content: newMeta["2_akapit_2"] },
				{ h3: newMeta["2_tytul_akapitu_3"], content: newMeta["2_akapit_3"] },
			].filter((i) => i.h3 || i.content),

			// Sekcja 3 -> Rola usługi
			rola_uslugi_subheadline: "",
			rola_uslugi_h2: newMeta["3_naglowek"],
			rola_uslugi: [
				{ h3: newMeta["3_tytul_akapitu_1"], content: newMeta["3_akapit_1"] },
				{ h3: newMeta["3_tytul_akapitu_2"], content: newMeta["3_akapit_2"] },
			].filter((i) => i.h3 || i.content),

			// Sekcja 4 -> Korzyści (Zachowany repeater)
			korzysci_subheadline: "",
			korzysci_h2: newMeta["4_naglowek"],
			korzysci: (newMeta["4_repeater"] || []).map((item) => ({
				h3: item.title,
				description: item.akapit,
				ikona: item.icon,
			})),

			// Sekcja 5 -> Wyróżnienie
			wyroznienie_subheadline: "",
			wyroznienie_h2: newMeta["5_naglowek"],
			wyroznienie: [
				{ h3: newMeta["5_tytul_akapitu_1"], content: newMeta["5_akapit_1"] },
				{ h3: newMeta["5_tytul_akapitu_2"], content: newMeta["5_akapit_2"] },
			].filter((i) => i.h3 || i.content),

			// Sekcja 7 -> Specjalizacja
			specjalizacja_subheadline: "",
			specjalizacja_h2: newMeta["7_naglowek"],
			specjalizacja_1: [
				{ h3: newMeta["7_tytul_akapitu_1"], content: newMeta["7_akapit_1"] },
				{ h3: newMeta["7_tytul_akapitu_2"], content: newMeta["7_akapit_2"] },
			].filter((i) => i.h3 || i.content),

			// Sekcja 6 -> Proces (Zachowany repeater)
			proces_subheadline: "",
			proces_h2: newMeta["6_naglowek"],
			proces: (newMeta["6_repeater"] || []).map((item) => ({
				number: String(item.number),
				title: item.title,
				description: item.akapit,
			})),

			// Sekcja 8 -> Dlaczego ja
			dlaczego_ja_subheadline: "",
			dlaczego_ja_h2: newMeta["8_naglowek"],
			dlaczego_ja: [
				{ h3: newMeta["8_tytul_akapitu_1"], content: newMeta["8_akapit_1"] },
				{ h3: newMeta["8_tytul_akapitu_2"], content: newMeta["8_akapit_2"] },
				{ h3: newMeta["8_tytul_akapitu_3"], content: newMeta["8_akapit_3"] },
			].filter((i) => i.h3 || i.content),

			// Sekcja 9 -> CTA
			cta_subheadline: "",
			cta_h2: newMeta["9_naglowek"],
			cta: [
				{ h3: newMeta["9_tytul_akapitu_1"], content: newMeta["9_akapit_1"] },
				{ h3: newMeta["9_tytul_akapitu_2"], content: newMeta["9_akapit_2"] },
			].filter((i) => i.h3 || i.content),

			// Obrazy (Max 5 w nowym, 6 w starym)
			image_1: newMeta["1_zdjecie"],
			image_2: newMeta["2_zdjecie"],
			image_3: newMeta["3_zdjecie"],
			image_4: newMeta["4_zdjecie"],
			image_5: newMeta["5_zdjecie"],
			image_6: newMeta["1_zdjecie"], // Fallback dla 6. obrazka
		};
	} else {
		const oldMeta = rawMeta as RawUslugiMeta;
		// Przekształć wszystkie sekcje obiektowe na tablice (stary system)
		transformedMeta = {
			type: oldMeta.type,
			name: oldMeta.name,
			seo_title: oldMeta.seo_title,
			seo_description: oldMeta.seo_description,
			seo_keyword: oldMeta.seo_keyword,
			hero_subheadline: oldMeta.hero_subheadline,
			hero_h1: oldMeta.hero_h1,
			hero_intro: oldMeta.hero_intro,

			dla_kogo_subheadline: oldMeta.dla_kogo_subheadline,
			dla_kogo_h2: oldMeta.dla_kogo_h2,
			dla_kogo: objectToSortedArray(oldMeta.dla_kogo),

			rola_uslugi_subheadline: oldMeta.rola_uslugi_subheadline,
			rola_uslugi_h2: oldMeta.rola_uslugi_h2,
			rola_uslugi: objectToSortedArray(oldMeta.rola_uslugi),

			korzysci_subheadline: oldMeta.korzysci_subheadline,
			korzysci_h2: oldMeta.korzysci_h2,
			korzysci: objectToSortedArray(oldMeta.korzysci),

			wyroznienie_subheadline:
				oldMeta.wyroznienie_subheadline ||
				oldMeta.punkt_wyrozniajacy_subheadline ||
				"",
			wyroznienie_h2:
				oldMeta.wyroznienie_h2 || oldMeta.punkt_wyrozniajacy_h2 || "",
			wyroznienie: objectToSortedArray(oldMeta.wyroznienie),

			specjalizacja_subheadline: oldMeta.specjalizacja_subheadline,
			specjalizacja_h2: oldMeta.specjalizacja_h2,
			specjalizacja_1: objectToSortedArray(oldMeta.specjalizacja),

			proces_subheadline: oldMeta.proces_subheadline,
			proces_h2: oldMeta.proces_h2,
			proces: objectToSortedArray(oldMeta.proces),

			dlaczego_ja_subheadline: oldMeta.dlaczego_ja_subheadline,
			dlaczego_ja_h2: oldMeta.dlaczego_ja_h2,
			dlaczego_ja: objectToSortedArray(oldMeta.dlaczego_ja),

			cta_subheadline: oldMeta.cta_subheadline,
			cta_h2: oldMeta.cta_h2,
			cta: objectToSortedArray(oldMeta.cta),

			image_1: oldMeta.image_1,
			image_2: oldMeta.image_2,
			image_3: oldMeta.image_3,
			image_4: oldMeta.image_4,
			image_5: oldMeta.image_5,
			image_6: oldMeta.image_6,
		};
	}

	return {
		id: rawData.id,
		slug: rawData.slug,
		type: rawData.type,
		title: rawData.title,
		meta: transformedMeta,
		attributes: rawData.attributes,
	};
}

export function transformKeywordHomeData(
	rawData: RawJetEngineKeywordHome,
): JetHomepage {
	const rawMeta = rawData.meta;
	const isNewSystem = "1_akapit" in rawMeta;

	if (isNewSystem) {
		const newMeta = rawMeta as RawNewKeywordHomeMeta;
		return {
			slug: rawData.slug,
			title: rawData.title,
			meta: {
				seo_title: newMeta.rank_math_title || rawData.title.rendered,
				seo_description: newMeta.rank_math_description || "",
				seo_keyword: newMeta.rank_math_focus_keyword || "",
				hero_subtitle: "", // Nowy system nie ma tych pól, będą puste lub fallback z akapitów
				hero_title: rawData.title.rendered,
				hero_description: newMeta["1_akapit"],
				about_me_title: "O mnie",
				about_me_subheadline: "",
				about_me_description_1: newMeta["2_akapit"],
				about_me_description_2: "",
				about_me_description_3: "",
				services_title: "Moje Usługi",
				services_subheadline: "",
				services_description: newMeta["3_akapit"],
				target_audience_title: "Dla kogo pracuję",
				target_audience_item_1_title: "",
				target_audience_item_1_description: "",
				target_audience_item_2_title: "",
				target_audience_item_2_description: "",
				target_audience_item_3_title: "",
				target_audience_item_3_description: "",
				blog_title: "Blog",
				blog_subheadline: "",
				blog_description: "",
				contact_subheadline: "",
				contact_title: "Kontakt",
				contact_description: newMeta["4_akapit"],
			},
		};
	}

	// Jeśli to stary system, rzutujemy na JetHomepage (bo Raw interface dla starego home nie został dodany,
	// ale JetHomepage odpowiada 1:1 strukturze starego meta w API)
	return rawData as unknown as JetHomepage;
}
