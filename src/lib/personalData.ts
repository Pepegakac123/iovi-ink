// src/lib/personalData.ts
import { ICONS } from "@/lib/icons";
import { images } from "@/lib/images";
import { socialLinks } from "@/lib/data";
import {
	AboutMeProps,
	ContactQuick,
	ExperienceItem,
	HobbyItem,
	SkillTag,
	SpecializationItem,
} from "@/lib/dataTypes";

// ===========================================
// PERSONAL ABOUT ME DATA
// ===========================================

export const aboutMePersonal: AboutMeProps = {
	title: "Pasja do precyzji i detalu",
	subheadline: "Moja droga w tatuażu",
	image: images.zblizenie_na_twarz_patrzy_na_wprost,
	description: [
		"Artystyczne wykształcenie to fundament, ale prawdziwa nauka zaczęła się w studio. Każdy dzień to nowe wyzwania i możliwość doskonalenia techniki.",
		"Nie tworzę kopii z Pinterest - każdy projekt to autorska interpretacja Twojego pomysłu. Wierzę, że tatuaż to współpraca między artystą a klientem.",
		"Studio Lewus Ink pozwala mi oferować najwyższą jakość w sterylnych, komfortowych warunkach. To miejsce, gdzie mogę skupić się na sztuce.",
	],
};

// ===========================================
// PERSONAL SHOWCASE DATA
// ===========================================

export const experienceData: ExperienceItem[] = [
	{
		id: 1,
		period: "Września 2023 - teraz",
		position: "TATUAŻYSTKA",
		company: "LEWUS INK",
		location: "Mszana Dolna",
		description:
			"Specjalizacja w tatuażach graficznych, minimalistycznych i fine line",
	},
	{
		id: 2,
		period: "Styczeń 2023 - Sierpień 2023",
		position: "PRAKTYKANTKA",
		company: "STUDIO NAUKI",
		location: "Kraków",
		description: "Nauka podstaw i obserwacja doświadczonych artystów",
	},
	{
		id: 3,
		period: "2021 - 2023",
		position: "EDUKACJA ARTYSTYCZNA",
		company: "PRYWATNE STUDIA",
		location: "Kraków",
		description: "Anatomia, kompozycja, teoria kolorów",
	},
];

export const specializationData: SpecializationItem[] = [
	{
		id: 1,
		period: "2023 - teraz",
		name: "FINE LINE TATTOOS",
		institution: "Specjalizacja główna",
		description:
			"Delikatne linie, precyzyjne detale, minimalistyczne podejście",
	},
	{
		id: 2,
		period: "2023 - teraz",
		name: "GEOMETRYCZNE WZORY",
		institution: "Specjalizacja dodatkowa",
		description: "Matematyczna precyzja, symetria, nowoczesne formy",
	},
	{
		id: 3,
		period: "2022 - 2023",
		name: "PODSTAWY TATUAŻU",
		institution: "Kurs certyfikowany",
		description: "Higiena, sterylizacja, techniki podstawowe, obsługa sprzętu",
	},
];

export const hobbiesData: HobbyItem[] = [
	{
		id: 1,
		name: "Sketching",
		icon: ICONS.paletteBrush,
	},
	{
		id: 2,
		name: "Fotografia",
		icon: ICONS.careForDetails,
	},
	{
		id: 3,
		name: "Gaming",
		icon: ICONS.tabletGraphic,
	},
];

export const skillsData: SkillTag[] = [
	// Style tatuażowe
	{ id: 1, name: "FINE LINE", category: "style" },
	{ id: 2, name: "MINIMALIZM", category: "style" },
	{ id: 3, name: "GEOMETRIA", category: "style" },
	{ id: 4, name: "BLACKWORK", category: "style" },

	// Techniki
	{ id: 5, name: "PRECYZYJNE LINIE", category: "technique" },
	{ id: 6, name: "CIENIOWANIE", category: "technique" },
	{ id: 7, name: "KOMPOZYCJA", category: "technique" },
	{ id: 8, name: "ANATOMIA", category: "technique" },

	// Software/narzędzia
	{ id: 9, name: "PROCREATE", category: "software" },
	{ id: 10, name: "PHOTOSHOP", category: "software" },
	{ id: 11, name: "TRADITIONAL ART", category: "software" },
];

export const quickContactData: ContactQuick[] = [
	{
		id: 1,
		type: "instagram",
		icon: ICONS.instagramAccent,
		value: "@iovi.ink",
		href: socialLinks.iovi.instagram,
	},
	{
		id: 2,
		type: "email",
		icon: ICONS.envelope,
		value: process.env.EMAIL_TO || "hello@iovi-ink.pl",
		href: `mailto:${process.env.EMAIL_TO || "hello@iovi-ink.pl"}`,
	},
];
