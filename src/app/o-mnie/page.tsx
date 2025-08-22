// src/app/o-mnie/page.tsx
import React from "react";
import SectionHero from "@/components/SectionHero";
import AboutMe from "@/components/Sections/AboutMe";
import { aboutMePersonal } from "@/lib/personalData";
import PersonalShowcase from "@/components/PerosnalShowcase";

// ===========================================
// ABOUT ME PAGE COMPONENT
// ===========================================

const AboutMePage: React.FC = () => {
	return (
		<>
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
