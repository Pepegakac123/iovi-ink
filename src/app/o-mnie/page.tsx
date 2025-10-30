// src/app/o-mnie/page.tsx
import React from "react";
import SectionHero from "@/components/SectionHero";
import AboutMe from "@/components/Sections/AboutMe";
import { aboutMePersonal } from "@/lib/personalData";
import PersonalShowcase from "@/components/PerosnalShowcase";
import { Metadata } from "next";
import { images } from "@/lib/images";
import { BreadcrumbJsonLd } from "next-seo";
import { socialLinks } from "@/lib/data";
import { JsonLd } from "next-seo/lib/jsonld/jsonld";

export const metadata: Metadata = {
	title: "O mnie",
	description:
		"Jowita - tatuażystka z doświadczeniem w tatuażach graficznych i minimalistycznych. Poznaj mnie bliżej",

	openGraph: {
		title: "O mnie - Jowita | Artystka Tatuażu Fine Line & Minimalizm",
		description:
			"Poznaj Jowitę - artystkę tatuażu specjalizującą się w precyzyjnych wzorach fine line. Moja droga, doświadczenie i pasja.",
		url: "https://iovi-ink.pl/o-mnie",
		images: [
			{
				url: `${images.seoBaner.src}`,
				width: 1200,
				height: 630,
				alt: `${images.seoBaner.alt}`,
			},
		],
		type: "profile",
	},

	alternates: {
		canonical: "https://iovi-ink.pl/o-mnie",
	},

	// Keywords dla strony o mnie
	keywords: [
		"o mnie tatuażystka",
		"jowita artystka tatuażu",
		"fine line artystka",
		"minimalistyczne tatuaże artystka",
		"doświadczenie tatuażystka",
		"lewus ink tatuażystka",
		"historia artystki tatuażu",
	],

	// Dodatkowe schema.org metadata dla profilu
	other: {
		"profile:first_name": "Jowita",
		"profile:username": "iovi.ink",
		"article:author": "Jowita - iovi-ink",
	},
};
// ===========================================
// ABOUT ME PAGE COMPONENT
// ===========================================

const AboutMePage: React.FC = () => {
	return (
		<>
			<BreadcrumbJsonLd
				useAppDir={true}
				itemListElements={[
					{
						position: 1,
						name: "Strona główna",
						item: "https://iovi-ink.pl",
					},
					{
						position: 2,
						name: "O mnie",
						item: "https://iovi-ink.pl/o-mnie",
					},
				]}
			></BreadcrumbJsonLd>
			<JsonLd
				useAppDir={true}
				// 👇 TO JEST KLUCZOWA POPRAWKA, KTÓREJ ZABRAKŁO
				scriptKey="person-schema"
				json={{
					"@context": "https://schema.org",
					"@type": "Person",
					name: "Jowita Potaczek",
					jobTitle: "Tatuażysta",
					url: "https://www.iovi-ink.pl",
					sameAs: [
						socialLinks.iovi.instagram, // Zakładając, że masz 'socialLinks' zaimportowane
					],
					worksFor: {
						"@type": "Organization",
						name: "Lewus Lewus INK Tattoo&Piercing Mszana Dolna",
						address: {
							"@type": "PostalAddress",
							streetAddress: "Piłsudskiego 8, 34-730",
							addressLocality: "Mszana Dolna",
						},
					},
				}}
			/>
			{/* Hero Section */}
			<SectionHero
				subTitle="Poznaj mnie bliżej"
				title="Kim jestem i czym się kieruję"
				description="Więcej niż tylko tatuażystka - zobacz moją drogę, pasje i to, co sprawia, że każdy projekt traktuję jako wyzwanie artystyczne."
			/>

			{/* AboutMe Section - bardziej personalna wersja */}
			<section className="py-16 md:py-20">
				<AboutMe {...aboutMePersonal} />
			</section>

			{/* Personal Showcase - nowy komponent inspirowany zdjęciem */}
			<section className="bg-primary-foreground py-16 md:py-20">
				<PersonalShowcase />
			</section>
		</>
	);
};

export default AboutMePage;
